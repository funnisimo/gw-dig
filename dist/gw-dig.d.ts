import * as GWU from 'gw-utils';
import * as GWM from 'gw-map';

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
    readonly rng: GWU.rng.Random;
    free(): void;
    clear(): void;
    dump(): void;
    setSeed(seed: number): void;
    hasXY: GWU.xy.XYMatchFunc;
    isBoundaryXY: GWU.xy.XYMatchFunc;
    isSet: GWU.xy.XYMatchFunc;
    isDiggable: GWU.xy.XYMatchFunc;
    isNothing: GWU.xy.XYMatchFunc;
    isPassable: GWU.xy.XYMatchFunc;
    isFloor: GWU.xy.XYMatchFunc;
    isBridge: GWU.xy.XYMatchFunc;
    isDoor: GWU.xy.XYMatchFunc;
    isSecretDoor: GWU.xy.XYMatchFunc;
    blocksMove: GWU.xy.XYMatchFunc;
    blocksDiagonal: GWU.xy.XYMatchFunc;
    blocksPathing: GWU.xy.XYMatchFunc;
    blocksVision: GWU.xy.XYMatchFunc;
    blocksItems: GWU.xy.XYMatchFunc;
    blocksEffects: GWU.xy.XYMatchFunc;
    isWall: GWU.xy.XYMatchFunc;
    isStairs: GWU.xy.XYMatchFunc;
    isDeep: GWU.xy.XYMatchFunc;
    isShallow: GWU.xy.XYMatchFunc;
    isAnyLiquid: GWU.xy.XYMatchFunc;
    setTile(x: number, y: number, tile: string | number | GWM.tile.Tile, opts?: GWM.map.SetTileOptions): boolean;
    hasTile(x: number, y: number, tile: string | number | GWM.tile.Tile): boolean;
    getTileIndex(x: number, y: number): number;
    getMachine(x: number, y: number): number;
    updateDoorDirs(): void;
    getDoorDir(x: number, y: number): number;
}

interface Snapshot {
    restore(): void;
    cancel(): void;
}
interface BuildSite extends DigSite {
    getChokeCount(x: number, y: number): number;
    setChokeCount(x: number, y: number, count: number): void;
    isOccupied: GWU.xy.XYMatchFunc;
    hasItem: GWU.xy.XYMatchFunc;
    hasActor: GWU.xy.XYMatchFunc;
    hasCellFlag(x: number, y: number, flag: number): boolean;
    setCellFlag(x: number, y: number, flag: number): void;
    clearCellFlag(x: number, y: number, flag: number): void;
    makeRandomItem(tags: string | Partial<GWM.item.MatchOptions>): GWM.item.Item;
    addItem(x: number, y: number, item: GWM.item.Item): boolean;
    analyze(): void;
    buildEffect(effect: GWM.effect.EffectInfo, x: number, y: number): boolean;
    snapshot(): Snapshot;
    nextMachineId(): number;
    setMachine(x: number, y: number, id: number, isRoom?: boolean): void;
}

declare function directionOfDoorSite(site: DigSite, x: number, y: number): number;
declare function chooseRandomDoorSites(site: DigSite): GWU.xy.Loc[];
declare function copySite(dest: DigSite, source: DigSite, offsetX?: number, offsetY?: number): void;
declare function fillCostGrid(source: DigSite, costGrid: GWU.grid.NumGrid): void;
interface DisruptOptions {
    offsetX: number;
    offsetY: number;
    machine: number;
    updateWalkable: (grid: GWU.grid.NumGrid) => boolean;
}
declare function siteDisruptedByXY(site: DigSite, x: number, y: number, options?: Partial<DisruptOptions>): boolean;
declare function siteDisruptedBy(site: DigSite, blockingGrid: GWU.grid.NumGrid, options?: Partial<DisruptOptions>): boolean;
declare function siteDisruptedSize(site: DigSite, blockingGrid: GWU.grid.NumGrid, blockingToMapX?: number, blockingToMapY?: number): number;
declare function computeDistanceMap(site: DigSite, distanceMap: GWU.grid.NumGrid, originX: number, originY: number, maxDistance: number): void;
declare function clearInteriorFlag(site: BuildSite, machine: number): void;

