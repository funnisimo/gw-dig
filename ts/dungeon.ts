import * as GWU from 'gw-utils';
import * as LEVEL from './level';

import * as TYPES from './types';
import * as ROOM from './room';
import * as HALL from './hall';
import * as LOOP from './loop';
import * as LAKE from './lake';
import * as BRIDGE from './bridge';
import * as STAIRS from './stairs';

export interface DungeonOptions {
    seed?: number;
    levels: number;
    goesUp?: boolean;

    width: number;
    height: number;

    startLoc?: GWU.xy.Loc;
    startTile?: number;
    stairDistance?: number;

    endTile?: number;

    rooms: {
        count: number;
        digger: string | ROOM.RoomDigger;
        entrance?: string | ROOM.RoomDigger;
        first?: string | ROOM.RoomDigger;
    };

    halls: Partial<HALL.HallOptions>;
    loops: Partial<LOOP.LoopOptions>;
    lakes: Partial<LAKE.LakeOpts>;
    bridges: Partial<BRIDGE.BridgeOpts>;
    stairs: Partial<STAIRS.StairOpts>;

    boundary: boolean;
}

export type LocPair = [GWU.xy.Loc, GWU.xy.Loc];

export class Dungeon {
    public config: DungeonOptions = {
        levels: 1,
        width: 80,
        height: 34,
        rooms: { count: 20, digger: 'DEFAULT' },
        halls: {},
        loops: {},
        lakes: {},
        bridges: {},
        stairs: {},

        boundary: true,
    };
    public seeds: number[] = [];
    public stairLocs: LocPair[] = [];

    constructor(options: Partial<DungeonOptions> = {}) {
        GWU.object.setOptions(this.config, options);

        if (this.config.seed) {
            GWU.rng.random.seed(this.config.seed);
        }

        this.initSeeds();
        this.initStairLocs();
    }

    get levels() {
        return this.config.levels;
    }

    initSeeds() {
        for (let i = 0; i < this.config.levels; ++i) {
            this.seeds[i] = GWU.rng.random.number(2 ** 32);
        }
    }

    initStairLocs() {
        let startLoc: GWU.xy.Loc = this.config.startLoc || [
            Math.floor(this.config.width / 2),
            this.config.height - 2,
        ];

        const minDistance =
            this.config.stairDistance ||
            Math.floor(Math.max(this.config.width / 2, this.config.height / 2));

        for (let i = 0; i < this.config.levels; ++i) {
            const endLoc = GWU.rng.random.matchingLoc(
                this.config.width,
                this.config.height,
                (x, y) => {
                    return (
                        GWU.xy.distanceBetween(startLoc[0], startLoc[1], x, y) >
                        minDistance
                    );
                }
            );

            this.stairLocs.push([
                [startLoc[0], startLoc[1]],
                [endLoc[0], endLoc[1]],
            ]);
            startLoc = endLoc;
        }
    }

    getLevel(id: number, cb: TYPES.DigFn) {
        if (id < 0 || id > this.config.levels)
            throw new Error('Invalid level id: ' + id);
        GWU.rng.random.seed(this.seeds[id]);

        // Generate the level
        const [startLoc, endLoc] = this.stairLocs[id];

        const stairOpts = Object.assign({}, this.config.stairs);
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

        const rooms = Object.assign({}, this.config.rooms);
        if (id === 0 && rooms.entrance) {
            rooms.first = rooms.entrance;
        }

        const levelOpts = {
            loops: this.config.loops,
            lakes: this.config.lakes,
            bridges: this.config.bridges,

            rooms: rooms,

            stairs: stairOpts,
            boundary: this.config.boundary,

            width: this.config.width,
            height: this.config.height,
        };

        return this.makeLevel(id, levelOpts, cb);

        // TODO - Update startLoc, endLoc
    }

    makeLevel(id: number, opts: Partial<LEVEL.LevelOptions>, cb: TYPES.DigFn) {
        const level = new LEVEL.Level(opts);
        const result = level.create(this.config.width, this.config.height, cb);

        if (
            !GWU.xy.equalsXY(level.endLoc, opts.endLoc) ||
            !GWU.xy.equalsXY(level.startLoc, opts.startLoc)
        ) {
            this.stairLocs[id] = [level.startLoc, level.endLoc];
        }
        return result;
    }
}
