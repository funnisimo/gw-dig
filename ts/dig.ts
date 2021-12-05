import * as GWU from 'gw-utils';
import * as TYPES from './types';
import * as SITE from './site';
import * as UTILS from './utils';
import * as HALL from './hall';
import * as ROOM from './room';
import * as LAKE from './lake';
import * as STAIRS from './stairs';
// import * as MAP from 'gw-map.js';

export * from './site';
export * as room from './room';
export * as hall from './hall';
export * as lake from './lake';
export * as stairs from './stairs';
export * as utils from './utils';
export * from './types';

export function start(map: GWU.grid.NumGrid) {
    SITE.initSeqence(map.width * map.height);
    map.fill(0);
}

export function finish(map: GWU.grid.NumGrid) {
    removeDiagonalOpenings(map);
    finishWalls(map);
    finishDoors(map);
}

// Returns an array of door sites if successful
export function addRoom(
    map: GWU.grid.NumGrid,
    opts?: string | TYPES.DigConfig
): TYPES.Room | null {
    opts = opts || { room: 'DEFAULT', hall: 'DEFAULT', tries: 10 };
    if (typeof opts === 'string') {
        opts = { room: opts };
    }
    if (opts.loc) {
        opts.locs = [opts.loc];
    }
    if (!opts.room) opts.room = 'DEFAULT';
    if (typeof opts.room === 'function') opts.room = { fn: opts.room };
    if (typeof opts.room === 'string') {
        const name = opts.room;
        opts.room = ROOM.rooms[name];
        if (!opts.room) {
            GWU.ERROR('Failed to find room: ' + name);
        }
    }
    const roomConfig = opts.room as TYPES.RoomConfig;

    let hallConfig: TYPES.HallData | null = null;
    if (opts.hall === true) opts.hall = 'DEFAULT';
    if (opts.hall !== false && !opts.hall) opts.hall = 'DEFAULT';
    if (typeof opts.hall === 'function') opts.hall = { fn: opts.hall };
    if (typeof opts.hall === 'string') {
        const name = opts.hall;
        opts.hall = HALL.halls[name];
        if (!opts.hall) {
            GWU.ERROR('Failed to find hall: ' + name);
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
        opts.door = GWU.random.chance(opts.door) ? SITE.DOOR : SITE.FLOOR;
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

    const digger = opts.room;

    const roomGrid = GWU.grid.alloc(map.width, map.height);
    let attachHall = false;
    if (hallConfig) {
        let hallChance =
            hallConfig.chance !== undefined ? hallConfig.chance : 15;
        attachHall = GWU.random.chance(hallChance);
    }

    // const force = config.force || false;

    let result: boolean | GWU.xy.Loc[] = false;
    let room;
    let tries = opts.tries || 10;
    while (--tries >= 0 && !result) {
        roomGrid.fill(SITE.NOTHING);

        // dig the room in the center
        room = digger.fn(roomConfig, roomGrid);

        // TODO - Allow choice of floor tile...
        room.doors = UTILS.chooseRandomDoorSites(roomGrid, SITE.FLOOR);
        if (attachHall && hallConfig) {
            room.hall = hallConfig.fn(hallConfig!, roomGrid, room);
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

    GWU.grid.free(roomGrid);
    return room && result ? room : null;
}

// Add some loops to the otherwise simply connected network of rooms.
export function addLoops(
    grid: GWU.grid.NumGrid,
    minimumPathingDistance: number,
    maxConnectionLength: number
) {
    let startX, startY, endX, endY;
    let i, j, d, x, y;

    minimumPathingDistance =
        minimumPathingDistance ||
        Math.floor(Math.min(grid.width, grid.height) / 2);
    maxConnectionLength = maxConnectionLength || 1; // by default only break walls down

    const siteGrid = grid;
    const pathGrid = GWU.grid.alloc(grid.width, grid.height);
    const costGrid = GWU.grid.alloc(grid.width, grid.height);

    const dirCoords: [number, number][] = [
        [1, 0],
        [0, 1],
    ];

    SITE.fillCostGrid(grid, costGrid);

    function isValidTunnelStart(x: number, y: number, dir: [number, number]) {
        if (!grid.hasXY(x, y)) return false;
        if (!grid.hasXY(x + dir[1], y + dir[0])) return false;
        if (!grid.hasXY(x - dir[1], y - dir[0])) return false;
        if (grid.get(x, y)) return false;
        if (grid.get(x + dir[1], y + dir[0])) return false;
        if (grid.get(x - dir[1], y - dir[0])) return false;
        return true;
    }

    function isValidTunnelEnd(x: number, y: number, dir: [number, number]) {
        if (!grid.hasXY(x, y)) return false;
        if (!grid.hasXY(x + dir[1], y + dir[0])) return false;
        if (!grid.hasXY(x - dir[1], y - dir[0])) return false;
        if (grid.get(x, y)) return true;
        if (grid.get(x + dir[1], y + dir[0])) return true;
        if (grid.get(x - dir[1], y - dir[0])) return true;
        return false;
    }

    for (i = 0; i < SITE.SEQ.length; i++) {
        x = Math.floor(SITE.SEQ[i] / siteGrid.height);
        y = SITE.SEQ[i] % siteGrid.height;

        const cell = siteGrid[x][y];
        if (!cell) {
            for (d = 0; d <= 1; d++) {
                // Try a horizontal door, and then a vertical door.
                let dir = dirCoords[d];
                if (!isValidTunnelStart(x, y, dir)) continue;
                j = maxConnectionLength;

                // check up/left
                if (
                    grid.hasXY(x + dir[0], y + dir[1]) &&
                    SITE.isPassable(grid, x + dir[0], y + dir[1])
                ) {
                    // just can't build directly into a door
                    if (
                        !grid.hasXY(x - dir[0], y - dir[1]) ||
                        SITE.isDoor(grid, x - dir[0], y - dir[1])
                    ) {
                        continue;
                    }
                } else if (
                    grid.hasXY(x - dir[0], y - dir[1]) &&
                    SITE.isPassable(grid, x - dir[0], y - dir[1])
                ) {
                    if (
                        !grid.hasXY(x + dir[0], y + dir[1]) ||
                        SITE.isDoor(grid, x + dir[0], y + dir[1])
                    ) {
                        continue;
                    }
                    dir = dir.map((v) => -1 * v) as [number, number];
                } else {
                    continue; // not valid start for tunnel
                }

                startX = x + dir[0];
                startY = y + dir[1];
                endX = x;
                endY = y;

                for (j = 0; j < maxConnectionLength; ++j) {
                    endX -= dir[0];
                    endY -= dir[1];

                    // if (grid.hasXY(endX, endY) && !grid.cell(endX, endY).isNull()) {
                    if (isValidTunnelEnd(endX, endY, dir)) {
                        break;
                    }
                }

                if (j < maxConnectionLength) {
                    GWU.path.calculateDistances(
                        pathGrid,
                        startX,
                        startY,
                        costGrid,
                        false
                    );
                    // pathGrid.fill(30000);
                    // pathGrid[startX][startY] = 0;
                    // dijkstraScan(pathGrid, costGrid, false);
                    if (
                        pathGrid[endX][endY] > minimumPathingDistance &&
                        pathGrid[endX][endY] < 30000
                    ) {
                        // and if the pathing distance between the two flanking floor tiles exceeds minimumPathingDistance,

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
                            if (grid.get(endX, endY) == 0) {
                                grid[endX][endY] = SITE.FLOOR;
                                costGrid[endX][endY] = 1; // (Cost map also needs updating.)
                            }
                            endX += dir[0];
                            endY += dir[1];
                        }
                        // TODO - Door is optional
                        grid[x][y] = SITE.DOOR; // then turn the tile into a doorway.
                        break;
                    }
                }
            }
        }
    }
    GWU.grid.free(pathGrid);
    GWU.grid.free(costGrid);
}

export function addLakes(map: GWU.grid.NumGrid, opts: any = {}) {
    return LAKE.digLakes(map, opts);
}

export function addBridges(
    map: GWU.grid.NumGrid,
    minimumPathingDistance: number,
    maxConnectionLength: number
) {
    return LAKE.digBridges(map, minimumPathingDistance, maxConnectionLength);
}

export function addStairs(map: GWU.grid.NumGrid, opts: any = {}) {
    return STAIRS.addStairs(map, opts);
}

export function removeDiagonalOpenings(grid: GWU.grid.NumGrid) {
    let i, j, k, x1, y1;
    let diagonalCornerRemoved;

    do {
        diagonalCornerRemoved = false;
        for (i = 0; i < grid.width - 1; i++) {
            for (j = 0; j < grid.height - 1; j++) {
                for (k = 0; k <= 1; k++) {
                    if (
                        SITE.isPassable(grid, i + k, j) &&
                        !SITE.isPassable(grid, i + (1 - k), j) &&
                        SITE.isObstruction(grid, i + (1 - k), j) &&
                        !SITE.isPassable(grid, i + k, j + 1) &&
                        SITE.isObstruction(grid, i + k, j + 1) &&
                        SITE.isPassable(grid, i + (1 - k), j + 1)
                    ) {
                        if (GWU.random.chance(50)) {
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

export function finishDoors(grid: GWU.grid.NumGrid) {
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

export function finishWalls(grid: GWU.grid.NumGrid, tile: number = SITE.WALL) {
    grid.forEach((cell, i, j) => {
        if (cell == SITE.NOTHING) {
            grid[i][j] = tile;
        }
    });
}
