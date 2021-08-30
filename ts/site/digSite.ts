import * as GWU from 'gw-utils';
import * as GWM from 'gw-map';
import * as Utils from './utils';

export const NOTHING = GWM.tile.get('NULL').index;
export const FLOOR = GWM.tile.get('FLOOR').index;

export const DOOR = GWM.tile.get('DOOR').index;
export const SECRET_DOOR = GWM.tile.get('DOOR_SECRET')?.index ?? -1;

export const WALL = GWM.tile.get('WALL').index;

export const DEEP = GWM.tile.get('LAKE').index;
export const SHALLOW = GWM.tile.get('SHALLOW').index;
export const BRIDGE = GWM.tile.get('BRIDGE').index;

export const UP_STAIRS = GWM.tile.get('UP_STAIRS').index;
export const DOWN_STAIRS = GWM.tile.get('DOWN_STAIRS').index;

export const IMPREGNABLE = GWM.tile.get('IMPREGNABLE').index;

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
    seed: number;

    free(): void;
    clear(): void;

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

    setTile(
        x: number,
        y: number,
        tile: string | number | GWM.tile.Tile,
        opts?: GWM.map.SetTileOptions
    ): boolean;

    hasTile(
        x: number,
        y: number,
        tile: string | number | GWM.tile.Tile
    ): boolean;
    getTileIndex(x: number, y: number): number;

    getMachine(x: number, y: number): number;

    updateDoorDirs(): void;
    getDoorDir(x: number, y: number): number;
}

export class GridSite implements DigSite {
    public tiles: GWU.grid.NumGrid;
    public doors: GWU.grid.NumGrid;
    public seed = 0;

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
    setTile(x: number, y: number, tile: number | string | GWM.tile.Tile) {
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

    hasTile(
        x: number,
        y: number,
        tile: number | string | GWM.tile.Tile
    ): boolean {
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
    //         tile === NOTHING
    //     );
    // }
}
