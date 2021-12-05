import * as GWU from 'gw-utils';

interface RoomConfig {
    fn?: RoomFn;
    door?: boolean | number;
    doorChance?: number;
    tile?: number;
    [x: string]: any;
}
declare type RoomFn = (config: RoomConfig, grid: GWU.grid.NumGrid) => Room | RoomConfig | null;
interface RoomData$1 extends RoomConfig {
    fn: RoomFn;
    id: string;
}
declare type HallFn = (opts: HallConfig, grid: GWU.grid.NumGrid, room: Room) => Hall | any | null;
interface HallConfig {
    fn?: HallFn;
    chance?: number;
    length?: GWU.range.RangeBase | [GWU.range.RangeBase, GWU.range.RangeBase];
    width?: GWU.range.RangeBase;
    tile?: number;
    [x: string]: any;
}
interface HallData$1 extends HallConfig {
    fn: HallFn;
    id: string;
}
interface DigConfig {
    room: string | any;
    hall?: string | HallConfig | boolean;
    tries?: number;
    locs?: GWU.xy.Loc[];
    loc?: GWU.xy.Loc;
    door?: number | boolean;
}
declare class Hall {
    x: number;
    y: number;
    x2: number;
    y2: number;
    length: number;
    dir: number;
    width: number;
    doors: GWU.xy.Loc[];
    constructor(loc: GWU.xy.Loc, dir: number, length: number, width?: number);
    translate(dx: number, dy: number): void;
}
declare class Room {
    digger: string;
    x: number;
    y: number;
    width: number;
    height: number;
    doors: GWU.xy.Loc[];
    hall: Hall | null;
    constructor(digger: string, x: number, y: number, width: number, height: number);
    get cx(): number;
    get cy(): number;
    translate(dx: number, dy: number): void;
}
interface DigInfo {
    room: RoomData$1;
    hall: HallData$1 | null;
    tries: number;
    locs: GWU.xy.Loc[] | null;
    door: number;
}

declare const NOTHING = 0;
declare const FLOOR = 1;
declare const DOOR = 2;
declare const WALL = 3;
declare const DEEP = 4;
declare const SHALLOW = 5;
declare const BRIDGE = 6;
declare const UP_STAIRS = 7;
declare const DOWN_STAIRS = 17;
declare const IMPREGNABLE = 8;
declare const TILEMAP: {
    0: string;
    1: string;
    2: string;
    3: string;
    8: string;
    4: string;
    5: string;
    6: string;
    7: string;
    17: string;
};
declare const SEQ: number[];
declare function initSeqence(length: number): void;
declare function fillCostGrid(source: GWU.grid.NumGrid, costGrid: GWU.grid.NumGrid): void;
declare function isPassable(grid: GWU.grid.NumGrid, x: number, y: number): boolean;
declare function isNothing(grid: GWU.grid.NumGrid, x: number, y: number): boolean;
declare function isFloor(grid: GWU.grid.NumGrid, x: number, y: number): boolean;
declare function isDoor(grid: GWU.grid.NumGrid, x: number, y: number): boolean;
declare function isBridge(grid: GWU.grid.NumGrid, x: number, y: number): boolean;
declare function isWall(grid: GWU.grid.NumGrid, x: number, y: number): boolean;
declare function isObstruction(grid: GWU.grid.NumGrid, x: number, y: number): boolean;
declare function isStairs(grid: GWU.grid.NumGrid, x: number, y: number): boolean;
declare function isDeep(grid: GWU.grid.NumGrid, x: number, y: number): boolean;
declare function isShallow(grid: GWU.grid.NumGrid, x: number, y: number): boolean;
declare function isAnyWater(grid: GWU.grid.NumGrid, x: number, y: number): boolean;

