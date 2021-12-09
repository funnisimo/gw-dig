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
    drawInto(buffer: GWU.canvas.Buffer): void;
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
    clearCell(x: number, y: number, tile: string | number | GWM.tile.Tile): boolean;
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
    readonly depth: number;
    readonly machineCount: number;
    getChokeCount(x: number, y: number): number;
    setChokeCount(x: number, y: number, count: number): void;
    isOccupied: GWU.xy.XYMatchFunc;
    hasItem: GWU.xy.XYMatchFunc;
    hasActor: GWU.xy.XYMatchFunc;
    hasCellFlag(x: number, y: number, flag: number): boolean;
    setCellFlag(x: number, y: number, flag: number): void;
    clearCellFlag(x: number, y: number, flag: number): void;
    makeItem(id: string, makeOptions?: any): GWM.item.Item | null;
    makeRandomItem(tags: Partial<GWM.item.MatchOptions>, makeOptions?: any): GWM.item.Item;
    addItem(x: number, y: number, item: GWM.item.Item): boolean;
    spawnHorde(horde: GWM.horde.Horde, x: number, y: number, opts?: Partial<GWM.horde.SpawnOptions>): GWM.actor.Actor | null;
    analyze(): void;
    buildEffect(effect: GWM.effect.Effect, x: number, y: number): boolean;
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
    drawInto(buffer: GWU.canvas.Buffer): void;
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
    clearCell(x: number, y: number, tile: number | string | GWM.tile.Tile): boolean;
    hasTile(x: number, y: number, tile: number | string | GWM.tile.Tile): boolean;
    getMachine(_x: number, _y: number): number;
    updateDoorDirs(): void;
    getDoorDir(x: number, y: number): number;
}

declare class MapSnapshot implements Snapshot {
    site: MapSite;
    snapshot: GWM.map.Snapshot;
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
    get depth(): number;
    setSeed(seed: number): void;
    get width(): number;
    get height(): number;
    free(): void;
    dump(): void;
    drawInto(buffer: GWU.canvas.Buffer): void;
    hasXY(x: number, y: number): boolean;
    isBoundaryXY(x: number, y: number): boolean;
    hasCellFlag(x: number, y: number, flag: number): boolean;
    setCellFlag(x: number, y: number, flag: number): void;
    clearCellFlag(x: number, y: number, flag: number): void;
    hasTile(x: number, y: number, tile: string | number | GWM.tile.Tile): boolean;
    setTile(x: number, y: number, tile: string | number | GWM.tile.Tile, opts?: Partial<GWM.map.SetOptions>): boolean;
    clearCell(x: number, y: number, tile: string | number | GWM.tile.Tile): boolean;
    getTileIndex(x: number, y: number): number;
    clear(): void;
    hasItem(x: number, y: number): boolean;
    makeItem(id: string, makeOptions?: any): GWM.item.Item;
    makeRandomItem(tags: Partial<GWM.item.MatchOptions>, makeOptions?: any): GWM.item.Item;
    addItem(x: number, y: number, item: GWM.item.Item): boolean;
    hasActor(x: number, y: number): boolean;
    spawnHorde(horde: GWM.horde.Horde, x: number, y: number, opts?: Partial<GWM.horde.SpawnOptions>): GWM.actor.Actor | null;
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
    getChokeCount(x: number, y: number): number;
    setChokeCount(x: number, y: number, count: number): void;
    analyze(): void;
    buildEffect(effect: GWM.effect.Effect, x: number, y: number): boolean;
    nextMachineId(): number;
    getMachine(x: number, y: number): number;
    setMachine(x: number, y: number, id: number, isRoom?: boolean): void;
    updateDoorDirs(): void;
    getDoorDir(x: number, y: number): number;
}

