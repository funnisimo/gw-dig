import * as GW from 'gw-utils';

declare const NOTHING: number;
declare const FLOOR: number;
declare const DOOR: number;
declare const SECRET_DOOR: number;
declare const WALL: number;
declare const DEEP: number;
declare const SHALLOW: number;
declare const BRIDGE: number;
declare const UP_STAIRS: number;
declare const DOWN_STAIRS: number;
declare const IMPREGNABLE: number;
declare const TILEMAP: {
    [x: number]: string;
};
interface DigSite {
    readonly width: number;
    readonly height: number;
    free: () => void;
    hasXY: GW.utils.XYMatchFunc;
    isBoundaryXY: GW.utils.XYMatchFunc;
    isSet: GW.utils.XYMatchFunc;
    isDiggable: GW.utils.XYMatchFunc;
    isNothing: GW.utils.XYMatchFunc;
    isPassable: GW.utils.XYMatchFunc;
    isFloor: GW.utils.XYMatchFunc;
    isBridge: GW.utils.XYMatchFunc;
    isDoor: GW.utils.XYMatchFunc;
    isSecretDoor: GW.utils.XYMatchFunc;
    blocksMove: GW.utils.XYMatchFunc;
    blocksDiagonal: GW.utils.XYMatchFunc;
    blocksPathing: GW.utils.XYMatchFunc;
    blocksVision: GW.utils.XYMatchFunc;
    blocksItems: GW.utils.XYMatchFunc;
    blocksEffects: GW.utils.XYMatchFunc;
    isWall: GW.utils.XYMatchFunc;
    isStairs: GW.utils.XYMatchFunc;
    isDeep: GW.utils.XYMatchFunc;
    isShallow: GW.utils.XYMatchFunc;
    isAnyLiquid: GW.utils.XYMatchFunc;
    setTile(x: number, y: number, tile: string | number | GW.tile.Tile, opts?: GW.map.SetTileOptions): boolean;
    hasTile: (x: number, y: number, tile: string | number | GW.tile.Tile) => boolean;
    getTileIndex: (x: number, y: number) => number;
    tileBlocksMove: (tile: number) => boolean;
}
declare class GridSite implements DigSite {
    tiles: GW.grid.NumGrid;
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
    isSecretDoor(x: number, y: number): boolean;
    isBridge(x: number, y: number): boolean;
    isWall(x: number, y: number): boolean;
    blocksMove(x: number, y: number): boolean;
    blocksDiagonal(x: number, y: number): boolean;
    blocksPathing(x: number, y: number): boolean;
    blocksVision(x: number, y: number): boolean;
    blocksItems(x: number, y: number): boolean;
    blocksEffects(x: number, y: number): boolean;
    isStairs(x: number, y: number): boolean;
    isDeep(x: number, y: number): boolean;
    isShallow(x: number, y: number): boolean;
    isAnyLiquid(x: number, y: number): boolean;
    isSet(x: number, y: number): boolean;
    getTileIndex(x: number, y: number): number;
    setTile(x: number, y: number, tile: number | string | GW.tile.Tile): boolean;
    hasTile(x: number, y: number, tile: number | string | GW.tile.Tile): boolean;
    tileBlocksMove(tile: number): boolean;
}

