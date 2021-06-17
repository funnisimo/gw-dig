import * as GW from 'gw-utils';
import * as TYPES from './types';
import * as SITE from './site';
import * as UTILS from './utils';
import * as HALL from './hall';
import * as ROOM from './room';
import * as LAKE from './lake';
import * as BRIDGE from './bridge';
import * as STAIRS from './stairs';
import * as LOOP from './loop';
// import * as MAP from 'gw-map.js';

export * from './site';
export * as room from './room';
export * as hall from './hall';
export * as lake from './lake';
export * as bridge from './bridge';
export * as stairs from './stairs';
export * as utils from './utils';
export * as loop from './loop';
export * from './types';

export function start(grid: GW.grid.NumGrid) {
    SITE.initSeqence(grid.width * grid.height);
    grid.fill(0);
}

export function finish(grid: GW.grid.NumGrid) {
    removeDiagonalOpenings(grid);
    finishWalls(grid);
    finishDoors(grid);
}

// Returns an array of door sites if successful
export function addRoom(
    map: GW.grid.NumGrid,
    opts?: string | TYPES.DigConfig
): TYPES.Room | null {
    opts = opts || { room: 'DEFAULT', hall: 'DEFAULT', tries: 10 };
    if (typeof opts === 'string') {
        opts = { room: opts };
    }
    if (opts.loc) {
        opts.locs = [opts.loc];
    }

    let roomDigger: ROOM.RoomDigger;
    if (typeof opts.room === 'function') opts.room = opts.room();

    if (!opts.room) roomDigger = ROOM.rooms.DEFAULT;
    else if (typeof opts.room === 'string') {
        const name = opts.room;
        roomDigger = ROOM.rooms[name];
        if (!roomDigger) {
            throw new Error('Failed to find room: ' + name);
        }
    } else if (opts.room instanceof ROOM.RoomDigger) {
        roomDigger = opts.room;
    } else {
        throw new Error('No room to build!');
    }

    // const roomConfig = opts.room as TYPES.RoomConfig;

    let hallConfig: TYPES.HallData | null = null;
    if (opts.hall === true) opts.hall = 'DEFAULT';
    if (opts.hall !== false && !opts.hall) opts.hall = 'DEFAULT';
    if (typeof opts.hall === 'function') opts.hall = { fn: opts.hall };
    if (typeof opts.hall === 'string') {
        const name = opts.hall;
        opts.hall = HALL.halls[name];
        if (!opts.hall) {
            GW.utils.ERROR('Failed to find hall: ' + name);
            return null;
        }
        hallConfig = opts.hall as TYPES.HallData;
    } else {
        if (opts.hall && opts.hall.fn) {
            hallConfig = opts.hall as TYPES.HallData;
        }
    }

    if (opts.door === false) {
        opts.door = 0;
    } else if (opts.door === true) {
        opts.door = SITE.DOOR;
    } else if (typeof opts.door === 'number') {
        opts.door = GW.random.chance(opts.door) ? SITE.DOOR : SITE.FLOOR;
    } else {
        opts.door = SITE.FLOOR;
    }

    let locs = opts.locs || null;
    // @ts-ignore
    if (locs && locs.doors) locs = locs.doors;
    if (!locs || !Array.isArray(locs)) {
        locs = null;
        if (map.count(SITE.FLOOR) === 0) {
            // empty map
            const x = Math.floor(map.width / 2);
            const y = map.height - 2;
            locs = [[x, y]];
        }
    } else if (
        locs &&
        locs.length &&
        locs.length == 2 &&
        typeof locs[0] == 'number'
    ) {
        // @ts-ignore
        locs = [locs];
    } else if (locs.length == 0) {
        locs = null;
    }

    const roomGrid = GW.grid.alloc(map.width, map.height);
    const site = new SITE.GridSite(roomGrid);

    let attachHall = false;
    if (hallConfig) {
        let hallChance =
            hallConfig.chance !== undefined ? hallConfig.chance : 15;
        attachHall = GW.random.chance(hallChance);
    }

    // const force = config.force || false;

    let room: TYPES.Room | null = null;
    let result: boolean | GW.utils.Loc[] = false;
    let tries = opts.tries || 10;
    while (--tries >= 0 && !result) {
        roomGrid.fill(SITE.NOTHING);

        // dig the room in the center
        room = roomDigger.create(site);

        // optionally add a hall
        if (attachHall) {
            const hallDigger = new HALL.HallDigger();
            room.hall = hallDigger.create(site, room.doors);
        }

        if (locs) {
            // try the doors first
            result = UTILS.attachRoomAtMapDoor(
                map,
                locs,
                roomGrid,
                room,
                opts as TYPES.DigInfo
            );
        } else {
            result = UTILS.attachRoom(
                map,
                roomGrid,
                room,
                opts as TYPES.DigInfo
            );
        }

        // console.log(
        //     'try',
        //     room.hall ? 'hall: ' + room.hall.dir : 'no hall',
        //     result
        // );
        // if (!result) {
        //     roomGrid.dump();
        //     map.dump();
        //     console.log(
        //         'room doors',
        //         (room.hall ? room.hall.doors : room.doors).join(', ')
        //     );
        //     console.log('map locs', locs.join(', '));
        // }
    }

    GW.grid.free(roomGrid);
    return room && result ? room : null;
}

