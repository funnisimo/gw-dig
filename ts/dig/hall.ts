import * as GW from 'gw-utils';
import * as SITE from './site';
import * as UTILS from './utils';
import * as TYPES from './types';

const DIRS = GW.utils.DIRS;

export function isDoorLoc(
    site: SITE.DigSite,
    loc: GW.utils.Loc,
    dir: GW.utils.Loc
) {
    if (!site.hasXY(loc[0], loc[1])) return false;
    // TODO - boundary?
    if (!site.isDiggable(loc[0], loc[1])) return false; // must be a wall/diggable space

    const room = [loc[0] - dir[0], loc[1] - dir[1]];
    if (!site.hasXY(room[0], room[1])) return false;
    // TODO - boundary?
    if (!site.isFloor(room[0], room[1])) return false; // must have floor in opposite direction

    return true;
}

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

export function pickLength(
    dir: number,
    lengths: [GW.range.Range, GW.range.Range]
): number {
    if (dir == GW.utils.UP || dir == GW.utils.DOWN) {
        return lengths[1].value();
    } else {
        return lengths[0].value();
    }
}

export function pickHallDirection(
    site: SITE.DigSite,
    doors: GW.utils.Loc[],
    lengths: [GW.range.Range, GW.range.Range]
): number {
    // Pick a direction.
    let dir: number = GW.utils.NO_DIRECTION;
    if (dir == GW.utils.NO_DIRECTION) {
        const dirs = GW.random.sequence(4);
        for (let i = 0; i < 4; i++) {
            dir = dirs[i];
            const length = lengths[(i + 1) % 2].hi; // biggest measurement
            const door = doors[dir];
            if (door && door[0] != -1 && door[1] != -1) {
                const dx = door[0] + Math.floor(DIRS[dir][0] * length);
                const dy = door[1] + Math.floor(DIRS[dir][1] * length);
                if (site.hasXY(dx, dy)) {
                    break; // That's our direction!
                }
            }
            dir = GW.utils.NO_DIRECTION;
        }
    }
    return dir;
}

export function pickHallExits(
    site: SITE.DigSite,
    x: number,
    y: number,
    dir: number,
    obliqueChance: number
) {
    let newX: number, newY: number;
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
            !site.hasXY(newX, newY) ||
            site.isSet(newX, newY)
        ) {
            // do nothing
        } else {
            hallDoors[dir2] = [newX, newY];
        }
    }
    return hallDoors;
}

// export function digWide(
//     opts: TYPES.HallConfig,
//     grid: GW.grid.NumGrid,
//     room: TYPES.Room
// ): TYPES.Hall | TYPES.HallConfig | null {
//     opts = opts || {};
//     if (!opts.width) {
//         opts.width = 2;
//     }
//     if (!grid) {
//         return opts;
//     }

//     const dir = pickHallDirection(grid, room, opts);
//     if (dir === GW.utils.NO_DIRECTION) return null;

//     const length = pickLength(dir, opts.lengths);
//     const width = pickWidth(opts) || 2;

//     const door = room.doors[dir];
//     const tile = opts.tile || SITE.FLOOR;
//     const hallDoors: GW.utils.Loc[] = [];

//     let x0: number, y0: number;
//     let hall;
//     if (dir === GW.utils.UP) {
//         x0 = GW.utils.clamp(door[0], room.x, room.x + room.width - width);
//         y0 = door[1] - length + 1;

//         for (let x = x0; x < x0 + width; ++x) {
//             for (let y = y0; y < y0 + length; ++y) {
//                 grid[x][y] = tile;
//             }
//         }

//         hallDoors[dir] = [x0, y0 - 1];
//         hall = new TYPES.Hall([x0, door[1]], dir, length, 2);
//     } else if (dir === GW.utils.DOWN) {
//         x0 = GW.utils.clamp(door[0], room.x, room.x + room.width - width);
//         y0 = door[1] + length - 1;

//         for (let x = x0; x < x0 + width; ++x) {
//             for (let y = y0; y > y0 - length; --y) {
//                 grid[x][y] = tile;
//             }
//         }

//         hallDoors[dir] = [x0, y0 + 1];
//         hall = new TYPES.Hall([x0, door[1]], dir, length, 2);
//     } else if (dir === GW.utils.LEFT) {
//         x0 = door[0] - length + 1;
//         y0 = GW.utils.clamp(door[1], room.y, room.y + room.height - width);

//         for (let x = x0; x < x0 + length; ++x) {
//             for (let y = y0; y < y0 + width; ++y) {
//                 grid[x][y] = tile;
//             }
//         }

//         hallDoors[dir] = [x0 - 1, y0];
//         hall = new TYPES.Hall([door[0], y0], dir, length, 2);
//     } else {
//         //if (dir === GW.utils.RIGHT) {
//         x0 = door[0] + length - 1;
//         y0 = GW.utils.clamp(door[1], room.y, room.y + room.height - width);

//         for (let x = x0; x > x0 - length; --x) {
//             for (let y = y0; y < y0 + width; ++y) {
//                 grid[x][y] = tile;
//             }
//         }

//         hallDoors[dir] = [x0 + 1, y0];
//         hall = new TYPES.Hall([door[0], y0], dir, length, width);
//     }

//     hall.doors = hallDoors;
//     hall.width = width;
//     return hall;
// }

