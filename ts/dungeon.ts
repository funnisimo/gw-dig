import * as GWU from 'gw-utils';
import * as GWM from 'gw-map';
import * as LEVEL from './digger';

import * as TYPES from './types';
import * as ROOM from './room';
// import * as HALL from './hall';
// import * as LOOP from './loop';
// import * as LAKE from './lake';
// import * as BRIDGE from './bridge';
import * as STAIRS from './stairs';
import * as DIG from './digger';
import { RoomOptions } from '.';

export interface DungeonOptions extends DIG.DiggerOptions {
    // seed?: number;
    levels: number;
    goesUp?: boolean;

    width: number;
    height: number;

    entrance?: string | string[] | Record<string, number> | ROOM.RoomDigger;

    startLoc?: GWU.xy.Loc;
    startTile?: GWM.tile.TileBase;
    stairDistance?: number;

    endLoc?: GWU.xy.Loc;
    endTile?: GWM.tile.TileBase;

    // rooms?: {
    //     count?: number;
    //     digger?: string | ROOM.RoomDigger;
    //     entrance?: string | ROOM.RoomDigger;
    //     first?: string | ROOM.RoomDigger;
    // };

    // halls?: Partial<HALL.HallOptions>;
    // loops?: Partial<LOOP.LoopOptions>;
    // lakes?: Partial<LAKE.LakeOpts>;
    // bridges?: Partial<BRIDGE.BridgeOpts>;
    // stairs?: Partial<STAIRS.StairOpts>;

    // boundary?: boolean;
}

export type LocPair = [GWU.xy.Loc, GWU.xy.Loc];

export class Dungeon {
    public config: DungeonOptions = {
        levels: 1,
        width: 80,
        height: 34,
        rooms: { fails: 20 },
        // rooms: { count: 20, digger: 'DEFAULT' },
        // halls: {},
        // loops: {},
        // lakes: {},
        // bridges: {},
        // stairs: {},

        boundary: true,
    };
    public seeds: number[] = [];
    public stairLocs: LocPair[] = [];

    constructor(options: Partial<DungeonOptions> = {}) {
        GWU.object.setOptions(this.config, options);

        if (this.config.seed) {
            GWU.rng.random.seed(this.config.seed);
        }

        if (typeof this.config.stairs === 'boolean' || !this.config.stairs) {
            this.config.stairs = {};
        }
        if (!this.config.rooms) {
            this.config.rooms = {};
        } else if (typeof this.config.rooms === 'number') {
            this.config.rooms = { count: this.config.rooms };
        }

        this._initSeeds();
        this._initStairLocs();
    }

    get length() {
        return this.config.levels;
    }

    _initSeeds() {
        for (let i = 0; i < this.config.levels; ++i) {
            this.seeds[i] = GWU.rng.random.number(2 ** 32);
        }
    }

    _initStairLocs() {
        let startLoc: GWU.xy.Loc = this.config.startLoc || [
            Math.floor(this.config.width / 2),
            this.config.height - 2,
        ];

        const minDistance =
            this.config.stairDistance ||
            Math.floor(Math.max(this.config.width / 2, this.config.height / 2));

        let needUpdate = false;
        for (let i = 0; i < this.config.levels; ++i) {
            let endLoc: GWU.xy.Loc;

            if (
                this.stairLocs[i] &&
                this.stairLocs[i][1] &&
                this.stairLocs[i][1][0] > 0
            ) {
                endLoc = this.stairLocs[i][1];
                needUpdate =
                    GWU.xy.distanceBetween(
                        startLoc[0],
                        startLoc[1],
                        endLoc[0],
                        endLoc[1]
                    ) < minDistance;
            } else {
                endLoc = GWU.rng.random.matchingLoc(
                    this.config.width,
                    this.config.height,
                    (x, y) => {
                        return (
                            GWU.xy.distanceBetween(
                                startLoc[0],
                                startLoc[1],
                                x,
                                y
                            ) > minDistance
                        );
                    }
                );
            }

            this.stairLocs[i] = [
                [startLoc[0], startLoc[1]],
                [endLoc[0], endLoc[1]],
            ];
            startLoc = endLoc;
        }

        if (needUpdate) {
            // loop does not go all the way to level 0
            for (let i = this.config.levels - 1; i > 0; --i) {
                let [startLoc, endLoc] = this.stairLocs[i];

                if (
                    GWU.xy.distanceBetween(
                        startLoc[0],
                        startLoc[1],
                        endLoc[0],
                        endLoc[1]
                    ) > minDistance
                ) {
                    break;
                }

                startLoc = GWU.rng.random.matchingLoc(
                    this.config.width,
                    this.config.height,
                    (x, y) => {
                        return (
                            GWU.xy.distanceBetween(endLoc[0], endLoc[1], x, y) >
                            minDistance
                        );
                    }
                );

                this.stairLocs[i][0] = startLoc;
                this.stairLocs[i - 1][1] = startLoc;
            }
        }
    }

    getLevel(id: number, cb: TYPES.DigFn | GWM.map.Map) {
        if (id < 0 || id > this.config.levels)
            throw new Error('Invalid level id: ' + id);

        // Generate the level
        const [startLoc, endLoc] = this.stairLocs[id];

        const stairOpts = Object.assign(
            {},
            this.config.stairs as Partial<STAIRS.StairOpts>
        );
        if (this.config.goesUp) {
            stairOpts.down = startLoc;
            stairOpts.up = endLoc;
            if (id == 0 && this.config.startTile) {
                stairOpts.downTile = this.config.startTile;
            }
            if (id == this.config.levels - 1 && this.config.endTile) {
                stairOpts.upTile = this.config.endTile;
            }
        } else {
            stairOpts.down = endLoc;
            stairOpts.up = startLoc;
            if (id == 0 && this.config.startTile) {
                stairOpts.upTile = this.config.startTile;
            }
            if (id == this.config.levels - 1 && this.config.endTile) {
                stairOpts.downTile = this.config.endTile;
            }
        }

        const rooms = Object.assign(
            {},
            this.config.rooms as Partial<RoomOptions>
        );
        if (id === 0 && this.config.entrance) {
            rooms.first = this.config.entrance;
        }

        let width = this.config.width,
            height = this.config.height;
        if (cb instanceof GWM.map.Map) {
            width = cb.width;
            height = cb.height;
        }

        const levelOpts = {
            seed: this.seeds[id],
            loops: this.config.loops,
            lakes: this.config.lakes,
            bridges: this.config.bridges,

            rooms: rooms,

            stairs: stairOpts,
            boundary: this.config.boundary,

            goesUp: this.config.goesUp,
            width,
            height,
        };

        return this._makeLevel(id, levelOpts, cb);

        // TODO - Update startLoc, endLoc
    }

    _makeLevel(
        id: number,
        opts: Partial<LEVEL.DiggerOptions>,
        cb: TYPES.DigFn | GWM.map.Map
    ) {
        const digger = new LEVEL.Digger(opts);
        let result = false;
        if (cb instanceof GWM.map.Map) {
            result = digger.create(cb);
        } else {
            result = digger.create(this.config.width, this.config.height, cb);
        }

        this.stairLocs[id] = [digger.locations.start, digger.locations.end];

        if (cb instanceof GWM.map.Map) {
            const locs = this.stairLocs[id];
            if (this.config.goesUp) {
                cb.locations.down = cb.locations.start = locs[0];
                cb.locations.up = cb.locations.end = locs[1];
            } else {
                cb.locations.down = cb.locations.start = locs[1];
                cb.locations.up = cb.locations.end = locs[0];
            }
        }
        return result;
    }
}