declare const index_d$3_NOTHING: typeof NOTHING;
declare const index_d$3_FLOOR: typeof FLOOR;
declare const index_d$3_DOOR: typeof DOOR;
declare const index_d$3_SECRET_DOOR: typeof SECRET_DOOR;
declare const index_d$3_WALL: typeof WALL;
declare const index_d$3_DEEP: typeof DEEP;
declare const index_d$3_SHALLOW: typeof SHALLOW;
declare const index_d$3_BRIDGE: typeof BRIDGE;
declare const index_d$3_UP_STAIRS: typeof UP_STAIRS;
declare const index_d$3_DOWN_STAIRS: typeof DOWN_STAIRS;
declare const index_d$3_IMPREGNABLE: typeof IMPREGNABLE;
declare const index_d$3_TILEMAP: typeof TILEMAP;
type index_d$3_DigSite = DigSite;
type index_d$3_Snapshot = Snapshot;
type index_d$3_BuildSite = BuildSite;
declare const index_d$3_directionOfDoorSite: typeof directionOfDoorSite;
declare const index_d$3_chooseRandomDoorSites: typeof chooseRandomDoorSites;
declare const index_d$3_copySite: typeof copySite;
declare const index_d$3_fillCostGrid: typeof fillCostGrid;
type index_d$3_DisruptOptions = DisruptOptions;
declare const index_d$3_siteDisruptedByXY: typeof siteDisruptedByXY;
declare const index_d$3_siteDisruptedBy: typeof siteDisruptedBy;
declare const index_d$3_siteDisruptedSize: typeof siteDisruptedSize;
declare const index_d$3_computeDistanceMap: typeof computeDistanceMap;
declare const index_d$3_clearInteriorFlag: typeof clearInteriorFlag;
type index_d$3_GridSite = GridSite;
declare const index_d$3_GridSite: typeof GridSite;
type index_d$3_MapSnapshot = MapSnapshot;
declare const index_d$3_MapSnapshot: typeof MapSnapshot;
type index_d$3_MapSite = MapSite;
declare const index_d$3_MapSite: typeof MapSite;
declare namespace index_d$3 {
  export {
    index_d$3_NOTHING as NOTHING,
    index_d$3_FLOOR as FLOOR,
    index_d$3_DOOR as DOOR,
    index_d$3_SECRET_DOOR as SECRET_DOOR,
    index_d$3_WALL as WALL,
    index_d$3_DEEP as DEEP,
    index_d$3_SHALLOW as SHALLOW,
    index_d$3_BRIDGE as BRIDGE,
    index_d$3_UP_STAIRS as UP_STAIRS,
    index_d$3_DOWN_STAIRS as DOWN_STAIRS,
    index_d$3_IMPREGNABLE as IMPREGNABLE,
    index_d$3_TILEMAP as TILEMAP,
    index_d$3_DigSite as DigSite,
    index_d$3_Snapshot as Snapshot,
    index_d$3_BuildSite as BuildSite,
    index_d$3_directionOfDoorSite as directionOfDoorSite,
    index_d$3_chooseRandomDoorSites as chooseRandomDoorSites,
    index_d$3_copySite as copySite,
    index_d$3_fillCostGrid as fillCostGrid,
    index_d$3_DisruptOptions as DisruptOptions,
    index_d$3_siteDisruptedByXY as siteDisruptedByXY,
    index_d$3_siteDisruptedBy as siteDisruptedBy,
    index_d$3_siteDisruptedSize as siteDisruptedSize,
    index_d$3_computeDistanceMap as computeDistanceMap,
    index_d$3_clearInteriorFlag as clearInteriorFlag,
    index_d$3_GridSite as GridSite,
    index_d$3_MapSnapshot as MapSnapshot,
    index_d$3_MapSite as MapSite,
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

interface ItemOptions extends GWM.item.MatchOptions {
    make: any;
    id: string;
}
interface HordeOptions extends GWM.horde.HordeConfig {
    id: string;
    effect: string | GWM.effect.EffectBase;
    random: boolean;
    rng?: GWU.rng.Random;
}
interface StepOptions {
    tile: string | number;
    flags: GWU.flag.FlagBase;
    pad: number;
    count: GWU.range.RangeBase;
    item: string | Partial<ItemOptions>;
    horde: boolean | string | Partial<HordeOptions>;
    effect: Partial<GWM.effect.EffectConfig> | string;
}
declare enum StepFlags {
    BS_OUTSOURCE_ITEM_TO_MACHINE,
    BS_BUILD_VESTIBULE,
    BS_ADOPT_ITEM,
    BS_BUILD_AT_ORIGIN,
    BS_PERMIT_BLOCKING,
    BS_TREAT_AS_BLOCKING,
    BS_NEAR_ORIGIN,
    BS_FAR_FROM_ORIGIN,
    BS_IN_VIEW_OF_ORIGIN,
    BS_IN_PASSABLE_VIEW_OF_ORIGIN,
    BS_HORDE_TAKES_ITEM,
    BS_HORDE_SLEEPING,
    BS_HORDE_FLEEING,
    BS_HORDES_DORMANT,
    BS_ITEM_IS_KEY,
    BS_ITEM_IDENTIFIED,
    BS_ITEM_PLAYER_AVOIDS,
    BS_EVERYWHERE,
    BS_ALTERNATIVE,
    BS_ALTERNATIVE_2,
    BS_BUILD_IN_WALLS,
    BS_BUILD_ANYWHERE_ON_LEVEL,
    BS_REPEAT_UNTIL_NO_PROGRESS,
    BS_IMPREGNABLE,
    BS_NO_BLOCK_ORIGIN,
    BS_NOT_IN_HALLWAY,
    BS_ALLOW_BOUNDARY,
    BS_SKELETON_KEY,
    BS_KEY_DISPOSABLE
}
declare class BuildStep {
    tile: string | number;
    flags: number;
    pad: number;
    count: GWU.range.Range;
    item: Partial<ItemOptions> | null;
    horde: Partial<HordeOptions> | null;
    effect: GWM.effect.Effect | null;
    chance: number;
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
    get hordeTakesItem(): boolean;
    get generateEverywhere(): boolean;
    get buildAtOrigin(): boolean;
    get buildsInstances(): boolean;
    makeItem(data: BuildData): GWM.item.Item | null;
    markCandidates(data: BuildData, candidates: GWU.grid.NumGrid, distanceBound?: [number, number]): number;
    makePersonalSpace(_data: BuildData, x: number, y: number, candidates: GWU.grid.NumGrid): number;
    toString(): string;
}
declare function updateViewMap(builder: BuildData, buildStep: BuildStep): void;
declare function calcDistanceBound(builder: BuildData, buildStep: BuildStep): [number, number];
declare enum CandidateType {
    NOT_CANDIDATE = 0,
    OK = 1,
    IN_HALLWAY = 2,
    ON_BOUNDARY = 3,
    MUST_BE_ORIGIN = 4,
    NOT_ORIGIN = 5,
    OCCUPIED = 6,
    NOT_IN_VIEW = 7,
    TOO_FAR = 8,
    TOO_CLOSE = 9,
    INVALID_WALL = 10,
    BLOCKED = 11,
    FAILED = 12
}
declare function cellIsCandidate(builder: BuildData, blueprint: Blueprint, buildStep: BuildStep, x: number, y: number, distanceBound: [number, number]): CandidateType;

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
declare function markCandidates(buildData: BuildData): number;
declare function pickCandidateLoc(buildData: BuildData): GWU.xy.Loc | null;
declare function computeVestibuleInterior(builder: BuildData, blueprint: Blueprint): number;
declare function maximizeInterior(data: BuildData, minimumInteriorNeighbors?: number): void;
declare function prepareInterior(builder: BuildData): void;
declare const blueprints: Record<string, Blueprint>;
declare function install(id: string, blueprint: Blueprint | Partial<BlueprintOptions>): Blueprint;
declare function random(requiredFlags: number, depth: number, rng?: GWU.rng.Random): Blueprint;
declare function get(id: string | Blueprint): Blueprint;
declare function make(config: Partial<BlueprintOptions>): Blueprint;

declare class BuildData {
    site: BuildSite;
    blueprint: Blueprint;
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
    constructor(site: BuildSite, blueprint: Blueprint);
    free(): void;
    get rng(): GWU.rng.Random;
    reset(originX: number, originY: number): void;
    calcDistances(maxSize: number): void;
}

interface Logger {
    onDigFirstRoom(site: DigSite): void;
    onRoomCandidate(room: Room, roomSite: DigSite): void;
    onRoomFailed(site: DigSite, room: Room, roomSite: DigSite, error: string): void;
    onRoomSuccess(site: DigSite, room: Room): void;
    onLoopsAdded(site: DigSite): void;
    onLakesAdded(site: DigSite): void;
    onBridgesAdded(site: DigSite): void;
    onStairsAdded(site: DigSite): void;
    onBuildError(error: string): void;
    onBlueprintPick(data: BuildData, flags: number, depth: number): void;
    onBlueprintCandidates(data: BuildData): void;
    onBlueprintStart(data: BuildData, adoptedItem: GWM.item.Item | null): void;
    onBlueprintInterior(data: BuildData): void;
    onBlueprintFail(data: BuildData, error: string): void;
    onBlueprintSuccess(data: BuildData): void;
    onStepStart(data: BuildData, step: BuildStep, item: GWM.item.Item | null): void;
    onStepCandidates(data: BuildData, step: BuildStep, candidates: GWU.grid.NumGrid, wantCount: number): void;
    onStepInstanceSuccess(data: BuildData, step: BuildStep, x: number, y: number): void;
    onStepInstanceFail(data: BuildData, step: BuildStep, x: number, y: number, error: string): void;
    onStepSuccess(data: BuildData, step: BuildStep): void;
    onStepFail(data: BuildData, step: BuildStep, error: string): void;
}
declare class NullLogger implements Logger {
    onDigFirstRoom(): void;
    onRoomCandidate(): void;
    onRoomFailed(): void;
    onRoomSuccess(): void;
    onLoopsAdded(): void;
    onLakesAdded(): void;
    onBridgesAdded(): void;
    onStairsAdded(): void;
    onBuildError(): void;
    onBlueprintPick(): void;
    onBlueprintCandidates(): void;
    onBlueprintStart(): void;
    onBlueprintInterior(): void;
    onBlueprintFail(): void;
    onBlueprintSuccess(): void;
    onStepStart(): void;
    onStepCandidates(): void;
    onStepInstanceSuccess(): void;
    onStepInstanceFail(): void;
    onStepSuccess(): void;
    onStepFail(): void;
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
    _createSite(map: GWM.map.Map): void;
    _createSite(width: number, height: number): void;
    create(width: number, height: number, cb: DigFn): boolean;
    create(map: GWM.map.Map): boolean;
    _create(site: DigSite): boolean;
    start(site: DigSite): void;
    getDigger(id: string | string[] | Record<string, number> | RoomDigger): RoomDigger;
    addFirstRoom(site: DigSite): Room | null;
    addRoom(site: DigSite): Room | null;
    _attachRoom(site: DigSite, roomSite: DigSite, room: Room): boolean;
    _attachRoomAtLoc(site: DigSite, roomSite: DigSite, room: Room, attachLoc: GWU.xy.Loc): boolean;
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
declare function digMap(map: GWM.map.Map, options?: Partial<DiggerOptions>): boolean;

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
    getLevel(id: number, cb: DigFn): boolean;
    makeLevel(id: number, opts: Partial<DiggerOptions>, cb: DigFn): boolean;
}

declare type BlueType = Blueprint | string;
interface BuilderOptions {
    blueprints: BlueType[] | {
        [key: string]: BlueType;
    };
    log: Logger | boolean;
}
interface BuildInfo {
    x: number;
    y: number;
}
declare type BuildResult = BuildInfo | null;
declare class Builder {
    blueprints: Blueprint[] | null;
    log: Logger;
    constructor(options?: Partial<BuilderOptions>);
    _pickRandom(requiredFlags: number, depth: number, rng?: GWU.rng.Random): Blueprint | null;
    buildRandom(site: BuildSite | GWM.map.Map, requiredMachineFlags?: Flags, x?: number, y?: number, adoptedItem?: GWM.item.Item | null): BuildResult;
    build(site: BuildSite | GWM.map.Map, blueprint: Blueprint | string, x?: number, y?: number, adoptedItem?: GWM.item.Item | null): BuildResult;
    _buildAt(data: BuildData, x?: number, y?: number, adoptedItem?: GWM.item.Item | null): BuildResult;
    _build(data: BuildData, originX: number, originY: number, adoptedItem?: GWM.item.Item | null): BuildResult;
    _markCandidates(data: BuildData): number;
    _computeInterior(data: BuildData): boolean;
    _buildStep(data: BuildData, buildStep: BuildStep, adoptedItem: GWM.item.Item | null): boolean;
    _buildStepInstance(data: BuildData, buildStep: BuildStep, x: number, y: number, adoptedItem?: GWM.item.Item | null): boolean;
}
declare function build(blueprint: BlueType, map: GWM.map.Map, x: number, y: number, opts?: Partial<BuilderOptions>): BuildResult;

type index_d$2_BuildData = BuildData;
declare const index_d$2_BuildData: typeof BuildData;
type index_d$2_ItemOptions = ItemOptions;
type index_d$2_HordeOptions = HordeOptions;
type index_d$2_StepOptions = StepOptions;
type index_d$2_StepFlags = StepFlags;
declare const index_d$2_StepFlags: typeof StepFlags;
type index_d$2_BuildStep = BuildStep;
declare const index_d$2_BuildStep: typeof BuildStep;
declare const index_d$2_updateViewMap: typeof updateViewMap;
declare const index_d$2_calcDistanceBound: typeof calcDistanceBound;
type index_d$2_CandidateType = CandidateType;
declare const index_d$2_CandidateType: typeof CandidateType;
declare const index_d$2_cellIsCandidate: typeof cellIsCandidate;
type index_d$2_BlueType = BlueType;
type index_d$2_BuilderOptions = BuilderOptions;
type index_d$2_BuildInfo = BuildInfo;
type index_d$2_BuildResult = BuildResult;
type index_d$2_Builder = Builder;
declare const index_d$2_Builder: typeof Builder;
declare const index_d$2_build: typeof build;
type index_d$2_Flags = Flags;
declare const index_d$2_Flags: typeof Flags;
type index_d$2_BlueprintOptions = BlueprintOptions;
type index_d$2_Blueprint = Blueprint;
declare const index_d$2_Blueprint: typeof Blueprint;
declare const index_d$2_markCandidates: typeof markCandidates;
declare const index_d$2_pickCandidateLoc: typeof pickCandidateLoc;
declare const index_d$2_computeVestibuleInterior: typeof computeVestibuleInterior;
declare const index_d$2_maximizeInterior: typeof maximizeInterior;
declare const index_d$2_prepareInterior: typeof prepareInterior;
declare const index_d$2_blueprints: typeof blueprints;
declare const index_d$2_install: typeof install;
declare const index_d$2_random: typeof random;
declare const index_d$2_get: typeof get;
declare const index_d$2_make: typeof make;
declare namespace index_d$2 {
  export {
    index_d$2_BuildData as BuildData,
    index_d$2_ItemOptions as ItemOptions,
    index_d$2_HordeOptions as HordeOptions,
    index_d$2_StepOptions as StepOptions,
    index_d$2_StepFlags as StepFlags,
    index_d$2_BuildStep as BuildStep,
    index_d$2_updateViewMap as updateViewMap,
    index_d$2_calcDistanceBound as calcDistanceBound,
    index_d$2_CandidateType as CandidateType,
    index_d$2_cellIsCandidate as cellIsCandidate,
    index_d$2_BlueType as BlueType,
    index_d$2_BuilderOptions as BuilderOptions,
    index_d$2_BuildInfo as BuildInfo,
    index_d$2_BuildResult as BuildResult,
    index_d$2_Builder as Builder,
    index_d$2_build as build,
    index_d$2_Flags as Flags,
    index_d$2_BlueprintOptions as BlueprintOptions,
    index_d$2_Blueprint as Blueprint,
    index_d$2_markCandidates as markCandidates,
    index_d$2_pickCandidateLoc as pickCandidateLoc,
    index_d$2_computeVestibuleInterior as computeVestibuleInterior,
    index_d$2_maximizeInterior as maximizeInterior,
    index_d$2_prepareInterior as prepareInterior,
    index_d$2_blueprints as blueprints,
    index_d$2_install as install,
    index_d$2_random as random,
    index_d$2_get as get,
    index_d$2_make as make,
  };
}

declare class ConsoleLogger implements Logger {
    onDigFirstRoom(site: DigSite): void;
    onRoomCandidate(room: Room, roomSite: DigSite): void;
    onRoomFailed(_site: DigSite, _room: Room, _roomSite: DigSite, error: string): void;
    onRoomSuccess(site: DigSite, room: Room): void;
    onLoopsAdded(_site: DigSite): void;
    onLakesAdded(_site: DigSite): void;
    onBridgesAdded(_site: DigSite): void;
    onStairsAdded(_site: DigSite): void;
    onBuildError(error: string): void;
    onBlueprintPick(data: BuildData, flags: number, depth: number): void;
    onBlueprintCandidates(data: BuildData): void;
    onBlueprintStart(data: BuildData): void;
    onBlueprintInterior(data: BuildData): void;
    onBlueprintFail(data: BuildData, error: string): void;
    onBlueprintSuccess(data: BuildData): void;
    onStepStart(data: BuildData, step: BuildStep): void;
    onStepCandidates(data: BuildData, step: BuildStep, candidates: GWU.grid.NumGrid, wantCount: number): void;
    onStepInstanceSuccess(_data: BuildData, _step: BuildStep, x: number, y: number): void;
    onStepInstanceFail(_data: BuildData, _step: BuildStep, x: number, y: number, error: string): void;
    onStepSuccess(data: BuildData, step: BuildStep): void;
    onStepFail(data: BuildData, step: BuildStep, error: string): void;
}

type index_d$1_Logger = Logger;
type index_d$1_NullLogger = NullLogger;
declare const index_d$1_NullLogger: typeof NullLogger;
type index_d$1_ConsoleLogger = ConsoleLogger;
declare const index_d$1_ConsoleLogger: typeof ConsoleLogger;
declare namespace index_d$1 {
  export {
    index_d$1_Logger as Logger,
    index_d$1_NullLogger as NullLogger,
    index_d$1_ConsoleLogger as ConsoleLogger,
  };
}

interface MachineHordeConfig extends GWM.horde.HordeConfig {
    blueprint: BlueType;
}
declare class MachineHorde extends GWM.horde.Horde {
    machine: BlueType | null;
    constructor(config: MachineHordeConfig);
    _addLeader(leader: GWM.actor.Actor, map: GWM.map.Map, x: number, y: number, opts: GWM.horde.SpawnOptions): boolean;
}

type index_d_MachineHordeConfig = MachineHordeConfig;
type index_d_MachineHorde = MachineHorde;
declare const index_d_MachineHorde: typeof MachineHorde;
declare namespace index_d {
  export {
    index_d_MachineHordeConfig as MachineHordeConfig,
    index_d_MachineHorde as MachineHorde,
  };
}

export { DigFn, Digger, DiggerOptions, DoorOpts, Dungeon, DungeonOptions, Hall, LocPair, Room, RoomConfig, RoomOptions, index_d$2 as blueprint, bridge_d as bridge, digMap, hall_d as hall, index_d as horde, lake_d as lake, index_d$1 as log, loop_d as loop, makeHall, room_d as room, index_d$3 as site, stairs_d as stairs };