// Add some loops to the otherwise simply connected network of rooms.
export function addLoops(
    grid: GW.grid.NumGrid,
    minDistance: number,
    maxLength: number
) {
    return LOOP.digLoops(grid, { minDistance, maxLength });
}

export function addLakes(
    map: GW.grid.NumGrid,
    opts: Partial<LAKE.LakeOpts> = {}
) {
    const lakes = new LAKE.Lakes(opts);
    const site = new SITE.GridSite(map);
    return lakes.create(site);
}

export function addBridges(
    grid: GW.grid.NumGrid,
    opts: Partial<BRIDGE.BridgeOpts> = {}
) {
    const bridges = new BRIDGE.Bridges(opts);
    const site = new SITE.GridSite(grid);
    return bridges.create(site);
}

export function addStairs(
    grid: GW.grid.NumGrid,
    opts: Partial<STAIRS.StairOpts> = {}
) {
    const stairs = new STAIRS.Stairs(opts);
    const site = new SITE.GridSite(grid);
    return stairs.create(site);
}

export function removeDiagonalOpenings(grid: GW.grid.NumGrid) {
    let i, j, k, x1, y1;
    let diagonalCornerRemoved;

    const site = new SITE.GridSite(grid);

    do {
        diagonalCornerRemoved = false;
        for (i = 0; i < grid.width - 1; i++) {
            for (j = 0; j < grid.height - 1; j++) {
                for (k = 0; k <= 1; k++) {
                    if (
                        site.isPassable(i + k, j) &&
                        !site.isPassable(i + (1 - k), j) &&
                        site.isObstruction(i + (1 - k), j) &&
                        !site.isPassable(i + k, j + 1) &&
                        site.isObstruction(i + k, j + 1) &&
                        site.isPassable(i + (1 - k), j + 1)
                    ) {
                        if (GW.random.chance(50)) {
                            x1 = i + (1 - k);
                            y1 = j;
                        } else {
                            x1 = i + k;
                            y1 = j + 1;
                        }
                        diagonalCornerRemoved = true;
                        grid[x1][y1] = SITE.FLOOR; // todo - pick one of the passable tiles around it...
                    }
                }
            }
        }
    } while (diagonalCornerRemoved == true);
}

export function finishDoors(grid: GW.grid.NumGrid) {
    grid.forEach((cell, x, y) => {
        if (grid.isBoundaryXY(x, y)) return;

        // todo - isDoorway...
        if (cell == SITE.DOOR) {
            if (
                // TODO - isPassable
                (grid.get(x + 1, y) == SITE.FLOOR ||
                    grid.get(x - 1, y) == SITE.FLOOR) &&
                (grid.get(x, y + 1) == SITE.FLOOR ||
                    grid.get(x, y - 1) == SITE.FLOOR)
            ) {
                // If there's passable terrain to the left or right, and there's passable terrain
                // above or below, then the door is orphaned and must be removed.
                grid[x][y] = SITE.FLOOR; // todo - take passable neighbor value
            } else if (
                // todo - isPassable
                (grid.get(x + 1, y) !== SITE.FLOOR ? 1 : 0) +
                    (grid.get(x - 1, y) !== SITE.FLOOR ? 1 : 0) +
                    (grid.get(x, y + 1) !== SITE.FLOOR ? 1 : 0) +
                    (grid.get(x, y - 1) !== SITE.FLOOR ? 1 : 0) >=
                3
            ) {
                // If the door has three or more pathing blocker neighbors in the four cardinal directions,
                // then the door is orphaned and must be removed.
                grid[x][y] = SITE.FLOOR; // todo - take passable neighbor
            }
        }
    });
}

