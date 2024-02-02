import * as GWU from 'gw-utils';
// import * as GWM from 'gw-map';

import * as TYPES from './types';
import * as SITE from './site';
import * as ROOM from './room';
import * as HALL from './hall';
import * as LOOP from './loop';
import * as LAKE from './lake';
import * as BRIDGE from './bridge';
import * as STAIRS from './stairs';

import * as LOGGER from './site/log/logger';
import { ConsoleLogger } from './site/log/consoleLogger';

export interface DoorOpts {
    chance: number;
    tile: string;
}

export interface RoomOptions {
    count: number;
    fails: number;
    first: string | string[] | Record<string, number> | ROOM.RoomDigger;
    digger: string | string[] | Record<string, number> | ROOM.RoomDigger;
}

export interface DiggerOptions {
    halls?: Partial<HALL.HallOptions> | boolean;
    loops?: Partial<LOOP.LoopOptions> | boolean;
    lakes?: Partial<LAKE.LakeOpts> | boolean | number;
    bridges?: Partial<BRIDGE.BridgeOpts> | boolean | number;
    stairs?: Partial<STAIRS.StairOpts> | boolean;
    doors?: Partial<DoorOpts> | boolean;

    rooms?: number | Partial<RoomOptions>;

    startLoc?: GWU.xy.Loc;
    endLoc?: GWU.xy.Loc;
    goesUp?: boolean;

    seed?: number;
    boundary?: boolean;

    log?: LOGGER.Logger | boolean;
}

export class Digger {
    site!: SITE.Site;

    seed = 0;
    rooms: Partial<RoomOptions> = { fails: 20 };
    doors: Partial<DoorOpts> = { chance: 15 };
    halls: Partial<HALL.HallOptions> = { chance: 15 };
    loops: Partial<LOOP.LoopOptions> | null = {};
    lakes: Partial<LAKE.LakeOpts> | null = {};
    bridges: Partial<BRIDGE.BridgeOpts> | null = {};
    stairs: Partial<STAIRS.StairOpts> | null = {};
    boundary: boolean = true;

    // startLoc: GWU.xy.Loc = [-1, -1];
    // endLoc: GWU.xy.Loc = [-1, -1];

    locations: Record<string, GWU.xy.Loc> = {};
    _locs: Record<string, GWU.xy.Loc> = {};
    goesUp = false;

    seq!: number[];
    log: LOGGER.Logger;
    tiles: SITE.TileFactory;

    constructor(options: DiggerOptions = {}, tiles?: SITE.TileFactory) {
        this.seed = options.seed || 0;
        this.tiles = tiles || SITE.tileFactory;

        if (typeof options.rooms === 'number') {
            options.rooms = { count: options.rooms };
        }
        GWU.object.setOptions(this.rooms, options.rooms);

        this.goesUp = options.goesUp || false;
        if (options.startLoc) {
            this._locs.start = options.startLoc;
        }
        if (options.endLoc) {
            this._locs.end = options.endLoc;
        }

        // Doors
        if (options.doors === false) {
            options.doors = { chance: 0 };
        } else if (options.doors === true) {
            options.doors = { chance: 100 };
        }
        GWU.object.setOptions(this.doors, options.doors);

        // Halls
        if (options.halls === false) {
            options.halls = { chance: 0 };
        } else if (options.halls === true) {
            options.halls = {};
        }
        GWU.object.setOptions(this.halls, options.halls);

        // Loops
        if (options.loops === false) {
            this.loops = null;
        } else {
            if (options.loops === true) options.loops = {};
            else if (typeof options.loops === 'number') {
                options.loops = { maxLength: options.loops };
            }
            options.loops = options.loops || {};
            options.loops.doorChance =
                options.loops.doorChance ?? options.doors?.chance;
            // @ts-ignore
            GWU.object.setOptions(this.loops, options.loops);
        }

        // Lakes
        if (options.lakes === false) {
            this.lakes = null;
        } else {
            if (options.lakes === true) options.lakes = {};
            else if (typeof options.lakes === 'number') {
                options.lakes = { count: options.lakes };
            }
            options.lakes = options.lakes || {};
            // @ts-ignore
            GWU.object.setOptions(this.lakes, options.lakes);
        }

        // Bridges
        if (options.bridges === false) {
            this.bridges = null;
        } else {
            if (typeof options.bridges === 'number') {
                options.bridges = { maxLength: options.bridges };
            }
            if (options.bridges === true) options.bridges = {};
            // @ts-ignore
            GWU.object.setOptions(this.bridges, options.bridges);
        }

        // Stairs
        if (options.stairs === false) {
            this.stairs = null;
        } else {
            if (typeof options.stairs !== 'object') options.stairs = {};
            // @ts-ignore
            GWU.object.setOptions(this.stairs, options.stairs);
            this.stairs!.start = this.goesUp ? 'down' : 'up';
        }

        // this.startLoc = options.startLoc || [-1, -1];
        // this.endLoc = options.endLoc || [-1, -1];

        if (options.log === true) {
            this.log = new ConsoleLogger();
        } else if (options.log) {
            this.log = options.log;
        } else {
            this.log = new LOGGER.NullLogger();
        }
    }

