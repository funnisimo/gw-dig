import * as GW from 'gw-utils';
import * as CONST from './gw';
import * as HALL from './hall';
import * as ROOM from './room';
// import * as MAP from 'gw-map.js';

export * from './gw';
export * as room from './room';

export { Room, Hall } from './room';

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

export interface DigConfig {
    room: string | any;
    hall?: string | HALL.HallConfig | boolean;
    tries?: number;
    locs?: GW.utils.Loc[];
    loc?: GW.utils.Loc;
}

export interface DigInfo {
    room: ROOM.RoomData;
    hall: HALL.HallData | null;
    tries: number;
    locs: GW.utils.Loc[] | null;
}

// Returns an array of door sites if successful
export function dig(
    map: GW.grid.NumGrid,
    opts?: string | DigConfig
): ROOM.Room | null {
    opts = opts || { room: 'DEFAULT', hall: 'DEFAULT', tries: 10 };
    if (typeof opts === 'string') {
        opts = { room: opts };
    }
    if (opts.loc) {
        opts.locs = [opts.loc];
    }
    if (!opts.room) opts.room = 'DEFAULT';
    if (typeof opts.room === 'string') {
        const name = opts.room;
        opts.room = ROOM.rooms[name];
        if (!opts.room) {
            GW.utils.ERROR('Failed to find room: ' + name);
        }
    }
    const roomConfig = opts.room as ROOM.RoomConfig;

    if (opts.hall === true) opts.hall = 'DEFAULT';
    if (opts.hall !== false && !opts.hall) opts.hall = 'DEFAULT';
    if (typeof opts.hall === 'string') {
        const name = opts.hall;
        opts.hall = HALL.halls[name];
        if (!opts.hall) {
            GW.utils.ERROR('Failed to find hall: ' + name);
            return null;
        }
    }
    const hallConfig: HALL.HallConfig | null = opts.hall ? opts.hall : null;

    let locs = opts.locs || null;
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
        // @ts-ignore
        locs = [locs];
    } else if (locs.length == 0) {
        locs = null;
    }

    const digger = opts.room;

    const roomGrid = GW.grid.alloc(map.width, map.height);
    let attachHall = false;
    if (hallConfig) {
        let hallChance =
            hallConfig.chance !== undefined ? hallConfig.chance : 15;
        attachHall = GW.random.chance(hallChance);
    }

    // const force = config.force || false;

    let result: boolean | GW.utils.Loc[] = false;
    let room;
    let tries = opts.tries || 10;
    while (--tries >= 0 && !result) {
        roomGrid.fill(CONST.NOTHING);

        // dig the room in the center
        room = digger.fn(roomConfig, roomGrid);

        room.doors = chooseRandomDoorSites(roomGrid);
        if (attachHall) {
            room.hall = HALL.dig(hallConfig!, roomGrid, room);
        }

        if (locs) {
            // try the doors first
            result = attachRoomAtMapDoor(
                map,
                locs,
                roomGrid,
                room,
                opts as DigInfo
            );
        } else {
            result = attachRoom(map, roomGrid, room, opts as DigInfo);
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

export function attachRoom(
    map: GW.grid.NumGrid,
    roomGrid: GW.grid.NumGrid,
    room: ROOM.Room,
    opts: DigInfo
) {
    // console.log('attachRoom');
    const doorSites = room.hall ? room.hall.doors : room.doors;

    // Slide hyperspace across real space, in a random but predetermined order, until the room matches up with a wall.
    for (let i = 0; i < SEQ.length; i++) {
        const x = Math.floor(SEQ[i] / map.height);
        const y = SEQ[i] % map.height;

        if (!(map.get(x, y) == CONST.NOTHING)) continue;
        const dir = GW.grid.directionOfDoorSite(map, x, y, CONST.FLOOR);
        if (dir != GW.utils.NO_DIRECTION) {
            const oppDir = (dir + 2) % 4;
            const door = doorSites[oppDir];
            if (!door) continue;

            const offsetX = x - door[0];
            const offsetY = y - door[1];

            if (door[0] != -1 && roomFitsAt(map, roomGrid, offsetX, offsetY)) {
                // Room fits here.
                GW.grid.offsetZip(
                    map,
                    roomGrid,
                    offsetX,
                    offsetY,
                    (_d, _s, i, j) => {
                        map[i][j] = opts.room.tile || CONST.FLOOR;
                    }
                );
                if (opts.room.door !== false) {
                    const door =
                        opts.room.door === true || !opts.room.door
                            ? CONST.DOOR
                            : opts.room.door;
                    map[x][y] = door; // Door site.
                }
                // door[0] = -1;
                // door[1] = -1;
                room.translate(offsetX, offsetY);
                return true;
            }
        }
    }

    return false;
}

export function roomFitsAt(
    map: GW.grid.NumGrid,
    roomGrid: GW.grid.NumGrid,
    roomToSiteX: number,
    roomToSiteY: number
) {
    let xRoom, yRoom, xSite, ySite, i, j;

    // console.log('roomFitsAt', roomToSiteX, roomToSiteY);

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

export function forceRoomAtMapLoc(
    map: GW.grid.NumGrid,
    xy: GW.utils.Loc,
    roomGrid: GW.grid.NumGrid,
    room: ROOM.Room,
    opts: DigConfig
) {
    // console.log('forceRoomAtMapLoc', xy);

    // Slide room across map, in a random but predetermined order, until the room matches up with a wall.
    for (let i = 0; i < SEQ.length; i++) {
        const x = Math.floor(SEQ[i] / map.height);
        const y = SEQ[i] % map.height;

        if (roomGrid[x][y]) continue;

        const dir = GW.grid.directionOfDoorSite(roomGrid, x, y, CONST.FLOOR);
        if (dir != GW.utils.NO_DIRECTION) {
            const dx = xy[0] - x;
            const dy = xy[1] - y;
            if (roomFitsAt(map, roomGrid, dx, dy)) {
                GW.grid.offsetZip(map, roomGrid, dx, dy, (_d, _s, i, j) => {
                    map[i][j] = opts.room.tile || CONST.FLOOR;
                });
                if (opts.room.door !== false) {
                    const door =
                        opts.room.door === true || !opts.room.door
                            ? CONST.DOOR
                            : opts.room.door;
                    map[xy[0]][xy[1]] = door; // Door site.
                }
                // TODO - Update doors - we may have to erase one...
                room.translate(dx, dy);
                return true;
            }
        }
    }

    return false;
}

function attachRoomAtMapDoor(
    map: GW.grid.NumGrid,
    mapDoors: GW.utils.Loc[],
    roomGrid: GW.grid.NumGrid,
    room: ROOM.Room,
    opts: DigInfo
): boolean | GW.utils.Loc[] {
    const doorIndexes = GW.random.sequence(mapDoors.length);

    // console.log('attachRoomAtMapDoor', mapDoors.join(', '));
    // Slide hyperspace across real space, in a random but predetermined order, until the room matches up with a wall.
    for (let i = 0; i < doorIndexes.length; i++) {
        const index = doorIndexes[i];
        const door = mapDoors[index];
        if (!door) continue;
        const x = door[0];
        const y = door[1];

        if (attachRoomAtXY(map, x, y, roomGrid, room, opts)) {
            return true;
        }
    }

    return false;
}

function attachRoomAtXY(
    map: GW.grid.NumGrid,
    x: number,
    y: number,
    roomGrid: GW.grid.NumGrid,
    room: ROOM.Room,
    opts: DigInfo
): boolean | GW.utils.Loc[] {
    const doorSites = room.hall ? room.hall.doors : room.doors;
    const dirs = GW.random.sequence(4);

    // console.log('attachRoomAtXY', x, y, doorSites.join(', '));

    for (let dir of dirs) {
        const oppDir = (dir + 2) % 4;
        const door = doorSites[oppDir];
        if (!door) continue;

        if (
            door[0] != -1 &&
            roomFitsAt(map, roomGrid, x - door[0], y - door[1])
        ) {
            // dungeon.debug("attachRoom: ", x, y, oppDir);

            // Room fits here.
            const offX = x - door[0];
            const offY = y - door[1];
            GW.grid.offsetZip(map, roomGrid, offX, offY, (_d, _s, i, j) => {
                map[i][j] = opts.room.tile || CONST.FLOOR;
            });
            if (opts.room.door !== false) {
                const door =
                    opts.room.door === true || !opts.room.door
                        ? CONST.DOOR
                        : opts.room.door;
                map[x][y] = door; // Door site.
            }
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