declare class GridSite implements DigSite {
    tiles: GWU.grid.NumGrid;
    doors: GWU.grid.NumGrid;
    rng: GWU.rng.Random;
    constructor(width: number, height: number);
    free(): void;
    clear(): void;
    dump(): void;
    setSeed(seed: number): void;
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
    setTile(x: number, y: number, tile: number | string | GWM.tile.Tile): boolean;
    hasTile(x: number, y: number, tile: number | string | GWM.tile.Tile): boolean;
    getMachine(_x: number, _y: number): number;
    updateDoorDirs(): void;
    getDoorDir(x: number, y: number): number;
}

declare class MapSnapshot implements Snapshot {
    site: MapSite;
    snapshot: GWM.map.Snapshot;
    machineCount: number;
    needsAnalysis: boolean;
    isUsed: boolean;
    constructor(site: MapSite, snap: GWM.map.Snapshot);
    restore(): void;
    cancel(): void;
}
declare class MapSite implements BuildSite {
    map: GWM.map.Map;
    machineCount: number;
    needsAnalysis: boolean;
    doors: GWU.grid.NumGrid;
    snapshots: GWM.map.SnapshotManager;
    constructor(map: GWM.map.Map);
    get rng(): GWU.rng.Random;
    setSeed(seed: number): void;
    get width(): number;
    get height(): number;
    dump(): void;
    hasXY(x: number, y: number): boolean;
    isBoundaryXY(x: number, y: number): boolean;
    hasCellFlag(x: number, y: number, flag: number): boolean;
    setCellFlag(x: number, y: number, flag: number): void;
    clearCellFlag(x: number, y: number, flag: number): void;
    hasTile(x: number, y: number, tile: string | number | GWM.tile.Tile): boolean;
    setTile(x: number, y: number, tile: string | number | GWM.tile.Tile, opts?: Partial<GWM.map.SetOptions>): boolean;
    getTileIndex(x: number, y: number): number;
    clear(): void;
    hasItem(x: number, y: number): boolean;
    makeRandomItem(tags: string | Partial<GWM.item.MatchOptions>): GWM.item.Item;
    addItem(x: number, y: number, item: GWM.item.Item): boolean;
    hasActor(x: number, y: number): boolean;
    blocksMove(x: number, y: number): boolean;
    blocksVision(x: number, y: number): boolean;
    blocksDiagonal(x: number, y: number): boolean;
    blocksPathing(x: number, y: number): boolean;
    blocksItems(x: number, y: number): boolean;
    blocksEffects(x: number, y: number): boolean;
    isWall(x: number, y: number): boolean;
    isStairs(x: number, y: number): boolean;
    isSet(x: number, y: number): boolean;
    isDiggable(x: number, y: number): boolean;
    isNothing(x: number, y: number): boolean;
    isFloor(x: number, y: number): boolean;
    isBridge(x: number, y: number): boolean;
    isDoor(x: number, y: number): boolean;
    isSecretDoor(x: number, y: number): boolean;
    isDeep(x: number, y: number): boolean;
    isShallow(x: number, y: number): boolean;
    isAnyLiquid(x: number, y: number): boolean;
    isOccupied(x: number, y: number): boolean;
    isPassable(x: number, y: number): boolean;
    snapshot(): MapSnapshot;
    free(): void;
    getChokeCount(x: number, y: number): number;
    setChokeCount(x: number, y: number, count: number): void;
    analyze(): void;
    buildEffect(effect: GWM.effect.EffectInfo, x: number, y: number): boolean;
    nextMachineId(): number;
    getMachine(x: number, y: number): number;
    setMachine(x: number, y: number, id: number, isRoom?: boolean): void;
    updateDoorDirs(): void;
    getDoorDir(x: number, y: number): number;
}

