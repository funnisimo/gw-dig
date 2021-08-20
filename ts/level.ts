import * as GW from 'gw-utils';

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
    first: string | string[] | Record<string, number> | ROOM.RoomDigger;
    digger: string | string[] | Record<string, number> | ROOM.RoomDigger;
}

export interface LevelOptions {
    halls?: Partial<HALL.HallOptions>;
    loops?: Partial<LOOP.LoopOptions>;
    lakes?: Partial<LAKE.LakeOpts>;
    bridges?: Partial<BRIDGE.BridgeOpts>;
    stairs?: Partial<STAIRS.StairOpts>;
    doors?: Partial<DoorOpts>;

    rooms: Partial<RoomOptions>;

    startLoc?: GW.utils.Loc;
    endLoc?: GW.utils.Loc;

    seed?: number;
    boundary?: boolean;
}

export class Level {
    public height: number;
    public width: number;

    public rooms: Partial<RoomOptions> = {};
    public doors: Partial<DoorOpts> = { chance: 15 };
    public halls: Partial<HALL.HallOptions> = { chance: 15 };
    public loops: Partial<LOOP.LoopOptions> = {};
    public lakes: Partial<LAKE.LakeOpts> = {};
    public bridges: Partial<BRIDGE.BridgeOpts> = {};
    public stairs: Partial<STAIRS.StairOpts> = {};
    public boundary: boolean = true;

    public startLoc: GW.utils.Loc = [-1, -1];
    public endLoc: GW.utils.Loc = [-1, -1];

    public seq: number[];

    constructor(
        width: number,
        height: number,
        options: Partial<LevelOptions> = {}
    ) {
        this.height = height;
        this.width = width;

        if (options.seed) {
            GW.random.seed(options.seed);
        }

        this.seq = GW.random.sequence(width * height);

        GW.utils.setOptions(this.rooms, options.rooms);
        GW.utils.setOptions(this.halls, options.halls);
        GW.utils.setOptions(this.loops, options.loops);
        GW.utils.setOptions(this.lakes, options.lakes);
        GW.utils.setOptions(this.bridges, options.bridges);
        GW.utils.setOptions(this.stairs, options.stairs);
        GW.utils.setOptions(this.doors, options.doors);

        this.startLoc = options.startLoc || [Math.floor(width / 2), height - 2];
        this.endLoc = options.endLoc || [-1, -1];
    }

    makeSite(width: number, height: number) {
        return new SITE.GridSite(width, height);
    }

    create(setFn: TYPES.DigFn) {
        const site = this.makeSite(this.width, this.height);

        this.start(site);

        let tries = 20;
        while (--tries) {
            if (this.addFirstRoom(site)) break;
        }
        if (!tries) throw new Error('Failed to place first room!');

        let fails = 0;
        while (fails < 20) {
            if (this.addRoom(site)) {
                fails = 0;
            } else {
                ++fails;
            }
        }

        this.addLoops(site, this.loops);
        this.addLakes(site, this.lakes);
        this.addBridges(site, this.bridges);
        this.addStairs(site, this.stairs);

        this.finish(site);

        GW.utils.forRect(this.width, this.height, (x, y) => {
            const t = site.getTileIndex(x, y);
            if (t) setFn(x, y, t);
        });

        site.free();
        return true;
    }

    start(_site: SITE.DigSite) {}

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
        const roomSite = this.makeSite(this.width, this.height);

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
        const roomSite = this.makeSite(this.width, this.height);
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

