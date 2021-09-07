import * as GWU from 'gw-utils';
import * as GWM from 'gw-map';

import * as TYPES from './types';
import * as SITE from './site';
import * as ROOM from './room';
import * as HALL from './hall';
import * as LOOP from './loop';
import * as LAKE from './lake';
import * as BRIDGE from './bridge';
import * as STAIRS from './stairs';

export interface DoorOpts {
    chance: number;
    tile: number;
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
    lakes?: Partial<LAKE.LakeOpts> | boolean;
    bridges?: Partial<BRIDGE.BridgeOpts> | boolean;
    stairs?: Partial<STAIRS.StairOpts> | boolean;
    doors?: Partial<DoorOpts> | boolean;

    rooms: Partial<RoomOptions>;

    startLoc?: GWU.xy.Loc;
    endLoc?: GWU.xy.Loc;

    seed?: number;
    boundary?: boolean;
}

export class Digger {
    public site!: SITE.DigSite;

    public seed = 0;
    public rooms: Partial<RoomOptions> = { fails: 20 };
    public doors: Partial<DoorOpts> = { chance: 15 };
    public halls: Partial<HALL.HallOptions> = { chance: 15 };
    public loops: Partial<LOOP.LoopOptions> | null = {};
    public lakes: Partial<LAKE.LakeOpts> | null = {};
    public bridges: Partial<BRIDGE.BridgeOpts> | null = {};
    public stairs: Partial<STAIRS.StairOpts> | null = {};
    public boundary: boolean = true;

    public startLoc: GWU.xy.Loc = [-1, -1];
    public endLoc: GWU.xy.Loc = [-1, -1];

    public seq!: number[];

    constructor(options: Partial<DiggerOptions> = {}) {
        this.seed = options.seed || 0;
        GWU.object.setOptions(this.rooms, options.rooms);

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
            options.loops = options.loops || {};
            options.loops.doorChance =
                options.loops.doorChance ?? options.doors?.chance;
            GWU.object.setOptions(this.loops, options.loops);
        }

        // Lakes
        if (options.lakes === false) {
            this.lakes = null;
        } else {
            if (options.lakes === true) options.lakes = {};
            GWU.object.setOptions(this.lakes, options.lakes);
        }

        // Bridges
        if (options.bridges === false) {
            this.bridges = null;
        } else {
            if (options.bridges === true) options.bridges = {};
            GWU.object.setOptions(this.bridges, options.bridges);
        }

        // Stairs
        if (options.stairs === false) {
            this.stairs = null;
        } else {
            if (options.stairs === true) options.stairs = {};
            GWU.object.setOptions(this.stairs, options.stairs);
        }

