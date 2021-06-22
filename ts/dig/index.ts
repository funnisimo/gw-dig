// import * as GW from 'gw-utils';
// import * as TYPES from './types';
// import * as SITE from '../site';
// import * as UTILS from './utils';
// import * as HALL from './hall';
// import * as ROOM from './room';
// import * as LAKE from './lake';
// import * as BRIDGE from './bridge';
// import * as STAIRS from './stairs';
// import * as LOOP from './loop';
// import * as MAP from 'gw-map.js';

export * as room from './room';
export * as hall from './hall';
export * as lake from './lake';
export * as bridge from './bridge';
export * as stairs from './stairs';
export * as utils from './utils';
export * as loop from './loop';
export * from './types';
export * from './level';
export * from './dungeon';

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
