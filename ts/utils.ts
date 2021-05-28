import * as GW from 'gw-utils';
import * as SITE from './site';
import * as TYPES from './types';

const DIRS = GW.utils.DIRS;

export function attachRoom(
    map: GW.grid.NumGrid,
    roomGrid: GW.grid.NumGrid,
    room: TYPES.Room,
    opts: TYPES.DigInfo
) {
    // console.log('attachRoom');
    const doorSites = room.hall ? room.hall.doors : room.doors;
    const site = new SITE.GridSite(map);

    // Slide hyperspace across real space, in a random but predetermined order, until the room matches up with a wall.
    for (let i = 0; i < SITE.SEQ.length; i++) {
        const x = Math.floor(SITE.SEQ[i] / map.height);
        const y = SITE.SEQ[i] % map.height;

        if (!(map.get(x, y) == SITE.NOTHING)) continue;
        const dir = directionOfDoorSite(site, x, y);
        if (dir != GW.utils.NO_DIRECTION) {
            const oppDir = (dir + 2) % 4;
            const door = doorSites[oppDir];
            if (!door) continue;

            const offsetX = x - door[0];
            const offsetY = y - door[1];

            if (door[0] != -1 && roomFitsAt(map, roomGrid, offsetX, offsetY)) {
                // TYPES.Room fits here.
                GW.grid.offsetZip(
                    map,
                    roomGrid,
                    offsetX,
                    offsetY,
                    (_d, _s, i, j) => {
                        map[i][j] = opts.room.tile || SITE.FLOOR;
                    }
                );

                attachDoor(map, room, opts, x, y, oppDir);

                // door[0] = -1;
                // door[1] = -1;
                room.translate(offsetX, offsetY);
                return true;
            }
        }
    }

    return false;
}

export function attachDoor(
    map: GW.grid.NumGrid,
    room: TYPES.Room,
    opts: TYPES.DigInfo,
    x: number,
    y: number,
    dir: number
) {
    if (opts.door === 0) return; // no door at all

    const tile = opts.door || SITE.DOOR;
    map[x][y] = tile; // Door site.
    // most cases...
    if (!room.hall || !(room.hall.width > 1) || room.hall.dir !== dir) {
        return;
    }

    if (dir === GW.utils.UP || dir === GW.utils.DOWN) {
        let didSomething = true;
        let k = 1;
        while (didSomething) {
            didSomething = false;

            if (map.get(x - k, y) === 0) {
                if (map.get(x - k, y - 1) && map.get(x - k, y + 1)) {
                    map[x - k][y] = tile;
                    didSomething = true;
                }
            }
            if (map.get(x + k, y) === 0) {
                if (map.get(x + k, y - 1) && map.get(x + k, y + 1)) {
                    map[x + k][y] = tile;
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

            if (map.get(x, y - k) === 0) {
                if (map.get(x - 1, y - k) && map.get(x + 1, y - k)) {
                    map[x][y - k] = opts.door;
                    didSomething = true;
                }
            }
            if (map.get(x, y + k) === 0) {
                if (map.get(x - 1, y + k) && map.get(x + 1, y + k)) {
                    map[x][y + k] = opts.door;
                    didSomething = true;
                }
            }
            ++k;
        }
    }
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
                            !(map.get(i, j) === SITE.NOTHING)
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

// If the indicated tile is a wall on the room stored in grid, and it could be the site of
// a door out of that room, then return the outbound direction that the door faces.
// Otherwise, return def.NO_DIRECTION.
export function directionOfDoorSite(
    site: SITE.Site,
    x: number,
    y: number
): number {
    let dir, solutionDir;
    let newX, newY, oppX, oppY;

    solutionDir = GW.utils.NO_DIRECTION;
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
            if (solutionDir != GW.utils.NO_DIRECTION) {
                // Already claimed by another direction; no doors here!
                return GW.utils.NO_DIRECTION;
            }
            solutionDir = dir;
        }
    }
    return solutionDir;
}

export function chooseRandomDoorSites(site: SITE.Site): GW.utils.Loc[] {
    let i, j, k, newX, newY;
    let dir;
    let doorSiteFailed;

    const DOORS: GW.utils.Loc[][] = [[], [], [], []];

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
                    for (
                        k = 0;
                        k < 10 && site.hasXY(newX, newY) && !doorSiteFailed;
                        k++
                    ) {
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

    let doorSites: GW.utils.Loc[] = [];
    // Pick four doors, one in each direction, and store them in doorSites[dir].
    for (dir = 0; dir < 4; dir++) {
        const loc = GW.random.item(DOORS[dir]) || [-1, -1];
        doorSites[dir] = [loc[0], loc[1]];
    }

    // GW.grid.free(grid);
    return doorSites;
}

export function forceRoomAtMapLoc(
    map: GW.grid.NumGrid,
    xy: GW.utils.Loc,
    roomGrid: GW.grid.NumGrid,
    room: TYPES.Room,
    opts: TYPES.DigConfig
) {
    // console.log('forceRoomAtMapLoc', xy);

    const site = new SITE.GridSite(map);

    // Slide room across map, in a random but predetermined order, until the room matches up with a wall.
    for (let i = 0; i < SITE.SEQ.length; i++) {
        const x = Math.floor(SITE.SEQ[i] / map.height);
        const y = SITE.SEQ[i] % map.height;

        if (roomGrid[x][y]) continue;

        const dir = directionOfDoorSite(site, x, y);
        if (dir != GW.utils.NO_DIRECTION) {
            const dx = xy[0] - x;
            const dy = xy[1] - y;
            if (roomFitsAt(map, roomGrid, dx, dy)) {
                GW.grid.offsetZip(map, roomGrid, dx, dy, (_d, _s, i, j) => {
                    map[i][j] = opts.room.tile || SITE.FLOOR;
                });
                if (opts.room.door !== false) {
                    const door =
                        opts.room.door === true || !opts.room.door
                            ? SITE.DOOR
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

export function attachRoomAtMapDoor(
    map: GW.grid.NumGrid,
    mapDoors: GW.utils.Loc[],
    roomGrid: GW.grid.NumGrid,
    room: TYPES.Room,
    opts: TYPES.DigInfo
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
    room: TYPES.Room,
    opts: TYPES.DigInfo
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

            // TYPES.Room fits here.
            const offX = x - door[0];
            const offY = y - door[1];
            GW.grid.offsetZip(map, roomGrid, offX, offY, (_d, _s, i, j) => {
                map[i][j] = opts.room.tile || SITE.FLOOR;
            });
            attachDoor(map, room, opts, x, y, oppDir);
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
