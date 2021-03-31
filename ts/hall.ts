import * as GW from 'gw-utils';
import * as CONST from './tiles';
import { Room, Hall } from './room';

const DIRS = GW.utils.DIRS;

export type HallFn = (
    opts: HallConfig,
    grid: GW.grid.NumGrid,
    room: Room
) => Hall | any | null;
export interface HallConfig {
    fn?: HallFn;
    chance?: number;
    length?: GW.range.RangeBase | [GW.range.RangeBase, GW.range.RangeBase];
    width?: GW.range.RangeBase;
    tile?: number;
    [x: string]: any;
}

export interface HallData extends HallConfig {
    fn: HallFn;
    id: string;
}

export var halls: Record<string, HallData> = {};

export function install(id: string, fn: HallFn, config: HallConfig = {}) {
    // @ts-ignore
    const data: HallData = fn(config || {}); // call to have function setup the config
    data.fn = fn;
    data.id = id;
    halls[id] = data;
    return data;
}

install('DEFAULT', dig, { chance: 15 });

export function pickWidth(opts: any = {}): number {
    return GW.utils.clamp(_pickWidth(opts), 1, 3);
}

function _pickWidth(opts: any): number {
    if (!opts) return 1;
    if (typeof opts === 'number') return opts;
    if (opts.width === undefined) return 1;

    let width = opts.width;
    if (typeof width === 'number') return width;
    else if (Array.isArray(width)) {
        // @ts-ignore
        width = GW.random.weighted(width) + 1;
    } else if (typeof width === 'string') {
        width = GW.range.make(width).value();
    } else {
        width = Number.parseInt(GW.random.weighted(width) as string);
    }
    return width;
}

export function pickLengthRange(dir: number, opts: any): GW.range.Range {
    if (!opts.length) opts.length = [];
    if (Array.isArray(opts.length)) {
        if (dir == GW.utils.UP || dir == GW.utils.DOWN) {
            return GW.range.make(opts.length[1] || [2, 9]);
        } else {
            return GW.range.make(opts.length[0] || [9, 15]);
        }
    } else {
        return GW.range.make(opts.length);
    }
}

export function pickHallDirection(
    grid: GW.grid.NumGrid,
    room: Room,
    opts: any
): number {
    const doors = room.doors;
    // Pick a direction.
    let dir: number = opts.dir || GW.utils.NO_DIRECTION;
    if (dir == GW.utils.NO_DIRECTION) {
        const dirs = GW.random.sequence(4);
        for (let i = 0; i < 4; i++) {
            dir = dirs[i];
            const length = pickLengthRange(dir, opts).hi; // biggest measurement
            const door = doors[dir];
            if (door && door[0] != -1 && door[1] != -1) {
                const dx = door[0] + Math.floor(DIRS[dir][0] * length);
                const dy = door[1] + Math.floor(DIRS[dir][1] * length);
                if (grid.hasXY(dx, dy)) {
                    break; // That's our direction!
                }
            }
            dir = GW.utils.NO_DIRECTION;
        }
    }
    return dir;
}

export function pickHallExits(
    grid: GW.grid.NumGrid,
    x: number,
    y: number,
    dir: number,
    opts: any
) {
    let newX: number, newY: number;
    const obliqueChance = GW.utils.firstOpt('obliqueChance', opts, 15);
    const allowObliqueHallwayExit = GW.random.chance(obliqueChance);
    const hallDoors: GW.utils.Loc[] = [
        // [-1, -1],
        // [-1, -1],
        // [-1, -1],
        // [-1, -1],
    ];
    for (let dir2 = 0; dir2 < 4; dir2++) {
        newX = x + DIRS[dir2][0];
        newY = y + DIRS[dir2][1];

        if (
            (dir2 != dir && !allowObliqueHallwayExit) ||
            !grid.hasXY(newX, newY) ||
            grid[newX][newY]
        ) {
            // do nothing
        } else {
            hallDoors[dir2] = [newX, newY];
        }
    }
    return hallDoors;
}

export function digWide(
    opts: HallConfig,
    grid: GW.grid.NumGrid,
    room: Room
): Hall | HallConfig | null {
    opts = opts || {};
    if (!opts.width) {
        opts.width = 2;
    }
    if (!grid) {
        return opts;
    }

    const dir = pickHallDirection(grid, room, opts);
    if (dir === GW.utils.NO_DIRECTION) return null;

    const length = pickLengthRange(dir, opts).value();
    const width = pickWidth(opts) || 2;

    const door = room.doors[dir];
    const tile = opts.tile || CONST.FLOOR;
    const hallDoors: GW.utils.Loc[] = [];

    let x0: number, y0: number;
    let hall;
    if (dir === GW.utils.UP) {
        x0 = GW.utils.clamp(door[0], room.x, room.x + room.width - width);
        y0 = door[1] - length + 1;

        for (let x = x0; x < x0 + width; ++x) {
            for (let y = y0; y < y0 + length; ++y) {
                grid[x][y] = tile;
            }
        }

        hallDoors[dir] = [x0, y0 - 1];
        hall = new Hall([x0, door[1]], dir, length, 2);
    } else if (dir === GW.utils.DOWN) {
        x0 = GW.utils.clamp(door[0], room.x, room.x + room.width - width);
        y0 = door[1] + length - 1;

        for (let x = x0; x < x0 + width; ++x) {
            for (let y = y0; y > y0 - length; --y) {
                grid[x][y] = tile;
            }
        }

        hallDoors[dir] = [x0, y0 + 1];
        hall = new Hall([x0, door[1]], dir, length, 2);
    } else if (dir === GW.utils.LEFT) {
        x0 = door[0] - length + 1;
        y0 = GW.utils.clamp(door[1], room.y, room.y + room.height - width);

        for (let x = x0; x < x0 + length; ++x) {
            for (let y = y0; y < y0 + width; ++y) {
                grid[x][y] = tile;
            }
        }

        hallDoors[dir] = [x0 - 1, y0];
        hall = new Hall([door[0], y0], dir, length, 2);
    } else {
        //if (dir === GW.utils.RIGHT) {
        x0 = door[0] + length - 1;
        y0 = GW.utils.clamp(door[1], room.y, room.y + room.height - width);

        for (let x = x0; x > x0 - length; --x) {
            for (let y = y0; y < y0 + width; ++y) {
                grid[x][y] = tile;
            }
        }

        hallDoors[dir] = [x0 + 1, y0];
        hall = new Hall([door[0], y0], dir, length, width);
    }

    hall.doors = hallDoors;
    hall.width = width;
    return hall;
}

export function dig(
    opts: HallConfig,
    grid: GW.grid.NumGrid,
    room: Room
): Hall | HallConfig | null {
    opts = opts || {};
    opts.width = 1;
    if (!grid) {
        return opts;
    }

    const dir = pickHallDirection(grid, room, opts);
    if (dir === GW.utils.NO_DIRECTION) return null;

    const length = pickLengthRange(dir, opts).value();

    const door = room.doors[dir];
    const DIR = DIRS[dir];

    let x = door[0];
    let y = door[1];

    const tile = opts.tile || CONST.FLOOR;
    for (let i = 0; i < length; i++) {
        grid[x][y] = tile;
        x += DIR[0];
        y += DIR[1];
    }

    x -= DIR[0];
    y -= DIR[1];

    const hall = new Hall(door, dir, length);
    hall.doors = pickHallExits(grid, x, y, dir, opts);
    return hall;
}