declare const index_d$2_NOTHING: typeof NOTHING;
declare const index_d$2_FLOOR: typeof FLOOR;
declare const index_d$2_DOOR: typeof DOOR;
declare const index_d$2_SECRET_DOOR: typeof SECRET_DOOR;
declare const index_d$2_WALL: typeof WALL;
declare const index_d$2_DEEP: typeof DEEP;
declare const index_d$2_SHALLOW: typeof SHALLOW;
declare const index_d$2_BRIDGE: typeof BRIDGE;
declare const index_d$2_UP_STAIRS: typeof UP_STAIRS;
declare const index_d$2_DOWN_STAIRS: typeof DOWN_STAIRS;
declare const index_d$2_IMPREGNABLE: typeof IMPREGNABLE;
declare const index_d$2_TILEMAP: typeof TILEMAP;
type index_d$2_DigSite = DigSite;
type index_d$2_Snapshot = Snapshot;
type index_d$2_BuildSite = BuildSite;
declare const index_d$2_directionOfDoorSite: typeof directionOfDoorSite;
declare const index_d$2_chooseRandomDoorSites: typeof chooseRandomDoorSites;
declare const index_d$2_copySite: typeof copySite;
declare const index_d$2_fillCostGrid: typeof fillCostGrid;
type index_d$2_DisruptOptions = DisruptOptions;
declare const index_d$2_siteDisruptedByXY: typeof siteDisruptedByXY;
declare const index_d$2_siteDisruptedBy: typeof siteDisruptedBy;
declare const index_d$2_siteDisruptedSize: typeof siteDisruptedSize;
declare const index_d$2_computeDistanceMap: typeof computeDistanceMap;
declare const index_d$2_clearInteriorFlag: typeof clearInteriorFlag;
type index_d$2_GridSite = GridSite;
declare const index_d$2_GridSite: typeof GridSite;
type index_d$2_MapSnapshot = MapSnapshot;
declare const index_d$2_MapSnapshot: typeof MapSnapshot;
type index_d$2_MapSite = MapSite;
declare const index_d$2_MapSite: typeof MapSite;
declare namespace index_d$2 {
  export {
    index_d$2_NOTHING as NOTHING,
    index_d$2_FLOOR as FLOOR,
    index_d$2_DOOR as DOOR,
    index_d$2_SECRET_DOOR as SECRET_DOOR,
    index_d$2_WALL as WALL,
    index_d$2_DEEP as DEEP,
    index_d$2_SHALLOW as SHALLOW,
    index_d$2_BRIDGE as BRIDGE,
    index_d$2_UP_STAIRS as UP_STAIRS,
    index_d$2_DOWN_STAIRS as DOWN_STAIRS,
    index_d$2_IMPREGNABLE as IMPREGNABLE,
    index_d$2_TILEMAP as TILEMAP,
    index_d$2_DigSite as DigSite,
    index_d$2_Snapshot as Snapshot,
    index_d$2_BuildSite as BuildSite,
    index_d$2_directionOfDoorSite as directionOfDoorSite,
    index_d$2_chooseRandomDoorSites as chooseRandomDoorSites,
    index_d$2_copySite as copySite,
    index_d$2_fillCostGrid as fillCostGrid,
    index_d$2_DisruptOptions as DisruptOptions,
    index_d$2_siteDisruptedByXY as siteDisruptedByXY,
    index_d$2_siteDisruptedBy as siteDisruptedBy,
    index_d$2_siteDisruptedSize as siteDisruptedSize,
    index_d$2_computeDistanceMap as computeDistanceMap,
    index_d$2_clearInteriorFlag as clearInteriorFlag,
    index_d$2_GridSite as GridSite,
    index_d$2_MapSnapshot as MapSnapshot,
    index_d$2_MapSite as MapSite,
  };
}

interface RoomConfig {
    tile?: number;
    [x: string]: any;
}
declare type DigFn = (x: number, y: number, tile: number) => any;
declare class Hall extends GWU.xy.Bounds {
    doors: GWU.xy.Loc[];
    constructor(x: number, y: number, width: number, height: number);
    translate(dx: number, dy: number): void;
}
declare function makeHall(loc: GWU.xy.Loc, dirIndex: number, hallLength: number, hallWidth?: number): Hall;
declare class Room extends GWU.xy.Bounds {
    doors: GWU.xy.Loc[];
    hall: Hall | null;
    constructor(x: number, y: number, width: number, height: number);
    get cx(): number;
    get cy(): number;
    translate(dx: number, dy: number): void;
}