        // Slide hyperspace across real space, in a random but predetermined order, until the room matches up with a wall.
        for (let i = 0; i < this.seq.length; i++) {
            const x = Math.floor(this.seq[i] / this.height);
            const y = this.seq[i] % this.height;

            if (!site.isNothing(x, y)) continue;
            const dir = SITE.directionOfDoorSite(site, x, y);
            if (dir != GW.utils.NO_DIRECTION) {
                const oppDir = (dir + 2) % 4;
                const door = doorSites[oppDir];
                if (!door) continue;

                const offsetX = x - door[0];
                const offsetY = y - door[1];

                if (
                    door[0] != -1 &&
                    this._roomFitsAt(site, roomSite, offsetX, offsetY)
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
        attachLoc: GW.utils.Loc
    ): boolean {
        const [x, y] = attachLoc;
        const doorSites = room.hall ? room.hall.doors : room.doors;
        const dirs = GW.random.sequence(4);

        // console.log('attachRoomAtXY', x, y, doorSites.join(', '));

        for (let dir of dirs) {
            const oppDir = (dir + 2) % 4;
            const door = doorSites[oppDir];
            if (!door || door[0] == -1) continue;

            const offX = x - door[0];
            const offY = y - door[1];

            if (this._roomFitsAt(site, roomSite, offX, offY)) {
                // dungeon.debug("attachRoom: ", x, y, oppDir);

                // TYPES.Room fits here.
                SITE.copySite(site, roomSite, offX, offY);
                // this._attachDoor(site, room, x, y, oppDir);  // No door on first room!
                room.translate(offX, offY);
                // const newDoors = doorSites.map((site) => {
                //     const x0 = site[0] + offX;
                //     const y0 = site[1] + offY;
                //     if (x0 == x && y0 == y) return [-1, -1] as GW.utils.Loc;
                //     return [x0, y0] as GW.utils.Loc;
                // });
                return true;
            }
        }
        return false;
    }

    _roomFitsAt(
        map: SITE.DigSite,
        roomGrid: SITE.DigSite,
        roomToSiteX: number,
        roomToSiteY: number
    ) {
        let xRoom, yRoom, xSite, ySite, i, j;

        // console.log('roomFitsAt', roomToSiteX, roomToSiteY);

        for (xRoom = 0; xRoom < roomGrid.width; xRoom++) {
            for (yRoom = 0; yRoom < roomGrid.height; yRoom++) {
                if (roomGrid.isSet(xRoom, yRoom)) {
                    xSite = xRoom + roomToSiteX;
                    ySite = yRoom + roomToSiteY;

                    for (i = xSite - 1; i <= xSite + 1; i++) {
                        for (j = ySite - 1; j <= ySite + 1; j++) {
                            if (
                                !map.hasXY(i, j) ||
                                map.isBoundaryXY(i, j) ||
                                !map.isNothing(i, j)
                            ) {
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
        map: SITE.DigSite,
        room: TYPES.Room,
        x: number,
        y: number,
        dir: number
    ) {
        const opts = this.doors;

        if (opts.chance === 0) return; // no door at all

        const isDoor = opts.chance && GW.random.chance(opts.chance); // did not pass chance

        const tile = isDoor ? opts.tile || SITE.DOOR : SITE.FLOOR;
        map.setTile(x, y, tile); // Door site.

        // most cases...
        if (!room.hall || !(room.hall.width > 1) || room.hall.dir !== dir) {
            return;
        }

        if (dir === GW.utils.UP || dir === GW.utils.DOWN) {
            let didSomething = true;
            let k = 1;
            while (didSomething) {
                didSomething = false;

                if (map.isNothing(x - k, y)) {
                    if (map.isSet(x - k, y - 1) && map.isSet(x - k, y + 1)) {
                        map.setTile(x - k, y, tile);
                        didSomething = true;
                    }
                }
                if (map.isNothing(x + k, y)) {
                    if (map.isSet(x + k, y - 1) && map.isSet(x + k, y + 1)) {
                        map.setTile(x + k, y, tile);
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

                if (map.isNothing(x, y - k)) {
                    if (map.isSet(x - 1, y - k) && map.isSet(x + 1, y - k)) {
                        map.setTile(x, y - k, tile);
                        didSomething = true;
                    }
                }
                if (map.isNothing(x, y + k)) {
                    if (map.isSet(x - 1, y + k) && map.isSet(x + 1, y + k)) {
                        map.setTile(x, y + k, tile);
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
            for (i = 0; i < this.width - 1; i++) {
                for (j = 0; j < this.height - 1; j++) {
                    for (k = 0; k <= 1; k++) {
                        if (
                            !site.blocksMove(i + k, j) &&
                            site.blocksMove(i + (1 - k), j) &&
                            site.blocksDiagonal(i + (1 - k), j) &&
                            site.blocksMove(i + k, j + 1) &&
                            site.blocksDiagonal(i + k, j + 1) &&
                            !site.blocksMove(i + (1 - k), j + 1)
                        ) {
                            if (GW.random.chance(50)) {
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
        GW.utils.forRect(this.width, this.height, (x, y) => {
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
        GW.utils.forRect(this.width, this.height, (x, y) => {
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
