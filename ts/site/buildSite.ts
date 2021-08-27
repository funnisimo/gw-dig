import * as GWU from 'gw-utils';
import * as GWM from 'gw-map';

import * as DigSite from './digSite';

const Flags = GWM.flags.Cell;

export interface BuildSite extends DigSite.DigSite {
    getChokeCount(x: number, y: number): number;
    setChokeCount(x: number, y: number, count: number): void;

    isOccupied: GWU.xy.XYMatchFunc;
    hasItem: GWU.xy.XYMatchFunc;
    hasActor: GWU.xy.XYMatchFunc;

    hasCellFlag(x: number, y: number, flag: number): boolean;
    setCellFlag(x: number, y: number, flag: number): void;
    clearCellFlag(x: number, y: number, flag: number): void;

    makeRandomItem(
        tags: string | Partial<GWM.item.MatchOptions>
    ): GWM.item.Item;
    addItem(x: number, y: number, item: GWM.item.Item): boolean;

    analyze(): void;
    fireEffect(effect: GWM.effect.EffectInfo, x: number, y: number): boolean;

    backup(): any;
    restore(backup: any): void;

    nextMachineId(): number;
    setMachine(x: number, y: number, id: number, isRoom?: boolean): void;
}

export class MapSite implements BuildSite {
    public map: GWM.map.Map;
    public machineCount = 0;

    constructor(map: GWM.map.Map) {
        this.map = map;
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
        tile: string | number | GWM.tile.Tile
    ): boolean {
        return this.map.cellInfo(x, y).hasTile(tile);
    }

    setTile(
        x: number,
        y: number,
        tile: string | number | GWM.tile.Tile,
        opts?: Partial<GWM.map.SetOptions>
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
    makeRandomItem(
        tags: string | Partial<GWM.item.MatchOptions>
    ): GWM.item.Item {
        return GWM.item.makeRandom(tags);
    }
    addItem(x: number, y: number, item: GWM.item.Item): boolean {
        return this.map.forceItem(x, y, item);
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
            .hasEntityFlag(GWM.flags.Entity.L_BLOCKS_DIAGONAL);
    }
    blocksPathing(x: number, y: number): boolean {
        const info = this.map.cellInfo(x, y);
        return (
            info.hasEntityFlag(GWM.flags.Entity.L_BLOCKS_MOVE) ||
            info.hasTileFlag(GWM.tile.flags.Tile.T_PATHING_BLOCKER)
        );
    }
    blocksItems(x: number, y: number): boolean {
        return this.map
            .cellInfo(x, y)
            .hasEntityFlag(GWM.flags.Entity.L_BLOCKS_ITEMS);
    }
    blocksEffects(x: number, y: number): boolean {
        return this.map
            .cellInfo(x, y)
            .hasEntityFlag(GWM.flags.Entity.L_BLOCKS_EFFECTS);
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
        return this.map
            .cellInfo(x, y)
            .hasTileFlag(GWM.tile.flags.Tile.T_BRIDGE);
    }
    isDoor(x: number, y: number): boolean {
        return this.map
            .cellInfo(x, y)
            .hasTileFlag(GWM.tile.flags.Tile.T_IS_DOOR);
    }
    isSecretDoor(x: number, y: number): boolean {
        return this.map
            .cellInfo(x, y)
            .hasEntityFlag(GWM.flags.Entity.L_SECRETLY_PASSABLE);
    }
    isDeep(x: number, y: number): boolean {
        return this.map
            .cellInfo(x, y)
            .hasTileFlag(GWM.tile.flags.Tile.T_DEEP_WATER);
    }
    isShallow(x: number, y: number): boolean {
        if (!this.hasXY(x, y)) return false;
        const cell = this.map.cell(x, y);
        return (
            !!cell.depthTile(GWM.flags.Depth.LIQUID) &&
            !cell.hasTileFlag(GWM.tile.flags.Tile.T_IS_DEEP_LIQUID)
        );
    }
    isAnyLiquid(x: number, y: number): boolean {
        if (!this.hasXY(x, y)) return false;
        const cell = this.map.cell(x, y);
        return (
            cell.hasDepthTile(GWM.flags.Depth.LIQUID) ||
            cell.hasTileFlag(GWM.tile.flags.Tile.T_IS_DEEP_LIQUID)
        );
    }
    isOccupied(x: number, y: number) {
        return this.hasItem(x, y) || this.hasActor(x, y);
    }

    isPassable(x: number, y: number): boolean {
        const info = this.map.cellInfo(x, y);
        return !(info.blocksMove() || info.blocksPathing());
    }

    // tileBlocksMove(tile: number): boolean {
    //     return GWM.tile.get(tile).blocksMove();
    // }

    backup(): MapSite {
        const site = new MapSite(this.map.clone());
        site.machineCount = this.machineCount;
        return site;
    }

    restore(backup: MapSite) {
        this.map.copy(backup.map);
        this.machineCount = backup.machineCount;
    }

    free() {}

    getChokeCount(x: number, y: number): number {
        return this.map.cell(x, y).chokeCount;
    }

    setChokeCount(x: number, y: number, count: number) {
        this.map.cell(x, y).chokeCount = count;
    }

    analyze() {
        GWM.map.analyze(this.map);
    }
    fireEffect(effect: GWM.effect.EffectInfo, x: number, y: number): boolean {
        return GWM.effect.fireSync(effect, this.map, x, y);
    }

    nextMachineId(): number {
        return ++this.machineCount;
    }
    getMachine(x: number, y: number) {
        return this.map.cell(x, y).machineId;
    }
    setMachine(x: number, y: number, id: number, isRoom = true) {
        this.map.cell(x, y).machineId = id;
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
