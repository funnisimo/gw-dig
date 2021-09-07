import * as DIG from 'gw-utils';
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
    readonly rng: DIG.rng.Random;

    free(): void;
    clear(): void;
    dump(): void;
    setSeed(seed: number): void;

    hasXY: DIG.xy.XYMatchFunc;
    isBoundaryXY: DIG.xy.XYMatchFunc;

    isSet: DIG.xy.XYMatchFunc;
    isDiggable: DIG.xy.XYMatchFunc;
    isNothing: DIG.xy.XYMatchFunc;

    isPassable: DIG.xy.XYMatchFunc;
    isFloor: DIG.xy.XYMatchFunc;
    isBridge: DIG.xy.XYMatchFunc;
    isDoor: DIG.xy.XYMatchFunc;
    isSecretDoor: DIG.xy.XYMatchFunc;

    blocksMove: DIG.xy.XYMatchFunc;
    blocksDiagonal: DIG.xy.XYMatchFunc;
    blocksPathing: DIG.xy.XYMatchFunc;
    blocksVision: DIG.xy.XYMatchFunc;
    blocksItems: DIG.xy.XYMatchFunc;
    blocksEffects: DIG.xy.XYMatchFunc;

    isWall: DIG.xy.XYMatchFunc;
    isStairs: DIG.xy.XYMatchFunc;

    isDeep: DIG.xy.XYMatchFunc;
    isShallow: DIG.xy.XYMatchFunc;
    isAnyLiquid: DIG.xy.XYMatchFunc;

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
