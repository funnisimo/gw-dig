import * as GW from 'gw-utils';
import * as DigSite from '../dig/site';

const Flags = GW.map.flags.Cell;

export interface BuildSite extends DigSite.DigSite {
    hasCellFlag: (x: number, y: number, flag: number) => boolean;
    setCellFlag: (x: number, y: number, flag: number) => void;
    clearCellFlag: (x: number, y: number, flag: number) => void;

    getChokeCount: (x: number, y: number) => number;
    setChokeCount: (x: number, y: number, count: number) => void;

    isOccupied: GW.utils.XYMatchFunc;
    hasItem: GW.utils.XYMatchFunc;
    hasActor: GW.utils.XYMatchFunc;

    setTile: (
        x: number,
        y: number,
        tile: number | string,
        options?: GW.map.SetTileOptions
    ) => boolean;

    backup: () => any;
    restore: (backup: any) => void;

    nextMachineId: () => number;
    getMachine: (x: number, y: number) => number;
    setMachine: (x: number, y: number, id: number, isRoom?: boolean) => void;
}

export class MapSite implements BuildSite {
    public map: GW.map.Map;
    public machineId: GW.grid.NumGrid;
    public machineCount = 0;

    constructor(width: number, height: number) {
        this.map = new GW.map.Map(width, height);
        this.machineId = new GW.grid.NumGrid(width, height);
    }

    hasCellFlag(x: number, y: number, flag: number): boolean {
        return this.map.hasCellFlag(x, y, flag);
    }
    setCellFlag(x: number, y: number, flag: number): void {
        this.map.setCellFlag(x, y, flag);
    }
    clearCellFlag(x: number, y: number, flag: number): void {
        this.map.clearCellFlag(x, y, flag);
    }

    free() {}

    hasXY(x: number, y: number): boolean {
        return this.map.hasXY(x, y);
    }
    isBoundaryXY(x: number, y: number): boolean {
        return this.map.isBoundaryXY(x, y);
    }
    isSet(x: number, y: number): boolean {
        return this.map.hasXY(x, y) && !this.map.cell(x, y).isEmpty();
    }
    isDiggable(x: number, y: number): boolean {
        if (!this.map.hasXY(x, y)) return false;
        const cell = this.map.cell(x, y);
        if (cell.isEmpty()) return true;
        if (cell.isWall()) return true;
        return false;
    }
    isNothing(x: number, y: number): boolean {
        return this.map.hasXY(x, y) && this.map.cell(x, y).isEmpty();
    }
    isPassable(x: number, y: number): boolean {
        return this.map.isPassable(x, y);
    }
    isFloor(x: number, y: number): boolean {
        return this.map.isPassable(x, y);
    }
    isBridge(x: number, y: number): boolean {
        return this.map.hasTileFlag(x, y, GW.tile.flags.Tile.T_BRIDGE);
    }
    isDoor(x: number, y: number): boolean {
        return this.map.hasTileFlag(x, y, GW.tile.flags.Tile.T_IS_DOOR);
    }
    isSecretDoor(x: number, y: number): boolean {
        return this.map.hasObjectFlag(
            x,
            y,
            GW.gameObject.flags.GameObject.L_SECRETLY_PASSABLE
        );
    }
    blocksMove(x: number, y: number): boolean {
        return this.map.blocksMove(x, y);
    }
    blocksDiagonal(x: number, y: number): boolean {
        return this.map.hasObjectFlag(
            x,
            y,
            GW.gameObject.flags.GameObject.L_BLOCKS_DIAGONAL
        );
    }
    blocksPathing(x: number, y: number): boolean {
        return (
            this.map.hasObjectFlag(
                x,
                y,
                GW.gameObject.flags.GameObject.L_BLOCKS_MOVE
            ) ||
            this.map.hasTileFlag(x, y, GW.tile.flags.Tile.T_PATHING_BLOCKER)
        );
    }
    blocksVision(x: number, y: number): boolean {
        return this.map.blocksVision(x, y);
    }
    blocksItems(x: number, y: number): boolean {
        return this.map.hasObjectFlag(
            x,
            y,
            GW.gameObject.flags.GameObject.L_BLOCKS_ITEMS
        );
    }
    blocksEffects(x: number, y: number): boolean {
        return this.map.hasObjectFlag(
            x,
            y,
            GW.gameObject.flags.GameObject.L_BLOCKS_EFFECTS
        );
    }
    isWall(x: number, y: number): boolean {
        return this.map.isWall(x, y);
    }
    isStairs(x: number, y: number): boolean {
        return this.map.isStairs(x, y);
    }
    isDeep(x: number, y: number): boolean {
        return this.map.hasTileFlag(x, y, GW.tile.flags.Tile.T_DEEP_WATER);
    }
    isShallow(x: number, y: number): boolean {
        if (!this.hasXY(x, y)) return false;
        const cell = this.map.cell(x, y);
        return (
            cell.depthTile(GW.gameObject.flags.Depth.LIQUID) &&
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
    hasTile(x: number, y: number, tile: string | number): boolean {
        return this.map.hasTile(x, y, tile);
    }
    getTileIndex(x: number, y: number): number {
        if (!this.map.hasXY(x, y)) return 0;
        const cell = this.map.cell(x, y);
        const tile = cell.highestPriorityTile();
        return tile.index;
    }
    tileBlocksMove(tile: number): boolean {
        return GW.tile.get(tile).blocksMove();
    }

    get width() {
        return this.map.width;
    }
    get height() {
        return this.map.height;
    }

    backup(): MapSite {
        const backup = new MapSite(this.width, this.height);
        backup.map.copy(this.map);
        backup.machineId.copy(this.machineId);
        backup.machineCount = this.machineCount;
        return backup;
    }

    restore(backup: MapSite) {
        this.map.copy(backup.map);
        this.machineId.copy(backup.machineId);
        this.machineCount = backup.machineCount;
    }

    getChokeCount(x: number, y: number): number {
        return this.map.cell(x, y).chokeCount;
    }

    setChokeCount(x: number, y: number, count: number) {
        this.map.cell(x, y).chokeCount = count;
    }

    isOccupied(x: number, y: number) {
        return this.hasItem(x, y) || this.hasActor(x, y);
    }
    hasItem(x: number, y: number) {
        return this.map.hasItem(x, y);
    }
    hasActor(x: number, y: number) {
        return this.map.hasActor(x, y);
    }

    setTile(
        x: number,
        y: number,
        tile: number | string,
        options?: GW.map.SetTileOptions
    ) {
        return this.map.setTile(x, y, tile, options);
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
