import { grid, utils } from 'gw-utils';

declare const NOTHING = 0;
declare const FLOOR = 1;
declare const DOOR = 2;
declare const WALL = 3;
declare const LAKE = 4;
declare const BRIDGE = 5;

declare type DigFn = (config: any, grid: grid.NumGrid) => string;
interface DigConfig {
    fn: DigFn;
    id: string;
}
declare var diggers: Record<string, DigConfig>;
declare function install(id: string, fn: DigFn, config: any): any;
declare function checkConfig(config: any, opts: any): any;
declare function cavern(config: any, grid: grid.NumGrid): any;
declare function choiceRoom(config: any, grid: grid.NumGrid): any;
declare function entranceRoom(config: any, grid: grid.NumGrid): any;
declare function crossRoom(config: any, grid: grid.NumGrid): any;
declare function symmetricalCrossRoom(config: any, grid: grid.NumGrid): any;
declare function rectangularRoom(config: any, grid: grid.NumGrid): any;
declare function circularRoom(config: any, grid: grid.NumGrid): any;
declare function brogueDonut(config: any, grid: grid.NumGrid): any;
declare function chunkyRoom(config: any, grid: grid.NumGrid): any;

declare function start(map: grid.NumGrid): void;
declare function finish(map: grid.NumGrid): void;
declare function dig(map: grid.NumGrid, opts?: string | any): boolean | [number, number][];
declare function fitRoomToMap(map: grid.NumGrid, roomGrid: grid.NumGrid, doorSites: utils.Loc[], opts?: any): false | [number, number][];
declare function roomAttachesAt(map: grid.NumGrid, roomGrid: grid.NumGrid, roomToSiteX: number, roomToSiteY: number): boolean;
declare function fitRoomAtXY(map: grid.NumGrid, xy: utils.Loc, roomGrid: grid.NumGrid, doors: utils.Loc[], opts?: any): false | [number, number][];
declare function chooseRandomDoorSites(sourceGrid: grid.NumGrid): utils.Loc[];
declare function attachHallway(grid: grid.NumGrid, doorSitesArray: utils.Loc[], opts: any): number[] | undefined;
declare function isPassable(grid: grid.NumGrid, x: number, y: number): boolean;
declare function isObstruction(grid: grid.NumGrid, x: number, y: number): boolean;
declare function removeDiagonalOpenings(grid: grid.NumGrid): void;
declare function finishDoors(grid: grid.NumGrid): void;
declare function finishWalls(grid: grid.NumGrid): void;

declare const dig_d_start: typeof start;
declare const dig_d_finish: typeof finish;
declare const dig_d_dig: typeof dig;
declare const dig_d_fitRoomToMap: typeof fitRoomToMap;
declare const dig_d_roomAttachesAt: typeof roomAttachesAt;
declare const dig_d_fitRoomAtXY: typeof fitRoomAtXY;
declare const dig_d_chooseRandomDoorSites: typeof chooseRandomDoorSites;
declare const dig_d_attachHallway: typeof attachHallway;
declare const dig_d_isPassable: typeof isPassable;
declare const dig_d_isObstruction: typeof isObstruction;
declare const dig_d_removeDiagonalOpenings: typeof removeDiagonalOpenings;
declare const dig_d_finishDoors: typeof finishDoors;
declare const dig_d_finishWalls: typeof finishWalls;
declare const dig_d_NOTHING: typeof NOTHING;
declare const dig_d_FLOOR: typeof FLOOR;
declare const dig_d_DOOR: typeof DOOR;
declare const dig_d_WALL: typeof WALL;
declare const dig_d_LAKE: typeof LAKE;
declare const dig_d_BRIDGE: typeof BRIDGE;
type dig_d_DigFn = DigFn;
declare const dig_d_diggers: typeof diggers;
declare const dig_d_install: typeof install;
declare const dig_d_checkConfig: typeof checkConfig;
declare const dig_d_cavern: typeof cavern;
declare const dig_d_choiceRoom: typeof choiceRoom;
declare const dig_d_entranceRoom: typeof entranceRoom;
declare const dig_d_crossRoom: typeof crossRoom;
declare const dig_d_symmetricalCrossRoom: typeof symmetricalCrossRoom;
declare const dig_d_rectangularRoom: typeof rectangularRoom;
declare const dig_d_circularRoom: typeof circularRoom;
declare const dig_d_brogueDonut: typeof brogueDonut;
declare const dig_d_chunkyRoom: typeof chunkyRoom;
declare namespace dig_d {
  export {
    dig_d_start as start,
    dig_d_finish as finish,
    dig_d_dig as dig,
    dig_d_fitRoomToMap as fitRoomToMap,
    dig_d_roomAttachesAt as roomAttachesAt,
    dig_d_fitRoomAtXY as fitRoomAtXY,
    dig_d_chooseRandomDoorSites as chooseRandomDoorSites,
    dig_d_attachHallway as attachHallway,
    dig_d_isPassable as isPassable,
    dig_d_isObstruction as isObstruction,
    dig_d_removeDiagonalOpenings as removeDiagonalOpenings,
    dig_d_finishDoors as finishDoors,
    dig_d_finishWalls as finishWalls,
    dig_d_NOTHING as NOTHING,
    dig_d_FLOOR as FLOOR,
    dig_d_DOOR as DOOR,
    dig_d_WALL as WALL,
    dig_d_LAKE as LAKE,
    dig_d_BRIDGE as BRIDGE,
    dig_d_DigFn as DigFn,
    dig_d_diggers as diggers,
    dig_d_install as install,
    dig_d_checkConfig as checkConfig,
    dig_d_cavern as cavern,
    dig_d_choiceRoom as choiceRoom,
    dig_d_entranceRoom as entranceRoom,
    dig_d_crossRoom as crossRoom,
    dig_d_symmetricalCrossRoom as symmetricalCrossRoom,
    dig_d_rectangularRoom as rectangularRoom,
    dig_d_circularRoom as circularRoom,
    dig_d_brogueDonut as brogueDonut,
    dig_d_chunkyRoom as chunkyRoom,
  };
}

export { dig_d as dig, diggers };