    _makeRoomSite(width: number, height: number) {
        const site = new SITE.Site(width, height);
        site.rng = this.site.rng;
        return site;
    }

    _createSite(width: number, height: number): void {
        this.site = new SITE.Site(width, height);
    }

    create(width: number, height: number, cb: TYPES.DigFn): boolean;
    create(map: GWU.grid.NumGrid): boolean;
    create(map: SITE.Site): boolean;
    create(...args: any[]): boolean {
        let needsFree = true;
        if (args.length == 1) {
            const dest = args[0];
            if (dest instanceof SITE.Site) {
                this.site = dest;
                needsFree = false;
            } else {
                this._createSite(dest.width, dest.height);
            }
        } else {
            this._createSite(args[0], args[1]);
        }

        const result = this._create(this.site);

        const cb = args[2] || null;
        if (cb) {
            GWU.xy.forRect(this.site.width, this.site.height, (x, y) => {
                const t = this.site._tiles.get(x, y);
                if (t) cb(x, y, t);
            });
        } else if (args.length == 1 && needsFree) {
            const dest = args[0];
            dest.copy(this.site._tiles);
        }

        needsFree && this.site.free();
        return result;
    }

    _create(site: SITE.Site): boolean {
        this.start(site);

        this.addRooms(site);

        if (this.loops) {
            this.addLoops(site, this.loops);
            this.log.onLoopsAdded(site);
        }
        if (this.lakes) {
            this.addLakes(site, this.lakes);
            this.log.onLakesAdded(site);
        }
        if (this.bridges) {
            this.addBridges(site, this.bridges);
            this.log.onBridgesAdded(site);
        }
        if (this.stairs) {
            this.addStairs(site, this.stairs);
            this.log.onStairsAdded(site);
        }

        this.finish(site);

        return true;
    }

    start(site: SITE.Site) {
        this.site = site;

        const seed = this.seed || GWU.rng.random.number();
        site.setSeed(seed);

        site.clear();
        this.seq = site.rng.sequence(site.width * site.height);

        this.locations = Object.assign({}, this._locs);

        if (!this.locations.start || this.locations.start[0] < 0) {
            const stair = this.goesUp ? 'down' : 'up';
            if (this.stairs && Array.isArray(this.stairs[stair])) {
                this.locations.start = this.stairs[stair] as GWU.xy.Loc;
            } else {
                this.locations.start = [
                    Math.floor(site.width / 2),
                    site.height - 2,
                ];
                if (this.stairs && this.stairs[stair]) {
                    this.stairs[stair] = this.locations.start;
                }
            }
        }

        if (!this.locations.end || this.locations.end[0] < 0) {
            const stair = this.goesUp ? 'up' : 'down';
            if (this.stairs && Array.isArray(this.stairs[stair])) {
                this.locations.end = this.stairs[stair] as GWU.xy.Loc;
            }
        }

        // if (this.startLoc[0] < 0 && this.startLoc[0] < 0) {
        //     this.startLoc[0] = Math.floor(site.width / 2);
        //     this.startLoc[1] = site.height - 2;
        // }
    }

