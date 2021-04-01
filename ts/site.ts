import * as GW from 'gw-utils';

export const NOTHING = 0;
export const FLOOR = 1;
export const DOOR = 2;
export const WALL = 3;
export const LAKE = 4;
export const BRIDGE = 5;
export const UP_STAIRS = 6;
export const DOWN_STAIRS = 7;
export const SHALLOW = 8;

export function isPassable(grid: GW.grid.NumGrid, x: number, y: number) {
    const v = grid.get(x, y);
    return (
        v === FLOOR ||
        v === DOOR ||
        v === BRIDGE ||
        v === UP_STAIRS ||
        v === DOWN_STAIRS ||
        v === SHALLOW
    );
}

export function isDoor(grid: GW.grid.NumGrid, x: number, y: number) {
    const v = grid.get(x, y);
    return v === DOOR;
}

export function isObstruction(grid: GW.grid.NumGrid, x: number, y: number) {
    const v = grid.get(x, y);
    return v === NOTHING || v === WALL;
}

export function isStairs(grid: GW.grid.NumGrid, x: number, y: number) {
    const v = grid.get(x, y);
    return v === UP_STAIRS || v === DOWN_STAIRS;
}

export function isLake(grid: GW.grid.NumGrid, x: number, y: number) {
    return grid.get(x, y) === LAKE;
}

export function isAnyWater(grid: GW.grid.NumGrid, x: number, y: number) {
    const v = grid.get(x, y);
    return v === LAKE || v === SHALLOW;
}
