import * as GWU from 'gw-utils';
import * as GWM from 'gw-map';

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
class GridSite {
    constructor(width, height) {
        this.tiles = GWU.grid.alloc(width, height);
    }
    free() {
        GWU.grid.free(this.tiles);
    }
    clear() {
        this.tiles.fill(0);
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
}

const Flags$1 = GWM.flags.Cell;
class MapSite {
    constructor(map) {
        this.machineCount = 0;
        this.map = map;
    }
    get width() {
        return this.map.width;
    }
    get height() {
        return this.map.height;
    }
    hasXY(x, y) {
        return this.map.hasXY(x, y);
    }
    isBoundaryXY(x, y) {
        return this.map.isBoundaryXY(x, y);
    }
    hasCellFlag(x, y, flag) {
        return this.map.cellInfo(x, y).hasCellFlag(flag);
    }
    setCellFlag(x, y, flag) {
        this.map.cell(x, y).setCellFlag(flag);
    }
    clearCellFlag(x, y, flag) {
        this.map.cell(x, y).clearCellFlag(flag);
    }
    hasTile(x, y, tile) {
        return this.map.cellInfo(x, y).hasTile(tile);
    }
    setTile(x, y, tile, opts) {
        return this.map.setTile(x, y, tile, opts);
    }
    getTileIndex(x, y) {
        if (!this.hasXY(x, y))
            return 0;
        const cell = this.map.cell(x, y);
        const tile = cell.highestPriorityTile();
        return tile.index;
    }
    clear() {
        this.map.cells.forEach((c) => c.clear());
    }
    hasItem(x, y) {
        return this.map.cellInfo(x, y).hasItem();
    }
    makeRandomItem(tags) {
        return GWM.item.makeRandom(tags);
    }
    addItem(x, y, item) {
        return this.map.forceItem(x, y, item);
    }
    hasActor(x, y) {
        return this.map.hasActor(x, y);
    }
    blocksMove(x, y) {
        return this.map.cellInfo(x, y).blocksMove();
    }
    blocksVision(x, y) {
        return this.map.cellInfo(x, y).blocksVision();
    }
    blocksDiagonal(x, y) {
        return this.map
            .cellInfo(x, y)
            .hasEntityFlag(GWM.flags.Entity.L_BLOCKS_DIAGONAL);
    }
    blocksPathing(x, y) {
        const info = this.map.cellInfo(x, y);
        return (info.hasEntityFlag(GWM.flags.Entity.L_BLOCKS_MOVE) ||
            info.hasTileFlag(GWM.tile.flags.Tile.T_PATHING_BLOCKER));
    }
    blocksItems(x, y) {
        return this.map
            .cellInfo(x, y)
            .hasEntityFlag(GWM.flags.Entity.L_BLOCKS_ITEMS);
    }
    blocksEffects(x, y) {
        return this.map
            .cellInfo(x, y)
            .hasEntityFlag(GWM.flags.Entity.L_BLOCKS_EFFECTS);
    }
    isWall(x, y) {
        return this.map.cellInfo(x, y).isWall();
    }
    isStairs(x, y) {
        return this.map.cellInfo(x, y).isStairs();
    }
    isSet(x, y) {
        return this.hasXY(x, y) && !this.map.cell(x, y).isEmpty();
    }
    isDiggable(x, y) {
        if (!this.hasXY(x, y))
            return false;
        const cell = this.map.cell(x, y);
        if (cell.isEmpty())
            return true;
        if (cell.isWall())
            return true;
        return false;
    }
    isNothing(x, y) {
        return this.hasXY(x, y) && this.map.cell(x, y).isEmpty();
    }
    isFloor(x, y) {
        return this.isPassable(x, y);
    }
    isBridge(x, y) {
        return this.map
            .cellInfo(x, y)
            .hasTileFlag(GWM.tile.flags.Tile.T_BRIDGE);
    }
    isDoor(x, y) {
        return this.map
            .cellInfo(x, y)
            .hasTileFlag(GWM.tile.flags.Tile.T_IS_DOOR);
    }
    isSecretDoor(x, y) {
        return this.map
            .cellInfo(x, y)
            .hasEntityFlag(GWM.flags.Entity.L_SECRETLY_PASSABLE);
    }
    isDeep(x, y) {
        return this.map
            .cellInfo(x, y)
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
        const info = this.map.cellInfo(x, y);
        return !(info.blocksMove() || info.blocksPathing());
    }
    // tileBlocksMove(tile: number): boolean {
    //     return GWM.tile.get(tile).blocksMove();
    // }
    backup() {
        const site = new MapSite(this.map.clone());
        site.machineCount = this.machineCount;
        return site;
    }
    restore(backup) {
        this.map.copy(backup.map);
        this.machineCount = backup.machineCount;
    }
    free() { }
    getChokeCount(x, y) {
        return this.map.cell(x, y).chokeCount;
    }
    setChokeCount(x, y, count) {
        this.map.cell(x, y).chokeCount = count;
    }
    analyze() {
        GWM.map.analyze(this.map);
    }
    fireEffect(effect, x, y) {
        return GWM.effect.fireSync(effect, this.map, x, y);
    }
    nextMachineId() {
        return ++this.machineCount;
    }
    getMachine(x, y) {
        return this.map.cell(x, y).machineId;
    }
    setMachine(x, y, id, isRoom = true) {
        this.map.cell(x, y).machineId = id;
        if (id == 0) {
            this.map.clearCellFlag(x, y, Flags$1.IS_IN_MACHINE);
        }
        else {
            this.map.setCellFlag(x, y, isRoom ? Flags$1.IS_IN_ROOM_MACHINE : Flags$1.IS_IN_AREA_MACHINE);
        }
    }
}

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
        const loc = GWU.random.item(DOORS[dir]) || [-1, -1];
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
//     const doorIndexes = GWU.random.sequence(mapDoors.length);
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
//     const dirs = GWU.random.sequence(4);
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
function siteDisruptedBy(site, blockingGrid, options = {}) {
    var _a, _b, _c;
    (_a = options.offsetX) !== null && _a !== void 0 ? _a : (options.offsetX = 0);
    (_b = options.offsetY) !== null && _b !== void 0 ? _b : (options.offsetY = 0);
    (_c = options.machine) !== null && _c !== void 0 ? _c : (options.machine = 0);
    const walkableGrid = GWU.grid.alloc(site.width, site.height);
    let disrupts = false;
    // Get all walkable locations after lake added
    GWU.xy.forRect(site.width, site.height, (i, j) => {
        const lakeX = i + options.offsetX;
        const lakeY = j + options.offsetY;
        if (blockingGrid.get(lakeX, lakeY)) {
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

var index$1 = {
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
    GridSite: GridSite,
    MapSite: MapSite,
    directionOfDoorSite: directionOfDoorSite,
    chooseRandomDoorSites: chooseRandomDoorSites,
    copySite: copySite,
    fillCostGrid: fillCostGrid,
    siteDisruptedBy: siteDisruptedBy,
    siteDisruptedSize: siteDisruptedSize,
    computeDistanceMap: computeDistanceMap,
    clearInteriorFlag: clearInteriorFlag
};

class Hall {
    constructor(loc, dir, length, width = 1) {
        this.width = 1;
        this.doors = [];
        this.x = loc[0];
        this.y = loc[1];
        const d = GWU.xy.DIRS[dir];
        this.length = length;
        this.width = width;
        // console.log('Hall', loc, d, length, width);
        if (dir === GWU.xy.UP || dir === GWU.xy.DOWN) {
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
            this.randomRoom = GWU.random.item.bind(GWU.random, choices);
        }
        else if (typeof choices == 'object') {
            this.randomRoom = GWU.random.weighted.bind(GWU.random, choices);
        }
        else {
            throw new Error('Expected choices to be either array of room ids or weighted map - ex: { ROOM_ID: weight }');
        }
    }
    carve(site) {
        let id = this.randomRoom();
        const room = rooms[id];
        if (!room) {
            GWU.utils.ERROR('Missing room digger choice: ' + id);
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
        const width = this.options.width.value();
        const height = this.options.height.value();
        const tile = this.options.tile || FLOOR;
        const blobGrid = GWU.grid.alloc(site.width, site.height, 0);
        const minWidth = Math.floor(0.5 * width); // 6
        const maxWidth = width;
        const minHeight = Math.floor(0.5 * height); // 4
        const maxHeight = height;
        const blob = new GWU.blob.Blob({
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
        const width = this.options.width.value();
        const height = this.options.height.value();
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
        const width = this.options.width.value();
        const height = this.options.height.value();
        const tile = this.options.tile || FLOOR;
        const roomWidth = width;
        const roomWidth2 = Math.max(3, Math.floor((width * GWU.random.range(25, 75)) / 100)); // [4,20]
        const roomHeight = Math.max(3, Math.floor((height * GWU.random.range(25, 75)) / 100)); // [2,5]
        const roomHeight2 = height;
        const roomX = Math.floor((site.width - roomWidth) / 2);
        const roomX2 = roomX +
            GWU.random.range(2, Math.max(2, roomWidth - roomWidth2 - 2));
        const roomY2 = Math.floor((site.height - roomHeight2) / 2);
        const roomY = roomY2 +
            GWU.random.range(2, Math.max(2, roomHeight2 - roomHeight - 2));
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
        const width = this.options.width.value();
        const height = this.options.height.value();
        const tile = this.options.tile || FLOOR;
        let minorWidth = Math.max(3, Math.floor((width * GWU.random.range(25, 50)) / 100)); // [2,4]
        // if (height % 2 == 0 && minorWidth > 2) {
        //     minorWidth -= 1;
        // }
        let minorHeight = Math.max(3, Math.floor((height * GWU.random.range(25, 50)) / 100)); // [2,3]?
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
        const width = this.options.width.value();
        const height = this.options.height.value();
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
        const radius = this.options.radius.value();
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
        const radius = this.options.radius.value();
        const ringMinWidth = this.options.ringMinWidth.value();
        const holeMinSize = this.options.holeMinSize.value();
        const tile = this.options.tile || FLOOR;
        const x = Math.floor(site.width / 2);
        const y = Math.floor(site.height / 2);
        GWU.xy.forCircle(x, y, radius, (x, y) => site.setTile(x, y, tile));
        if (radius > ringMinWidth + holeMinSize &&
            GWU.random.chance(this.options.holeChance.value())) {
            GWU.xy.forCircle(x, y, GWU.random.range(holeMinSize, radius - holeMinSize), (x, y) => site.setTile(x, y, 0));
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
        let chunkCount = this.options.count.value();
        const width = this.options.width.value();
        const height = this.options.height.value();
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
            x = GWU.random.range(minX, maxX);
            y = GWU.random.range(minY, maxY);
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
    install: install$2
};

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
function pickWidth(opts = {}) {
    return GWU.utils.clamp(_pickWidth(opts), 1, 3);
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
        width = GWU.random.weighted(width) + 1;
    }
    else if (typeof width === 'string') {
        width = GWU.range.make(width).value();
    }
    else {
        width = Number.parseInt(GWU.random.weighted(width));
    }
    return width;
}
function pickLength(dir, lengths) {
    if (dir == GWU.xy.UP || dir == GWU.xy.DOWN) {
        return lengths[1].value();
    }
    else {
        return lengths[0].value();
    }
}
function pickHallDirection(site, doors, lengths) {
    // Pick a direction.
    let dir = GWU.xy.NO_DIRECTION;
    if (dir == GWU.xy.NO_DIRECTION) {
        const dirs = GWU.random.sequence(4);
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
    const allowObliqueHallwayExit = GWU.random.chance(obliqueChance);
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
            width: GWU.range.make(1),
            length: [GWU.range.make('2-15'), GWU.range.make('2-9')],
            tile: FLOOR,
            obliqueChance: 15,
            chance: 100,
        };
        this._setOptions(options);
    }
    _setOptions(options = {}) {
        if (options.width) {
            this.config.width = GWU.range.make(options.width);
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
        if (!GWU.random.chance(this.config.chance))
            return null;
        const dir = pickHallDirection(site, doors, this.config.length);
        if (dir === GWU.xy.NO_DIRECTION)
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
        const DIR = DIRS[dir];
        const [x, y] = this._digLine(site, door, DIR, length);
        const hall = new Hall(door, dir, length);
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
        const hasWreath = GWU.random.chance(this.options.wreathChance)
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
                x = GWU.random.range(1 - bounds.x, lakeGrid.width - bounds.width - bounds.x - 2);
                y = GWU.random.range(1 - bounds.y, lakeGrid.height - bounds.height - bounds.y - 2);
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
        const seq = GWU.random.sequence(site.width * site.height);
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
        let upLoc = null;
        let downLoc = null;
        const isValidLoc = this.isStairXY.bind(this, site);
        if (this.options.start && typeof this.options.start !== 'string') {
            let start = this.options.start;
            if (start === true) {
                start = GWU.random.matchingLoc(site.width, site.height, isValidLoc);
            }
            else {
                start = GWU.random.matchingLocNear(GWU.xy.x(start), GWU.xy.y(start), isValidLoc);
            }
            locations.start = start;
        }
        if (Array.isArray(this.options.up) &&
            Array.isArray(this.options.down)) {
            const up = this.options.up;
            upLoc = GWU.random.matchingLocNear(GWU.xy.x(up), GWU.xy.y(up), isValidLoc);
            const down = this.options.down;
            downLoc = GWU.random.matchingLocNear(GWU.xy.x(down), GWU.xy.y(down), isValidLoc);
        }
        else if (Array.isArray(this.options.up) &&
            !Array.isArray(this.options.down)) {
            const up = this.options.up;
            upLoc = GWU.random.matchingLocNear(GWU.xy.x(up), GWU.xy.y(up), isValidLoc);
            if (needDown) {
                downLoc = GWU.random.matchingLoc(site.width, site.height, (x, y) => {
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
            downLoc = GWU.random.matchingLocNear(GWU.xy.x(down), GWU.xy.y(down), isValidLoc);
            if (needUp) {
                upLoc = GWU.random.matchingLoc(site.width, site.height, (x, y) => {
                    if (GWU.xy.distanceBetween(x, y, downLoc[0], downLoc[1]) < minDistance)
                        return false;
                    return isValidLoc(x, y);
                });
            }
        }
        else if (needUp) {
            upLoc = GWU.random.matchingLoc(site.width, site.height, isValidLoc);
            if (needDown) {
                downLoc = GWU.random.matchingLoc(site.width, site.height, (x, y) => {
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
            downLoc = GWU.random.matchingLoc(site.width, site.height, isValidLoc);
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
        const indexes = GWU.random.sequence(4);
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
            GWU.utils.ERROR('No stair direction found!');
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

var stairs = {
    __proto__: null,
    Stairs: Stairs
};

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
        const seq = GWU.random.sequence(site.width * site.height);
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
                            const tile = GWU.random.chance(this.options.doorChance)
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

var loop = {
    __proto__: null,
    LoopDigger: LoopDigger,
    digLoops: digLoops
};

class Level {
    constructor(options = {}) {
        var _a, _b;
        this.seed = 0;
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
    }
    _makeSite(width, height) {
        return new GridSite(width, height);
    }
    create(...args) {
        if (args.length == 1 && args[0] instanceof GWM.map.Map) {
            const map = args[0];
            this.site = new MapSite(map);
        }
        if (args.length > 1) {
            const width = args[0];
            const height = args[1];
            this.site = new GridSite(width, height);
        }
        const result = this._create(this.site);
        if (args.length > 1) {
            const width = args[0];
            const height = args[1];
            const cb = args[2];
            GWU.xy.forRect(width, height, (x, y) => {
                const t = this.site.getTileIndex(x, y);
                if (t)
                    cb(x, y, t);
            });
        }
        this.site.free();
        return result;
    }
    _create(site) {
        if (this.startLoc[0] < 0 && this.startLoc[0] < 0) {
            this.startLoc[0] = Math.floor(site.width / 2);
            this.startLoc[1] = site.height - 2;
        }
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
        if (this.loops)
            this.addLoops(site, this.loops);
        if (this.lakes)
            this.addLakes(site, this.lakes);
        if (this.bridges)
            this.addBridges(site, this.bridges);
        if (this.stairs)
            this.addStairs(site, this.stairs);
        this.finish(site);
        return true;
    }
    start(site) {
        if (this.seed) {
            GWU.random.seed(this.seed);
        }
        site.clear();
        this.seq = GWU.random.sequence(site.width * site.height);
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
        const roomSite = this._makeSite(site.width, site.height);
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
        const roomSite = this._makeSite(site.width, site.height);
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
            const x = Math.floor(this.seq[i] / site.height);
            const y = this.seq[i] % site.height;
            if (!site.isNothing(x, y))
                continue;
            const dir = directionOfDoorSite(site, x, y);
            if (dir != GWU.xy.NO_DIRECTION) {
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
        const dirs = GWU.random.sequence(4);
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
                //     if (x0 == x && y0 == y) return [-1, -1] as GWU.xy.Loc;
                //     return [x0, y0] as GWU.xy.Loc;
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
        let isDoor = false;
        if (opts.chance && GWU.random.chance(opts.chance)) {
            isDoor = true;
        }
        const tile = isDoor ? opts.tile || DOOR : FLOOR;
        map.setTile(x, y, tile); // Door site.
        // most cases...
        if (!room.hall || !(room.hall.width > 1) || room.hall.dir !== dir) {
            return;
        }
        if (dir === GWU.xy.UP || dir === GWU.xy.DOWN) {
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
                            if (GWU.random.chance(50)) {
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
            GWU.random.seed(this.config.seed);
        }
        this.initSeeds();
        this.initStairLocs();
    }
    get levels() {
        return this.config.levels;
    }
    initSeeds() {
        for (let i = 0; i < this.config.levels; ++i) {
            this.seeds[i] = GWU.random.number(2 ** 32);
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
            const endLoc = GWU.random.matchingLoc(this.config.width, this.config.height, (x, y) => {
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
        GWU.random.seed(this.seeds[id]);
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
        const level = new Level(opts);
        const result = level.create(this.config.width, this.config.height, cb);
        if (!GWU.xy.equalsXY(level.endLoc, opts.endLoc) ||
            !GWU.xy.equalsXY(level.startLoc, opts.startLoc)) {
            this.stairLocs[id] = [level.startLoc, level.endLoc];
        }
        return result;
    }
}

const Fl$1 = GWU.flag.fl;
var Flags;
(function (Flags) {
    Flags[Flags["BP_ROOM"] = Fl$1(0)] = "BP_ROOM";
    Flags[Flags["BP_VESTIBULE"] = Fl$1(1)] = "BP_VESTIBULE";
    Flags[Flags["BP_REWARD"] = Fl$1(2)] = "BP_REWARD";
    Flags[Flags["BP_ADOPT_ITEM"] = Fl$1(3)] = "BP_ADOPT_ITEM";
    Flags[Flags["BP_PURGE_PATHING_BLOCKERS"] = Fl$1(4)] = "BP_PURGE_PATHING_BLOCKERS";
    Flags[Flags["BP_PURGE_INTERIOR"] = Fl$1(5)] = "BP_PURGE_INTERIOR";
    Flags[Flags["BP_PURGE_LIQUIDS"] = Fl$1(6)] = "BP_PURGE_LIQUIDS";
    Flags[Flags["BP_SURROUND_WITH_WALLS"] = Fl$1(7)] = "BP_SURROUND_WITH_WALLS";
    Flags[Flags["BP_IMPREGNABLE"] = Fl$1(8)] = "BP_IMPREGNABLE";
    Flags[Flags["BP_OPEN_INTERIOR"] = Fl$1(9)] = "BP_OPEN_INTERIOR";
    Flags[Flags["BP_MAXIMIZE_INTERIOR"] = Fl$1(10)] = "BP_MAXIMIZE_INTERIOR";
    Flags[Flags["BP_REDESIGN_INTERIOR"] = Fl$1(11)] = "BP_REDESIGN_INTERIOR";
    Flags[Flags["BP_TREAT_AS_BLOCKING"] = Fl$1(12)] = "BP_TREAT_AS_BLOCKING";
    Flags[Flags["BP_REQUIRE_BLOCKING"] = Fl$1(13)] = "BP_REQUIRE_BLOCKING";
    Flags[Flags["BP_NO_INTERIOR_FLAG"] = Fl$1(14)] = "BP_NO_INTERIOR_FLAG";
    Flags[Flags["BP_NOT_IN_HALLWAY"] = Fl$1(15)] = "BP_NOT_IN_HALLWAY";
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
            if (this.size.lo > this.size.hi)
                throw new Error('Blueprint size must be small to large.');
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
        if (this.flags & Flags.BP_ADOPT_ITEM) {
            if (!this.steps.some((s) => s.flags & StepFlags.BF_ADOPT_ITEM)) {
                throw new Error('Blueprint wants to BP_ADOPT_ITEM, but has no steps with BF_ADOPT_ITEM.');
            }
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
    qualifies(requiredFlags, depth) {
        if (this.frequency(depth) <= 0 ||
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
    pickLocation(site) {
        return pickLocation(site, this);
    }
    // Assume site has been analyzed (aka GateSites and ChokeCounts set)
    computeInterior(builder) {
        return computeInterior(builder, this);
    }
    prepareInterior(builder) {
        return prepareInterior(builder, this);
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
                let randIndex = GWU.random.range(1, totalFreq);
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
}
function pickLocation(site, blueprint) {
    // Find a location and map out the machine interior.
    if (blueprint.isRoom) {
        // If it's a room machine, count up the gates of appropriate
        // choke size and remember where they are. The origin of the room will be the gate location.
        const randSite = GWU.random.matchingLoc(site.width, site.height, (x, y) => {
            return (site.hasCellFlag(x, y, GWM.flags.Cell.IS_GATE_SITE) &&
                blueprint.size.contains(site.getChokeCount(x, y)));
        });
        if (!randSite || randSite[0] < 0 || randSite[1] < 0) {
            // If no suitable sites, abort.
            console.log('Failed to build a machine; there was no eligible door candidate for the chosen room machine from blueprint.');
            return false;
        }
        return randSite;
    }
    else if (blueprint.isVestiblue) {
        //  Door machines must have locations passed in. We can't pick one ourselves.
        console.log('ERROR: Attempted to build a vestiblue without a location being provided.');
        return false;
    }
    // Pick a random origin location.
    const pos = GWU.random.matchingLoc(site.width, site.height, (x, y) => {
        if (!site.isPassable(x, y))
            return false;
        if (blueprint.flags & Flags.BP_NOT_IN_HALLWAY) {
            const count = GWU.xy.arcCount(x, y, (i, j) => site.isPassable(i, j));
            return count <= 1;
        }
        return true;
    });
    if (!pos || pos[0] < 0 || pos[1] < 0)
        return false;
    return pos;
}
// Assume site has been analyzed (aka GateSites and ChokeCounts set)
function computeInterior(builder, blueprint) {
    let failsafe = blueprint.isRoom ? 10 : 20;
    let tryAgain;
    const interior = builder.interior;
    const site = builder.site;
    do {
        tryAgain = false;
        if (--failsafe <= 0) {
            // console.log(
            //     `Failed to build blueprint ${blueprint.id}; failed repeatedly to find a suitable blueprint location.`
            // );
            return false;
        }
        interior.fill(0);
        // Find a location and map out the machine interior.
        if (blueprint.isRoom) {
            // If it's a room machine, count up the gates of appropriate
            // choke size and remember where they are. The origin of the room will be the gate location.
            // Now map out the interior into interior[][].
            // Start at the gate location and do a depth-first floodfill to grab all adjoining tiles with the
            // same or lower choke value, ignoring any tiles that are already part of a machine.
            // If we get false from this, try again. If we've tried too many times already, abort.
            tryAgain = !addTileToInteriorAndIterate(builder, builder.originX, builder.originY);
        }
        else if (blueprint.isVestiblue) {
            if (!computeVestibuleInterior(builder, blueprint)) {
                // TODO - tryagain = true?
                console.log(`ERROR: Attempted to build vestibule ${blueprint.id}: not enough room.`);
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
            let distanceMap = GWU.grid.alloc(interior.width, interior.height);
            computeDistanceMap(site, distanceMap, builder.originX, builder.originY, blueprint.size.hi);
            const seq = GWU.random.sequence(site.width * site.height);
            let qualifyingTileCount = 0; // Keeps track of how many interior cells we've added.
            let goalSize = blueprint.size.value(); // Keeps track of the goal size.
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
                            tryAgain = true;
                            qualifyingTileCount = goalSize; // This is a hack to drop out of these three for-loops.
                        }
                    }
                }
            }
            // Now make sure the interior map satisfies the machine's qualifications.
            if (qualifyingTileCount < goalSize) {
                tryAgain = true;
                console.debug('- too small');
            }
            else if (blueprint.treatAsBlocking &&
                siteDisruptedBy(site, interior, {
                    machine: site.machineCount,
                })) {
                console.debug(' - disconnected');
                tryAgain = true;
            }
            else if (blueprint.requireBlocking &&
                siteDisruptedSize(site, interior) < 100) {
                console.debug(' - not disconnected enough');
                tryAgain = true; // BP_REQUIRE_BLOCKING needs some work to make sure the disconnect is interesting.
            }
            // If locationFailsafe runs out, tryAgain will still be true, and we'll try a different machine.
            // If we're not choosing the blueprint, then don't bother with the locationFailsafe; just use the higher-level failsafe.
            GWU.grid.free(distanceMap);
        }
        // Now loop if necessary.
    } while (tryAgain);
    // console.log(tryAgain, failsafe);
    return true;
}
function computeVestibuleInterior(builder, blueprint) {
    let success = true;
    const site = builder.site;
    const interior = builder.interior;
    interior.fill(0);
    // console.log('DISTANCE MAP', originX, originY);
    // RUT.Grid.dump(distMap);
    const doorChokeCount = site.getChokeCount(builder.originX, builder.originY);
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
            return true;
    }
    let qualifyingTileCount = 0; // Keeps track of how many interior cells we've added.
    const wantSize = blueprint.size.value(); // Keeps track of the goal size.
    const distMap = GWU.grid.alloc(site.width, site.height);
    computeDistanceMap(site, distMap, builder.originX, builder.originY, blueprint.size.hi);
    const cells = GWU.random.sequence(site.width * site.height);
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
    // Now make sure the interior map satisfies the machine's qualifications.
    if (blueprint.treatAsBlocking &&
        siteDisruptedBy(site, interior, { machine: site.machineCount })) {
        success = false;
        console.debug('- blocks');
    }
    else if (blueprint.requireBlocking &&
        siteDisruptedSize(site, interior) < 100) {
        success = false;
        console.debug('- does not block');
    }
    GWU.grid.free(distMap);
    return success;
}
// Assumes (startX, startY) is in the machine.
// Returns true if everything went well, and false if we ran into a machine component
// that was already there, as we don't want to build a machine around it.
function addTileToInteriorAndIterate(builder, startX, startY) {
    let goodSoFar = true;
    const interior = builder.interior;
    const site = builder.site;
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
            return false;
        }
        if (site.getChokeCount(newX, newY) <= startChokeCount && // don't have to worry about walls since they're all 30000
            !site.hasCellFlag(newX, newY, GWM.flags.Cell.IS_IN_MACHINE)) {
            goodSoFar = addTileToInteriorAndIterate(builder, newX, newY);
        }
    }
    return goodSoFar;
}
function prepareInterior(builder, blueprint) {
    const interior = builder.interior;
    const site = builder.site;
    // If requested, clear and expand the room as far as possible until either it's convex or it bumps into surrounding rooms
    if (blueprint.maximizeInterior) {
        expandMachineInterior(builder, 1);
    }
    else if (blueprint.openInterior) {
        expandMachineInterior(builder, 4);
    }
    // If requested, cleanse the interior -- no interesting terrain allowed.
    if (blueprint.purgeInterior) {
        interior.forEach((v, x, y) => {
            if (v)
                site.setTile(x, y, FLOOR);
        });
    }
    // If requested, purge pathing blockers -- no traps allowed.
    if (blueprint.purgeBlockers) {
        interior.forEach((v, x, y) => {
            if (!v)
                return;
            if (site.blocksPathing(x, y)) {
                site.setTile(x, y, FLOOR);
            }
        });
    }
    // If requested, purge the liquid layer in the interior -- no liquids allowed.
    if (blueprint.purgeLiquids) {
        interior.forEach((v, x, y) => {
            if (v && site.isAnyLiquid(x, y)) {
                site.setTile(x, y, FLOOR);
            }
        });
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
                if (!site.blocksPathing(i, j))
                    return; // is not a blocker for the player (water?)
                site.setTile(i, j, WALL);
            }, false);
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
        if (!(blueprint.flags & Flags.BP_NO_INTERIOR_FLAG)) {
            site.setMachine(x, y, machineNumber, blueprint.isRoom);
        }
        // secret doors mess up machines
        // TODO - is this still true?
        if (site.isSecretDoor(x, y)) {
            site.setTile(x, y, DOOR);
        }
    });
}
function expandMachineInterior(builder, minimumInteriorNeighbors = 1) {
    let madeChange;
    const interior = builder.interior;
    const site = builder.site;
    do {
        madeChange = false;
        interior.forEach((_v, x, y) => {
            // if (v && site.isDoor(x, y)) {
            //     site.setTile(x, y, SITE.FLOOR); // clean out the doors...
            //     return;
            // }
            if (site.hasCellFlag(x, y, GWM.flags.Cell.IS_IN_MACHINE))
                return;
            if (!site.blocksPathing(x, y))
                return;
            let nbcount = 0;
            GWU.xy.eachNeighbor(x, y, (i, j) => {
                if (!interior.hasXY(i, j))
                    return; // Not in map
                if (interior[i][j] && !site.blocksPathing(i, j)) {
                    ++nbcount; // in machine and open tile
                }
            }, false);
            if (nbcount < minimumInteriorNeighbors)
                return;
            nbcount = 0;
            GWU.xy.eachNeighbor(x, y, (i, j) => {
                if (!interior.hasXY(i, j))
                    return; // not on map
                if (interior[i][j])
                    return; // already part of machine
                if (!site.isWall(i, j) ||
                    site.hasCellFlag(i, j, GWM.flags.Cell.IS_IN_MACHINE)) {
                    ++nbcount; // tile is not a wall or is in a machine
                }
            }, false);
            if (nbcount)
                return;
            // Eliminate this obstruction; welcome its location into the machine.
            madeChange = true;
            interior[x][y] = 1;
            if (site.blocksPathing(x, y)) {
                site.setTile(x, y, FLOOR);
            }
            GWU.xy.eachNeighbor(x, y, (i, j) => {
                if (!interior.hasXY(i, j))
                    return;
                if (site.isSet(i, j))
                    return;
                site.setTile(i, j, WALL);
            });
        });
    } while (madeChange);
}
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
function random(requiredFlags, depth) {
    const matches = Object.values(blueprints).filter((b) => b.qualifies(requiredFlags, depth));
    return GWU.random.item(matches);
}

const Fl = GWU.flag.fl;
var StepFlags;
(function (StepFlags) {
    StepFlags[StepFlags["BF_OUTSOURCE_ITEM_TO_MACHINE"] = Fl(1)] = "BF_OUTSOURCE_ITEM_TO_MACHINE";
    StepFlags[StepFlags["BF_BUILD_VESTIBULE"] = Fl(2)] = "BF_BUILD_VESTIBULE";
    StepFlags[StepFlags["BF_ADOPT_ITEM"] = Fl(3)] = "BF_ADOPT_ITEM";
    StepFlags[StepFlags["BF_BUILD_AT_ORIGIN"] = Fl(4)] = "BF_BUILD_AT_ORIGIN";
    StepFlags[StepFlags["BF_PERMIT_BLOCKING"] = Fl(5)] = "BF_PERMIT_BLOCKING";
    StepFlags[StepFlags["BF_TREAT_AS_BLOCKING"] = Fl(6)] = "BF_TREAT_AS_BLOCKING";
    StepFlags[StepFlags["BF_NEAR_ORIGIN"] = Fl(7)] = "BF_NEAR_ORIGIN";
    StepFlags[StepFlags["BF_FAR_FROM_ORIGIN"] = Fl(8)] = "BF_FAR_FROM_ORIGIN";
    StepFlags[StepFlags["BF_IN_VIEW_OF_ORIGIN"] = Fl(9)] = "BF_IN_VIEW_OF_ORIGIN";
    StepFlags[StepFlags["BF_IN_PASSABLE_VIEW_OF_ORIGIN"] = Fl(10)] = "BF_IN_PASSABLE_VIEW_OF_ORIGIN";
    StepFlags[StepFlags["BF_MONSTER_TAKE_ITEM"] = Fl(11)] = "BF_MONSTER_TAKE_ITEM";
    StepFlags[StepFlags["BF_MONSTER_SLEEPING"] = Fl(12)] = "BF_MONSTER_SLEEPING";
    StepFlags[StepFlags["BF_MONSTER_FLEEING"] = Fl(13)] = "BF_MONSTER_FLEEING";
    StepFlags[StepFlags["BF_MONSTERS_DORMANT"] = Fl(14)] = "BF_MONSTERS_DORMANT";
    StepFlags[StepFlags["BF_ITEM_IS_KEY"] = Fl(15)] = "BF_ITEM_IS_KEY";
    StepFlags[StepFlags["BF_ITEM_IDENTIFIED"] = Fl(16)] = "BF_ITEM_IDENTIFIED";
    StepFlags[StepFlags["BF_ITEM_PLAYER_AVOIDS"] = Fl(17)] = "BF_ITEM_PLAYER_AVOIDS";
    StepFlags[StepFlags["BF_EVERYWHERE"] = Fl(18)] = "BF_EVERYWHERE";
    StepFlags[StepFlags["BF_ALTERNATIVE"] = Fl(19)] = "BF_ALTERNATIVE";
    StepFlags[StepFlags["BF_ALTERNATIVE_2"] = Fl(20)] = "BF_ALTERNATIVE_2";
    StepFlags[StepFlags["BF_BUILD_IN_WALLS"] = Fl(21)] = "BF_BUILD_IN_WALLS";
    StepFlags[StepFlags["BF_BUILD_ANYWHERE_ON_LEVEL"] = Fl(22)] = "BF_BUILD_ANYWHERE_ON_LEVEL";
    StepFlags[StepFlags["BF_REPEAT_UNTIL_NO_PROGRESS"] = Fl(23)] = "BF_REPEAT_UNTIL_NO_PROGRESS";
    StepFlags[StepFlags["BF_IMPREGNABLE"] = Fl(24)] = "BF_IMPREGNABLE";
    // TODO - BF_ALLOW_IN_HALLWAY instead?
    StepFlags[StepFlags["BF_NOT_IN_HALLWAY"] = Fl(27)] = "BF_NOT_IN_HALLWAY";
    // TODO - BF_ALLOW_BOUNDARY instead
    StepFlags[StepFlags["BF_NOT_ON_LEVEL_PERIMETER"] = Fl(28)] = "BF_NOT_ON_LEVEL_PERIMETER";
    StepFlags[StepFlags["BF_SKELETON_KEY"] = Fl(29)] = "BF_SKELETON_KEY";
    StepFlags[StepFlags["BF_KEY_DISPOSABLE"] = Fl(30)] = "BF_KEY_DISPOSABLE";
})(StepFlags || (StepFlags = {}));
class BuildStep {
    constructor(cfg = {}) {
        var _a;
        this.tile = -1;
        this.flags = 0;
        this.pad = 0;
        this.item = null;
        this.horde = null;
        this.effect = null;
        this.chance = 0;
        this.id = 'n/a';
        this.tile = (_a = cfg.tile) !== null && _a !== void 0 ? _a : -1;
        if (cfg.flags) {
            this.flags = GWU.flag.from(StepFlags, cfg.flags);
        }
        if (cfg.pad) {
            this.pad = cfg.pad;
        }
        this.count = GWU.range.make(cfg.count || 1);
        this.item = cfg.item || null;
        this.horde = cfg.horde || null;
        if (cfg.effect) {
            this.effect = GWM.effect.from(cfg.effect);
        }
        if (this.item && this.flags & StepFlags.BF_ADOPT_ITEM) {
            throw new Error('Cannot have blueprint step with item and BF_ADOPT_ITEM.');
        }
    }
    get repeatUntilNoProgress() {
        return !!(this.flags & StepFlags.BF_REPEAT_UNTIL_NO_PROGRESS);
    }
    get generateEverywhere() {
        return !!(this.flags &
            StepFlags.BF_EVERYWHERE &
            ~StepFlags.BF_BUILD_AT_ORIGIN);
    }
    get buildAtOrigin() {
        return !!(this.flags & StepFlags.BF_BUILD_AT_ORIGIN);
    }
    cellIsCandidate(builder, blueprint, x, y, distanceBound) {
        return cellIsCandidate(builder, blueprint, this, x, y, distanceBound);
    }
    distanceBound(builder) {
        return calcDistanceBound(builder, this);
    }
    updateViewMap(builder) {
        updateViewMap(builder, this);
    }
    build(builder, blueprint, adoptedItem) {
        return buildStep(builder, blueprint, this, adoptedItem);
    }
}
function updateViewMap(builder, buildStep) {
    if (buildStep.flags &
        (StepFlags.BF_IN_VIEW_OF_ORIGIN |
            StepFlags.BF_IN_PASSABLE_VIEW_OF_ORIGIN)) {
        const site = builder.site;
        if (buildStep.flags & StepFlags.BF_IN_PASSABLE_VIEW_OF_ORIGIN) {
            const fov = new GWU.fov.FOV({
                isBlocked: (x, y) => {
                    return site.blocksPathing(x, y);
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
                // TileFlags.T_OBSTRUCTS_PASSABILITY |
                //     TileFlags.T_OBSTRUCTS_VISION,
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
        builder.viewMap[builder.originX][builder.originY] = 1;
    }
}
function calcDistanceBound(builder, buildStep) {
    const distanceBound = [0, 10000];
    if (buildStep.flags & StepFlags.BF_NEAR_ORIGIN) {
        distanceBound[1] = builder.distance25;
    }
    if (buildStep.flags & StepFlags.BF_FAR_FROM_ORIGIN) {
        distanceBound[0] = builder.distance75;
    }
    return distanceBound;
}
function markCandidates(candidates, builder, blueprint, buildStep, distanceBound) {
    let count = 0;
    candidates.update((_v, i, j) => {
        if (cellIsCandidate(builder, blueprint, buildStep, i, j, distanceBound)) {
            count++;
            return 1;
        }
        else {
            return 0;
        }
    });
    return count;
}
function cellIsCandidate(builder, blueprint, buildStep, x, y, distanceBound) {
    const site = builder.site;
    // No building in the hallway if it's prohibited.
    // This check comes before the origin check, so an area machine will fail altogether
    // if its origin is in a hallway and the feature that must be built there does not permit as much.
    if (buildStep.flags & StepFlags.BF_NOT_IN_HALLWAY &&
        GWU.xy.arcCount(x, y, (i, j) => site.hasXY(i, j) && site.isPassable(i, j)) > 1) {
        return false;
    }
    // No building along the perimeter of the level if it's prohibited.
    if (buildStep.flags & StepFlags.BF_NOT_ON_LEVEL_PERIMETER &&
        (x == 0 || x == site.width - 1 || y == 0 || y == site.height - 1)) {
        return false;
    }
    // The origin is a candidate if the feature is flagged to be built at the origin.
    // If it's a room, the origin (i.e. doorway) is otherwise NOT a candidate.
    if (buildStep.flags & StepFlags.BF_BUILD_AT_ORIGIN) {
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
    if (buildStep.flags &
        (StepFlags.BF_IN_VIEW_OF_ORIGIN |
            StepFlags.BF_IN_PASSABLE_VIEW_OF_ORIGIN) &&
        !builder.viewMap[x][y]) {
        return false;
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
    if (distance > distanceBound[1] || // distance exceeds max
        distance < distanceBound[0]) {
        // distance falls short of min
        return false;
    }
    if (buildStep.flags & StepFlags.BF_BUILD_IN_WALLS) {
        // If we're supposed to build in a wall...
        const cellMachine = site.getMachine(x, y);
        if (!builder.interior[x][y] &&
            (!cellMachine || cellMachine == builder.machineNumber) &&
            site.isWall(x, y)) {
            let ok = false;
            // ...and this location is a wall that's not already machined...
            GWU.xy.eachNeighbor(x, y, (newX, newY) => {
                if (site.hasXY(newX, newY) && // ...and it's next to an interior spot or permitted elsewhere and next to passable spot...
                    ((builder.interior[newX][newY] &&
                        !(newX == builder.originX && newY == builder.originY)) ||
                        (buildStep.flags &
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
    else if (buildStep.flags & StepFlags.BF_BUILD_ANYWHERE_ON_LEVEL) {
        if ((buildStep.item && site.blocksItems(x, y)) ||
            site.hasCellFlag(x, y, GWM.flags.Cell.IS_CHOKEPOINT |
                GWM.flags.Cell.IS_IN_LOOP |
                GWM.flags.Cell.IS_IN_MACHINE)) {
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
function makePersonalSpace(builder, x, y, candidates, personalSpace) {
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
function buildStep(builder, blueprint, buildStep, adoptedItem) {
    let wantCount = 0;
    let builtCount = 0;
    const site = builder.site;
    const candidates = GWU.grid.alloc(site.width, site.height);
    // Figure out the distance bounds.
    const distanceBound = calcDistanceBound(builder, buildStep);
    buildStep.updateViewMap(builder);
    // If the StepFlags.BF_REPEAT_UNTIL_NO_PROGRESS flag is set, repeat until we fail to build the required number of instances.
    // Make a master map of candidate locations for this feature.
    let qualifyingTileCount = markCandidates(candidates, builder, blueprint, buildStep, distanceBound);
    if (!buildStep.generateEverywhere) {
        wantCount = buildStep.count.value();
    }
    if (!qualifyingTileCount || qualifyingTileCount < buildStep.count.lo) {
        console.log(' - Only %s qualifying tiles - want at least %s.', qualifyingTileCount, buildStep.count.lo);
        return false;
    }
    let x = 0, y = 0;
    let success = true;
    let didSomething = false;
    do {
        success = true;
        // Find a location for the feature.
        if (buildStep.buildAtOrigin) {
            // Does the feature want to be at the origin? If so, put it there. (Just an optimization.)
            x = builder.originX;
            y = builder.originY;
        }
        else {
            // Pick our candidate location randomly, and also strike it from
            // the candidates map so that subsequent instances of this same feature can't choose it.
            [x, y] = GWU.random.matchingLoc(candidates.width, candidates.height, (x, y) => candidates[x][y] > 0);
        }
        // Don't waste time trying the same place again whether or not this attempt succeeds.
        candidates[x][y] = 0;
        qualifyingTileCount--;
        // Try to build the DF first, if any, since we don't want it to be disrupted by subsequently placed terrain.
        if (buildStep.effect) {
            success = site.fireEffect(buildStep.effect, x, y);
            didSomething = success;
        }
        // Now try to place the terrain tile, if any.
        if (success && buildStep.tile !== -1) {
            const tile = GWM.tile.get(buildStep.tile);
            if (!(buildStep.flags & StepFlags.BF_PERMIT_BLOCKING) &&
                (tile.blocksMove() ||
                    buildStep.flags & StepFlags.BF_TREAT_AS_BLOCKING)) {
                // Yes, check for blocking.
                const blockingMap = GWU.grid.alloc(site.width, site.height);
                blockingMap[x][y] = 1;
                success = !siteDisruptedBy(site, blockingMap, {
                    machine: site.machineCount,
                });
                GWU.grid.free(blockingMap);
            }
            if (success) {
                success = site.setTile(x, y, tile);
                didSomething = didSomething || success;
            }
        }
        // Generate an actor, if necessary
        // Generate an item, if necessary
        if (success && buildStep.item) {
            const item = site.makeRandomItem(buildStep.item);
            if (!item) {
                success = false;
            }
            if (buildStep.flags & StepFlags.BF_ITEM_IS_KEY) {
                item.key = GWM.entity.makeKeyInfo(x, y, !!(buildStep.flags & StepFlags.BF_KEY_DISPOSABLE));
            }
            if (buildStep.flags & StepFlags.BF_OUTSOURCE_ITEM_TO_MACHINE) {
                success = builder.buildRandom(Flags.BP_ADOPT_ITEM, -1, -1, item);
                if (success) {
                    didSomething = true;
                }
            }
            else {
                success = site.addItem(x, y, item);
                didSomething = didSomething || success;
            }
        }
        else if (success && buildStep.flags & StepFlags.BF_ADOPT_ITEM) {
            // adopt item if necessary
            if (!adoptedItem) {
                throw new Error('Failed to build blueprint because there is no adopted item.');
            }
            if (buildStep.flags & StepFlags.BF_TREAT_AS_BLOCKING) {
                // Yes, check for blocking.
                const blockingMap = GWU.grid.alloc(site.width, site.height);
                blockingMap[x][y] = 1;
                success = !siteDisruptedBy(site, blockingMap);
                GWU.grid.free(blockingMap);
            }
            if (success) {
                success = site.addItem(x, y, adoptedItem);
                if (success) {
                    didSomething = true;
                }
                else {
                    console.log('- failed to add item', x, y);
                }
            }
        }
        if (success && didSomething) {
            // OK, if placement was successful, clear some personal space around the feature so subsequent features can't be generated too close.
            qualifyingTileCount -= makePersonalSpace(builder, x, y, candidates, buildStep.pad);
            builtCount++; // we've placed an instance
            // Mark the feature location as part of the machine, in case it is not already inside of it.
            if (!(blueprint.flags & Flags.BP_NO_INTERIOR_FLAG)) {
                site.setMachine(x, y, builder.machineNumber, blueprint.isRoom);
            }
            // Mark the feature location as impregnable if requested.
            if (buildStep.flags & StepFlags.BF_IMPREGNABLE) {
                site.setCellFlag(x, y, GWM.flags.Cell.IMPREGNABLE);
            }
        }
        // Finished with this instance!
    } while (qualifyingTileCount > 0 &&
        (buildStep.generateEverywhere ||
            builtCount < wantCount ||
            buildStep.flags & StepFlags.BF_REPEAT_UNTIL_NO_PROGRESS));
    if (success && buildStep.flags & StepFlags.BF_BUILD_VESTIBULE) {
        // Generate a door guard machine.
        // Try to create a sub-machine that qualifies.
        success = builder.buildRandom(Flags.BP_VESTIBULE, builder.originX, builder.originY);
        if (!success) {
            // console.log(
            //     `Depth ${builder.depth}: Failed to place blueprint ${blueprint.id} because it requires a vestibule and we couldn't place one.`
            // );
            // failure! abort!
            return false;
        }
        ++builtCount;
    }
    //DEBUG printf("\nFinished feature %i. Here's the candidates map:", feat);
    //DEBUG logBuffer(candidates);
    success = builtCount > 0;
    GWU.grid.free(candidates);
    return success;
}

// export interface BuildData {
//     site: SITE.BuildSite;
//     spawnedItems: any[];
//     spawnedHordes: any[];
//     interior: GWU.grid.NumGrid;
//     occupied: GWU.grid.NumGrid;
//     viewMap: GWU.grid.NumGrid;
//     distanceMap: GWU.grid.NumGrid;
//     originX: number;
//     originY: number;
//     distance25: number;
//     distance75: number;
//     machineNumber: number;
// }
class Builder {
    constructor(map, depth) {
        this.map = map;
        this.spawnedItems = [];
        this.spawnedHordes = [];
        this.originX = -1;
        this.originY = -1;
        this.distance25 = -1;
        this.distance75 = -1;
        this.machineNumber = 0;
        this.depth = 0;
        this.site = new MapSite(map);
        this.interior = GWU.grid.alloc(map.width, map.height);
        this.occupied = GWU.grid.alloc(map.width, map.height);
        this.viewMap = GWU.grid.alloc(map.width, map.height);
        this.distanceMap = GWU.grid.alloc(map.width, map.height);
        this.depth = depth;
    }
    free() {
        GWU.grid.free(this.interior);
        GWU.grid.free(this.occupied);
        GWU.grid.free(this.viewMap);
        GWU.grid.free(this.distanceMap);
    }
    buildRandom(requiredMachineFlags = Flags.BP_ROOM, x = -1, y = -1, adoptedItem = null) {
        let tries = [];
        while (tries.length < 10) {
            const blueprint = random(requiredMachineFlags, this.depth);
            if (!blueprint) {
                return false;
            }
            tries.push(blueprint.id);
            if (this.build(blueprint, x, y, adoptedItem)) {
                return true;
            }
        }
        // console.log(
        //     'Failed to build random blueprint matching flags: ' +
        //         GWU.flag.toString(BLUE.Flags, requiredMachineFlags) +
        //         ' tried : ' +
        //         tries.join(', ')
        // );
        return false;
    }
    build(blueprint, x = -1, y = -1, adoptedItem = null) {
        let tries = 10;
        this.site.analyze();
        if (x >= 0 && y >= 0) {
            return this._build(blueprint, x, y, adoptedItem);
        }
        while (tries--) {
            const loc = blueprint.pickLocation(this.site);
            if (!loc) {
                continue;
            }
            if (this._build(blueprint, loc[0], loc[1], adoptedItem)) {
                return true;
            }
        }
        // console.log('Failed to build blueprint - ' + blueprint.id);
        return false;
    }
    //////////////////////////////////////////
    // Returns true if the machine got built; false if it was aborted.
    // If empty array spawnedItems or spawnedMonsters is given, will pass those back for deletion if necessary.
    _build(blueprint, originX, originY, adoptedItem = null) {
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
        blueprint.prepareInterior(this);
        // Calculate the distance map (so that features that want to be close to or far from the origin can be placed accordingly)
        // and figure out the 33rd and 67th percentiles for features that want to be near or far from the origin.
        this.calcDistances(blueprint.size.hi);
        // Now decide which features will be skipped -- of the features marked MF_ALTERNATIVE, skip all but one, chosen randomly.
        // Then repeat and do the same with respect to MF_ALTERNATIVE_2, to provide up to two independent sets of alternative features per machine.
        const components = blueprint.pickComponents();
        // Zero out occupied[][], and use it to keep track of the personal space around each feature that gets placed.
        // Now tick through the features and build them.
        for (let index = 0; index < components.length; index++) {
            const component = components[index];
            // console.log('BUILD COMPONENT', component);
            if (!component.build(this, blueprint, adoptedItem)) {
                // failure! abort!
                // Restore the map to how it was before we touched it.
                this.site.restore(levelBackup);
                // abortItemsAndMonsters(spawnedItems, spawnedMonsters);
                return false;
            }
        }
        // Clear out the interior flag for all non-wired cells, if requested.
        if (blueprint.noInteriorFlag) {
            clearInteriorFlag(this.site, this.machineNumber);
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

var index = {
    __proto__: null,
    get Flags () { return Flags; },
    Blueprint: Blueprint,
    install: install,
    random: random,
    blueprints: blueprints,
    get StepFlags () { return StepFlags; },
    BuildStep: BuildStep,
    updateViewMap: updateViewMap,
    calcDistanceBound: calcDistanceBound,
    markCandidates: markCandidates,
    cellIsCandidate: cellIsCandidate,
    makePersonalSpace: makePersonalSpace,
    buildStep: buildStep,
    Builder: Builder
};

export { Dungeon, Hall, Level, Room, index as blueprint, bridge, hall, lake, loop, room, index$1 as site, stairs };
