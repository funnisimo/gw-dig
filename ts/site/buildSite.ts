import * as GW from 'gw-utils';
import * as DigSite from './digSite';

const Flags = GW.map.flags.Cell;

export interface BuildSite extends DigSite.DigSite {
    getChokeCount(x: number, y: number): number;
    setChokeCount(x: number, y: number, count: number): void;

    isOccupied: GW.utils.XYMatchFunc;
    hasItem: GW.utils.XYMatchFunc;
    hasActor: GW.utils.XYMatchFunc;

    hasCellFlag(x: number, y: number, flag: number): boolean;
    setCellFlag(x: number, y: number, flag: number): void;
    clearCellFlag(x: number, y: number, flag: number): void;

    analyze(): void;
    fireEffect(effect: GW.effect.EffectInfo, x: number, y: number): boolean;

    backup(): any;
    restore(backup: any): void;

    nextMachineId(): number;
    getMachine(x: number, y: number): number;
    setMachine(x: number, y: number, id: number, isRoom?: boolean): void;
}

export class MapSite implements BuildSite {
    public map: GW.map.Map;
    public machineId: GW.grid.NumGrid;
    public machineCount = 0;

    constructor(map: GW.map.Map) {
        this.map = map;
        this.machineId = new GW.grid.NumGrid(map.width, map.height);
    }

    get width(): number {
        return this.map.width;
    }
    get height(): number {
        return this.map.height;
    }

    hasXY(x: number, y: number): boolean {
        return this.map.hasXY(x, y);
    }
    isBoundaryXY(x: number, y: number): boolean {
        return this.map.isBoundaryXY(x, y);
    }

    hasCellFlag(x: number, y: number, flag: number): boolean {
        return this.map.cellInfo(x, y).hasCellFlag(flag);
    }
    setCellFlag(x: number, y: number, flag: number): void {
        this.map.cell(x, y).setCellFlag(flag);
    }
    clearCellFlag(x: number, y: number, flag: number): void {
        this.map.cell(x, y).clearCellFlag(flag);
    }

    hasTile(
        x: number,
        y: number,
        tile: string | number | GW.tile.Tile
    ): boolean {
        return this.map.cellInfo(x, y).hasTile(tile);
    }

    setTile(
        x: number,
        y: number,
        tile: string | number | GW.tile.Tile,
        opts?: Partial<GW.map.SetOptions>
    ): boolean {
        return this.map.setTile(x, y, tile, opts);
    }

    getTileIndex(x: number, y: number): number {
        if (!this.hasXY(x, y)) return 0;
        const cell = this.map.cell(x, y);
        const tile = cell.highestPriorityTile();
        return tile.index;
    }

    clear() {
        this.map.cells.forEach((c) => c.clear());
    }

    hasItem(x: number, y: number): boolean {
        return this.map.cellInfo(x, y).hasItem();
    }
    hasActor(x: number, y: number): boolean {
        return this.map.hasActor(x, y);
    }

    blocksMove(x: number, y: number): boolean {
        return this.map.cellInfo(x, y).blocksMove();
    }
    blocksVision(x: number, y: number): boolean {
        return this.map.cellInfo(x, y).blocksVision();
    }
    blocksDiagonal(x: number, y: number): boolean {
        return this.map
            .cellInfo(x, y)
            .hasObjectFlag(GW.gameObject.flags.GameObject.L_BLOCKS_DIAGONAL);
    }
    blocksPathing(x: number, y: number): boolean {
        const info = this.map.cellInfo(x, y);
        return (
            info.hasObjectFlag(GW.gameObject.flags.GameObject.L_BLOCKS_MOVE) ||
            info.hasTileFlag(GW.tile.flags.Tile.T_PATHING_BLOCKER)
        );
    }
    blocksItems(x: number, y: number): boolean {
        return this.map
            .cellInfo(x, y)
            .hasObjectFlag(GW.gameObject.flags.GameObject.L_BLOCKS_ITEMS);
    }
    blocksEffects(x: number, y: number): boolean {
        return this.map
            .cellInfo(x, y)
            .hasObjectFlag(GW.gameObject.flags.GameObject.L_BLOCKS_EFFECTS);
    }

