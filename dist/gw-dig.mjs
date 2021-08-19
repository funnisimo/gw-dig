import { tile, grid, utils as utils$1, random as random$1, path, range, blob, map, gameObject, flag, frequency, effect, fov } from 'gw-utils';

var _a, _b;
const NOTHING = tile.get('NULL').index;
const FLOOR = tile.get('FLOOR').index;
const DOOR = tile.get('DOOR').index;
const SECRET_DOOR = (_b = (_a = tile.get('DOOR_SECRET')) === null || _a === void 0 ? void 0 : _a.index) !== null && _b !== void 0 ? _b : -1;
const WALL = tile.get('WALL').index;
const DEEP = tile.get('LAKE').index;
const SHALLOW = tile.get('SHALLOW').index;
const BRIDGE = tile.get('BRIDGE').index;
const UP_STAIRS = tile.get('UP_STAIRS').index;
const DOWN_STAIRS = tile.get('DOWN_STAIRS').index;
const IMPREGNABLE = tile.get('IMPREGNABLE').index;
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
class GridSite {
    constructor(width, height) {
        this.tiles = grid.alloc(width, height);
    }
    free() {
        grid.free(this.tiles);
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
    isSecretDoor(x, y) {
        const v = this.tiles.get(x, y);
        return v === SECRET_DOOR;
    }
    isBridge(x, y) {
        const v = this.tiles.get(x, y);
        return v === BRIDGE;
    }
    isWall(x, y) {
        const v = this.tiles.get(x, y);
        return v === WALL || v === IMPREGNABLE;
    }
    blocksMove(x, y) {
        return this.isNothing(x, y) || this.isWall(x, y) || this.isDeep(x, y);
    }
    blocksDiagonal(x, y) {
        return this.isNothing(x, y) || this.isWall(x, y);
    }
    blocksPathing(x, y) {
        return (this.isNothing(x, y) ||
            this.isWall(x, y) ||
            this.isDeep(x, y) ||
            this.isStairs(x, y));
    }
    blocksVision(x, y) {
        return this.isNothing(x, y) || this.isWall(x, y);
    }
    blocksItems(x, y) {
        return this.blocksPathing(x, y) || this.blocksPathing(x, y);
    }
    blocksEffects(x, y) {
        return this.isWall(x, y);
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
    isAnyLiquid(x, y) {
        return this.isDeep(x, y) || this.isShallow(x, y);
    }
    isSet(x, y) {
        return (this.tiles.get(x, y) || 0) > 0;
    }
    getTileIndex(x, y) {
        return this.tiles.get(x, y) || 0;
    }
    setTile(x, y, tile$1) {
        if (tile$1 instanceof tile.Tile) {
            tile$1 = tile$1.index;
        }
        if (typeof tile$1 === 'string') {
            const obj = tile.tiles[tile$1];
            if (!obj)
                throw new Error('Failed to find tie: ' + tile$1);
            tile$1 = obj.index;
        }
        if (!this.tiles.hasXY(x, y))
            return false;
        this.tiles[x][y] = tile$1;
        return true;
    }
    hasTile(x, y, tile$1) {
        if (tile$1 instanceof tile.Tile) {
            tile$1 = tile$1.index;
        }
        if (typeof tile$1 === 'string') {
            const obj = tile.tiles[tile$1];
            if (!obj)
                throw new Error('Failed to find tie: ' + tile$1);
            tile$1 = obj.index;
        }
        return this.tiles.hasXY(x, y) && this.tiles[x][y] == tile$1;
    }
    tileBlocksMove(tile) {
        return (tile === WALL ||
            tile === DEEP ||
            tile === IMPREGNABLE ||
            tile === NOTHING);
    }
}

var site = {
    __proto__: null,
    NOTHING: NOTHING,
    FLOOR: FLOOR,
    DOOR: DOOR,
    SECRET_DOOR: SECRET_DOOR,
    WALL: WALL,
    DEEP: DEEP,
    SHALLOW: SHALLOW,
    BRIDGE: BRIDGE,
    UP_STAIRS: UP_STAIRS,
    DOWN_STAIRS: DOWN_STAIRS,
    IMPREGNABLE: IMPREGNABLE,
    TILEMAP: TILEMAP,
    GridSite: GridSite
};

class Hall {
    constructor(loc, dir, length, width = 1) {
        this.width = 1;
        this.doors = [];
        this.x = loc[0];
        this.y = loc[1];
        const d = utils$1.DIRS[dir];
        this.length = length;
        this.width = width;
        // console.log('Hall', loc, d, length, width);
        if (dir === utils$1.UP || dir === utils$1.DOWN) {
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
class Room extends utils$1.Bounds {
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
const DIRS = utils$1.DIRS;
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
    solutionDir = utils$1.NO_DIRECTION;
    for (dir = 0; dir < 4; dir++) {
        newX = x + DIRS[dir][0];
        newY = y + DIRS[dir][1];
        oppX = x - DIRS[dir][0];
        oppY = y - DIRS[dir][1];
        if (site.hasXY(oppX, oppY) &&
            site.hasXY(newX, newY) &&
            site.isFloor(oppX, oppY)) {
            // This grid cell would be a valid tile on which to place a door that, facing outward, points dir.
            if (solutionDir != utils$1.NO_DIRECTION) {
                // Already claimed by another direction; no doors here!
                return utils$1.NO_DIRECTION;
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
                if (dir != utils$1.NO_DIRECTION) {
                    // Trace a ray 10 spaces outward from the door site to make sure it doesn't intersect the room.
                    // If it does, it's not a valid door site.
                    newX = i + utils$1.DIRS[dir][0];
                    newY = j + utils$1.DIRS[dir][1];
                    doorSiteFailed = false;
                    for (k = 0; k < 10 && site.hasXY(newX, newY) && !doorSiteFailed; k++) {
                        if (site.isSet(newX, newY)) {
                            doorSiteFailed = true;
                        }
                        newX += utils$1.DIRS[dir][0];
                        newY += utils$1.DIRS[dir][1];
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
        const loc = random$1.item(DOORS[dir]) || [-1, -1];
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
    utils$1.forRect(dest.width, dest.height, (x, y) => {
        const otherX = x - offsetX;
        const otherY = y - offsetY;
        const v = source.getTileIndex(otherX, otherY);
        if (!v)
            return;
        dest.setTile(x, y, v);
    });
}
function fillCostGrid(source, costGrid) {
    costGrid.update((_v, x, y) => source.isPassable(x, y) ? 1 : path.OBSTRUCTION);
}
function siteDisruptedBy(site, blockingGrid, blockingToMapX = 0, blockingToMapY = 0) {
    const walkableGrid = grid.alloc(site.width, site.height);
    let disrupts = false;
    // Get all walkable locations after lake added
    utils$1.forRect(site.width, site.height, (i, j) => {
        const lakeX = i + blockingToMapX;
        const lakeY = j + blockingToMapY;
        if (blockingGrid.get(lakeX, lakeY)) {
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
    grid.free(walkableGrid);
    return disrupts;
}
function siteDisruptedSize(site, blockingGrid, blockingToMapX = 0, blockingToMapY = 0) {
    const walkableGrid = grid.alloc(site.width, site.height);
    let disrupts = 0;
    // Get all walkable locations after lake added
    utils$1.forRect(site.width, site.height, (i, j) => {
        const lakeX = i + blockingToMapX;
        const lakeY = j + blockingToMapY;
        if (blockingGrid.get(lakeX, lakeY)) {
            if (site.isStairs(i, j)) {
                disrupts = site.width * site.height;
            }
        }
        else if (site.isPassable(i, j)) {
            walkableGrid[i][j] = 1;
        }
    });
    if (disrupts)
        return disrupts;
    let first = true;
    let nextId = 2;
    let minSize = site.width * site.height;
    for (let i = 0; i < walkableGrid.width; ++i) {
        for (let j = 0; j < walkableGrid.height; ++j) {
            if (walkableGrid[i][j] == 1) {
                const disrupted = walkableGrid.floodFill(i, j, 1, nextId++);
                minSize = Math.min(minSize, disrupted);
                if (first) {
                    first = false;
                }
                else {
                    disrupts = minSize;
                }
            }
        }
    }
    // console.log('WALKABLE GRID');
    // walkableGrid.dump();
    grid.free(walkableGrid);
    return disrupts;
}
function computeDistanceMap(site, distanceMap, originX, originY, maxDistance) {
    const costGrid = grid.alloc(site.width, site.height);
    fillCostGrid(site, costGrid);
    path.calculateDistances(distanceMap, originX, originY, costGrid, false, maxDistance + 1 // max distance is the same as max size of this blueprint
    );
    grid.free(costGrid);
}

var utils = {
    __proto__: null,
    directionOfDoorSite: directionOfDoorSite,
    chooseRandomDoorSites: chooseRandomDoorSites,
    copySite: copySite,
    fillCostGrid: fillCostGrid,
    siteDisruptedBy: siteDisruptedBy,
    siteDisruptedSize: siteDisruptedSize,
    computeDistanceMap: computeDistanceMap
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
        const range$1 = range.make(have); // throws if invalid
        config[key] = range$1;
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
            this.randomRoom = random$1.item.bind(random$1, choices);
        }
        else if (typeof choices == 'object') {
            this.randomRoom = random$1.weighted.bind(random$1, choices);
        }
        else {
            throw new Error('Expected choices to be either array of room ids or weighted map - ex: { ROOM_ID: weight }');
        }
    }
    carve(site) {
        let id = this.randomRoom();
        const room = rooms[id];
        if (!room) {
            utils$1.ERROR('Missing room digger choice: ' + id);
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
        const blobGrid = grid.alloc(site$1.width, site$1.height, 0);
        const minWidth = Math.floor(0.5 * width); // 6
        const maxWidth = width;
        const minHeight = Math.floor(0.5 * height); // 4
        const maxHeight = height;
        const blob$1 = new blob.Blob({
            rounds: 5,
            minWidth: minWidth,
            minHeight: minHeight,
            maxWidth: maxWidth,
            maxHeight: maxHeight,
            percentSeeded: 55,
            birthParameters: 'ffffftttt',
            survivalParameters: 'ffffttttt',
        });
        const bounds = blob$1.carve(blobGrid.width, blobGrid.height, (x, y) => (blobGrid[x][y] = 1));
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
        grid.free(blobGrid);
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
        utils$1.forRect(roomX, roomY, roomWidth, roomHeight, (x, y) => site$1.setTile(x, y, tile));
        utils$1.forRect(roomX2, roomY2, roomWidth2, roomHeight2, (x, y) => site$1.setTile(x, y, tile));
        const room = new Room(Math.min(roomX, roomX2), Math.min(roomY, roomY2), Math.max(roomWidth, roomWidth2), Math.max(roomHeight, roomHeight2));
        room.doors[utils$1.DOWN] = [
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
        const roomWidth2 = Math.max(3, Math.floor((width * random$1.range(25, 75)) / 100)); // [4,20]
        const roomHeight = Math.max(3, Math.floor((height * random$1.range(25, 75)) / 100)); // [2,5]
        const roomHeight2 = height;
        const roomX = Math.floor((site$1.width - roomWidth) / 2);
        const roomX2 = roomX + random$1.range(2, Math.max(2, roomWidth - roomWidth2 - 2));
        const roomY2 = Math.floor((site$1.height - roomHeight2) / 2);
        const roomY = roomY2 +
            random$1.range(2, Math.max(2, roomHeight2 - roomHeight - 2));
        utils$1.forRect(roomX, roomY, roomWidth, roomHeight, (x, y) => site$1.setTile(x, y, tile));
        utils$1.forRect(roomX2, roomY2, roomWidth2, roomHeight2, (x, y) => site$1.setTile(x, y, tile));
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
        let minorWidth = Math.max(3, Math.floor((width * random$1.range(25, 50)) / 100)); // [2,4]
        // if (height % 2 == 0 && minorWidth > 2) {
        //     minorWidth -= 1;
        // }
        let minorHeight = Math.max(3, Math.floor((height * random$1.range(25, 50)) / 100)); // [2,3]?
        // if (width % 2 == 0 && minorHeight > 2) {
        //     minorHeight -= 1;
        // }
        const x = Math.floor((site$1.width - width) / 2);
        const y = Math.floor((site$1.height - minorHeight) / 2);
        utils$1.forRect(x, y, width, minorHeight, (x, y) => site$1.setTile(x, y, tile));
        const x2 = Math.floor((site$1.width - minorWidth) / 2);
        const y2 = Math.floor((site$1.height - height) / 2);
        utils$1.forRect(x2, y2, minorWidth, height, (x, y) => site$1.setTile(x, y, tile));
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
        utils$1.forRect(x, y, width, height, (x, y) => site$1.setTile(x, y, tile));
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
            utils$1.forCircle(x, y, radius, (x, y) => site$1.setTile(x, y, tile));
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
        utils$1.forCircle(x, y, radius, (x, y) => site$1.setTile(x, y, tile));
        if (radius > ringMinWidth + holeMinSize &&
            random$1.chance(this.options.holeChance.value())) {
            utils$1.forCircle(x, y, random$1.range(holeMinSize, radius - holeMinSize), (x, y) => site$1.setTile(x, y, 0));
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
        utils$1.forCircle(left, top, 2, (x, y) => site$1.setTile(x, y, tile));
        left -= 2;
        right += 2;
        top -= 2;
        bottom += 2;
        for (i = 0; i < chunkCount;) {
            x = random$1.range(minX, maxX);
            y = random$1.range(minY, maxY);
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
                utils$1.forCircle(x, y, 2, (x, y) => site$1.setTile(x, y, tile));
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

const DIRS$1 = utils$1.DIRS;
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
    return utils$1.clamp(_pickWidth(opts), 1, 3);
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
        width = random$1.weighted(width) + 1;
    }
    else if (typeof width === 'string') {
        width = range.make(width).value();
    }
    else {
        width = Number.parseInt(random$1.weighted(width));
    }
    return width;
}
function pickLength(dir, lengths) {
    if (dir == utils$1.UP || dir == utils$1.DOWN) {
        return lengths[1].value();
    }
    else {
        return lengths[0].value();
    }
}
function pickHallDirection(site, doors, lengths) {
    // Pick a direction.
    let dir = utils$1.NO_DIRECTION;
    if (dir == utils$1.NO_DIRECTION) {
        const dirs = random$1.sequence(4);
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
            dir = utils$1.NO_DIRECTION;
        }
    }
    return dir;
}
function pickHallExits(site, x, y, dir, obliqueChance) {
    let newX, newY;
    const allowObliqueHallwayExit = random$1.chance(obliqueChance);
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
            width: range.make(1),
            length: [range.make('2-15'), range.make('2-9')],
            tile: FLOOR,
            obliqueChance: 15,
            chance: 100,
        };
        this._setOptions(options);
    }
    _setOptions(options = {}) {
        if (options.width) {
            this.config.width = range.make(options.width);
        }
        if (options.length) {
            if (typeof options.length === 'number') {
                const l = range.make(options.length);
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
        if (!random$1.chance(this.config.chance))
            return null;
        const dir = pickHallDirection(site, doors, this.config.length);
        if (dir === utils$1.NO_DIRECTION)
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
        const DIR = utils$1.DIRS[dir];
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
        const hasWreath = random$1.chance(this.options.wreathChance)
            ? true
            : false;
        const wreathTile = this.options.wreathTile || SHALLOW;
        const wreathSize = this.options.wreathSize || 1; // TODO - make this a range "0-2" or a weighted choice { 0: 50, 1: 40, 2" 10 }
        const tile = this.options.tile || DEEP;
        const lakeGrid = grid.alloc(site$1.width, site$1.height, 0);
        let attempts = 0;
        while (attempts < maxCount && count < maxCount) {
            // lake generations
            const width = Math.round(((lakeMaxWidth - lakeMinSize) * (maxCount - attempts)) /
                maxCount) + lakeMinSize;
            const height = Math.round(((lakeMaxHeight - lakeMinSize) * (maxCount - attempts)) /
                maxCount) + lakeMinSize;
            const blob$1 = new blob.Blob({
                rounds: 5,
                minWidth: 4,
                minHeight: 4,
                maxWidth: width,
                maxHeight: height,
                percentSeeded: 55,
                birthParameters: 'ffffftttt',
                survivalParameters: 'ffffttttt',
            });
            const bounds = blob$1.carve(lakeGrid.width, lakeGrid.height, (x, y) => (lakeGrid[x][y] = 1));
            // lakeGrid.dump();
            let success = false;
            for (k = 0; k < tries && !success; k++) {
                // placement attempts
                // propose a position for the top-left of the lakeGrid in the dungeon
                x = random$1.range(1 - bounds.x, lakeGrid.width - bounds.width - bounds.x - 2);
                y = random$1.range(1 - bounds.y, lakeGrid.height - bounds.height - bounds.y - 2);
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
                                    utils$1.forCircle(sx, sy, wreathSize, (i, j) => {
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
        grid.free(lakeGrid);
        return count;
    }
    isDisruptedBy(site, lakeGrid, lakeToMapX = 0, lakeToMapY = 0) {
        const walkableGrid = grid.alloc(site.width, site.height);
        let disrupts = false;
        // Get all walkable locations after lake added
        utils$1.forRect(site.width, site.height, (i, j) => {
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
        grid.free(walkableGrid);
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
        const pathGrid = grid.alloc(site$1.width, site$1.height);
        const costGrid = grid.alloc(site$1.width, site$1.height);
        const dirCoords = [
            [1, 0],
            [0, 1],
        ];
        costGrid.update((_v, x, y) => site$1.isPassable(x, y) ? 1 : path.OBSTRUCTION);
        const seq = random$1.sequence(site$1.width * site$1.height);
        for (i = 0; i < seq.length; i++) {
            x = Math.floor(seq[i] / site$1.height);
            y = seq[i] % site$1.height;
            if (
            // map.hasXY(x, y) &&
            // map.get(x, y) &&
            site$1.isPassable(x, y) &&
                !site$1.isAnyLiquid(x, y)) {
                for (d = 0; d <= 1; d++) {
                    // Try right, then down
                    const bridgeDir = dirCoords[d];
                    newX = x + bridgeDir[0];
                    newY = y + bridgeDir[1];
                    j = maxLength;
                    // if (!map.hasXY(newX, newY)) continue;
                    // check for line of lake tiles
                    // if (isBridgeCandidate(newX, newY, bridgeDir)) {
                    if (site$1.isAnyLiquid(newX, newY)) {
                        for (j = 0; j < maxLength; ++j) {
                            newX += bridgeDir[0];
                            newY += bridgeDir[1];
                            // if (!isBridgeCandidate(newX, newY, bridgeDir)) {
                            if (!site$1.isAnyLiquid(newX, newY)) {
                                break;
                            }
                        }
                    }
                    if (
                    // map.get(newX, newY) &&
                    site$1.isPassable(newX, newY) &&
                        j < maxLength) {
                        path.calculateDistances(pathGrid, newX, newY, costGrid, false);
                        // pathGrid.fill(30000);
                        // pathGrid[newX][newY] = 0;
                        // dijkstraScan(pathGrid, costGrid, false);
                        if (pathGrid[x][y] > minDistance &&
                            pathGrid[x][y] < path.NO_PATH) {
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
        grid.free(pathGrid);
        grid.free(costGrid);
        return count;
    }
    isBridgeCandidate(site, x, y, bridgeDir) {
        if (site.isBridge(x, y))
            return true;
        if (!site.isAnyLiquid(x, y))
            return false;
        if (!site.isAnyLiquid(x + bridgeDir[1], y + bridgeDir[0]))
            return false;
        if (!site.isAnyLiquid(x - bridgeDir[1], y - bridgeDir[0]))
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
                start = random$1.matchingLoc(site.width, site.height, isValidLoc);
            }
            else {
                start = random$1.matchingLocNear(utils$1.x(start), utils$1.y(start), isValidLoc);
            }
            locations.start = start;
        }
        if (Array.isArray(this.options.up) &&
            Array.isArray(this.options.down)) {
            const up = this.options.up;
            upLoc = random$1.matchingLocNear(utils$1.x(up), utils$1.y(up), isValidLoc);
            const down = this.options.down;
            downLoc = random$1.matchingLocNear(utils$1.x(down), utils$1.y(down), isValidLoc);
        }
        else if (Array.isArray(this.options.up) &&
            !Array.isArray(this.options.down)) {
            const up = this.options.up;
            upLoc = random$1.matchingLocNear(utils$1.x(up), utils$1.y(up), isValidLoc);
            if (needDown) {
                downLoc = random$1.matchingLoc(site.width, site.height, (x, y) => {
                    if (
                    // @ts-ignore
                    utils$1.distanceBetween(x, y, upLoc[0], upLoc[1]) <
                        minDistance)
                        return false;
                    return isValidLoc(x, y);
                });
            }
        }
        else if (Array.isArray(this.options.down) &&
            !Array.isArray(this.options.up)) {
            const down = this.options.down;
            downLoc = random$1.matchingLocNear(utils$1.x(down), utils$1.y(down), isValidLoc);
            if (needUp) {
                upLoc = random$1.matchingLoc(site.width, site.height, (x, y) => {
                    if (utils$1.distanceBetween(x, y, 
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
            upLoc = random$1.matchingLoc(site.width, site.height, isValidLoc);
            if (needDown) {
                downLoc = random$1.matchingLoc(site.width, site.height, (x, y) => {
                    if (
                    // @ts-ignore
                    utils$1.distanceBetween(x, y, upLoc[0], upLoc[1]) <
                        minDistance)
                        return false;
                    return isValidLoc(x, y);
                });
            }
        }
        else if (needDown) {
            downLoc = random$1.matchingLoc(site.width, site.height, isValidLoc);
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
            const dir = utils$1.DIRS[i];
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
        const indexes = random$1.sequence(4);
        let dir = null;
        for (let i = 0; i < indexes.length; ++i) {
            dir = utils$1.DIRS[i];
            const x0 = x + dir[0];
            const y0 = y + dir[1];
            if (site.isFloor(x0, y0)) {
                if (site.isDiggable(x - dir[0], y - dir[1]))
                    break;
            }
            dir = null;
        }
        if (!dir)
            utils$1.ERROR('No stair direction found!');
        site.setTile(x, y, tile);
        const dirIndex = utils$1.CLOCK_DIRS.findIndex(
        // @ts-ignore
        (d) => d[0] == dir[0] && d[1] == dir[1]);
        const wall = this.options.wall;
        for (let i = 0; i < utils$1.CLOCK_DIRS.length; ++i) {
            const l = i ? i - 1 : 7;
            const r = (i + 1) % 8;
            if (i == dirIndex || l == dirIndex || r == dirIndex)
                continue;
            const d = utils$1.CLOCK_DIRS[i];
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
        const pathGrid = grid.alloc(site$1.width, site$1.height);
        const costGrid = grid.alloc(site$1.width, site$1.height);
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
        const seq = random$1.sequence(site$1.width * site$1.height);
        for (i = 0; i < seq.length; i++) {
            x = Math.floor(seq[i] / site$1.height);
            y = seq[i] % site$1.height;
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
                        path.calculateDistances(pathGrid, startX, startY, costGrid, false);
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
        grid.free(pathGrid);
        grid.free(costGrid);
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
            random$1.seed(options.seed);
        }
        this.seq = random$1.sequence(width * height);
        utils$1.setOptions(this.rooms, options.rooms);
        utils$1.setOptions(this.halls, options.halls);
        utils$1.setOptions(this.loops, options.loops);
        utils$1.setOptions(this.lakes, options.lakes);
        utils$1.setOptions(this.bridges, options.bridges);
        utils$1.setOptions(this.stairs, options.stairs);
        utils$1.setOptions(this.doors, options.doors);
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
        utils$1.forRect(this.width, this.height, (x, y) => {
            const t = site.getTileIndex(x, y);
            if (t)
                setFn(x, y, t);
        });
        site.free();
        return true;
    }
    start(_site) { }
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
    _attachRoom(site, roomSite, room) {
        // console.log('attachRoom');
        const doorSites = room.hall ? room.hall.doors : room.doors;
        // Slide hyperspace across real space, in a random but predetermined order, until the room matches up with a wall.
        for (let i = 0; i < this.seq.length; i++) {
            const x = Math.floor(this.seq[i] / this.height);
            const y = this.seq[i] % this.height;
            if (!site.isNothing(x, y))
                continue;
            const dir = directionOfDoorSite(site, x, y);
            if (dir != utils$1.NO_DIRECTION) {
                const oppDir = (dir + 2) % 4;
                const door = doorSites[oppDir];
                if (!door)
                    continue;
                const offsetX = x - door[0];
                const offsetY = y - door[1];
                if (door[0] != -1 &&
                    this._roomFitsAt(site, roomSite, offsetX, offsetY)) {
                    // TYPES.Room fits here.
                    copySite(site, roomSite, offsetX, offsetY);
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
    _attachRoomAtLoc(site, roomSite, room, attachLoc) {
        const [x, y] = attachLoc;
        const doorSites = room.hall ? room.hall.doors : room.doors;
        const dirs = random$1.sequence(4);
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
        const isDoor = opts.chance && random$1.chance(opts.chance); // did not pass chance
        const tile = isDoor ? opts.tile || DOOR : FLOOR;
        map.setTile(x, y, tile); // Door site.
        // most cases...
        if (!room.hall || !(room.hall.width > 1) || room.hall.dir !== dir) {
            return;
        }
        if (dir === utils$1.UP || dir === utils$1.DOWN) {
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
                        if (!site$1.blocksMove(i + k, j) &&
                            site$1.blocksMove(i + (1 - k), j) &&
                            site$1.blocksDiagonal(i + (1 - k), j) &&
                            site$1.blocksMove(i + k, j + 1) &&
                            site$1.blocksDiagonal(i + k, j + 1) &&
                            !site$1.blocksMove(i + (1 - k), j + 1)) {
                            if (random$1.chance(50)) {
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
        utils$1.forRect(this.width, this.height, (x, y) => {
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
                else if ((site$1.blocksPathing(x + 1, y) ? 1 : 0) +
                    (site$1.blocksPathing(x - 1, y) ? 1 : 0) +
                    (site$1.blocksPathing(x, y + 1) ? 1 : 0) +
                    (site$1.blocksPathing(x, y - 1) ? 1 : 0) >=
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
        utils$1.forRect(this.width, this.height, (x, y) => {
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
        utils$1.setOptions(this.config, options);
        if (this.config.seed) {
            random$1.seed(this.config.seed);
        }
        this.initSeeds();
        this.initStairLocs();
    }
    get levels() {
        return this.config.levels;
    }
    initSeeds() {
        for (let i = 0; i < this.config.levels; ++i) {
            this.seeds[i] = random$1.number(2 ** 32);
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
            const endLoc = random$1.matchingLoc(this.config.width, this.config.height, (x, y) => {
                return (utils$1.distanceBetween(startLoc[0], startLoc[1], x, y) > minDistance);
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
        random$1.seed(this.seeds[id]);
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
        if (!utils$1.equalsXY(level.endLoc, opts.endLoc) ||
            !utils$1.equalsXY(level.startLoc, opts.startLoc)) {
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
    site: site,
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

const Flags = map.flags.Cell;
class MapSite extends map.Map {
    constructor(width, height) {
        super(width, height);
        this.machineCount = 0;
        this.machineId = new grid.NumGrid(width, height);
    }
    hasItem(x, y) {
        return this.cellInfo(x, y).hasItem();
    }
    isPassable(x, y) {
        return !this.cellInfo(x, y).blocksMove();
    }
    blocksMove(x, y) {
        return this.cellInfo(x, y).blocksMove();
    }
    isWall(x, y) {
        return this.cellInfo(x, y).isWall();
    }
    isStairs(x, y) {
        return this.cellInfo(x, y).isStairs();
    }
    hasTile(x, y, tile) {
        return this.cellInfo(x, y).hasTile(tile);
    }
    free() { }
    isSet(x, y) {
        return this.hasXY(x, y) && !this.cell(x, y).isEmpty();
    }
    isDiggable(x, y) {
        if (!this.hasXY(x, y))
            return false;
        const cell = this.cell(x, y);
        if (cell.isEmpty())
            return true;
        if (cell.isWall())
            return true;
        return false;
    }
    isNothing(x, y) {
        return this.hasXY(x, y) && this.cell(x, y).isEmpty();
    }
    isFloor(x, y) {
        return this.isPassable(x, y);
    }
    isBridge(x, y) {
        return this.cellInfo(x, y).hasTileFlag(tile.flags.Tile.T_BRIDGE);
    }
    isDoor(x, y) {
        return this.cellInfo(x, y).hasTileFlag(tile.flags.Tile.T_IS_DOOR);
    }
    isSecretDoor(x, y) {
        return this.cellInfo(x, y).hasObjectFlag(gameObject.flags.GameObject.L_SECRETLY_PASSABLE);
    }
    blocksDiagonal(x, y) {
        return this.cellInfo(x, y).hasObjectFlag(gameObject.flags.GameObject.L_BLOCKS_DIAGONAL);
    }
    blocksPathing(x, y) {
        const info = this.cellInfo(x, y);
        return (info.hasObjectFlag(gameObject.flags.GameObject.L_BLOCKS_MOVE) ||
            info.hasTileFlag(tile.flags.Tile.T_PATHING_BLOCKER));
    }
    blocksItems(x, y) {
        return this.cellInfo(x, y).hasObjectFlag(gameObject.flags.GameObject.L_BLOCKS_ITEMS);
    }
    blocksEffects(x, y) {
        return this.cellInfo(x, y).hasObjectFlag(gameObject.flags.GameObject.L_BLOCKS_EFFECTS);
    }
    isDeep(x, y) {
        return this.cellInfo(x, y).hasTileFlag(tile.flags.Tile.T_DEEP_WATER);
    }
    isShallow(x, y) {
        if (!this.hasXY(x, y))
            return false;
        const cell = this.cell(x, y);
        return (!!cell.depthTile(gameObject.flags.Depth.LIQUID) &&
            !cell.hasTileFlag(tile.flags.Tile.T_IS_DEEP_LIQUID));
    }
    isAnyLiquid(x, y) {
        if (!this.hasXY(x, y))
            return false;
        const cell = this.cell(x, y);
        return (cell.hasDepthTile(gameObject.flags.Depth.LIQUID) ||
            cell.hasTileFlag(tile.flags.Tile.T_IS_DEEP_LIQUID));
    }
    getTileIndex(x, y) {
        if (!this.hasXY(x, y))
            return 0;
        const cell = this.cell(x, y);
        const tile = cell.highestPriorityTile();
        return tile.index;
    }
    tileBlocksMove(tile$1) {
        return tile.get(tile$1).blocksMove();
    }
    backup() {
        const backup = new MapSite(this.width, this.height);
        backup.copy(this);
        backup.machineId.copy(this.machineId);
        backup.machineCount = this.machineCount;
        return backup;
    }
    restore(backup) {
        this.copy(backup);
        this.machineId.copy(backup.machineId);
        this.machineCount = backup.machineCount;
    }
    getChokeCount(x, y) {
        return this.cell(x, y).chokeCount;
    }
    setChokeCount(x, y, count) {
        this.cell(x, y).chokeCount = count;
    }
    isOccupied(x, y) {
        return this.hasItem(x, y) || this.hasActor(x, y);
    }
    analyze() {
        map.analyze(this);
    }
    nextMachineId() {
        return ++this.machineCount;
    }
    getMachine(x, y) {
        return this.machineId[x][y];
    }
    setMachine(x, y, id, isRoom = true) {
        this.machineId[x][y] = id;
        if (id == 0) {
            this.clearCellFlag(x, y, Flags.IS_IN_MACHINE);
        }
        else {
            this.setCellFlag(x, y, isRoom ? Flags.IS_IN_ROOM_MACHINE : Flags.IS_IN_AREA_MACHINE);
        }
    }
}

const Fl = flag.fl;
var Flags$1;
(function (Flags) {
    Flags[Flags["BP_ROOM"] = Fl(10)] = "BP_ROOM";
    Flags[Flags["BP_VESTIBULE"] = Fl(1)] = "BP_VESTIBULE";
    Flags[Flags["BP_REWARD"] = Fl(7)] = "BP_REWARD";
    Flags[Flags["BP_ADOPT_ITEM"] = Fl(0)] = "BP_ADOPT_ITEM";
    Flags[Flags["BP_PURGE_PATHING_BLOCKERS"] = Fl(2)] = "BP_PURGE_PATHING_BLOCKERS";
    Flags[Flags["BP_PURGE_INTERIOR"] = Fl(3)] = "BP_PURGE_INTERIOR";
    Flags[Flags["BP_PURGE_LIQUIDS"] = Fl(4)] = "BP_PURGE_LIQUIDS";
    Flags[Flags["BP_SURROUND_WITH_WALLS"] = Fl(5)] = "BP_SURROUND_WITH_WALLS";
    Flags[Flags["BP_IMPREGNABLE"] = Fl(6)] = "BP_IMPREGNABLE";
    Flags[Flags["BP_OPEN_INTERIOR"] = Fl(8)] = "BP_OPEN_INTERIOR";
    Flags[Flags["BP_MAXIMIZE_INTERIOR"] = Fl(9)] = "BP_MAXIMIZE_INTERIOR";
    Flags[Flags["BP_REDESIGN_INTERIOR"] = Fl(14)] = "BP_REDESIGN_INTERIOR";
    Flags[Flags["BP_TREAT_AS_BLOCKING"] = Fl(11)] = "BP_TREAT_AS_BLOCKING";
    Flags[Flags["BP_REQUIRE_BLOCKING"] = Fl(12)] = "BP_REQUIRE_BLOCKING";
    Flags[Flags["BP_NO_INTERIOR_FLAG"] = Fl(13)] = "BP_NO_INTERIOR_FLAG";
})(Flags$1 || (Flags$1 = {}));
class Blueprint {
    constructor(opts = {}) {
        this.tags = [];
        this.size = [-1, -1];
        this.flags = 0;
        this.steps = [];
        this.id = 'n/a';
        if (opts.tags) {
            if (typeof opts.tags === 'string') {
                opts.tags = opts.tags.split(/[,|]/).map((v) => v.trim());
            }
            this.tags = opts.tags;
        }
        this.frequency = frequency.make(opts.frequency || 100);
        if (opts.size) {
            if (typeof opts.size === 'string') {
                const parts = opts.size
                    .split(/-/)
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
            this.flags = flag.from(Flags$1, opts.flags);
        }
        if (opts.steps) {
            this.steps = opts.steps.map((cfg) => new BuildStep(cfg));
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
        return !!(this.flags & Flags$1.BP_ROOM);
    }
    get isReward() {
        return !!(this.flags & Flags$1.BP_REWARD);
    }
    get isVestiblue() {
        return !!(this.flags & Flags$1.BP_VESTIBULE);
    }
    get adoptsItem() {
        return !!(this.flags & Flags$1.BP_ADOPT_ITEM);
    }
    get treatAsBlocking() {
        return !!(this.flags & Flags$1.BP_TREAT_AS_BLOCKING);
    }
    get requireBlocking() {
        return !!(this.flags & Flags$1.BP_REQUIRE_BLOCKING);
    }
    get purgeInterior() {
        return !!(this.flags & Flags$1.BP_PURGE_INTERIOR);
    }
    get purgeBlockers() {
        return !!(this.flags & Flags$1.BP_PURGE_PATHING_BLOCKERS);
    }
    get purgeLiquids() {
        return !!(this.flags & Flags$1.BP_PURGE_LIQUIDS);
    }
    get surroundWithWalls() {
        return !!(this.flags & Flags$1.BP_SURROUND_WITH_WALLS);
    }
    get makeImpregnable() {
        return !!(this.flags & Flags$1.BP_IMPREGNABLE);
    }
    get maximizeInterior() {
        return !!(this.flags & Flags$1.BP_MAXIMIZE_INTERIOR);
    }
    get openInterior() {
        return !!(this.flags & Flags$1.BP_OPEN_INTERIOR);
    }
    get noInteriorFlag() {
        return !!(this.flags & Flags$1.BP_NO_INTERIOR_FLAG);
    }
    qualifies(requiredFlags, depth) {
        if (this.frequency(depth) <= 0 ||
            // Must have the required flags:
            ~this.flags & requiredFlags ||
            // May NOT have BP_ADOPT_ITEM unless that flag is required:
            this.flags & Flags$1.BP_ADOPT_ITEM & ~requiredFlags ||
            // May NOT have BP_VESTIBULE unless that flag is required:
            this.flags & Flags$1.BP_VESTIBULE & ~requiredFlags) {
            return false;
        }
        return true;
    }
    pickLocation(site) {
        // Find a location and map out the machine interior.
        if (this.isRoom) {
            // If it's a room machine, count up the gates of appropriate
            // choke size and remember where they are. The origin of the room will be the gate location.
            site.analyze(); // Make sure the chokeMap is up to date.
            const randSite = random$1.matchingLoc(site.width, site.height, (x, y) => site
                .cellInfo(x, y)
                .hasCellFlag(map.flags.Cell.IS_GATE_SITE));
            if (!randSite || randSite[0] < 0 || randSite[1] < 0) {
                // If no suitable sites, abort.
                console.log('Failed to build a machine; there was no eligible door candidate for the chosen room machine from blueprint.');
                return false;
            }
            return randSite;
        }
        else if (this.isVestiblue) {
            //  Door machines must have locations passed in. We can't pick one ourselves.
            console.log('ERROR: Attempted to build a vestiblue without a location being provided.');
            return false;
        }
        // Pick a random origin location.
        const pos = random$1.matchingLoc(site.width, site.height, (x, y) => site.isPassable(x, y));
        if (!pos || pos[0] < 0 || pos[1] < 0)
            return false;
        return pos;
    }
    // Assume site has been analyzed (aka GateSites and ChokeCounts set)
    computeInterior(builder) {
        let failsafe = this.isRoom ? 10 : 20;
        let tryAgain;
        const interior = builder.interior;
        const site = builder.site;
        do {
            tryAgain = false;
            if (--failsafe <= 0) {
                console.log('Failed to build a machine; failed repeatedly to find a suitable blueprint location.');
                return false;
            }
            interior.fill(0);
            // Find a location and map out the machine interior.
            if (this.isRoom) {
                // If it's a room machine, count up the gates of appropriate
                // choke size and remember where they are. The origin of the room will be the gate location.
                // Now map out the interior into interior[][].
                // Start at the gate location and do a depth-first floodfill to grab all adjoining tiles with the
                // same or lower choke value, ignoring any tiles that are already part of a machine.
                // If we get false from this, try again. If we've tried too many times already, abort.
                tryAgain = !this.addTileToInteriorAndIterate(builder, builder.originX, builder.originY);
            }
            else if (this.isVestiblue) {
                if (!this.computeInteriorForVestibuleMachine(builder)) {
                    // TODO - tryagain = true?
                    console.error('ERROR: Attempted to build a door machine from blueprint: not enough room.');
                    return false;
                }
                // success
            }
            else {
                // Find a location and map out the interior for a non-room machine.
                // The strategy here is simply to pick a random location on the map,
                // expand it along a pathing map by one space in all directions until the size reaches
                // the chosen size, and then make sure the resulting space qualifies.
                // If not, try again. If we've tried too many times already, abort.
                let distanceMap = grid.alloc(interior.width, interior.height);
                computeDistanceMap(site, distanceMap, builder.originX, builder.originY, this.size[1]);
                const seq = random$1.sequence(site.width * site.height);
                let qualifyingTileCount = 0; // Keeps track of how many interior cells we've added.
                let totalFreq = random$1.range(this.size[0], this.size[1]); // Keeps track of the goal size.
                for (let k = 0; k < 1000 && qualifyingTileCount < totalFreq; k++) {
                    for (let n = 0; n < seq.length && qualifyingTileCount < totalFreq; n++) {
                        const i = Math.floor(seq[n] / site.height);
                        const j = seq[n] % site.height;
                        if (distanceMap[i][j] == k) {
                            interior[i][j] = 1;
                            qualifyingTileCount++;
                            if (site.isOccupied(i, j) ||
                                site
                                    .cellInfo(i, j)
                                    .hasCellFlag(map.flags.Cell.IS_IN_MACHINE)) {
                                // Abort if we've entered another machine or engulfed another machine's item or monster.
                                tryAgain = true;
                                qualifyingTileCount = totalFreq; // This is a hack to drop out of these three for-loops.
                            }
                        }
                    }
                }
                // Now make sure the interior map satisfies the machine's qualifications.
                if (qualifyingTileCount < totalFreq) {
                    tryAgain = true;
                    console.log('too small');
                }
                else if (this.treatAsBlocking &&
                    siteDisruptedBy(site, interior)) {
                    console.log('disconnected');
                    tryAgain = true;
                }
                else if (this.requireBlocking &&
                    siteDisruptedSize(site, interior) < 100) {
                    console.log('not disconnected enough');
                    tryAgain = true; // BP_REQUIRE_BLOCKING needs some work to make sure the disconnect is interesting.
                }
                // If locationFailsafe runs out, tryAgain will still be true, and we'll try a different machine.
                // If we're not choosing the blueprint, then don't bother with the locationFailsafe; just use the higher-level failsafe.
                grid.free(distanceMap);
            }
            // Now loop if necessary.
        } while (tryAgain);
        // console.log(tryAgain, failsafe);
        return true;
    }
    // Assumes (startX, startY) is in the machine.
    // Returns true if everything went well, and false if we ran into a machine component
    // that was already there, as we don't want to build a machine around it.
    addTileToInteriorAndIterate(builder, startX, startY) {
        let goodSoFar = true;
        const interior = builder.interior;
        const site = builder.site;
        interior[startX][startY] = 1;
        const startChokeCount = site.getChokeCount(startX, startY);
        for (let dir = 0; dir < 4 && goodSoFar; dir++) {
            const newX = startX + utils$1.DIRS[dir][0];
            const newY = startY + utils$1.DIRS[dir][1];
            if (!site.hasXY(newX, newY))
                continue;
            if (interior[newX][newY])
                continue; // already done
            if (site.isOccupied(newX, newY) ||
                (site
                    .cellInfo(newX, newY)
                    .hasCellFlag(map.flags.Cell.IS_IN_MACHINE) &&
                    !site
                        .cellInfo(newX, newY)
                        .hasCellFlag(map.flags.Cell.IS_GATE_SITE))) {
                // Abort if there's an item in the room.
                // Items haven't been populated yet, so the only way this could happen is if another machine
                // previously placed an item here.
                // Also abort if we're touching another machine at any point other than a gate tile.
                return false;
            }
            if (site.getChokeCount(newX, newY) <= startChokeCount && // don't have to worry about walls since they're all 30000
                !site
                    .cellInfo(newX, newY)
                    .hasCellFlag(map.flags.Cell.IS_IN_MACHINE)) {
                goodSoFar = this.addTileToInteriorAndIterate(builder, newX, newY);
            }
        }
        return goodSoFar;
    }
    computeInteriorForVestibuleMachine(builder) {
        let success = true;
        const interior = builder.interior;
        const site = builder.site;
        interior.fill(0);
        let qualifyingTileCount = 0; // Keeps track of how many interior cells we've added.
        const totalFreq = random$1.range(this.size[0], this.size[1]); // Keeps track of the goal size.
        const distMap = grid.alloc(site.width, site.height);
        computeDistanceMap(site, distMap, builder.originX, builder.originY, this.size[1]);
        // console.log('DISTANCE MAP', originX, originY);
        // RUT.Grid.dump(distMap);
        const cells = random$1.sequence(site.width * site.height);
        for (let k = 0; k < 1000 && qualifyingTileCount < totalFreq; k++) {
            for (let i = 0; i < cells.length && qualifyingTileCount < totalFreq; ++i) {
                const x = Math.floor(cells[i] / site.height);
                const y = cells[i] % site.height;
                const dist = distMap[x][y];
                if (dist != k)
                    continue;
                if (site.isOccupied(x, y)) {
                    success = false;
                    qualifyingTileCount = totalFreq;
                }
                interior[x][y] = 1;
                qualifyingTileCount += 1;
            }
        }
        // Now make sure the interior map satisfies the machine's qualifications.
        if (this.treatAsBlocking && siteDisruptedBy(site, interior)) {
            success = false;
        }
        else if (this.requireBlocking &&
            siteDisruptedSize(site, interior) < 100) {
            success = false;
        }
        grid.free(distMap);
        return success;
    }
    prepareInteriorWithMachineFlags(builder) {
        const interior = builder.interior;
        const site$1 = builder.site;
        // If requested, clear and expand the room as far as possible until either it's convex or it bumps into surrounding rooms
        if (this.maximizeInterior) {
            this.expandMachineInterior(builder, 1);
        }
        else if (this.openInterior) {
            this.expandMachineInterior(builder, 4);
        }
        // If requested, cleanse the interior -- no interesting terrain allowed.
        if (this.purgeInterior) {
            interior.forEach((v, x, y) => {
                if (v)
                    site$1.setTile(x, y, FLOOR);
            });
        }
        // If requested, purge pathing blockers -- no traps allowed.
        if (this.purgeBlockers) {
            interior.forEach((v, x, y) => {
                if (!v)
                    return;
                if (site$1.blocksPathing(x, y)) {
                    site$1.setTile(x, y, FLOOR);
                }
            });
        }
        // If requested, purge the liquid layer in the interior -- no liquids allowed.
        if (this.purgeLiquids) {
            interior.forEach((v, x, y) => {
                if (v && site$1.isAnyLiquid(x, y)) {
                    site$1.setTile(x, y, FLOOR);
                }
            });
        }
        // Surround with walls if requested.
        if (this.surroundWithWalls) {
            interior.forEach((v, x, y) => {
                if (!v ||
                    site$1
                        .cellInfo(x, y)
                        .hasCellFlag(map.flags.Cell.IS_GATE_SITE))
                    return;
                utils$1.eachNeighbor(x, y, (i, j) => {
                    if (!interior.hasXY(i, j))
                        return; // Not valid x,y
                    if (interior[i][j])
                        return; // is part of machine
                    if (site$1.isWall(i, j))
                        return; // is already a wall (of some sort)
                    if (site$1
                        .cellInfo(i, j)
                        .hasCellFlag(map.flags.Cell.IS_GATE_SITE))
                        return; // is a door site
                    if (site$1
                        .cellInfo(i, j)
                        .hasCellFlag(map.flags.Cell.IS_IN_MACHINE))
                        return; // is part of a machine
                    if (!site$1.blocksPathing(i, j))
                        return; // is not a blocker for the player (water?)
                    site$1.setTile(i, j, WALL);
                }, false);
            });
        }
        // Completely clear the interior, fill with granite, and cut entirely new rooms into it from the gate site.
        // Then zero out any portion of the interior that is still wall.
        // if (flags & BPFlags.BP_REDESIGN_INTERIOR) {
        //     RUT.Map.Blueprint.redesignInterior(map, interior, originX, originY, dungeonProfileIndex);
        // }
        // Reinforce surrounding tiles and interior tiles if requested to prevent tunneling in or through.
        if (this.makeImpregnable) {
            interior.forEach((v, x, y) => {
                if (!v ||
                    site$1
                        .cellInfo(x, y)
                        .hasCellFlag(map.flags.Cell.IS_GATE_SITE))
                    return;
                site$1.setCellFlag(x, y, map.flags.Cell.IMPREGNABLE);
                utils$1.eachNeighbor(x, y, (i, j) => {
                    if (!interior.hasXY(i, j))
                        return;
                    if (interior[i][j])
                        return;
                    if (site$1
                        .cellInfo(i, j)
                        .hasCellFlag(map.flags.Cell.IS_GATE_SITE))
                        return;
                    site$1.setCellFlag(i, j, map.flags.Cell.IMPREGNABLE);
                }, false);
            });
        }
        // If necessary, label the interior as IS_IN_AREA_MACHINE or IS_IN_ROOM_MACHINE and mark down the number.
        const machineNumber = builder.machineNumber;
        interior.forEach((v, x, y) => {
            if (!v)
                return;
            site$1.setMachine(x, y, machineNumber, this.isRoom);
            // secret doors mess up machines
            if (site$1.isSecretDoor(x, y)) {
                site$1.setTile(x, y, DOOR);
            }
        });
    }
    expandMachineInterior(builder, minimumInteriorNeighbors = 1) {
        let madeChange;
        const interior = builder.interior;
        const site$1 = builder.site;
        do {
            madeChange = false;
            interior.forEach((_v, x, y) => {
                // if (v && site.isDoor(x, y)) {
                //     site.setTile(x, y, DIG_SITE.FLOOR); // clean out the doors...
                //     return;
                // }
                if (site$1
                    .cellInfo(x, y)
                    .hasCellFlag(map.flags.Cell.IS_IN_MACHINE))
                    return;
                if (!site$1.blocksPathing(x, y))
                    return;
                let nbcount = 0;
                utils$1.eachNeighbor(x, y, (i, j) => {
                    if (!interior.hasXY(i, j))
                        return; // Not in map
                    if (interior[i][j] && !site$1.blocksPathing(i, j)) {
                        ++nbcount; // in machine and open tile
                    }
                }, false);
                if (nbcount < minimumInteriorNeighbors)
                    return;
                nbcount = 0;
                utils$1.eachNeighbor(x, y, (i, j) => {
                    if (!interior.hasXY(i, j))
                        return; // not on map
                    if (interior[i][j])
                        return; // already part of machine
                    if (!site$1.isWall(i, j) ||
                        site$1
                            .cellInfo(i, j)
                            .hasCellFlag(map.flags.Cell.IS_IN_MACHINE)) {
                        ++nbcount; // tile is not a wall or is in a machine
                    }
                }, false);
                if (nbcount)
                    return;
                // Eliminate this obstruction; welcome its location into the machine.
                madeChange = true;
                interior[x][y] = 1;
                if (site$1.blocksPathing(x, y)) {
                    site$1.setTile(x, y, FLOOR);
                }
                utils$1.eachNeighbor(x, y, (i, j) => {
                    if (!interior.hasXY(i, j))
                        return;
                    if (site$1.isSet(i, j))
                        return;
                    site$1.setTile(i, j, WALL);
                });
            });
        } while (madeChange);
    }
    calcDistances(builder) {
        builder.distanceMap.fill(0);
        computeDistanceMap(builder.site, builder.distanceMap, builder.originX, builder.originY, this.size[1]);
        let qualifyingTileCount = 0;
        const distances = new Array(100).fill(0);
        builder.interior.forEach((v, x, y) => {
            if (!v)
                return;
            const dist = builder.distanceMap[x][y];
            if (dist < 100) {
                distances[dist]++; // create a histogram of distances -- poor man's sort function
                qualifyingTileCount++;
            }
        });
        let distance25 = Math.round(qualifyingTileCount / 4);
        let distance75 = Math.round((3 * qualifyingTileCount) / 4);
        for (let i = 0; i < 100; i++) {
            if (distance25 <= distances[i]) {
                distance25 = i;
                break;
            }
            else {
                distance25 -= distances[i];
            }
        }
        for (let i = 0; i < 100; i++) {
            if (distance75 <= distances[i]) {
                distance75 = i;
                break;
            }
            else {
                distance75 -= distances[i];
            }
        }
        builder.distance25 = distance25;
        builder.distance75 = distance75;
    }
    pickComponents() {
        const alternativeFlags = [
            StepFlags.BF_ALTERNATIVE,
            StepFlags.BF_ALTERNATIVE_2,
        ];
        const keepFeature = new Array(this.steps.length).fill(true);
        for (let j = 0; j <= 1; j++) {
            let totalFreq = 0;
            for (let i = 0; i < keepFeature.length; i++) {
                if (this.steps[i].flags & alternativeFlags[j]) {
                    keepFeature[i] = false;
                    totalFreq++;
                }
            }
            if (totalFreq > 0) {
                let randIndex = random$1.range(1, totalFreq);
                for (let i = 0; i < keepFeature.length; i++) {
                    if (this.steps[i].flags & alternativeFlags[j]) {
                        if (randIndex == 1) {
                            keepFeature[i] = true; // This is the alternative that gets built. The rest do not.
                            break;
                        }
                        else {
                            randIndex--;
                        }
                    }
                }
            }
        }
        return this.steps.filter((_f, i) => keepFeature[i]);
    }
    clearInteriorFlag(builder) {
        builder.interior.forEach((v, x, y) => {
            if (!v)
                return;
            if (!builder.site
                .cellInfo(x, y)
                .hasCellFlag(map.flags.Cell.IS_WIRED |
                map.flags.Cell.IS_CIRCUIT_BREAKER)) {
                builder.site.setMachine(x, y, 0);
            }
        });
        // for (i = 0; i < map.width; i++) {
        //     for (j = 0; j < map.height; j++) {
        //         const cell = RUT.Map.getCell(map, i, j);
        //         if (
        //             cell.machineNumber == map.machineNumber &&
        //             !RUT.Cell.hasMechFlag(
        //                 cell,
        //                 MechFlags.TM_IS_WIRED |
        //                     MechFlags.TM_IS_CIRCUIT_BREAKER
        //             )
        //         ) {
        //             cell.flags &= ~CellFlags.IS_IN_MACHINE;
        //             cell.machineNumber = 0;
        //         }
        //     }
        // }
    }
}
const blueprints = {};
function install$2(id, blueprint) {
    if (!(blueprint instanceof Blueprint)) {
        blueprint = new Blueprint(blueprint);
    }
    blueprints[id] = blueprint;
    blueprint.id = id;
    return blueprint;
}
function random(requiredFlags, depth) {
    const matches = Object.values(blueprints).filter((b) => b.qualifies(requiredFlags, depth));
    return random$1.item(matches);
}

var blueprint = {
    __proto__: null,
    get Flags () { return Flags$1; },
    Blueprint: Blueprint,
    blueprints: blueprints,
    install: install$2,
    random: random
};

const Fl$1 = flag.fl;
var StepFlags;
(function (StepFlags) {
    // BF_GENERATE_ITEM				= Fl(0),	// feature entails generating an item (overridden if the machine is adopting an item)
    // BF_GENERATE_HORDE			= Fl(5),	// generate a monster horde that has all of the horde flags
    // BF_NO_THROWING_WEAPONS	    = Fl(4),	// the generated item cannot be a throwing weapon
    // BF_REQUIRE_GOOD_RUNIC		= Fl(18),	// generated item must be uncursed runic
    StepFlags[StepFlags["BF_OUTSOURCE_ITEM_TO_MACHINE"] = Fl$1(1)] = "BF_OUTSOURCE_ITEM_TO_MACHINE";
    StepFlags[StepFlags["BF_BUILD_VESTIBULE"] = Fl$1(2)] = "BF_BUILD_VESTIBULE";
    StepFlags[StepFlags["BF_ADOPT_ITEM"] = Fl$1(3)] = "BF_ADOPT_ITEM";
    StepFlags[StepFlags["BF_BUILD_AT_ORIGIN"] = Fl$1(6)] = "BF_BUILD_AT_ORIGIN";
    // unused                   = Fl(7),	//
    StepFlags[StepFlags["BF_PERMIT_BLOCKING"] = Fl$1(8)] = "BF_PERMIT_BLOCKING";
    StepFlags[StepFlags["BF_TREAT_AS_BLOCKING"] = Fl$1(9)] = "BF_TREAT_AS_BLOCKING";
    StepFlags[StepFlags["BF_NEAR_ORIGIN"] = Fl$1(10)] = "BF_NEAR_ORIGIN";
    StepFlags[StepFlags["BF_FAR_FROM_ORIGIN"] = Fl$1(11)] = "BF_FAR_FROM_ORIGIN";
    StepFlags[StepFlags["BF_IN_VIEW_OF_ORIGIN"] = Fl$1(25)] = "BF_IN_VIEW_OF_ORIGIN";
    StepFlags[StepFlags["BF_IN_PASSABLE_VIEW_OF_ORIGIN"] = Fl$1(26)] = "BF_IN_PASSABLE_VIEW_OF_ORIGIN";
    StepFlags[StepFlags["BF_MONSTER_TAKE_ITEM"] = Fl$1(12)] = "BF_MONSTER_TAKE_ITEM";
    StepFlags[StepFlags["BF_MONSTER_SLEEPING"] = Fl$1(13)] = "BF_MONSTER_SLEEPING";
    StepFlags[StepFlags["BF_MONSTER_FLEEING"] = Fl$1(14)] = "BF_MONSTER_FLEEING";
    StepFlags[StepFlags["BF_MONSTERS_DORMANT"] = Fl$1(19)] = "BF_MONSTERS_DORMANT";
    StepFlags[StepFlags["BF_ITEM_IS_KEY"] = Fl$1(0)] = "BF_ITEM_IS_KEY";
    StepFlags[StepFlags["BF_ITEM_IDENTIFIED"] = Fl$1(5)] = "BF_ITEM_IDENTIFIED";
    StepFlags[StepFlags["BF_ITEM_PLAYER_AVOIDS"] = Fl$1(4)] = "BF_ITEM_PLAYER_AVOIDS";
    StepFlags[StepFlags["BF_EVERYWHERE"] = Fl$1(15)] = "BF_EVERYWHERE";
    StepFlags[StepFlags["BF_ALTERNATIVE"] = Fl$1(16)] = "BF_ALTERNATIVE";
    StepFlags[StepFlags["BF_ALTERNATIVE_2"] = Fl$1(17)] = "BF_ALTERNATIVE_2";
    // unused                       = Fl(20),	//
    StepFlags[StepFlags["BF_BUILD_IN_WALLS"] = Fl$1(21)] = "BF_BUILD_IN_WALLS";
    StepFlags[StepFlags["BF_BUILD_ANYWHERE_ON_LEVEL"] = Fl$1(22)] = "BF_BUILD_ANYWHERE_ON_LEVEL";
    StepFlags[StepFlags["BF_REPEAT_UNTIL_NO_PROGRESS"] = Fl$1(23)] = "BF_REPEAT_UNTIL_NO_PROGRESS";
    StepFlags[StepFlags["BF_IMPREGNABLE"] = Fl$1(24)] = "BF_IMPREGNABLE";
    StepFlags[StepFlags["BF_NOT_IN_HALLWAY"] = Fl$1(27)] = "BF_NOT_IN_HALLWAY";
    StepFlags[StepFlags["BF_NOT_ON_LEVEL_PERIMETER"] = Fl$1(28)] = "BF_NOT_ON_LEVEL_PERIMETER";
    StepFlags[StepFlags["BF_SKELETON_KEY"] = Fl$1(29)] = "BF_SKELETON_KEY";
    StepFlags[StepFlags["BF_KEY_DISPOSABLE"] = Fl$1(30)] = "BF_KEY_DISPOSABLE";
})(StepFlags || (StepFlags = {}));
class BuildStep {
    constructor(cfg = {}) {
        this.tile = 0;
        this.flags = 0;
        this.pad = 0;
        this.item = null;
        this.horde = null;
        this.effect = null;
        this.chance = 0;
        this.id = 'n/a';
        if (cfg.tile) {
            if (typeof cfg.tile === 'string') {
                const t = tile.tiles[cfg.tile];
                if (!t) {
                    throw new Error('Failed to find tile: ' + cfg.tile);
                }
                this.tile = t.index;
            }
            else {
                this.tile = cfg.tile;
            }
        }
        if (cfg.flags) {
            this.flags = flag.from(StepFlags, cfg.flags);
        }
        if (cfg.pad) {
            this.pad = cfg.pad;
        }
        this.count = range.make(cfg.count || 1);
        this.item = cfg.item || null;
        this.horde = cfg.horde || null;
        if (cfg.effect) {
            this.effect = effect.make(cfg.effect);
        }
    }
    cellIsCandidate(builder, blueprint, x, y, distanceBound) {
        const site = builder.site;
        // No building in the hallway if it's prohibited.
        // This check comes before the origin check, so an area machine will fail altogether
        // if its origin is in a hallway and the feature that must be built there does not permit as much.
        if (this.flags & StepFlags.BF_NOT_IN_HALLWAY &&
            utils$1.arcCount(x, y, (i, j) => site.hasXY(i, j) && site.isPassable(i, j)) > 1) {
            return false;
        }
        // No building along the perimeter of the level if it's prohibited.
        if (this.flags & StepFlags.BF_NOT_ON_LEVEL_PERIMETER &&
            (x == 0 || x == site.width - 1 || y == 0 || y == site.height - 1)) {
            return false;
        }
        // The origin is a candidate if the feature is flagged to be built at the origin.
        // If it's a room, the origin (i.e. doorway) is otherwise NOT a candidate.
        if (this.flags & StepFlags.BF_BUILD_AT_ORIGIN) {
            return x == builder.originX && y == builder.originY ? true : false;
        }
        else if (blueprint.isRoom &&
            x == builder.originX &&
            y == builder.originY) {
            return false;
        }
        // No building in another feature's personal space!
        if (builder.occupied[x][y]) {
            return false;
        }
        // Must be in the viewmap if the appropriate flag is set.
        if (this.flags &
            (StepFlags.BF_IN_VIEW_OF_ORIGIN |
                StepFlags.BF_IN_PASSABLE_VIEW_OF_ORIGIN) &&
            !builder.viewMap[x][y]) {
            return false;
        }
        // Do a distance check if the feature requests it.
        let distance = 10000;
        if (site.isWall(x, y)) {
            // Distance is calculated for walls too.
            utils$1.eachNeighbor(x, y, (i, j) => {
                if (!builder.distanceMap.hasXY(i, j))
                    return;
                if (!site.blocksPathing(i, j) &&
                    distance > builder.distanceMap[i][j] + 1) {
                    distance = builder.distanceMap[i][j] + 1;
                }
            }, true);
        }
        else {
            distance = builder.distanceMap[x][y];
        }
        if (distance > distanceBound[1] || // distance exceeds max
            distance < distanceBound[0]) {
            // distance falls short of min
            return false;
        }
        if (this.flags & StepFlags.BF_BUILD_IN_WALLS) {
            // If we're supposed to build in a wall...
            const cellMachine = site.getMachine(x, y);
            if (!builder.interior[x][y] &&
                (!cellMachine || cellMachine == builder.machineNumber) &&
                site.isWall(x, y)) {
                let ok = false;
                // ...and this location is a wall that's not already machined...
                utils$1.eachNeighbor(x, y, (newX, newY) => {
                    if (site.hasXY(newX, newY) && // ...and it's next to an interior spot or permitted elsewhere and next to passable spot...
                        ((builder.interior[newX][newY] &&
                            !(newX == builder.originX &&
                                newY == builder.originY)) ||
                            (this.flags &
                                StepFlags.BF_BUILD_ANYWHERE_ON_LEVEL &&
                                !site.blocksPathing(newX, newY) &&
                                !site.getMachine(newX, newY)))) {
                        ok = true;
                    }
                });
                return ok;
            }
            return false;
        }
        else if (site.isWall(x, y)) {
            // Can't build in a wall unless instructed to do so.
            return false;
        }
        else if (this.flags & StepFlags.BF_BUILD_ANYWHERE_ON_LEVEL) {
            if ((this.item && site.blocksItems(x, y)) ||
                site
                    .cellInfo(x, y)
                    .hasCellFlag(map.flags.Cell.IS_CHOKEPOINT |
                    map.flags.Cell.IS_IN_LOOP |
                    map.flags.Cell.IS_IN_MACHINE)) {
                return false;
            }
            else {
                return true;
            }
        }
        else if (builder.interior[x][y]) {
            return true;
        }
        return false;
    }
    makePersonalSpace(builder, x, y, candidates) {
        const personalSpace = this.pad;
        let count = 0;
        for (let i = x - personalSpace + 1; i <= x + personalSpace - 1; i++) {
            for (let j = y - personalSpace + 1; j <= y + personalSpace - 1; j++) {
                if (builder.site.hasXY(i, j)) {
                    if (candidates[i][j]) {
                        candidates[i][j] = 0;
                        ++count;
                    }
                    builder.occupied[i][j] = 1;
                }
            }
        }
        return count;
    }
    get generateEverywhere() {
        return !!(this.flags &
            StepFlags.BF_EVERYWHERE &
            ~StepFlags.BF_BUILD_AT_ORIGIN);
    }
    get buildAtOrigin() {
        return !!(this.flags & StepFlags.BF_BUILD_AT_ORIGIN);
    }
    distanceBound(builder) {
        const distanceBound = [0, 10000];
        if (this.flags & StepFlags.BF_NEAR_ORIGIN) {
            distanceBound[1] = builder.distance25;
        }
        if (this.flags & StepFlags.BF_FAR_FROM_ORIGIN) {
            distanceBound[0] = builder.distance75;
        }
        return distanceBound;
    }
    updateViewMap(builder) {
        if (this.flags &
            (StepFlags.BF_IN_VIEW_OF_ORIGIN |
                StepFlags.BF_IN_PASSABLE_VIEW_OF_ORIGIN)) {
            const site = builder.site;
            if (this.flags & StepFlags.BF_IN_PASSABLE_VIEW_OF_ORIGIN) {
                const fov$1 = new fov.FOV({
                    isBlocked: (x, y) => {
                        return site.blocksPathing(x, y);
                    },
                    hasXY: (x, y) => {
                        return site.hasXY(x, y);
                    },
                });
                fov$1.calculate(builder.originX, builder.originY, 50, (x, y) => {
                    builder.viewMap[x][y] = 1;
                });
            }
            else {
                const fov$1 = new fov.FOV({
                    // TileFlags.T_OBSTRUCTS_PASSABILITY |
                    //     TileFlags.T_OBSTRUCTS_VISION,
                    isBlocked: (x, y) => {
                        return (site.blocksPathing(x, y) || site.blocksVision(x, y));
                    },
                    hasXY: (x, y) => {
                        return site.hasXY(x, y);
                    },
                });
                fov$1.calculate(builder.originX, builder.originY, 50, (x, y) => {
                    builder.viewMap[x][y] = 1;
                });
            }
            builder.viewMap[builder.originX][builder.originY] = 1;
        }
    }
    markCandidates(candidates, builder, blueprint, distanceBound) {
        let count = 0;
        candidates.update((_v, i, j) => {
            if (this.cellIsCandidate(builder, blueprint, i, j, distanceBound)) {
                count++;
                return 1;
            }
            else {
                return 0;
            }
        });
        return count;
    }
    build(builder, blueprint) {
        let instanceCount = 0;
        let instance = 0;
        const site = builder.site;
        const candidates = grid.alloc(site.width, site.height);
        // Figure out the distance bounds.
        const distanceBound = this.distanceBound(builder);
        this.updateViewMap(builder);
        do {
            // If the StepFlags.BF_REPEAT_UNTIL_NO_PROGRESS flag is set, repeat until we fail to build the required number of instances.
            // Make a master map of candidate locations for this feature.
            let qualifyingTileCount = this.markCandidates(candidates, builder, blueprint, distanceBound);
            if (!this.generateEverywhere) {
                instanceCount = this.count.value();
            }
            if (!qualifyingTileCount || qualifyingTileCount < this.count.lo) {
                console.warn('Only %s qualifying tiles - want at least %s.', qualifyingTileCount, this.count.lo);
                return 0; // ?? Failed ??
            }
            let x = 0, y = 0;
            for (instance = 0; (this.generateEverywhere || instance < instanceCount) &&
                qualifyingTileCount > 0;) {
                // Find a location for the feature.
                if (this.buildAtOrigin) {
                    // Does the feature want to be at the origin? If so, put it there. (Just an optimization.)
                    x = builder.originX;
                    y = builder.originY;
                }
                else {
                    // Pick our candidate location randomly, and also strike it from
                    // the candidates map so that subsequent instances of this same feature can't choose it.
                    [x, y] = random$1.matchingLoc(candidates.width, candidates.height, (x, y) => candidates[x][y] > 0);
                }
                // Don't waste time trying the same place again whether or not this attempt succeeds.
                candidates[x][y] = 0;
                qualifyingTileCount--;
                let DFSucceeded = true;
                let terrainSucceeded = true;
                // Try to build the DF first, if any, since we don't want it to be disrupted by subsequently placed terrain.
                if (this.effect) {
                    DFSucceeded = effect.fireSync(this.effect, site, x, y);
                }
                // Now try to place the terrain tile, if any.
                if (DFSucceeded && this.tile) {
                    let tile$1 = tile.get(this.tile).index;
                    if (!tile$1) {
                        terrainSucceeded = false;
                        console.error('placing invalid tile', this.tile, x, y);
                    }
                    else if (!(this.flags & StepFlags.BF_PERMIT_BLOCKING) &&
                        (site.tileBlocksMove(tile$1) ||
                            this.flags & StepFlags.BF_TREAT_AS_BLOCKING)) {
                        // Yes, check for blocking.
                        const blockingMap = grid.alloc(site.width, site.height);
                        blockingMap[x][y] = 1;
                        terrainSucceeded = !siteDisruptedBy(site, blockingMap);
                        grid.free(blockingMap);
                    }
                    if (terrainSucceeded) {
                        site.setTile(x, y, tile$1);
                    }
                }
                // OK, if placement was successful, clear some personal space around the feature so subsequent features can't be generated too close.
                // Personal space of 0 means nothing gets cleared, 1 means that only the tile itself gets cleared, and 2 means the 3x3 grid centered on it.
                if (DFSucceeded && terrainSucceeded) {
                    qualifyingTileCount -= this.makePersonalSpace(builder, x, y, candidates);
                    instance++; // we've placed an instance
                    //DEBUG printf("\nPlaced instance #%i of feature %i at (%i, %i).", instance, feat, featX, featY);
                }
                if (DFSucceeded && terrainSucceeded) {
                    // Proceed only if the terrain stuff for this instance succeeded.
                    // Mark the feature location as part of the machine, in case it is not already inside of it.
                    if (!(blueprint.flags & Flags$1.BP_NO_INTERIOR_FLAG)) {
                        site.setMachine(x, y, builder.machineNumber, blueprint.isRoom);
                    }
                    // Mark the feature location as impregnable if requested.
                    if (this.flags & StepFlags.BF_IMPREGNABLE) {
                        site.setCellFlag(x, y, map.flags.Cell.IMPREGNABLE);
                    }
                    // let success = RUT.Component.generateAdoptItem(
                    //     component,
                    //     blueprint,
                    //     map,
                    //     xy.x,
                    //     xy.y,
                    //     context
                    // );
                    // if (!success) {
                    //     GW.grid.free(candidates);
                    //     return false;
                    // }
                    // // Generate a horde as necessary.
                    // success = RUT.Component.generateMonsters(
                    //     component,
                    //     blueprint,
                    //     map,
                    //     xy.x,
                    //     xy.y,
                    //     context
                    // );
                    // if (!success) {
                    //     GW.grid.free(candidates);
                    //     return false;
                    // }
                }
                // Finished with this instance!
            }
        } while (this.flags & StepFlags.BF_REPEAT_UNTIL_NO_PROGRESS &&
            instance <= this.count.lo);
        //DEBUG printf("\nFinished feature %i. Here's the candidates map:", feat);
        //DEBUG logBuffer(candidates);
        grid.free(candidates);
        return instance;
    }
}

class Builder {
    constructor(site, depth) {
        this.site = site;
        this.depth = depth;
        this.spawnedItems = [];
        this.spawnedHordes = [];
        this.originX = -1;
        this.originY = -1;
        this.distance25 = -1;
        this.distance75 = -1;
        this.machineNumber = 0;
        this.interior = grid.alloc(site.width, site.height);
        this.occupied = grid.alloc(site.width, site.height);
        this.viewMap = grid.alloc(site.width, site.height);
        this.distanceMap = grid.alloc(site.width, site.height);
    }
    free() {
        grid.free(this.interior);
        grid.free(this.occupied);
        grid.free(this.viewMap);
        grid.free(this.distanceMap);
    }
    buildRandom(requiredMachineFlags = Flags$1.BP_ROOM) {
        let tries = 10;
        while (tries--) {
            const blueprint$1 = random(requiredMachineFlags, this.depth);
            if (!blueprint$1) {
                continue;
            }
            if (this.buildBlueprint(blueprint$1)) {
                return true;
            }
        }
        console.log('Failed to find blueprint matching flags: ' +
            flag.toString(Flags$1, requiredMachineFlags));
        return false;
    }
    buildBlueprint(blueprint) {
        let tries = 10;
        while (tries--) {
            const loc = blueprint.pickLocation(this.site);
            if (!loc) {
                continue;
            }
            if (this.build(blueprint, loc[0], loc[1])) {
                return true;
            }
        }
        console.log('Failed to build blueprint.');
        return false;
    }
    //////////////////////////////////////////
    // Returns true if the machine got built; false if it was aborted.
    // If empty array spawnedItems or spawnedMonsters is given, will pass those back for deletion if necessary.
    build(blueprint, originX, originY) {
        this.interior.fill(0);
        this.occupied.fill(0);
        this.viewMap.fill(0);
        this.distanceMap.fill(0);
        this.originX = originX;
        this.originY = originY;
        if (!blueprint.computeInterior(this)) {
            return false;
        }
        // This is the point of no return. Back up the level so it can be restored if we have to abort this machine after this point.
        const levelBackup = this.site.backup();
        this.machineNumber = this.site.nextMachineId(); // Reserve this machine number, starting with 1.
        // Perform any transformations to the interior indicated by the blueprint flags, including expanding the interior if requested.
        blueprint.prepareInteriorWithMachineFlags(this);
        // Calculate the distance map (so that features that want to be close to or far from the origin can be placed accordingly)
        // and figure out the 33rd and 67th percentiles for features that want to be near or far from the origin.
        blueprint.calcDistances(this);
        // Now decide which features will be skipped -- of the features marked MF_ALTERNATIVE, skip all but one, chosen randomly.
        // Then repeat and do the same with respect to MF_ALTERNATIVE_2, to provide up to two independent sets of alternative features per machine.
        const components = blueprint.pickComponents();
        // Keep track of all monsters and items that we spawn -- if we abort, we have to go back and delete them all.
        // let itemCount = 0, monsterCount = 0;
        // Zero out occupied[][], and use it to keep track of the personal space around each feature that gets placed.
        // Now tick through the features and build them.
        for (let index = 0; index < components.length; index++) {
            const component = components[index];
            // console.log('BUILD COMPONENT', component);
            const count = component.build(this, blueprint);
            if (count < component.count.lo &&
                !(component.flags & StepFlags.BF_REPEAT_UNTIL_NO_PROGRESS)) {
                // failure! abort!
                console.log('Failed to place blueprint because of feature; needed more instances.');
                // Restore the map to how it was before we touched it.
                this.site.restore(levelBackup);
                // abortItemsAndMonsters(spawnedItems, spawnedMonsters);
                return false;
            }
        }
        // Clear out the interior flag for all non-wired cells, if requested.
        if (blueprint.noInteriorFlag) {
            blueprint.clearInteriorFlag(this);
        }
        // if (torchBearer && torch) {
        // 	if (torchBearer->carriedItem) {
        // 		deleteItem(torchBearer->carriedItem);
        // 	}
        // 	removeItemFromChain(torch, floorItems);
        // 	torchBearer->carriedItem = torch;
        // }
        // console.log('Built a machine from blueprint:', originX, originY);
        return true;
    }
}

var index$1 = {
    __proto__: null,
    blueprint: blueprint,
    NOTHING: NOTHING,
    FLOOR: FLOOR,
    DOOR: DOOR,
    SECRET_DOOR: SECRET_DOOR,
    WALL: WALL,
    DEEP: DEEP,
    SHALLOW: SHALLOW,
    BRIDGE: BRIDGE,
    UP_STAIRS: UP_STAIRS,
    DOWN_STAIRS: DOWN_STAIRS,
    IMPREGNABLE: IMPREGNABLE,
    TILEMAP: TILEMAP,
    GridSite: GridSite,
    MapSite: MapSite,
    get StepFlags () { return StepFlags; },
    BuildStep: BuildStep,
    Builder: Builder
};

export { index$1 as build, index as dig };