declare function checkConfig(config: RoomConfig, expected?: RoomConfig): RoomConfig;
declare abstract class RoomDigger {
    options: RoomConfig;
    doors: GWU.xy.Loc[];
    constructor(config: RoomConfig, expected?: RoomConfig);
    _setOptions(config: RoomConfig, expected?: RoomConfig): void;
    create(site: DigSite): Room;
    abstract carve(site: DigSite): Room;
}
declare var rooms: Record<string, RoomDigger>;
declare class ChoiceRoom extends RoomDigger {
    randomRoom: (rng: GWU.rng.Random) => string;
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

declare function isDoorLoc(site: DigSite, loc: GWU.xy.Loc, dir: GWU.xy.Loc): boolean;
declare type WidthBase = number | string | number[] | {
    [key: number]: number;
};
declare function pickWidth(width: WidthBase, rng?: GWU.rng.Random): number;
declare function pickLength(dir: number, lengths: [GWU.range.Range, GWU.range.Range], rng?: GWU.rng.Random): number;
declare function pickHallDirection(site: DigSite, doors: GWU.xy.Loc[], lengths: [GWU.range.Range, GWU.range.Range]): number;
declare function pickHallExits(site: DigSite, x: number, y: number, dir: number, obliqueChance: number): GWU.types.Loc[];
interface HallOptions {
    width: number | string;
    length: number | string | number[] | string[];
    tile: number;
    obliqueChance: number;
    chance: number;
}
interface HallConfig {
    width: WidthBase;
    length: [GWU.range.Range, GWU.range.Range];
    tile: number;
    obliqueChance: number;
    chance: number;
}
declare class HallDigger {
    config: HallConfig;
    constructor(options?: Partial<HallOptions>);
    _setOptions(options?: Partial<HallOptions>): void;
    create(site: DigSite, doors?: GWU.xy.Loc[]): Hall | null;
    _digLine(site: DigSite, door: GWU.xy.Loc, dir: GWU.xy.Loc, length: number): number[];
    dig(site: DigSite, dir: number, door: GWU.xy.Loc, length: number): Hall;
    digWide(site: DigSite, dir: number, door: GWU.xy.Loc, length: number, width: number): Hall;
}
declare function dig(config: Partial<HallOptions>, site: DigSite, doors: GWU.xy.Loc[]): Hall | null;
declare var halls: Record<string, HallDigger>;
declare function install$1(id: string, hall: HallDigger): HallDigger;

declare const hall_d_isDoorLoc: typeof isDoorLoc;
type hall_d_WidthBase = WidthBase;
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
    hall_d_WidthBase as WidthBase,
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
    isDisruptedBy(site: DigSite, lakeGrid: GWU.grid.NumGrid, lakeToMapX?: number, lakeToMapY?: number): boolean;
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
    up: boolean | GWU.xy.Loc;
    down: boolean | GWU.xy.Loc;
    minDistance: number;
    start: boolean | string | GWU.xy.Loc;
    upTile: number;
    downTile: number;
    wall: number;
}
declare class Stairs {
    options: StairOpts;
    constructor(options?: Partial<StairOpts>);
    create(site: DigSite): Record<string, GWU.types.Loc> | null;
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
    doorChance: number;
}
interface LoopConfig {
    minDistance: number;
    maxLength: number;
    doorChance: number;
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

interface DataOptions {
    depth: number;
    seed: number;
}
declare class BuildData {
    map: GWM.map.Map;
    site: MapSite;
    interior: GWU.grid.NumGrid;
    occupied: GWU.grid.NumGrid;
    candidates: GWU.grid.NumGrid;
    viewMap: GWU.grid.NumGrid;
    distanceMap: GWU.grid.NumGrid;
    originX: number;
    originY: number;
    distance25: number;
    distance75: number;
    machineNumber: number;
    depth: number;
    seed: number;
    constructor(map: GWM.map.Map, options?: Partial<DataOptions>);
    free(): void;
    reset(originX: number, originY: number): void;
    calcDistances(maxSize: number): void;
}

interface StepOptions {
    tile: string | number;
    flags: GWU.flag.FlagBase;
    pad: number;
    count: GWU.range.RangeBase;
    item: string | Partial<GWM.item.MatchOptions>;
    horde: any;
    effect: Partial<GWM.effect.EffectConfig> | string;
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
    BF_NO_BLOCK_ORIGIN,
    BF_NOT_IN_HALLWAY,
    BF_ALLOW_BOUNDARY,
    BF_SKELETON_KEY,
    BF_KEY_DISPOSABLE
}
declare class BuildStep {
    tile: string | number;
    flags: number;
    pad: number;
    count: GWU.range.Range;
    item: string | Partial<GWM.item.MatchOptions> | null;
    horde: any | null;
    effect: GWM.effect.EffectInfo | null;
    chance: number;
    id: string;
    constructor(cfg?: Partial<StepOptions>);
    get allowBoundary(): boolean;
    get notInHallway(): boolean;
    get buildInWalls(): boolean;
    get buildAnywhere(): boolean;
    get repeatUntilNoProgress(): boolean;
    get permitBlocking(): boolean;
    get treatAsBlocking(): boolean;
    get noBlockOrigin(): boolean;
    get adoptItem(): boolean;
    get itemIsKey(): boolean;
    get keyIsDisposable(): boolean;
    get outsourceItem(): boolean;
    get impregnable(): boolean;
    get buildVestibule(): boolean;
    get generateEverywhere(): boolean;
    get buildAtOrigin(): boolean;
    get buildsInstances(): boolean;
    markCandidates(data: BuildData, blueprint: Blueprint, candidates: GWU.grid.NumGrid, distanceBound?: [number, number]): number;
}
declare function updateViewMap(builder: BuildData, buildStep: BuildStep): void;
declare function calcDistanceBound(builder: BuildData, buildStep: BuildStep): [number, number];
declare function cellIsCandidate(builder: BuildData, blueprint: Blueprint, buildStep: BuildStep, x: number, y: number, distanceBound: [number, number]): boolean;
declare function makePersonalSpace(builder: BuildData, x: number, y: number, candidates: GWU.grid.NumGrid, personalSpace: number): number;

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
    BP_NO_INTERIOR_FLAG,
    BP_NOT_IN_HALLWAY
}
interface BlueprintOptions {
    id: string;
    tags: string | string[];
    frequency: GWU.frequency.FrequencyConfig;
    size: string | number[] | number;
    flags: GWU.flag.FlagBase;
    steps: Partial<StepOptions>[];
}
declare class Blueprint {
    tags: string[];
    frequency: GWU.frequency.FrequencyFn;
    size: GWU.range.Range;
    flags: number;
    steps: BuildStep[];
    id: string;
    constructor(opts?: Partial<BlueprintOptions>);
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
    get notInHallway(): boolean;
    qualifies(requiredFlags: number, tags?: string | string[]): boolean;
    pickComponents(rng: GWU.rng.Random): BuildStep[];
    fillInterior(builder: BuildData): number;
}
declare const blueprints: Record<string, Blueprint>;
declare function install(id: string, blueprint: Blueprint | Partial<BlueprintOptions>): Blueprint;
declare function random(requiredFlags: number, depth: number, rng?: GWU.rng.Random): Blueprint;
declare function make(config: Partial<BlueprintOptions>): Blueprint;

