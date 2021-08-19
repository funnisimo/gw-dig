import * as GW from 'gw-utils';
import * as DigSite from '../dig/site';

const Flags = GW.map.flags.Cell;

export * from '../dig/site';

export interface BuildSite extends DigSite.DigSite, GW.map.MapType {
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

export class MapSite extends GW.map.Map implements BuildSite {
    public machineId: GW.grid.NumGrid;
    public machineCount = 0;

    constructor(width: number, height: number) {
        super(width, height);
        this.machineId = new GW.grid.NumGrid(width, height);
    }

    hasItem(x: number, y: number): boolean {
        return this.cellInfo(x, y).hasItem();
    }
    isPassable(x: number, y: number): boolean {
        return !this.cellInfo(x, y).blocksMove();
    }
    blocksMove(x: number, y: number): boolean {
        return this.cellInfo(x, y).blocksMove();
    }
    isWall(x: number, y: number): boolean {
        return this.cellInfo(x, y).isWall();
    }
    isStairs(x: number, y: number): boolean {
        return this.cellInfo(x, y).isStairs();
    }
    hasTile(
        x: number,
        y: number,
        tile: string | number | GW.tile.Tile
    ): boolean {
        return this.cellInfo(x, y).hasTile(tile);
    }

    free() {}

    isSet(x: number, y: number): boolean {
        return this.hasXY(x, y) && !this.cell(x, y).isEmpty();
    }
    isDiggable(x: number, y: number): boolean {
        if (!this.hasXY(x, y)) return false;
        const cell = this.cell(x, y);
        if (cell.isEmpty()) return true;
        if (cell.isWall()) return true;
        return false;
    }
    isNothing(x: number, y: number): boolean {
        return this.hasXY(x, y) && this.cell(x, y).isEmpty();
    }
    isFloor(x: number, y: number): boolean {
        return this.isPassable(x, y);
    }
    isBridge(x: number, y: number): boolean {
        return this.cellInfo(x, y).hasTileFlag(GW.tile.flags.Tile.T_BRIDGE);
    }
    isDoor(x: number, y: number): boolean {
        return this.cellInfo(x, y).hasTileFlag(GW.tile.flags.Tile.T_IS_DOOR);
    }
    isSecretDoor(x: number, y: number): boolean {
        return this.cellInfo(x, y).hasObjectFlag(
            GW.gameObject.flags.GameObject.L_SECRETLY_PASSABLE
        );
    }
    blocksDiagonal(x: number, y: number): boolean {
        return this.cellInfo(x, y).hasObjectFlag(
            GW.gameObject.flags.GameObject.L_BLOCKS_DIAGONAL
        );
    }
    blocksPathing(x: number, y: number): boolean {
        const info = this.cellInfo(x, y);
        return (
            info.hasObjectFlag(GW.gameObject.flags.GameObject.L_BLOCKS_MOVE) ||
            info.hasTileFlag(GW.tile.flags.Tile.T_PATHING_BLOCKER)
        );
    }
    blocksItems(x: number, y: number): boolean {
        return this.cellInfo(x, y).hasObjectFlag(
            GW.gameObject.flags.GameObject.L_BLOCKS_ITEMS
        );
    }
    blocksEffects(x: number, y: number): boolean {
        return this.cellInfo(x, y).hasObjectFlag(
            GW.gameObject.flags.GameObject.L_BLOCKS_EFFECTS
        );
    }
    isDeep(x: number, y: number): boolean {
        return this.cellInfo(x, y).hasTileFlag(GW.tile.flags.Tile.T_DEEP_WATER);
    }
    isShallow(x: number, y: number): boolean {
        if (!this.hasXY(x, y)) return false;
        const cell = this.cell(x, y);
        return (
            !!cell.depthTile(GW.gameObject.flags.Depth.LIQUID) &&
            !cell.hasTileFlag(GW.tile.flags.Tile.T_IS_DEEP_LIQUID)
        );
    }
    isAnyLiquid(x: number, y: number): boolean {
        if (!this.hasXY(x, y)) return false;
        const cell = this.cell(x, y);
        return (
            cell.hasDepthTile(GW.gameObject.flags.Depth.LIQUID) ||
            cell.hasTileFlag(GW.tile.flags.Tile.T_IS_DEEP_LIQUID)
        );
    }
    getTileIndex(x: number, y: number): number {
        if (!this.hasXY(x, y)) return 0;
        const cell = this.cell(x, y);
        const tile = cell.highestPriorityTile();
        return tile.index;
    }
    tileBlocksMove(tile: number): boolean {
        return GW.tile.get(tile).blocksMove();
    }

    backup(): MapSite {
        const backup = new MapSite(this.width, this.height);
        backup.copy(this);
        backup.machineId.copy(this.machineId);
        backup.machineCount = this.machineCount;
        return backup;
    }

    restore(backup: MapSite) {
        this.copy(backup);
        this.machineId.copy(backup.machineId);
        this.machineCount = backup.machineCount;
    }

    getChokeCount(x: number, y: number): number {
        return this.cell(x, y).chokeCount;
    }

    setChokeCount(x: number, y: number, count: number) {
        this.cell(x, y).chokeCount = count;
    }

    isOccupied(x: number, y: number) {
        return this.hasItem(x, y) || this.hasActor(x, y);
    }

    analyze() {
        GW.map.analyze(this);
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
            this.clearCellFlag(x, y, Flags.IS_IN_MACHINE);
        } else {
            this.setCellFlag(
                x,
                y,
                isRoom ? Flags.IS_IN_ROOM_MACHINE : Flags.IS_IN_AREA_MACHINE
            );
        }
    }
}