interface BuildSite extends DigSite, GW.map.MapType {
    getChokeCount: (x: number, y: number) => number;
    setChokeCount: (x: number, y: number, count: number) => void;
    isOccupied: GW.utils.XYMatchFunc;
    hasItem: GW.utils.XYMatchFunc;
    hasActor: GW.utils.XYMatchFunc;
    analyze(): void;
    backup: () => any;
    restore: (backup: any) => void;
    nextMachineId: () => number;
    getMachine: (x: number, y: number) => number;
    setMachine: (x: number, y: number, id: number, isRoom?: boolean) => void;
}
declare class MapSite extends GW.map.Map implements BuildSite {
    machineId: GW.grid.NumGrid;
    machineCount: number;
    constructor(width: number, height: number);
    hasItem(x: number, y: number): boolean;
    isPassable(x: number, y: number): boolean;
    blocksMove(x: number, y: number): boolean;
    isWall(x: number, y: number): boolean;
    isStairs(x: number, y: number): boolean;
    hasTile(x: number, y: number, tile: string | number | GW.tile.Tile): boolean;
    free(): void;
    isSet(x: number, y: number): boolean;
    isDiggable(x: number, y: number): boolean;
    isNothing(x: number, y: number): boolean;
    isFloor(x: number, y: number): boolean;
    isBridge(x: number, y: number): boolean;
    isDoor(x: number, y: number): boolean;
    isSecretDoor(x: number, y: number): boolean;
    blocksDiagonal(x: number, y: number): boolean;
    blocksPathing(x: number, y: number): boolean;
    blocksItems(x: number, y: number): boolean;
    blocksEffects(x: number, y: number): boolean;
    isDeep(x: number, y: number): boolean;
    isShallow(x: number, y: number): boolean;
    isAnyLiquid(x: number, y: number): boolean;
    getTileIndex(x: number, y: number): number;
    tileBlocksMove(tile: number): boolean;
    backup(): MapSite;
    restore(backup: MapSite): void;
    getChokeCount(x: number, y: number): number;
    setChokeCount(x: number, y: number, count: number): void;
    isOccupied(x: number, y: number): boolean;
    analyze(): void;
    nextMachineId(): number;
    getMachine(x: number, y: number): number;
    setMachine(x: number, y: number, id: number, isRoom?: boolean): void;
}

declare function directionOfDoorSite(site: DigSite, x: number, y: number): number;
declare function chooseRandomDoorSites(site: DigSite): GW.utils.Loc[];
declare function copySite(dest: DigSite, source: DigSite, offsetX?: number, offsetY?: number): void;
declare function fillCostGrid(source: DigSite, costGrid: GW.grid.NumGrid): void;
declare function siteDisruptedBy(site: DigSite, blockingGrid: GW.grid.NumGrid, blockingToMapX?: number, blockingToMapY?: number): boolean;
declare function siteDisruptedSize(site: DigSite, blockingGrid: GW.grid.NumGrid, blockingToMapX?: number, blockingToMapY?: number): number;
declare function computeDistanceMap(site: DigSite, distanceMap: GW.grid.NumGrid, originX: number, originY: number, maxDistance: number): void;