interface Logger {
    onDigFirstRoom(site: DigSite): Promise<any>;
    onRoomCandidate(roomSite: DigSite): Promise<any>;
    onRoomFailed(site: DigSite, room: Room, roomSite: DigSite, error: string): Promise<any>;
    onRoomSuccess(site: DigSite, room: Room): Promise<any>;
    onLoopsAdded(site: DigSite): Promise<any>;
    onLakesAdded(site: DigSite): Promise<any>;
    onBridgesAdded(site: DigSite): Promise<any>;
    onStairsAdded(site: DigSite): Promise<any>;
    onBuildError(data: BuildData, error: string): Promise<any>;
    onBlueprintPick(data: BuildData, blueprint: Blueprint, flags: number, depth: number): Promise<any>;
    onBlueprintCandidates(data: BuildData, blueprint: Blueprint): Promise<any>;
    onBlueprintStart(data: BuildData, blueprint: Blueprint, adoptedItem: GWM.item.Item | null): Promise<any>;
    onBlueprintInterior(data: BuildData, blueprint: Blueprint): Promise<any>;
    onBlueprintFail(data: BuildData, blueprint: Blueprint, error: string): Promise<any>;
    onBlueprintSuccess(data: BuildData, blueprint: Blueprint): Promise<any>;
    onStepStart(data: BuildData, blueprint: Blueprint, step: BuildStep, item: GWM.item.Item | null): Promise<any>;
    onStepCandidates(data: BuildData, blueprint: Blueprint, step: BuildStep, candidates: GWU.grid.NumGrid, wantCount: number): Promise<any>;
    onStepInstanceSuccess(data: BuildData, blueprint: Blueprint, step: BuildStep, x: number, y: number): Promise<any>;
    onStepInstanceFail(data: BuildData, blueprint: Blueprint, step: BuildStep, x: number, y: number, error: string): Promise<any>;
    onStepSuccess(data: BuildData, blueprint: Blueprint, step: BuildStep): Promise<any>;
    onStepFail(data: BuildData, blueprint: Blueprint, step: BuildStep, error: string): Promise<any>;
}
declare class NullLogger implements Logger {
    onDigFirstRoom(): Promise<any>;
    onRoomCandidate(): Promise<any>;
    onRoomFailed(): Promise<any>;
    onRoomSuccess(): Promise<any>;
    onLoopsAdded(): Promise<any>;
    onLakesAdded(): Promise<any>;
    onBridgesAdded(): Promise<any>;
    onStairsAdded(): Promise<any>;
    onBuildError(): Promise<any>;
    onBlueprintPick(): Promise<any>;
    onBlueprintCandidates(): Promise<any>;
    onBlueprintStart(): Promise<any>;
    onBlueprintInterior(): Promise<any>;
    onBlueprintFail(): Promise<any>;
    onBlueprintSuccess(): Promise<any>;
    onStepStart(): Promise<any>;
    onStepCandidates(): Promise<any>;
    onStepInstanceSuccess(): Promise<any>;
    onStepInstanceFail(): Promise<any>;
    onStepSuccess(): Promise<any>;
    onStepFail(): Promise<any>;
}