// export function dig(
//     opts: TYPES.HallConfig,
//     grid: GW.grid.NumGrid,
//     room: TYPES.Room
// ): TYPES.Hall | TYPES.HallConfig | null {
//     opts = opts || {};
//     opts.width = 1;
//     if (!grid) {
//         return opts;
//     }

//     const dir = pickHallDirection(grid, room, opts);
//     if (dir === GW.utils.NO_DIRECTION) return null;

//     const length = pickLength(dir, opts.length);

//     const door = room.doors[dir];
//     const DIR = DIRS[dir];

//     let x = door[0];
//     let y = door[1];

//     const tile = opts.tile || SITE.FLOOR;
//     for (let i = 0; i < length; i++) {
//         grid[x][y] = tile;
//         x += DIR[0];
//         y += DIR[1];
//     }

//     x -= DIR[0];
//     y -= DIR[1];

//     const hall = new TYPES.Hall(door, dir, length);
//     hall.doors = pickHallExits(grid, x, y, dir, opts);
//     return hall;
// }

export interface HallOptions {
    width: number | string;
    length: number | string | number[] | string[];
    tile: number;
    obliqueChance: number;
    chance: number;
}

export interface HallConfig {
    width: GW.range.Range;
    length: [GW.range.Range, GW.range.Range];
    tile: number;
    obliqueChance: number;
    chance: number;
}

export class HallDigger {
    public config: HallConfig = {
        width: GW.range.make(1),
        length: [GW.range.make('2-15'), GW.range.make('2-9')],
        tile: SITE.FLOOR,
        obliqueChance: 15,
        chance: 100,
    };

    constructor(options: Partial<HallOptions> = {}) {
        this._setOptions(options);
    }

    _setOptions(options: Partial<HallOptions> = {}) {
        if (options.width) {
            this.config.width = GW.range.make(options.width);
        }
        if (options.length) {
            if (typeof options.length === 'number') {
                const l = GW.range.make(options.length);
                this.config.length = [l, l];
            }
        }
        if (options.tile) {
            this.config.tile = options.tile;
        }
        if (options.chance) {
            this.config.chance = options.chance;
        }
    }

    create(site: SITE.DigSite, doors: GW.utils.Loc[] = []): TYPES.Hall | null {
        doors = doors || UTILS.chooseRandomDoorSites(site);

        if (!GW.random.chance(this.config.chance)) return null;

        const dir = pickHallDirection(site, doors, this.config.length);
        if (dir === GW.utils.NO_DIRECTION) return null;
        if (!doors[dir]) return null;

        const width = this.config.width.value();
        const length = pickLength(dir, this.config.length);
        const doorLoc = doors[dir];

        if (width == 1) {
            return this.dig(site, dir, doorLoc, length);
        } else {
            return this.digWide(site, dir, doorLoc, length, width);
        }
    }

    _digLine(
        site: SITE.DigSite,
        door: GW.utils.Loc,
        dir: GW.utils.Loc,
        length: number
    ) {
        let x = door[0];
        let y = door[1];

        const tile = this.config.tile;
        for (let i = 0; i < length; i++) {
            site.setTile(x, y, tile);
            x += dir[0];
            y += dir[1];
        }

        x -= dir[0];
        y -= dir[1];

        return [x, y];
    }

    dig(site: SITE.DigSite, dir: number, door: GW.utils.Loc, length: number) {
        const DIR = DIRS[dir];
        const [x, y] = this._digLine(site, door, DIR, length);
        const hall = new TYPES.Hall(door, dir, length);
        hall.doors = pickHallExits(site, x, y, dir, this.config.obliqueChance);
        return hall;
    }

    digWide(
        site: SITE.DigSite,
        dir: number,
        door: GW.utils.Loc,
        length: number,
        width: number
    ) {
        const DIR = GW.utils.DIRS[dir];

        const lower: GW.utils.Loc = [door[0] - DIR[1], door[1] - DIR[0]];
        const higher: GW.utils.Loc = [door[0] + DIR[1], door[1] + DIR[0]];

        this._digLine(site, door, DIR, length);
        let actual = 1;
        let startX = door[0];
        let startY = door[1];

        if (actual < width && isDoorLoc(site, lower, DIR)) {
            this._digLine(site, lower, DIR, length);
            startX = Math.min(lower[0], startX);
            startY = Math.min(lower[1], startY);
            ++actual;
        }

        if (actual < width && isDoorLoc(site, higher, DIR)) {
            this._digLine(site, higher, DIR, length);
            startX = Math.min(higher[0], startX);
            startY = Math.min(higher[1], startY);
            ++actual;
        }

        const hall = new TYPES.Hall([startX, startY], dir, length, width);
        hall.doors = [];
        hall.doors[dir] = [
            door[0] + length * DIR[0],
            door[1] + length * DIR[1],
        ];
        hall.width = width;
        return hall;
    }
}

export function dig(
    config: Partial<HallOptions>,
    site: SITE.DigSite,
    doors: GW.utils.Loc[]
) {
    const digger = new HallDigger(config);
    return digger.create(site, doors);
}

export var halls: Record<string, HallDigger> = {};

export function install(id: string, hall: HallDigger) {
    // @ts-ignore
    halls[id] = hall;
    return hall;
}

install('DEFAULT', new HallDigger({ chance: 15 }));