declare const index_d$1_NOTHING: typeof NOTHING;
declare const index_d$1_FLOOR: typeof FLOOR;
declare const index_d$1_DOOR: typeof DOOR;
declare const index_d$1_SECRET_DOOR: typeof SECRET_DOOR;
declare const index_d$1_WALL: typeof WALL;
declare const index_d$1_DEEP: typeof DEEP;
declare const index_d$1_SHALLOW: typeof SHALLOW;
declare const index_d$1_BRIDGE: typeof BRIDGE;
declare const index_d$1_UP_STAIRS: typeof UP_STAIRS;
declare const index_d$1_DOWN_STAIRS: typeof DOWN_STAIRS;
declare const index_d$1_IMPREGNABLE: typeof IMPREGNABLE;
declare const index_d$1_TILEMAP: typeof TILEMAP;
type index_d$1_DigSite = DigSite;
type index_d$1_GridSite = GridSite;
declare const index_d$1_GridSite: typeof GridSite;
type index_d$1_BuildSite = BuildSite;
type index_d$1_MapSite = MapSite;
declare const index_d$1_MapSite: typeof MapSite;
declare const index_d$1_directionOfDoorSite: typeof directionOfDoorSite;
declare const index_d$1_chooseRandomDoorSites: typeof chooseRandomDoorSites;
declare const index_d$1_copySite: typeof copySite;
declare const index_d$1_fillCostGrid: typeof fillCostGrid;
declare const index_d$1_siteDisruptedBy: typeof siteDisruptedBy;
declare const index_d$1_siteDisruptedSize: typeof siteDisruptedSize;
declare const index_d$1_computeDistanceMap: typeof computeDistanceMap;
declare namespace index_d$1 {
  export {
    index_d$1_NOTHING as NOTHING,
    index_d$1_FLOOR as FLOOR,
    index_d$1_DOOR as DOOR,
    index_d$1_SECRET_DOOR as SECRET_DOOR,
    index_d$1_WALL as WALL,
    index_d$1_DEEP as DEEP,
    index_d$1_SHALLOW as SHALLOW,
    index_d$1_BRIDGE as BRIDGE,
    index_d$1_UP_STAIRS as UP_STAIRS,
    index_d$1_DOWN_STAIRS as DOWN_STAIRS,
    index_d$1_IMPREGNABLE as IMPREGNABLE,
    index_d$1_TILEMAP as TILEMAP,
    index_d$1_DigSite as DigSite,
    index_d$1_GridSite as GridSite,
    index_d$1_BuildSite as BuildSite,
    index_d$1_MapSite as MapSite,
    index_d$1_directionOfDoorSite as directionOfDoorSite,
    index_d$1_chooseRandomDoorSites as chooseRandomDoorSites,
    index_d$1_copySite as copySite,
    index_d$1_fillCostGrid as fillCostGrid,
    index_d$1_siteDisruptedBy as siteDisruptedBy,
    index_d$1_siteDisruptedSize as siteDisruptedSize,
    index_d$1_computeDistanceMap as computeDistanceMap,
  };
}

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
    doors: GW.utils.Loc[];
    constructor(loc: GW.utils.Loc, dir: number, length: number, width?: number);
    translate(dx: number, dy: number): void;
}
declare class Room extends GW.utils.Bounds {
    doors: GW.utils.Loc[];
    hall: Hall | null;
    constructor(x: number, y: number, width: number, height: number);
    get cx(): number;
    get cy(): number;
    translate(dx: number, dy: number): void;
}

declare function checkConfig(config: RoomConfig, expected?: RoomConfig): RoomConfig;
declare abstract class RoomDigger {
    options: RoomConfig;
    doors: GW.utils.Loc[];
    constructor(config: RoomConfig, expected?: RoomConfig);
    _setOptions(config: RoomConfig, expected?: RoomConfig): void;
    create(site: DigSite): Room;
    abstract carve(site: DigSite): Room;
}
declare var rooms: Record<string, RoomDigger>;
declare class ChoiceRoom extends RoomDigger {
    randomRoom: () => any;
    constructor(config?: RoomConfig);
    _setOptions(config: RoomConfig, expected?: RoomConfig): void;
    carve(site: DigSite): Room;
}
declare function choiceRoom(config: RoomConfig, site: DigSite): Room;
declare class Cavern extends RoomDigger {
    constructor(config?: Partial<RoomConfig>);
    carve(site: DigSite): Room;
}
declare function cavern(config: RoomConfig, site: DigSite): Room;
declare class BrogueEntrance extends RoomDigger {
    constructor(config?: Partial<RoomConfig>);
    carve(site: DigSite): Room;
}
declare function brogueEntrance(config: RoomConfig, site: DigSite): Room;
declare class Cross extends RoomDigger {
    constructor(config?: Partial<RoomConfig>);
    carve(site: DigSite): Room;
}
declare function cross(config: RoomConfig, site: DigSite): Room;
declare class SymmetricalCross extends RoomDigger {
    constructor(config?: Partial<RoomConfig>);
    carve(site: DigSite): Room;
}
declare function symmetricalCross(config: RoomConfig, site: DigSite): Room;
declare class Rectangular extends RoomDigger {
    constructor(config?: Partial<RoomConfig>);
    carve(site: DigSite): Room;
}
declare function rectangular(config: RoomConfig, site: DigSite): Room;
declare class Circular extends RoomDigger {
    constructor(config?: Partial<RoomConfig>);
    carve(site: DigSite): Room;
}
declare function circular(config: RoomConfig, site: DigSite): Room;
declare class BrogueDonut extends RoomDigger {
    constructor(config?: Partial<RoomConfig>);
    carve(site: DigSite): Room;
}
declare function brogueDonut(config: RoomConfig, site: DigSite): Room;
declare class ChunkyRoom extends RoomDigger {
    constructor(config?: Partial<RoomConfig>);
    carve(site: DigSite): Room;
}
declare function chunkyRoom(config: RoomConfig, site: DigSite): Room;
declare function install$2(id: string, room: RoomDigger): RoomDigger;

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
    install$2 as install,
  };
}