declare var rooms: Record<string, RoomData$1>;
declare function install$1(id: string, fn: RoomFn, config?: RoomConfig): RoomData;
declare function checkConfig(config: RoomConfig, expected: any): RoomConfig;
declare function cavern(config: RoomConfig, grid: GWU.grid.NumGrid): Room | RoomConfig;
declare function choiceRoom(config: RoomConfig, grid: GWU.grid.NumGrid): Room | RoomConfig | null;
declare function entrance(config: RoomConfig, grid: GWU.grid.NumGrid): Room | RoomConfig;
declare function cross(config: RoomConfig, grid: GWU.grid.NumGrid): Room | RoomConfig;
declare function symmetricalCross(config: RoomConfig, grid: GWU.grid.NumGrid): Room | RoomConfig;
declare function rectangular(config: RoomConfig, grid: GWU.grid.NumGrid): Room | RoomConfig;
declare function circular(config: RoomConfig, grid: GWU.grid.NumGrid): Room | RoomConfig;
declare function brogueDonut(config: RoomConfig, grid: GWU.grid.NumGrid): Room | RoomConfig;
declare function chunkyRoom(config: RoomConfig, grid: GWU.grid.NumGrid): Room | RoomConfig;

declare const room_d_rooms: typeof rooms;
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
    room_d_rooms as rooms,
    install$1 as install,
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

declare var halls: Record<string, HallData$1>;
declare function install(id: string, fn: HallFn, config?: HallConfig): HallData;
declare function pickWidth(opts?: any): number;
declare function pickLengthRange(dir: number, opts: any): GWU.range.Range;
declare function pickHallDirection(grid: GWU.grid.NumGrid, room: Room, opts: any): number;
declare function pickHallExits(grid: GWU.grid.NumGrid, x: number, y: number, dir: number, opts: any): GWU.types.Loc[];
declare function digWide(opts: HallConfig, grid: GWU.grid.NumGrid, room: Room): Hall | HallConfig | null;
declare function dig(opts: HallConfig, grid: GWU.grid.NumGrid, room: Room): Hall | HallConfig | null;

declare const hall_d_halls: typeof halls;
declare const hall_d_install: typeof install;
declare const hall_d_pickWidth: typeof pickWidth;
declare const hall_d_pickLengthRange: typeof pickLengthRange;
declare const hall_d_pickHallDirection: typeof pickHallDirection;
declare const hall_d_pickHallExits: typeof pickHallExits;
declare const hall_d_digWide: typeof digWide;
declare const hall_d_dig: typeof dig;
declare namespace hall_d {
  export {
    hall_d_halls as halls,
    hall_d_install as install,
    hall_d_pickWidth as pickWidth,
    hall_d_pickLengthRange as pickLengthRange,
    hall_d_pickHallDirection as pickHallDirection,
    hall_d_pickHallExits as pickHallExits,
    hall_d_digWide as digWide,
    hall_d_dig as dig,
  };
}

declare function digLakes(map: GWU.grid.NumGrid, opts?: any): number;
declare function digBridges(map: GWU.grid.NumGrid, minimumPathingDistance: number, maxConnectionLength: number): void;

declare const lake_d_digLakes: typeof digLakes;
declare const lake_d_digBridges: typeof digBridges;
declare namespace lake_d {
  export {
    lake_d_digLakes as digLakes,
    lake_d_digBridges as digBridges,
  };
}

declare function isValidStairLoc(_v: number, x: number, y: number, map: GWU.grid.NumGrid): boolean;
declare function setupStairs(map: GWU.grid.NumGrid, x: number, y: number, tile: number): boolean;
declare function addStairs$1(map: GWU.grid.NumGrid, opts?: any): Record<string, GWU.types.Loc> | null;

declare const stairs_d_isValidStairLoc: typeof isValidStairLoc;
declare const stairs_d_setupStairs: typeof setupStairs;
declare namespace stairs_d {
  export {
    stairs_d_isValidStairLoc as isValidStairLoc,
    stairs_d_setupStairs as setupStairs,
    addStairs$1 as addStairs,
  };
}

