import { utils, grid, range, frequency, flag } from 'gw-utils';

interface RoomConfig {
    door?: boolean | number;
    doorChance?: number;
    tile?: number;
    [x: string]: any;
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
declare enum Flags {
    IS_IN_LOOP,
    IS_CHOKEPOINT,
    IS_GATE_SITE,
    IS_IN_ROOM_MACHINE,
    IS_IN_AREA_MACHINE,
    IMPREGNABLE,
    IS_IN_MACHINE
}
interface Site {
    readonly width: number;
    readonly height: number;
    free: () => void;
    hasXY: utils.XYMatchFunc;
    isBoundaryXY: utils.XYMatchFunc;
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
    getTile: (x: number, y: number) => number;
    hasSiteFlag: (x: number, y: number, flag: number) => boolean;
    setSiteFlag: (x: number, y: number, flag: number) => void;
    clearSiteFlag: (x: number, y: number, flag: number) => void;
    getChokeCount: (x: number, y: number) => number;
    setChokeCount: (x: number, y: number, count: number) => void;
}
declare class GridSite implements Site {
    tiles: grid.NumGrid;
    flags: grid.NumGrid;
    choke: grid.NumGrid;
    constructor(width: number, height: number);
    free(): void;
    get width(): number;
    get height(): number;
    hasXY(x: number, y: number): boolean;
    isBoundaryXY(x: number, y: number): boolean;
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
    getTile(x: number, y: number): number;
    setTile(x: number, y: number, tile: number): void;
    hasSiteFlag(x: number, y: number, flag: number): boolean;
    setSiteFlag(x: number, y: number, flag: number): void;
    clearSiteFlag(x: number, y: number, flag: number): void;
    getChokeCount(x: number, y: number): number;
    setChokeCount(x: number, y: number, count: number): void;
}

declare const site_d_NOTHING: typeof NOTHING;
declare const site_d_FLOOR: typeof FLOOR;
declare const site_d_DOOR: typeof DOOR;
declare const site_d_WALL: typeof WALL;
declare const site_d_DEEP: typeof DEEP;
declare const site_d_SHALLOW: typeof SHALLOW;
declare const site_d_BRIDGE: typeof BRIDGE;
declare const site_d_UP_STAIRS: typeof UP_STAIRS;
declare const site_d_DOWN_STAIRS: typeof DOWN_STAIRS;
declare const site_d_IMPREGNABLE: typeof IMPREGNABLE;
declare const site_d_TILEMAP: typeof TILEMAP;
declare const site_d_SEQ: typeof SEQ;
declare const site_d_initSeqence: typeof initSeqence;
declare const site_d_fillCostGrid: typeof fillCostGrid;
type site_d_Flags = Flags;
declare const site_d_Flags: typeof Flags;
type site_d_Site = Site;
type site_d_GridSite = GridSite;
declare const site_d_GridSite: typeof GridSite;
declare namespace site_d {
  export {
    site_d_NOTHING as NOTHING,
    site_d_FLOOR as FLOOR,
    site_d_DOOR as DOOR,
    site_d_WALL as WALL,
    site_d_DEEP as DEEP,
    site_d_SHALLOW as SHALLOW,
    site_d_BRIDGE as BRIDGE,
    site_d_UP_STAIRS as UP_STAIRS,
    site_d_DOWN_STAIRS as DOWN_STAIRS,
    site_d_IMPREGNABLE as IMPREGNABLE,
    site_d_TILEMAP as TILEMAP,
    site_d_SEQ as SEQ,
    site_d_initSeqence as initSeqence,
    site_d_fillCostGrid as fillCostGrid,
    site_d_Flags as Flags,
    site_d_Site as Site,
    site_d_GridSite as GridSite,
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
declare function choiceRoom(config: RoomConfig, site: Site): Room;
declare class Cavern extends RoomDigger {
    constructor(config?: Partial<RoomConfig>);
    carve(site: Site): Room;
}
declare function cavern(config: RoomConfig, site: Site): Room;
declare class BrogueEntrance extends RoomDigger {
    constructor(config?: Partial<RoomConfig>);
    carve(site: Site): Room;
}
declare function brogueEntrance(config: RoomConfig, site: Site): Room;
declare class Cross extends RoomDigger {
    constructor(config?: Partial<RoomConfig>);
    carve(site: Site): Room;
}
declare function cross(config: RoomConfig, site: Site): Room;
declare class SymmetricalCross extends RoomDigger {
    constructor(config?: Partial<RoomConfig>);
    carve(site: Site): Room;
}
declare function symmetricalCross(config: RoomConfig, site: Site): Room;
declare class Rectangular extends RoomDigger {
    constructor(config?: Partial<RoomConfig>);
    carve(site: Site): Room;
}
declare function rectangular(config: RoomConfig, site: Site): Room;
declare class Circular extends RoomDigger {
    constructor(config?: Partial<RoomConfig>);
    carve(site: Site): Room;
}
declare function circular(config: RoomConfig, site: Site): Room;
declare class BrogueDonut extends RoomDigger {
    constructor(config?: Partial<RoomConfig>);
    carve(site: Site): Room;
}
declare function brogueDonut(config: RoomConfig, site: Site): Room;
declare class ChunkyRoom extends RoomDigger {
    constructor(config?: Partial<RoomConfig>);
    carve(site: Site): Room;
}
declare function chunkyRoom(config: RoomConfig, site: Site): Room;
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
type room_d_BrogueEntrance = BrogueEntrance;
declare const room_d_BrogueEntrance: typeof BrogueEntrance;
declare const room_d_brogueEntrance: typeof brogueEntrance;
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
    room_d_BrogueEntrance as BrogueEntrance,
    room_d_brogueEntrance as brogueEntrance,
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
interface HallConfig {
    width: range.Range;
    length: [range.Range, range.Range];
    tile: number;
    obliqueChance: number;
    chance: number;
}
declare class HallDigger {
    config: HallConfig;
    constructor(options?: Partial<HallOptions>);
    _setOptions(options?: Partial<HallOptions>): void;
    create(site: Site, doors?: utils.Loc[]): Hall | null;
    _digLine(site: Site, door: utils.Loc, dir: utils.Loc, length: number): number[];
    dig(site: Site, dir: number, door: utils.Loc, length: number): Hall;
    digWide(site: Site, dir: number, door: utils.Loc, length: number, width: number): Hall;
}
declare function dig(config: Partial<HallOptions>, site: Site, doors: utils.Loc[]): Hall | null;
declare var halls: Record<string, HallDigger>;
declare function install$1(id: string, hall: HallDigger): HallDigger;

declare const hall_d_isDoorLoc: typeof isDoorLoc;
declare const hall_d_pickWidth: typeof pickWidth;
declare const hall_d_pickLength: typeof pickLength;
declare const hall_d_pickHallDirection: typeof pickHallDirection;
declare const hall_d_pickHallExits: typeof pickHallExits;
type hall_d_HallOptions = HallOptions;
type hall_d_HallConfig = HallConfig;
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
    hall_d_HallConfig as HallConfig,
    hall_d_HallDigger as HallDigger,
    hall_d_dig as dig,
    hall_d_halls as halls,
    install$1 as install,
  };
}

interface LakeOpts {
    height: number;
    width: number;
    minSize: number;
    tries: number;
    count: number;
    canDisrupt: boolean;
    wreathTile: number;
    wreathChance: number;
    wreathSize: number;
    tile: number;
}
declare class Lakes {
    options: LakeOpts;
    constructor(options?: Partial<LakeOpts>);
    create(site: Site): number;
    isDisruptedBy(site: Site, lakeGrid: grid.NumGrid, lakeToMapX?: number, lakeToMapY?: number): boolean;
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
    minDistance: number;
    maxLength: number;
}
declare class Bridges {
    options: BridgeOpts;
    constructor(options?: Partial<BridgeOpts>);
    create(site: Site): number;
    isBridgeCandidate(site: Site, x: number, y: number, bridgeDir: [number, number]): boolean;
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
    create(site: Site): Record<string, [number, number]> | null;
    hasXY(site: Site, x: number, y: number): boolean;
    isStairXY(site: Site, x: number, y: number): boolean;
    setupStairs(site: Site, x: number, y: number, tile: number): boolean;
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

declare function directionOfDoorSite(site: Site, x: number, y: number): number;
declare function chooseRandomDoorSites(site: Site): utils.Loc[];
declare function copySite(dest: Site, source: Site, offsetX?: number, offsetY?: number): void;

declare const utils_d_directionOfDoorSite: typeof directionOfDoorSite;
declare const utils_d_chooseRandomDoorSites: typeof chooseRandomDoorSites;
declare const utils_d_copySite: typeof copySite;
declare namespace utils_d {
  export {
    utils_d_directionOfDoorSite as directionOfDoorSite,
    utils_d_chooseRandomDoorSites as chooseRandomDoorSites,
    utils_d_copySite as copySite,
  };
}

interface LoopOptions {
    minDistance: number;
    maxLength: number;
}
interface LoopConfig {
    minDistance: number;
    maxLength: number;
}
declare class LoopDigger {
    options: LoopConfig;
    constructor(options?: Partial<LoopOptions>);
    create(site: Site): number;
}
declare function digLoops(site: Site, opts?: Partial<LoopOptions>): number;

type loop_d_LoopOptions = LoopOptions;
type loop_d_LoopConfig = LoopConfig;
type loop_d_LoopDigger = LoopDigger;
declare const loop_d_LoopDigger: typeof LoopDigger;
declare const loop_d_digLoops: typeof digLoops;
declare namespace loop_d {
  export {
    loop_d_LoopOptions as LoopOptions,
    loop_d_LoopConfig as LoopConfig,
    loop_d_LoopDigger as LoopDigger,
    loop_d_digLoops as digLoops,
  };
}

interface DoorOpts {
    chance: number;
    tile: number;
}
interface RoomOptions {
    count: number;
    first: string | string[] | Record<string, number> | RoomDigger;
    digger: string | string[] | Record<string, number> | RoomDigger;
}
interface LevelOptions {
    halls?: Partial<HallOptions>;
    loops?: Partial<LoopOptions>;
    lakes?: Partial<LakeOpts>;
    bridges?: Partial<BridgeOpts>;
    stairs?: Partial<StairOpts>;
    doors?: Partial<DoorOpts>;
    rooms: Partial<RoomOptions>;
    startLoc?: utils.Loc;
    endLoc?: utils.Loc;
    seed?: number;
    boundary?: boolean;
}
declare class Level {
    height: number;
    width: number;
    rooms: Partial<RoomOptions>;
    doors: Partial<DoorOpts>;
    halls: Partial<HallOptions>;
    loops: Partial<LoopOptions>;
    lakes: Partial<LakeOpts>;
    bridges: Partial<BridgeOpts>;
    stairs: Partial<StairOpts>;
    boundary: boolean;
    startLoc: utils.Loc;
    endLoc: utils.Loc;
    constructor(width: number, height: number, options?: Partial<LevelOptions>);
    makeSite(width: number, height: number): GridSite;
    create(setFn: DigFn): boolean;
    start(_site: Site): void;
    getDigger(id: string | string[] | Record<string, number> | RoomDigger): RoomDigger;
    addFirstRoom(site: Site): Room | null;
    addRoom(site: Site): Room | null;
    _attachRoom(site: Site, roomSite: Site, room: Room): boolean;
    _attachRoomAtLoc(site: Site, roomSite: Site, room: Room, attachLoc: utils.Loc): boolean;
    _roomFitsAt(map: Site, roomGrid: Site, roomToSiteX: number, roomToSiteY: number): boolean;
    _attachDoor(map: Site, room: Room, x: number, y: number, dir: number): void;
    addLoops(site: Site, opts: Partial<LoopOptions>): number;
    addLakes(site: Site, opts: Partial<LakeOpts>): number;
    addBridges(site: Site, opts: Partial<BridgeOpts>): number;
    addStairs(site: Site, opts: Partial<StairOpts>): Record<string, [number, number]> | null;
    finish(site: Site): void;
    _removeDiagonalOpenings(site: Site): void;
    _finishDoors(site: Site): void;
    _finishWalls(site: Site): void;
}

interface DungeonOptions {
    seed?: number;
    levels: number;
    goesUp?: boolean;
    width: number;
    height: number;
    startLoc?: utils.Loc;
    startTile?: number;
    stairDistance?: number;
    endTile?: number;
    rooms: {
        count: number;
        digger: string | RoomDigger;
        entrance?: string | RoomDigger;
        first?: string | RoomDigger;
    };
    halls: Partial<HallOptions>;
    loops: Partial<LoopOptions>;
    lakes: Partial<LakeOpts>;
    bridges: Partial<BridgeOpts>;
    stairs: Partial<StairOpts>;
    boundary: boolean;
}
declare type LocPair = [utils.Loc, utils.Loc];
declare class Dungeon {
    config: DungeonOptions;
    seeds: number[];
    stairLocs: LocPair[];
    constructor(options?: Partial<DungeonOptions>);
    get levels(): number;
    initSeeds(): void;
    initStairLocs(): void;
    getLevel(id: number, cb: DigFn): boolean;
    makeLevel(id: number, opts: Partial<LevelOptions>, cb: DigFn): boolean;
}

type index_d_RoomConfig = RoomConfig;
type index_d_DigFn = DigFn;
type index_d_Hall = Hall;
declare const index_d_Hall: typeof Hall;
type index_d_Room = Room;
declare const index_d_Room: typeof Room;
type index_d_DoorOpts = DoorOpts;
type index_d_RoomOptions = RoomOptions;
type index_d_LevelOptions = LevelOptions;
type index_d_Level = Level;
declare const index_d_Level: typeof Level;
type index_d_DungeonOptions = DungeonOptions;
type index_d_LocPair = LocPair;
type index_d_Dungeon = Dungeon;
declare const index_d_Dungeon: typeof Dungeon;
declare namespace index_d {
  export {
    room_d as room,
    hall_d as hall,
    lake_d as lake,
    bridge_d as bridge,
    stairs_d as stairs,
    utils_d as utils,
    loop_d as loop,
    index_d_RoomConfig as RoomConfig,
    index_d_DigFn as DigFn,
    index_d_Hall as Hall,
    index_d_Room as Room,
    index_d_DoorOpts as DoorOpts,
    index_d_RoomOptions as RoomOptions,
    index_d_LevelOptions as LevelOptions,
    index_d_Level as Level,
    index_d_DungeonOptions as DungeonOptions,
    index_d_LocPair as LocPair,
    index_d_Dungeon as Dungeon,
  };
}

declare enum Flags$1 {
    BP_ROOM,
    BP_VESTIBULE,
    BP_REWARD,
    BP_ADOPT_ITEM,
    BP_PURGE_PATHING_BLOCKERS,
    BP_PURGE_INTERIOR,
    BP_PURGE_LIQUIDS,
    BP_SURROUND_WITH_WALLS,
    BP_IMPREGNABLE,
    BP_OPEN_INTERIOR,
    BP_MAXIMIZE_INTERIOR,
    BP_REDESIGN_INTERIOR,
    BP_TREAT_AS_BLOCKING,
    BP_REQUIRE_BLOCKING,
    BP_NO_INTERIOR_FLAG
}
interface Options {
    tags: string | string[];
    frequency: frequency.FrequencyConfig;
    size: string | number[];
    flags: flag.FlagBase;
}
declare class Blueprint {
    tags: string[];
    frequency: frequency.FrequencyFn;
    size: [number, number];
    flags: number;
    constructor(opts?: Partial<Options>);
    getChance(level: number, tags?: string | string[]): number;
    get isRoom(): number;
    get isReward(): number;
    get isVestiblue(): number;
    get adoptsItem(): number;
}
declare const blueprints: Record<string, Blueprint>;
declare function install$2(id: string, blueprint: Blueprint): void;

type blueprint_d_Options = Options;
type blueprint_d_Blueprint = Blueprint;
declare const blueprint_d_Blueprint: typeof Blueprint;
declare const blueprint_d_blueprints: typeof blueprints;
declare namespace blueprint_d {
  export {
    Flags$1 as Flags,
    blueprint_d_Options as Options,
    blueprint_d_Blueprint as Blueprint,
    blueprint_d_blueprints as blueprints,
    install$2 as install,
  };
}

declare class LoopFinder {
    constructor();
    compute(site: Site): void;
    _initGrid(site: Site): void;
    _checkCell(site: Site, x: number, y: number): false | undefined;
    _fillInnerLoopGrid(site: Site, innerGrid: grid.NumGrid): void;
    _update(site: Site): void;
}

declare class ChokeFinder {
    withCounts: boolean;
    constructor(withCounts?: boolean);
    compute(site: Site): void;
}
declare function floodFillCount(site: Site, results: grid.NumGrid, passMap: grid.NumGrid, startX: number, startY: number): number;

declare function analyze(site: Site): void;

declare const index_d$1_analyze: typeof analyze;
type index_d$1_LoopFinder = LoopFinder;
declare const index_d$1_LoopFinder: typeof LoopFinder;
type index_d$1_ChokeFinder = ChokeFinder;
declare const index_d$1_ChokeFinder: typeof ChokeFinder;
declare const index_d$1_floodFillCount: typeof floodFillCount;
declare namespace index_d$1 {
  export {
    index_d$1_analyze as analyze,
    blueprint_d as blueprint,
    index_d$1_LoopFinder as LoopFinder,
    index_d$1_ChokeFinder as ChokeFinder,
    index_d$1_floodFillCount as floodFillCount,
  };
}

export { index_d$1 as build, index_d as dig, site_d as site };
