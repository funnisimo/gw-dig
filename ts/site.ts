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

export function fillCostGrid(
    source: GW.grid.NumGrid,
    costGrid: GW.grid.NumGrid
) {
    source.forEach((_v, x, y) => {
        costGrid[x][y] = isPassable(source, x, y) ? 1 : GW.path.OBSTRUCTION;
    });
}

export function isPassable(grid: GW.grid.NumGrid, x: number, y: number) {
    return (
        isFloor(grid, x, y) ||
        isDoor(grid, x, y) ||
        isBridge(grid, x, y) ||
        isStairs(grid, x, y) ||
        isShallow(grid, x, y)
    );
}

export function isNothing(grid: GW.grid.NumGrid, x: number, y: number) {
    const v = grid.get(x, y);
    return v === NOTHING;
}

export function isFloor(grid: GW.grid.NumGrid, x: number, y: number) {
    return grid.get(x, y) == FLOOR;
}

export function isDoor(grid: GW.grid.NumGrid, x: number, y: number) {
    const v = grid.get(x, y);
    return v === DOOR;
}

export function isBridge(grid: GW.grid.NumGrid, x: number, y: number) {
    const v = grid.get(x, y);
    return v === BRIDGE;
}

export function isWall(grid: GW.grid.NumGrid, x: number, y: number) {
    const v = grid.get(x, y);
    return v === WALL || v === IMPREGNABLE;
}

export function isObstruction(grid: GW.grid.NumGrid, x: number, y: number) {
    return isNothing(grid, x, y) || isWall(grid, x, y);
}

export function isStairs(grid: GW.grid.NumGrid, x: number, y: number) {
    const v = grid.get(x, y);
    return v === UP_STAIRS || v === DOWN_STAIRS;
}

export function isDeep(grid: GW.grid.NumGrid, x: number, y: number) {
    return grid.get(x, y) === DEEP;
}

export function isShallow(grid: GW.grid.NumGrid, x: number, y: number) {
    return grid.get(x, y) === SHALLOW;
}

export function isAnyWater(grid: GW.grid.NumGrid, x: number, y: number) {
    return isDeep(grid, x, y) || isShallow(grid, x, y);
}
