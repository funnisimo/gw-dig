import * as GW from 'gw-utils';

export const NOTHING = GW.tile.get('NULL').index;
export const FLOOR = GW.tile.get('FLOOR').index;

export const DOOR = GW.tile.get('DOOR').index;
export const SECRET_DOOR = GW.tile.get('DOOR_SECRET')?.index ?? -1;

export const WALL = GW.tile.get('WALL').index;

export const DEEP = GW.tile.get('LAKE').index;
export const SHALLOW = GW.tile.get('SHALLOW').index;
export const BRIDGE = GW.tile.get('BRIDGE').index;

export const UP_STAIRS = GW.tile.get('UP_STAIRS').index;
export const DOWN_STAIRS = GW.tile.get('DOWN_STAIRS').index;

export const IMPREGNABLE = GW.tile.get('IMPREGNABLE').index;

export const TILEMAP = {
    [NOTHING]: 'NULL',
    [FLOOR]: 'FLOOR',
    [DOOR]: 'DOOR',
    [WALL]: 'WALL',
    [IMPREGNABLE]: 'IMPREGNABLE',
    [DEEP]: 'LAKE',
    [SHALLOW]: 'SHALLOW',
    [BRIDGE]: 'BRIDGE',

    [UP_STAIRS]: 'UP_STAIRS',
    [DOWN_STAIRS]: 'DOWN_STAIRS',
};

export interface DigSite {
    readonly width: number;
    readonly height: number;

    free(): void;
    clear(): void;

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

    setTile(
        x: number,
        y: number,
        tile: string | number | GW.tile.Tile,
        opts?: GW.map.SetTileOptions
    ): boolean;

    hasTile(
        x: number,
        y: number,
        tile: string | number | GW.tile.Tile
    ): boolean;
    getTileIndex(x: number, y: number): number;

    tileBlocksMove(tile: number): boolean;
}

export class GridSite implements DigSite {
    public tiles: GW.grid.NumGrid;

    constructor(width: number, height: number) {
        this.tiles = GW.grid.alloc(width, height);
    }

    free() {
        GW.grid.free(this.tiles);
    }
    clear() {
        this.tiles.fill(0);
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
        return v === NOTHING;
    }

    isDiggable(x: number, y: number) {
        const v = this.tiles.get(x, y);
        return v === NOTHING;
    }

    isFloor(x: number, y: number) {
        return this.tiles.get(x, y) == FLOOR;
    }

    isDoor(x: number, y: number) {
        const v = this.tiles.get(x, y);
        return v === DOOR;
    }

    isSecretDoor(x: number, y: number) {
        const v = this.tiles.get(x, y);
        return v === SECRET_DOOR;
    }

    isBridge(x: number, y: number) {
        const v = this.tiles.get(x, y);
        return v === BRIDGE;
    }

    isWall(x: number, y: number) {
        const v = this.tiles.get(x, y);
        return v === WALL || v === IMPREGNABLE;
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
        return v === UP_STAIRS || v === DOWN_STAIRS;
    }

    isDeep(x: number, y: number) {
        return this.tiles.get(x, y) === DEEP;
    }

    isShallow(x: number, y: number) {
        return this.tiles.get(x, y) === SHALLOW;
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
    setTile(x: number, y: number, tile: number | string | GW.tile.Tile) {
        if (tile instanceof GW.tile.Tile) {
            tile = tile.index;
        }
        if (typeof tile === 'string') {
            const obj = GW.tile.tiles[tile];
            if (!obj) throw new Error('Failed to find tie: ' + tile);
            tile = obj.index;
        }
        if (!this.tiles.hasXY(x, y)) return false;
        this.tiles[x][y] = tile;
        return true;
    }

    hasTile(
        x: number,
        y: number,
        tile: number | string | GW.tile.Tile
    ): boolean {
        if (tile instanceof GW.tile.Tile) {
            tile = tile.index;
        }
        if (typeof tile === 'string') {
            const obj = GW.tile.tiles[tile];
            if (!obj) throw new Error('Failed to find tie: ' + tile);
            tile = obj.index;
        }
        return this.tiles.hasXY(x, y) && this.tiles[x][y] == tile;
    }

    tileBlocksMove(tile: number): boolean {
        return (
            tile === WALL ||
            tile === DEEP ||
            tile === IMPREGNABLE ||
            tile === NOTHING
        );
    }
}