    getDigger(
        id: string | string[] | Record<string, number> | ROOM.RoomDigger
    ) {
        if (!id) throw new Error('Missing digger!');
        if (id instanceof ROOM.RoomDigger) return id;
        if (typeof id === 'string') {
            const digger = ROOM.rooms[id];
            if (!digger) {
                throw new Error('Failed to find digger - ' + id);
            }
            return digger;
        }
        return new ROOM.ChoiceRoom(id);
    }

    addRooms(site: SITE.Site) {
        let tries = 20;
        while (--tries) {
            if (this.addFirstRoom(site)) break;
        }
        if (!tries) throw new Error('Failed to place first room!');
        site.updateDoorDirs();

        this.log.onDigFirstRoom(site);

        // site.dump();
        // console.log('- rng.number', site.rng.number());

        let fails = 0;
        let count = 1;
        const maxFails = this.rooms.fails || 20;
        while (fails < maxFails) {
            if (this.addRoom(site)) {
                fails = 0;
                site.updateDoorDirs();
                site.rng.shuffle(this.seq);

                // site.dump();
                // console.log('- rng.number', site.rng.number());

                if (this.rooms.count && ++count >= this.rooms.count) {
                    break; // we are done
                }
            } else {
                ++fails;
            }
        }
    }

    addFirstRoom(site: SITE.Site): TYPES.Room | null {
        const roomSite = this._makeRoomSite(site.width, site.height);

        let digger: ROOM.RoomDigger = this.getDigger(
            this.rooms.first || this.rooms.digger || 'DEFAULT'
        );
        let room: TYPES.Room | null = digger.create(roomSite);

        if (
            room &&
            !this._attachRoomAtLoc(site, roomSite, room, this.locations.start)
        ) {
            room = null;
        }
        roomSite.free();
        // Should we add the starting stairs now too?
        return room;
    }

    addRoom(site: SITE.Site): TYPES.Room | null {
        const roomSite = this._makeRoomSite(site.width, site.height);
        let digger: ROOM.RoomDigger = this.getDigger(
            this.rooms.digger || 'DEFAULT'
        );

        let room: TYPES.Room | null = digger.create(roomSite);

        // attach hall?
        if (room && this.halls.chance) {
            let hall: TYPES.Hall | null = HALL.dig(
                this.halls,
                roomSite,
                room.doors
            );
            if (hall) {
                room.hall = hall;
            }
        }

        // console.log('potential room');
        // roomSite.dump();

        if (room) {
            this.log.onRoomCandidate(room, roomSite);

            if (this._attachRoom(site, roomSite, room)) {
                this.log.onRoomSuccess(site, room);
            } else {
                this.log.onRoomFailed(site, room, roomSite, 'Did not fit.');
                room = null;
            }
        }

        roomSite.free();
        return room;
    }

    _attachRoom(
        site: SITE.Site,
        roomSite: SITE.Site,
        room: TYPES.Room
    ): boolean {
        // console.log('attachRoom');
        const doorSites = room.hall ? room.hall.doors : room.doors;
        let i = 0;
        const len = this.seq.length;

        // Slide hyperspace across real space, in a random but predetermined order, until the room matches up with a wall.
        for (i = 0; i < len; i++) {
            const x = Math.floor(this.seq[i] / site.height);
            const y = this.seq[i] % site.height;

            const dir = site.getDoorDir(x, y);
            if (dir != GWU.xy.NO_DIRECTION) {
                const oppDir = (dir + 2) % 4;
                const door = doorSites[oppDir];
                if (!door) continue;

                const offsetX = x - door[0];
                const offsetY = y - door[1];

                if (
                    door[0] != -1 &&
                    this._roomFitsAt(site, roomSite, room, offsetX, offsetY)
                ) {
                    // TYPES.Room fits here.
                    site.copyTiles(roomSite, offsetX, offsetY);
                    this._attachDoor(site, room, x, y, oppDir);

                    // door[0] = -1;
                    // door[1] = -1;
                    room.translate(offsetX, offsetY);
                    return true;
                }
            }
        }

        return false;
    }

