import { utils, grid } from 'gw-utils';

declare const NOTHING = 0;
declare const FLOOR = 1;
declare const DOOR = 2;
declare const WALL = 3;
declare const LAKE = 4;
declare const BRIDGE = 5;

declare class Hall {
    x: number;
    y: number;
    x2: number;
    y2: number;
    length: number;
    dir: number;
    width: number;
    doors: utils.Loc[];
    constructor(loc: utils.Loc, dir: number, length: number, width?: number);
    translate(dx: number, dy: number): void;
}
declare class Room {
    digger: string;
    x: number;
    y: number;
    width: number;
    height: number;
    doors: utils.Loc[];
    hall: Hall | null;
    constructor(digger: string, x: number, y: number, width: number, height: number);
    get cx(): number;
    get cy(): number;
    translate(dx: number, dy: number): void;
}
declare type DigFn = (config: any, grid: grid.NumGrid) => Room;
interface DigConfig {
    fn: DigFn;
    id: string;
}
declare var rooms: Record<string, DigConfig>;
declare function install(id: string, fn: DigFn, config: any): any;
declare function checkConfig(config: any, opts: any): any;
declare function cavern(config: any, grid: grid.NumGrid): any;
declare function choiceRoom(config: any, grid: grid.NumGrid): any;
declare function entrance(config: any, grid: grid.NumGrid): any;
declare function cross(config: any, grid: grid.NumGrid): any;
declare function symmetricalCross(config: any, grid: grid.NumGrid): any;
declare function rectangular(config: any, grid: grid.NumGrid): any;
declare function circular(config: any, grid: grid.NumGrid): any;
declare function brogueDonut(config: any, grid: grid.NumGrid): any;
declare function chunkyRoom(config: any, grid: grid.NumGrid): any;

type room_d_Hall = Hall;
declare const room_d_Hall: typeof Hall;
type room_d_Room = Room;
declare const room_d_Room: typeof Room;
type room_d_DigFn = DigFn;
declare const room_d_rooms: typeof rooms;
declare const room_d_install: typeof install;
declare const room_d_checkConfig: typeof checkConfig;
declare const room_d_cavern: typeof cavern;
declare const room_d_choiceRoom: typeof choiceRoom;
declare const room_d_entrance: typeof entrance;
declare const room_d_cross: typeof cross;
declare const room_d_symmetricalCross: typeof symmetricalCross;
declare const room_d_rectangular: typeof rectangular;
declare const room_d_circular: typeof circular;
declare const room_d_brogueDonut: typeof brogueDonut;
declare const room_d_chunkyRoom: typeof chunkyRoom;
declare namespace room_d {
  export {
    room_d_Hall as Hall,
    room_d_Room as Room,
    room_d_DigFn as DigFn,
    room_d_rooms as rooms,
    room_d_install as install,
    room_d_checkConfig as checkConfig,
    room_d_cavern as cavern,
    room_d_choiceRoom as choiceRoom,
    room_d_entrance as entrance,
    room_d_cross as cross,
    room_d_symmetricalCross as symmetricalCross,
    room_d_rectangular as rectangular,
    room_d_circular as circular,
    room_d_brogueDonut as brogueDonut,
    room_d_chunkyRoom as chunkyRoom,
  };
}

declare function start(map: grid.NumGrid): void;
declare function finish(map: grid.NumGrid): void;
declare function dig(map: grid.NumGrid, opts?: string | any): Room | null;
declare function attachRoom(map: grid.NumGrid, roomGrid: grid.NumGrid, room: Room, opts?: any): boolean;
declare function roomFitsAt(map: grid.NumGrid, roomGrid: grid.NumGrid, roomToSiteX: number, roomToSiteY: number): boolean;
declare function forceRoomAtMapLoc(map: grid.NumGrid, xy: utils.Loc, roomGrid: grid.NumGrid, room: Room, opts?: any): boolean;
declare function chooseRandomDoorSites(sourceGrid: grid.NumGrid): utils.Loc[];
declare function isPassable(grid: grid.NumGrid, x: number, y: number): boolean;
declare function isObstruction(grid: grid.NumGrid, x: number, y: number): boolean;
declare function removeDiagonalOpenings(grid: grid.NumGrid): void;
declare function finishDoors(grid: grid.NumGrid): void;
declare function finishWalls(grid: grid.NumGrid): void;

type dig_d_Room = Room;
declare const dig_d_Room: typeof Room;
type dig_d_Hall = Hall;
declare const dig_d_Hall: typeof Hall;
declare const dig_d_start: typeof start;
declare const dig_d_finish: typeof finish;
declare const dig_d_dig: typeof dig;
declare const dig_d_attachRoom: typeof attachRoom;
declare const dig_d_roomFitsAt: typeof roomFitsAt;
declare const dig_d_forceRoomAtMapLoc: typeof forceRoomAtMapLoc;
declare const dig_d_chooseRandomDoorSites: typeof chooseRandomDoorSites;
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
declare namespace dig_d {
  export {
    dig_d_Room as Room,
    dig_d_Hall as Hall,
    dig_d_start as start,
    dig_d_finish as finish,
    dig_d_dig as dig,
    dig_d_attachRoom as attachRoom,
    dig_d_roomFitsAt as roomFitsAt,
    dig_d_forceRoomAtMapLoc as forceRoomAtMapLoc,
    dig_d_chooseRandomDoorSites as chooseRandomDoorSites,
    dig_d_isPassable as isPassable,
    dig_d_isObstruction as isObstruction,
    dig_d_removeDiagonalOpenings as removeDiagonalOpenings,
    dig_d_finishDoors as finishDoors,
    dig_d_finishWalls as finishWalls,
    room_d as room,
    dig_d_NOTHING as NOTHING,
    dig_d_FLOOR as FLOOR,
    dig_d_DOOR as DOOR,
    dig_d_WALL as WALL,
    dig_d_LAKE as LAKE,
    dig_d_BRIDGE as BRIDGE,
  };
}

export { dig_d as dig };
