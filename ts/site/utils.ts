import * as GWU from 'gw-utils';
import * as GWM from 'gw-map';
import * as DIG from './digSite';
import * as BUILD from './buildSite';
// import * as TYPES from './types';

const DIRS = GWU.xy.DIRS;

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
export function directionOfDoorSite(
    site: DIG.DigSite,
    x: number,
    y: number
): number {
    let dir, solutionDir;
    let newX, newY, oppX, oppY;

    solutionDir = GWU.xy.NO_DIRECTION;
    for (dir = 0; dir < 4; dir++) {
        newX = x + DIRS[dir][0];
        newY = y + DIRS[dir][1];
        oppX = x - DIRS[dir][0];
        oppY = y - DIRS[dir][1];
        if (
            site.hasXY(oppX, oppY) &&
            site.hasXY(newX, newY) &&
            site.isFloor(oppX, oppY)
        ) {
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

export function chooseRandomDoorSites(site: DIG.DigSite): GWU.xy.Loc[] {
    let i, j, k, newX, newY;
    let dir;
    let doorSiteFailed;

    const DOORS: GWU.xy.Loc[][] = [[], [], [], []];

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
                    for (
                        k = 0;
                        k < 10 && site.hasXY(newX, newY) && !doorSiteFailed;
                        k++
                    ) {
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

    let doorSites: GWU.xy.Loc[] = [];
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

export function copySite(
    dest: DIG.DigSite,
    source: DIG.DigSite,
    offsetX = 0,
    offsetY = 0
) {
    GWU.xy.forRect(dest.width, dest.height, (x, y) => {
        const otherX = x - offsetX;
        const otherY = y - offsetY;
        const v = source.getTileIndex(otherX, otherY);
        if (!v) return;
        dest.setTile(x, y, v);
    });
}

export function fillCostGrid(source: DIG.DigSite, costGrid: GWU.grid.NumGrid) {
    costGrid.update((_v, x, y) =>
        source.isPassable(x, y) ? 1 : GWU.path.OBSTRUCTION
    );
}

export interface DisruptOptions {
    offsetX: number; // blockingGridOffsetX
    offsetY: number; // blockingGridOffsetY
    machine: number;
}

export function siteDisruptedByXY(
    site: DIG.DigSite,
    x: number,
    y: number,
    options: Partial<DisruptOptions> = {}
) {
    options.offsetX ??= 0;
    options.offsetY ??= 0;
    options.machine ??= 0;

    if (
        GWU.xy.arcCount(x, y, (i, j) => {
            return site.isPassable(i, j);
        }) <= 1
    )
        return false;

    const blockingGrid = GWU.grid.alloc(site.width, site.height);
    blockingGrid[x][y] = 1;
    const result = siteDisruptedBy(site, blockingGrid, options);
    GWU.grid.free(blockingGrid);
    return result;
}

export function siteDisruptedBy(
    site: DIG.DigSite,
    blockingGrid: GWU.grid.NumGrid,
    options: Partial<DisruptOptions> = {}
) {
    options.offsetX ??= 0;
    options.offsetY ??= 0;
    options.machine ??= 0;

    const walkableGrid = GWU.grid.alloc(site.width, site.height);
    let disrupts = false;

    // Get all walkable locations after lake added
    GWU.xy.forRect(site.width, site.height, (i, j) => {
        const lakeX = i + options.offsetX!;
        const lakeY = j + options.offsetY!;
        if (blockingGrid.get(lakeX, lakeY)) {
            if (site.isStairs(i, j)) {
                disrupts = true;
            }
        } else if (
            site.isPassable(i, j) &&
            (site.getMachine(i, j) == 0 ||
                site.getMachine(i, j) == options.machine)
        ) {
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
                } else {
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

export function siteDisruptedSize(
    site: DIG.DigSite,
    blockingGrid: GWU.grid.NumGrid,
    blockingToMapX = 0,
    blockingToMapY = 0
) {
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
        } else if (site.isPassable(i, j)) {
            walkableGrid[i][j] = 1;
        }
    });

    if (disrupts) return disrupts;

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
                } else {
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

export function computeDistanceMap(
    site: DIG.DigSite,
    distanceMap: GWU.grid.NumGrid,
    originX: number,
    originY: number,
    maxDistance: number
) {
    const costGrid = GWU.grid.alloc(site.width, site.height);
    fillCostGrid(site, costGrid);

    GWU.path.calculateDistances(
        distanceMap,
        originX,
        originY,
        costGrid,
        false,
        maxDistance + 1 // max distance is the same as max size of this blueprint
    );
    GWU.grid.free(costGrid);
}

export function clearInteriorFlag(site: BUILD.BuildSite, machine: number) {
    for (let i = 0; i < site.width; i++) {
        for (let j = 0; j < site.height; j++) {
            if (
                site.getMachine(i, j) == machine &&
                !site.hasCellFlag(
                    i,
                    j,
                    GWM.flags.Cell.IS_WIRED | GWM.flags.Cell.IS_CIRCUIT_BREAKER
                )
            ) {
                site.setMachine(i, j, 0);
            }
        }
    }
}