    _attachRoomAtLoc(
        site: SITE.Site,
        roomSite: SITE.Site,
        room: TYPES.Room,
        attachLoc: GWU.xy.Loc
    ): boolean {
        const [x, y] = attachLoc;
        const doorSites = room.hall ? room.hall.doors : room.doors;
        const dirs = site.rng.sequence(4);

        // console.log('attachRoomAtXY', x, y, doorSites.join(', '));

        for (let dir of dirs) {
            const oppDir = (dir + 2) % 4;
            const door = doorSites[oppDir];
            if (!door || door[0] == -1) continue;

            const offX = x - door[0];
            const offY = y - door[1];

            if (this._roomFitsAt(site, roomSite, room, offX, offY)) {
                // dungeon.debug("attachRoom: ", x, y, oppDir);

                // TYPES.Room fits here.
                site.copyTiles(roomSite, offX, offY);
                // this._attachDoor(site, room, x, y, oppDir);  // No door on first room!
                room.translate(offX, offY);
                // const newDoors = doorSites.map((site) => {
                //     const x0 = site[0] + offX;
                //     const y0 = site[1] + offY;
                //     if (x0 == x && y0 == y) return [-1, -1] as GWU.xy.Loc;
                //     return [x0, y0] as GWU.xy.Loc;
                // });

                return true;
            }
        }
        return false;
    }

    _roomFitsAt(
        map: SITE.Site,
        roomGrid: SITE.Site,
        room: TYPES.Room,
        roomToSiteX: number,
        roomToSiteY: number
    ) {
        let xRoom, yRoom, xSite, ySite, i, j;

        // console.log('roomFitsAt', roomToSiteX, roomToSiteY);

        const hall = room.hall || room;
        const left = Math.min(room.left, hall.left);
        const top = Math.min(room.top, hall.top);
        const right = Math.max(room.right, hall.right);
        const bottom = Math.max(room.bottom, hall.bottom);

        for (xRoom = left; xRoom <= right; xRoom++) {
            for (yRoom = top; yRoom <= bottom; yRoom++) {
                if (roomGrid.isSet(xRoom, yRoom)) {
                    xSite = xRoom + roomToSiteX;
                    ySite = yRoom + roomToSiteY;
                    if (
                        !map.hasXY(xSite, ySite) ||
                        map.isBoundaryXY(xSite, ySite)
                    ) {
                        return false;
                    }

                    for (i = xSite - 1; i <= xSite + 1; i++) {
                        for (j = ySite - 1; j <= ySite + 1; j++) {
                            if (!map.isNothing(i, j)) {
                                // console.log('- NO');
                                return false;
                            }
                        }
                    }
                }
            }
        }
        // console.log('- YES');
        return true;
    }

    _attachDoor(
        site: SITE.Site,
        room: TYPES.Room,
        x: number,
        y: number,
        dir: number
    ) {
        const opts = this.doors;
        let isDoor = false;

        if (opts.chance && site.rng.chance(opts.chance)) {
            isDoor = true;
        }

        const tile = isDoor ? opts.tile || 'DOOR' : 'FLOOR';
        site.setTile(x, y, tile); // Door site.

        // most cases...
        if (!room.hall || room.hall.width == 1 || room.hall.height == 1) {
            return;
        }

        if (dir === GWU.xy.UP || dir === GWU.xy.DOWN) {
            let didSomething = true;
            let k = 1;
            while (didSomething) {
                didSomething = false;

                if (site.isNothing(x - k, y)) {
                    if (site.isSet(x - k, y - 1) && site.isSet(x - k, y + 1)) {
                        site.setTile(x - k, y, tile);
                        didSomething = true;
                    }
                }
                if (site.isNothing(x + k, y)) {
                    if (site.isSet(x + k, y - 1) && site.isSet(x + k, y + 1)) {
                        site.setTile(x + k, y, tile);
                        didSomething = true;
                    }
                }
                ++k;
            }
        } else {
            let didSomething = true;
            let k = 1;
            while (didSomething) {
                didSomething = false;

                if (site.isNothing(x, y - k)) {
                    if (site.isSet(x - 1, y - k) && site.isSet(x + 1, y - k)) {
                        site.setTile(x, y - k, tile);
                        didSomething = true;
                    }
                }
                if (site.isNothing(x, y + k)) {
                    if (site.isSet(x - 1, y + k) && site.isSet(x + 1, y + k)) {
                        site.setTile(x, y + k, tile);
                        didSomething = true;
                    }
                }
                ++k;
            }
        }
    }