    isWall(x: number, y: number): boolean {
        return this.map.cellInfo(x, y).isWall();
    }
    isStairs(x: number, y: number): boolean {
        return this.map.cellInfo(x, y).isStairs();
    }
    isSet(x: number, y: number): boolean {
        return this.hasXY(x, y) && !this.map.cell(x, y).isEmpty();
    }
    isDiggable(x: number, y: number): boolean {
        if (!this.hasXY(x, y)) return false;
        const cell = this.map.cell(x, y);
        if (cell.isEmpty()) return true;
        if (cell.isWall()) return true;
        return false;
    }
    isNothing(x: number, y: number): boolean {
        return this.hasXY(x, y) && this.map.cell(x, y).isEmpty();
    }
    isFloor(x: number, y: number): boolean {
        return this.isPassable(x, y);
    }
    isBridge(x: number, y: number): boolean {
        return this.map.cellInfo(x, y).hasTileFlag(GW.tile.flags.Tile.T_BRIDGE);
    }
    isDoor(x: number, y: number): boolean {
        return this.map
            .cellInfo(x, y)
            .hasTileFlag(GW.tile.flags.Tile.T_IS_DOOR);
    }
    isSecretDoor(x: number, y: number): boolean {
        return this.map
            .cellInfo(x, y)
            .hasObjectFlag(GW.gameObject.flags.GameObject.L_SECRETLY_PASSABLE);
    }
    isDeep(x: number, y: number): boolean {
        return this.map
            .cellInfo(x, y)
            .hasTileFlag(GW.tile.flags.Tile.T_DEEP_WATER);
    }
    isShallow(x: number, y: number): boolean {
        if (!this.hasXY(x, y)) return false;
        const cell = this.map.cell(x, y);
        return (
            !!cell.depthTile(GW.gameObject.flags.Depth.LIQUID) &&
            !cell.hasTileFlag(GW.tile.flags.Tile.T_IS_DEEP_LIQUID)
        );
    }
    isAnyLiquid(x: number, y: number): boolean {
        if (!this.hasXY(x, y)) return false;
        const cell = this.map.cell(x, y);
        return (
            cell.hasDepthTile(GW.gameObject.flags.Depth.LIQUID) ||
            cell.hasTileFlag(GW.tile.flags.Tile.T_IS_DEEP_LIQUID)
        );
    }
    isOccupied(x: number, y: number) {
        return this.hasItem(x, y) || this.hasActor(x, y);
    }

    isPassable(x: number, y: number): boolean {
        return !this.map.cellInfo(x, y).blocksMove();
    }

    tileBlocksMove(tile: number): boolean {
        return GW.tile.get(tile).blocksMove();
    }

    backup(): GW.map.Map {
        return this.map.clone();
    }

    restore(backup: GW.map.Map) {
        this.map = backup;
    }

    free() {}

    getChokeCount(x: number, y: number): number {
        return this.map.cell(x, y).chokeCount;
    }

    setChokeCount(x: number, y: number, count: number) {
        this.map.cell(x, y).chokeCount = count;
    }

    analyze() {
        GW.map.analyze(this.map);
    }
    fireEffect(effect: GW.effect.EffectInfo, x: number, y: number): boolean {
        return GW.effect.fireSync(effect, this.map, x, y);
    }

    nextMachineId(): number {
        return ++this.machineCount;
    }
    getMachine(x: number, y: number) {
        return this.machineId[x][y];
    }
    setMachine(x: number, y: number, id: number, isRoom = true) {
        this.machineId[x][y] = id;
        if (id == 0) {
            this.map.clearCellFlag(x, y, Flags.IS_IN_MACHINE);
        } else {
            this.map.setCellFlag(
                x,
                y,
                isRoom ? Flags.IS_IN_ROOM_MACHINE : Flags.IS_IN_AREA_MACHINE
            );
        }
    }
}
