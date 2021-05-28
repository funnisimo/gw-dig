import { grid, range, utils } from 'gw-utils';

interface RoomConfig {
    fn?: RoomFn;
    door?: boolean | number;
    doorChance?: number;
    tile?: number;
    [x: string]: any;
}
declare type RoomFn = (config: RoomConfig, grid: grid.NumGrid) => Room | RoomConfig | null;
interface RoomData extends RoomConfig {
    fn: RoomFn;
    id: string;
}
declare type HallFn = (opts: HallConfig, grid: grid.NumGrid, room: Room) => Hall | any | null;
interface HallConfig {
    fn?: HallFn;
    chance?: number;
    length?: range.RangeBase | [range.RangeBase, range.RangeBase];
    width?: range.RangeBase;
    tile?: number;
    [x: string]: any;
}
interface HallData extends HallConfig {
    fn: HallFn;
    id: string;
}
interface DigConfig {
    room: string | any;
    hall?: string | HallConfig | boolean;
    tries?: number;
    locs?: utils.Loc[];
    loc?: utils.Loc;
    door?: number | boolean;
}
declare type DigFn = (x: number, y: number, tile: number) => any;
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
declare class Room extends utils.Bounds {
    doors: utils.Loc[];
    hall: Hall | null;
    constructor(x: number, y: number, width: number, height: number);
    get cx(): number;
    get cy(): number;
    translate(dx: number, dy: number): void;
}
interface DigInfo {
    room: RoomData;
    hall: HallData | null;
    tries: number;
    locs: utils.Loc[] | null;
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
declare function fillCostGrid(source: Site, costGrid: grid.NumGrid): void;
interface Site {
    readonly width: number;
    readonly height: number;
    hasXY: utils.XYMatchFunc;
    isSet: utils.XYMatchFunc;
    isDiggable: utils.XYMatchFunc;
    isNothing: utils.XYMatchFunc;
    isPassable: utils.XYMatchFunc;
    isFloor: utils.XYMatchFunc;
    isDoor: utils.XYMatchFunc;
    isBridge: utils.XYMatchFunc;
    isObstruction: utils.XYMatchFunc;
    isWall: utils.XYMatchFunc;
    isStairs: utils.XYMatchFunc;
    isDeep: utils.XYMatchFunc;
    isShallow: utils.XYMatchFunc;
    isAnyWater: utils.XYMatchFunc;
    setTile: (x: number, y: number, tile: number) => void;
}
declare class GridSite implements Site {
    grid: grid.NumGrid;
    constructor(grid: grid.NumGrid);
    get width(): number;
    get height(): number;
    hasXY(x: number, y: number): boolean;
    isPassable(x: number, y: number): boolean;
    isNothing(x: number, y: number): boolean;
    isDiggable(x: number, y: number): boolean;
    isFloor(x: number, y: number): boolean;
    isDoor(x: number, y: number): boolean;
    isBridge(x: number, y: number): boolean;
    isWall(x: number, y: number): boolean;
    isObstruction(x: number, y: number): boolean;
    isStairs(x: number, y: number): boolean;
    isDeep(x: number, y: number): boolean;
    isShallow(x: number, y: number): boolean;
    isAnyWater(x: number, y: number): boolean;
    isSet(x: number, y: number): boolean;
    setTile(x: number, y: number, tile: number): void;
}

interface LakeOpts {
    height: number;
    width: number;
    minSize: number;
    tries: number;
    count: number;
    canDisrupt: boolean;
    wreath: number;
    wreathTile: number;
    tile: number;
}
declare class Lakes {
    options: LakeOpts;
    constructor(options?: Partial<LakeOpts>);
    create(site: GridSite): number;
    isDisruptedBy(site: GridSite, lakeGrid: grid.NumGrid, lakeToMapX?: number, lakeToMapY?: number): boolean;
}

type lake_d_LakeOpts = LakeOpts;
type lake_d_Lakes = Lakes;
declare const lake_d_Lakes: typeof Lakes;
declare namespace lake_d {
  export {
    lake_d_LakeOpts as LakeOpts,
    lake_d_Lakes as Lakes,
  };
}

interface BridgeOpts {
    minimumPathingDistance: number;
    maxConnectionLength: number;
}
declare class Bridges {
    options: BridgeOpts;
    constructor(options?: Partial<BridgeOpts>);
    create(site: GridSite): number;
    isBridgeCandidate(site: GridSite, x: number, y: number, bridgeDir: [number, number]): boolean;
}

type bridge_d_BridgeOpts = BridgeOpts;
type bridge_d_Bridges = Bridges;
declare const bridge_d_Bridges: typeof Bridges;
declare namespace bridge_d {
  export {
    bridge_d_BridgeOpts as BridgeOpts,
    bridge_d_Bridges as Bridges,
  };
}

interface StairOpts {
    up: boolean | utils.Loc;
    down: boolean | utils.Loc;
    minDistance: number;
    start: boolean | string | utils.Loc;
    upTile: number;
    downTile: number;
    wall: number;
}
declare class Stairs {
    options: StairOpts;
    constructor(options?: Partial<StairOpts>);
    create(site: GridSite): Record<string, [number, number]> | null;
    hasXY(site: GridSite, x: number, y: number): boolean;
    isStairXY(site: GridSite, x: number, y: number): boolean;
    setupStairs(site: GridSite, x: number, y: number, tile: number): boolean;
}

type stairs_d_StairOpts = StairOpts;
type stairs_d_Stairs = Stairs;
declare const stairs_d_Stairs: typeof Stairs;
declare namespace stairs_d {
  export {
    stairs_d_StairOpts as StairOpts,
    stairs_d_Stairs as Stairs,
  };
}

declare function checkConfig(config: RoomConfig, expected?: RoomConfig): RoomConfig;
declare abstract class RoomDigger {
    options: RoomConfig;
    doors: utils.Loc[];
    constructor(config: RoomConfig, expected?: RoomConfig);
    _setOptions(config: RoomConfig, expected?: RoomConfig): void;
    create(site: Site): Room;
    abstract carve(site: Site): Room;
}
declare var rooms: Record<string, RoomDigger>;
declare class ChoiceRoom extends RoomDigger {
    randomRoom: () => any;
    constructor(config?: RoomConfig);
    _setOptions(config: RoomConfig, expected?: RoomConfig): void;
    carve(site: Site): Room;
}
declare function choiceRoom(config: RoomConfig, grid: grid.NumGrid): Room;
declare class Cavern extends RoomDigger {
    constructor(config?: Partial<RoomConfig>);
    carve(site: Site): Room;
}
declare function cavern(config: RoomConfig, grid: grid.NumGrid): Room;
declare class Entrance extends RoomDigger {
    constructor(config?: Partial<RoomConfig>);
    carve(site: Site): Room;
}
declare function entrance(config: RoomConfig, grid: grid.NumGrid): Room;
declare class Cross extends RoomDigger {
    constructor(config?: Partial<RoomConfig>);
    carve(site: Site): Room;
}
declare function cross(config: RoomConfig, grid: grid.NumGrid): Room;
declare class SymmetricalCross extends RoomDigger {
    constructor(config?: Partial<RoomConfig>);
    carve(site: Site): Room;
}
declare function symmetricalCross(config: RoomConfig, grid: grid.NumGrid): Room;
declare class Rectangular extends RoomDigger {
    constructor(config?: Partial<RoomConfig>);
    carve(site: Site): Room;
}
declare function rectangular(config: RoomConfig, grid: grid.NumGrid): Room;
declare class Circular extends RoomDigger {
    constructor(config?: Partial<RoomConfig>);
    carve(site: Site): Room;
}
declare function circular(config: RoomConfig, grid: grid.NumGrid): Room;
declare class BrogueDonut extends RoomDigger {
    constructor(config?: Partial<RoomConfig>);
    carve(site: Site): Room;
}
declare function brogueDonut(config: RoomConfig, grid: grid.NumGrid): Room;
declare class ChunkyRoom extends RoomDigger {
    constructor(config?: Partial<RoomConfig>);
    carve(site: Site): Room;
}
declare function chunkyRoom(config: RoomConfig, grid: grid.NumGrid): Room;
declare function install(id: string, room: RoomDigger): RoomDigger;

declare const room_d_checkConfig: typeof checkConfig;
type room_d_RoomDigger = RoomDigger;
declare const room_d_RoomDigger: typeof RoomDigger;
declare const room_d_rooms: typeof rooms;
type room_d_ChoiceRoom = ChoiceRoom;
declare const room_d_ChoiceRoom: typeof ChoiceRoom;
declare const room_d_choiceRoom: typeof choiceRoom;
type room_d_Cavern = Cavern;
declare const room_d_Cavern: typeof Cavern;
declare const room_d_cavern: typeof cavern;
type room_d_Entrance = Entrance;
declare const room_d_Entrance: typeof Entrance;
declare const room_d_entrance: typeof entrance;
type room_d_Cross = Cross;
declare const room_d_Cross: typeof Cross;
declare const room_d_cross: typeof cross;
type room_d_SymmetricalCross = SymmetricalCross;
declare const room_d_SymmetricalCross: typeof SymmetricalCross;
declare const room_d_symmetricalCross: typeof symmetricalCross;
type room_d_Rectangular = Rectangular;
declare const room_d_Rectangular: typeof Rectangular;
declare const room_d_rectangular: typeof rectangular;
type room_d_Circular = Circular;
declare const room_d_Circular: typeof Circular;
declare const room_d_circular: typeof circular;
type room_d_BrogueDonut = BrogueDonut;
declare const room_d_BrogueDonut: typeof BrogueDonut;
declare const room_d_brogueDonut: typeof brogueDonut;
type room_d_ChunkyRoom = ChunkyRoom;
declare const room_d_ChunkyRoom: typeof ChunkyRoom;
declare const room_d_chunkyRoom: typeof chunkyRoom;
declare const room_d_install: typeof install;
declare namespace room_d {
  export {
    room_d_checkConfig as checkConfig,
    room_d_RoomDigger as RoomDigger,
    room_d_rooms as rooms,
    room_d_ChoiceRoom as ChoiceRoom,
    room_d_choiceRoom as choiceRoom,
    room_d_Cavern as Cavern,
    room_d_cavern as cavern,
    room_d_Entrance as Entrance,
    room_d_entrance as entrance,
    room_d_Cross as Cross,
    room_d_cross as cross,
    room_d_SymmetricalCross as SymmetricalCross,
    room_d_symmetricalCross as symmetricalCross,
    room_d_Rectangular as Rectangular,
    room_d_rectangular as rectangular,
    room_d_Circular as Circular,
    room_d_circular as circular,
    room_d_BrogueDonut as BrogueDonut,
    room_d_brogueDonut as brogueDonut,
    room_d_ChunkyRoom as ChunkyRoom,
    room_d_chunkyRoom as chunkyRoom,
    room_d_install as install,
  };
}

declare function isDoorLoc(site: Site, loc: utils.Loc, dir: utils.Loc): boolean;
declare function pickWidth(opts?: any): number;
declare function pickLength(dir: number, lengths: [range.Range, range.Range]): number;
declare function pickHallDirection(site: Site, doors: utils.Loc[], lengths: [range.Range, range.Range]): number;
declare function pickHallExits(site: Site, x: number, y: number, dir: number, obliqueChance: number): [number, number][];
interface HallOptions {
    width: number | string;
    length: number | string | number[] | string[];
    tile: number;
    obliqueChance: number;
    chance: number;
}
interface HallConfig$1 {
    width: range.Range;
    length: [range.Range, range.Range];
    tile: number;
    obliqueChance: number;
    chance: number;
}
declare class HallDigger {
    config: HallConfig$1;
    constructor(options?: Partial<HallOptions>);
    _setOptions(options?: Partial<HallOptions>): void;
    create(site: Site, doors?: utils.Loc[]): Hall | null;
    _digLine(site: Site, door: utils.Loc, dir: utils.Loc, length: number): number[];
    dig(site: Site, dir: number, door: utils.Loc, length: number): Hall;
    digWide(site: Site, dir: number, door: utils.Loc, length: number, width: number): Hall;
}
declare function dig(config: Partial<HallOptions>, site: Site, doors: utils.Loc[]): Hall | null;
declare var halls: Record<string, HallData>;
declare function install$1(id: string, hall: HallDigger): HallDigger;

declare const hall_d_isDoorLoc: typeof isDoorLoc;
declare const hall_d_pickWidth: typeof pickWidth;
declare const hall_d_pickLength: typeof pickLength;
declare const hall_d_pickHallDirection: typeof pickHallDirection;
declare const hall_d_pickHallExits: typeof pickHallExits;
type hall_d_HallOptions = HallOptions;
type hall_d_HallDigger = HallDigger;
declare const hall_d_HallDigger: typeof HallDigger;
declare const hall_d_dig: typeof dig;
declare const hall_d_halls: typeof halls;
declare namespace hall_d {
  export {
    hall_d_isDoorLoc as isDoorLoc,
    hall_d_pickWidth as pickWidth,
    hall_d_pickLength as pickLength,
    hall_d_pickHallDirection as pickHallDirection,
    hall_d_pickHallExits as pickHallExits,
    hall_d_HallOptions as HallOptions,
    HallConfig$1 as HallConfig,
    hall_d_HallDigger as HallDigger,
    hall_d_dig as dig,
    hall_d_halls as halls,
    install$1 as install,
  };
}

declare function attachRoom(map: grid.NumGrid, roomGrid: grid.NumGrid, room: Room, opts: DigInfo): boolean;
declare function attachDoor(map: grid.NumGrid, room: Room, opts: DigInfo, x: number, y: number, dir: number): void;
declare function roomFitsAt(map: grid.NumGrid, roomGrid: grid.NumGrid, roomToSiteX: number, roomToSiteY: number): boolean;
declare function directionOfDoorSite(site: Site, x: number, y: number): number;
declare function chooseRandomDoorSites(site: Site): utils.Loc[];
declare function forceRoomAtMapLoc(map: grid.NumGrid, xy: utils.Loc, roomGrid: grid.NumGrid, room: Room, opts: DigConfig): boolean;
declare function attachRoomAtMapDoor(map: grid.NumGrid, mapDoors: utils.Loc[], roomGrid: grid.NumGrid, room: Room, opts: DigInfo): boolean | utils.Loc[];

declare const utils_d_attachRoom: typeof attachRoom;
declare const utils_d_attachDoor: typeof attachDoor;
declare const utils_d_roomFitsAt: typeof roomFitsAt;
declare const utils_d_directionOfDoorSite: typeof directionOfDoorSite;
declare const utils_d_chooseRandomDoorSites: typeof chooseRandomDoorSites;
declare const utils_d_forceRoomAtMapLoc: typeof forceRoomAtMapLoc;
declare const utils_d_attachRoomAtMapDoor: typeof attachRoomAtMapDoor;
declare namespace utils_d {
  export {
    utils_d_attachRoom as attachRoom,
    utils_d_attachDoor as attachDoor,
    utils_d_roomFitsAt as roomFitsAt,
    utils_d_directionOfDoorSite as directionOfDoorSite,
    utils_d_chooseRandomDoorSites as chooseRandomDoorSites,
    utils_d_forceRoomAtMapLoc as forceRoomAtMapLoc,
    utils_d_attachRoomAtMapDoor as attachRoomAtMapDoor,
  };
}

declare function start(map: grid.NumGrid): void;
declare function finish(map: grid.NumGrid): void;
declare function addRoom(map: grid.NumGrid, opts?: string | DigConfig): Room | null;
declare function addLoops(grid: grid.NumGrid, minimumPathingDistance: number, maxConnectionLength: number): void;
declare function addLakes(map: grid.NumGrid, opts?: Partial<LakeOpts>): number;
declare function addBridges(grid: grid.NumGrid, opts?: Partial<BridgeOpts>): number;
declare function addStairs(grid: grid.NumGrid, opts?: Partial<StairOpts>): Record<string, [number, number]> | null;
declare function removeDiagonalOpenings(grid: grid.NumGrid): void;
declare function finishDoors(grid: grid.NumGrid): void;
declare function finishWalls(grid: grid.NumGrid, tile?: number): void;

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
type dig_d_Site = Site;
type dig_d_GridSite = GridSite;
declare const dig_d_GridSite: typeof GridSite;
type dig_d_RoomConfig = RoomConfig;
type dig_d_RoomFn = RoomFn;
type dig_d_RoomData = RoomData;
type dig_d_HallFn = HallFn;
type dig_d_HallConfig = HallConfig;
type dig_d_HallData = HallData;
type dig_d_DigConfig = DigConfig;
type dig_d_DigFn = DigFn;
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
    bridge_d as bridge,
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
    dig_d_Site as Site,
    dig_d_GridSite as GridSite,
    dig_d_RoomConfig as RoomConfig,
    dig_d_RoomFn as RoomFn,
    dig_d_RoomData as RoomData,
    dig_d_HallFn as HallFn,
    dig_d_HallConfig as HallConfig,
    dig_d_HallData as HallData,
    dig_d_DigConfig as DigConfig,
    dig_d_DigFn as DigFn,
    dig_d_Hall as Hall,
    dig_d_Room as Room,
    dig_d_DigInfo as DigInfo,
  };
}

export { dig_d as dig };