    addLoops(site: SITE.Site, opts: Partial<LOOP.LoopOptions>) {
        const digger = new LOOP.LoopDigger(opts);
        return digger.create(site);
    }

    addLakes(site: SITE.Site, opts: Partial<LAKE.LakeOpts>) {
        const digger = new LAKE.Lakes(opts);
        return digger.create(site);
    }

    addBridges(site: SITE.Site, opts: Partial<BRIDGE.BridgeOpts>) {
        const digger = new BRIDGE.Bridges(opts);
        return digger.create(site);
    }

    addStairs(site: SITE.Site, opts: Partial<STAIRS.StairOpts>) {
        const digger = new STAIRS.Stairs(opts);
        const locs = digger.create(site);
        if (locs) Object.assign(this.locations, locs);
        return !!locs;
    }

    finish(site: SITE.Site) {
        this._removeDiagonalOpenings(site);
        this._finishWalls(site);
        this._finishDoors(site);
    }

    _removeDiagonalOpenings(site: SITE.Site) {
        let i, j, k, x1, y1;
        let diagonalCornerRemoved;

        do {
            diagonalCornerRemoved = false;
            for (i = 0; i < site.width - 1; i++) {
                for (j = 0; j < site.height - 1; j++) {
                    for (k = 0; k <= 1; k++) {
                        if (
                            !site.blocksMove(i + k, j) &&
                            site.blocksMove(i + (1 - k), j) &&
                            site.blocksDiagonal(i + (1 - k), j) &&
                            site.blocksMove(i + k, j + 1) &&
                            site.blocksDiagonal(i + k, j + 1) &&
                            !site.blocksMove(i + (1 - k), j + 1)
                        ) {
                            if (site.rng.chance(50)) {
                                x1 = i + (1 - k);
                                y1 = j;
                            } else {
                                x1 = i + k;
                                y1 = j + 1;
                            }
                            diagonalCornerRemoved = true;
                            site.setTile(x1, y1, 'FLOOR'); // todo - pick one of the passable tiles around it...
                        }
                    }
                }
            }
        } while (diagonalCornerRemoved == true);
    }

    _finishDoors(site: SITE.Site) {
        GWU.xy.forRect(site.width, site.height, (x, y) => {
            if (site.isBoundaryXY(x, y)) return;

            // todo - isDoorway...
            if (site.isDoor(x, y)) {
                // if (
                //     // TODO - isPassable
                //     (site.isPassable(x + 1, y) || site.isPassable(x - 1, y)) &&
                //     (site.isPassable(x, y + 1) || site.isPassable(x, y - 1))
                // ) {
                //     // If there's passable terrain to the left or right, and there's passable terrain
                //     // above or below, then the door is orphaned and must be removed.
                //     site.setTile(x, y, SITE.FLOOR); // todo - take passable neighbor value
                // } else
                if (
                    (site.isWall(x + 1, y) ? 1 : 0) +
                        (site.isWall(x - 1, y) ? 1 : 0) +
                        (site.isWall(x, y + 1) ? 1 : 0) +
                        (site.isWall(x, y - 1) ? 1 : 0) !=
                    2
                ) {
                    // If the door has three or more pathing blocker neighbors in the four cardinal directions,
                    // then the door is orphaned and must be removed.
                    site.setTile(x, y, 'FLOOR', { superpriority: true }); // todo - take passable neighbor
                }
            }
        });
    }

    _finishWalls(site: SITE.Site) {
        const boundaryTile = this.boundary ? 'IMPREGNABLE' : 'WALL';
        GWU.xy.forRect(site.width, site.height, (x, y) => {
            if (site.isNothing(x, y)) {
                if (site.isBoundaryXY(x, y)) {
                    site.setTile(x, y, boundaryTile);
                } else {
                    site.setTile(x, y, 'WALL');
                }
            }
        });
    }
}

// export function digMap(map: GWM.map.Map, options: Partial<DiggerOptions> = {}) {
//     const digger = new Digger(options);
//     return digger.create(map);
// }