        this.startLoc = options.startLoc || [-1, -1];
        this.endLoc = options.endLoc || [-1, -1];
    }

    _makeRoomSite(width: number, height: number) {
        const site = new SITE.GridSite(width, height);
        site.rng = this.site.rng;
        return site;
    }

    create(width: number, height: number, cb: TYPES.DigFn): boolean;
    create(map: GWM.map.Map): boolean;
    create(...args: any[]): boolean {
        if (args.length == 1 && args[0] instanceof GWM.map.Map) {
            const map = args[0] as GWM.map.Map;
            this.site = new SITE.MapSite(map);
        }
        if (args.length > 1) {
            const width = args[0] as number;
            const height = args[1] as number;
            this.site = new SITE.GridSite(width, height);
        }

        const result = this._create(this.site);

        if (args.length > 1) {
            const width = args[0] as number;
            const height = args[1] as number;
            const cb = args[2] as TYPES.DigFn;

            GWU.xy.forRect(width, height, (x, y) => {
                const t = this.site.getTileIndex(x, y);
                if (t) cb(x, y, t);
            });
        }

        this.site.free();
        return result;
    }

    _create(site: SITE.DigSite): boolean {
        if (this.startLoc[0] < 0 && this.startLoc[0] < 0) {
            this.startLoc[0] = Math.floor(site.width / 2);
            this.startLoc[1] = site.height - 2;
        }

        this.start(site);

        let tries = 20;
        while (--tries) {
            if (this.addFirstRoom(site)) break;
        }
        if (!tries) throw new Error('Failed to place first room!');
        site.updateDoorDirs();

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

        if (this.loops) this.addLoops(site, this.loops);
        if (this.lakes) this.addLakes(site, this.lakes);
        if (this.bridges) this.addBridges(site, this.bridges);
        if (this.stairs) this.addStairs(site, this.stairs);

        this.finish(site);

        return true;
    }

    start(site: SITE.DigSite) {
        const seed = this.seed || GWU.rng.random.number();
        site.setSeed(seed);

        site.clear();
        this.seq = site.rng.sequence(site.width * site.height);
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

    addFirstRoom(site: SITE.DigSite): TYPES.Room | null {
        const roomSite = this._makeRoomSite(site.width, site.height);

        let digger: ROOM.RoomDigger = this.getDigger(
            this.rooms.first || this.rooms.digger || 'DEFAULT'
        );
        let room: TYPES.Room | null = digger.create(roomSite);

        if (
            room &&
            !this._attachRoomAtLoc(site, roomSite, room, this.startLoc)
        ) {
            room = null;
        }
        roomSite.free();
        // Should we add the starting stairs now too?
        return room;
    }

    addRoom(site: SITE.DigSite): TYPES.Room | null {
        const roomSite = this._makeRoomSite(site.width, site.height);
        let digger: ROOM.RoomDigger = this.getDigger(
            this.rooms.digger || 'DEFAULT'
        );

        let room: TYPES.Room | null = digger.create(roomSite);

        // attach hall?
        if (this.halls.chance) {
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

        if (room && !this._attachRoom(site, roomSite, room)) {
            room = null;
        }
        roomSite.free();
        return room;
    }

    _attachRoom(
        site: SITE.DigSite,
        roomSite: SITE.DigSite,
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
                    SITE.copySite(site, roomSite, offsetX, offsetY);
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
        site: SITE.DigSite,
        roomSite: SITE.DigSite,
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
                SITE.copySite(site, roomSite, offX, offY);
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
        map: SITE.DigSite,
        roomGrid: SITE.DigSite,
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
        site: SITE.DigSite,
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

        const tile = isDoor ? opts.tile || SITE.DOOR : SITE.FLOOR;
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

    addLoops(site: SITE.DigSite, opts: Partial<LOOP.LoopOptions>) {
        const digger = new LOOP.LoopDigger(opts);
        return digger.create(site);
    }

    addLakes(site: SITE.DigSite, opts: Partial<LAKE.LakeOpts>) {
        const digger = new LAKE.Lakes(opts);
        return digger.create(site);
    }

    addBridges(site: SITE.DigSite, opts: Partial<BRIDGE.BridgeOpts>) {
        const digger = new BRIDGE.Bridges(opts);
        return digger.create(site);
    }

    addStairs(site: SITE.DigSite, opts: Partial<STAIRS.StairOpts>) {
        const digger = new STAIRS.Stairs(opts);
        return digger.create(site);
    }

    finish(site: SITE.DigSite) {
        this._removeDiagonalOpenings(site);
        this._finishWalls(site);
        this._finishDoors(site);
    }

    _removeDiagonalOpenings(site: SITE.DigSite) {
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
                            site.setTile(x1, y1, SITE.FLOOR); // todo - pick one of the passable tiles around it...
                        }
                    }
                }
            }
        } while (diagonalCornerRemoved == true);
    }

    _finishDoors(site: SITE.DigSite) {
        GWU.xy.forRect(site.width, site.height, (x, y) => {
            if (site.isBoundaryXY(x, y)) return;

            // todo - isDoorway...
            if (site.isDoor(x, y)) {
                if (
                    // TODO - isPassable
                    (site.isFloor(x + 1, y) || site.isFloor(x - 1, y)) &&
                    (site.isFloor(x, y + 1) || site.isFloor(x, y - 1))
                ) {
                    // If there's passable terrain to the left or right, and there's passable terrain
                    // above or below, then the door is orphaned and must be removed.
                    site.setTile(x, y, SITE.FLOOR); // todo - take passable neighbor value
                } else if (
                    (site.blocksPathing(x + 1, y) ? 1 : 0) +
                        (site.blocksPathing(x - 1, y) ? 1 : 0) +
                        (site.blocksPathing(x, y + 1) ? 1 : 0) +
                        (site.blocksPathing(x, y - 1) ? 1 : 0) >=
                    3
                ) {
                    // If the door has three or more pathing blocker neighbors in the four cardinal directions,
                    // then the door is orphaned and must be removed.
                    site.setTile(x, y, SITE.FLOOR); // todo - take passable neighbor
                }
            }
        });
    }

    _finishWalls(site: SITE.DigSite) {
        const boundaryTile = this.boundary ? SITE.IMPREGNABLE : SITE.WALL;
        GWU.xy.forRect(site.width, site.height, (x, y) => {
            if (site.isNothing(x, y)) {
                if (site.isBoundaryXY(x, y)) {
                    site.setTile(x, y, boundaryTile);
                } else {
                    site.setTile(x, y, SITE.WALL);
                }
            }
        });
    }
}