declare function isDoorLoc(site: DigSite, loc: GW.utils.Loc, dir: GW.utils.Loc): boolean;
declare function pickWidth(opts?: any): number;
declare function pickLength(dir: number, lengths: [GW.range.Range, GW.range.Range]): number;
declare function pickHallDirection(site: DigSite, doors: GW.utils.Loc[], lengths: [GW.range.Range, GW.range.Range]): number;
declare function pickHallExits(site: DigSite, x: number, y: number, dir: number, obliqueChance: number): GW.types.Loc[];
interface HallOptions {
    width: number | string;
    length: number | string | number[] | string[];
    tile: number;
    obliqueChance: number;
    chance: number;
}
interface HallConfig {
    width: GW.range.Range;
    length: [GW.range.Range, GW.range.Range];
    tile: number;
    obliqueChance: number;
    chance: number;
}
declare class HallDigger {
    config: HallConfig;
    constructor(options?: Partial<HallOptions>);
    _setOptions(options?: Partial<HallOptions>): void;
    create(site: DigSite, doors?: GW.utils.Loc[]): Hall | null;
    _digLine(site: DigSite, door: GW.utils.Loc, dir: GW.utils.Loc, length: number): number[];
    dig(site: DigSite, dir: number, door: GW.utils.Loc, length: number): Hall;
    digWide(site: DigSite, dir: number, door: GW.utils.Loc, length: number, width: number): Hall;
}
declare function dig(config: Partial<HallOptions>, site: DigSite, doors: GW.utils.Loc[]): Hall | null;
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
    create(site: DigSite): number;
    isDisruptedBy(site: DigSite, lakeGrid: GW.grid.NumGrid, lakeToMapX?: number, lakeToMapY?: number): boolean;
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
    create(site: DigSite): number;
    isBridgeCandidate(site: DigSite, x: number, y: number, bridgeDir: [number, number]): boolean;
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
    up: boolean | GW.utils.Loc;
    down: boolean | GW.utils.Loc;
    minDistance: number;
    start: boolean | string | GW.utils.Loc;
    upTile: number;
    downTile: number;
    wall: number;
}
declare class Stairs {
    options: StairOpts;
    constructor(options?: Partial<StairOpts>);
    create(site: DigSite): Record<string, GW.types.Loc> | null;
    hasXY(site: DigSite, x: number, y: number): boolean;
    isStairXY(site: DigSite, x: number, y: number): boolean;
    setupStairs(site: DigSite, x: number, y: number, tile: number): boolean;
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
    create(site: DigSite): number;
}
declare function digLoops(site: DigSite, opts?: Partial<LoopOptions>): number;

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
    startLoc?: GW.utils.Loc;
    endLoc?: GW.utils.Loc;
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
    startLoc: GW.utils.Loc;
    endLoc: GW.utils.Loc;
    seq: number[];
    constructor(width: number, height: number, options?: Partial<LevelOptions>);
    makeSite(width: number, height: number): GridSite;
    create(setFn: DigFn): boolean;
    start(_site: DigSite): void;
    getDigger(id: string | string[] | Record<string, number> | RoomDigger): RoomDigger;
    addFirstRoom(site: DigSite): Room | null;
    addRoom(site: DigSite): Room | null;
    _attachRoom(site: DigSite, roomSite: DigSite, room: Room): boolean;
    _attachRoomAtLoc(site: DigSite, roomSite: DigSite, room: Room, attachLoc: GW.utils.Loc): boolean;
    _roomFitsAt(map: DigSite, roomGrid: DigSite, roomToSiteX: number, roomToSiteY: number): boolean;
    _attachDoor(map: DigSite, room: Room, x: number, y: number, dir: number): void;
    addLoops(site: DigSite, opts: Partial<LoopOptions>): number;
    addLakes(site: DigSite, opts: Partial<LakeOpts>): number;
    addBridges(site: DigSite, opts: Partial<BridgeOpts>): number;
    addStairs(site: DigSite, opts: Partial<StairOpts>): Record<string, GW.types.Loc> | null;
    finish(site: DigSite): void;
    _removeDiagonalOpenings(site: DigSite): void;
    _finishDoors(site: DigSite): void;
    _finishWalls(site: DigSite): void;
}

