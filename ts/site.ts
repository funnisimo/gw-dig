import * as GW from 'gw-utils';

export const NOTHING = 0;
export const FLOOR = 1;
export const DOOR = 2;
export const WALL = 3;

export const DEEP = 4;
export const SHALLOW = 5;
export const BRIDGE = 6;

export const UP_STAIRS = 7;
export const DOWN_STAIRS = 17;

export const IMPREGNABLE = 8;

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

export const SEQ: number[] = [];

export function initSeqence(length: number) {
    SEQ.length = length;
    for (let i = 0; i < length; ++i) {
        SEQ[i] = i;
    }

    GW.random.shuffle(SEQ);
}

export function fillCostGrid(source: Site, costGrid: GW.grid.NumGrid) {
    costGrid.update((_v, x, y) =>
        source.isPassable(x, y) ? 1 : GW.path.OBSTRUCTION
    );
}

const Fl = GW.flag.fl;

export enum Flags {
    IS_IN_LOOP = Fl(0), // this cell is part of a terrain loop
    IS_CHOKEPOINT = Fl(1), // if this cell is blocked, part of the map will be rendered inaccessible
    IS_GATE_SITE = Fl(2), // consider placing a locked door here
    
    IS_IN_ROOM_MACHINE = Fl(3),
    IS_IN_AREA_MACHINE = Fl(4),
    
    IMPREGNABLE = Fl(5), // no tunneling allowed!

    IS_IN_MACHINE = IS_IN_ROOM_MACHINE | IS_IN_AREA_MACHINE, // sacred ground; don't generate items here, or teleport randomly to it
}

export interface Site {
    readonly width: number;
    readonly height: number;

    free: () => void;

    hasXY: GW.utils.XYMatchFunc;
    isBoundaryXY: GW.utils.XYMatchFunc;

    isSet: GW.utils.XYMatchFunc;
    isDiggable: GW.utils.XYMatchFunc;
    isNothing: GW.utils.XYMatchFunc;

    isPassable: GW.utils.XYMatchFunc;
    isFloor: GW.utils.XYMatchFunc;
    isDoor: GW.utils.XYMatchFunc;
    isBridge: GW.utils.XYMatchFunc;

    isObstruction: GW.utils.XYMatchFunc;
    isWall: GW.utils.XYMatchFunc;
    isStairs: GW.utils.XYMatchFunc;

    isDeep: GW.utils.XYMatchFunc;
    isShallow: GW.utils.XYMatchFunc;
    isAnyWater: GW.utils.XYMatchFunc;

    setTile: (x: number, y: number, tile: number) => void;
    getTile: (x: number, y: number) => number;

    hasSiteFlag: (x: number, y: number, flag: number) => boolean;
    setSiteFlag: (x: number, y: number, flag: number) => void;
    clearSiteFlag: (x: number, y: number, flag: number) => void;

    getChokeCount: (x: number, y: number) => number;
    setChokeCount: (x: number, y: number, count: number) => void;
}

export class GridSite implements Site {
    public tiles: GW.grid.NumGrid;
    public flags: GW.grid.NumGrid;
    public choke: GW.grid.NumGrid;

    constructor(width: number, height: number) {
        this.tiles = GW.grid.alloc(width, height);
        this.flags = GW.grid.alloc(width, height);
        this.choke = GW.grid.alloc(width, height);
    }

    free() {
        GW.grid.free(this.tiles);
        GW.grid.free(this.flags);
        GW.grid.free(this.choke);
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

    isBridge(x: number, y: number) {
        const v = this.tiles.get(x, y);
        return v === BRIDGE;
    }

    isWall(x: number, y: number) {
        const v = this.tiles.get(x, y);
        return v === WALL || v === IMPREGNABLE;
    }

    isObstruction(x: number, y: number) {
        return this.isNothing(x, y) || this.isWall(x, y);
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

    isAnyWater(x: number, y: number) {
        return this.isDeep(x, y) || this.isShallow(x, y);
    }

    isSet(x: number, y: number) {
        return (this.tiles.get(x, y) || 0) > 0;
    }

    getTile(x: number, y: number): number {
        return this.tiles.get(x, y) || 0;
    }

    setTile(x: number, y: number, tile: number) {
        if (this.tiles.hasXY(x, y)) this.tiles[x][y] = tile;
    }

    hasSiteFlag(x: number, y: number, flag: number) : boolean {
        const have = this.flags.get(x, y) || 0;
        return !!(have & flag);
    }

    setSiteFlag(x: number, y: number, flag: number) : void {
        const value = (this.flags.get(x, y) || 0) | flag;
        this.flags.set(x, y, value);
    }

    clearSiteFlag(x: number, y: number, flag: number) : void {
        const value = (this.flags.get(x, y) || 0) & ~flag;
        this.flags.set(x, y, value);
    }

    getChokeCount(x: number, y: number): number {
        return this.choke.get(x, y) || 0;
    }
    
    setChokeCount(x: number, y: number, count: number) {
        this.choke.set(x, y, count);
    }

}
