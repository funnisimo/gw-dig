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

export interface Site {
    readonly width: number;
    readonly height: number;

    hasXY: GW.utils.XYMatchFunc;
    isBoundaryXY: GW.utils.XYMatchFunc;
    get: (x: number, y: number) => number;
    copy: (other: Site, offsetX: number, offsetY: number) => void;

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
}

export class GridSite implements Site {
    public grid: GW.grid.NumGrid;

    constructor(grid: GW.grid.NumGrid) {
        this.grid = grid;
    }

    get width() {
        return this.grid.width;
    }
    get height() {
        return this.grid.height;
    }

    hasXY(x: number, y: number) {
        return this.grid.hasXY(x, y);
    }
    isBoundaryXY(x: number, y: number) {
        return this.grid.isBoundaryXY(x, y);
    }

    get(x: number, y: number): number {
        return this.grid.get(x, y) || 0;
    }

    copy(other: Site, offsetX = 0, offsetY = 0) {
        this.grid.forEach((_c, i, j) => {
            const otherX = i - offsetX;
            const otherY = j - offsetY;
            const v = other.get(otherX, otherY);
            if (!v) return;
            this.grid.set(i, j, v);
        });
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
        const v = this.grid.get(x, y);
        return v === NOTHING;
    }

    isDiggable(x: number, y: number) {
        const v = this.grid.get(x, y);
        return v === NOTHING;
    }

    isFloor(x: number, y: number) {
        return this.grid.get(x, y) == FLOOR;
    }

    isDoor(x: number, y: number) {
        const v = this.grid.get(x, y);
        return v === DOOR;
    }

    isBridge(x: number, y: number) {
        const v = this.grid.get(x, y);
        return v === BRIDGE;
    }

    isWall(x: number, y: number) {
        const v = this.grid.get(x, y);
        return v === WALL || v === IMPREGNABLE;
    }

    isObstruction(x: number, y: number) {
        return this.isNothing(x, y) || this.isWall(x, y);
    }

    isStairs(x: number, y: number) {
        const v = this.grid.get(x, y);
        return v === UP_STAIRS || v === DOWN_STAIRS;
    }

    isDeep(x: number, y: number) {
        return this.grid.get(x, y) === DEEP;
    }

    isShallow(x: number, y: number) {
        return this.grid.get(x, y) === SHALLOW;
    }

    isAnyWater(x: number, y: number) {
        return this.isDeep(x, y) || this.isShallow(x, y);
    }

    isSet(x: number, y: number) {
        return (this.grid.get(x, y) || 0) > 0;
    }

    setTile(x: number, y: number, tile: number) {
        if (this.grid.hasXY(x, y)) this.grid[x][y] = tile;
    }
}