export function finishWalls(grid: GW.grid.NumGrid, tile: number = SITE.WALL) {
    grid.forEach((cell, i, j) => {
        if (cell == SITE.NOTHING) {
            grid[i][j] = tile;
        }
    });
}

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

    makeSite(grid: GW.grid.NumGrid) {
        return new SITE.GridSite(grid);
    }

    create(setFn: TYPES.DigFn) {
        const grid = GW.grid.alloc(this.width, this.height, 0);
        const site = this.makeSite(grid);

        this.start(site);

        this.addFirstRoom(site);

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

        grid.forEach((v, x, y) => {
            if (v) setFn(x, y, v);
        });

        GW.grid.free(grid);
        return true;
    }

    start(_site: SITE.Site) {
        SITE.initSeqence(this.width * this.height);
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

    addFirstRoom(site: SITE.Site): TYPES.Room | null {
        const grid = GW.grid.alloc(site.width, site.height);
        const roomSite = this.makeSite(grid);

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
        GW.grid.free(grid);
        // Should we add the starting stairs now too?
        return room;
    }

    addRoom(site: SITE.Site): TYPES.Room | null {
        const grid = GW.grid.alloc(site.width, site.height);
        const roomSite = this.makeSite(grid);
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
        GW.grid.free(grid);
        return room;
    }

    _attachRoom(
        site: SITE.Site,
        roomSite: SITE.Site,
        room: TYPES.Room
    ): boolean {
        // console.log('attachRoom');
        const doorSites = room.hall ? room.hall.doors : room.doors;

        // Slide hyperspace across real space, in a random but predetermined order, until the room matches up with a wall.
        for (let i = 0; i < SITE.SEQ.length; i++) {
            const x = Math.floor(SITE.SEQ[i] / this.height);
            const y = SITE.SEQ[i] % this.height;

            if (!site.isNothing(x, y)) continue;
            const dir = UTILS.directionOfDoorSite(site, x, y);
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
                    site.copy(roomSite, offsetX, offsetY);
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
                site.copy(roomSite, offX, offY);
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
        map: SITE.Site,
        roomGrid: SITE.Site,
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
        map: SITE.Site,
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
        return digger.create(site);
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
            for (i = 0; i < this.width - 1; i++) {
                for (j = 0; j < this.height - 1; j++) {
                    for (k = 0; k <= 1; k++) {
                        if (
                            site.isPassable(i + k, j) &&
                            !site.isPassable(i + (1 - k), j) &&
                            site.isObstruction(i + (1 - k), j) &&
                            !site.isPassable(i + k, j + 1) &&
                            site.isObstruction(i + k, j + 1) &&
                            site.isPassable(i + (1 - k), j + 1)
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

    _finishDoors(site: SITE.Site) {
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
                    (site.isObstruction(x + 1, y) ? 1 : 0) +
                        (site.isObstruction(x - 1, y) ? 1 : 0) +
                        (site.isObstruction(x, y + 1) ? 1 : 0) +
                        (site.isObstruction(x, y - 1) ? 1 : 0) >=
                    3
                ) {
                    // If the door has three or more pathing blocker neighbors in the four cardinal directions,
                    // then the door is orphaned and must be removed.
                    site.setTile(x, y, SITE.FLOOR); // todo - take passable neighbor
                }
            }
        });
    }

    _finishWalls(site: SITE.Site) {
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

export interface DungeonOptions {
    seed?: number;
    levels: number;
    goesUp?: boolean;

    width: number;
    height: number;

    startLoc?: GW.utils.Loc;
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

export type LocPair = [GW.utils.Loc, GW.utils.Loc];

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
        GW.utils.setOptions(this.config, options);

        if (this.config.seed) {
            GW.random.seed(this.config.seed);
        }

        this.initSeeds();
        this.initStairLocs();
    }

    get levels() {
        return this.config.levels;
    }

    initSeeds() {
        for (let i = 0; i < this.config.levels; ++i) {
            this.seeds[i] = GW.random.number();
        }
    }

    initStairLocs() {
        let startLoc: GW.utils.Loc = this.config.startLoc || [
            Math.floor(this.config.width / 2),
            this.config.height - 2,
        ];

        const minDistance =
            this.config.stairDistance ||
            Math.floor(Math.max(this.config.width / 2, this.config.height / 2));

        for (let i = 0; i < this.config.levels; ++i) {
            const endLoc = GW.random.matchingXY(
                this.config.width,
                this.config.height,
                (x, y) => {
                    return (
                        GW.utils.distanceBetween(
                            startLoc[0],
                            startLoc[1],
                            x,
                            y
                        ) > minDistance
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
        GW.random.seed(this.seeds[id]);

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

    makeLevel(id: number, opts: Partial<LevelOptions>, cb: TYPES.DigFn) {
        const level = new Level(this.config.width, this.config.height, opts);
        const result = level.create(cb);

        if (
            !GW.utils.equalsXY(level.endLoc, opts.endLoc) ||
            !GW.utils.equalsXY(level.startLoc, opts.startLoc)
        ) {
            this.stairLocs[id] = [level.startLoc, level.endLoc];
        }
        return result;
    }
}
