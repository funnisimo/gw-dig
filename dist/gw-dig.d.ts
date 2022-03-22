import * as GWU from 'gw-utils';

declare type TileId = string;
interface RoomConfig {
    tile?: TileId;
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

interface TileConfig {
    blocksMove?: boolean;
    blocksVision?: boolean;
    blocksPathing?: boolean;
    connectsLevel?: boolean;
    secretDoor?: boolean;
    door?: boolean;
    stairs?: boolean;
    liquid?: boolean;
    impregnable?: boolean;
    tags?: string | string[];
    priority?: number | string;
    ch?: string;
    extends?: string;
}
interface TileOptions$1 extends TileConfig {
    id: string;
}
interface TileInfo extends TileOptions$1 {
    id: string;
    index: number;
    priority: number;
    tags: string[];
}
declare const tileIds: Record<string, number>;
declare const allTiles: TileInfo[];
declare function installTile(cfg: TileOptions$1): TileInfo;
declare function installTile(id: string, opts?: TileConfig): TileInfo;
declare function getTile(name: string | number): TileInfo;
declare function tileId(name: string | number): number;
declare function blocksMove(name: string | number): boolean;

declare type ItemId = string;
interface ItemInstance {
    id: string;
    make?: Record<string, any>;
    key?: {
        x: number;
        y: number;
        disposable?: boolean;
    };
    x: number;
    y: number;
}
interface ItemConfig {
    id: ItemId;
    make?: Record<string, any>;
    tags?: GWU.tags.TagBase;
    frequency?: GWU.frequency.FrequencyConfig;
    requiredTile?: string;
    feature?: string;
    blueprint?: string;
}
interface ItemMatchOptions {
    tags: string | string[];
    forbidTags: string | string[];
    rng?: GWU.rng.Random;
}
interface ItemInfo {
    id: ItemId;
    make: Record<string, any>;
    tags: string[];
    frequency: GWU.frequency.FrequencyFn;
    flags: number;
    requiredTile: string | null;
    feature: string | null;
    blueprint: string | null;
}
declare const items: ItemInfo[];
declare function installItem(config: ItemConfig): ItemInfo;
declare function installItem(id: string, cfg: Omit<ItemConfig, 'id'>): ItemInfo;
declare function pickItem(depth: number, tagRules: string | {
    tags: string;
} | {
    id: string;
}, rng?: GWU.rng.Random): ItemInfo | null;
declare function makeItem(info: ItemInfo): ItemInstance;
declare function getItemInfo(id: string): ItemInfo | undefined;

interface FeatureObj {
    [key: string]: any;
}
declare type FeatureConfig = string | FeatureObj;
declare type FeatureFn = (site: Site, x: number, y: number) => boolean;
declare type MakeFn = (cfg: any) => FeatureFn;
declare const features: Record<string, FeatureFn>;
declare function install$3(name: string, fn: FeatureFn | FeatureConfig): void;
declare const types: Record<string, MakeFn>;
declare function installType(name: string, fn: MakeFn): void;
declare function feature(id: string | string[] | {
    id: string;
}): FeatureFn;
declare function featureFeature(id: string, site: Site, x: number, y: number): boolean;
declare function make$1(obj: FeatureConfig): FeatureFn;
declare function make$1(id: string, config: FeatureConfig): FeatureFn;
declare function makeArray(cfg: string): FeatureFn[];
declare function makeArray(obj: FeatureObj): FeatureFn[];
declare function makeArray(arr: FeatureFn[]): FeatureFn[];

interface TileOptions extends SetTileOptions {
    id: string;
    protected?: boolean;
}
declare function tile(src: string | TileOptions): FeatureFn;
declare function tileAction(cfg: TileOptions, site: Site, x: number, y: number): boolean;

declare function chance(opts: any): FeatureFn;
declare function chanceAction(cfg: number, site: Site): boolean;

declare enum Flags$2 {
    E_TREAT_AS_BLOCKING,
    E_PERMIT_BLOCKING,
    E_ABORT_IF_BLOCKS_MAP,
    E_BLOCKED_BY_ITEMS,
    E_BLOCKED_BY_ACTORS,
    E_BLOCKED_BY_OTHER_LAYERS,
    E_SUPERPRIORITY,
    E_IGNORE_FOV,
    E_EVACUATE_CREATURES,
    E_EVACUATE_ITEMS,
    E_BUILD_IN_WALLS,
    E_MUST_TOUCH_WALLS,
    E_NO_TOUCH_WALLS,
    E_CLEAR_GROUND,
    E_CLEAR_SURFACE,
    E_CLEAR_LIQUID,
    E_CLEAR_GAS,
    E_CLEAR_TILE,
    E_CLEAR_CELL,
    E_ONLY_IF_EMPTY
}
interface SpreadInfo {
    grow: number;
    decrement: number;
    matchTile: string;
    features: FeatureFn[];
    flags: number;
}
interface SpreadConfig extends Partial<Omit<SpreadInfo, 'flags' | 'features'>> {
    features?: FeatureConfig;
    flags?: GWU.flag.FlagBase;
}
interface SpreadFn extends FeatureFn {
    config: SpreadInfo;
}
declare type SpreadArgs = [number, number, FeatureConfig, SpreadConfig?];
declare function spread(config: SpreadArgs | SpreadConfig): SpreadFn;
declare function spread(grow: number, decrement: number, action: FeatureConfig, opts?: SpreadConfig): SpreadFn;
declare function spreadFeature(cfg: SpreadInfo, site: Site, x: number, y: number): boolean;
declare function mapDisruptedBy(map: Site, blockingGrid: GWU.grid.NumGrid, blockingToMapX?: number, blockingToMapY?: number): boolean;
declare function computeSpawnMap(effect: SpreadInfo, spawnMap: GWU.grid.NumGrid, site: Site, x: number, y: number): boolean;
declare function clearCells(map: Site, spawnMap: GWU.grid.NumGrid, _flags?: number): boolean;
declare function evacuateCreatures(map: Site, blockingMap: GWU.grid.NumGrid): boolean;
declare function evacuateItems(map: Site, blockingMap: GWU.grid.NumGrid): boolean;

type index_d$3_TileOptions = TileOptions;
declare const index_d$3_tile: typeof tile;
declare const index_d$3_tileAction: typeof tileAction;
declare const index_d$3_chance: typeof chance;
declare const index_d$3_chanceAction: typeof chanceAction;
type index_d$3_FeatureObj = FeatureObj;
type index_d$3_FeatureConfig = FeatureConfig;
type index_d$3_FeatureFn = FeatureFn;
type index_d$3_MakeFn = MakeFn;
declare const index_d$3_features: typeof features;
declare const index_d$3_types: typeof types;
declare const index_d$3_installType: typeof installType;
declare const index_d$3_feature: typeof feature;
declare const index_d$3_featureFeature: typeof featureFeature;
declare const index_d$3_makeArray: typeof makeArray;
type index_d$3_SpreadInfo = SpreadInfo;
type index_d$3_SpreadConfig = SpreadConfig;
type index_d$3_SpreadFn = SpreadFn;
type index_d$3_SpreadArgs = SpreadArgs;
declare const index_d$3_spread: typeof spread;
declare const index_d$3_spreadFeature: typeof spreadFeature;
declare const index_d$3_mapDisruptedBy: typeof mapDisruptedBy;
declare const index_d$3_computeSpawnMap: typeof computeSpawnMap;
declare const index_d$3_clearCells: typeof clearCells;
declare const index_d$3_evacuateCreatures: typeof evacuateCreatures;
declare const index_d$3_evacuateItems: typeof evacuateItems;
declare namespace index_d$3 {
  export {
    index_d$3_TileOptions as TileOptions,
    index_d$3_tile as tile,
    index_d$3_tileAction as tileAction,
    index_d$3_chance as chance,
    index_d$3_chanceAction as chanceAction,
    index_d$3_FeatureObj as FeatureObj,
    index_d$3_FeatureConfig as FeatureConfig,
    index_d$3_FeatureFn as FeatureFn,
    index_d$3_MakeFn as MakeFn,
    index_d$3_features as features,
    install$3 as install,
    index_d$3_types as types,
    index_d$3_installType as installType,
    index_d$3_feature as feature,
    index_d$3_featureFeature as featureFeature,
    make$1 as make,
    index_d$3_makeArray as makeArray,
    Flags$2 as Flags,
    index_d$3_SpreadInfo as SpreadInfo,
    index_d$3_SpreadConfig as SpreadConfig,
    index_d$3_SpreadFn as SpreadFn,
    index_d$3_SpreadArgs as SpreadArgs,
    index_d$3_spread as spread,
    index_d$3_spreadFeature as spreadFeature,
    index_d$3_mapDisruptedBy as mapDisruptedBy,
    index_d$3_computeSpawnMap as computeSpawnMap,
    index_d$3_clearCells as clearCells,
    index_d$3_evacuateCreatures as evacuateCreatures,
    index_d$3_evacuateItems as evacuateItems,
  };
}

declare type HordeId = string;
interface ActorInstance {
    id: string;
    make: Record<string, any>;
    x: number;
    y: number;
    machine: number;
    leader?: ActorInstance;
    item?: ItemInstance;
}
interface MemberConfig {
    count?: GWU.range.RangeBase;
    make?: Record<string, any>;
}
interface HordeConfig {
    id?: string;
    leader: HordeId;
    make?: Record<string, any>;
    members?: Record<HordeId, GWU.range.RangeBase | MemberConfig>;
    tags?: GWU.tags.TagBase;
    frequency?: GWU.frequency.FrequencyConfig;
    requiredTile?: string;
    feature?: string;
    blueprint?: string;
}
interface MemberInfo {
    count: GWU.range.Range;
    make: Record<string, any>;
}
interface HordeInfo {
    id?: string;
    leader: HordeId;
    make: Record<string, any>;
    members: Record<HordeId, MemberInfo>;
    tags: string[];
    frequency: GWU.frequency.FrequencyFn;
    flags: number;
    requiredTile: string | null;
    feature: FeatureFn | null;
    blueprint: string | null;
}
declare const hordes: HordeInfo[];
declare function installHorde(config: HordeConfig): HordeInfo;
declare function pickHorde(depth: number, rules: string | {
    id: string;
} | {
    tags: string | string[];
}, rng?: GWU.rng.Random): HordeInfo | null;
interface HordeFlagsType {
    horde: number;
}
interface SpawnOptions {
    canSpawn: GWU.xy.XYMatchFunc;
    rng: GWU.rng.Random;
    machine: number;
}
declare function spawnHorde(info: HordeInfo, map: Site, x?: number, y?: number, opts?: Partial<SpawnOptions>): ActorInstance | null;

interface SetTileOptions {
    superpriority?: boolean;
    blockedByOtherLayers?: boolean;
    blockedByActors?: boolean;
    blockedByItems?: boolean;
    volume?: number;
    machine?: number;
}
declare const Flags$1: Record<string, number>;
interface SiteOptions {
    rng?: GWU.rng.Random;
}
declare class Site {
    _tiles: GWU.grid.NumGrid;
    _doors: GWU.grid.NumGrid;
    _flags: GWU.grid.NumGrid;
    _machine: GWU.grid.NumGrid;
    _chokeCounts: GWU.grid.NumGrid;
    rng: GWU.rng.Random;
    items: ItemInstance[];
    actors: ActorInstance[];
    depth: number;
    machineCount: number;
    constructor(width: number, height: number, opts?: SiteOptions);
    free(): void;
    clear(): void;
    dump(fmt?: GWU.grid.GridFormat<number>): void;
    copy(other: Site): void;
    copyTiles(other: Site, offsetX?: number, offsetY?: number): void;
    setSeed(seed: number): void;
    get width(): number;
    get height(): number;
    hasXY(x: number, y: number): boolean;
    isBoundaryXY(x: number, y: number): boolean;
    isPassable(x: number, y: number): boolean;
    isNothing(x: number, y: number): boolean;
    isDiggable(x: number, y: number): boolean;
    isProtected(_x: number, _y: number): boolean;
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
    tileBlocksMove(tile: string): boolean;
    setTile(x: number, y: number, tile: string | number, _opts?: SetTileOptions): boolean;
    clearTile(x: number, y: number): void;
    getTile(x: number, y: number): TileInfo;
    makeImpregnable(x: number, y: number): void;
    isImpregnable(x: number, y: number): boolean;
    hasTile(x: number, y: number, tile: string | number): boolean;
    getChokeCount(x: number, y: number): number;
    setChokeCount(x: number, y: number, count: number): void;
    setChokepoint(x: number, y: number): void;
    isChokepoint(x: number, y: number): boolean;
    clearChokepoint(x: number, y: number): void;
    setGateSite(x: number, y: number): void;
    isGateSite(x: number, y: number): boolean;
    clearGateSite(x: number, y: number): void;
    setInLoop(x: number, y: number): void;
    isInLoop(x: number, y: number): boolean;
    clearInLoop(x: number, y: number): void;
    analyze(updateChokeCounts?: boolean): void;
    snapshot(): Site;
    restore(snapshot: Site): void;
    nextMachineId(): number;
    setMachine(x: number, y: number, id: number, isRoom?: boolean): void;
    isAreaMachine(x: number, y: number): boolean;
    isInMachine(x: number, y: number): boolean;
    getMachine(x: number, y: number): number;
    needsMachine(_x: number, _y: number): boolean;
    updateDoorDirs(): void;
    getDoorDir(x: number, y: number): number;
    isOccupied(x: number, y: number): boolean;
    canSpawnActor(x: number, y: number, _actor: ActorInstance): boolean;
    eachActor(cb: (a: ActorInstance) => void): void;
    addActor(x: number, y: number, a: ActorInstance): number;
    getActor(i: number): ActorInstance;
    forbidsActor(x: number, y: number, _a: ActorInstance): boolean;
    hasActor(x: number, y: number): boolean;
    eachItem(cb: (i: ItemInstance) => void): void;
    addItem(x: number, y: number, i: ItemInstance): number;
    getItem(i: number): ItemInstance;
    forbidsItem(x: number, y: number, _i: ItemInstance): boolean;
    hasItem(x: number, y: number): boolean;
}

declare function loadSite(site: Site, cells: string[], tiles: Record<string, string>): void;
declare function directionOfDoorSite(site: Site, x: number, y: number): number;
declare function chooseRandomDoorSites(site: Site): GWU.xy.Loc[];
declare function fillCostGrid(source: Site, costGrid: GWU.grid.NumGrid): void;
interface DisruptOptions {
    offsetX: number;
    offsetY: number;
    machine: number;
    updateWalkable: (grid: GWU.grid.NumGrid) => boolean;
}
declare function siteDisruptedByXY(site: Site, x: number, y: number, options?: Partial<DisruptOptions>): boolean;
declare function siteDisruptedBy(site: Site, blockingGrid: GWU.grid.NumGrid, options?: Partial<DisruptOptions>): boolean;
declare function siteDisruptedSize(site: Site, blockingGrid: GWU.grid.NumGrid, blockingToMapX?: number, blockingToMapY?: number): number;
declare function computeDistanceMap(site: Site, distanceMap: GWU.grid.NumGrid, originX: number, originY: number, maxDistance: number): void;
declare function clearInteriorFlag(site: Site, machine: number): void;

declare function analyze(map: Site, updateChokeCounts?: boolean): void;
declare function updateChokepoints(map: Site, updateCounts: boolean): void;
declare function floodFillCount(map: Site, results: GWU.grid.NumGrid, passMap: GWU.grid.NumGrid, startX: number, startY: number): number;
declare function updateLoopiness(map: Site): void;
declare function resetLoopiness(map: Site): void;
declare function checkLoopiness(map: Site): void;
declare function fillInnerLoopGrid(map: Site, grid: GWU.grid.NumGrid): void;
declare function cleanLoopiness(map: Site): void;

interface HordeStepOptions {
    id?: string;
    tags?: string;
    feature?: FeatureConfig;
    make?: Record<string, any>;
}
interface ItemStepOptions {
    id?: string;
    tags?: string;
    make?: Record<string, any>;
    feature?: FeatureConfig;
}
interface StepOptions {
    tile: string;
    flags: GWU.flag.FlagBase;
    pad: number;
    count: GWU.range.RangeBase;
    item: string | ItemStepOptions;
    horde: string | boolean | HordeStepOptions;
    feature: FeatureConfig;
}
interface HordeStepInfo extends HordeStepOptions {
    tags: string;
    feature?: FeatureFn;
}
interface ItemStepInfo extends ItemStepOptions {
    tags: string;
    feature?: FeatureFn;
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
    tile: string | null;
    flags: number;
    pad: number;
    count: GWU.range.Range;
    item: ItemStepInfo | null;
    horde: HordeStepInfo | null;
    feature: FeatureFn | null;
    chance: number;
    index: number;
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
declare function install$2(id: string, blueprint: Blueprint | Partial<BlueprintOptions>): Blueprint;
declare function random(requiredFlags: number, depth: number, rng?: GWU.rng.Random): Blueprint;
declare function get(id: string | Blueprint): Blueprint;
declare function make(config: Partial<BlueprintOptions>): Blueprint;

declare class BuildData {
    site: Site;
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
    constructor(site: Site, blueprint: Blueprint, machine?: number);
    free(): void;
    get rng(): GWU.rng.Random;
    reset(originX: number, originY: number): void;
    calcDistances(maxSize: number): void;
}

interface Logger {
    onDigFirstRoom(site: Site): void;
    onRoomCandidate(room: Room, roomSite: Site): void;
    onRoomFailed(site: Site, room: Room, roomSite: Site, error: string): void;
    onRoomSuccess(site: Site, room: Room): void;
    onLoopsAdded(site: Site): void;
    onLakesAdded(site: Site): void;
    onBridgesAdded(site: Site): void;
    onStairsAdded(site: Site): void;
    onBuildError(error: string): void;
    onBlueprintPick(data: BuildData, flags: number, depth: number): void;
    onBlueprintCandidates(data: BuildData): void;
    onBlueprintStart(data: BuildData, adoptedItem: ItemInstance | null): void;
    onBlueprintInterior(data: BuildData): void;
    onBlueprintFail(data: BuildData, error: string): void;
    onBlueprintSuccess(data: BuildData): void;
    onStepStart(data: BuildData, step: BuildStep, item: ItemInstance | null): void;
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

declare class ConsoleLogger implements Logger {
    onDigFirstRoom(site: Site): void;
    onRoomCandidate(room: Room, roomSite: Site): void;
    onRoomFailed(_site: Site, _room: Room, _roomSite: Site, error: string): void;
    onRoomSuccess(site: Site, room: Room): void;
    onLoopsAdded(_site: Site): void;
    onLakesAdded(_site: Site): void;
    onBridgesAdded(_site: Site): void;
    onStairsAdded(_site: Site): void;
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

type index_d$2_Logger = Logger;
type index_d$2_NullLogger = NullLogger;
declare const index_d$2_NullLogger: typeof NullLogger;
type index_d$2_ConsoleLogger = ConsoleLogger;
declare const index_d$2_ConsoleLogger: typeof ConsoleLogger;
declare namespace index_d$2 {
  export {
    index_d$2_Logger as Logger,
    index_d$2_NullLogger as NullLogger,
    index_d$2_ConsoleLogger as ConsoleLogger,
  };
}

type index_d$1_TileId = TileId;
type index_d$1_TileConfig = TileConfig;
type index_d$1_TileInfo = TileInfo;
declare const index_d$1_tileIds: typeof tileIds;
declare const index_d$1_allTiles: typeof allTiles;
declare const index_d$1_installTile: typeof installTile;
declare const index_d$1_getTile: typeof getTile;
declare const index_d$1_tileId: typeof tileId;
declare const index_d$1_blocksMove: typeof blocksMove;
type index_d$1_HordeId = HordeId;
type index_d$1_ActorInstance = ActorInstance;
type index_d$1_MemberConfig = MemberConfig;
type index_d$1_HordeConfig = HordeConfig;
type index_d$1_MemberInfo = MemberInfo;
type index_d$1_HordeInfo = HordeInfo;
declare const index_d$1_hordes: typeof hordes;
declare const index_d$1_installHorde: typeof installHorde;
declare const index_d$1_pickHorde: typeof pickHorde;
type index_d$1_HordeFlagsType = HordeFlagsType;
type index_d$1_SpawnOptions = SpawnOptions;
declare const index_d$1_spawnHorde: typeof spawnHorde;
type index_d$1_ItemId = ItemId;
type index_d$1_ItemInstance = ItemInstance;
type index_d$1_ItemConfig = ItemConfig;
type index_d$1_ItemMatchOptions = ItemMatchOptions;
type index_d$1_ItemInfo = ItemInfo;
declare const index_d$1_items: typeof items;
declare const index_d$1_installItem: typeof installItem;
declare const index_d$1_pickItem: typeof pickItem;
declare const index_d$1_makeItem: typeof makeItem;
declare const index_d$1_getItemInfo: typeof getItemInfo;
type index_d$1_SetTileOptions = SetTileOptions;
type index_d$1_SiteOptions = SiteOptions;
type index_d$1_Site = Site;
declare const index_d$1_Site: typeof Site;
declare const index_d$1_loadSite: typeof loadSite;
declare const index_d$1_directionOfDoorSite: typeof directionOfDoorSite;
declare const index_d$1_chooseRandomDoorSites: typeof chooseRandomDoorSites;
declare const index_d$1_fillCostGrid: typeof fillCostGrid;
type index_d$1_DisruptOptions = DisruptOptions;
declare const index_d$1_siteDisruptedByXY: typeof siteDisruptedByXY;
declare const index_d$1_siteDisruptedBy: typeof siteDisruptedBy;
declare const index_d$1_siteDisruptedSize: typeof siteDisruptedSize;
declare const index_d$1_computeDistanceMap: typeof computeDistanceMap;
declare const index_d$1_clearInteriorFlag: typeof clearInteriorFlag;
declare const index_d$1_analyze: typeof analyze;
declare const index_d$1_updateChokepoints: typeof updateChokepoints;
declare const index_d$1_floodFillCount: typeof floodFillCount;
declare const index_d$1_updateLoopiness: typeof updateLoopiness;
declare const index_d$1_resetLoopiness: typeof resetLoopiness;
declare const index_d$1_checkLoopiness: typeof checkLoopiness;
declare const index_d$1_fillInnerLoopGrid: typeof fillInnerLoopGrid;
declare const index_d$1_cleanLoopiness: typeof cleanLoopiness;
declare namespace index_d$1 {
  export {
    index_d$2 as log,
    index_d$1_TileId as TileId,
    index_d$1_TileConfig as TileConfig,
    TileOptions$1 as TileOptions,
    index_d$1_TileInfo as TileInfo,
    index_d$1_tileIds as tileIds,
    index_d$1_allTiles as allTiles,
    index_d$1_installTile as installTile,
    index_d$1_getTile as getTile,
    index_d$1_tileId as tileId,
    index_d$1_blocksMove as blocksMove,
    index_d$1_HordeId as HordeId,
    index_d$1_ActorInstance as ActorInstance,
    index_d$1_MemberConfig as MemberConfig,
    index_d$1_HordeConfig as HordeConfig,
    index_d$1_MemberInfo as MemberInfo,
    index_d$1_HordeInfo as HordeInfo,
    index_d$1_hordes as hordes,
    index_d$1_installHorde as installHorde,
    index_d$1_pickHorde as pickHorde,
    index_d$1_HordeFlagsType as HordeFlagsType,
    index_d$1_SpawnOptions as SpawnOptions,
    index_d$1_spawnHorde as spawnHorde,
    index_d$1_ItemId as ItemId,
    index_d$1_ItemInstance as ItemInstance,
    index_d$1_ItemConfig as ItemConfig,
    index_d$1_ItemMatchOptions as ItemMatchOptions,
    index_d$1_ItemInfo as ItemInfo,
    index_d$1_items as items,
    index_d$1_installItem as installItem,
    index_d$1_pickItem as pickItem,
    index_d$1_makeItem as makeItem,
    index_d$1_getItemInfo as getItemInfo,
    index_d$1_SetTileOptions as SetTileOptions,
    Flags$1 as Flags,
    index_d$1_SiteOptions as SiteOptions,
    index_d$1_Site as Site,
    index_d$1_loadSite as loadSite,
    index_d$1_directionOfDoorSite as directionOfDoorSite,
    index_d$1_chooseRandomDoorSites as chooseRandomDoorSites,
    index_d$1_fillCostGrid as fillCostGrid,
    index_d$1_DisruptOptions as DisruptOptions,
    index_d$1_siteDisruptedByXY as siteDisruptedByXY,
    index_d$1_siteDisruptedBy as siteDisruptedBy,
    index_d$1_siteDisruptedSize as siteDisruptedSize,
    index_d$1_computeDistanceMap as computeDistanceMap,
    index_d$1_clearInteriorFlag as clearInteriorFlag,
    index_d$1_analyze as analyze,
    index_d$1_updateChokepoints as updateChokepoints,
    index_d$1_floodFillCount as floodFillCount,
    index_d$1_updateLoopiness as updateLoopiness,
    index_d$1_resetLoopiness as resetLoopiness,
    index_d$1_checkLoopiness as checkLoopiness,
    index_d$1_fillInnerLoopGrid as fillInnerLoopGrid,
    index_d$1_cleanLoopiness as cleanLoopiness,
  };
}

declare function checkConfig(config: RoomConfig, expected?: RoomConfig): RoomConfig;
declare abstract class RoomDigger {
    options: RoomConfig;
    doors: GWU.xy.Loc[];
    constructor(config: RoomConfig, expected?: RoomConfig);
    _setOptions(config: RoomConfig, expected?: RoomConfig): void;
    create(site: Site): Room;
    abstract carve(site: Site): Room;
}
declare var rooms: Record<string, RoomDigger>;
declare class ChoiceRoom extends RoomDigger {
    randomRoom: (rng: GWU.rng.Random) => string;
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
declare function install$1(id: string, room: RoomDigger): RoomDigger;

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
    install$1 as install,
  };
}

declare function isDoorLoc(site: Site, loc: GWU.xy.Loc, dir: GWU.xy.Loc): boolean;
declare type WidthBase = number | string | number[] | {
    [key: number]: number;
};
declare function pickWidth(width: WidthBase, rng?: GWU.rng.Random): number;
declare function pickLength(dir: number, lengths: [GWU.range.Range, GWU.range.Range], rng?: GWU.rng.Random): number;
declare function pickHallDirection(site: Site, doors: GWU.xy.Loc[], lengths: [GWU.range.Range, GWU.range.Range]): number;
declare function pickHallExits(site: Site, x: number, y: number, dir: number, obliqueChance: number): GWU.types.Loc[];
interface HallOptions {
    width: number | string;
    length: number | string | number[] | string[];
    tile: TileId;
    obliqueChance: number;
    chance: number;
}
interface HallConfig {
    width: WidthBase;
    length: [GWU.range.Range, GWU.range.Range];
    tile: string;
    obliqueChance: number;
    chance: number;
}
declare class HallDigger {
    config: HallConfig;
    constructor(options?: Partial<HallOptions>);
    _setOptions(options?: Partial<HallOptions>): void;
    create(site: Site, doors?: GWU.xy.Loc[]): Hall | null;
    _digLine(site: Site, door: GWU.xy.Loc, dir: GWU.xy.Loc, length: number): number[];
    dig(site: Site, dir: number, door: GWU.xy.Loc, length: number): Hall;
    digWide(site: Site, dir: number, door: GWU.xy.Loc, length: number, width: number): Hall;
}
declare function dig(config: Partial<HallOptions>, site: Site, doors: GWU.xy.Loc[]): Hall | null;
declare var halls: Record<string, HallDigger>;
declare function install(id: string, hall: HallDigger): HallDigger;

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
declare const hall_d_install: typeof install;
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
    hall_d_install as install,
  };
}

interface LakeOpts {
    height: number;
    width: number;
    minSize: number;
    tries: number;
    count: number;
    canDisrupt: boolean;
    wreathTile: TileId;
    wreathChance: number;
    wreathSize: number;
    tile: TileId;
}
declare class Lakes {
    options: LakeOpts;
    constructor(options?: Partial<LakeOpts>);
    create(site: Site): number;
    isDisruptedBy(site: Site, lakeGrid: GWU.grid.NumGrid, lakeToMapX?: number, lakeToMapY?: number): boolean;
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
    isBridgeCandidate(site: Site, x: number, y: number, _bridgeDir: [number, number]): boolean;
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
    upTile: TileId;
    downTile: TileId;
    wall: TileId;
}
declare class Stairs {
    options: StairOpts;
    constructor(options?: Partial<StairOpts>);
    create(site: Site): Record<string, GWU.types.Loc> | null;
    hasXY(site: Site, x: number, y: number): boolean;
    isStairXY(site: Site, x: number, y: number): boolean;
    setupStairs(site: Site, x: number, y: number, tile: TileId, wallTile: TileId): boolean;
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
    tile: string;
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
    lakes?: Partial<LakeOpts> | boolean | number;
    bridges?: Partial<BridgeOpts> | boolean | number;
    stairs?: Partial<StairOpts> | boolean;
    doors?: Partial<DoorOpts> | boolean;
    rooms?: number | Partial<RoomOptions>;
    startLoc?: GWU.xy.Loc;
    endLoc?: GWU.xy.Loc;
    goesUp?: boolean;
    seed?: number;
    boundary?: boolean;
    log?: Logger | boolean;
}
declare class Digger {
    site: Site;
    seed: number;
    rooms: Partial<RoomOptions>;
    doors: Partial<DoorOpts>;
    halls: Partial<HallOptions>;
    loops: Partial<LoopOptions> | null;
    lakes: Partial<LakeOpts> | null;
    bridges: Partial<BridgeOpts> | null;
    stairs: Partial<StairOpts> | null;
    boundary: boolean;
    locations: Record<string, GWU.xy.Loc>;
    _locs: Record<string, GWU.xy.Loc>;
    goesUp: boolean;
    seq: number[];
    log: Logger;
    constructor(options?: DiggerOptions);
    _makeRoomSite(width: number, height: number): Site;
    _createSite(width: number, height: number): void;
    create(width: number, height: number, cb: DigFn): boolean;
    create(map: GWU.grid.NumGrid): boolean;
    create(map: Site): boolean;
    _create(site: Site): boolean;
    start(site: Site): void;
    getDigger(id: string | string[] | Record<string, number> | RoomDigger): RoomDigger;
    addRooms(site: Site): void;
    addFirstRoom(site: Site): Room | null;
    addRoom(site: Site): Room | null;
    _attachRoom(site: Site, roomSite: Site, room: Room): boolean;
    _attachRoomAtLoc(site: Site, roomSite: Site, room: Room, attachLoc: GWU.xy.Loc): boolean;
    _roomFitsAt(map: Site, roomGrid: Site, room: Room, roomToSiteX: number, roomToSiteY: number): boolean;
    _attachDoor(site: Site, room: Room, x: number, y: number, dir: number): void;
    addLoops(site: Site, opts: Partial<LoopOptions>): number;
    addLakes(site: Site, opts: Partial<LakeOpts>): number;
    addBridges(site: Site, opts: Partial<BridgeOpts>): number;
    addStairs(site: Site, opts: Partial<StairOpts>): boolean;
    finish(site: Site): void;
    _removeDiagonalOpenings(site: Site): void;
    _finishDoors(site: Site): void;
    _finishWalls(site: Site): void;
}

interface DungeonOptions extends DiggerOptions {
    levels: number;
    goesUp?: boolean;
    width: number;
    height: number;
    entrance?: string | string[] | Record<string, number> | RoomDigger;
    startLoc?: GWU.xy.Loc;
    startTile?: TileId;
    stairDistance?: number;
    endLoc?: GWU.xy.Loc;
    endTile?: TileId;
}
declare type LocPair = [GWU.xy.Loc, GWU.xy.Loc];
declare class Dungeon {
    config: DungeonOptions;
    seeds: number[];
    stairLocs: LocPair[];
    constructor(options: DungeonOptions);
    get length(): number;
    _initSeeds(): void;
    _initStairLocs(): void;
    getLevel(id: number, cb: DigFn): boolean;
    _makeLevel(id: number, opts: DiggerOptions, cb: DigFn): boolean;
}

declare type BlueType = Blueprint | string;
interface BuilderOptions {
    blueprints: BlueType[] | {
        [key: string]: BlueType;
    };
    log: Logger | boolean;
    seed: number;
}
interface BuildInfo {
    x: number;
    y: number;
}
declare type BuildResult = BuildInfo | null;
declare class Builder {
    blueprints: Blueprint[] | null;
    log: Logger;
    seed: number;
    constructor(options?: Partial<BuilderOptions>);
    _pickRandom(requiredFlags: number, depth: number, rng?: GWU.rng.Random): Blueprint | null;
    buildRandom(site: Site, requiredMachineFlags?: Flags, x?: number, y?: number, adoptedItem?: ItemInstance | null): BuildResult;
    build(site: Site, blueprint: Blueprint | string, x?: number, y?: number, adoptedItem?: ItemInstance | null): BuildResult;
    _buildAt(data: BuildData, x?: number, y?: number, adoptedItem?: ItemInstance | null): BuildResult;
    _build(data: BuildData, originX: number, originY: number, adoptedItem?: ItemInstance | null): BuildResult;
    _markCandidates(data: BuildData): number;
    _computeInterior(data: BuildData): boolean;
    _buildStep(data: BuildData, buildStep: BuildStep, adoptedItem: ItemInstance | null): boolean;
    _buildStepInstance(data: BuildData, buildStep: BuildStep, x: number, y: number, adoptedItem?: ItemInstance | null): boolean;
}
declare function build(blueprint: BlueType, site: Site, x: number, y: number, opts?: Partial<BuilderOptions>): BuildResult;

type index_d_BuildData = BuildData;
declare const index_d_BuildData: typeof BuildData;
type index_d_HordeStepOptions = HordeStepOptions;
type index_d_ItemStepOptions = ItemStepOptions;
type index_d_StepOptions = StepOptions;
type index_d_HordeStepInfo = HordeStepInfo;
type index_d_ItemStepInfo = ItemStepInfo;
type index_d_StepFlags = StepFlags;
declare const index_d_StepFlags: typeof StepFlags;
type index_d_BuildStep = BuildStep;
declare const index_d_BuildStep: typeof BuildStep;
declare const index_d_updateViewMap: typeof updateViewMap;
declare const index_d_calcDistanceBound: typeof calcDistanceBound;
type index_d_CandidateType = CandidateType;
declare const index_d_CandidateType: typeof CandidateType;
declare const index_d_cellIsCandidate: typeof cellIsCandidate;
type index_d_BlueType = BlueType;
type index_d_BuilderOptions = BuilderOptions;
type index_d_BuildInfo = BuildInfo;
type index_d_BuildResult = BuildResult;
type index_d_Builder = Builder;
declare const index_d_Builder: typeof Builder;
declare const index_d_build: typeof build;
type index_d_Flags = Flags;
declare const index_d_Flags: typeof Flags;
type index_d_BlueprintOptions = BlueprintOptions;
type index_d_Blueprint = Blueprint;
declare const index_d_Blueprint: typeof Blueprint;
declare const index_d_markCandidates: typeof markCandidates;
declare const index_d_pickCandidateLoc: typeof pickCandidateLoc;
declare const index_d_computeVestibuleInterior: typeof computeVestibuleInterior;
declare const index_d_maximizeInterior: typeof maximizeInterior;
declare const index_d_prepareInterior: typeof prepareInterior;
declare const index_d_blueprints: typeof blueprints;
declare const index_d_random: typeof random;
declare const index_d_get: typeof get;
declare const index_d_make: typeof make;
declare namespace index_d {
  export {
    index_d_BuildData as BuildData,
    index_d_HordeStepOptions as HordeStepOptions,
    index_d_ItemStepOptions as ItemStepOptions,
    index_d_StepOptions as StepOptions,
    index_d_HordeStepInfo as HordeStepInfo,
    index_d_ItemStepInfo as ItemStepInfo,
    index_d_StepFlags as StepFlags,
    index_d_BuildStep as BuildStep,
    index_d_updateViewMap as updateViewMap,
    index_d_calcDistanceBound as calcDistanceBound,
    index_d_CandidateType as CandidateType,
    index_d_cellIsCandidate as cellIsCandidate,
    index_d_BlueType as BlueType,
    index_d_BuilderOptions as BuilderOptions,
    index_d_BuildInfo as BuildInfo,
    index_d_BuildResult as BuildResult,
    index_d_Builder as Builder,
    index_d_build as build,
    index_d_Flags as Flags,
    index_d_BlueprintOptions as BlueprintOptions,
    index_d_Blueprint as Blueprint,
    index_d_markCandidates as markCandidates,
    index_d_pickCandidateLoc as pickCandidateLoc,
    index_d_computeVestibuleInterior as computeVestibuleInterior,
    index_d_maximizeInterior as maximizeInterior,
    index_d_prepareInterior as prepareInterior,
    index_d_blueprints as blueprints,
    install$2 as install,
    index_d_random as random,
    index_d_get as get,
    index_d_make as make,
  };
}

export { DigFn, Digger, DiggerOptions, DoorOpts, Dungeon, DungeonOptions, Hall, LocPair, Room, RoomConfig, RoomOptions, TileId, index_d as blueprint, bridge_d as bridge, index_d$3 as feature, hall_d as hall, lake_d as lake, loop_d as loop, makeHall, room_d as room, index_d$1 as site, stairs_d as stairs };