declare function attachRoom(map: GWU.grid.NumGrid, roomGrid: GWU.grid.NumGrid, room: Room, opts: DigInfo): boolean;
declare function attachDoor(map: GWU.grid.NumGrid, room: Room, opts: DigInfo, x: number, y: number, dir: number): void;
declare function roomFitsAt(map: GWU.grid.NumGrid, roomGrid: GWU.grid.NumGrid, roomToSiteX: number, roomToSiteY: number): boolean;
declare function directionOfDoorSite(grid: GWU.grid.NumGrid, x: number, y: number, isOpen: number): number;
declare function forceRoomAtMapLoc(map: GWU.grid.NumGrid, xy: GWU.xy.Loc, roomGrid: GWU.grid.NumGrid, room: Room, opts: DigConfig): boolean;
declare function attachRoomAtMapDoor(map: GWU.grid.NumGrid, mapDoors: GWU.xy.Loc[], roomGrid: GWU.grid.NumGrid, room: Room, opts: DigInfo): boolean | GWU.xy.Loc[];
declare function chooseRandomDoorSites(sourceGrid: GWU.grid.NumGrid, floorTile?: number): GWU.xy.Loc[];

declare const utils_d_attachRoom: typeof attachRoom;
declare const utils_d_attachDoor: typeof attachDoor;
declare const utils_d_roomFitsAt: typeof roomFitsAt;
declare const utils_d_directionOfDoorSite: typeof directionOfDoorSite;
declare const utils_d_forceRoomAtMapLoc: typeof forceRoomAtMapLoc;
declare const utils_d_attachRoomAtMapDoor: typeof attachRoomAtMapDoor;
declare const utils_d_chooseRandomDoorSites: typeof chooseRandomDoorSites;
declare namespace utils_d {
  export {
    utils_d_attachRoom as attachRoom,
    utils_d_attachDoor as attachDoor,
    utils_d_roomFitsAt as roomFitsAt,
    utils_d_directionOfDoorSite as directionOfDoorSite,
    utils_d_forceRoomAtMapLoc as forceRoomAtMapLoc,
    utils_d_attachRoomAtMapDoor as attachRoomAtMapDoor,
    utils_d_chooseRandomDoorSites as chooseRandomDoorSites,
  };
}

declare function start(map: GWU.grid.NumGrid): void;
declare function finish(map: GWU.grid.NumGrid): void;
declare function addRoom(map: GWU.grid.NumGrid, opts?: string | DigConfig): Room | null;
declare function addLoops(grid: GWU.grid.NumGrid, minimumPathingDistance: number, maxConnectionLength: number): void;
declare function addLakes(map: GWU.grid.NumGrid, opts?: any): number;
declare function addBridges(map: GWU.grid.NumGrid, minimumPathingDistance: number, maxConnectionLength: number): void;
declare function addStairs(map: GWU.grid.NumGrid, opts?: any): Record<string, GWU.types.Loc> | null;
declare function removeDiagonalOpenings(grid: GWU.grid.NumGrid): void;
declare function finishDoors(grid: GWU.grid.NumGrid): void;
declare function finishWalls(grid: GWU.grid.NumGrid, tile?: number): void;

