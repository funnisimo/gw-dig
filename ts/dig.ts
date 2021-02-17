import * as GW from 'gw-utils';
import * as CONST from './gw';
// import * as MAP from 'gw-map.js';

export * from './gw';
export * from './digger';
import { diggers as DIGGERS } from './digger';

const DIRS = GW.utils.DIRS;
var SEQ: number[];

export function start(map: GW.grid.NumGrid) {
    SEQ = GW.random.sequence(map.width * map.height);
    map.fill(0);
}

export function finish(map: GW.grid.NumGrid) {
    removeDiagonalOpenings(map);
    finishWalls(map);
    finishDoors(map);
}

// Returns an array of door sites if successful
export function dig(map: GW.grid.NumGrid, opts: string | any = {}) {
    if (typeof opts === 'string') {
        opts = { digger: opts };
    }
    const diggerId = opts.digger || opts.id || 'SMALL'; // TODO - get random id

    const digger = DIGGERS[diggerId];
    if (!digger) {
        GW.utils.ERROR('Failed to find digger: ' + diggerId);
    }

    let locs = opts.locs || opts.loc || null;
    if (!locs || !Array.isArray(locs)) {
        locs = null;
        if (map.count(CONST.FLOOR) === 0) {
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
        locs = [locs];
    } else if (locs.length == 0) {
        locs = null;
    }

    const config = Object.assign({}, digger, opts);
    const roomGrid = GW.grid.alloc(map.width, map.height);
    const hallChance = config.hallChance || config.hallway || 0;

    let result: boolean | GW.utils.Loc[] = false;
    let tries = opts.tries || 10;
    while (--tries >= 0 && !result) {
        roomGrid.fill(CONST.NOTHING);

        // dig the room in the center
        digger.fn(config, roomGrid);

        const doors = chooseRandomDoorSites(roomGrid);
        if (GW.random.chance(hallChance)) {
            attachHallway(roomGrid, doors, config);
        }

        if (locs) {
            // try the doors first
            result = attachRoomAtMapDoors(map, locs, roomGrid, doors, config);
            if (!result) {
                // otherwise try everywhere
                for (let i = 0; i < locs.length && !result; ++i) {
                    if (locs[i][0] > 0) {
                        result = fitRoomAtXY(
                            map,
                            locs[i],
                            roomGrid,
                            doors,
                            config
                        );
                    }
                }
            }
        } else {
            result = fitRoomToMap(map, roomGrid, doors, config);
        }
    }

    GW.grid.free(roomGrid);
    return result;
}

export function fitRoomToMap(
    map: GW.grid.NumGrid,
    roomGrid: GW.grid.NumGrid,
    doorSites: GW.utils.Loc[],
    opts: any = {}
) {
    console.log('fitRoomToMap');

    // Slide hyperspace across real space, in a random but predetermined order, until the room matches up with a wall.
    for (let i = 0; i < SEQ.length; i++) {
        const x = Math.floor(SEQ[i] / map.height);
        const y = SEQ[i] % map.height;

        if (!(map.get(x, y) == CONST.NOTHING)) continue;
        const dir = GW.grid.directionOfDoorSite(map, x, y, CONST.FLOOR);
        if (dir != GW.utils.NO_DIRECTION) {
            const oppDir = (dir + 2) % 4;

            const offsetX = x - doorSites[oppDir][0];
            const offsetY = y - doorSites[oppDir][1];

            if (
                doorSites[oppDir][0] != -1 &&
                roomAttachesAt(map, roomGrid, offsetX, offsetY)
            ) {
                // Room fits here.
                GW.grid.offsetZip(
                    map,
                    roomGrid,
                    offsetX,
                    offsetY,
                    (_d, _s, i, j) => {
                        map[i][j] = opts.tile || CONST.FLOOR;
                    }
                );
                if (opts.door || opts.placeDoor !== false) {
                    map[x][y] = opts.door || CONST.DOOR; // Door site.
                }
                doorSites[oppDir][0] = -1;
                doorSites[oppDir][1] = -1;
                for (let i = 0; i < doorSites.length; ++i) {
                    if (doorSites[i][0] > 0) {
                        doorSites[i][0] += offsetX;
                        doorSites[i][1] += offsetY;
                    }
                }
                return doorSites;
            }
        }
    }

    return false;
}

export function roomAttachesAt(
    map: GW.grid.NumGrid,
    roomGrid: GW.grid.NumGrid,
    roomToSiteX: number,
    roomToSiteY: number
) {
    let xRoom, yRoom, xSite, ySite, i, j;

    console.log('roomAttachesAt', roomToSiteX, roomToSiteY);

    for (xRoom = 0; xRoom < roomGrid.width; xRoom++) {
        for (yRoom = 0; yRoom < roomGrid.height; yRoom++) {
            if (roomGrid[xRoom][yRoom]) {
                xSite = xRoom + roomToSiteX;
                ySite = yRoom + roomToSiteY;

                for (i = xSite - 1; i <= xSite + 1; i++) {
                    for (j = ySite - 1; j <= ySite + 1; j++) {
                        if (
                            !map.hasXY(i, j) ||
                            map.isBoundaryXY(i, j) ||
                            !(map.get(i, j) === CONST.NOTHING)
                        ) {
                            console.log('- NO');
                            return false;
                        }
                    }
                }
            }
        }
    }
    console.log('- YES');
    return true;
}

export function fitRoomAtXY(
    map: GW.grid.NumGrid,
    xy: GW.utils.Loc,
    roomGrid: GW.grid.NumGrid,
    doors: GW.utils.Loc[],
    opts: any = {}
) {
    console.log('fitRoomAtXY', xy);

    // Slide room across map, in a random but predetermined order, until the room matches up with a wall.
    for (let i = 0; i < SEQ.length; i++) {
        const x = Math.floor(SEQ[i] / map.height);
        const y = SEQ[i] % map.height;

        if (roomGrid[x][y]) continue;

        const dir = GW.grid.directionOfDoorSite(roomGrid, x, y, CONST.FLOOR);
        if (dir != GW.utils.NO_DIRECTION) {
            if (roomAttachesAt(map, roomGrid, xy[0] - x, xy[1] - y)) {
                GW.grid.offsetZip(
                    map,
                    roomGrid,
                    xy[0] - x,
                    xy[1] - y,
                    (_d, _s, i, j) => {
                        map[i][j] = opts.tile || CONST.FLOOR;
                    }
                );
                if (opts.door || opts.placeDoor !== false) {
                    map[xy[0]][xy[1]] = opts.door || CONST.DOOR; // Door site.
                }
                doors[dir][0] = -1;
                doors[dir][1] = -1;
                for (let i = 0; i < doors.length; ++i) {
                    if (doors[i][0] > 0) {
                        doors[i][0] += xy[0] - x;
                        doors[i][1] += xy[1] - y;
                    }
                }
                return doors;
            }
        }
    }

    return false;
}

function attachRoomAtMapDoors(
    map: GW.grid.NumGrid,
    mapDoors: GW.utils.Loc[],
    roomGrid: GW.grid.NumGrid,
    roomDoors: GW.utils.Loc[],
    opts: any = {}
): boolean | GW.utils.Loc[] {
    const doorIndexes = GW.random.sequence(mapDoors.length);

    console.log('attachRoomAtMapDoors', mapDoors.join(', '));
    // Slide hyperspace across real space, in a random but predetermined order, until the room matches up with a wall.
    for (let i = 0; i < doorIndexes.length; i++) {
        const index = doorIndexes[i];
        const x = mapDoors[index][0];
        const y = mapDoors[index][1];

        const doors = attachRoomAtXY(map, x, y, roomGrid, roomDoors, opts);
        if (doors) return doors;
    }

    return false;
}

function attachRoomAtXY(
    map: GW.grid.NumGrid,
    x: number,
    y: number,
    roomGrid: GW.grid.NumGrid,
    doorSites: GW.utils.Loc[],
    opts: any = {}
): boolean | GW.utils.Loc[] {
    const dirs = GW.random.sequence(4);

    console.log('attachRoomAtXY', x, y, doorSites.join(', '));

    for (let dir of dirs) {
        const oppDir = (dir + 2) % 4;

        if (
            doorSites[oppDir][0] != -1 &&
            roomAttachesAt(
                map,
                roomGrid,
                x - doorSites[oppDir][0],
                y - doorSites[oppDir][1]
            )
        ) {
            // dungeon.debug("attachRoom: ", x, y, oppDir);

            // Room fits here.
            const offX = x - doorSites[oppDir][0];
            const offY = y - doorSites[oppDir][1];
            GW.grid.offsetZip(map, roomGrid, offX, offY, (_d, _s, i, j) => {
                map[i][j] = opts.tile || CONST.FLOOR;
            });
            if (opts.door || opts.placeDoor !== false) {
                map[x][y] = opts.door || CONST.DOOR; // Door site.
            }
            const newDoors = doorSites.map((site) => {
                const x0 = site[0] + offX;
                const y0 = site[1] + offY;
                if (x0 == x && y0 == y) return [-1, -1] as GW.utils.Loc;
                return [x0, y0] as GW.utils.Loc;
            });
            return newDoors;
        }
    }
    return false;
}

export function chooseRandomDoorSites(
    sourceGrid: GW.grid.NumGrid
): GW.utils.Loc[] {
    let i, j, k, newX, newY;
    let dir;
    let doorSiteFailed;

    const grid = GW.grid.alloc(sourceGrid.width, sourceGrid.height);
    grid.copy(sourceGrid);

    for (i = 0; i < grid.width; i++) {
        for (j = 0; j < grid.height; j++) {
            if (!grid[i][j]) {
                dir = GW.grid.directionOfDoorSite(grid, i, j, 1);
                if (dir != GW.utils.NO_DIRECTION) {
                    // Trace a ray 10 spaces outward from the door site to make sure it doesn't intersect the room.
                    // If it does, it's not a valid door site.
                    newX = i + DIRS[dir][0];
                    newY = j + DIRS[dir][1];
                    doorSiteFailed = false;
                    for (
                        k = 0;
                        k < 10 && grid.hasXY(newX, newY) && !doorSiteFailed;
                        k++
                    ) {
                        if (grid[newX][newY]) {
                            doorSiteFailed = true;
                        }
                        newX += DIRS[dir][0];
                        newY += DIRS[dir][1];
                    }
                    if (!doorSiteFailed) {
                        grid[i][j] = dir + 200; // So as not to conflict with other tiles.
                    }
                }
            }
        }
    }

    let doorSites: GW.utils.Loc[] = [];
    // Pick four doors, one in each direction, and store them in doorSites[dir].
    for (dir = 0; dir < 4; dir++) {
        const loc = grid.randomMatchingLoc(dir + 200) || [-1, -1];
        doorSites[dir] = [loc[0], loc[1]];
    }

    GW.grid.free(grid);
    return doorSites;
}

export function attachHallway(
    grid: GW.grid.NumGrid,
    doorSitesArray: GW.utils.Loc[],
    opts: any
) {
    let i, x, y, newX, newY;
    let length;
    let dir, dir2;
    let allowObliqueHallwayExit;

    opts = opts || {};
    const tile = opts.tile || CONST.FLOOR;

    const horizontalLength = GW.utils.firstOpt('horizontalHallLength', opts, [
        9,
        15,
    ]);
    const verticalLength = GW.utils.firstOpt('verticalHallLength', opts, [
        2,
        9,
    ]);

    // Pick a direction.
    dir = opts.dir;
    if (dir === undefined) {
        const dirs = GW.random.sequence(4);
        for (i = 0; i < 4; i++) {
            dir = dirs[i];
            if (
                doorSitesArray[dir][0] != -1 &&
                doorSitesArray[dir][1] != -1 &&
                grid.hasXY(
                    doorSitesArray[dir][0] +
                        Math.floor(DIRS[dir][0] * horizontalLength[1]),
                    doorSitesArray[dir][1] +
                        Math.floor(DIRS[dir][1] * verticalLength[1])
                )
            ) {
                break; // That's our direction!
            }
        }
        if (i == 4) {
            return; // No valid direction for hallways.
        }
    }

    if (dir == GW.utils.UP || dir == GW.utils.DOWN) {
        length = GW.random.range(verticalLength[0], verticalLength[1]);
    } else {
        length = GW.random.range(horizontalLength[0], horizontalLength[1]);
    }

    x = doorSitesArray[dir][0];
    y = doorSitesArray[dir][1];

    const attachLoc = [x - DIRS[dir][0], y - DIRS[dir][1]];
    for (i = 0; i < length; i++) {
        if (grid.hasXY(x, y)) {
            grid[x][y] = tile;
        }
        x += DIRS[dir][0];
        y += DIRS[dir][1];
    }
    x = GW.utils.clamp(x - DIRS[dir][0], 0, grid.width - 1);
    y = GW.utils.clamp(y - DIRS[dir][1], 0, grid.height - 1); // Now (x, y) points at the last interior cell of the hallway.
    allowObliqueHallwayExit = GW.random.chance(15);
    for (dir2 = 0; dir2 < 4; dir2++) {
        newX = x + DIRS[dir2][0];
        newY = y + DIRS[dir2][1];

        if (
            (dir2 != dir && !allowObliqueHallwayExit) ||
            !grid.hasXY(newX, newY) ||
            grid[newX][newY]
        ) {
            doorSitesArray[dir2][0] = -1;
            doorSitesArray[dir2][1] = -1;
        } else {
            doorSitesArray[dir2][0] = newX;
            doorSitesArray[dir2][1] = newY;
        }
    }

    return attachLoc;
}

export function isPassable(grid: GW.grid.NumGrid, x: number, y: number) {
    const v = grid.get(x, y);
    return v === CONST.FLOOR || v === CONST.DOOR || v === CONST.BRIDGE;
}

export function isObstruction(grid: GW.grid.NumGrid, x: number, y: number) {
    const v = grid.get(x, y);
    return v === CONST.NOTHING || v === CONST.WALL;
}

export function removeDiagonalOpenings(grid: GW.grid.NumGrid) {
    let i, j, k, x1, y1;
    let diagonalCornerRemoved;

    do {
        diagonalCornerRemoved = false;
        for (i = 0; i < grid.width - 1; i++) {
            for (j = 0; j < grid.height - 1; j++) {
                for (k = 0; k <= 1; k++) {
                    if (
                        isPassable(grid, i + k, j) &&
                        !isPassable(grid, i + (1 - k), j) &&
                        isObstruction(grid, i + (1 - k), j) &&
                        !isPassable(grid, i + k, j + 1) &&
                        isObstruction(grid, i + k, j + 1) &&
                        isPassable(grid, i + (1 - k), j + 1)
                    ) {
                        if (GW.random.chance(50)) {
                            x1 = i + (1 - k);
                            y1 = j;
                        } else {
                            x1 = i + k;
                            y1 = j + 1;
                        }
                        diagonalCornerRemoved = true;
                        grid[x1][y1] = CONST.FLOOR;
                    }
                }
            }
        }
    } while (diagonalCornerRemoved == true);
}

export function finishDoors(grid: GW.grid.NumGrid) {
    grid.forEach((cell, x, y) => {
        if (grid.isBoundaryXY(x, y)) return;

        if (cell == CONST.DOOR) {
            if (
                (grid.get(x + 1, y) == CONST.FLOOR ||
                    grid.get(x - 1, y) == CONST.FLOOR) &&
                (grid.get(x, y + 1) == CONST.FLOOR ||
                    grid.get(x, y - 1) == CONST.FLOOR)
            ) {
                // If there's passable terrain to the left or right, and there's passable terrain
                // above or below, then the door is orphaned and must be removed.
                grid[x][y] = CONST.FLOOR;
            } else if (
                (grid.get(x + 1, y) !== CONST.FLOOR ? 1 : 0) +
                    (grid.get(x - 1, y) !== CONST.FLOOR ? 1 : 0) +
                    (grid.get(x, y + 1) !== CONST.FLOOR ? 1 : 0) +
                    (grid.get(x, y - 1) !== CONST.FLOOR ? 1 : 0) >=
                3
            ) {
                // If the door has three or more pathing blocker neighbors in the four cardinal directions,
                // then the door is orphaned and must be removed.
                grid[x][y] = CONST.FLOOR;
            }
        }
    });
}

export function finishWalls(grid: GW.grid.NumGrid) {
    grid.forEach((cell, i, j) => {
        if (cell == CONST.NOTHING) {
            grid[i][j] = CONST.WALL;
        }
    });
}
