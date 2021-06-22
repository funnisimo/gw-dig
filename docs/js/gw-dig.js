(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('gw-utils')) :
    typeof define === 'function' && define.amd ? define(['exports', 'gw-utils'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.GW = global.GW || {}, global.GW));
}(this, (function (exports, GW) { 'use strict';

    class Hall {
        constructor(loc, dir, length, width = 1) {
            this.width = 1;
            this.doors = [];
            this.x = loc[0];
            this.y = loc[1];
            const d = GW.utils.DIRS[dir];
            this.length = length;
            this.width = width;
            // console.log('Hall', loc, d, length, width);
            if (dir === GW.utils.UP || dir === GW.utils.DOWN) {
                this.x2 = this.x + (width - 1);
                this.y2 = this.y + (length - 1) * d[1];
            }
            else {
                this.x2 = this.x + (length - 1) * d[0];
                this.y2 = this.y + (width - 1);
            }
            // console.log(' - ', [this.x2, this.y2]);
            this.dir = dir;
        }
        translate(dx, dy) {
            this.x += dx;
            this.y += dy;
            this.x2 += dx;
            this.y2 += dy;
            if (this.doors) {
                this.doors.forEach((d) => {
                    if (!d)
                        return;
                    if (d[0] < 0 || d[1] < 0)
                        return;
                    d[0] += dx;
                    d[1] += dy;
                });
            }
        }
    }
    class Room extends GW.utils.Bounds {
        constructor(x, y, width, height) {
            super(x, y, width, height);
            this.doors = [];
            this.hall = null;
        }
        get cx() {
            return this.x + Math.floor(this.width / 2);
        }
        get cy() {
            return this.y + Math.floor(this.height / 2);
        }
        translate(dx, dy) {
            this.x += dx;
            this.y += dy;
            if (this.doors) {
                this.doors.forEach((d) => {
                    if (!d)
                        return;
                    if (d[0] < 0 || d[1] < 0)
                        return;
                    d[0] += dx;
                    d[1] += dy;
                });
            }
            if (this.hall) {
                this.hall.translate(dx, dy);
            }
        }
    }
    // export interface DigInfo {
    //     room: RoomData;
    //     hall: HallData | null;
    //     tries: number;
    //     locs: GW.utils.Loc[] | null;
    //     door: number;
    // }

    // import * as TYPES from './types';
    const DIRS = GW.utils.DIRS;
    // export function attachRoom(
    //     map: GW.grid.NumGrid,
    //     roomGrid: GW.grid.NumGrid,
    //     room: TYPES.Room,
    //     opts: TYPES.DigInfo
    // ) {
    //     // console.log('attachRoom');
    //     const doorSites = room.hall ? room.hall.doors : room.doors;
    //     const site = new SITE.GridSite(map);
    //     // Slide hyperspace across real space, in a random but predetermined order, until the room matches up with a wall.
    //     for (let i = 0; i < SITE.SEQ.length; i++) {
    //         const x = Math.floor(SITE.SEQ[i] / map.height);
    //         const y = SITE.SEQ[i] % map.height;
    //         if (!(map.get(x, y) == SITE.NOTHING)) continue;
    //         const dir = directionOfDoorSite(site, x, y);
    //         if (dir != GW.utils.NO_DIRECTION) {
    //             const oppDir = (dir + 2) % 4;
    //             const door = doorSites[oppDir];
    //             if (!door) continue;
    //             const offsetX = x - door[0];
    //             const offsetY = y - door[1];
    //             if (door[0] != -1 && roomFitsAt(map, roomGrid, offsetX, offsetY)) {
    //                 // TYPES.Room fits here.
    //                 GW.grid.offsetZip(
    //                     map,
    //                     roomGrid,
    //                     offsetX,
    //                     offsetY,
    //                     (_d, _s, i, j) => {
    //                         map[i][j] = opts.room.tile || SITE.FLOOR;
    //                     }
    //                 );
    //                 attachDoor(map, room, opts, x, y, oppDir);
    //                 // door[0] = -1;
    //                 // door[1] = -1;
    //                 room.translate(offsetX, offsetY);
    //                 return true;
    //             }
    //         }
    //     }
    //     return false;
    // }
    // export function attachDoor(
    //     map: GW.grid.NumGrid,
    //     room: TYPES.Room,
    //     opts: TYPES.DigInfo,
    //     x: number,
    //     y: number,
    //     dir: number
    // ) {
    //     if (opts.door === 0) return; // no door at all
    //     const tile = opts.door || SITE.DOOR;
    //     map[x][y] = tile; // Door site.
    //     // most cases...
    //     if (!room.hall || !(room.hall.width > 1) || room.hall.dir !== dir) {
    //         return;
    //     }
    //     if (dir === GW.utils.UP || dir === GW.utils.DOWN) {
    //         let didSomething = true;
    //         let k = 1;
    //         while (didSomething) {
    //             didSomething = false;
    //             if (map.get(x - k, y) === 0) {
    //                 if (map.get(x - k, y - 1) && map.get(x - k, y + 1)) {
    //                     map[x - k][y] = tile;
    //                     didSomething = true;
    //                 }
    //             }
    //             if (map.get(x + k, y) === 0) {
    //                 if (map.get(x + k, y - 1) && map.get(x + k, y + 1)) {
    //                     map[x + k][y] = tile;
    //                     didSomething = true;
    //                 }
    //             }
    //             ++k;
    //         }
    //     } else {
    //         let didSomething = true;
    //         let k = 1;
    //         while (didSomething) {
    //             didSomething = false;
    //             if (map.get(x, y - k) === 0) {
    //                 if (map.get(x - 1, y - k) && map.get(x + 1, y - k)) {
    //                     map[x][y - k] = opts.door;
    //                     didSomething = true;
    //                 }
    //             }
    //             if (map.get(x, y + k) === 0) {
    //                 if (map.get(x - 1, y + k) && map.get(x + 1, y + k)) {
    //                     map[x][y + k] = opts.door;
    //                     didSomething = true;
    //                 }
    //             }
    //             ++k;
    //         }
    //     }
    // }
    // export function roomFitsAt(
    //     map: GW.grid.NumGrid,
    //     roomGrid: GW.grid.NumGrid,
    //     roomToSiteX: number,
    //     roomToSiteY: number
    // ) {
    //     let xRoom, yRoom, xSite, ySite, i, j;
    //     // console.log('roomFitsAt', roomToSiteX, roomToSiteY);
    //     for (xRoom = 0; xRoom < roomGrid.width; xRoom++) {
    //         for (yRoom = 0; yRoom < roomGrid.height; yRoom++) {
    //             if (roomGrid[xRoom][yRoom]) {
    //                 xSite = xRoom + roomToSiteX;
    //                 ySite = yRoom + roomToSiteY;
    //                 for (i = xSite - 1; i <= xSite + 1; i++) {
    //                     for (j = ySite - 1; j <= ySite + 1; j++) {
    //                         if (
    //                             !map.hasXY(i, j) ||
    //                             map.isBoundaryXY(i, j) ||
    //                             !(map.get(i, j) === SITE.NOTHING)
    //                         ) {
    //                             // console.log('- NO');
    //                             return false;
    //                         }
    //                     }
    //                 }
    //             }
    //         }
    //     }
    //     // console.log('- YES');
    //     return true;
    // }
    // If the indicated tile is a wall on the room stored in grid, and it could be the site of
    // a door out of that room, then return the outbound direction that the door faces.
    // Otherwise, return def.NO_DIRECTION.
    function directionOfDoorSite(site, x, y) {
        let dir, solutionDir;
        let newX, newY, oppX, oppY;
        solutionDir = GW.utils.NO_DIRECTION;
        for (dir = 0; dir < 4; dir++) {
            newX = x + DIRS[dir][0];
            newY = y + DIRS[dir][1];
            oppX = x - DIRS[dir][0];
            oppY = y - DIRS[dir][1];
            if (site.hasXY(oppX, oppY) &&
                site.hasXY(newX, newY) &&
                site.isFloor(oppX, oppY)) {
                // This grid cell would be a valid tile on which to place a door that, facing outward, points dir.
                if (solutionDir != GW.utils.NO_DIRECTION) {
                    // Already claimed by another direction; no doors here!
                    return GW.utils.NO_DIRECTION;
                }
                solutionDir = dir;
            }
        }
        return solutionDir;
    }
    function chooseRandomDoorSites(site) {
        let i, j, k, newX, newY;
        let dir;
        let doorSiteFailed;
        const DOORS = [[], [], [], []];
        // const grid = GW.grid.alloc(sourceGrid.width, sourceGrid.height);
        // grid.copy(sourceGrid);
        const h = site.height;
        const w = site.width;
        for (i = 0; i < w; i++) {
            for (j = 0; j < h; j++) {
                if (site.isDiggable(i, j)) {
                    dir = directionOfDoorSite(site, i, j);
                    if (dir != GW.utils.NO_DIRECTION) {
                        // Trace a ray 10 spaces outward from the door site to make sure it doesn't intersect the room.
                        // If it does, it's not a valid door site.
                        newX = i + GW.utils.DIRS[dir][0];
                        newY = j + GW.utils.DIRS[dir][1];
                        doorSiteFailed = false;
                        for (k = 0; k < 10 && site.hasXY(newX, newY) && !doorSiteFailed; k++) {
                            if (site.isSet(newX, newY)) {
                                doorSiteFailed = true;
                            }
                            newX += GW.utils.DIRS[dir][0];
                            newY += GW.utils.DIRS[dir][1];
                        }
                        if (!doorSiteFailed) {
                            DOORS[dir].push([i, j]);
                        }
                    }
                }
            }
        }
        let doorSites = [];
        // Pick four doors, one in each direction, and store them in doorSites[dir].
        for (dir = 0; dir < 4; dir++) {
            const loc = GW.random.item(DOORS[dir]) || [-1, -1];
            doorSites[dir] = [loc[0], loc[1]];
        }
        // GW.grid.free(grid);
        return doorSites;
    }
    // export function forceRoomAtMapLoc(
    //     map: GW.grid.NumGrid,
    //     xy: GW.utils.Loc,
    //     roomGrid: GW.grid.NumGrid,
    //     room: TYPES.Room,
    //     opts: TYPES.DigConfig
    // ) {
    //     // console.log('forceRoomAtMapLoc', xy);
    //     const site = new SITE.GridSite(map);
    //     // Slide room across map, in a random but predetermined order, until the room matches up with a wall.
    //     for (let i = 0; i < SITE.SEQ.length; i++) {
    //         const x = Math.floor(SITE.SEQ[i] / map.height);
    //         const y = SITE.SEQ[i] % map.height;
    //         if (roomGrid[x][y]) continue;
    //         const dir = directionOfDoorSite(site, x, y);
    //         if (dir != GW.utils.NO_DIRECTION) {
    //             const dx = xy[0] - x;
    //             const dy = xy[1] - y;
    //             if (roomFitsAt(map, roomGrid, dx, dy)) {
    //                 GW.grid.offsetZip(map, roomGrid, dx, dy, (_d, _s, i, j) => {
    //                     map[i][j] = opts.room.tile || SITE.FLOOR;
    //                 });
    //                 if (opts.room.door !== false) {
    //                     const door =
    //                         opts.room.door === true || !opts.room.door
    //                             ? SITE.DOOR
    //                             : opts.room.door;
    //                     map[xy[0]][xy[1]] = door; // Door site.
    //                 }
    //                 // TODO - Update doors - we may have to erase one...
    //                 room.translate(dx, dy);
    //                 return true;
    //             }
    //         }
    //     }
    //     return false;
    // }
    // export function attachRoomAtMapDoor(
    //     map: GW.grid.NumGrid,
    //     mapDoors: GW.utils.Loc[],
    //     roomGrid: GW.grid.NumGrid,
    //     room: TYPES.Room,
    //     opts: TYPES.DigInfo
    // ): boolean | GW.utils.Loc[] {
    //     const doorIndexes = GW.random.sequence(mapDoors.length);
    //     // console.log('attachRoomAtMapDoor', mapDoors.join(', '));
    //     // Slide hyperspace across real space, in a random but predetermined order, until the room matches up with a wall.
    //     for (let i = 0; i < doorIndexes.length; i++) {
    //         const index = doorIndexes[i];
    //         const door = mapDoors[index];
    //         if (!door) continue;
    //         const x = door[0];
    //         const y = door[1];
    //         if (attachRoomAtXY(map, x, y, roomGrid, room, opts)) {
    //             return true;
    //         }
    //     }
    //     return false;
    // }
    // function attachRoomAtXY(
    //     map: GW.grid.NumGrid,
    //     x: number,
    //     y: number,
    //     roomGrid: GW.grid.NumGrid,
    //     room: TYPES.Room,
    //     opts: TYPES.DigInfo
    // ): boolean | GW.utils.Loc[] {
    //     const doorSites = room.hall ? room.hall.doors : room.doors;
    //     const dirs = GW.random.sequence(4);
    //     // console.log('attachRoomAtXY', x, y, doorSites.join(', '));
    //     for (let dir of dirs) {
    //         const oppDir = (dir + 2) % 4;
    //         const door = doorSites[oppDir];
    //         if (!door) continue;
    //         if (
    //             door[0] != -1 &&
    //             roomFitsAt(map, roomGrid, x - door[0], y - door[1])
    //         ) {
    //             // dungeon.debug("attachRoom: ", x, y, oppDir);
    //             // TYPES.Room fits here.
    //             const offX = x - door[0];
    //             const offY = y - door[1];
    //             GW.grid.offsetZip(map, roomGrid, offX, offY, (_d, _s, i, j) => {
    //                 map[i][j] = opts.room.tile || SITE.FLOOR;
    //             });
    //             attachDoor(map, room, opts, x, y, oppDir);
    //             room.translate(offX, offY);
    //             // const newDoors = doorSites.map((site) => {
    //             //     const x0 = site[0] + offX;
    //             //     const y0 = site[1] + offY;
    //             //     if (x0 == x && y0 == y) return [-1, -1] as GW.utils.Loc;
    //             //     return [x0, y0] as GW.utils.Loc;
    //             // });
    //             return true;
    //         }
    //     }
    //     return false;
    // }
    function copySite(dest, source, offsetX = 0, offsetY = 0) {
        GW.utils.forRect(dest.width, dest.height, (x, y) => {
            const otherX = x - offsetX;
            const otherY = y - offsetY;
            const v = source.getTile(otherX, otherY);
            if (!v)
                return;
            dest.setTile(x, y, v);
        });
    }

    var utils = {
        __proto__: null,
        directionOfDoorSite: directionOfDoorSite,
        chooseRandomDoorSites: chooseRandomDoorSites,
        copySite: copySite
    };

    const NOTHING = 0;
    const FLOOR = 1;
    const DOOR = 2;
    const WALL = 3;
    const DEEP = 4;
    const SHALLOW = 5;
    const BRIDGE = 6;
    const UP_STAIRS = 7;
    const DOWN_STAIRS = 17;
    const IMPREGNABLE = 8;
    const TILEMAP = {
        [NOTHING]: 'NULL',
        [FLOOR]: 'FLOOR',
        [DOOR]: 'DOOR',
        [WALL]: 'WALL',
        [IMPREGNABLE]: 'IMPREGNABLE',
        [DEEP]: 'LAKE',
        [SHALLOW]: 'SHALLOW',
        [BRIDGE]: 'BRIDGE',
        [UP_STAIRS]: 'UP_STAIRS',
        [DOWN_STAIRS]: 'DOWN_STAIRS',
    };
    const SEQ = [];
    function initSeqence(length) {
        SEQ.length = length;
        for (let i = 0; i < length; ++i) {
            SEQ[i] = i;
        }
        GW.random.shuffle(SEQ);
    }
    function fillCostGrid(source, costGrid) {
        costGrid.update((_v, x, y) => source.isPassable(x, y) ? 1 : GW.path.OBSTRUCTION);
    }
    const Fl = GW.flag.fl;
    var Flags;
    (function (Flags) {
        Flags[Flags["IS_IN_LOOP"] = Fl(0)] = "IS_IN_LOOP";
        Flags[Flags["IS_CHOKEPOINT"] = Fl(1)] = "IS_CHOKEPOINT";
        Flags[Flags["IS_GATE_SITE"] = Fl(2)] = "IS_GATE_SITE";
        Flags[Flags["IS_IN_ROOM_MACHINE"] = Fl(3)] = "IS_IN_ROOM_MACHINE";
        Flags[Flags["IS_IN_AREA_MACHINE"] = Fl(4)] = "IS_IN_AREA_MACHINE";
        Flags[Flags["IMPREGNABLE"] = Fl(5)] = "IMPREGNABLE";
        Flags[Flags["IS_IN_MACHINE"] = Flags.IS_IN_ROOM_MACHINE | Flags.IS_IN_AREA_MACHINE] = "IS_IN_MACHINE";
    })(Flags || (Flags = {}));
    class GridSite {
        constructor(width, height) {
            this.tiles = GW.grid.alloc(width, height);
            this.flags = GW.grid.alloc(width, height);
            this.choke = GW.grid.alloc(width, height);
        }
        free() {
            GW.grid.free(this.tiles);
            GW.grid.free(this.flags);
            GW.grid.free(this.choke);
        }
        get width() {
            return this.tiles.width;
        }
        get height() {
            return this.tiles.height;
        }
        hasXY(x, y) {
            return this.tiles.hasXY(x, y);
        }
        isBoundaryXY(x, y) {
            return this.tiles.isBoundaryXY(x, y);
        }
        isPassable(x, y) {
            return (this.isFloor(x, y) ||
                this.isDoor(x, y) ||
                this.isBridge(x, y) ||
                this.isStairs(x, y) ||
                this.isShallow(x, y));
        }
        isNothing(x, y) {
            const v = this.tiles.get(x, y);
            return v === NOTHING;
        }
        isDiggable(x, y) {
            const v = this.tiles.get(x, y);
            return v === NOTHING;
        }
        isFloor(x, y) {
            return this.tiles.get(x, y) == FLOOR;
        }
        isDoor(x, y) {
            const v = this.tiles.get(x, y);
            return v === DOOR;
        }
        isBridge(x, y) {
            const v = this.tiles.get(x, y);
            return v === BRIDGE;
        }
        isWall(x, y) {
            const v = this.tiles.get(x, y);
            return v === WALL || v === IMPREGNABLE;
        }
        isObstruction(x, y) {
            return this.isNothing(x, y) || this.isWall(x, y);
        }
        isStairs(x, y) {
            const v = this.tiles.get(x, y);
            return v === UP_STAIRS || v === DOWN_STAIRS;
        }
        isDeep(x, y) {
            return this.tiles.get(x, y) === DEEP;
        }
        isShallow(x, y) {
            return this.tiles.get(x, y) === SHALLOW;
        }
        isAnyWater(x, y) {
            return this.isDeep(x, y) || this.isShallow(x, y);
        }
        isSet(x, y) {
            return (this.tiles.get(x, y) || 0) > 0;
        }
        getTile(x, y) {
            return this.tiles.get(x, y) || 0;
        }
        setTile(x, y, tile) {
            if (this.tiles.hasXY(x, y))
                this.tiles[x][y] = tile;
        }
        hasSiteFlag(x, y, flag) {
            const have = this.flags.get(x, y) || 0;
            return !!(have & flag);
        }
        setSiteFlag(x, y, flag) {
            const value = (this.flags.get(x, y) || 0) | flag;
            this.flags.set(x, y, value);
        }
        clearSiteFlag(x, y, flag) {
            const value = (this.flags.get(x, y) || 0) & ~flag;
            this.flags.set(x, y, value);
        }
        getChokeCount(x, y) {
            return this.choke.get(x, y) || 0;
        }
        setChokeCount(x, y, count) {
            this.choke.set(x, y, count);
        }
    }

    var site = {
        __proto__: null,
        NOTHING: NOTHING,
        FLOOR: FLOOR,
        DOOR: DOOR,
        WALL: WALL,
        DEEP: DEEP,
        SHALLOW: SHALLOW,
        BRIDGE: BRIDGE,
        UP_STAIRS: UP_STAIRS,
        DOWN_STAIRS: DOWN_STAIRS,
        IMPREGNABLE: IMPREGNABLE,
        TILEMAP: TILEMAP,
        SEQ: SEQ,
        initSeqence: initSeqence,
        fillCostGrid: fillCostGrid,
        get Flags () { return Flags; },
        GridSite: GridSite
    };

    function checkConfig(config, expected = {}) {
        config = config || {};
        expected = expected || {};
        Object.entries(expected).forEach(([key, expect]) => {
            let have = config[key];
            if (key === 'tile') {
                if (have === undefined) {
                    config[key] = expect;
                }
                return;
            }
            if (expect === true) {
                // needs to be present
                if (!have) {
                    throw new Error('Missing required config for room digger: ' + key);
                }
            }
            else if (typeof expect === 'number') {
                // needs to be a number, this is the default
                have = have || expect;
            }
            else if (Array.isArray(expect)) {
                have = have || expect;
            }
            else {
                // just set the value
                have = have || expect;
            }
            const range = GW.range.make(have); // throws if invalid
            config[key] = range;
        });
        return config;
    }
    class RoomDigger {
        constructor(config, expected = {}) {
            this.options = {};
            this.doors = [];
            this._setOptions(config, expected);
        }
        _setOptions(config, expected = {}) {
            this.options = checkConfig(config, expected);
        }
        create(site) {
            const result = this.carve(site);
            if (result) {
                if (!result.doors ||
                    result.doors.length == 0 ||
                    result.doors.every((loc) => !loc || loc[0] == -1)) {
                    result.doors = chooseRandomDoorSites(site);
                }
            }
            return result;
        }
    }
    var rooms = {};
    class ChoiceRoom extends RoomDigger {
        constructor(config = {}) {
            super(config, {
                choices: ['DEFAULT'],
            });
        }
        _setOptions(config, expected = {}) {
            const choices = config.choices || expected.choices;
            if (Array.isArray(choices)) {
                this.randomRoom = GW.random.item.bind(GW.random, choices);
            }
            else if (typeof choices == 'object') {
                this.randomRoom = GW.random.weighted.bind(GW.random, choices);
            }
            else {
                throw new Error('Expected choices to be either array of room ids or weighted map - ex: { ROOM_ID: weight }');
            }
        }
        carve(site) {
            let id = this.randomRoom();
            const room = rooms[id];
            if (!room) {
                GW.utils.ERROR('Missing room digger choice: ' + id);
            }
            // debug('Chose room: ', id);
            return room.create(site);
        }
    }
    function choiceRoom(config, site) {
        // grid.fill(0);
        const digger = new ChoiceRoom(config);
        return digger.create(site);
    }
    class Cavern extends RoomDigger {
        constructor(config = {}) {
            super(config, {
                width: 12,
                height: 8,
            });
        }
        carve(site$1) {
            const width = this.options.width.value();
            const height = this.options.height.value();
            const tile = this.options.tile || FLOOR;
            const blobGrid = GW.grid.alloc(site$1.width, site$1.height, 0);
            const minWidth = Math.floor(0.5 * width); // 6
            const maxWidth = width;
            const minHeight = Math.floor(0.5 * height); // 4
            const maxHeight = height;
            const blob = new GW.blob.Blob({
                rounds: 5,
                minWidth: minWidth,
                minHeight: minHeight,
                maxWidth: maxWidth,
                maxHeight: maxHeight,
                percentSeeded: 55,
                birthParameters: 'ffffftttt',
                survivalParameters: 'ffffttttt',
            });
            const bounds = blob.carve(blobGrid.width, blobGrid.height, (x, y) => (blobGrid[x][y] = 1));
            // Position the new cave in the middle of the grid...
            const destX = Math.floor((site$1.width - bounds.width) / 2);
            const dx = destX - bounds.x;
            const destY = Math.floor((site$1.height - bounds.height) / 2);
            const dy = destY - bounds.y;
            // ...and copy it to the destination.
            blobGrid.forEach((v, x, y) => {
                if (v)
                    site$1.setTile(x + dx, y + dy, tile);
            });
            GW.grid.free(blobGrid);
            return new Room(destX, destY, bounds.width, bounds.height);
        }
    }
    function cavern(config, site) {
        // grid.fill(0);
        const digger = new Cavern(config);
        return digger.create(site);
    }
    // From BROGUE => This is a special room that appears at the entrance to the dungeon on depth 1.
    class BrogueEntrance extends RoomDigger {
        constructor(config = {}) {
            super(config, {
                width: 20,
                height: 10,
            });
        }
        carve(site$1) {
            const width = this.options.width.value();
            const height = this.options.height.value();
            const tile = this.options.tile || FLOOR;
            const roomWidth = Math.floor(0.4 * width); // 8
            const roomHeight = height;
            const roomWidth2 = width;
            const roomHeight2 = Math.floor(0.5 * height); // 5
            // ALWAYS start at bottom+center of map
            const roomX = Math.floor(site$1.width / 2 - roomWidth / 2 - 1);
            const roomY = site$1.height - roomHeight - 2;
            const roomX2 = Math.floor(site$1.width / 2 - roomWidth2 / 2 - 1);
            const roomY2 = site$1.height - roomHeight2 - 2;
            GW.utils.forRect(roomX, roomY, roomWidth, roomHeight, (x, y) => site$1.setTile(x, y, tile));
            GW.utils.forRect(roomX2, roomY2, roomWidth2, roomHeight2, (x, y) => site$1.setTile(x, y, tile));
            const room = new Room(Math.min(roomX, roomX2), Math.min(roomY, roomY2), Math.max(roomWidth, roomWidth2), Math.max(roomHeight, roomHeight2));
            room.doors[GW.utils.DOWN] = [
                Math.floor(site$1.width / 2),
                site$1.height - 2,
            ];
            return room;
        }
    }
    function brogueEntrance(config, site) {
        // grid.fill(0);
        const digger = new BrogueEntrance(config);
        return digger.create(site);
    }
    class Cross extends RoomDigger {
        constructor(config = {}) {
            super(config, { width: 12, height: 20 });
        }
        carve(site$1) {
            const width = this.options.width.value();
            const height = this.options.height.value();
            const tile = this.options.tile || FLOOR;
            const roomWidth = width;
            const roomWidth2 = Math.max(3, Math.floor((width * GW.random.range(25, 75)) / 100)); // [4,20]
            const roomHeight = Math.max(3, Math.floor((height * GW.random.range(25, 75)) / 100)); // [2,5]
            const roomHeight2 = height;
            const roomX = Math.floor((site$1.width - roomWidth) / 2);
            const roomX2 = roomX + GW.random.range(2, Math.max(2, roomWidth - roomWidth2 - 2));
            const roomY2 = Math.floor((site$1.height - roomHeight2) / 2);
            const roomY = roomY2 +
                GW.random.range(2, Math.max(2, roomHeight2 - roomHeight - 2));
            GW.utils.forRect(roomX, roomY, roomWidth, roomHeight, (x, y) => site$1.setTile(x, y, tile));
            GW.utils.forRect(roomX2, roomY2, roomWidth2, roomHeight2, (x, y) => site$1.setTile(x, y, tile));
            return new Room(roomX, roomY2, Math.max(roomWidth, roomWidth2), Math.max(roomHeight, roomHeight2));
        }
    }
    function cross(config, site) {
        // grid.fill(0);
        const digger = new Cross(config);
        return digger.create(site);
    }
    class SymmetricalCross extends RoomDigger {
        constructor(config = {}) {
            super(config, { width: 7, height: 7 });
        }
        carve(site$1) {
            const width = this.options.width.value();
            const height = this.options.height.value();
            const tile = this.options.tile || FLOOR;
            let minorWidth = Math.max(3, Math.floor((width * GW.random.range(25, 50)) / 100)); // [2,4]
            // if (height % 2 == 0 && minorWidth > 2) {
            //     minorWidth -= 1;
            // }
            let minorHeight = Math.max(3, Math.floor((height * GW.random.range(25, 50)) / 100)); // [2,3]?
            // if (width % 2 == 0 && minorHeight > 2) {
            //     minorHeight -= 1;
            // }
            const x = Math.floor((site$1.width - width) / 2);
            const y = Math.floor((site$1.height - minorHeight) / 2);
            GW.utils.forRect(x, y, width, minorHeight, (x, y) => site$1.setTile(x, y, tile));
            const x2 = Math.floor((site$1.width - minorWidth) / 2);
            const y2 = Math.floor((site$1.height - height) / 2);
            GW.utils.forRect(x2, y2, minorWidth, height, (x, y) => site$1.setTile(x, y, tile));
            return new Room(Math.min(x, x2), Math.min(y, y2), Math.max(width, minorWidth), Math.max(height, minorHeight));
        }
    }
    function symmetricalCross(config, site) {
        // grid.fill(0);
        const digger = new SymmetricalCross(config);
        return digger.create(site);
    }
    class Rectangular extends RoomDigger {
        constructor(config = {}) {
            super(config, {
                width: [3, 6],
                height: [3, 6],
            });
        }
        carve(site$1) {
            const width = this.options.width.value();
            const height = this.options.height.value();
            const tile = this.options.tile || FLOOR;
            const x = Math.floor((site$1.width - width) / 2);
            const y = Math.floor((site$1.height - height) / 2);
            GW.utils.forRect(x, y, width, height, (x, y) => site$1.setTile(x, y, tile));
            return new Room(x, y, width, height);
        }
    }
    function rectangular(config, site) {
        // grid.fill(0);
        const digger = new Rectangular(config);
        return digger.create(site);
    }
    class Circular extends RoomDigger {
        constructor(config = {}) {
            super(config, {
                radius: [3, 4],
            });
        }
        carve(site$1) {
            const radius = this.options.radius.value();
            const tile = this.options.tile || FLOOR;
            const x = Math.floor(site$1.width / 2);
            const y = Math.floor(site$1.height / 2);
            if (radius > 1) {
                GW.utils.forCircle(x, y, radius, (x, y) => site$1.setTile(x, y, tile));
            }
            return new Room(x - radius, y - radius, radius * 2 + 1, radius * 2 + 1);
        }
    }
    function circular(config, site) {
        // grid.fill(0);
        const digger = new Circular(config);
        return digger.create(site);
    }
    class BrogueDonut extends RoomDigger {
        constructor(config = {}) {
            super(config, {
                radius: [5, 10],
                ringMinWidth: 3,
                holeMinSize: 3,
                holeChance: 50,
            });
        }
        carve(site$1) {
            const radius = this.options.radius.value();
            const ringMinWidth = this.options.ringMinWidth.value();
            const holeMinSize = this.options.holeMinSize.value();
            const tile = this.options.tile || FLOOR;
            const x = Math.floor(site$1.width / 2);
            const y = Math.floor(site$1.height / 2);
            GW.utils.forCircle(x, y, radius, (x, y) => site$1.setTile(x, y, tile));
            if (radius > ringMinWidth + holeMinSize &&
                GW.random.chance(this.options.holeChance.value())) {
                GW.utils.forCircle(x, y, GW.random.range(holeMinSize, radius - holeMinSize), (x, y) => site$1.setTile(x, y, 0));
            }
            return new Room(x - radius, y - radius, radius * 2 + 1, radius * 2 + 1);
        }
    }
    function brogueDonut(config, site) {
        // grid.fill(0);
        const digger = new BrogueDonut(config);
        return digger.create(site);
    }
    class ChunkyRoom extends RoomDigger {
        constructor(config = {}) {
            super(config, {
                count: [2, 12],
                width: [5, 20],
                height: [5, 20],
            });
        }
        carve(site$1) {
            let i, x, y;
            let chunkCount = this.options.count.value();
            const width = this.options.width.value();
            const height = this.options.height.value();
            const tile = this.options.tile || FLOOR;
            const minX = Math.floor(site$1.width / 2) - Math.floor(width / 2);
            const maxX = Math.floor(site$1.width / 2) + Math.floor(width / 2);
            const minY = Math.floor(site$1.height / 2) - Math.floor(height / 2);
            const maxY = Math.floor(site$1.height / 2) + Math.floor(height / 2);
            let left = Math.floor(site$1.width / 2);
            let right = left;
            let top = Math.floor(site$1.height / 2);
            let bottom = top;
            GW.utils.forCircle(left, top, 2, (x, y) => site$1.setTile(x, y, tile));
            left -= 2;
            right += 2;
            top -= 2;
            bottom += 2;
            for (i = 0; i < chunkCount;) {
                x = GW.random.range(minX, maxX);
                y = GW.random.range(minY, maxY);
                if (site$1.isSet(x, y)) {
                    if (x - 2 < minX)
                        continue;
                    if (x + 2 > maxX)
                        continue;
                    if (y - 2 < minY)
                        continue;
                    if (y + 2 > maxY)
                        continue;
                    left = Math.min(x - 2, left);
                    right = Math.max(x + 2, right);
                    top = Math.min(y - 2, top);
                    bottom = Math.max(y + 2, bottom);
                    GW.utils.forCircle(x, y, 2, (x, y) => site$1.setTile(x, y, tile));
                    i++;
                }
            }
            return new Room(left, top, right - left + 1, bottom - top + 1);
        }
    }
    function chunkyRoom(config, site) {
        // grid.fill(0);
        const digger = new ChunkyRoom(config);
        return digger.create(site);
    }
    function install(id, room) {
        rooms[id] = room;
        return room;
    }
    install('DEFAULT', new Rectangular());

    var room = {
        __proto__: null,
        checkConfig: checkConfig,
        RoomDigger: RoomDigger,
        rooms: rooms,
        ChoiceRoom: ChoiceRoom,
        choiceRoom: choiceRoom,
        Cavern: Cavern,
        cavern: cavern,
        BrogueEntrance: BrogueEntrance,
        brogueEntrance: brogueEntrance,
        Cross: Cross,
        cross: cross,
        SymmetricalCross: SymmetricalCross,
        symmetricalCross: symmetricalCross,
        Rectangular: Rectangular,
        rectangular: rectangular,
        Circular: Circular,
        circular: circular,
        BrogueDonut: BrogueDonut,
        brogueDonut: brogueDonut,
        ChunkyRoom: ChunkyRoom,
        chunkyRoom: chunkyRoom,
        install: install
    };

    const DIRS$1 = GW.utils.DIRS;
    function isDoorLoc(site, loc, dir) {
        if (!site.hasXY(loc[0], loc[1]))
            return false;
        // TODO - boundary?
        if (!site.isDiggable(loc[0], loc[1]))
            return false; // must be a wall/diggable space
        const room = [loc[0] - dir[0], loc[1] - dir[1]];
        if (!site.hasXY(room[0], room[1]))
            return false;
        // TODO - boundary?
        if (!site.isFloor(room[0], room[1]))
            return false; // must have floor in opposite direction
        return true;
    }
    function pickWidth(opts = {}) {
        return GW.utils.clamp(_pickWidth(opts), 1, 3);
    }
    function _pickWidth(opts) {
        if (!opts)
            return 1;
        if (typeof opts === 'number')
            return opts;
        if (opts.width === undefined)
            return 1;
        let width = opts.width;
        if (typeof width === 'number')
            return width;
        else if (Array.isArray(width)) {
            // @ts-ignore
            width = GW.random.weighted(width) + 1;
        }
        else if (typeof width === 'string') {
            width = GW.range.make(width).value();
        }
        else {
            width = Number.parseInt(GW.random.weighted(width));
        }
        return width;
    }
    function pickLength(dir, lengths) {
        if (dir == GW.utils.UP || dir == GW.utils.DOWN) {
            return lengths[1].value();
        }
        else {
            return lengths[0].value();
        }
    }
    function pickHallDirection(site, doors, lengths) {
        // Pick a direction.
        let dir = GW.utils.NO_DIRECTION;
        if (dir == GW.utils.NO_DIRECTION) {
            const dirs = GW.random.sequence(4);
            for (let i = 0; i < 4; i++) {
                dir = dirs[i];
                const length = lengths[(i + 1) % 2].hi; // biggest measurement
                const door = doors[dir];
                if (door && door[0] != -1 && door[1] != -1) {
                    const dx = door[0] + Math.floor(DIRS$1[dir][0] * length);
                    const dy = door[1] + Math.floor(DIRS$1[dir][1] * length);
                    if (site.hasXY(dx, dy)) {
                        break; // That's our direction!
                    }
                }
                dir = GW.utils.NO_DIRECTION;
            }
        }
        return dir;
    }
    function pickHallExits(site, x, y, dir, obliqueChance) {
        let newX, newY;
        const allowObliqueHallwayExit = GW.random.chance(obliqueChance);
        const hallDoors = [
        // [-1, -1],
        // [-1, -1],
        // [-1, -1],
        // [-1, -1],
        ];
        for (let dir2 = 0; dir2 < 4; dir2++) {
            newX = x + DIRS$1[dir2][0];
            newY = y + DIRS$1[dir2][1];
            if ((dir2 != dir && !allowObliqueHallwayExit) ||
                !site.hasXY(newX, newY) ||
                site.isSet(newX, newY)) ;
            else {
                hallDoors[dir2] = [newX, newY];
            }
        }
        return hallDoors;
    }
    class HallDigger {
        constructor(options = {}) {
            this.config = {
                width: GW.range.make(1),
                length: [GW.range.make('2-15'), GW.range.make('2-9')],
                tile: FLOOR,
                obliqueChance: 15,
                chance: 100,
            };
            this._setOptions(options);
        }
        _setOptions(options = {}) {
            if (options.width) {
                this.config.width = GW.range.make(options.width);
            }
            if (options.length) {
                if (typeof options.length === 'number') {
                    const l = GW.range.make(options.length);
                    this.config.length = [l, l];
                }
            }
            if (options.tile) {
                this.config.tile = options.tile;
            }
            if (options.chance) {
                this.config.chance = options.chance;
            }
        }
        create(site, doors = []) {
            doors = doors || chooseRandomDoorSites(site);
            if (!GW.random.chance(this.config.chance))
                return null;
            const dir = pickHallDirection(site, doors, this.config.length);
            if (dir === GW.utils.NO_DIRECTION)
                return null;
            if (!doors[dir])
                return null;
            const width = this.config.width.value();
            const length = pickLength(dir, this.config.length);
            const doorLoc = doors[dir];
            if (width == 1) {
                return this.dig(site, dir, doorLoc, length);
            }
            else {
                return this.digWide(site, dir, doorLoc, length, width);
            }
        }
        _digLine(site, door, dir, length) {
            let x = door[0];
            let y = door[1];
            const tile = this.config.tile;
            for (let i = 0; i < length; i++) {
                site.setTile(x, y, tile);
                x += dir[0];
                y += dir[1];
            }
            x -= dir[0];
            y -= dir[1];
            return [x, y];
        }
        dig(site, dir, door, length) {
            const DIR = DIRS$1[dir];
            const [x, y] = this._digLine(site, door, DIR, length);
            const hall = new Hall(door, dir, length);
            hall.doors = pickHallExits(site, x, y, dir, this.config.obliqueChance);
            return hall;
        }
        digWide(site, dir, door, length, width) {
            const DIR = GW.utils.DIRS[dir];
            const lower = [door[0] - DIR[1], door[1] - DIR[0]];
            const higher = [door[0] + DIR[1], door[1] + DIR[0]];
            this._digLine(site, door, DIR, length);
            let actual = 1;
            let startX = door[0];
            let startY = door[1];
            if (actual < width && isDoorLoc(site, lower, DIR)) {
                this._digLine(site, lower, DIR, length);
                startX = Math.min(lower[0], startX);
                startY = Math.min(lower[1], startY);
                ++actual;
            }
            if (actual < width && isDoorLoc(site, higher, DIR)) {
                this._digLine(site, higher, DIR, length);
                startX = Math.min(higher[0], startX);
                startY = Math.min(higher[1], startY);
                ++actual;
            }
            const hall = new Hall([startX, startY], dir, length, width);
            hall.doors = [];
            hall.doors[dir] = [
                door[0] + length * DIR[0],
                door[1] + length * DIR[1],
            ];
            hall.width = width;
            return hall;
        }
    }
    function dig(config, site, doors) {
        const digger = new HallDigger(config);
        return digger.create(site, doors);
    }
    var halls = {};
    function install$1(id, hall) {
        // @ts-ignore
        halls[id] = hall;
        return hall;
    }
    install$1('DEFAULT', new HallDigger({ chance: 15 }));

    var hall = {
        __proto__: null,
        isDoorLoc: isDoorLoc,
        pickWidth: pickWidth,
        pickLength: pickLength,
        pickHallDirection: pickHallDirection,
        pickHallExits: pickHallExits,
        HallDigger: HallDigger,
        dig: dig,
        halls: halls,
        install: install$1
    };

    class Lakes {
        constructor(options = {}) {
            this.options = {
                height: 15,
                width: 30,
                minSize: 5,
                tries: 20,
                count: 1,
                canDisrupt: false,
                wreathTile: SHALLOW,
                wreathChance: 50,
                wreathSize: 1,
                tile: DEEP,
            };
            Object.assign(this.options, options);
        }
        create(site$1) {
            let i, j, k;
            let x, y;
            let lakeMaxHeight, lakeMaxWidth, lakeMinSize, tries, maxCount, canDisrupt;
            let count = 0;
            lakeMaxHeight = this.options.height || 15; // TODO - Make this a range "5-15"
            lakeMaxWidth = this.options.width || 30; // TODO - Make this a range "5-30"
            lakeMinSize = this.options.minSize || 5;
            tries = this.options.tries || 20;
            maxCount = this.options.count || 1;
            canDisrupt = this.options.canDisrupt || false;
            const hasWreath = GW.random.chance(this.options.wreathChance)
                ? true
                : false;
            const wreathTile = this.options.wreathTile || SHALLOW;
            const wreathSize = this.options.wreathSize || 1; // TODO - make this a range "0-2" or a weighted choice { 0: 50, 1: 40, 2" 10 }
            const tile = this.options.tile || DEEP;
            const lakeGrid = GW.grid.alloc(site$1.width, site$1.height, 0);
            let attempts = 0;
            while (attempts < maxCount && count < maxCount) {
                // lake generations
                const width = Math.round(((lakeMaxWidth - lakeMinSize) * (maxCount - attempts)) /
                    maxCount) + lakeMinSize;
                const height = Math.round(((lakeMaxHeight - lakeMinSize) * (maxCount - attempts)) /
                    maxCount) + lakeMinSize;
                const blob = new GW.blob.Blob({
                    rounds: 5,
                    minWidth: 4,
                    minHeight: 4,
                    maxWidth: width,
                    maxHeight: height,
                    percentSeeded: 55,
                    birthParameters: 'ffffftttt',
                    survivalParameters: 'ffffttttt',
                });
                const bounds = blob.carve(lakeGrid.width, lakeGrid.height, (x, y) => (lakeGrid[x][y] = 1));
                // lakeGrid.dump();
                let success = false;
                for (k = 0; k < tries && !success; k++) {
                    // placement attempts
                    // propose a position for the top-left of the lakeGrid in the dungeon
                    x = GW.random.range(1 - bounds.x, lakeGrid.width - bounds.width - bounds.x - 2);
                    y = GW.random.range(1 - bounds.y, lakeGrid.height - bounds.height - bounds.y - 2);
                    if (canDisrupt || !this.isDisruptedBy(site$1, lakeGrid, -x, -y)) {
                        // level with lake is completely connected
                        //   dungeon.debug("Placed a lake!", x, y);
                        success = true;
                        // copy in lake
                        for (i = 0; i < bounds.width; i++) {
                            // skip boundary
                            for (j = 0; j < bounds.height; j++) {
                                // skip boundary
                                if (lakeGrid[i + bounds.x][j + bounds.y]) {
                                    const sx = i + bounds.x + x;
                                    const sy = j + bounds.y + y;
                                    site$1.setTile(sx, sy, tile);
                                    if (hasWreath) {
                                        GW.utils.forCircle(sx, sy, wreathSize, (i, j) => {
                                            if (site$1.isPassable(i, j)
                                            // SITE.isFloor(map, i, j) ||
                                            // SITE.isDoor(map, i, j)
                                            ) {
                                                site$1.setTile(i, j, wreathTile);
                                            }
                                        });
                                    }
                                }
                            }
                        }
                        break;
                    }
                }
                if (success) {
                    ++count;
                }
                else {
                    ++attempts;
                }
            }
            GW.grid.free(lakeGrid);
            return count;
        }
        isDisruptedBy(site, lakeGrid, lakeToMapX = 0, lakeToMapY = 0) {
            const walkableGrid = GW.grid.alloc(site.width, site.height);
            let disrupts = false;
            // Get all walkable locations after lake added
            GW.utils.forRect(site.width, site.height, (i, j) => {
                const lakeX = i + lakeToMapX;
                const lakeY = j + lakeToMapY;
                if (lakeGrid.get(lakeX, lakeY)) {
                    if (site.isStairs(i, j)) {
                        disrupts = true;
                    }
                }
                else if (site.isPassable(i, j)) {
                    walkableGrid[i][j] = 1;
                }
            });
            let first = true;
            for (let i = 0; i < walkableGrid.width && !disrupts; ++i) {
                for (let j = 0; j < walkableGrid.height && !disrupts; ++j) {
                    if (walkableGrid[i][j] == 1) {
                        if (first) {
                            walkableGrid.floodFill(i, j, 1, 2);
                            first = false;
                        }
                        else {
                            disrupts = true;
                        }
                    }
                }
            }
            // console.log('WALKABLE GRID');
            // walkableGrid.dump();
            GW.grid.free(walkableGrid);
            return disrupts;
        }
    }

    var lake = {
        __proto__: null,
        Lakes: Lakes
    };

    class Bridges {
        constructor(options = {}) {
            this.options = {
                minDistance: 20,
                maxLength: 5,
            };
            Object.assign(this.options, options);
        }
        create(site$1) {
            let count = 0;
            let newX, newY;
            let i, j, d, x, y;
            const maxLength = this.options.maxLength;
            const minDistance = this.options.minDistance;
            const pathGrid = GW.grid.alloc(site$1.width, site$1.height);
            const costGrid = GW.grid.alloc(site$1.width, site$1.height);
            const dirCoords = [
                [1, 0],
                [0, 1],
            ];
            costGrid.update((_v, x, y) => site$1.isPassable(x, y) ? 1 : GW.path.OBSTRUCTION);
            const SEQ = GW.random.sequence(site$1.width * site$1.height);
            for (i = 0; i < SEQ.length; i++) {
                x = Math.floor(SEQ[i] / site$1.height);
                y = SEQ[i] % site$1.height;
                if (
                // map.hasXY(x, y) &&
                // map.get(x, y) &&
                site$1.isPassable(x, y) &&
                    !site$1.isAnyWater(x, y)) {
                    for (d = 0; d <= 1; d++) {
                        // Try right, then down
                        const bridgeDir = dirCoords[d];
                        newX = x + bridgeDir[0];
                        newY = y + bridgeDir[1];
                        j = maxLength;
                        // if (!map.hasXY(newX, newY)) continue;
                        // check for line of lake tiles
                        // if (isBridgeCandidate(newX, newY, bridgeDir)) {
                        if (site$1.isAnyWater(newX, newY)) {
                            for (j = 0; j < maxLength; ++j) {
                                newX += bridgeDir[0];
                                newY += bridgeDir[1];
                                // if (!isBridgeCandidate(newX, newY, bridgeDir)) {
                                if (!site$1.isAnyWater(newX, newY)) {
                                    break;
                                }
                            }
                        }
                        if (
                        // map.get(newX, newY) &&
                        site$1.isPassable(newX, newY) &&
                            j < maxLength) {
                            GW.path.calculateDistances(pathGrid, newX, newY, costGrid, false);
                            // pathGrid.fill(30000);
                            // pathGrid[newX][newY] = 0;
                            // dijkstraScan(pathGrid, costGrid, false);
                            if (pathGrid[x][y] > minDistance &&
                                pathGrid[x][y] < GW.path.NO_PATH) {
                                // and if the pathing distance between the two flanking floor tiles exceeds minDistance,
                                // dungeon.debug(
                                //     'Adding Bridge',
                                //     x,
                                //     y,
                                //     ' => ',
                                //     newX,
                                //     newY
                                // );
                                while (x !== newX || y !== newY) {
                                    if (this.isBridgeCandidate(site$1, x, y, bridgeDir)) {
                                        site$1.setTile(x, y, BRIDGE); // map[x][y] = SITE.BRIDGE;
                                        costGrid[x][y] = 1; // (Cost map also needs updating.)
                                    }
                                    else {
                                        site$1.setTile(x, y, FLOOR); // map[x][y] = SITE.FLOOR;
                                        costGrid[x][y] = 1;
                                    }
                                    x += bridgeDir[0];
                                    y += bridgeDir[1];
                                }
                                ++count;
                                break;
                            }
                        }
                    }
                }
            }
            GW.grid.free(pathGrid);
            GW.grid.free(costGrid);
            return count;
        }
        isBridgeCandidate(site, x, y, bridgeDir) {
            if (site.isBridge(x, y))
                return true;
            if (!site.isAnyWater(x, y))
                return false;
            if (!site.isAnyWater(x + bridgeDir[1], y + bridgeDir[0]))
                return false;
            if (!site.isAnyWater(x - bridgeDir[1], y - bridgeDir[0]))
                return false;
            return true;
        }
    }

    var bridge = {
        __proto__: null,
        Bridges: Bridges
    };

    class Stairs {
        constructor(options = {}) {
            this.options = {
                up: true,
                down: true,
                minDistance: 10,
                start: false,
                upTile: UP_STAIRS,
                downTile: DOWN_STAIRS,
                wall: IMPREGNABLE,
            };
            Object.assign(this.options, options);
        }
        create(site) {
            let needUp = this.options.up !== false;
            let needDown = this.options.down !== false;
            const minDistance = this.options.minDistance ||
                Math.floor(Math.max(site.width, site.height) / 2);
            const locations = {};
            let upLoc;
            let downLoc;
            const isValidLoc = this.isStairXY.bind(this, site);
            if (this.options.start && typeof this.options.start !== 'string') {
                let start = this.options.start;
                if (start === true) {
                    start = GW.random.matchingXY(site.width, site.height, isValidLoc);
                }
                else {
                    start = GW.random.matchingXYNear(GW.utils.x(start), GW.utils.y(start), isValidLoc);
                }
                locations.start = start;
            }
            if (Array.isArray(this.options.up) &&
                Array.isArray(this.options.down)) {
                const up = this.options.up;
                upLoc = GW.random.matchingXYNear(GW.utils.x(up), GW.utils.y(up), isValidLoc);
                const down = this.options.down;
                downLoc = GW.random.matchingXYNear(GW.utils.x(down), GW.utils.y(down), isValidLoc);
            }
            else if (Array.isArray(this.options.up) &&
                !Array.isArray(this.options.down)) {
                const up = this.options.up;
                upLoc = GW.random.matchingXYNear(GW.utils.x(up), GW.utils.y(up), isValidLoc);
                if (needDown) {
                    downLoc = GW.random.matchingXY(site.width, site.height, (x, y) => {
                        if (
                        // @ts-ignore
                        GW.utils.distanceBetween(x, y, upLoc[0], upLoc[1]) <
                            minDistance)
                            return false;
                        return isValidLoc(x, y);
                    });
                }
            }
            else if (Array.isArray(this.options.down) &&
                !Array.isArray(this.options.up)) {
                const down = this.options.down;
                downLoc = GW.random.matchingXYNear(GW.utils.x(down), GW.utils.y(down), isValidLoc);
                if (needUp) {
                    upLoc = GW.random.matchingXY(site.width, site.height, (x, y) => {
                        if (GW.utils.distanceBetween(x, y, 
                        // @ts-ignore
                        downLoc[0], 
                        // @ts-ignore
                        downLoc[1]) < minDistance)
                            return false;
                        return isValidLoc(x, y);
                    });
                }
            }
            else if (needUp) {
                upLoc = GW.random.matchingXY(site.width, site.height, isValidLoc);
                if (needDown) {
                    downLoc = GW.random.matchingXY(site.width, site.height, (x, y) => {
                        if (
                        // @ts-ignore
                        GW.utils.distanceBetween(x, y, upLoc[0], upLoc[1]) <
                            minDistance)
                            return false;
                        return isValidLoc(x, y);
                    });
                }
            }
            else if (needDown) {
                downLoc = GW.random.matchingXY(site.width, site.height, isValidLoc);
            }
            if (upLoc) {
                locations.up = upLoc.slice();
                this.setupStairs(site, upLoc[0], upLoc[1], this.options.upTile);
                if (this.options.start === 'up')
                    locations.start = locations.up;
            }
            if (downLoc !== undefined) {
                locations.down = downLoc.slice();
                this.setupStairs(site, downLoc[0], downLoc[1], this.options.downTile);
                if (this.options.start === 'down')
                    locations.start = locations.down;
            }
            return upLoc || downLoc ? locations : null;
        }
        hasXY(site, x, y) {
            if (x < 0 || y < 0)
                return false;
            if (x >= site.width || y >= site.height)
                return false;
            return true;
        }
        isStairXY(site, x, y) {
            let count = 0;
            if (!this.hasXY(site, x, y) || !site.isDiggable(x, y))
                return false;
            for (let i = 0; i < 4; ++i) {
                const dir = GW.utils.DIRS[i];
                if (!this.hasXY(site, x + dir[0], y + dir[1]))
                    return false;
                if (!this.hasXY(site, x - dir[0], y - dir[1]))
                    return false;
                if (site.isFloor(x + dir[0], y + dir[1])) {
                    count += 1;
                    if (!site.isDiggable(x - dir[0] + dir[1], y - dir[1] + dir[0]))
                        return false;
                    if (!site.isDiggable(x - dir[0] - dir[1], y - dir[1] - dir[0]))
                        return false;
                }
                else if (!site.isDiggable(x + dir[0], y + dir[1])) {
                    return false;
                }
            }
            return count == 1;
        }
        setupStairs(site, x, y, tile) {
            const indexes = GW.random.sequence(4);
            let dir = null;
            for (let i = 0; i < indexes.length; ++i) {
                dir = GW.utils.DIRS[i];
                const x0 = x + dir[0];
                const y0 = y + dir[1];
                if (site.isFloor(x0, y0)) {
                    if (site.isDiggable(x - dir[0], y - dir[1]))
                        break;
                }
                dir = null;
            }
            if (!dir)
                GW.utils.ERROR('No stair direction found!');
            site.setTile(x, y, tile);
            const dirIndex = GW.utils.CLOCK_DIRS.findIndex(
            // @ts-ignore
            (d) => d[0] == dir[0] && d[1] == dir[1]);
            const wall = this.options.wall;
            for (let i = 0; i < GW.utils.CLOCK_DIRS.length; ++i) {
                const l = i ? i - 1 : 7;
                const r = (i + 1) % 8;
                if (i == dirIndex || l == dirIndex || r == dirIndex)
                    continue;
                const d = GW.utils.CLOCK_DIRS[i];
                site.setTile(x + d[0], y + d[1], wall);
                // map.setCellFlags(x + d[0], y + d[1], Flags.Cell.IMPREGNABLE);
            }
            // dungeon.debug('setup stairs', x, y, tile);
            return true;
        }
    }

    var stairs = {
        __proto__: null,
        Stairs: Stairs
    };

    class LoopDigger {
        constructor(options = {}) {
            this.options = {
                minDistance: 100,
                maxLength: 1,
            };
            Object.assign(this.options, options);
        }
        create(site$1) {
            let startX, startY, endX, endY;
            let i, j, d, x, y;
            const minDistance = Math.min(this.options.minDistance, Math.floor(Math.max(site$1.width, site$1.height) / 2));
            const maxLength = this.options.maxLength;
            const pathGrid = GW.grid.alloc(site$1.width, site$1.height);
            const costGrid = GW.grid.alloc(site$1.width, site$1.height);
            const dirCoords = [
                [1, 0],
                [0, 1],
            ];
            fillCostGrid(site$1, costGrid);
            function isValidTunnelStart(x, y, dir) {
                if (!site$1.hasXY(x, y))
                    return false;
                if (!site$1.hasXY(x + dir[1], y + dir[0]))
                    return false;
                if (!site$1.hasXY(x - dir[1], y - dir[0]))
                    return false;
                if (site$1.isSet(x, y))
                    return false;
                if (site$1.isSet(x + dir[1], y + dir[0]))
                    return false;
                if (site$1.isSet(x - dir[1], y - dir[0]))
                    return false;
                return true;
            }
            function isValidTunnelEnd(x, y, dir) {
                if (!site$1.hasXY(x, y))
                    return false;
                if (!site$1.hasXY(x + dir[1], y + dir[0]))
                    return false;
                if (!site$1.hasXY(x - dir[1], y - dir[0]))
                    return false;
                if (site$1.isSet(x, y))
                    return true;
                if (site$1.isSet(x + dir[1], y + dir[0]))
                    return true;
                if (site$1.isSet(x - dir[1], y - dir[0]))
                    return true;
                return false;
            }
            let count = 0;
            for (i = 0; i < SEQ.length; i++) {
                x = Math.floor(SEQ[i] / site$1.height);
                y = SEQ[i] % site$1.height;
                if (!site$1.isSet(x, y)) {
                    for (d = 0; d <= 1; d++) {
                        // Try a horizontal door, and then a vertical door.
                        let dir = dirCoords[d];
                        if (!isValidTunnelStart(x, y, dir))
                            continue;
                        j = maxLength;
                        // check up/left
                        if (site$1.hasXY(x + dir[0], y + dir[1]) &&
                            site$1.isPassable(x + dir[0], y + dir[1])) {
                            // just can't build directly into a door
                            if (!site$1.hasXY(x - dir[0], y - dir[1]) ||
                                site$1.isDoor(x - dir[0], y - dir[1])) {
                                continue;
                            }
                        }
                        else if (site$1.hasXY(x - dir[0], y - dir[1]) &&
                            site$1.isPassable(x - dir[0], y - dir[1])) {
                            if (!site$1.hasXY(x + dir[0], y + dir[1]) ||
                                site$1.isDoor(x + dir[0], y + dir[1])) {
                                continue;
                            }
                            dir = dir.map((v) => -1 * v);
                        }
                        else {
                            continue; // not valid start for tunnel
                        }
                        startX = x + dir[0];
                        startY = y + dir[1];
                        endX = x;
                        endY = y;
                        for (j = 0; j < maxLength; ++j) {
                            endX -= dir[0];
                            endY -= dir[1];
                            // if (site.hasXY(endX, endY) && !grid.cell(endX, endY).isNull()) {
                            if (isValidTunnelEnd(endX, endY, dir)) {
                                break;
                            }
                        }
                        if (j < maxLength) {
                            GW.path.calculateDistances(pathGrid, startX, startY, costGrid, false);
                            // pathGrid.fill(30000);
                            // pathGrid[startX][startY] = 0;
                            // dijkstraScan(pathGrid, costGrid, false);
                            if (pathGrid[endX][endY] > minDistance &&
                                pathGrid[endX][endY] < 30000) {
                                // and if the pathing distance between the two flanking floor tiles exceeds minDistance,
                                // dungeon.debug(
                                //     'Adding Loop',
                                //     startX,
                                //     startY,
                                //     ' => ',
                                //     endX,
                                //     endY,
                                //     ' : ',
                                //     pathGrid[endX][endY]
                                // );
                                while (endX !== startX || endY !== startY) {
                                    if (site$1.isNothing(endX, endY)) {
                                        site$1.setTile(endX, endY, FLOOR);
                                        costGrid[endX][endY] = 1; // (Cost map also needs updating.)
                                    }
                                    endX += dir[0];
                                    endY += dir[1];
                                }
                                // TODO - Door is optional
                                site$1.setTile(x, y, DOOR); // then turn the tile into a doorway.
                                ++count;
                                break;
                            }
                        }
                    }
                }
            }
            GW.grid.free(pathGrid);
            GW.grid.free(costGrid);
            return count;
        }
    }
    // Add some loops to the otherwise simply connected network of rooms.
    function digLoops(site, opts = {}) {
        const digger = new LoopDigger(opts);
        return digger.create(site);
    }

    var loop = {
        __proto__: null,
        LoopDigger: LoopDigger,
        digLoops: digLoops
    };

    class Level {
        constructor(width, height, options = {}) {
            this.rooms = {};
            this.doors = { chance: 15 };
            this.halls = { chance: 15 };
            this.loops = {};
            this.lakes = {};
            this.bridges = {};
            this.stairs = {};
            this.boundary = true;
            this.startLoc = [-1, -1];
            this.endLoc = [-1, -1];
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
        makeSite(width, height) {
            return new GridSite(width, height);
        }
        create(setFn) {
            const site = this.makeSite(this.width, this.height);
            this.start(site);
            let tries = 20;
            while (--tries) {
                if (this.addFirstRoom(site))
                    break;
            }
            if (!tries)
                throw new Error('Failed to place first room!');
            let fails = 0;
            while (fails < 20) {
                if (this.addRoom(site)) {
                    fails = 0;
                }
                else {
                    ++fails;
                }
            }
            this.addLoops(site, this.loops);
            this.addLakes(site, this.lakes);
            this.addBridges(site, this.bridges);
            this.addStairs(site, this.stairs);
            this.finish(site);
            GW.utils.forRect(this.width, this.height, (x, y) => {
                const t = site.getTile(x, y);
                if (t)
                    setFn(x, y, t);
            });
            site.free();
            return true;
        }
        start(_site) {
            initSeqence(this.width * this.height);
        }
        getDigger(id) {
            if (!id)
                throw new Error('Missing digger!');
            if (id instanceof RoomDigger)
                return id;
            if (typeof id === 'string') {
                const digger = rooms[id];
                if (!digger) {
                    throw new Error('Failed to find digger - ' + id);
                }
                return digger;
            }
            return new ChoiceRoom(id);
        }
        addFirstRoom(site) {
            const roomSite = this.makeSite(this.width, this.height);
            let digger = this.getDigger(this.rooms.first || this.rooms.digger || 'DEFAULT');
            let room = digger.create(roomSite);
            if (room &&
                !this._attachRoomAtLoc(site, roomSite, room, this.startLoc)) {
                room = null;
            }
            roomSite.free();
            // Should we add the starting stairs now too?
            return room;
        }
        addRoom(site) {
            const roomSite = this.makeSite(this.width, this.height);
            let digger = this.getDigger(this.rooms.digger || 'DEFAULT');
            let room = digger.create(roomSite);
            // attach hall?
            if (this.halls.chance) {
                let hall$1 = dig(this.halls, roomSite, room.doors);
                if (hall$1) {
                    room.hall = hall$1;
                }
            }
            if (room && !this._attachRoom(site, roomSite, room)) {
                room = null;
            }
            roomSite.free();
            return room;
        }
        _attachRoom(site$1, roomSite, room) {
            // console.log('attachRoom');
            const doorSites = room.hall ? room.hall.doors : room.doors;
            // Slide hyperspace across real space, in a random but predetermined order, until the room matches up with a wall.
            for (let i = 0; i < SEQ.length; i++) {
                const x = Math.floor(SEQ[i] / this.height);
                const y = SEQ[i] % this.height;
                if (!site$1.isNothing(x, y))
                    continue;
                const dir = directionOfDoorSite(site$1, x, y);
                if (dir != GW.utils.NO_DIRECTION) {
                    const oppDir = (dir + 2) % 4;
                    const door = doorSites[oppDir];
                    if (!door)
                        continue;
                    const offsetX = x - door[0];
                    const offsetY = y - door[1];
                    if (door[0] != -1 &&
                        this._roomFitsAt(site$1, roomSite, offsetX, offsetY)) {
                        // TYPES.Room fits here.
                        copySite(site$1, roomSite, offsetX, offsetY);
                        this._attachDoor(site$1, room, x, y, oppDir);
                        // door[0] = -1;
                        // door[1] = -1;
                        room.translate(offsetX, offsetY);
                        return true;
                    }
                }
            }
            return false;
        }
        _attachRoomAtLoc(site, roomSite, room, attachLoc) {
            const [x, y] = attachLoc;
            const doorSites = room.hall ? room.hall.doors : room.doors;
            const dirs = GW.random.sequence(4);
            // console.log('attachRoomAtXY', x, y, doorSites.join(', '));
            for (let dir of dirs) {
                const oppDir = (dir + 2) % 4;
                const door = doorSites[oppDir];
                if (!door || door[0] == -1)
                    continue;
                const offX = x - door[0];
                const offY = y - door[1];
                if (this._roomFitsAt(site, roomSite, offX, offY)) {
                    // dungeon.debug("attachRoom: ", x, y, oppDir);
                    // TYPES.Room fits here.
                    copySite(site, roomSite, offX, offY);
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
        _roomFitsAt(map, roomGrid, roomToSiteX, roomToSiteY) {
            let xRoom, yRoom, xSite, ySite, i, j;
            // console.log('roomFitsAt', roomToSiteX, roomToSiteY);
            for (xRoom = 0; xRoom < roomGrid.width; xRoom++) {
                for (yRoom = 0; yRoom < roomGrid.height; yRoom++) {
                    if (roomGrid.isSet(xRoom, yRoom)) {
                        xSite = xRoom + roomToSiteX;
                        ySite = yRoom + roomToSiteY;
                        for (i = xSite - 1; i <= xSite + 1; i++) {
                            for (j = ySite - 1; j <= ySite + 1; j++) {
                                if (!map.hasXY(i, j) ||
                                    map.isBoundaryXY(i, j) ||
                                    !map.isNothing(i, j)) {
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
        _attachDoor(map, room, x, y, dir) {
            const opts = this.doors;
            if (opts.chance === 0)
                return; // no door at all
            const isDoor = opts.chance && GW.random.chance(opts.chance); // did not pass chance
            const tile = isDoor ? opts.tile || DOOR : FLOOR;
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
            }
            else {
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
        addLoops(site, opts) {
            const digger = new LoopDigger(opts);
            return digger.create(site);
        }
        addLakes(site, opts) {
            const digger = new Lakes(opts);
            return digger.create(site);
        }
        addBridges(site, opts) {
            const digger = new Bridges(opts);
            return digger.create(site);
        }
        addStairs(site, opts) {
            const digger = new Stairs(opts);
            return digger.create(site);
        }
        finish(site) {
            this._removeDiagonalOpenings(site);
            this._finishWalls(site);
            this._finishDoors(site);
        }
        _removeDiagonalOpenings(site$1) {
            let i, j, k, x1, y1;
            let diagonalCornerRemoved;
            do {
                diagonalCornerRemoved = false;
                for (i = 0; i < this.width - 1; i++) {
                    for (j = 0; j < this.height - 1; j++) {
                        for (k = 0; k <= 1; k++) {
                            if (site$1.isPassable(i + k, j) &&
                                !site$1.isPassable(i + (1 - k), j) &&
                                site$1.isObstruction(i + (1 - k), j) &&
                                !site$1.isPassable(i + k, j + 1) &&
                                site$1.isObstruction(i + k, j + 1) &&
                                site$1.isPassable(i + (1 - k), j + 1)) {
                                if (GW.random.chance(50)) {
                                    x1 = i + (1 - k);
                                    y1 = j;
                                }
                                else {
                                    x1 = i + k;
                                    y1 = j + 1;
                                }
                                diagonalCornerRemoved = true;
                                site$1.setTile(x1, y1, FLOOR); // todo - pick one of the passable tiles around it...
                            }
                        }
                    }
                }
            } while (diagonalCornerRemoved == true);
        }
        _finishDoors(site$1) {
            GW.utils.forRect(this.width, this.height, (x, y) => {
                if (site$1.isBoundaryXY(x, y))
                    return;
                // todo - isDoorway...
                if (site$1.isDoor(x, y)) {
                    if (
                    // TODO - isPassable
                    (site$1.isFloor(x + 1, y) || site$1.isFloor(x - 1, y)) &&
                        (site$1.isFloor(x, y + 1) || site$1.isFloor(x, y - 1))) {
                        // If there's passable terrain to the left or right, and there's passable terrain
                        // above or below, then the door is orphaned and must be removed.
                        site$1.setTile(x, y, FLOOR); // todo - take passable neighbor value
                    }
                    else if ((site$1.isObstruction(x + 1, y) ? 1 : 0) +
                        (site$1.isObstruction(x - 1, y) ? 1 : 0) +
                        (site$1.isObstruction(x, y + 1) ? 1 : 0) +
                        (site$1.isObstruction(x, y - 1) ? 1 : 0) >=
                        3) {
                        // If the door has three or more pathing blocker neighbors in the four cardinal directions,
                        // then the door is orphaned and must be removed.
                        site$1.setTile(x, y, FLOOR); // todo - take passable neighbor
                    }
                }
            });
        }
        _finishWalls(site$1) {
            const boundaryTile = this.boundary ? IMPREGNABLE : WALL;
            GW.utils.forRect(this.width, this.height, (x, y) => {
                if (site$1.isNothing(x, y)) {
                    if (site$1.isBoundaryXY(x, y)) {
                        site$1.setTile(x, y, boundaryTile);
                    }
                    else {
                        site$1.setTile(x, y, WALL);
                    }
                }
            });
        }
    }

    class Dungeon {
        constructor(options = {}) {
            this.config = {
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
            this.seeds = [];
            this.stairLocs = [];
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
                this.seeds[i] = GW.random.number(2 ** 32);
            }
        }
        initStairLocs() {
            let startLoc = this.config.startLoc || [
                Math.floor(this.config.width / 2),
                this.config.height - 2,
            ];
            const minDistance = this.config.stairDistance ||
                Math.floor(Math.max(this.config.width / 2, this.config.height / 2));
            for (let i = 0; i < this.config.levels; ++i) {
                const endLoc = GW.random.matchingXY(this.config.width, this.config.height, (x, y) => {
                    return (GW.utils.distanceBetween(startLoc[0], startLoc[1], x, y) > minDistance);
                });
                this.stairLocs.push([
                    [startLoc[0], startLoc[1]],
                    [endLoc[0], endLoc[1]],
                ]);
                startLoc = endLoc;
            }
        }
        getLevel(id, cb) {
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
            }
            else {
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
        makeLevel(id, opts, cb) {
            const level = new Level(this.config.width, this.config.height, opts);
            const result = level.create(cb);
            if (!GW.utils.equalsXY(level.endLoc, opts.endLoc) ||
                !GW.utils.equalsXY(level.startLoc, opts.startLoc)) {
                this.stairLocs[id] = [level.startLoc, level.endLoc];
            }
            return result;
        }
    }

    // import * as GW from 'gw-utils';
    // export function start(grid: GW.grid.NumGrid) {
    //     SITE.initSeqence(grid.width * grid.height);
    //     grid.fill(0);
    // }
    // export function finish(grid: GW.grid.NumGrid) {
    //     removeDiagonalOpenings(grid);
    //     finishWalls(grid);
    //     finishDoors(grid);
    // }
    // // Returns an array of door sites if successful
    // export function addRoom(
    //     map: GW.grid.NumGrid,
    //     opts?: string | TYPES.DigConfig
    // ): TYPES.Room | null {
    //     opts = opts || { room: 'DEFAULT', hall: 'DEFAULT', tries: 10 };
    //     if (typeof opts === 'string') {
    //         opts = { room: opts };
    //     }
    //     if (opts.loc) {
    //         opts.locs = [opts.loc];
    //     }
    //     let roomDigger: ROOM.RoomDigger;
    //     if (typeof opts.room === 'function') opts.room = opts.room();
    //     if (!opts.room) roomDigger = ROOM.rooms.DEFAULT;
    //     else if (typeof opts.room === 'string') {
    //         const name = opts.room;
    //         roomDigger = ROOM.rooms[name];
    //         if (!roomDigger) {
    //             throw new Error('Failed to find room: ' + name);
    //         }
    //     } else if (opts.room instanceof ROOM.RoomDigger) {
    //         roomDigger = opts.room;
    //     } else {
    //         throw new Error('No room to build!');
    //     }
    //     // const roomConfig = opts.room as TYPES.RoomConfig;
    //     let hallConfig: TYPES.HallData | null = null;
    //     if (opts.hall === true) opts.hall = 'DEFAULT';
    //     if (opts.hall !== false && !opts.hall) opts.hall = 'DEFAULT';
    //     if (typeof opts.hall === 'function') opts.hall = { fn: opts.hall };
    //     if (typeof opts.hall === 'string') {
    //         const name = opts.hall;
    //         opts.hall = HALL.halls[name];
    //         if (!opts.hall) {
    //             GW.utils.ERROR('Failed to find hall: ' + name);
    //             return null;
    //         }
    //         hallConfig = opts.hall as TYPES.HallData;
    //     } else {
    //         if (opts.hall && opts.hall.fn) {
    //             hallConfig = opts.hall as TYPES.HallData;
    //         }
    //     }
    //     if (opts.door === false) {
    //         opts.door = 0;
    //     } else if (opts.door === true) {
    //         opts.door = SITE.DOOR;
    //     } else if (typeof opts.door === 'number') {
    //         opts.door = GW.random.chance(opts.door) ? SITE.DOOR : SITE.FLOOR;
    //     } else {
    //         opts.door = SITE.FLOOR;
    //     }
    //     let locs = opts.locs || null;
    //     // @ts-ignore
    //     if (locs && locs.doors) locs = locs.doors;
    //     if (!locs || !Array.isArray(locs)) {
    //         locs = null;
    //         if (map.count(SITE.FLOOR) === 0) {
    //             // empty map
    //             const x = Math.floor(map.width / 2);
    //             const y = map.height - 2;
    //             locs = [[x, y]];
    //         }
    //     } else if (
    //         locs &&
    //         locs.length &&
    //         locs.length == 2 &&
    //         typeof locs[0] == 'number'
    //     ) {
    //         // @ts-ignore
    //         locs = [locs];
    //     } else if (locs.length == 0) {
    //         locs = null;
    //     }
    //     const roomGrid = GW.grid.alloc(map.width, map.height);
    //     const site = new SITE.GridSite(roomGrid);
    //     let attachHall = false;
    //     if (hallConfig) {
    //         let hallChance =
    //             hallConfig.chance !== undefined ? hallConfig.chance : 15;
    //         attachHall = GW.random.chance(hallChance);
    //     }
    //     // const force = config.force || false;
    //     let room: TYPES.Room | null = null;
    //     let result: boolean | GW.utils.Loc[] = false;
    //     let tries = opts.tries || 10;
    //     while (--tries >= 0 && !result) {
    //         roomGrid.fill(SITE.NOTHING);
    //         // dig the room in the center
    //         room = roomDigger.create(site);
    //         // optionally add a hall
    //         if (attachHall) {
    //             const hallDigger = new HALL.HallDigger();
    //             room.hall = hallDigger.create(site, room.doors);
    //         }
    //         if (locs) {
    //             // try the doors first
    //             result = UTILS.attachRoomAtMapDoor(
    //                 map,
    //                 locs,
    //                 roomGrid,
    //                 room,
    //                 opts as TYPES.DigInfo
    //             );
    //         } else {
    //             result = UTILS.attachRoom(
    //                 map,
    //                 roomGrid,
    //                 room,
    //                 opts as TYPES.DigInfo
    //             );
    //         }
    //         // console.log(
    //         //     'try',
    //         //     room.hall ? 'hall: ' + room.hall.dir : 'no hall',
    //         //     result
    //         // );
    //         // if (!result) {
    //         //     roomGrid.dump();
    //         //     map.dump();
    //         //     console.log(
    //         //         'room doors',
    //         //         (room.hall ? room.hall.doors : room.doors).join(', ')
    //         //     );
    //         //     console.log('map locs', locs.join(', '));
    //         // }
    //     }
    //     GW.grid.free(roomGrid);
    //     return room && result ? room : null;
    // }
    // // Add some loops to the otherwise simply connected network of rooms.
    // export function addLoops(
    //     grid: GW.grid.NumGrid,
    //     minDistance: number,
    //     maxLength: number
    // ) {
    //     return LOOP.digLoops(grid, { minDistance, maxLength });
    // }
    // export function addLakes(
    //     map: GW.grid.NumGrid,
    //     opts: Partial<LAKE.LakeOpts> = {}
    // ) {
    //     const lakes = new LAKE.Lakes(opts);
    //     const site = new SITE.GridSite(map);
    //     return lakes.create(site);
    // }
    // export function addBridges(
    //     grid: GW.grid.NumGrid,
    //     opts: Partial<BRIDGE.BridgeOpts> = {}
    // ) {
    //     const bridges = new BRIDGE.Bridges(opts);
    //     const site = new SITE.GridSite(grid);
    //     return bridges.create(site);
    // }
    // export function addStairs(
    //     grid: GW.grid.NumGrid,
    //     opts: Partial<STAIRS.StairOpts> = {}
    // ) {
    //     const stairs = new STAIRS.Stairs(opts);
    //     const site = new SITE.GridSite(grid);
    //     return stairs.create(site);
    // }
    // export function removeDiagonalOpenings(grid: GW.grid.NumGrid) {
    //     let i, j, k, x1, y1;
    //     let diagonalCornerRemoved;
    //     const site = new SITE.GridSite(grid);
    //     do {
    //         diagonalCornerRemoved = false;
    //         for (i = 0; i < grid.width - 1; i++) {
    //             for (j = 0; j < grid.height - 1; j++) {
    //                 for (k = 0; k <= 1; k++) {
    //                     if (
    //                         site.isPassable(i + k, j) &&
    //                         !site.isPassable(i + (1 - k), j) &&
    //                         site.isObstruction(i + (1 - k), j) &&
    //                         !site.isPassable(i + k, j + 1) &&
    //                         site.isObstruction(i + k, j + 1) &&
    //                         site.isPassable(i + (1 - k), j + 1)
    //                     ) {
    //                         if (GW.random.chance(50)) {
    //                             x1 = i + (1 - k);
    //                             y1 = j;
    //                         } else {
    //                             x1 = i + k;
    //                             y1 = j + 1;
    //                         }
    //                         diagonalCornerRemoved = true;
    //                         grid[x1][y1] = SITE.FLOOR; // todo - pick one of the passable tiles around it...
    //                     }
    //                 }
    //             }
    //         }
    //     } while (diagonalCornerRemoved == true);
    // }
    // export function finishDoors(grid: GW.grid.NumGrid) {
    //     grid.forEach((cell, x, y) => {
    //         if (grid.isBoundaryXY(x, y)) return;
    //         // todo - isDoorway...
    //         if (cell == SITE.DOOR) {
    //             if (
    //                 // TODO - isPassable
    //                 (grid.get(x + 1, y) == SITE.FLOOR ||
    //                     grid.get(x - 1, y) == SITE.FLOOR) &&
    //                 (grid.get(x, y + 1) == SITE.FLOOR ||
    //                     grid.get(x, y - 1) == SITE.FLOOR)
    //             ) {
    //                 // If there's passable terrain to the left or right, and there's passable terrain
    //                 // above or below, then the door is orphaned and must be removed.
    //                 grid[x][y] = SITE.FLOOR; // todo - take passable neighbor value
    //             } else if (
    //                 // todo - isPassable
    //                 (grid.get(x + 1, y) !== SITE.FLOOR ? 1 : 0) +
    //                     (grid.get(x - 1, y) !== SITE.FLOOR ? 1 : 0) +
    //                     (grid.get(x, y + 1) !== SITE.FLOOR ? 1 : 0) +
    //                     (grid.get(x, y - 1) !== SITE.FLOOR ? 1 : 0) >=
    //                 3
    //             ) {
    //                 // If the door has three or more pathing blocker neighbors in the four cardinal directions,
    //                 // then the door is orphaned and must be removed.
    //                 grid[x][y] = SITE.FLOOR; // todo - take passable neighbor
    //             }
    //         }
    //     });
    // }
    // export function finishWalls(grid: GW.grid.NumGrid, tile: number = SITE.WALL) {
    //     grid.forEach((cell, i, j) => {
    //         if (cell == SITE.NOTHING) {
    //             grid[i][j] = tile;
    //         }
    //     });
    // }

    var index = {
        __proto__: null,
        room: room,
        hall: hall,
        lake: lake,
        bridge: bridge,
        stairs: stairs,
        utils: utils,
        loop: loop,
        Hall: Hall,
        Room: Room,
        Level: Level,
        Dungeon: Dungeon
    };

    const Fl$1 = GW.flag.fl;
    var Flags$1;
    (function (Flags) {
        Flags[Flags["BP_ROOM"] = Fl$1(10)] = "BP_ROOM";
        Flags[Flags["BP_VESTIBULE"] = Fl$1(1)] = "BP_VESTIBULE";
        Flags[Flags["BP_REWARD"] = Fl$1(7)] = "BP_REWARD";
        Flags[Flags["BP_ADOPT_ITEM"] = Fl$1(0)] = "BP_ADOPT_ITEM";
        Flags[Flags["BP_PURGE_PATHING_BLOCKERS"] = Fl$1(2)] = "BP_PURGE_PATHING_BLOCKERS";
        Flags[Flags["BP_PURGE_INTERIOR"] = Fl$1(3)] = "BP_PURGE_INTERIOR";
        Flags[Flags["BP_PURGE_LIQUIDS"] = Fl$1(4)] = "BP_PURGE_LIQUIDS";
        Flags[Flags["BP_SURROUND_WITH_WALLS"] = Fl$1(5)] = "BP_SURROUND_WITH_WALLS";
        Flags[Flags["BP_IMPREGNABLE"] = Fl$1(6)] = "BP_IMPREGNABLE";
        Flags[Flags["BP_OPEN_INTERIOR"] = Fl$1(8)] = "BP_OPEN_INTERIOR";
        Flags[Flags["BP_MAXIMIZE_INTERIOR"] = Fl$1(9)] = "BP_MAXIMIZE_INTERIOR";
        Flags[Flags["BP_REDESIGN_INTERIOR"] = Fl$1(14)] = "BP_REDESIGN_INTERIOR";
        Flags[Flags["BP_TREAT_AS_BLOCKING"] = Fl$1(11)] = "BP_TREAT_AS_BLOCKING";
        Flags[Flags["BP_REQUIRE_BLOCKING"] = Fl$1(12)] = "BP_REQUIRE_BLOCKING";
        Flags[Flags["BP_NO_INTERIOR_FLAG"] = Fl$1(13)] = "BP_NO_INTERIOR_FLAG";
    })(Flags$1 || (Flags$1 = {}));
    class Blueprint {
        constructor(opts = {}) {
            this.tags = [];
            this.size = [-1, -1];
            this.flags = 0;
            if (opts.tags) {
                if (typeof opts.tags === 'string') {
                    opts.tags = opts.tags.split(/[,|]/).map((v) => v.trim());
                }
                this.tags = opts.tags;
            }
            this.frequency = GW.frequency.make(opts.frequency || 100);
            if (opts.size) {
                if (typeof opts.size === 'string') {
                    const parts = opts.size
                        .split(/[,|]/)
                        .map((v) => v.trim())
                        .map((v) => Number.parseInt(v));
                    if (parts.length !== 2)
                        throw new Error('Blueprint size must be of format: #-#');
                    this.size = [parts[0], parts[1]];
                }
                else if (Array.isArray(opts.size)) {
                    if (opts.size.length !== 2)
                        throw new Error('Blueprint size must be [min, max]');
                    this.size = [opts.size[0], opts.size[1]];
                }
                else {
                    throw new Error('size must be string or array.');
                }
                if (this.size[0] > this.size[1])
                    throw new Error('Blueprint size must be small to large.');
            }
            if (opts.flags) {
                this.flags = GW.flag.from(Flags$1, opts.flags);
            }
        }
        getChance(level, tags) {
            if (tags && tags.length) {
                if (typeof tags === 'string') {
                    tags = tags.split(/[,|]/).map((v) => v.trim());
                }
                // Must match all tags!
                if (!tags.every((want) => this.tags.includes(want)))
                    return 0;
            }
            return this.frequency(level);
        }
        get isRoom() {
            return this.flags & Flags$1.BP_ROOM;
        }
        get isReward() {
            return this.flags & Flags$1.BP_REWARD;
        }
        get isVestiblue() {
            return this.flags & Flags$1.BP_VESTIBULE;
        }
        get adoptsItem() {
            return this.flags & Flags$1.BP_ADOPT_ITEM;
        }
    }
    const blueprints = {};
    function install$2(id, blueprint) {
        blueprints[id] = blueprint;
    }

    var blueprint = {
        __proto__: null,
        get Flags () { return Flags$1; },
        Blueprint: Blueprint,
        blueprints: blueprints,
        install: install$2
    };

    // import { LoopFinder } from './loopFinder';
    class ChokeFinder {
        constructor(withCounts = false) {
            this.withCounts = withCounts;
        }
        /////////////////////////////////////////////////////
        /////////////////////////////////////////////////////
        // TODO - Move to Map?
        compute(site) {
            const floodGrid = GW.grid.alloc(site.width, site.height);
            const passMap = GW.grid.alloc(site.width, site.height);
            passMap.update((_v, x, y) => (site.isPassable(x, y) ? 1 : 0));
            // Assume loops are done already!
            // const loopFinder = new LoopFinder();
            // loopFinder.compute(
            //     site
            // );
            let passableArcCount;
            // done finding loops; now flag chokepoints
            for (let i = 1; i < passMap.width - 1; i++) {
                for (let j = 1; j < passMap.height - 1; j++) {
                    site.clearSiteFlag(i, j, Flags.IS_CHOKEPOINT);
                    site.setChokeCount(i, j, 30000);
                    if (passMap[i][j] && !site.hasSiteFlag(i, j, Flags.IS_IN_LOOP)) {
                        passableArcCount = 0;
                        for (let dir = 0; dir < 8; dir++) {
                            const oldX = i + GW.utils.CLOCK_DIRS[(dir + 7) % 8][0];
                            const oldY = j + GW.utils.CLOCK_DIRS[(dir + 7) % 8][1];
                            const newX = i + GW.utils.CLOCK_DIRS[dir][0];
                            const newY = j + GW.utils.CLOCK_DIRS[dir][1];
                            if (passMap.hasXY(newX, newY) &&
                                passMap.hasXY(oldX, oldY) &&
                                passMap[newX][newY] != passMap[oldX][oldY]) {
                                if (++passableArcCount > 2) {
                                    if ((!passMap[i - 1][j] &&
                                        !passMap[i + 1][j]) ||
                                        (!passMap[i][j - 1] && !passMap[i][j + 1])) {
                                        site.setSiteFlag(i, j, Flags.IS_CHOKEPOINT);
                                    }
                                    break;
                                }
                            }
                        }
                    }
                }
            }
            if (this.withCounts) {
                // Done finding chokepoints; now create a chokepoint map.
                // The chokepoint map is a number for each passable tile. If the tile is a chokepoint,
                // then the number indicates the number of tiles that would be rendered unreachable if the
                // chokepoint were blocked. If the tile is not a chokepoint, then the number indicates
                // the number of tiles that would be rendered unreachable if the nearest exit chokepoint
                // were blocked.
                // The cost of all of this is one depth-first flood-fill per open point that is adjacent to a chokepoint.
                // Start by roping off room machines.
                passMap.update((v, x, y) => v && site.hasSiteFlag(x, y, Flags.IS_IN_ROOM_MACHINE) ? 0 : v);
                // Scan through and find a chokepoint next to an open point.
                for (let i = 0; i < site.width; i++) {
                    for (let j = 0; j < site.height; j++) {
                        if (passMap[i][j] &&
                            site.hasSiteFlag(i, j, Flags.IS_CHOKEPOINT)) {
                            for (let dir = 0; dir < 4; dir++) {
                                const newX = i + GW.utils.DIRS[dir][0];
                                const newY = j + GW.utils.DIRS[dir][1];
                                if (passMap.hasXY(newX, newY) && // RUT.Map.makeValidXy(map, newXy) &&
                                    passMap[newX][newY] &&
                                    !(site.hasSiteFlag(newX, newY, Flags.IS_CHOKEPOINT))) {
                                    // OK, (newX, newY) is an open point and (i, j) is a chokepoint.
                                    // Pretend (i, j) is blocked by changing passMap, and run a flood-fill cell count starting on (newX, newY).
                                    // Keep track of the flooded region in grid[][].
                                    floodGrid.fill(0);
                                    passMap[i][j] = 0;
                                    let cellCount = floodFillCount(site, floodGrid, passMap, newX, newY);
                                    passMap[i][j] = 1;
                                    // CellCount is the size of the region that would be obstructed if the chokepoint were blocked.
                                    // CellCounts less than 4 are not useful, so we skip those cases.
                                    if (cellCount >= 4) {
                                        // Now, on the chokemap, all of those flooded cells should take the lesser of their current value or this resultant number.
                                        for (let i2 = 0; i2 < floodGrid.width; i2++) {
                                            for (let j2 = 0; j2 < floodGrid.height; j2++) {
                                                if (floodGrid[i2][j2] &&
                                                    cellCount < site.getChokeCount(i2, j2)) {
                                                    site.setChokeCount(i2, j2, cellCount);
                                                    site.clearSiteFlag(i2, j2, Flags.IS_GATE_SITE);
                                                }
                                            }
                                        }
                                        // The chokepoint itself should also take the lesser of its current value or the flood count.
                                        if (cellCount < site.getChokeCount(i, j)) {
                                            site.setChokeCount(i, j, cellCount);
                                            site.setSiteFlag(i, j, Flags.IS_GATE_SITE);
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
            GW.grid.free(passMap);
            GW.grid.free(floodGrid);
        }
    }
    // Assumes it is called with respect to a passable (startX, startY), and that the same is not already included in results.
    // Returns 10000 if the area included an area machine.
    function floodFillCount(site, results, passMap, startX, startY) {
        let count = passMap[startX][startY] == 2 ? 5000 : 1;
        if (site.isDeep(startX, startY)
        // map.cells[startX][startY].flags.cellMech &
        // FLAGS.CellMech.IS_IN_AREA_MACHINE
        ) {
            count = 10000;
        }
        results[startX][startY] = 1;
        for (let dir = 0; dir < 4; dir++) {
            const newX = startX + GW.utils.DIRS[dir][0];
            const newY = startY + GW.utils.DIRS[dir][1];
            if (site.hasXY(newX, newY) && // RUT.Map.makeValidXy(map, newXy) &&
                passMap[newX][newY] &&
                !results[newX][newY]) {
                count += floodFillCount(site, results, passMap, newX, newY);
            }
        }
        return Math.min(count, 10000);
    }

    ////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////
    class LoopFinder {
        constructor() { }
        compute(site) {
            // const grid = GW.grid.alloc(site.width, site.height);
            this._initGrid(site);
            GW.utils.forRect(site.width, site.height, (x, y) => this._checkCell(site, x, y));
            // grid.forEach((_v, x, y) => this._checkCell(site, grid, x, y));
            // grid.forEach((v, x, y) => cb(x, y, !!v));
            // GW.grid.free(grid);
        }
        _initGrid(site$1) {
            GW.utils.forRect(site$1.width, site$1.height, (x, y) => {
                if (site$1.isPassable(x, y)) {
                    site$1.setSiteFlag(x, y, Flags.IS_IN_LOOP);
                }
                else {
                    site$1.clearSiteFlag(x, y, Flags.IS_IN_LOOP);
                }
            });
        }
        _checkCell(site$1, x, y) {
            let inString;
            let newX, newY, dir, sdir;
            let numStrings, maxStringLength, currentStringLength;
            const v = site$1.hasSiteFlag(x, y, Flags.IS_IN_LOOP);
            if (!v)
                return;
            // find an unloopy neighbor to start on
            for (sdir = 0; sdir < 8; sdir++) {
                newX = x + GW.utils.CLOCK_DIRS[sdir][0];
                newY = y + GW.utils.CLOCK_DIRS[sdir][1];
                if (!site$1.hasXY(newX, newY))
                    continue;
                if (!site$1.hasSiteFlag(newX, newY, Flags.IS_IN_LOOP)) {
                    break;
                }
            }
            if (sdir == 8) {
                // no unloopy neighbors
                return; // leave cell loopy
            }
            // starting on this unloopy neighbor,
            // work clockwise and count up:
            // (a) the number of strings of loopy neighbors, and
            // (b) the length of the longest such string.
            numStrings = maxStringLength = currentStringLength = 0;
            inString = false;
            for (dir = sdir; dir < sdir + 8; dir++) {
                newX = x + GW.utils.CLOCK_DIRS[dir % 8][0];
                newY = y + GW.utils.CLOCK_DIRS[dir % 8][1];
                if (!site$1.hasXY(newX, newY))
                    continue;
                const newCell = site$1.hasSiteFlag(newX, newY, Flags.IS_IN_LOOP);
                if (newCell) {
                    currentStringLength++;
                    if (!inString) {
                        if (numStrings > 0) {
                            return false; // more than one string here; leave loopy
                        }
                        numStrings++;
                        inString = true;
                    }
                }
                else if (inString) {
                    if (currentStringLength > maxStringLength) {
                        maxStringLength = currentStringLength;
                    }
                    currentStringLength = 0;
                    inString = false;
                }
            }
            if (inString && currentStringLength > maxStringLength) {
                maxStringLength = currentStringLength;
            }
            if (numStrings == 1 && maxStringLength <= 4) {
                site$1.clearSiteFlag(x, y, Flags.IS_IN_LOOP);
                for (dir = 0; dir < 8; dir++) {
                    const newX = x + GW.utils.CLOCK_DIRS[dir][0];
                    const newY = y + GW.utils.CLOCK_DIRS[dir][1];
                    if (site$1.hasXY(newX, newY)) {
                        this._checkCell(site$1, newX, newY);
                    }
                }
            }
        }
        _fillInnerLoopGrid(site$1, innerGrid) {
            for (let x = 0; x < site$1.width; ++x) {
                for (let y = 0; y < site$1.height; ++y) {
                    if (site$1.hasSiteFlag(x, y, Flags.IS_IN_LOOP)) {
                        innerGrid[x][y] = 1;
                    }
                    else if (x > 0 && y > 0) {
                        const up = site$1.hasSiteFlag(x, y - 1, Flags.IS_IN_LOOP);
                        const left = site$1.hasSiteFlag(x - 1, y, Flags.IS_IN_LOOP);
                        if (up && left) {
                            innerGrid[x][y] = 1;
                        }
                    }
                }
            }
        }
        _update(site$1) {
            // remove extraneous loop markings
            const innerLoop = GW.grid.alloc(site$1.width, site$1.height);
            this._fillInnerLoopGrid(site$1, innerLoop);
            // const xy = { x: 0, y: 0 };
            let designationSurvives;
            for (let i = 0; i < site$1.width; i++) {
                for (let j = 0; j < site$1.height; j++) {
                    if (site$1.hasSiteFlag(i, j, Flags.IS_IN_LOOP)) {
                        designationSurvives = false;
                        for (let dir = 0; dir < 8; dir++) {
                            let newX = i + GW.utils.CLOCK_DIRS[dir][0];
                            let newY = j + GW.utils.CLOCK_DIRS[dir][1];
                            if (site$1.hasXY(newX, newY) && // RUT.Map.makeValidXy(map, xy, newX, newY) &&
                                !innerLoop[newX][newY] &&
                                !site$1.hasSiteFlag(newX, newY, Flags.IS_IN_LOOP)) {
                                designationSurvives = true;
                                break;
                            }
                        }
                        if (!designationSurvives) {
                            innerLoop[i][j] = 1;
                            site$1.clearSiteFlag(i, j, Flags.IS_IN_LOOP);
                        }
                    }
                }
            }
            GW.grid.free(innerLoop);
        }
    }
    ////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////

    function analyze(site) {
        const loops = new LoopFinder();
        loops.compute(site);
        const chokes = new ChokeFinder(true);
        chokes.compute(site);
    }

    var index$1 = {
        __proto__: null,
        blueprint: blueprint,
        analyze: analyze,
        LoopFinder: LoopFinder,
        ChokeFinder: ChokeFinder,
        floodFillCount: floodFillCount
    };

    exports.build = index$1;
    exports.dig = index;
    exports.site = site;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