interface DoorOpts {
    chance: number;
    tile: number;
}
interface RoomOptions {
    count: number;
    fails: number;
    first: string | string[] | Record<string, number> | RoomDigger;
    digger: string | string[] | Record<string, number> | RoomDigger;
}
interface DiggerOptions {
    halls?: Partial<HallOptions> | boolean;
    loops?: Partial<LoopOptions> | boolean;
    lakes?: Partial<LakeOpts> | boolean;
    bridges?: Partial<BridgeOpts> | boolean;
    stairs?: Partial<StairOpts> | boolean;
    doors?: Partial<DoorOpts> | boolean;
    rooms: Partial<RoomOptions>;
    startLoc?: GWU.xy.Loc;
    endLoc?: GWU.xy.Loc;
    seed?: number;
    boundary?: boolean;
    log?: Logger | boolean;
}
declare class Digger {
    site: DigSite;
    seed: number;
    rooms: Partial<RoomOptions>;
    doors: Partial<DoorOpts>;
    halls: Partial<HallOptions>;
    loops: Partial<LoopOptions> | null;
    lakes: Partial<LakeOpts> | null;
    bridges: Partial<BridgeOpts> | null;
    stairs: Partial<StairOpts> | null;
    boundary: boolean;
    startLoc: GWU.xy.Loc;
    endLoc: GWU.xy.Loc;
    seq: number[];
    log: Logger;
    constructor(options?: Partial<DiggerOptions>);
    _makeRoomSite(width: number, height: number): GridSite;
    create(width: number, height: number, cb: DigFn): Promise<boolean>;
    create(map: GWM.map.Map): Promise<boolean>;
    _create(site: DigSite): Promise<boolean>;
    start(site: DigSite): void;
    getDigger(id: string | string[] | Record<string, number> | RoomDigger): RoomDigger;
    addFirstRoom(site: DigSite): Promise<Room | null>;
    addRoom(site: DigSite): Promise<Room | null>;
    _attachRoom(site: DigSite, roomSite: DigSite, room: Room): boolean;
    _attachRoomAtLoc(site: DigSite, roomSite: DigSite, room: Room, attachLoc: GWU.xy.Loc): Promise<boolean>;
    _roomFitsAt(map: DigSite, roomGrid: DigSite, room: Room, roomToSiteX: number, roomToSiteY: number): boolean;
    _attachDoor(site: DigSite, room: Room, x: number, y: number, dir: number): void;
    addLoops(site: DigSite, opts: Partial<LoopOptions>): number;
    addLakes(site: DigSite, opts: Partial<LakeOpts>): number;
    addBridges(site: DigSite, opts: Partial<BridgeOpts>): number;
    addStairs(site: DigSite, opts: Partial<StairOpts>): Record<string, GWU.types.Loc> | null;
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
    startLoc?: GWU.xy.Loc;
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
declare type LocPair = [GWU.xy.Loc, GWU.xy.Loc];
declare class Dungeon {
    config: DungeonOptions;
    seeds: number[];
    stairLocs: LocPair[];
    constructor(options?: Partial<DungeonOptions>);
    get levels(): number;
    initSeeds(): void;
    initStairLocs(): void;
    getLevel(id: number, cb: DigFn): Promise<boolean>;
    makeLevel(id: number, opts: Partial<DiggerOptions>, cb: DigFn): Promise<boolean>;
}

declare type BlueType = Blueprint | string;
interface BuilderOptions extends DataOptions {
    blueprints: BlueType[] | {
        [key: string]: BlueType;
    };
    log: Logger | boolean;
}
declare class Builder {
    data: BuildData;
    blueprints: Blueprint[] | null;
    log: Logger;
    constructor(map: GWM.map.Map, options?: Partial<BuilderOptions>);
    _pickRandom(requiredFlags: number): Blueprint | null;
    buildRandom(requiredMachineFlags?: Flags, x?: number, y?: number, adoptedItem?: GWM.item.Item | null): Promise<boolean>;
    build(blueprint: Blueprint | string, x?: number, y?: number, adoptedItem?: GWM.item.Item | null): Promise<boolean>;
    _buildAt(blueprint: Blueprint, x?: number, y?: number, adoptedItem?: GWM.item.Item | null): Promise<boolean>;
    _build(blueprint: Blueprint, originX: number, originY: number, adoptedItem?: GWM.item.Item | null): Promise<boolean>;
    _markCandidates(blueprint: Blueprint): Promise<number>;
    _computeInterior(blueprint: Blueprint): Promise<boolean>;
    _buildStep(blueprint: Blueprint, buildStep: BuildStep, adoptedItem: GWM.item.Item | null): Promise<boolean>;
    _buildStepInstance(blueprint: Blueprint, buildStep: BuildStep, x: number, y: number, adoptedItem?: GWM.item.Item | null): Promise<boolean>;
}

type index_d$1_Flags = Flags;
declare const index_d$1_Flags: typeof Flags;
type index_d$1_Blueprint = Blueprint;
declare const index_d$1_Blueprint: typeof Blueprint;
type index_d$1_BlueprintOptions = BlueprintOptions;
declare const index_d$1_install: typeof install;
declare const index_d$1_random: typeof random;
declare const index_d$1_blueprints: typeof blueprints;
declare const index_d$1_make: typeof make;
type index_d$1_DataOptions = DataOptions;
type index_d$1_BuildData = BuildData;
declare const index_d$1_BuildData: typeof BuildData;
type index_d$1_StepOptions = StepOptions;
type index_d$1_StepFlags = StepFlags;
declare const index_d$1_StepFlags: typeof StepFlags;
type index_d$1_BuildStep = BuildStep;
declare const index_d$1_BuildStep: typeof BuildStep;
declare const index_d$1_updateViewMap: typeof updateViewMap;
declare const index_d$1_calcDistanceBound: typeof calcDistanceBound;
declare const index_d$1_cellIsCandidate: typeof cellIsCandidate;
declare const index_d$1_makePersonalSpace: typeof makePersonalSpace;
type index_d$1_BlueType = BlueType;
type index_d$1_BuilderOptions = BuilderOptions;
type index_d$1_Builder = Builder;
declare const index_d$1_Builder: typeof Builder;
declare namespace index_d$1 {
  export {
    index_d$1_Flags as Flags,
    index_d$1_Blueprint as Blueprint,
    index_d$1_BlueprintOptions as BlueprintOptions,
    index_d$1_install as install,
    index_d$1_random as random,
    index_d$1_blueprints as blueprints,
    index_d$1_make as make,
    index_d$1_DataOptions as DataOptions,
    index_d$1_BuildData as BuildData,
    index_d$1_StepOptions as StepOptions,
    index_d$1_StepFlags as StepFlags,
    index_d$1_BuildStep as BuildStep,
    index_d$1_updateViewMap as updateViewMap,
    index_d$1_calcDistanceBound as calcDistanceBound,
    index_d$1_cellIsCandidate as cellIsCandidate,
    index_d$1_makePersonalSpace as makePersonalSpace,
    index_d$1_BlueType as BlueType,
    index_d$1_BuilderOptions as BuilderOptions,
    index_d$1_Builder as Builder,
  };
}

declare class ConsoleLogger implements Logger {
    onDigFirstRoom(site: DigSite): Promise<void>;
    onRoomCandidate(roomSite: DigSite): Promise<any>;
    onRoomFailed(_site: DigSite, _room: Room, _roomSite: DigSite, error: string): Promise<any>;
    onRoomSuccess(site: DigSite, room: Room): Promise<any>;
    onLoopsAdded(_site: DigSite): Promise<any>;
    onLakesAdded(_site: DigSite): Promise<any>;
    onBridgesAdded(_site: DigSite): Promise<any>;
    onStairsAdded(_site: DigSite): Promise<any>;
    onBuildError(_data: BuildData, error: string): Promise<void>;
    onBlueprintPick(_data: BuildData, blueprint: Blueprint, flags: number, depth: number): Promise<void>;
    onBlueprintCandidates(data: BuildData, blueprint: Blueprint): Promise<void>;
    onBlueprintStart(data: BuildData, blueprint: Blueprint): Promise<void>;
    onBlueprintInterior(data: BuildData, blueprint: Blueprint): Promise<void>;
    onBlueprintFail(data: BuildData, blueprint: Blueprint, error: string): Promise<void>;
    onBlueprintSuccess(data: BuildData, blueprint: Blueprint): Promise<void>;
    onStepStart(data: BuildData, blueprint: Blueprint, step: BuildStep): Promise<void>;
    onStepCandidates(data: BuildData, blueprint: Blueprint, step: BuildStep, candidates: GWU.grid.NumGrid, wantCount: number): Promise<void>;
    onStepInstanceSuccess(_data: BuildData, _blueprint: Blueprint, _step: BuildStep, x: number, y: number): Promise<void>;
    onStepInstanceFail(_data: BuildData, _blueprint: Blueprint, _step: BuildStep, x: number, y: number, error: string): Promise<void>;
    onStepSuccess(data: BuildData, blueprint: Blueprint, step: BuildStep): Promise<void>;
    onStepFail(data: BuildData, blueprint: Blueprint, step: BuildStep, error: string): Promise<void>;
}

type index_d_Logger = Logger;
type index_d_NullLogger = NullLogger;
declare const index_d_NullLogger: typeof NullLogger;
type index_d_ConsoleLogger = ConsoleLogger;
declare const index_d_ConsoleLogger: typeof ConsoleLogger;
declare namespace index_d {
  export {
    index_d_Logger as Logger,
    index_d_NullLogger as NullLogger,
    index_d_ConsoleLogger as ConsoleLogger,
  };
}

export { DigFn, Digger, DiggerOptions, DoorOpts, Dungeon, DungeonOptions, Hall, LocPair, Room, RoomConfig, RoomOptions, index_d$1 as blueprint, bridge_d as bridge, hall_d as hall, lake_d as lake, index_d as log, loop_d as loop, makeHall, room_d as room, index_d$2 as site, stairs_d as stairs };