interface DungeonOptions {
    seed?: number;
    levels: number;
    goesUp?: boolean;
    width: number;
    height: number;
    startLoc?: GW.utils.Loc;
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
declare type LocPair = [GW.utils.Loc, GW.utils.Loc];
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

interface BuildData {
    site: BuildSite;
    spawnedItems: any[];
    spawnedHordes: any[];
    interior: GW.grid.NumGrid;
    occupied: GW.grid.NumGrid;
    viewMap: GW.grid.NumGrid;
    distanceMap: GW.grid.NumGrid;
    originX: number;
    originY: number;
    distance25: number;
    distance75: number;
    machineNumber: number;
}
declare class Builder {
    site: BuildSite;
    depth: number;
    spawnedItems: GW.item.Item[];
    spawnedHordes: GW.actor.Actor[];
    interior: GW.grid.NumGrid;
    occupied: GW.grid.NumGrid;
    viewMap: GW.grid.NumGrid;
    distanceMap: GW.grid.NumGrid;
    originX: number;
    originY: number;
    distance25: number;
    distance75: number;
    machineNumber: number;
    constructor(site: BuildSite, depth: number);
    free(): void;
    buildRandom(requiredMachineFlags?: Flags): boolean;
    buildBlueprint(blueprint: Blueprint): boolean;
    build(blueprint: Blueprint, originX: number, originY: number): boolean;
}

interface StepOptions {
    tile: string | number;
    flags: GW.flag.FlagBase;
    pad: number;
    count: GW.range.RangeBase;
    item: any;
    horde: any;
    effect: Partial<GW.effect.EffectConfig>;
}
declare enum StepFlags {
    BF_OUTSOURCE_ITEM_TO_MACHINE,
    BF_BUILD_VESTIBULE,
    BF_ADOPT_ITEM,
    BF_BUILD_AT_ORIGIN,
    BF_PERMIT_BLOCKING,
    BF_TREAT_AS_BLOCKING,
    BF_NEAR_ORIGIN,
    BF_FAR_FROM_ORIGIN,
    BF_IN_VIEW_OF_ORIGIN,
    BF_IN_PASSABLE_VIEW_OF_ORIGIN,
    BF_MONSTER_TAKE_ITEM,
    BF_MONSTER_SLEEPING,
    BF_MONSTER_FLEEING,
    BF_MONSTERS_DORMANT,
    BF_ITEM_IS_KEY,
    BF_ITEM_IDENTIFIED,
    BF_ITEM_PLAYER_AVOIDS,
    BF_EVERYWHERE,
    BF_ALTERNATIVE,
    BF_ALTERNATIVE_2,
    BF_BUILD_IN_WALLS,
    BF_BUILD_ANYWHERE_ON_LEVEL,
    BF_REPEAT_UNTIL_NO_PROGRESS,
    BF_IMPREGNABLE,
    BF_NOT_IN_HALLWAY,
    BF_NOT_ON_LEVEL_PERIMETER,
    BF_SKELETON_KEY,
    BF_KEY_DISPOSABLE
}
declare class BuildStep {
    tile: number;
    flags: number;
    pad: number;
    count: GW.range.Range;
    item: any | null;
    horde: any | null;
    effect: GW.effect.EffectInfo | null;
    chance: number;
    next: null;
    id: string;
    constructor(cfg?: Partial<StepOptions>);
    cellIsCandidate(builder: BuildData, blueprint: Blueprint, x: number, y: number, distanceBound: [number, number]): boolean;
    makePersonalSpace(builder: BuildData, x: number, y: number, candidates: GW.grid.NumGrid): number;
    get generateEverywhere(): boolean;
    get buildAtOrigin(): boolean;
    distanceBound(builder: BuildData): [number, number];
    updateViewMap(builder: BuildData): void;
    markCandidates(candidates: GW.grid.NumGrid, builder: BuildData, blueprint: Blueprint, distanceBound: [number, number]): number;
    build(builder: BuildData, blueprint: Blueprint): number;
}

declare enum Flags {
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
    frequency: GW.frequency.FrequencyConfig;
    size: string | number[];
    flags: GW.flag.FlagBase;
    steps: Partial<StepOptions>[];
}
declare class Blueprint {
    tags: string[];
    frequency: GW.frequency.FrequencyFn;
    size: [number, number];
    flags: number;
    steps: BuildStep[];
    id: string;
    constructor(opts?: Partial<Options>);
    getChance(level: number, tags?: string | string[]): number;
    get isRoom(): boolean;
    get isReward(): boolean;
    get isVestiblue(): boolean;
    get adoptsItem(): boolean;
    get treatAsBlocking(): boolean;
    get requireBlocking(): boolean;
    get purgeInterior(): boolean;
    get purgeBlockers(): boolean;
    get purgeLiquids(): boolean;
    get surroundWithWalls(): boolean;
    get makeImpregnable(): boolean;
    get maximizeInterior(): boolean;
    get openInterior(): boolean;
    get noInteriorFlag(): boolean;
    qualifies(requiredFlags: number, depth: number): boolean;
    pickLocation(site: BuildSite): false | GW.types.Loc;
    computeInterior(builder: BuildData): boolean;
    addTileToInteriorAndIterate(builder: BuildData, startX: number, startY: number): boolean;
    computeInteriorForVestibuleMachine(builder: BuildData): boolean;
    prepareInteriorWithMachineFlags(builder: BuildData): void;
    expandMachineInterior(builder: BuildData, minimumInteriorNeighbors?: number): void;
    calcDistances(builder: BuildData): void;
    pickComponents(): BuildStep[];
    clearInteriorFlag(builder: BuildData): void;
}
declare const blueprints: Record<string, Blueprint>;
declare function install(id: string, blueprint: Blueprint | Partial<Options>): Blueprint;
declare function random(requiredFlags: number, depth: number): Blueprint;

type blueprint_d_Flags = Flags;
declare const blueprint_d_Flags: typeof Flags;
type blueprint_d_Options = Options;
type blueprint_d_Blueprint = Blueprint;
declare const blueprint_d_Blueprint: typeof Blueprint;
declare const blueprint_d_blueprints: typeof blueprints;
declare const blueprint_d_install: typeof install;
declare const blueprint_d_random: typeof random;
declare namespace blueprint_d {
  export {
    blueprint_d_Flags as Flags,
    blueprint_d_Options as Options,
    blueprint_d_Blueprint as Blueprint,
    blueprint_d_blueprints as blueprints,
    blueprint_d_install as install,
    blueprint_d_random as random,
  };
}

type index_d_StepOptions = StepOptions;
type index_d_StepFlags = StepFlags;
declare const index_d_StepFlags: typeof StepFlags;
type index_d_BuildStep = BuildStep;
declare const index_d_BuildStep: typeof BuildStep;
type index_d_BuildData = BuildData;
type index_d_Builder = Builder;
declare const index_d_Builder: typeof Builder;
declare namespace index_d {
  export {
    index_d_StepOptions as StepOptions,
    index_d_StepFlags as StepFlags,
    index_d_BuildStep as BuildStep,
    index_d_BuildData as BuildData,
    index_d_Builder as Builder,
  };
}

export { DigFn, DoorOpts, Dungeon, DungeonOptions, Hall, Level, LevelOptions, LocPair, Room, RoomConfig, RoomOptions, blueprint_d as blueprint, bridge_d as bridge, index_d as build, hall_d as hall, lake_d as lake, loop_d as loop, room_d as room, index_d$1 as site, stairs_d as stairs };
