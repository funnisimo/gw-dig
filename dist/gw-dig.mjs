import * as GWM from 'gw-map';
import * as GWU from 'gw-utils';

var _a, _b;
const NOTHING = GWM.tile.get('NULL').index;
const FLOOR = GWM.tile.get('FLOOR').index;
const DOOR = GWM.tile.get('DOOR').index;
const SECRET_DOOR = (_b = (_a = GWM.tile.get('DOOR_SECRET')) === null || _a === void 0 ? void 0 : _a.index) !== null && _b !== void 0 ? _b : -1;
const WALL = GWM.tile.get('WALL').index;
const DEEP = GWM.tile.get('LAKE').index;
const SHALLOW = GWM.tile.get('SHALLOW').index;
const BRIDGE = GWM.tile.get('BRIDGE').index;
const UP_STAIRS = GWM.tile.get('UP_STAIRS').index;
const DOWN_STAIRS = GWM.tile.get('DOWN_STAIRS').index;
const IMPREGNABLE = GWM.tile.get('IMPREGNABLE').index;
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

// import * as TYPES from './types';
const DIRS$1 = GWU.xy.DIRS;
// export function attachRoom(
//     map: GWU.grid.NumGrid,
//     roomGrid: GWU.grid.NumGrid,
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
//         if (dir != GWU.xy.NO_DIRECTION) {
//             const oppDir = (dir + 2) % 4;
//             const door = doorSites[oppDir];
//             if (!door) continue;
//             const offsetX = x - door[0];
//             const offsetY = y - door[1];
//             if (door[0] != -1 && roomFitsAt(map, roomGrid, offsetX, offsetY)) {
//                 // TYPES.Room fits here.
//                 GWU.grid.offsetZip(
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
//     map: GWU.grid.NumGrid,
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
//     if (dir === GWU.utils.UP || dir === GWU.utils.DOWN) {
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
//     map: GWU.grid.NumGrid,
//     roomGrid: GWU.grid.NumGrid,
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
    solutionDir = GWU.xy.NO_DIRECTION;
    for (dir = 0; dir < 4; dir++) {
        newX = x + DIRS$1[dir][0];
        newY = y + DIRS$1[dir][1];
        oppX = x - DIRS$1[dir][0];
        oppY = y - DIRS$1[dir][1];
        if (site.hasXY(oppX, oppY) &&
            site.hasXY(newX, newY) &&
            site.isFloor(oppX, oppY)) {
            // This grid cell would be a valid tile on which to place a door that, facing outward, points dir.
            if (solutionDir != GWU.xy.NO_DIRECTION) {
                // Already claimed by another direction; no doors here!
                return GWU.xy.NO_DIRECTION;
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
    // const grid = GWU.grid.alloc(sourceGrid.width, sourceGrid.height);
    // grid.copy(sourceGrid);
    const h = site.height;
    const w = site.width;
    for (i = 0; i < w; i++) {
        for (j = 0; j < h; j++) {
            if (site.isDiggable(i, j)) {
                dir = directionOfDoorSite(site, i, j);
                if (dir != GWU.xy.NO_DIRECTION) {
                    // Trace a ray 10 spaces outward from the door site to make sure it doesn't intersect the room.
                    // If it does, it's not a valid door site.
                    newX = i + GWU.xy.DIRS[dir][0];
                    newY = j + GWU.xy.DIRS[dir][1];
                    doorSiteFailed = false;
                    for (k = 0; k < 10 && site.hasXY(newX, newY) && !doorSiteFailed; k++) {
                        if (site.isSet(newX, newY)) {
                            doorSiteFailed = true;
                        }
                        newX += GWU.xy.DIRS[dir][0];
                        newY += GWU.xy.DIRS[dir][1];
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
        const loc = site.rng.item(DOORS[dir]) || [-1, -1];
        doorSites[dir] = [loc[0], loc[1]];
    }
    // GWU.grid.free(grid);
    return doorSites;
}
// export function forceRoomAtMapLoc(
//     map: GWU.grid.NumGrid,
//     xy: GWU.xy.Loc,
//     roomGrid: GWU.grid.NumGrid,
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
//         if (dir != GWU.xy.NO_DIRECTION) {
//             const dx = xy[0] - x;
//             const dy = xy[1] - y;
//             if (roomFitsAt(map, roomGrid, dx, dy)) {
//                 GWU.grid.offsetZip(map, roomGrid, dx, dy, (_d, _s, i, j) => {
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
//     map: GWU.grid.NumGrid,
//     mapDoors: GWU.xy.Loc[],
//     roomGrid: GWU.grid.NumGrid,
//     room: TYPES.Room,
//     opts: TYPES.DigInfo
// ): boolean | GWU.xy.Loc[] {
//     const doorIndexes = site.rng.sequence(mapDoors.length);
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
//     map: GWU.grid.NumGrid,
//     x: number,
//     y: number,
//     roomGrid: GWU.grid.NumGrid,
//     room: TYPES.Room,
//     opts: TYPES.DigInfo
// ): boolean | GWU.xy.Loc[] {
//     const doorSites = room.hall ? room.hall.doors : room.doors;
//     const dirs = site.rng.sequence(4);
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
//             GWU.grid.offsetZip(map, roomGrid, offX, offY, (_d, _s, i, j) => {
//                 map[i][j] = opts.room.tile || SITE.FLOOR;
//             });
//             attachDoor(map, room, opts, x, y, oppDir);
//             room.translate(offX, offY);
//             // const newDoors = doorSites.map((site) => {
//             //     const x0 = site[0] + offX;
//             //     const y0 = site[1] + offY;
//             //     if (x0 == x && y0 == y) return [-1, -1] as GWU.xy.Loc;
//             //     return [x0, y0] as GWU.xy.Loc;
//             // });
//             return true;
//         }
//     }
//     return false;
// }
function copySite(dest, source, offsetX = 0, offsetY = 0) {
    GWU.xy.forRect(dest.width, dest.height, (x, y) => {
        const otherX = x - offsetX;
        const otherY = y - offsetY;
        const v = source.getTileIndex(otherX, otherY);
        if (!v)
            return;
        dest.setTile(x, y, v);
    });
}
function fillCostGrid(source, costGrid) {
    costGrid.update((_v, x, y) => source.isPassable(x, y) ? 1 : GWU.path.OBSTRUCTION);
}
function siteDisruptedByXY(site, x, y, options = {}) {
    var _a, _b, _c;
    (_a = options.offsetX) !== null && _a !== void 0 ? _a : (options.offsetX = 0);
    (_b = options.offsetY) !== null && _b !== void 0 ? _b : (options.offsetY = 0);
    (_c = options.machine) !== null && _c !== void 0 ? _c : (options.machine = 0);
    if (GWU.xy.arcCount(x, y, (i, j) => {
        return site.isPassable(i, j);
    }) <= 1)
        return false;
    const blockingGrid = GWU.grid.alloc(site.width, site.height);
    blockingGrid[x][y] = 1;
    const result = siteDisruptedBy(site, blockingGrid, options);
    GWU.grid.free(blockingGrid);
    return result;
}
function siteDisruptedBy(site, blockingGrid, options = {}) {
    var _a, _b, _c;
    (_a = options.offsetX) !== null && _a !== void 0 ? _a : (options.offsetX = 0);
    (_b = options.offsetY) !== null && _b !== void 0 ? _b : (options.offsetY = 0);
    (_c = options.machine) !== null && _c !== void 0 ? _c : (options.machine = 0);
    const walkableGrid = GWU.grid.alloc(site.width, site.height);
    let disrupts = false;
    // Get all walkable locations after lake added
    GWU.xy.forRect(site.width, site.height, (i, j) => {
        const blockingX = i + options.offsetX;
        const blockingY = j + options.offsetY;
        if (blockingGrid.get(blockingX, blockingY)) {
            if (site.isStairs(i, j)) {
                disrupts = true;
            }
        }
        else if (site.isPassable(i, j) &&
            (site.getMachine(i, j) == 0 ||
                site.getMachine(i, j) == options.machine)) {
            walkableGrid[i][j] = 1;
        }
    });
    if (options.updateWalkable) {
        if (!options.updateWalkable(walkableGrid)) {
            return true;
        }
    }
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
    GWU.grid.free(walkableGrid);
    return disrupts;
}
function siteDisruptedSize(site, blockingGrid, blockingToMapX = 0, blockingToMapY = 0) {
    const walkableGrid = GWU.grid.alloc(site.width, site.height);
    let disrupts = 0;
    // Get all walkable locations after lake added
    GWU.xy.forRect(site.width, site.height, (i, j) => {
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
    GWU.grid.free(walkableGrid);
    return disrupts;
}
function computeDistanceMap(site, distanceMap, originX, originY, maxDistance) {
    const costGrid = GWU.grid.alloc(site.width, site.height);
    fillCostGrid(site, costGrid);
    GWU.path.calculateDistances(distanceMap, originX, originY, costGrid, false, maxDistance + 1 // max distance is the same as max size of this blueprint
    );
    GWU.grid.free(costGrid);
}
function clearInteriorFlag(site, machine) {
    for (let i = 0; i < site.width; i++) {
        for (let j = 0; j < site.height; j++) {
            if (site.getMachine(i, j) == machine &&
                !site.hasCellFlag(i, j, GWM.flags.Cell.IS_WIRED | GWM.flags.Cell.IS_CIRCUIT_BREAKER)) {
                site.setMachine(i, j, 0);
            }
        }
    }
}

class GridSite {
    constructor(width, height) {
        this.rng = GWU.rng.random;
        this.tiles = GWU.grid.alloc(width, height);
        this.doors = GWU.grid.alloc(width, height);
    }
    free() {
        GWU.grid.free(this.tiles);
        GWU.grid.free(this.doors);
    }
    clear() {
        this.tiles.fill(0);
        this.doors.fill(0);
    }
    dump() {
        this.tiles.dump();
    }
    drawInto(buffer) {
        buffer.blackOut();
        this.tiles.forEach((t, x, y) => {
            const tile = GWM.tile.get(t);
            buffer.drawSprite(x, y, tile.sprite);
        });
    }
    setSeed(seed) {
        this.rng.seed(seed);
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
    setTile(x, y, tile) {
        if (tile instanceof GWM.tile.Tile) {
            tile = tile.index;
        }
        if (typeof tile === 'string') {
            const obj = GWM.tile.tiles[tile];
            if (!obj)
                throw new Error('Failed to find tie: ' + tile);
            tile = obj.index;
        }
        if (!this.tiles.hasXY(x, y))
            return false;
        this.tiles[x][y] = tile;
        return true;
    }
    clearCell(x, y, tile) {
        return this.setTile(x, y, tile);
    }
    hasTile(x, y, tile) {
        if (tile instanceof GWM.tile.Tile) {
            tile = tile.index;
        }
        if (typeof tile === 'string') {
            const obj = GWM.tile.tiles[tile];
            if (!obj)
                throw new Error('Failed to find tie: ' + tile);
            tile = obj.index;
        }
        return this.tiles.hasXY(x, y) && this.tiles[x][y] == tile;
    }
    getMachine(_x, _y) {
        return 0;
    }
    updateDoorDirs() {
        this.doors.update((_v, x, y) => {
            return directionOfDoorSite(this, x, y);
        });
    }
    getDoorDir(x, y) {
        return this.doors[x][y];
    }
}

const Flags$1 = GWM.flags.Cell;
class MapSnapshot {
    constructor(site, snap) {
        this.needsAnalysis = true;
        this.isUsed = false;
        this.site = site;
        this.snapshot = snap;
        this.needsAnalysis = this.site.needsAnalysis;
        this.isUsed = true;
    }
    restore() {
        this.site.snapshots.revertMapTo(this.snapshot);
        this.site.needsAnalysis = this.needsAnalysis;
        this.cancel();
    }
    cancel() {
        this.site.snapshots.release(this.snapshot);
    }
}
class MapSite {
    constructor(map) {
        this.machineCount = 0;
        this.needsAnalysis = true;
        this.map = map;
        this.doors = GWU.grid.alloc(map.width, map.height);
        this.snapshots = new GWM.map.SnapshotManager(map);
    }
    get rng() {
        return this.map.rng;
    }
    get depth() {
        return this.map.properties.depth || 0;
    }
    // get seed() {
    //     return this.map.seed;
    // }
    // set seed(v: number) {
    //     this.map.seed = v;
    // }
    setSeed(seed) {
        this.map.seed = seed;
    }
    get width() {
        return this.map.width;
    }
    get height() {
        return this.map.height;
    }
    free() {
        GWU.grid.free(this.doors);
    }
    dump() {
        this.map.dump();
    }
    drawInto(buffer) {
        this.map.drawInto(buffer);
    }
    hasXY(x, y) {
        return this.map.hasXY(x, y);
    }
    isBoundaryXY(x, y) {
        return this.map.isBoundaryXY(x, y);
    }
    hasCellFlag(x, y, flag) {
        return this.map.cell(x, y).hasCellFlag(flag);
    }
    setCellFlag(x, y, flag) {
        this.needsAnalysis = true;
        this.map.cell(x, y).setCellFlag(flag);
    }
    clearCellFlag(x, y, flag) {
        this.needsAnalysis = true;
        this.map.cell(x, y).clearCellFlag(flag);
    }
    hasTile(x, y, tile) {
        return this.map.cell(x, y).hasTile(tile);
    }
    setTile(x, y, tile, opts) {
        this.needsAnalysis = true;
        return this.map.setTile(x, y, tile, opts);
    }
    clearCell(x, y, tile) {
        this.needsAnalysis = true;
        this.map.clearTiles(x, y, tile);
        return true;
    }
    getTileIndex(x, y) {
        if (!this.hasXY(x, y))
            return 0;
        const cell = this.map.cell(x, y);
        const tile = cell.highestPriorityTile();
        return tile.index;
    }
    clear() {
        this.needsAnalysis = true;
        this.map.cells.forEach((c) => c.clear());
    }
    hasItem(x, y) {
        return this.map.cell(x, y).hasItem();
    }
    makeItem(id, makeOptions) {
        return GWM.item.make(id, makeOptions);
    }
    makeRandomItem(tags, makeOptions) {
        tags.rng = this.rng;
        return GWM.item.makeRandom(tags, makeOptions);
    }
    addItem(x, y, item) {
        this.needsAnalysis = true;
        return this.map.addItem(x, y, item);
    }
    hasActor(x, y) {
        return this.map.hasActor(x, y);
    }
    spawnHorde(horde, x, y, opts = {}) {
        return horde.spawn(this.map, x, y, opts);
    }
    blocksMove(x, y) {
        return this.map.cell(x, y).blocksMove();
    }
    blocksVision(x, y) {
        return this.map.cell(x, y).blocksVision();
    }
    blocksDiagonal(x, y) {
        return this.map
            .cell(x, y)
            .hasEntityFlag(GWM.flags.Entity.L_BLOCKS_DIAGONAL);
    }
    blocksPathing(x, y) {
        const info = this.map.cell(x, y);
        return (info.hasEntityFlag(GWM.flags.Entity.L_BLOCKS_MOVE) ||
            info.hasTileFlag(GWM.tile.flags.Tile.T_PATHING_BLOCKER));
    }
    blocksItems(x, y) {
        return this.map
            .cell(x, y)
            .hasEntityFlag(GWM.flags.Entity.L_BLOCKS_ITEMS);
    }
    blocksEffects(x, y) {
        return this.map
            .cell(x, y)
            .hasEntityFlag(GWM.flags.Entity.L_BLOCKS_EFFECTS);
    }
    isWall(x, y) {
        return this.map.cell(x, y).isWall();
    }
    isStairs(x, y) {
        return this.map.cell(x, y).isStairs();
    }
    isSet(x, y) {
        return this.hasXY(x, y) && !this.map.cell(x, y).isNull();
    }
    isDiggable(x, y) {
        if (!this.hasXY(x, y))
            return false;
        const cell = this.map.cell(x, y);
        if (cell.isNull())
            return true;
        if (cell.isWall())
            return true;
        return false;
    }
    isNothing(x, y) {
        return this.hasXY(x, y) && this.map.cell(x, y).isNull();
    }
    isFloor(x, y) {
        return this.isPassable(x, y);
    }
    isBridge(x, y) {
        return this.map.cell(x, y).hasTileFlag(GWM.tile.flags.Tile.T_BRIDGE);
    }
    isDoor(x, y) {
        return this.map.cell(x, y).hasTileFlag(GWM.tile.flags.Tile.T_IS_DOOR);
    }
    isSecretDoor(x, y) {
        return this.map
            .cell(x, y)
            .hasEntityFlag(GWM.flags.Entity.L_SECRETLY_PASSABLE);
    }
    isDeep(x, y) {
        return this.map
            .cell(x, y)
            .hasTileFlag(GWM.tile.flags.Tile.T_DEEP_WATER);
    }
    isShallow(x, y) {
        if (!this.hasXY(x, y))
            return false;
        const cell = this.map.cell(x, y);
        return (!!cell.depthTile(GWM.flags.Depth.LIQUID) &&
            !cell.hasTileFlag(GWM.tile.flags.Tile.T_IS_DEEP_LIQUID));
    }
    isAnyLiquid(x, y) {
        if (!this.hasXY(x, y))
            return false;
        const cell = this.map.cell(x, y);
        return (cell.hasDepthTile(GWM.flags.Depth.LIQUID) ||
            cell.hasTileFlag(GWM.tile.flags.Tile.T_IS_DEEP_LIQUID));
    }
    isOccupied(x, y) {
        return this.hasItem(x, y) || this.hasActor(x, y);
    }
    isPassable(x, y) {
        const info = this.map.cell(x, y);
        return !(info.blocksMove() || info.blocksPathing());
    }
    // tileBlocksMove(tile: number): boolean {
    //     return GWM.tile.get(tile).blocksMove();
    // }
    snapshot() {
        return new MapSnapshot(this, this.snapshots.takeNew());
    }
    getChokeCount(x, y) {
        return this.map.cell(x, y).chokeCount;
    }
    setChokeCount(x, y, count) {
        this.map.cell(x, y).chokeCount = count;
    }
    analyze() {
        if (this.needsAnalysis) {
            GWM.map.analyze(this.map);
        }
        this.needsAnalysis = false;
    }
    buildEffect(effect, x, y) {
        this.needsAnalysis = true;
        return effect.trigger({ map: this.map, x, y }, { rng: this.rng });
    }
    nextMachineId() {
        return ++this.map.machineCount;
    }
    getMachine(x, y) {
        return this.map.cell(x, y).machineId;
    }
    setMachine(x, y, id, isRoom = true) {
        this.needsAnalysis = true;
        this.map.cell(x, y).machineId = id;
        if (id == 0) {
            this.map.clearCellFlag(x, y, Flags$1.IS_IN_MACHINE);
        }
        else {
            this.map.setCellFlag(x, y, isRoom ? Flags$1.IS_IN_ROOM_MACHINE : Flags$1.IS_IN_AREA_MACHINE);
        }
    }
    updateDoorDirs() {
        this.doors.update((_v, x, y) => {
            return directionOfDoorSite(this, x, y);
        });
    }
    getDoorDir(x, y) {
        return this.doors[x][y];
    }
}

var index$3 = /*#__PURE__*/Object.freeze({
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
    directionOfDoorSite: directionOfDoorSite,
    chooseRandomDoorSites: chooseRandomDoorSites,
    copySite: copySite,
    fillCostGrid: fillCostGrid,
    siteDisruptedByXY: siteDisruptedByXY,
    siteDisruptedBy: siteDisruptedBy,
    siteDisruptedSize: siteDisruptedSize,
    computeDistanceMap: computeDistanceMap,
    clearInteriorFlag: clearInteriorFlag,
    GridSite: GridSite,
    MapSnapshot: MapSnapshot,
    MapSite: MapSite
});

class Hall extends GWU.xy.Bounds {
    constructor(x, y, width, height) {
        super(x, y, width, height);
        this.doors = [];
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
    }
}
function makeHall(loc, dirIndex, hallLength, hallWidth = 1) {
    const dir = GWU.xy.DIRS[dirIndex];
    const x = Math.min(loc[0], loc[0] + dir[0] * (hallLength - 1));
    const y = Math.min(loc[1], loc[1] + dir[1] * (hallLength - 1));
    const width = Math.abs(dir[0] * hallLength) || hallWidth;
    const height = Math.abs(dir[1] * hallLength) || hallWidth;
    return new Hall(x, y, width, height);
}
class Room extends GWU.xy.Bounds {
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
//     locs: GWU.xy.Loc[] | null;
//     door: number;
// }

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
        const range = GWU.range.make(have); // throws if invalid
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
            this.randomRoom = (rng) => rng.item(choices);
        }
        else if (typeof choices == 'object') {
            this.randomRoom = (rng) => rng.weighted(choices);
        }
        else {
            throw new Error('Expected choices to be either array of room ids or weighted map - ex: { ROOM_ID: weight }');
        }
    }
    carve(site) {
        let id = this.randomRoom(site.rng);
        const room = rooms[id];
        if (!room) {
            GWU.ERROR('Missing room digger choice: ' + id);
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
    carve(site) {
        const width = this.options.width.value(site.rng);
        const height = this.options.height.value(site.rng);
        const tile = this.options.tile || FLOOR;
        const blobGrid = GWU.grid.alloc(site.width, site.height, 0);
        const minWidth = Math.floor(0.5 * width); // 6
        const maxWidth = width;
        const minHeight = Math.floor(0.5 * height); // 4
        const maxHeight = height;
        const blob = new GWU.blob.Blob({
            rng: site.rng,
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
        const destX = Math.floor((site.width - bounds.width) / 2);
        const dx = destX - bounds.x;
        const destY = Math.floor((site.height - bounds.height) / 2);
        const dy = destY - bounds.y;
        // ...and copy it to the destination.
        blobGrid.forEach((v, x, y) => {
            if (v)
                site.setTile(x + dx, y + dy, tile);
        });
        GWU.grid.free(blobGrid);
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
    carve(site) {
        const width = this.options.width.value(site.rng);
        const height = this.options.height.value(site.rng);
        const tile = this.options.tile || FLOOR;
        const roomWidth = Math.floor(0.4 * width); // 8
        const roomHeight = height;
        const roomWidth2 = width;
        const roomHeight2 = Math.floor(0.5 * height); // 5
        // ALWAYS start at bottom+center of map
        const roomX = Math.floor(site.width / 2 - roomWidth / 2 - 1);
        const roomY = site.height - roomHeight - 2;
        const roomX2 = Math.floor(site.width / 2 - roomWidth2 / 2 - 1);
        const roomY2 = site.height - roomHeight2 - 2;
        GWU.xy.forRect(roomX, roomY, roomWidth, roomHeight, (x, y) => site.setTile(x, y, tile));
        GWU.xy.forRect(roomX2, roomY2, roomWidth2, roomHeight2, (x, y) => site.setTile(x, y, tile));
        const room = new Room(Math.min(roomX, roomX2), Math.min(roomY, roomY2), Math.max(roomWidth, roomWidth2), Math.max(roomHeight, roomHeight2));
        room.doors[GWU.xy.DOWN] = [Math.floor(site.width / 2), site.height - 2];
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
    carve(site) {
        const width = this.options.width.value(site.rng);
        const height = this.options.height.value(site.rng);
        const tile = this.options.tile || FLOOR;
        const roomWidth = width;
        const roomWidth2 = Math.max(3, Math.floor((width * site.rng.range(25, 75)) / 100)); // [4,20]
        const roomHeight = Math.max(3, Math.floor((height * site.rng.range(25, 75)) / 100)); // [2,5]
        const roomHeight2 = height;
        const roomX = Math.floor((site.width - roomWidth) / 2);
        const roomX2 = roomX + site.rng.range(2, Math.max(2, roomWidth - roomWidth2 - 2));
        const roomY2 = Math.floor((site.height - roomHeight2) / 2);
        const roomY = roomY2 +
            site.rng.range(2, Math.max(2, roomHeight2 - roomHeight - 2));
        GWU.xy.forRect(roomX, roomY, roomWidth, roomHeight, (x, y) => site.setTile(x, y, tile));
        GWU.xy.forRect(roomX2, roomY2, roomWidth2, roomHeight2, (x, y) => site.setTile(x, y, tile));
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
    carve(site) {
        const width = this.options.width.value(site.rng);
        const height = this.options.height.value(site.rng);
        const tile = this.options.tile || FLOOR;
        let minorWidth = Math.max(3, Math.floor((width * site.rng.range(25, 50)) / 100)); // [2,4]
        // if (height % 2 == 0 && minorWidth > 2) {
        //     minorWidth -= 1;
        // }
        let minorHeight = Math.max(3, Math.floor((height * site.rng.range(25, 50)) / 100)); // [2,3]?
        // if (width % 2 == 0 && minorHeight > 2) {
        //     minorHeight -= 1;
        // }
        const x = Math.floor((site.width - width) / 2);
        const y = Math.floor((site.height - minorHeight) / 2);
        GWU.xy.forRect(x, y, width, minorHeight, (x, y) => site.setTile(x, y, tile));
        const x2 = Math.floor((site.width - minorWidth) / 2);
        const y2 = Math.floor((site.height - height) / 2);
        GWU.xy.forRect(x2, y2, minorWidth, height, (x, y) => site.setTile(x, y, tile));
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
    carve(site) {
        const width = this.options.width.value(site.rng);
        const height = this.options.height.value(site.rng);
        const tile = this.options.tile || FLOOR;
        const x = Math.floor((site.width - width) / 2);
        const y = Math.floor((site.height - height) / 2);
        GWU.xy.forRect(x, y, width, height, (x, y) => site.setTile(x, y, tile));
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
    carve(site) {
        const radius = this.options.radius.value(site.rng);
        const tile = this.options.tile || FLOOR;
        const x = Math.floor(site.width / 2);
        const y = Math.floor(site.height / 2);
        if (radius > 1) {
            GWU.xy.forCircle(x, y, radius, (x, y) => site.setTile(x, y, tile));
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
    carve(site) {
        const radius = this.options.radius.value(site.rng);
        const ringMinWidth = this.options.ringMinWidth.value(site.rng);
        const holeMinSize = this.options.holeMinSize.value(site.rng);
        const tile = this.options.tile || FLOOR;
        const x = Math.floor(site.width / 2);
        const y = Math.floor(site.height / 2);
        GWU.xy.forCircle(x, y, radius, (x, y) => site.setTile(x, y, tile));
        if (radius > ringMinWidth + holeMinSize &&
            site.rng.chance(this.options.holeChance.value(site.rng))) {
            GWU.xy.forCircle(x, y, site.rng.range(holeMinSize, radius - holeMinSize), (x, y) => site.setTile(x, y, 0));
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
    carve(site) {
        let i, x, y;
        let chunkCount = this.options.count.value(site.rng);
        const width = this.options.width.value(site.rng);
        const height = this.options.height.value(site.rng);
        const tile = this.options.tile || FLOOR;
        const minX = Math.floor(site.width / 2) - Math.floor(width / 2);
        const maxX = Math.floor(site.width / 2) + Math.floor(width / 2);
        const minY = Math.floor(site.height / 2) - Math.floor(height / 2);
        const maxY = Math.floor(site.height / 2) + Math.floor(height / 2);
        let left = Math.floor(site.width / 2);
        let right = left;
        let top = Math.floor(site.height / 2);
        let bottom = top;
        GWU.xy.forCircle(left, top, 2, (x, y) => site.setTile(x, y, tile));
        left -= 2;
        right += 2;
        top -= 2;
        bottom += 2;
        for (i = 0; i < chunkCount;) {
            x = site.rng.range(minX, maxX);
            y = site.rng.range(minY, maxY);
            if (site.isSet(x, y)) {
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
                GWU.xy.forCircle(x, y, 2, (x, y) => site.setTile(x, y, tile));
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
function install$2(id, room) {
    rooms[id] = room;
    return room;
}
install$2('DEFAULT', new Rectangular());

var room = /*#__PURE__*/Object.freeze({
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
    install: install$2
});

const DIRS = GWU.xy.DIRS;
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
function pickWidth(width, rng) {
    return GWU.clamp(_pickWidth(width, rng), 1, 3);
}
function _pickWidth(width, rng) {
    if (!width)
        return 1;
    if (typeof width === 'number')
        return width;
    rng = rng !== null && rng !== void 0 ? rng : GWU.rng.random;
    if (Array.isArray(width)) {
        width = rng.weighted(width) + 1;
    }
    else if (typeof width === 'string') {
        width = GWU.range.make(width).value(rng);
    }
    else if (width instanceof GWU.range.Range) {
        width = width.value(rng);
    }
    else {
        const weights = width;
        width = Number.parseInt(rng.weighted(weights));
    }
    return width;
}
function pickLength(dir, lengths, rng) {
    if (dir == GWU.xy.UP || dir == GWU.xy.DOWN) {
        return lengths[1].value(rng);
    }
    else {
        return lengths[0].value(rng);
    }
}
function pickHallDirection(site, doors, lengths) {
    // Pick a direction.
    let dir = GWU.xy.NO_DIRECTION;
    if (dir == GWU.xy.NO_DIRECTION) {
        const dirs = site.rng.sequence(4);
        for (let i = 0; i < 4; i++) {
            dir = dirs[i];
            const length = lengths[(i + 1) % 2].hi; // biggest measurement
            const door = doors[dir];
            if (door && door[0] != -1 && door[1] != -1) {
                const dx = door[0] + Math.floor(DIRS[dir][0] * length);
                const dy = door[1] + Math.floor(DIRS[dir][1] * length);
                if (site.hasXY(dx, dy)) {
                    break; // That's our direction!
                }
            }
            dir = GWU.xy.NO_DIRECTION;
        }
    }
    return dir;
}
function pickHallExits(site, x, y, dir, obliqueChance) {
    let newX, newY;
    const allowObliqueHallwayExit = site.rng.chance(obliqueChance);
    const hallDoors = [
    // [-1, -1],
    // [-1, -1],
    // [-1, -1],
    // [-1, -1],
    ];
    for (let dir2 = 0; dir2 < 4; dir2++) {
        newX = x + DIRS[dir2][0];
        newY = y + DIRS[dir2][1];
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
            width: 1,
            length: [GWU.range.make('2-15'), GWU.range.make('2-9')],
            tile: FLOOR,
            obliqueChance: 15,
            chance: 100,
        };
        this._setOptions(options);
    }
    _setOptions(options = {}) {
        if (options.width) {
            this.config.width = options.width;
        }
        if (options.length) {
            if (typeof options.length === 'number') {
                const l = GWU.range.make(options.length);
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
        if (!site.rng.chance(this.config.chance))
            return null;
        const dir = pickHallDirection(site, doors, this.config.length);
        if (dir === GWU.xy.NO_DIRECTION)
            return null;
        if (!doors[dir])
            return null;
        const width = pickWidth(this.config.width, site.rng);
        const length = pickLength(dir, this.config.length, site.rng);
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
        const DIR = DIRS[dir];
        const [x, y] = this._digLine(site, door, DIR, length);
        const hall = makeHall(door, dir, length);
        hall.doors = pickHallExits(site, x, y, dir, this.config.obliqueChance);
        return hall;
    }
    digWide(site, dir, door, length, width) {
        const DIR = GWU.xy.DIRS[dir];
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
        const hall = makeHall([startX, startY], dir, length, width);
        hall.doors = [];
        hall.doors[dir] = [
            door[0] + length * DIR[0],
            door[1] + length * DIR[1],
        ];
        // hall.width = width;
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

var hall = /*#__PURE__*/Object.freeze({
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
});

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
    create(site) {
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
        const hasWreath = site.rng.chance(this.options.wreathChance)
            ? true
            : false;
        const wreathTile = this.options.wreathTile || SHALLOW;
        const wreathSize = this.options.wreathSize || 1; // TODO - make this a range "0-2" or a weighted choice { 0: 50, 1: 40, 2" 10 }
        const tile = this.options.tile || DEEP;
        const lakeGrid = GWU.grid.alloc(site.width, site.height, 0);
        let attempts = 0;
        while (attempts < maxCount && count < maxCount) {
            // lake generations
            const width = Math.round(((lakeMaxWidth - lakeMinSize) * (maxCount - attempts)) /
                maxCount) + lakeMinSize;
            const height = Math.round(((lakeMaxHeight - lakeMinSize) * (maxCount - attempts)) /
                maxCount) + lakeMinSize;
            const blob = new GWU.blob.Blob({
                rng: site.rng,
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
                x = site.rng.range(1 - bounds.x, lakeGrid.width - bounds.width - bounds.x - 2);
                y = site.rng.range(1 - bounds.y, lakeGrid.height - bounds.height - bounds.y - 2);
                if (canDisrupt || !this.isDisruptedBy(site, lakeGrid, -x, -y)) {
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
                                site.setTile(sx, sy, tile);
                                if (hasWreath) {
                                    GWU.xy.forCircle(sx, sy, wreathSize, (i, j) => {
                                        if (site.isPassable(i, j)
                                        // SITE.isFloor(map, i, j) ||
                                        // SITE.isDoor(map, i, j)
                                        ) {
                                            site.setTile(i, j, wreathTile);
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
        GWU.grid.free(lakeGrid);
        return count;
    }
    isDisruptedBy(site, lakeGrid, lakeToMapX = 0, lakeToMapY = 0) {
        const walkableGrid = GWU.grid.alloc(site.width, site.height);
        let disrupts = false;
        // Get all walkable locations after lake added
        GWU.xy.forRect(site.width, site.height, (i, j) => {
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
        GWU.grid.free(walkableGrid);
        return disrupts;
    }
}

var lake = /*#__PURE__*/Object.freeze({
    __proto__: null,
    Lakes: Lakes
});

class Bridges {
    constructor(options = {}) {
        this.options = {
            minDistance: 20,
            maxLength: 5,
        };
        Object.assign(this.options, options);
    }
    create(site) {
        let count = 0;
        let newX, newY;
        let i, j, d, x, y;
        const maxLength = this.options.maxLength;
        const minDistance = this.options.minDistance;
        const pathGrid = GWU.grid.alloc(site.width, site.height);
        const costGrid = GWU.grid.alloc(site.width, site.height);
        const dirCoords = [
            [1, 0],
            [0, 1],
        ];
        costGrid.update((_v, x, y) => site.isPassable(x, y) ? 1 : GWU.path.OBSTRUCTION);
        const seq = site.rng.sequence(site.width * site.height);
        for (i = 0; i < seq.length; i++) {
            x = Math.floor(seq[i] / site.height);
            y = seq[i] % site.height;
            if (
            // map.hasXY(x, y) &&
            // map.get(x, y) &&
            site.isPassable(x, y) &&
                !site.isAnyLiquid(x, y)) {
                for (d = 0; d <= 1; d++) {
                    // Try right, then down
                    const bridgeDir = dirCoords[d];
                    newX = x + bridgeDir[0];
                    newY = y + bridgeDir[1];
                    j = maxLength;
                    // if (!map.hasXY(newX, newY)) continue;
                    // check for line of lake tiles
                    // if (isBridgeCandidate(newX, newY, bridgeDir)) {
                    if (site.isAnyLiquid(newX, newY)) {
                        for (j = 0; j < maxLength; ++j) {
                            newX += bridgeDir[0];
                            newY += bridgeDir[1];
                            // if (!isBridgeCandidate(newX, newY, bridgeDir)) {
                            if (!site.isAnyLiquid(newX, newY)) {
                                break;
                            }
                        }
                    }
                    if (
                    // map.get(newX, newY) &&
                    site.isPassable(newX, newY) &&
                        j < maxLength) {
                        GWU.path.calculateDistances(pathGrid, newX, newY, costGrid, false);
                        // pathGrid.fill(30000);
                        // pathGrid[newX][newY] = 0;
                        // dijkstraScan(pathGrid, costGrid, false);
                        if (pathGrid[x][y] > minDistance &&
                            pathGrid[x][y] < GWU.path.NO_PATH) {
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
                                if (this.isBridgeCandidate(site, x, y, bridgeDir)) {
                                    site.setTile(x, y, BRIDGE); // map[x][y] = SITE.BRIDGE;
                                    costGrid[x][y] = 1; // (Cost map also needs updating.)
                                }
                                else {
                                    site.setTile(x, y, FLOOR); // map[x][y] = SITE.FLOOR;
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
        GWU.grid.free(pathGrid);
        GWU.grid.free(costGrid);
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

var bridge = /*#__PURE__*/Object.freeze({
    __proto__: null,
    Bridges: Bridges
});

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
        let upLoc = null;
        let downLoc = null;
        const isValidLoc = this.isStairXY.bind(this, site);
        if (this.options.start && typeof this.options.start !== 'string') {
            let start = this.options.start;
            if (start === true) {
                start = site.rng.matchingLoc(site.width, site.height, isValidLoc);
            }
            else {
                start = site.rng.matchingLocNear(GWU.xy.x(start), GWU.xy.y(start), isValidLoc);
            }
            locations.start = start;
        }
        if (Array.isArray(this.options.up) &&
            Array.isArray(this.options.down)) {
            const up = this.options.up;
            upLoc = site.rng.matchingLocNear(GWU.xy.x(up), GWU.xy.y(up), isValidLoc);
            const down = this.options.down;
            downLoc = site.rng.matchingLocNear(GWU.xy.x(down), GWU.xy.y(down), isValidLoc);
        }
        else if (Array.isArray(this.options.up) &&
            !Array.isArray(this.options.down)) {
            const up = this.options.up;
            upLoc = site.rng.matchingLocNear(GWU.xy.x(up), GWU.xy.y(up), isValidLoc);
            if (needDown) {
                downLoc = site.rng.matchingLoc(site.width, site.height, (x, y) => {
                    if (
                    // @ts-ignore
                    GWU.xy.distanceBetween(x, y, upLoc[0], upLoc[1]) <
                        minDistance)
                        return false;
                    return isValidLoc(x, y);
                });
            }
        }
        else if (Array.isArray(this.options.down) &&
            !Array.isArray(this.options.up)) {
            const down = this.options.down;
            downLoc = site.rng.matchingLocNear(GWU.xy.x(down), GWU.xy.y(down), isValidLoc);
            if (needUp) {
                upLoc = site.rng.matchingLoc(site.width, site.height, (x, y) => {
                    if (GWU.xy.distanceBetween(x, y, downLoc[0], downLoc[1]) < minDistance)
                        return false;
                    return isValidLoc(x, y);
                });
            }
        }
        else if (needUp) {
            upLoc = site.rng.matchingLoc(site.width, site.height, isValidLoc);
            if (needDown) {
                downLoc = site.rng.matchingLoc(site.width, site.height, (x, y) => {
                    if (
                    // @ts-ignore
                    GWU.xy.distanceBetween(x, y, upLoc[0], upLoc[1]) <
                        minDistance)
                        return false;
                    return isValidLoc(x, y);
                });
            }
        }
        else if (needDown) {
            downLoc = site.rng.matchingLoc(site.width, site.height, isValidLoc);
        }
        if (upLoc) {
            locations.up = upLoc.slice();
            this.setupStairs(site, upLoc[0], upLoc[1], this.options.upTile);
            if (this.options.start === 'up')
                locations.start = locations.up;
        }
        if (downLoc) {
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
            const dir = GWU.xy.DIRS[i];
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
        const indexes = site.rng.sequence(4);
        let dir = null;
        for (let i = 0; i < indexes.length; ++i) {
            dir = GWU.xy.DIRS[i];
            const x0 = x + dir[0];
            const y0 = y + dir[1];
            if (site.isFloor(x0, y0)) {
                if (site.isDiggable(x - dir[0], y - dir[1]))
                    break;
            }
            dir = null;
        }
        if (!dir)
            GWU.ERROR('No stair direction found!');
        site.setTile(x, y, tile);
        const dirIndex = GWU.xy.CLOCK_DIRS.findIndex(
        // @ts-ignore
        (d) => d[0] == dir[0] && d[1] == dir[1]);
        const wall = this.options.wall;
        for (let i = 0; i < GWU.xy.CLOCK_DIRS.length; ++i) {
            const l = i ? i - 1 : 7;
            const r = (i + 1) % 8;
            if (i == dirIndex || l == dirIndex || r == dirIndex)
                continue;
            const d = GWU.xy.CLOCK_DIRS[i];
            site.setTile(x + d[0], y + d[1], wall);
            // map.setCellFlags(x + d[0], y + d[1], Flags.Cell.IMPREGNABLE);
        }
        // dungeon.debug('setup stairs', x, y, tile);
        return true;
    }
}

var stairs = /*#__PURE__*/Object.freeze({
    __proto__: null,
    Stairs: Stairs
});

class LoopDigger {
    constructor(options = {}) {
        this.options = {
            minDistance: 100,
            maxLength: 1,
            doorChance: 50,
        };
        Object.assign(this.options, options);
    }
    create(site) {
        let startX, startY, endX, endY;
        let i, j, d, x, y;
        const minDistance = Math.min(this.options.minDistance, Math.floor(Math.max(site.width, site.height) / 2));
        const maxLength = this.options.maxLength;
        const pathGrid = GWU.grid.alloc(site.width, site.height);
        const costGrid = GWU.grid.alloc(site.width, site.height);
        const dirCoords = [
            [1, 0],
            [0, 1],
        ];
        fillCostGrid(site, costGrid);
        function isValidTunnelStart(x, y, dir) {
            if (!site.hasXY(x, y))
                return false;
            if (!site.hasXY(x + dir[1], y + dir[0]))
                return false;
            if (!site.hasXY(x - dir[1], y - dir[0]))
                return false;
            if (site.isSet(x, y))
                return false;
            if (site.isSet(x + dir[1], y + dir[0]))
                return false;
            if (site.isSet(x - dir[1], y - dir[0]))
                return false;
            return true;
        }
        function isValidTunnelEnd(x, y, dir) {
            if (!site.hasXY(x, y))
                return false;
            if (!site.hasXY(x + dir[1], y + dir[0]))
                return false;
            if (!site.hasXY(x - dir[1], y - dir[0]))
                return false;
            if (site.isSet(x, y))
                return true;
            if (site.isSet(x + dir[1], y + dir[0]))
                return true;
            if (site.isSet(x - dir[1], y - dir[0]))
                return true;
            return false;
        }
        let count = 0;
        const seq = site.rng.sequence(site.width * site.height);
        for (i = 0; i < seq.length; i++) {
            x = Math.floor(seq[i] / site.height);
            y = seq[i] % site.height;
            if (!site.isSet(x, y)) {
                for (d = 0; d <= 1; d++) {
                    // Try a horizontal door, and then a vertical door.
                    let dir = dirCoords[d];
                    if (!isValidTunnelStart(x, y, dir))
                        continue;
                    j = maxLength;
                    // check up/left
                    if (site.hasXY(x + dir[0], y + dir[1]) &&
                        site.isPassable(x + dir[0], y + dir[1])) {
                        // just can't build directly into a door
                        if (!site.hasXY(x - dir[0], y - dir[1]) ||
                            site.isDoor(x - dir[0], y - dir[1])) {
                            continue;
                        }
                    }
                    else if (site.hasXY(x - dir[0], y - dir[1]) &&
                        site.isPassable(x - dir[0], y - dir[1])) {
                        if (!site.hasXY(x + dir[0], y + dir[1]) ||
                            site.isDoor(x + dir[0], y + dir[1])) {
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
                        GWU.path.calculateDistances(pathGrid, startX, startY, costGrid, false);
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
                                if (site.isNothing(endX, endY)) {
                                    site.setTile(endX, endY, FLOOR);
                                    costGrid[endX][endY] = 1; // (Cost map also needs updating.)
                                }
                                endX += dir[0];
                                endY += dir[1];
                            }
                            // TODO - Door is optional
                            const tile = site.rng.chance(this.options.doorChance)
                                ? DOOR
                                : FLOOR;
                            site.setTile(x, y, tile); // then turn the tile into a doorway.
                            ++count;
                            break;
                        }
                    }
                }
            }
        }
        GWU.grid.free(pathGrid);
        GWU.grid.free(costGrid);
        return count;
    }
}
// Add some loops to the otherwise simply connected network of rooms.
function digLoops(site, opts = {}) {
    const digger = new LoopDigger(opts);
    return digger.create(site);
}

var loop = /*#__PURE__*/Object.freeze({
    __proto__: null,
    LoopDigger: LoopDigger,
    digLoops: digLoops
});

class NullLogger {
    onDigFirstRoom() { }
    onRoomCandidate() { }
    onRoomFailed() { }
    onRoomSuccess() { }
    onLoopsAdded() { }
    onLakesAdded() { }
    onBridgesAdded() { }
    onStairsAdded() { }
    onBuildError() { }
    onBlueprintPick() { }
    onBlueprintCandidates() { }
    onBlueprintStart() { }
    onBlueprintInterior() { }
    onBlueprintFail() { }
    onBlueprintSuccess() { }
    onStepStart() { }
    onStepCandidates() { }
    onStepInstanceSuccess() { }
    onStepInstanceFail() { }
    onStepSuccess() { }
    onStepFail() { }
}

const Fl$1 = GWU.flag.fl;
var StepFlags;
(function (StepFlags) {
    StepFlags[StepFlags["BS_OUTSOURCE_ITEM_TO_MACHINE"] = Fl$1(1)] = "BS_OUTSOURCE_ITEM_TO_MACHINE";
    StepFlags[StepFlags["BS_BUILD_VESTIBULE"] = Fl$1(2)] = "BS_BUILD_VESTIBULE";
    StepFlags[StepFlags["BS_ADOPT_ITEM"] = Fl$1(3)] = "BS_ADOPT_ITEM";
    StepFlags[StepFlags["BS_BUILD_AT_ORIGIN"] = Fl$1(4)] = "BS_BUILD_AT_ORIGIN";
    StepFlags[StepFlags["BS_PERMIT_BLOCKING"] = Fl$1(5)] = "BS_PERMIT_BLOCKING";
    StepFlags[StepFlags["BS_TREAT_AS_BLOCKING"] = Fl$1(6)] = "BS_TREAT_AS_BLOCKING";
    StepFlags[StepFlags["BS_NEAR_ORIGIN"] = Fl$1(7)] = "BS_NEAR_ORIGIN";
    StepFlags[StepFlags["BS_FAR_FROM_ORIGIN"] = Fl$1(8)] = "BS_FAR_FROM_ORIGIN";
    StepFlags[StepFlags["BS_IN_VIEW_OF_ORIGIN"] = Fl$1(9)] = "BS_IN_VIEW_OF_ORIGIN";
    StepFlags[StepFlags["BS_IN_PASSABLE_VIEW_OF_ORIGIN"] = Fl$1(10)] = "BS_IN_PASSABLE_VIEW_OF_ORIGIN";
    StepFlags[StepFlags["BS_HORDE_TAKES_ITEM"] = Fl$1(11)] = "BS_HORDE_TAKES_ITEM";
    StepFlags[StepFlags["BS_HORDE_SLEEPING"] = Fl$1(12)] = "BS_HORDE_SLEEPING";
    StepFlags[StepFlags["BS_HORDE_FLEEING"] = Fl$1(13)] = "BS_HORDE_FLEEING";
    StepFlags[StepFlags["BS_HORDES_DORMANT"] = Fl$1(14)] = "BS_HORDES_DORMANT";
    StepFlags[StepFlags["BS_ITEM_IS_KEY"] = Fl$1(15)] = "BS_ITEM_IS_KEY";
    StepFlags[StepFlags["BS_ITEM_IDENTIFIED"] = Fl$1(16)] = "BS_ITEM_IDENTIFIED";
    StepFlags[StepFlags["BS_ITEM_PLAYER_AVOIDS"] = Fl$1(17)] = "BS_ITEM_PLAYER_AVOIDS";
    StepFlags[StepFlags["BS_EVERYWHERE"] = Fl$1(18)] = "BS_EVERYWHERE";
    StepFlags[StepFlags["BS_ALTERNATIVE"] = Fl$1(19)] = "BS_ALTERNATIVE";
    StepFlags[StepFlags["BS_ALTERNATIVE_2"] = Fl$1(20)] = "BS_ALTERNATIVE_2";
    StepFlags[StepFlags["BS_BUILD_IN_WALLS"] = Fl$1(21)] = "BS_BUILD_IN_WALLS";
    StepFlags[StepFlags["BS_BUILD_ANYWHERE_ON_LEVEL"] = Fl$1(22)] = "BS_BUILD_ANYWHERE_ON_LEVEL";
    StepFlags[StepFlags["BS_REPEAT_UNTIL_NO_PROGRESS"] = Fl$1(23)] = "BS_REPEAT_UNTIL_NO_PROGRESS";
    StepFlags[StepFlags["BS_IMPREGNABLE"] = Fl$1(24)] = "BS_IMPREGNABLE";
    StepFlags[StepFlags["BS_NO_BLOCK_ORIGIN"] = Fl$1(25)] = "BS_NO_BLOCK_ORIGIN";
    // TODO - BS_ALLOW_IN_HALLWAY instead?
    StepFlags[StepFlags["BS_NOT_IN_HALLWAY"] = Fl$1(27)] = "BS_NOT_IN_HALLWAY";
    StepFlags[StepFlags["BS_ALLOW_BOUNDARY"] = Fl$1(28)] = "BS_ALLOW_BOUNDARY";
    StepFlags[StepFlags["BS_SKELETON_KEY"] = Fl$1(29)] = "BS_SKELETON_KEY";
    StepFlags[StepFlags["BS_KEY_DISPOSABLE"] = Fl$1(30)] = "BS_KEY_DISPOSABLE";
})(StepFlags || (StepFlags = {}));
class BuildStep {
    // public next: null = null;
    // public id = 'n/a';
    constructor(cfg = {}) {
        var _a;
        this.tile = -1;
        this.flags = 0;
        this.pad = 0;
        this.item = null;
        this.horde = null;
        this.effect = null;
        this.chance = 0;
        this.tile = (_a = cfg.tile) !== null && _a !== void 0 ? _a : -1;
        if (cfg.flags) {
            this.flags = GWU.flag.from(StepFlags, cfg.flags);
        }
        if (cfg.pad) {
            this.pad = cfg.pad;
        }
        this.count = GWU.range.make(cfg.count || 1);
        if (typeof cfg.item === 'string') {
            this.item = { tags: cfg.item };
        }
        else {
            this.item = cfg.item || null;
        }
        if (cfg.horde) {
            if (typeof cfg.horde === 'string') {
                this.horde = { tags: cfg.horde };
            }
            else if (cfg.horde === true) {
                this.horde = { random: true };
            }
            else {
                this.horde = cfg.horde;
            }
        }
        if (cfg.effect) {
            this.effect = GWM.effect.from(cfg.effect);
        }
        if (this.item && this.flags & StepFlags.BS_ADOPT_ITEM) {
            throw new Error('Cannot have blueprint step with item and BS_ADOPT_ITEM.');
        }
        if (this.buildAtOrigin && this.count.hi > 1) {
            throw new Error('Cannot have count > 1 for step with BS_BUILD_AT_ORIGIN.');
        }
        if (this.buildAtOrigin && this.repeatUntilNoProgress) {
            throw new Error('Cannot have BS_BUILD_AT_ORIGIN and BS_REPEAT_UNTIL_NO_PROGRESS together in a build step.');
        }
        if (this.hordeTakesItem && !this.horde) {
            throw new Error('Cannot have BS_HORDE_TAKES_ITEM without a horde configured.');
        }
    }
    get allowBoundary() {
        return !!(this.flags & StepFlags.BS_ALLOW_BOUNDARY);
    }
    get notInHallway() {
        return !!(this.flags & StepFlags.BS_NOT_IN_HALLWAY);
    }
    get buildInWalls() {
        return !!(this.flags & StepFlags.BS_BUILD_IN_WALLS);
    }
    get buildAnywhere() {
        return !!(this.flags & StepFlags.BS_BUILD_ANYWHERE_ON_LEVEL);
    }
    get repeatUntilNoProgress() {
        return !!(this.flags & StepFlags.BS_REPEAT_UNTIL_NO_PROGRESS);
    }
    get permitBlocking() {
        return !!(this.flags & StepFlags.BS_PERMIT_BLOCKING);
    }
    get treatAsBlocking() {
        return !!(this.flags &
            (StepFlags.BS_TREAT_AS_BLOCKING | StepFlags.BS_NO_BLOCK_ORIGIN));
    }
    get noBlockOrigin() {
        return !!(this.flags & StepFlags.BS_NO_BLOCK_ORIGIN);
    }
    get adoptItem() {
        return !!(this.flags & StepFlags.BS_ADOPT_ITEM);
    }
    get itemIsKey() {
        return !!(this.flags & StepFlags.BS_ITEM_IS_KEY);
    }
    get keyIsDisposable() {
        return !!(this.flags & StepFlags.BS_KEY_DISPOSABLE);
    }
    get outsourceItem() {
        return !!(this.flags & StepFlags.BS_OUTSOURCE_ITEM_TO_MACHINE);
    }
    get impregnable() {
        return !!(this.flags & StepFlags.BS_IMPREGNABLE);
    }
    get buildVestibule() {
        return !!(this.flags & StepFlags.BS_BUILD_VESTIBULE);
    }
    get hordeTakesItem() {
        return !!(this.flags & StepFlags.BS_HORDE_TAKES_ITEM);
    }
    get generateEverywhere() {
        return !!(this.flags &
            StepFlags.BS_EVERYWHERE &
            ~StepFlags.BS_BUILD_AT_ORIGIN);
    }
    get buildAtOrigin() {
        return !!(this.flags & StepFlags.BS_BUILD_AT_ORIGIN);
    }
    get buildsInstances() {
        return !!(this.effect ||
            this.tile != -1 ||
            this.item ||
            this.horde ||
            this.adoptItem);
    }
    makeItem(data) {
        if (!this.item)
            return null;
        if (this.item.id) {
            return data.site.makeItem(this.item.id, this.item.make);
        }
        return data.site.makeRandomItem(this.item, this.item.make);
    }
    // cellIsCandidate(
    //     builder: BuildData,
    //     blueprint: Blueprint,
    //     x: number,
    //     y: number,
    //     distanceBound: [number, number]
    // ) {
    //     return cellIsCandidate(builder, blueprint, this, x, y, distanceBound);
    // }
    // distanceBound(builder: BuildData): [number, number] {
    //     return calcDistanceBound(builder, this);
    // }
    // updateViewMap(builder: BuildData): void {
    //     updateViewMap(builder, this);
    // }
    // build(
    //     builder: BuildData,
    //     blueprint: Blueprint,
    //     adoptedItem: GWM.item.Item | null
    // ): boolean {
    //     return buildStep(builder, blueprint, this, adoptedItem);
    // }
    markCandidates(data, candidates, distanceBound = [0, 10000]) {
        updateViewMap(data, this);
        const blueprint = data.blueprint;
        let count = 0;
        candidates.update((_v, i, j) => {
            const candidateType = cellIsCandidate(data, blueprint, this, i, j, distanceBound);
            if (candidateType === CandidateType.OK) {
                count++;
            }
            return candidateType;
        });
        return count;
    }
    makePersonalSpace(_data, x, y, candidates) {
        let count = 0;
        if (this.pad < 1)
            return 0; // do not mark occupied
        // or...
        // if (this.buildEverywhere) return 0;  // do not mark occupied
        for (let i = x - this.pad; i <= x + this.pad; i++) {
            for (let j = y - this.pad; j <= y + this.pad; j++) {
                if (candidates.hasXY(i, j)) {
                    if (candidates[i][j] == 1) {
                        candidates[i][j] = 0;
                        ++count;
                    }
                    // builder.occupied[i][j] = 1;
                }
            }
        }
        return count;
    }
    toString() {
        let parts = [];
        if (this.tile) {
            parts.push('tile: ' + this.tile);
        }
        if (this.effect) {
            parts.push('effect: ' + JSON.stringify(this.effect));
        }
        if (this.item) {
            parts.push('item: ' + JSON.stringify(this.item));
        }
        if (this.horde) {
            parts.push('horde: ' + JSON.stringify(this.horde));
        }
        if (this.pad > 1) {
            parts.push('pad: ' + this.pad);
        }
        if (this.count.lo > 1 || this.count.hi > 1) {
            parts.push('count: ' + this.count.toString());
        }
        if (this.chance) {
            parts.push('chance: ' + this.chance);
        }
        if (this.flags) {
            parts.push('flags: ' + GWU.flag.toString(StepFlags, this.flags));
        }
        return '{ ' + parts.join(', ') + ' }';
    }
}
function updateViewMap(builder, buildStep) {
    if (buildStep.flags &
        (StepFlags.BS_IN_VIEW_OF_ORIGIN |
            StepFlags.BS_IN_PASSABLE_VIEW_OF_ORIGIN)) {
        const site = builder.site;
        if (buildStep.flags & StepFlags.BS_IN_PASSABLE_VIEW_OF_ORIGIN) {
            const fov = new GWU.fov.FOV({
                isBlocked: (x, y) => {
                    return site.blocksPathing(x, y) || site.blocksVision(x, y);
                },
                hasXY: (x, y) => {
                    return site.hasXY(x, y);
                },
            });
            fov.calculate(builder.originX, builder.originY, 50, (x, y) => {
                builder.viewMap[x][y] = 1;
            });
        }
        else {
            const fov = new GWU.fov.FOV({
                isBlocked: (x, y) => {
                    return site.blocksVision(x, y);
                },
                hasXY: (x, y) => {
                    return site.hasXY(x, y);
                },
            });
            fov.calculate(builder.originX, builder.originY, 50, (x, y) => {
                builder.viewMap[x][y] = 1;
            });
        }
        builder.viewMap[builder.originX][builder.originY] = 1;
    }
}
function calcDistanceBound(builder, buildStep) {
    const distanceBound = [0, 10000];
    if (buildStep.flags & StepFlags.BS_NEAR_ORIGIN) {
        distanceBound[1] = builder.distance25;
    }
    if (buildStep.flags & StepFlags.BS_FAR_FROM_ORIGIN) {
        distanceBound[0] = builder.distance75;
    }
    return distanceBound;
}
var CandidateType;
(function (CandidateType) {
    CandidateType[CandidateType["NOT_CANDIDATE"] = 0] = "NOT_CANDIDATE";
    CandidateType[CandidateType["OK"] = 1] = "OK";
    CandidateType[CandidateType["IN_HALLWAY"] = 2] = "IN_HALLWAY";
    CandidateType[CandidateType["ON_BOUNDARY"] = 3] = "ON_BOUNDARY";
    CandidateType[CandidateType["MUST_BE_ORIGIN"] = 4] = "MUST_BE_ORIGIN";
    CandidateType[CandidateType["NOT_ORIGIN"] = 5] = "NOT_ORIGIN";
    CandidateType[CandidateType["OCCUPIED"] = 6] = "OCCUPIED";
    CandidateType[CandidateType["NOT_IN_VIEW"] = 7] = "NOT_IN_VIEW";
    CandidateType[CandidateType["TOO_FAR"] = 8] = "TOO_FAR";
    CandidateType[CandidateType["TOO_CLOSE"] = 9] = "TOO_CLOSE";
    CandidateType[CandidateType["INVALID_WALL"] = 10] = "INVALID_WALL";
    CandidateType[CandidateType["BLOCKED"] = 11] = "BLOCKED";
    CandidateType[CandidateType["FAILED"] = 12] = "FAILED";
})(CandidateType || (CandidateType = {}));
function cellIsCandidate(builder, blueprint, buildStep, x, y, distanceBound) {
    const site = builder.site;
    // No building in the hallway if it's prohibited.
    // This check comes before the origin check, so an area machine will fail altogether
    // if its origin is in a hallway and the feature that must be built there does not permit as much.
    if (buildStep.notInHallway &&
        GWU.xy.arcCount(x, y, (i, j) => site.hasXY(i, j) && site.isPassable(i, j)) > 1) {
        return CandidateType.IN_HALLWAY;
    }
    // if (buildStep.noBlockOrigin) {
    //     let ok = true;
    //     GWU.xy.eachNeighbor(
    //         x,
    //         y,
    //         (nx, ny) => {
    //             if (nx === builder.originX && ny === builder.originY) {
    //                 ok = false;
    //             }
    //         },
    //         true
    //     );
    //     if (!ok) return false;
    // }
    // No building along the perimeter of the level if it's prohibited.
    if ((x == 0 || x == site.width - 1 || y == 0 || y == site.height - 1) &&
        !buildStep.allowBoundary) {
        return CandidateType.ON_BOUNDARY;
    }
    // The origin is a candidate if the feature is flagged to be built at the origin.
    // If it's a room, the origin (i.e. doorway) is otherwise NOT a candidate.
    if (buildStep.buildAtOrigin) {
        if (x == builder.originX && y == builder.originY)
            return CandidateType.OK;
        return CandidateType.MUST_BE_ORIGIN;
    }
    else if (blueprint.isRoom &&
        x == builder.originX &&
        y == builder.originY) {
        return CandidateType.NOT_ORIGIN;
    }
    // No building in another feature's personal space!
    if (builder.occupied[x][y]) {
        return CandidateType.OCCUPIED;
    }
    // Must be in the viewmap if the appropriate flag is set.
    if (buildStep.flags &
        (StepFlags.BS_IN_VIEW_OF_ORIGIN |
            StepFlags.BS_IN_PASSABLE_VIEW_OF_ORIGIN) &&
        !builder.viewMap[x][y]) {
        return CandidateType.NOT_IN_VIEW;
    }
    // Do a distance check if the feature requests it.
    let distance = 10000;
    if (site.isWall(x, y)) {
        // Distance is calculated for walls too.
        GWU.xy.eachNeighbor(x, y, (i, j) => {
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
    if (distance > distanceBound[1])
        return CandidateType.TOO_FAR; // distance exceeds max
    if (distance < distanceBound[0])
        return CandidateType.TOO_CLOSE;
    if (buildStep.buildInWalls) {
        // If we're supposed to build in a wall...
        const cellMachine = site.getMachine(x, y);
        if (!builder.interior[x][y] &&
            (!cellMachine || cellMachine == builder.machineNumber) &&
            site.isWall(x, y)) {
            let ok = false;
            // ...and this location is a wall that's not already machined...
            GWU.xy.eachNeighbor(x, y, (newX, newY) => {
                if (!site.hasXY(newX, newY))
                    return;
                if (!builder.interior[newX][newY] &&
                    !buildStep.buildAnywhere) {
                    return;
                }
                // ...and it's next to an interior spot or permitted elsewhere and next to passable spot...
                const neighborMachine = site.getMachine(newX, newY);
                if (!site.blocksPathing(newX, newY) &&
                    (!neighborMachine ||
                        neighborMachine == builder.machineNumber) &&
                    !(newX == builder.originX && newY == builder.originY)) {
                    ok = true;
                }
            }, true);
            return ok ? CandidateType.OK : CandidateType.INVALID_WALL;
        }
        return CandidateType.NOT_CANDIDATE;
    }
    else if (site.isWall(x, y)) {
        // Can't build in a wall unless instructed to do so.
        return CandidateType.INVALID_WALL;
    }
    else if (buildStep.buildAnywhere) {
        if ((buildStep.item && site.blocksItems(x, y)) ||
            site.hasCellFlag(x, y, GWM.flags.Cell.IS_CHOKEPOINT |
                GWM.flags.Cell.IS_IN_LOOP |
                GWM.flags.Cell.IS_IN_MACHINE)) {
            return CandidateType.BLOCKED;
        }
        else {
            return CandidateType.OK;
        }
    }
    else if (builder.interior[x][y]) {
        return CandidateType.OK;
    }
    return CandidateType.FAILED;
}
// export function buildStep(
//     builder: BuildData,
//     blueprint: Blueprint,
//     buildStep: BuildStep,
//     adoptedItem: GWM.item.Item | null
// ): boolean {
//     let wantCount = 0;
//     let builtCount = 0;
//     const site = builder.site;
//     const candidates = GWU.grid.alloc(site.width, site.height);
//     // Figure out the distance bounds.
//     const distanceBound = calcDistanceBound(builder, buildStep);
//     buildStep.updateViewMap(builder);
//     // If the StepFlags.BS_REPEAT_UNTIL_NO_PROGRESS flag is set, repeat until we fail to build the required number of instances.
//     // Make a master map of candidate locations for this feature.
//     let qualifyingTileCount = markCandidates(
//         candidates,
//         builder,
//         blueprint,
//         buildStep,
//         distanceBound
//     );
//     if (!buildStep.generateEverywhere) {
//         wantCount = buildStep.count.value();
//     }
//     if (!qualifyingTileCount || qualifyingTileCount < buildStep.count.lo) {
//         console.log(
//             ' - Only %s qualifying tiles - want at least %s.',
//             qualifyingTileCount,
//             buildStep.count.lo
//         );
//         GWU.grid.free(candidates);
//         return false;
//     }
//     let x = 0,
//         y = 0;
//     let success = true;
//     let didSomething = false;
//     do {
//         success = true;
//         // Find a location for the feature.
//         if (buildStep.buildAtOrigin) {
//             // Does the feature want to be at the origin? If so, put it there. (Just an optimization.)
//             x = builder.originX;
//             y = builder.originY;
//         } else {
//             // Pick our candidate location randomly, and also strike it from
//             // the candidates map so that subsequent instances of this same feature can't choose it.
//             [x, y] = site.rng.matchingLoc(
//                 candidates.width,
//                 candidates.height,
//                 (x, y) => candidates[x][y] > 0
//             );
//         }
//         // Don't waste time trying the same place again whether or not this attempt succeeds.
//         candidates[x][y] = 0;
//         qualifyingTileCount--;
//         // Try to build the DF first, if any, since we don't want it to be disrupted by subsequently placed terrain.
//         if (buildStep.effect) {
//             success = site.fireEffect(buildStep.effect, x, y);
//             didSomething = success;
//         }
//         // Now try to place the terrain tile, if any.
//         if (success && buildStep.tile !== -1) {
//             const tile = GWM.tile.get(buildStep.tile);
//             if (
//                 !(buildStep.flags & StepFlags.BS_PERMIT_BLOCKING) &&
//                 (tile.blocksMove() ||
//                     buildStep.flags & StepFlags.BS_TREAT_AS_BLOCKING)
//             ) {
//                 // Yes, check for blocking.
//                 success = !SITE.siteDisruptedByXY(site, x, y, {
//                     machine: site.machineCount,
//                 });
//             }
//             if (success) {
//                 success = site.setTile(x, y, tile);
//                 didSomething = didSomething || success;
//             }
//         }
//         // Generate an actor, if necessary
//         // Generate an item, if necessary
//         if (success && buildStep.item) {
//             const item = site.makeRandomItem(buildStep.item);
//             if (!item) {
//                 success = false;
//             }
//             if (buildStep.flags & StepFlags.BS_ITEM_IS_KEY) {
//                 item.key = GWM.entity.makeKeyInfo(
//                     x,
//                     y,
//                     !!(buildStep.flags & StepFlags.BS_KEY_DISPOSABLE)
//                 );
//             }
//             if (buildStep.flags & StepFlags.BS_OUTSOURCE_ITEM_TO_MACHINE) {
//                 success = builder.buildRandom(
//                     Flags.BP_ADOPT_ITEM,
//                     -1,
//                     -1,
//                     item
//                 );
//                 if (success) {
//                     didSomething = true;
//                 }
//             } else {
//                 success = site.addItem(x, y, item);
//                 didSomething = didSomething || success;
//             }
//         } else if (success && buildStep.flags & StepFlags.BS_ADOPT_ITEM) {
//             // adopt item if necessary
//             if (!adoptedItem) {
//                 GWU.grid.free(candidates);
//                 throw new Error(
//                     'Failed to build blueprint because there is no adopted item.'
//                 );
//             }
//             if (buildStep.flags & StepFlags.BS_TREAT_AS_BLOCKING) {
//                 // Yes, check for blocking.
//                 success = !SITE.siteDisruptedByXY(site, x, y);
//             }
//             if (success) {
//                 success = site.addItem(x, y, adoptedItem);
//                 if (success) {
//                     didSomething = true;
//                 } else {
//                     console.log('- failed to add item', x, y);
//                 }
//             } else {
//                 // console.log('- blocks map', x, y);
//             }
//         }
//         if (success && didSomething) {
//             // OK, if placement was successful, clear some personal space around the feature so subsequent features can't be generated too close.
//             qualifyingTileCount -= makePersonalSpace(
//                 builder,
//                 x,
//                 y,
//                 candidates,
//                 buildStep.pad
//             );
//             builtCount++; // we've placed an instance
//             // Mark the feature location as part of the machine, in case it is not already inside of it.
//             if (!(blueprint.flags & Flags.BP_NO_INTERIOR_FLAG)) {
//                 site.setMachine(x, y, builder.machineNumber, blueprint.isRoom);
//             }
//             // Mark the feature location as impregnable if requested.
//             if (buildStep.flags & StepFlags.BS_IMPREGNABLE) {
//                 site.setCellFlag(x, y, GWM.flags.Cell.IMPREGNABLE);
//             }
//         }
//         // Finished with this instance!
//     } while (
//         qualifyingTileCount > 0 &&
//         (buildStep.generateEverywhere ||
//             builtCount < wantCount ||
//             buildStep.flags & StepFlags.BS_REPEAT_UNTIL_NO_PROGRESS)
//     );
//     if (success && buildStep.flags & StepFlags.BS_BUILD_VESTIBULE) {
//         // Generate a door guard machine.
//         // Try to create a sub-machine that qualifies.
//         success = builder.buildRandom(
//             Flags.BP_VESTIBULE,
//             builder.originX,
//             builder.originY
//         );
//         if (!success) {
//             // console.log(
//             //     `Depth ${builder.depth}: Failed to place blueprint ${blueprint.id} because it requires a vestibule and we couldn't place one.`
//             // );
//             // failure! abort!
//             GWU.grid.free(candidates);
//             return false;
//         }
//         ++builtCount;
//     }
//     //DEBUG printf("\nFinished feature %i. Here's the candidates map:", feat);
//     //DEBUG logBuffer(candidates);
//     success = builtCount > 0;
//     GWU.grid.free(candidates);
//     return success;
// }

const Fl = GWU.flag.fl;
var Flags;
(function (Flags) {
    Flags[Flags["BP_ROOM"] = Fl(0)] = "BP_ROOM";
    Flags[Flags["BP_VESTIBULE"] = Fl(1)] = "BP_VESTIBULE";
    Flags[Flags["BP_REWARD"] = Fl(2)] = "BP_REWARD";
    Flags[Flags["BP_ADOPT_ITEM"] = Fl(3)] = "BP_ADOPT_ITEM";
    Flags[Flags["BP_PURGE_PATHING_BLOCKERS"] = Fl(4)] = "BP_PURGE_PATHING_BLOCKERS";
    Flags[Flags["BP_PURGE_INTERIOR"] = Fl(5)] = "BP_PURGE_INTERIOR";
    Flags[Flags["BP_PURGE_LIQUIDS"] = Fl(6)] = "BP_PURGE_LIQUIDS";
    Flags[Flags["BP_SURROUND_WITH_WALLS"] = Fl(7)] = "BP_SURROUND_WITH_WALLS";
    Flags[Flags["BP_IMPREGNABLE"] = Fl(8)] = "BP_IMPREGNABLE";
    Flags[Flags["BP_OPEN_INTERIOR"] = Fl(9)] = "BP_OPEN_INTERIOR";
    Flags[Flags["BP_MAXIMIZE_INTERIOR"] = Fl(10)] = "BP_MAXIMIZE_INTERIOR";
    Flags[Flags["BP_REDESIGN_INTERIOR"] = Fl(11)] = "BP_REDESIGN_INTERIOR";
    Flags[Flags["BP_TREAT_AS_BLOCKING"] = Fl(12)] = "BP_TREAT_AS_BLOCKING";
    Flags[Flags["BP_REQUIRE_BLOCKING"] = Fl(13)] = "BP_REQUIRE_BLOCKING";
    Flags[Flags["BP_NO_INTERIOR_FLAG"] = Fl(14)] = "BP_NO_INTERIOR_FLAG";
    Flags[Flags["BP_NOT_IN_HALLWAY"] = Fl(15)] = "BP_NOT_IN_HALLWAY";
})(Flags || (Flags = {}));
class Blueprint {
    constructor(opts = {}) {
        this.tags = [];
        this.flags = 0;
        this.steps = [];
        this.id = 'n/a';
        if (opts.tags) {
            if (typeof opts.tags === 'string') {
                opts.tags = opts.tags.split(/[,|]/).map((v) => v.trim());
            }
            this.tags = opts.tags;
        }
        this.frequency = GWU.frequency.make(opts.frequency || 100);
        if (opts.size) {
            this.size = GWU.range.make(opts.size);
            if (this.size.lo <= 0)
                this.size.lo = 1;
            if (this.size.hi < this.size.lo)
                this.size.hi = this.size.lo;
        }
        else {
            this.size = GWU.range.make([1, 1]); // Anything bigger makes weird things happen
        }
        if (opts.flags) {
            this.flags = GWU.flag.from(Flags, opts.flags);
        }
        if (opts.steps) {
            this.steps = opts.steps.map((cfg) => new BuildStep(cfg));
        }
        if (opts.id) {
            this.id = opts.id;
        }
        if (this.flags & Flags.BP_ADOPT_ITEM) {
            if (!this.steps.some((step) => {
                if (step.adoptItem)
                    return true;
                if (step.hordeTakesItem && !step.item)
                    return true;
                return false;
            })) {
                throw new Error('Blueprint calls for BP_ADOPT_ITEM, but has no adoptive step.');
            }
        }
    }
    get isRoom() {
        return !!(this.flags & Flags.BP_ROOM);
    }
    get isReward() {
        return !!(this.flags & Flags.BP_REWARD);
    }
    get isVestiblue() {
        return !!(this.flags & Flags.BP_VESTIBULE);
    }
    get adoptsItem() {
        return !!(this.flags & Flags.BP_ADOPT_ITEM);
    }
    get treatAsBlocking() {
        return !!(this.flags & Flags.BP_TREAT_AS_BLOCKING);
    }
    get requireBlocking() {
        return !!(this.flags & Flags.BP_REQUIRE_BLOCKING);
    }
    get purgeInterior() {
        return !!(this.flags & Flags.BP_PURGE_INTERIOR);
    }
    get purgeBlockers() {
        return !!(this.flags & Flags.BP_PURGE_PATHING_BLOCKERS);
    }
    get purgeLiquids() {
        return !!(this.flags & Flags.BP_PURGE_LIQUIDS);
    }
    get surroundWithWalls() {
        return !!(this.flags & Flags.BP_SURROUND_WITH_WALLS);
    }
    get makeImpregnable() {
        return !!(this.flags & Flags.BP_IMPREGNABLE);
    }
    get maximizeInterior() {
        return !!(this.flags & Flags.BP_MAXIMIZE_INTERIOR);
    }
    get openInterior() {
        return !!(this.flags & Flags.BP_OPEN_INTERIOR);
    }
    get noInteriorFlag() {
        return !!(this.flags & Flags.BP_NO_INTERIOR_FLAG);
    }
    get notInHallway() {
        return !!(this.flags & Flags.BP_NOT_IN_HALLWAY);
    }
    qualifies(requiredFlags, tags) {
        if (tags && tags.length) {
            if (typeof tags === 'string') {
                tags = tags.split(/[,|]/).map((v) => v.trim());
            }
            // Must match all tags!
            if (!tags.every((want) => this.tags.includes(want)))
                return false;
        }
        if (
        // Must have the required flags:
        ~this.flags & requiredFlags ||
            // May NOT have BP_ADOPT_ITEM unless that flag is required:
            this.flags & Flags.BP_ADOPT_ITEM & ~requiredFlags ||
            // May NOT have BP_VESTIBULE unless that flag is required:
            this.flags & Flags.BP_VESTIBULE & ~requiredFlags) {
            return false;
        }
        return true;
    }
    pickComponents(rng) {
        const alternativeFlags = [
            StepFlags.BS_ALTERNATIVE,
            StepFlags.BS_ALTERNATIVE_2,
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
                let randIndex = rng.range(1, totalFreq);
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
    fillInterior(builder) {
        const interior = builder.interior;
        const site = builder.site;
        interior.fill(0);
        // Find a location and map out the machine interior.
        if (this.isRoom) {
            // If it's a room machine, count up the gates of appropriate
            // choke size and remember where they are. The origin of the room will be the gate location.
            // Now map out the interior into interior[][].
            // Start at the gate location and do a depth-first floodfill to grab all adjoining tiles with the
            // same or lower choke value, ignoring any tiles that are already part of a machine.
            // If we get false from this, try again. If we've tried too many times already, abort.
            return addTileToInteriorAndIterate(builder, builder.originX, builder.originY);
        }
        else if (this.isVestiblue) {
            return computeVestibuleInterior(builder, this);
            // success
        }
        else {
            // Find a location and map out the interior for a non-room machine.
            // The strategy here is simply to pick a random location on the map,
            // expand it along a pathing map by one space in all directions until the size reaches
            // the chosen size, and then make sure the resulting space qualifies.
            // If not, try again. If we've tried too many times already, abort.
            let distanceMap = builder.distanceMap;
            computeDistanceMap(site, distanceMap, builder.originX, builder.originY, this.size.hi);
            const seq = site.rng.sequence(site.width * site.height);
            let qualifyingTileCount = 0; // Keeps track of how many interior cells we've added.
            let goalSize = this.size.value(); // Keeps track of the goal size.
            for (let k = 0; k < 1000 && qualifyingTileCount < goalSize; k++) {
                for (let n = 0; n < seq.length && qualifyingTileCount < goalSize; n++) {
                    const i = Math.floor(seq[n] / site.height);
                    const j = seq[n] % site.height;
                    if (distanceMap[i][j] == k) {
                        interior[i][j] = 1;
                        qualifyingTileCount++;
                        if (site.isOccupied(i, j) ||
                            site.hasCellFlag(i, j, GWM.flags.Cell.IS_IN_MACHINE)) {
                            // Abort if we've entered another machine or engulfed another machine's item or monster.
                            return 0;
                        }
                    }
                }
            }
            // If locationFailsafe runs out, tryAgain will still be true, and we'll try a different machine.
            // If we're not choosing the blueprint, then don't bother with the locationFailsafe; just use the higher-level failsafe.
            return qualifyingTileCount;
        }
    }
}
function markCandidates(buildData) {
    const site = buildData.site;
    const candidates = buildData.candidates;
    const blueprint = buildData.blueprint;
    candidates.fill(0);
    // Find a location and map out the machine interior.
    if (blueprint.isRoom) {
        // If it's a room machine, count up the gates of appropriate
        // choke size and remember where they are. The origin of the room will be the gate location.
        candidates.update((_v, x, y) => {
            return site.hasCellFlag(x, y, GWM.flags.Cell.IS_GATE_SITE) &&
                blueprint.size.contains(site.getChokeCount(x, y))
                ? 1
                : 0;
        });
    }
    else if (blueprint.isVestiblue) {
        //  Door machines must have locations passed in. We can't pick one ourselves.
        throw new Error('ERROR: Attempted to build a vestiblue without a location being provided.');
    }
    else {
        candidates.update((_v, x, y) => {
            if (!site.isPassable(x, y))
                return 0;
            if (blueprint.notInHallway) {
                const count = GWU.xy.arcCount(x, y, (i, j) => site.isPassable(i, j));
                return count <= 1 ? 1 : 0;
            }
            return 1;
        });
    }
    return candidates.count((v) => v == 1);
}
function pickCandidateLoc(buildData) {
    const site = buildData.site;
    const candidates = buildData.candidates;
    const randSite = site.rng.matchingLoc(site.width, site.height, (x, y) => candidates[x][y] == 1);
    if (!randSite || randSite[0] < 0 || randSite[1] < 0) {
        // If no suitable sites, abort.
        return null;
    }
    return randSite;
}
// // Assume site has been analyzed (aka GateSites and ChokeCounts set)
// export function computeInterior(
//     builder: BuildData,
//     blueprint: Blueprint
// ): boolean {
//     let failsafe = blueprint.isRoom ? 10 : 20;
//     let tryAgain;
//     const interior = builder.interior;
//     const site = builder.site;
//     do {
//         tryAgain = false;
//         if (--failsafe <= 0) {
//             // console.log(
//             //     `Failed to build blueprint ${blueprint.id}; failed repeatedly to find a suitable blueprint location.`
//             // );
//             return false;
//         }
//         let count = fillInterior(builder, blueprint);
//         // Now make sure the interior map satisfies the machine's qualifications.
//         if (!count) {
//             console.debug('- no interior');
//             tryAgain = true;
//         } else if (!blueprint.size.contains(count)) {
//             console.debug('- too small');
//             tryAgain = true;
//         } else if (
//             blueprint.treatAsBlocking &&
//             SITE.siteDisruptedBy(site, interior, { machine: site.machineCount })
//         ) {
//             console.debug('- blocks');
//             tryAgain = true;
//         } else if (
//             blueprint.requireBlocking &&
//             SITE.siteDisruptedSize(site, interior) < 100
//         ) {
//             console.debug('- does not block');
//             tryAgain = true;
//         }
//         // Now loop if necessary.
//     } while (tryAgain);
//     // console.log(tryAgain, failsafe);
//     return true;
// }
function computeVestibuleInterior(builder, blueprint) {
    let success = true;
    const site = builder.site;
    const interior = builder.interior;
    interior.fill(0);
    if (blueprint.size.hi == 1) {
        interior[builder.originX][builder.originY] = 1;
        return 1;
    }
    // If this is a wall - it is really an error (maybe manually trying a build location?)
    const doorChokeCount = site.getChokeCount(builder.originX, builder.originY);
    if (doorChokeCount > 10000) {
        return 0;
    }
    const vestibuleLoc = [-1, -1];
    let vestibuleChokeCount = doorChokeCount;
    GWU.xy.eachNeighbor(builder.originX, builder.originY, (x, y) => {
        const count = site.getChokeCount(x, y);
        if (count == doorChokeCount)
            return;
        if (count > 10000)
            return;
        if (count < 0)
            return;
        vestibuleLoc[0] = x;
        vestibuleLoc[1] = y;
        vestibuleChokeCount = count;
    }, true);
    const roomSize = vestibuleChokeCount - doorChokeCount;
    if (blueprint.size.contains(roomSize)) {
        // The room entirely fits within the vestibule desired size
        const count = interior.floodFill(vestibuleLoc[0], vestibuleLoc[1], (_v, i, j) => {
            if (site.isOccupied(i, j)) {
                success = false;
            }
            return site.getChokeCount(i, j) === vestibuleChokeCount;
        }, 1);
        if (success && blueprint.size.contains(count))
            return roomSize;
    }
    let qualifyingTileCount = 0; // Keeps track of how many interior cells we've added.
    const wantSize = blueprint.size.value(site.rng); // Keeps track of the goal size.
    const distMap = builder.distanceMap;
    computeDistanceMap(site, distMap, builder.originX, builder.originY, blueprint.size.hi);
    const cells = site.rng.sequence(site.width * site.height);
    success = true;
    for (let k = 0; k < 1000 && qualifyingTileCount < wantSize; k++) {
        for (let i = 0; i < cells.length && qualifyingTileCount < wantSize; ++i) {
            const x = Math.floor(cells[i] / site.height);
            const y = cells[i] % site.height;
            const dist = distMap[x][y];
            if (dist != k)
                continue;
            if (site.isOccupied(x, y)) {
                success = false;
                qualifyingTileCount = wantSize;
            }
            if (site.getChokeCount(x, y) <= doorChokeCount)
                continue;
            interior[x][y] = 1;
            qualifyingTileCount += 1;
        }
    }
    return qualifyingTileCount;
}
// Assumes (startX, startY) is in the machine.
// Returns true if everything went well, and false if we ran into a machine component
// that was already there, as we don't want to build a machine around it.
function addTileToInteriorAndIterate(builder, startX, startY) {
    let goodSoFar = true;
    const interior = builder.interior;
    const site = builder.site;
    let count = 1;
    interior[startX][startY] = 1;
    const startChokeCount = site.getChokeCount(startX, startY);
    for (let dir = 0; dir < 4 && goodSoFar; dir++) {
        const newX = startX + GWU.xy.DIRS[dir][0];
        const newY = startY + GWU.xy.DIRS[dir][1];
        if (!site.hasXY(newX, newY))
            continue;
        if (interior[newX][newY])
            continue; // already done
        if (site.isOccupied(newX, newY) ||
            (site.hasCellFlag(newX, newY, GWM.flags.Cell.IS_IN_MACHINE) &&
                !site.hasCellFlag(newX, newY, GWM.flags.Cell.IS_GATE_SITE))) {
            // Abort if there's an item in the room.
            // Items haven't been populated yet, so the only way this could happen is if another machine
            // previously placed an item here.
            // Also abort if we're touching another machine at any point other than a gate tile.
            return 0;
        }
        if (site.getChokeCount(newX, newY) <= startChokeCount && // don't have to worry about walls since they're all 30000
            !site.hasCellFlag(newX, newY, GWM.flags.Cell.IS_IN_MACHINE)) {
            let additional = addTileToInteriorAndIterate(builder, newX, newY);
            if (additional <= 0)
                return 0;
            count += additional;
        }
    }
    return count;
}
function maximizeInterior(data, minimumInteriorNeighbors = 1) {
    const interior = data.interior;
    const site = data.site;
    let interiorNeighborCount = 0;
    // let openNeighborCount = 0;
    let madeChange = true;
    let interiorCount = 0;
    let maxInteriorCount = data.blueprint.size.hi;
    let gen = 0;
    while (madeChange && interiorCount < maxInteriorCount) {
        madeChange = false;
        interiorCount = 0;
        ++gen;
        interior.forEach((i, x, y) => {
            if (!i)
                return;
            ++interiorCount;
            if (i != gen)
                return;
            GWU.xy.eachNeighbor(x, y, (i, j) => {
                if (!interior.hasXY(i, j) || interior[i][j])
                    return;
                if (interior.isBoundaryXY(i, j))
                    return;
                interiorNeighborCount = 0;
                let ok = true;
                GWU.xy.eachNeighbor(i, j, (x2, y2) => {
                    if (interior[x2][y2]) {
                        ++interiorNeighborCount;
                    }
                    else if (!site.isWall(x2, y2)) {
                        ok = false; // non-interior and not wall
                    }
                    else if (site.getMachine(x2, y2)) {
                        ok = false; // in another machine
                    }
                }, false // 8 dirs
                );
                if (!ok || interiorNeighborCount < minimumInteriorNeighbors)
                    return;
                interior[i][j] = gen + 1;
                ++interiorCount;
                if (site.blocksPathing(i, j)) {
                    site.clearCell(i, j, 'FLOOR');
                }
                madeChange = true;
            }, true // 4 dirs
            );
        });
    }
    interior.update((v) => (v > 0 ? 1 : 0));
}
function prepareInterior(builder) {
    const interior = builder.interior;
    const site = builder.site;
    const blueprint = builder.blueprint;
    // If requested, clear and expand the room as far as possible until either it's convex or it bumps into surrounding rooms
    if (blueprint.maximizeInterior) {
        maximizeInterior(builder, 1);
    }
    else if (blueprint.openInterior) {
        maximizeInterior(builder, 4);
    }
    // If requested, cleanse the interior -- no interesting terrain allowed.
    if (blueprint.purgeInterior) {
        interior.forEach((v, x, y) => {
            if (v)
                site.clearCell(x, y, FLOOR);
        });
    }
    else {
        if (blueprint.purgeBlockers) {
            // If requested, purge pathing blockers -- no traps allowed.
            interior.forEach((v, x, y) => {
                if (!v)
                    return;
                if (site.blocksPathing(x, y)) {
                    site.clearCell(x, y, FLOOR);
                }
            });
        }
        // If requested, purge the liquid layer in the interior -- no liquids allowed.
        if (blueprint.purgeLiquids) {
            interior.forEach((v, x, y) => {
                if (v && site.isAnyLiquid(x, y)) {
                    site.clearCell(x, y, FLOOR);
                }
            });
        }
    }
    // Surround with walls if requested.
    if (blueprint.surroundWithWalls) {
        interior.forEach((v, x, y) => {
            if (!v || site.hasCellFlag(x, y, GWM.flags.Cell.IS_GATE_SITE))
                return;
            GWU.xy.eachNeighbor(x, y, (i, j) => {
                if (!interior.hasXY(i, j))
                    return; // Not valid x,y
                if (interior[i][j])
                    return; // is part of machine
                if (site.isWall(i, j))
                    return; // is already a wall (of some sort)
                if (site.hasCellFlag(i, j, GWM.flags.Cell.IS_GATE_SITE))
                    return; // is a door site
                if (site.hasCellFlag(i, j, GWM.flags.Cell.IS_IN_MACHINE))
                    return; // is part of a machine
                if (site.blocksPathing(i, j))
                    return; // is a blocker for the player (water?)
                site.clearCell(i, j, WALL);
            }, false // all 8 directions
            );
        });
    }
    // Completely clear the interior, fill with granite, and cut entirely new rooms into it from the gate site.
    // Then zero out any portion of the interior that is still wall.
    // if (flags & BPFlags.BP_REDESIGN_INTERIOR) {
    //     RUT.Map.Blueprint.redesignInterior(map, interior, originX, originY, dungeonProfileIndex);
    // }
    // Reinforce surrounding tiles and interior tiles if requested to prevent tunneling in or through.
    if (blueprint.makeImpregnable) {
        interior.forEach((v, x, y) => {
            if (!v || site.hasCellFlag(x, y, GWM.flags.Cell.IS_GATE_SITE))
                return;
            site.setCellFlag(x, y, GWM.flags.Cell.IMPREGNABLE);
            GWU.xy.eachNeighbor(x, y, (i, j) => {
                if (!interior.hasXY(i, j))
                    return;
                if (interior[i][j])
                    return;
                if (site.hasCellFlag(i, j, GWM.flags.Cell.IS_GATE_SITE))
                    return;
                site.setCellFlag(i, j, GWM.flags.Cell.IMPREGNABLE);
            }, false);
        });
    }
    // If necessary, label the interior as IS_IN_AREA_MACHINE or IS_IN_ROOM_MACHINE and mark down the number.
    const machineNumber = builder.machineNumber;
    interior.forEach((v, x, y) => {
        if (!v)
            return;
        if (!blueprint.noInteriorFlag) {
            site.setMachine(x, y, machineNumber, blueprint.isRoom);
        }
        // secret doors mess up machines
        // TODO - is this still true?
        if (site.isSecretDoor(x, y)) {
            site.setTile(x, y, DOOR);
        }
    });
}
// export function expandMachineInterior(
//     builder: BuildData,
//     minimumInteriorNeighbors = 1
// ) {
//     let madeChange;
//     const interior = builder.interior;
//     const site = builder.site;
//     do {
//         madeChange = false;
//         interior.forEach((_v, x, y) => {
//             // if (v && site.isDoor(x, y)) {
//             //     site.setTile(x, y, SITE.FLOOR); // clean out the doors...
//             //     return;
//             // }
//             if (site.hasCellFlag(x, y, GWM.flags.Cell.IS_IN_MACHINE)) return;
//             if (!site.blocksPathing(x, y)) return;
//             let nbcount = 0;
//             GWU.xy.eachNeighbor(
//                 x,
//                 y,
//                 (i, j) => {
//                     if (!interior.hasXY(i, j)) return; // Not in map
//                     if (interior.isBoundaryXY(i, j)) return; // Not on boundary
//                     if (interior[i][j] && !site.blocksPathing(i, j)) {
//                         ++nbcount; // in machine and open tile
//                     }
//                 },
//                 false
//             );
//             if (nbcount < minimumInteriorNeighbors) return;
//             nbcount = 0;
//             GWU.xy.eachNeighbor(
//                 x,
//                 y,
//                 (i, j) => {
//                     if (!interior.hasXY(i, j)) return; // not on map
//                     if (interior[i][j]) return; // already part of machine
//                     if (
//                         !site.isWall(i, j) ||
//                         site.hasCellFlag(i, j, GWM.flags.Cell.IS_IN_MACHINE)
//                     ) {
//                         ++nbcount; // tile is not a wall or is in a machine
//                     }
//                 },
//                 false
//             );
//             if (nbcount) return;
//             // Eliminate this obstruction; welcome its location into the machine.
//             madeChange = true;
//             interior[x][y] = 1;
//             if (site.blocksPathing(x, y)) {
//                 site.setTile(x, y, SITE.FLOOR);
//             }
//             GWU.xy.eachNeighbor(x, y, (i, j) => {
//                 if (!interior.hasXY(i, j)) return;
//                 if (site.isSet(i, j)) return;
//                 site.setTile(i, j, SITE.WALL);
//             });
//         });
//     } while (madeChange);
// }
///////////////////////////
// INSTALL
const blueprints = {};
function install(id, blueprint) {
    if (!(blueprint instanceof Blueprint)) {
        blueprint = new Blueprint(blueprint);
    }
    blueprints[id] = blueprint;
    blueprint.id = id;
    return blueprint;
}
function random(requiredFlags, depth, rng) {
    const matches = Object.values(blueprints).filter((b) => b.qualifies(requiredFlags) && b.frequency(depth));
    rng = rng || GWU.rng.random;
    return rng.item(matches);
}
function get(id) {
    if (id instanceof Blueprint)
        return id;
    return blueprints[id];
}
function make(config) {
    // if (!config.id) throw new Error('id is required to make Blueprint.');
    return new Blueprint(config);
}

class ConsoleLogger {
    onDigFirstRoom(site) {
        console.group('dig first room');
        site.dump();
        console.groupEnd();
    }
    onRoomCandidate(room, roomSite) {
        console.group('room candidate: ' + room.toString());
        roomSite.dump();
        console.groupEnd();
    }
    onRoomFailed(_site, _room, _roomSite, error) {
        console.log('Room Failed - ', error);
    }
    onRoomSuccess(site, room) {
        console.group('Added Room - ' + room.toString());
        site.dump();
        console.groupEnd();
    }
    onLoopsAdded(_site) {
        console.log('loops added');
    }
    onLakesAdded(_site) {
        console.log('lakes added');
    }
    onBridgesAdded(_site) {
        console.log('bridges added');
    }
    onStairsAdded(_site) {
        console.log('stairs added');
    }
    //
    onBuildError(error) {
        console.log(`onBuildError - error: ${error}`);
    }
    onBlueprintPick(data, flags, depth) {
        console.log(`onBlueprintPick - ${data.blueprint.id}, depth = ${depth}, matchingFlags = ${GWU.flag.toString(Flags, flags)}`);
    }
    onBlueprintCandidates(data) {
        const label = `onBlueprintCandidates - ${data.blueprint.id}`;
        console.group(label);
        data.candidates.dump();
        console.groupEnd();
    }
    onBlueprintStart(data) {
        console.group(`onBlueprintStart - ${data.blueprint.id} @ ${data.originX},${data.originY} : stepCount: ${data.blueprint.steps.length}, size: [${data.blueprint.size.toString()}], flags: ${GWU.flag.toString(Flags, data.blueprint.flags)}`);
    }
    onBlueprintInterior(data) {
        console.group(`onBlueprintInterior - ${data.blueprint.id}`);
        data.interior.dump();
        console.groupEnd();
    }
    onBlueprintFail(data, error) {
        console.log(`onBlueprintFail - ${data.blueprint.id} @ ${data.originX},${data.originY} : error: ${error}`);
        console.groupEnd();
    }
    onBlueprintSuccess(data) {
        console.log(`onBlueprintSuccess - ${data.blueprint.id} @ ${data.originX},${data.originY}`);
        console.groupEnd();
    }
    onStepStart(data, step) {
        console.group(`onStepStart - ${data.blueprint.id}[${data.blueprint.steps.indexOf(step) + 1}/${data.blueprint.steps.length}] @ ${data.originX},${data.originY} : count: [${step.count.toString()}], flags: ${GWU.flag.toString(StepFlags, step.flags)}`);
        console.log(step.toString());
    }
    onStepCandidates(data, step, candidates, wantCount) {
        const haveCount = candidates.count((v) => v == 1);
        console.log(`onStepCandidates - ${data.blueprint.id}[${data.blueprint.steps.indexOf(step) + 1}/${data.blueprint.steps.length}] @ ${data.originX},${data.originY} : wantCount: ${wantCount}, have: ${haveCount}`);
        candidates.dump();
        if (haveCount == 0) {
            console.log('No candidates - check interior');
            data.interior.dump();
        }
    }
    onStepInstanceSuccess(_data, _step, x, y) {
        console.log(`onStepInstance @ ${x},${y}`);
    }
    onStepInstanceFail(_data, _step, x, y, error) {
        console.log(`onStepInstanceFail @ ${x},${y} - error: ${error}`);
    }
    onStepSuccess(data, step) {
        console.log(`onStepSuccess - ${data.blueprint.id}[${data.blueprint.steps.indexOf(step) + 1}/${data.blueprint.steps.length}] @ ${data.originX},${data.originY} : count: [${step.count.toString()}], flags: ${GWU.flag.toString(StepFlags, step.flags)}`);
        console.groupEnd();
    }
    onStepFail(data, step, error) {
        console.log(`onStepFail - ${data.blueprint.id}[${data.blueprint.steps.indexOf(step) + 1}/${data.blueprint.steps.length}] @ ${data.originX},${data.originY} : error : ${error}`);
        console.groupEnd();
    }
}

class Digger {
    constructor(options = {}) {
        var _a, _b;
        this.seed = 0;
        this.rooms = { fails: 20 };
        this.doors = { chance: 15 };
        this.halls = { chance: 15 };
        this.loops = {};
        this.lakes = {};
        this.bridges = {};
        this.stairs = {};
        this.boundary = true;
        this.startLoc = [-1, -1];
        this.endLoc = [-1, -1];
        this.seed = options.seed || 0;
        GWU.object.setOptions(this.rooms, options.rooms);
        // Doors
        if (options.doors === false) {
            options.doors = { chance: 0 };
        }
        else if (options.doors === true) {
            options.doors = { chance: 100 };
        }
        GWU.object.setOptions(this.doors, options.doors);
        // Halls
        if (options.halls === false) {
            options.halls = { chance: 0 };
        }
        else if (options.halls === true) {
            options.halls = {};
        }
        GWU.object.setOptions(this.halls, options.halls);
        // Loops
        if (options.loops === false) {
            this.loops = null;
        }
        else {
            if (options.loops === true)
                options.loops = {};
            options.loops = options.loops || {};
            options.loops.doorChance =
                (_a = options.loops.doorChance) !== null && _a !== void 0 ? _a : (_b = options.doors) === null || _b === void 0 ? void 0 : _b.chance;
            GWU.object.setOptions(this.loops, options.loops);
        }
        // Lakes
        if (options.lakes === false) {
            this.lakes = null;
        }
        else {
            if (options.lakes === true)
                options.lakes = {};
            GWU.object.setOptions(this.lakes, options.lakes);
        }
        // Bridges
        if (options.bridges === false) {
            this.bridges = null;
        }
        else {
            if (options.bridges === true)
                options.bridges = {};
            GWU.object.setOptions(this.bridges, options.bridges);
        }
        // Stairs
        if (options.stairs === false) {
            this.stairs = null;
        }
        else {
            if (options.stairs === true)
                options.stairs = {};
            GWU.object.setOptions(this.stairs, options.stairs);
        }
        this.startLoc = options.startLoc || [-1, -1];
        this.endLoc = options.endLoc || [-1, -1];
        if (options.log === true) {
            this.log = new ConsoleLogger();
        }
        else if (options.log) {
            this.log = options.log;
        }
        else {
            this.log = new NullLogger();
        }
    }
    _makeRoomSite(width, height) {
        const site = new GridSite(width, height);
        site.rng = this.site.rng;
        return site;
    }
    _createSite(a, b) {
        if (a instanceof GWM.map.Map) {
            this.site = new MapSite(a);
        }
        else if (b) {
            this.site = new GridSite(a, b);
        }
        else {
            throw new Error('Invlaid digger arguments.');
        }
    }
    create(...args) {
        this._createSite(args[0], args[1]);
        const result = this._create(this.site);
        const cb = args[2] || null;
        if (cb) {
            GWU.xy.forRect(this.site.width, this.site.height, (x, y) => {
                const t = this.site.getTileIndex(x, y);
                if (t)
                    cb(x, y, t);
            });
        }
        this.site.free();
        return result;
    }
    _create(site) {
        this.start(site);
        let tries = 20;
        while (--tries) {
            if (this.addFirstRoom(site))
                break;
        }
        if (!tries)
            throw new Error('Failed to place first room!');
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
            }
            else {
                ++fails;
            }
        }
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
    start(site) {
        const seed = this.seed || GWU.rng.random.number();
        site.setSeed(seed);
        site.clear();
        this.seq = site.rng.sequence(site.width * site.height);
        if (this.startLoc[0] < 0 && this.startLoc[0] < 0) {
            this.startLoc[0] = Math.floor(site.width / 2);
            this.startLoc[1] = site.height - 2;
        }
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
        const roomSite = this._makeRoomSite(site.width, site.height);
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
        const roomSite = this._makeRoomSite(site.width, site.height);
        let digger = this.getDigger(this.rooms.digger || 'DEFAULT');
        let room = digger.create(roomSite);
        // attach hall?
        if (room && this.halls.chance) {
            let hall$1 = dig(this.halls, roomSite, room.doors);
            if (hall$1) {
                room.hall = hall$1;
            }
        }
        // console.log('potential room');
        // roomSite.dump();
        if (room) {
            this.log.onRoomCandidate(room, roomSite);
            if (this._attachRoom(site, roomSite, room)) {
                this.log.onRoomSuccess(site, room);
            }
            else {
                this.log.onRoomFailed(site, room, roomSite, 'Did not fit.');
                room = null;
            }
        }
        roomSite.free();
        return room;
    }
    _attachRoom(site, roomSite, room) {
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
                if (!door)
                    continue;
                const offsetX = x - door[0];
                const offsetY = y - door[1];
                if (door[0] != -1 &&
                    this._roomFitsAt(site, roomSite, room, offsetX, offsetY)) {
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
        const dirs = site.rng.sequence(4);
        // console.log('attachRoomAtXY', x, y, doorSites.join(', '));
        for (let dir of dirs) {
            const oppDir = (dir + 2) % 4;
            const door = doorSites[oppDir];
            if (!door || door[0] == -1)
                continue;
            const offX = x - door[0];
            const offY = y - door[1];
            if (this._roomFitsAt(site, roomSite, room, offX, offY)) {
                // dungeon.debug("attachRoom: ", x, y, oppDir);
                // TYPES.Room fits here.
                copySite(site, roomSite, offX, offY);
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
    _roomFitsAt(map, roomGrid, room, roomToSiteX, roomToSiteY) {
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
                    if (!map.hasXY(xSite, ySite) ||
                        map.isBoundaryXY(xSite, ySite)) {
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
    _attachDoor(site, room, x, y, dir) {
        const opts = this.doors;
        let isDoor = false;
        if (opts.chance && site.rng.chance(opts.chance)) {
            isDoor = true;
        }
        const tile = isDoor ? opts.tile || DOOR : FLOOR;
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
        }
        else {
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
    _removeDiagonalOpenings(site) {
        let i, j, k, x1, y1;
        let diagonalCornerRemoved;
        do {
            diagonalCornerRemoved = false;
            for (i = 0; i < site.width - 1; i++) {
                for (j = 0; j < site.height - 1; j++) {
                    for (k = 0; k <= 1; k++) {
                        if (!site.blocksMove(i + k, j) &&
                            site.blocksMove(i + (1 - k), j) &&
                            site.blocksDiagonal(i + (1 - k), j) &&
                            site.blocksMove(i + k, j + 1) &&
                            site.blocksDiagonal(i + k, j + 1) &&
                            !site.blocksMove(i + (1 - k), j + 1)) {
                            if (site.rng.chance(50)) {
                                x1 = i + (1 - k);
                                y1 = j;
                            }
                            else {
                                x1 = i + k;
                                y1 = j + 1;
                            }
                            diagonalCornerRemoved = true;
                            site.setTile(x1, y1, FLOOR); // todo - pick one of the passable tiles around it...
                        }
                    }
                }
            }
        } while (diagonalCornerRemoved == true);
    }
    _finishDoors(site) {
        GWU.xy.forRect(site.width, site.height, (x, y) => {
            if (site.isBoundaryXY(x, y))
                return;
            // todo - isDoorway...
            if (site.isDoor(x, y)) {
                if (
                // TODO - isPassable
                (site.isFloor(x + 1, y) || site.isFloor(x - 1, y)) &&
                    (site.isFloor(x, y + 1) || site.isFloor(x, y - 1))) {
                    // If there's passable terrain to the left or right, and there's passable terrain
                    // above or below, then the door is orphaned and must be removed.
                    site.setTile(x, y, FLOOR); // todo - take passable neighbor value
                }
                else if ((site.blocksPathing(x + 1, y) ? 1 : 0) +
                    (site.blocksPathing(x - 1, y) ? 1 : 0) +
                    (site.blocksPathing(x, y + 1) ? 1 : 0) +
                    (site.blocksPathing(x, y - 1) ? 1 : 0) >=
                    3) {
                    // If the door has three or more pathing blocker neighbors in the four cardinal directions,
                    // then the door is orphaned and must be removed.
                    site.setTile(x, y, FLOOR); // todo - take passable neighbor
                }
            }
        });
    }
    _finishWalls(site) {
        const boundaryTile = this.boundary ? IMPREGNABLE : WALL;
        GWU.xy.forRect(site.width, site.height, (x, y) => {
            if (site.isNothing(x, y)) {
                if (site.isBoundaryXY(x, y)) {
                    site.setTile(x, y, boundaryTile);
                }
                else {
                    site.setTile(x, y, WALL);
                }
            }
        });
    }
}
function digMap(map, options = {}) {
    const digger = new Digger(options);
    return digger.create(map);
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
        let startLoc = this.config.startLoc || [
            Math.floor(this.config.width / 2),
            this.config.height - 2,
        ];
        const minDistance = this.config.stairDistance ||
            Math.floor(Math.max(this.config.width / 2, this.config.height / 2));
        for (let i = 0; i < this.config.levels; ++i) {
            const endLoc = GWU.rng.random.matchingLoc(this.config.width, this.config.height, (x, y) => {
                return (GWU.xy.distanceBetween(startLoc[0], startLoc[1], x, y) >
                    minDistance);
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
            seed: this.seeds[id],
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
        const digger = new Digger(opts);
        const result = digger.create(this.config.width, this.config.height, cb);
        if (!GWU.xy.equalsXY(digger.endLoc, opts.endLoc) ||
            !GWU.xy.equalsXY(digger.startLoc, opts.startLoc)) {
            this.stairLocs[id] = [digger.startLoc, digger.endLoc];
        }
        return result;
    }
}

class BuildData {
    constructor(site, blueprint) {
        this.originX = -1;
        this.originY = -1;
        this.distance25 = -1;
        this.distance75 = -1;
        this.machineNumber = 0;
        this.depth = 0;
        this.seed = 0;
        this.site = site;
        this.blueprint = blueprint;
        this.interior = GWU.grid.alloc(site.width, site.height);
        this.occupied = GWU.grid.alloc(site.width, site.height);
        this.viewMap = GWU.grid.alloc(site.width, site.height);
        this.distanceMap = GWU.grid.alloc(site.width, site.height);
        this.candidates = GWU.grid.alloc(site.width, site.height);
    }
    free() {
        GWU.grid.free(this.interior);
        GWU.grid.free(this.occupied);
        GWU.grid.free(this.viewMap);
        GWU.grid.free(this.distanceMap);
        GWU.grid.free(this.candidates);
    }
    get rng() {
        return this.site.rng;
    }
    reset(originX, originY) {
        this.interior.fill(0);
        this.occupied.fill(0);
        this.viewMap.fill(0);
        this.distanceMap.fill(0);
        // this.candidates.fill(0);
        this.originX = originX;
        this.originY = originY;
        this.distance25 = 0;
        this.distance75 = 0;
        if (this.seed) {
            this.site.setSeed(this.seed);
        }
    }
    calcDistances(maxSize) {
        this.distanceMap.fill(0);
        computeDistanceMap(this.site, this.distanceMap, this.originX, this.originY, maxSize);
        let qualifyingTileCount = 0;
        const distances = new Array(100).fill(0);
        this.interior.forEach((v, x, y) => {
            if (!v)
                return;
            const dist = this.distanceMap[x][y];
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
        this.distance25 = distance25;
        this.distance75 = distance75;
    }
}

class Builder {
    constructor(options = {}) {
        this.blueprints = null;
        if (options.blueprints) {
            if (!Array.isArray(options.blueprints)) {
                options.blueprints = Object.values(options.blueprints);
            }
            this.blueprints = options.blueprints.map((v) => get(v));
        }
        if (options.log === true) {
            this.log = new ConsoleLogger();
        }
        else {
            this.log = options.log || new NullLogger();
        }
    }
    _pickRandom(requiredFlags, depth, rng) {
        rng = rng || GWU.rng.random;
        const blueprints$1 = this.blueprints || Object.values(blueprints);
        const weights = blueprints$1.map((b) => {
            if (!b.qualifies(requiredFlags))
                return 0;
            return b.frequency(depth);
        });
        const index = rng.weighted(weights);
        return blueprints$1[index] || null;
    }
    buildRandom(site, requiredMachineFlags = Flags.BP_ROOM, x = -1, y = -1, adoptedItem = null) {
        if (site instanceof GWM.map.Map) {
            site = new MapSite(site);
        }
        const depth = site.depth;
        let tries = 0;
        while (tries < 10) {
            const blueprint = this._pickRandom(requiredMachineFlags, depth, site.rng);
            if (!blueprint) {
                this.log.onBuildError(`Failed to find matching blueprint: requiredMachineFlags : ${GWU.flag.toString(Flags, requiredMachineFlags)}, depth: ${depth}`);
                return null;
            }
            const data = new BuildData(site, blueprint);
            data.site.analyze();
            this.log.onBlueprintPick(data, requiredMachineFlags, depth);
            if (this._buildAt(data, x, y, adoptedItem)) {
                return { x, y };
            }
            ++tries;
        }
        // console.log(
        //     'Failed to build random blueprint matching flags: ' +
        //         GWU.flag.toString(BLUE.Flags, requiredMachineFlags) +
        //         ' tried : ' +
        //         tries.join(', ')
        // );
        return null;
    }
    build(site, blueprint, x = -1, y = -1, adoptedItem = null) {
        if (site instanceof GWM.map.Map) {
            site = new MapSite(site);
        }
        if (typeof blueprint === 'string') {
            const id = blueprint;
            blueprint = blueprints[id];
            if (!blueprint)
                throw new Error('Failed to find blueprint - ' + id);
        }
        const data = new BuildData(site, blueprint);
        data.site.analyze();
        return this._buildAt(data, x, y, adoptedItem);
    }
    _buildAt(data, x = -1, y = -1, adoptedItem = null) {
        if (x >= 0 && y >= 0) {
            return this._build(data, x, y, adoptedItem);
        }
        let count = this._markCandidates(data);
        if (!count) {
            return null;
        }
        let tries = 20; // TODO - Make property of Blueprint
        while (count-- && tries--) {
            const loc = pickCandidateLoc(data) || false;
            if (loc) {
                if (this._build(data, loc[0], loc[1], adoptedItem)) {
                    return { x: loc[0], y: loc[1] };
                }
            }
        }
        this.log.onBlueprintFail(data, 'No suitable locations found to build blueprint.');
        return null;
    }
    //////////////////////////////////////////
    // Returns true if the machine got built; false if it was aborted.
    // If empty array spawnedItems or spawnedMonsters is given, will pass those back for deletion if necessary.
    _build(data, originX, originY, adoptedItem = null) {
        data.reset(originX, originY);
        this.log.onBlueprintStart(data, adoptedItem);
        if (!this._computeInterior(data)) {
            return null;
        }
        // This is the point of no return. Back up the level so it can be restored if we have to abort this machine after this point.
        const snapshot = data.site.snapshot();
        data.machineNumber = data.site.nextMachineId(); // Reserve this machine number, starting with 1.
        // Perform any transformations to the interior indicated by the blueprint flags, including expanding the interior if requested.
        prepareInterior(data);
        // Calculate the distance map (so that features that want to be close to or far from the origin can be placed accordingly)
        // and figure out the 33rd and 67th percentiles for features that want to be near or far from the origin.
        data.calcDistances(data.blueprint.size.hi);
        // Now decide which features will be skipped -- of the features marked MF_ALTERNATIVE, skip all but one, chosen randomly.
        // Then repeat and do the same with respect to MF_ALTERNATIVE_2, to provide up to two independent sets of alternative features per machine.
        const components = data.blueprint.pickComponents(data.site.rng);
        // Zero out occupied[][], and use it to keep track of the personal space around each feature that gets placed.
        // Now tick through the features and build them.
        for (let index = 0; index < components.length; index++) {
            const component = components[index];
            // console.log('BUILD COMPONENT', component);
            if (!this._buildStep(data, component, adoptedItem)) {
                // failure! abort!
                // Restore the map to how it was before we touched it.
                this.log.onBlueprintFail(data, `Failed to build step ${index + 1}.`);
                snapshot.restore();
                // abortItemsAndMonsters(spawnedItems, spawnedMonsters);
                return null;
            }
        }
        // Clear out the interior flag for all non-wired cells, if requested.
        if (data.blueprint.noInteriorFlag) {
            clearInteriorFlag(data.site, data.machineNumber);
        }
        // if (torchBearer && torch) {
        // 	if (torchBearer->carriedItem) {
        // 		deleteItem(torchBearer->carriedItem);
        // 	}
        // 	removeItemFromChain(torch, floorItems);
        // 	torchBearer->carriedItem = torch;
        // }
        this.log.onBlueprintSuccess(data);
        snapshot.cancel();
        // console.log('Built a machine from blueprint:', originX, originY);
        return { x: originX, y: originY };
    }
    _markCandidates(data) {
        const count = markCandidates(data);
        if (count <= 0) {
            this.log.onBlueprintFail(data, 'No suitable candidate locations found.');
            return 0;
        }
        this.log.onBlueprintCandidates(data);
        return count;
    }
    _computeInterior(data) {
        let fail = null;
        let count = data.blueprint.fillInterior(data);
        // Now make sure the interior map satisfies the machine's qualifications.
        if (!count) {
            fail = 'Interior error.';
        }
        else if (!data.blueprint.size.contains(count)) {
            fail = `Interior wrong size - have: ${count}, want: ${data.blueprint.size.toString()}`;
        }
        else if (data.blueprint.treatAsBlocking &&
            siteDisruptedBy(data.site, data.interior, {
                machine: data.site.machineCount,
            })) {
            fail = 'Interior blocks map.';
        }
        else if (data.blueprint.requireBlocking &&
            siteDisruptedSize(data.site, data.interior) < 100) {
            fail = 'Interior does not block enough cells.';
        }
        if (!fail) {
            this.log.onBlueprintInterior(data);
            return true;
        }
        this.log.onBlueprintFail(data, fail);
        return false;
    }
    _buildStep(data, buildStep, adoptedItem) {
        let wantCount = 0;
        let builtCount = 0;
        const site = data.site;
        this.log.onStepStart(data, buildStep, adoptedItem);
        // console.log(
        //     'buildComponent',
        //     blueprint.id,
        //     blueprint.steps.indexOf(buildStep)
        // );
        // Figure out the distance bounds.
        const distanceBound = calcDistanceBound(data, buildStep);
        // If the StepFlags.BS_REPEAT_UNTIL_NO_PROGRESS flag is set, repeat until we fail to build the required number of instances.
        // Make a master map of candidate locations for this feature.
        let qualifyingTileCount = 0;
        if (buildStep.buildVestibule) {
            // Generate a door guard machine.
            // Try to create a sub-machine that qualifies.
            let success = this.buildRandom(data.site, Flags.BP_VESTIBULE, data.originX, data.originY);
            if (!success) {
                this.log.onStepFail(data, buildStep, 'Failed to build vestibule');
                return false;
            }
        }
        // If we are just building a vestibule, then we can exit here...
        if (!buildStep.buildsInstances) {
            this.log.onStepSuccess(data, buildStep);
            return true;
        }
        const candidates = GWU.grid.alloc(site.width, site.height);
        let didSomething = false;
        do {
            didSomething = false;
            if (buildStep.buildAtOrigin) {
                candidates[data.originX][data.originY] = 1;
                qualifyingTileCount = 1;
                wantCount = 1;
            }
            else {
                qualifyingTileCount = buildStep.markCandidates(data, candidates, distanceBound);
                if (buildStep.generateEverywhere ||
                    buildStep.repeatUntilNoProgress) {
                    wantCount = qualifyingTileCount;
                }
                else {
                    wantCount = buildStep.count.value(site.rng);
                }
                this.log.onStepCandidates(data, buildStep, candidates, wantCount);
                // get rid of all error/invalid codes
                candidates.update((v) => (v == 1 ? 1 : 0));
                if (!qualifyingTileCount ||
                    qualifyingTileCount < buildStep.count.lo) {
                    this.log.onStepFail(data, buildStep, `Only ${qualifyingTileCount} qualifying tiles - want ${buildStep.count.toString()}.`);
                    return false;
                }
            }
            let x = 0, y = 0;
            while (qualifyingTileCount > 0 && builtCount < wantCount) {
                // Find a location for the feature.
                if (buildStep.buildAtOrigin) {
                    // Does the feature want to be at the origin? If so, put it there. (Just an optimization.)
                    x = data.originX;
                    y = data.originY;
                }
                else {
                    // Pick our candidate location randomly, and also strike it from
                    // the candidates map so that subsequent instances of this same feature can't choose it.
                    [x, y] = data.rng.matchingLoc(candidates.width, candidates.height, (x, y) => candidates[x][y] == 1);
                }
                // Don't waste time trying the same place again whether or not this attempt succeeds.
                candidates[x][y] = 0;
                qualifyingTileCount--;
                const snapshot = data.site.snapshot();
                if (this._buildStepInstance(data, buildStep, x, y, adoptedItem)) {
                    // OK, if placement was successful, clear some personal space around the feature so subsequent features can't be generated too close.
                    qualifyingTileCount -= buildStep.makePersonalSpace(data, x, y, candidates);
                    builtCount++; // we've placed an instance
                    didSomething = true;
                    snapshot.cancel(); // This snapshot is useless b/c we made changes...
                }
                else {
                    snapshot.restore(); // need to undo any changes...
                }
                // Finished with this instance!
            }
        } while (didSomething && buildStep.repeatUntilNoProgress);
        GWU.grid.free(candidates);
        if (!buildStep.count.contains(builtCount) &&
            !buildStep.generateEverywhere &&
            !buildStep.repeatUntilNoProgress) {
            this.log.onStepFail(data, buildStep, `Failed to build enough instances - want: ${buildStep.count.toString()}, built: ${builtCount}`);
            return false;
        }
        this.log.onStepSuccess(data, buildStep);
        return true;
    }
    _buildStepInstance(data, buildStep, x, y, adoptedItem = null) {
        let success = true;
        let didSomething = true;
        const site = data.site;
        if (success && buildStep.treatAsBlocking) {
            // Yes, check for blocking.
            const options = {
                machine: site.machineCount,
            };
            if (buildStep.noBlockOrigin) {
                options.updateWalkable = (g) => {
                    g[data.originX][data.originY] = 1;
                    return true;
                };
            }
            if (siteDisruptedByXY(site, x, y, options)) {
                this.log.onStepInstanceFail(data, buildStep, x, y, 'instance blocks map');
                success = false;
            }
        }
        // Try to build the DF first, if any, since we don't want it to be disrupted by subsequently placed terrain.
        if (success && buildStep.effect) {
            success = site.buildEffect(buildStep.effect, x, y);
            didSomething = success;
            if (!success) {
                this.log.onStepInstanceFail(data, buildStep, x, y, 'Failed to build effect - ' +
                    JSON.stringify(buildStep.effect));
            }
        }
        // Now try to place the terrain tile, if any.
        if (success && buildStep.tile !== -1) {
            const tile = GWM.tile.get(buildStep.tile);
            if (!tile) {
                success = false;
                this.log.onStepInstanceFail(data, buildStep, x, y, 'failed to find tile - ' + buildStep.tile);
            }
            else if (!buildStep.permitBlocking &&
                tile.blocksMove() &&
                !buildStep.treatAsBlocking // already did treatAsBlocking
            ) {
                if (siteDisruptedByXY(site, x, y, {
                    machine: site.machineCount,
                })) {
                    this.log.onStepInstanceFail(data, buildStep, x, y, 'tile blocks site');
                    success = false;
                }
            }
            if (success) {
                success = site.setTile(x, y, tile);
                didSomething = didSomething || success;
                if (!success) {
                    this.log.onStepInstanceFail(data, buildStep, x, y, 'failed to set tile - ' + tile.id);
                }
            }
        }
        let torch = adoptedItem;
        // Generate an item, if necessary
        if (success && buildStep.item) {
            const item = buildStep.makeItem(data);
            if (!item) {
                success = false;
                this.log.onStepInstanceFail(data, buildStep, x, y, 'Failed to make random item - ' +
                    JSON.stringify(buildStep.item));
            }
            else {
                if (buildStep.itemIsKey) {
                    item.key = GWM.entity.makeKeyInfo(x, y, !!buildStep.keyIsDisposable);
                }
                if (buildStep.outsourceItem) {
                    const result = this.buildRandom(data.site, Flags.BP_ADOPT_ITEM, -1, -1, item);
                    if (result) {
                        didSomething = true;
                    }
                    else {
                        this.log.onStepInstanceFail(data, buildStep, x, y, 'Failed to build machine to adopt item - ' +
                            item.kind.id);
                        success = false;
                    }
                }
                else if (buildStep.hordeTakesItem) {
                    torch = item;
                }
                else {
                    success = site.addItem(x, y, item);
                    didSomething = didSomething || success;
                    if (!success) {
                        this.log.onStepInstanceFail(data, buildStep, x, y, 'Failed to add item to site - ' + item.kind.id);
                    }
                }
            }
        }
        else if (success && buildStep.adoptItem) {
            // adopt item if necessary
            if (!adoptedItem) {
                throw new Error('Failed to build blueprint because there is no adopted item.');
            }
            if (success) {
                success = site.addItem(x, y, adoptedItem);
                if (success) {
                    didSomething = true;
                }
                else {
                    this.log.onStepInstanceFail(data, buildStep, x, y, 'Failed to add adopted item to site - ' +
                        adoptedItem.kind.id);
                }
            }
        }
        let torchBearer = null;
        if (success && buildStep.horde) {
            let horde;
            if (buildStep.horde.random) {
                horde = GWM.horde.random({ rng: site.rng });
            }
            else if (buildStep.horde.id) {
                horde = GWM.horde.from(buildStep.horde.id);
            }
            else {
                buildStep.horde.rng = site.rng;
                horde = GWM.horde.random(buildStep.horde);
            }
            if (!horde) {
                success = false;
                this.log.onStepInstanceFail(data, buildStep, x, y, 'Failed to pick horde - ' + JSON.stringify(buildStep.horde));
            }
            else {
                const leader = site.spawnHorde(horde, x, y, {
                    machine: site.machineCount,
                });
                if (!leader) {
                    success = false;
                    this.log.onStepInstanceFail(data, buildStep, x, y, 'Failed to build horde - ' + horde);
                }
                else {
                    // What to do now?
                    didSomething = true;
                    // leader adopts item...
                    if (torch && buildStep.hordeTakesItem) {
                        torchBearer = leader;
                        if (!torchBearer.pickupItem(torch, {
                            admin: true,
                        })) {
                            success = false;
                        }
                    }
                    if (buildStep.horde.effect) {
                        const info = GWM.effect.from(buildStep.horde.effect);
                        site.buildEffect(info, x, y);
                    }
                }
            }
        }
        if (success && didSomething) {
            // Mark the feature location as part of the machine, in case it is not already inside of it.
            if (!data.blueprint.noInteriorFlag) {
                site.setMachine(x, y, data.machineNumber, data.blueprint.isRoom);
            }
            // Mark the feature location as impregnable if requested.
            if (buildStep.impregnable) {
                site.setCellFlag(x, y, GWM.flags.Cell.IMPREGNABLE);
            }
            this.log.onStepInstanceSuccess(data, buildStep, x, y);
        }
        return success && didSomething;
    }
}
////////////////////////////////////////////////////
// TODO - Change this!!!
// const blue = BLUE.get(id | blue);
// const result =  blue.buildAt(map, x, y);
//
function build(blueprint, map, x, y, opts) {
    const builder = new Builder(opts);
    const site = new MapSite(map);
    return builder.build(site, blueprint, x, y);
}

var index$2 = /*#__PURE__*/Object.freeze({
    __proto__: null,
    BuildData: BuildData,
    get StepFlags () { return StepFlags; },
    BuildStep: BuildStep,
    updateViewMap: updateViewMap,
    calcDistanceBound: calcDistanceBound,
    get CandidateType () { return CandidateType; },
    cellIsCandidate: cellIsCandidate,
    Builder: Builder,
    build: build,
    get Flags () { return Flags; },
    Blueprint: Blueprint,
    markCandidates: markCandidates,
    pickCandidateLoc: pickCandidateLoc,
    computeVestibuleInterior: computeVestibuleInterior,
    maximizeInterior: maximizeInterior,
    prepareInterior: prepareInterior,
    blueprints: blueprints,
    install: install,
    random: random,
    get: get,
    make: make
});

// export * from './visualizer';

var index$1 = /*#__PURE__*/Object.freeze({
    __proto__: null,
    NullLogger: NullLogger,
    ConsoleLogger: ConsoleLogger
});

class MachineHorde extends GWM.horde.Horde {
    constructor(config) {
        super(config);
        this.machine = null;
        this.machine = config.blueprint || null;
    }
    _addLeader(leader, map, x, y, opts) {
        if (this.machine) {
            build(this.machine, map, x, y);
        }
        if (!super._addLeader(leader, map, x, y, opts))
            return false;
        return true;
    }
}

var index = /*#__PURE__*/Object.freeze({
    __proto__: null,
    MachineHorde: MachineHorde
});

export { Digger, Dungeon, Hall, Room, index$2 as blueprint, bridge, digMap, hall, index as horde, lake, index$1 as log, loop, makeHall, room, index$3 as site, stairs };