declare const dig_d_start: typeof start;
declare const dig_d_finish: typeof finish;
declare const dig_d_addRoom: typeof addRoom;
declare const dig_d_addLoops: typeof addLoops;
declare const dig_d_addLakes: typeof addLakes;
declare const dig_d_addBridges: typeof addBridges;
declare const dig_d_addStairs: typeof addStairs;
declare const dig_d_removeDiagonalOpenings: typeof removeDiagonalOpenings;
declare const dig_d_finishDoors: typeof finishDoors;
declare const dig_d_finishWalls: typeof finishWalls;
declare const dig_d_NOTHING: typeof NOTHING;
declare const dig_d_FLOOR: typeof FLOOR;
declare const dig_d_DOOR: typeof DOOR;
declare const dig_d_WALL: typeof WALL;
declare const dig_d_DEEP: typeof DEEP;
declare const dig_d_SHALLOW: typeof SHALLOW;
declare const dig_d_BRIDGE: typeof BRIDGE;
declare const dig_d_UP_STAIRS: typeof UP_STAIRS;
declare const dig_d_DOWN_STAIRS: typeof DOWN_STAIRS;
declare const dig_d_IMPREGNABLE: typeof IMPREGNABLE;
declare const dig_d_TILEMAP: typeof TILEMAP;
declare const dig_d_SEQ: typeof SEQ;
declare const dig_d_initSeqence: typeof initSeqence;
declare const dig_d_fillCostGrid: typeof fillCostGrid;
declare const dig_d_isPassable: typeof isPassable;
declare const dig_d_isNothing: typeof isNothing;
declare const dig_d_isFloor: typeof isFloor;
declare const dig_d_isDoor: typeof isDoor;
declare const dig_d_isBridge: typeof isBridge;
declare const dig_d_isWall: typeof isWall;
declare const dig_d_isObstruction: typeof isObstruction;
declare const dig_d_isStairs: typeof isStairs;
declare const dig_d_isDeep: typeof isDeep;
declare const dig_d_isShallow: typeof isShallow;
declare const dig_d_isAnyWater: typeof isAnyWater;
type dig_d_RoomConfig = RoomConfig;
type dig_d_RoomFn = RoomFn;
type dig_d_HallFn = HallFn;
type dig_d_HallConfig = HallConfig;
type dig_d_DigConfig = DigConfig;
type dig_d_Hall = Hall;
declare const dig_d_Hall: typeof Hall;
type dig_d_Room = Room;
declare const dig_d_Room: typeof Room;
type dig_d_DigInfo = DigInfo;
declare namespace dig_d {
  export {
    dig_d_start as start,
    dig_d_finish as finish,
    dig_d_addRoom as addRoom,
    dig_d_addLoops as addLoops,
    dig_d_addLakes as addLakes,
    dig_d_addBridges as addBridges,
    dig_d_addStairs as addStairs,
    dig_d_removeDiagonalOpenings as removeDiagonalOpenings,
    dig_d_finishDoors as finishDoors,
    dig_d_finishWalls as finishWalls,
    room_d as room,
    hall_d as hall,
    lake_d as lake,
    stairs_d as stairs,
    utils_d as utils,
    dig_d_NOTHING as NOTHING,
    dig_d_FLOOR as FLOOR,
    dig_d_DOOR as DOOR,
    dig_d_WALL as WALL,
    dig_d_DEEP as DEEP,
    dig_d_SHALLOW as SHALLOW,
    dig_d_BRIDGE as BRIDGE,
    dig_d_UP_STAIRS as UP_STAIRS,
    dig_d_DOWN_STAIRS as DOWN_STAIRS,
    dig_d_IMPREGNABLE as IMPREGNABLE,
    dig_d_TILEMAP as TILEMAP,
    dig_d_SEQ as SEQ,
    dig_d_initSeqence as initSeqence,
    dig_d_fillCostGrid as fillCostGrid,
    dig_d_isPassable as isPassable,
    dig_d_isNothing as isNothing,
    dig_d_isFloor as isFloor,
    dig_d_isDoor as isDoor,
    dig_d_isBridge as isBridge,
    dig_d_isWall as isWall,
    dig_d_isObstruction as isObstruction,
    dig_d_isStairs as isStairs,
    dig_d_isDeep as isDeep,
    dig_d_isShallow as isShallow,
    dig_d_isAnyWater as isAnyWater,
    dig_d_RoomConfig as RoomConfig,
    dig_d_RoomFn as RoomFn,
    RoomData$1 as RoomData,
    dig_d_HallFn as HallFn,
    dig_d_HallConfig as HallConfig,
    HallData$1 as HallData,
    dig_d_DigConfig as DigConfig,
    dig_d_Hall as Hall,
    dig_d_Room as Room,
    dig_d_DigInfo as DigInfo,
  };
}

export { dig_d as dig };
