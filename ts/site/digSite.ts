import * as GWU from 'gw-utils';
import * as GWM from 'gw-map';

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

    setTile(
        x: number,
        y: number,
        tile: string | number | GWM.tile.Tile,
        opts?: GWM.map.SetTileOptions
    ): boolean;
    clearCell(
        x: number,
        y: number,
        tile: string | number | GWM.tile.Tile
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
