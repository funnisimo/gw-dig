import * as GWU from 'gw-utils';
import * as GWM from 'gw-map';
import * as Utils from './utils';

import * as DIG from './digSite';

export class GridSite implements DIG.DigSite {
    public tiles: GWU.grid.NumGrid;
    public doors: GWU.grid.NumGrid;
    public rng: GWU.rng.Random = GWU.rng.random;

    constructor(width: number, height: number) {
        this.tiles = GWU.grid.alloc(width, height);
        this.doors = GWU.grid.alloc(width, height);
    }

    free() {
        GWU.grid.free(this.tiles);
        GWU.grid.free(this.doors);
    }
    clear() {
        this.tiles.fill(0);
        this.doors.fill(0);
    }
    dump() {
        this.tiles.dump();
    }
    drawInto(buffer: GWU.canvas.Buffer): void {
        buffer.blackOut();
        this.tiles.forEach((t, x, y) => {
            const tile = GWM.tile.get(t);
            buffer.drawSprite(x, y, tile.sprite);
        });
    }

    setSeed(seed: number) {
        this.rng.seed(seed);
    }

    get width() {
        return this.tiles.width;
    }
    get height() {
        return this.tiles.height;
    }

    hasXY(x: number, y: number) {
        return this.tiles.hasXY(x, y);
    }
    isBoundaryXY(x: number, y: number) {
        return this.tiles.isBoundaryXY(x, y);
    }

    isPassable(x: number, y: number) {
        return (
            this.isFloor(x, y) ||
            this.isDoor(x, y) ||
            this.isBridge(x, y) ||
            this.isStairs(x, y) ||
            this.isShallow(x, y)
        );
    }

    isNothing(x: number, y: number) {
        const v = this.tiles.get(x, y);
        return v === DIG.NOTHING;
    }

    isDiggable(x: number, y: number) {
        const v = this.tiles.get(x, y);
        return v === DIG.NOTHING || v === DIG.WALL;
    }

    isFloor(x: number, y: number) {
        return this.tiles.get(x, y) == DIG.FLOOR;
    }

    isDoor(x: number, y: number) {
        const v = this.tiles.get(x, y);
        return v === DIG.DOOR;
    }

    isSecretDoor(x: number, y: number) {
        const v = this.tiles.get(x, y);
        return v === DIG.SECRET_DOOR;
    }

    isBridge(x: number, y: number) {
        const v = this.tiles.get(x, y);
        return v === DIG.BRIDGE;
    }

    isWall(x: number, y: number) {
        const v = this.tiles.get(x, y);
        return v === DIG.WALL || v === DIG.IMPREGNABLE;
    }

    blocksMove(x: number, y: number) {
        return this.isNothing(x, y) || this.isWall(x, y) || this.isDeep(x, y);
    }

    blocksDiagonal(x: number, y: number) {
        return this.isNothing(x, y) || this.isWall(x, y);
    }

    blocksPathing(x: number, y: number) {
        return (
            this.isNothing(x, y) ||
            this.isWall(x, y) ||
            this.isDeep(x, y) ||
            this.isStairs(x, y)
        );
    }

    blocksVision(x: number, y: number) {
        return this.isNothing(x, y) || this.isWall(x, y);
    }

    blocksItems(x: number, y: number) {
        return this.blocksPathing(x, y) || this.blocksPathing(x, y);
    }

    blocksEffects(x: number, y: number) {
        return this.isWall(x, y);
    }

    isStairs(x: number, y: number) {
        const v = this.tiles.get(x, y);
        return v === DIG.UP_STAIRS || v === DIG.DOWN_STAIRS;
    }

    isDeep(x: number, y: number) {
        return this.tiles.get(x, y) === DIG.DEEP;
    }

    isShallow(x: number, y: number) {
        return this.tiles.get(x, y) === DIG.SHALLOW;
    }

    isAnyLiquid(x: number, y: number) {
        return this.isDeep(x, y) || this.isShallow(x, y);
    }

    isSet(x: number, y: number) {
        return (this.tiles.get(x, y) || 0) > 0;
    }

    getTileIndex(x: number, y: number): number {
        return this.tiles.get(x, y) || 0;
    }
    setTile(x: number, y: number, tile: GWM.tile.TileBase) {
        if (tile instanceof GWM.tile.Tile) {
            tile = tile.index;
        }
        if (typeof tile === 'string') {
            const obj = GWM.tile.tiles[tile];
            if (!obj) throw new Error('Failed to find tie: ' + tile);
            tile = obj.index;
        }
        if (!this.tiles.hasXY(x, y)) return false;
        this.tiles[x][y] = tile;
        return true;
    }
    clearCell(x: number, y: number, tile: GWM.tile.TileBase) {
        return this.setTile(x, y, tile);
    }

    hasTile(x: number, y: number, tile: GWM.tile.TileBase): boolean {
        if (tile instanceof GWM.tile.Tile) {
            tile = tile.index;
        }
        if (typeof tile === 'string') {
            const obj = GWM.tile.tiles[tile];
            if (!obj) throw new Error('Failed to find tie: ' + tile);
            tile = obj.index;
        }
        return this.tiles.hasXY(x, y) && this.tiles[x][y] == tile;
    }

    getMachine(_x: number, _y: number): number {
        return 0;
    }

    updateDoorDirs(): void {
        this.doors.update((_v, x, y) => {
            return Utils.directionOfDoorSite(this, x, y);
        });
    }
    getDoorDir(x: number, y: number): number {
        return this.doors[x][y];
    }

    // tileBlocksMove(tile: number): boolean {
    //     return (
    //         tile === WALL ||
    //         tile === DEEP ||
    //         tile === IMPREGNABLE ||
    //         tile === DIG.NOTHING
    //     );
    // }
}
