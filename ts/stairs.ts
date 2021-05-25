import * as GW from 'gw-utils';
import * as SITE from './site';
import { DigFn } from './types';

export interface StairOpts {
    up: boolean | GW.utils.Loc;
    down: boolean | GW.utils.Loc;
    minDistance: number;
    isValidXY: GW.utils.XYMatchFunc;
    setup: (
        x: number,
        y: number,
        setFn: DigFn,
        tile: number,
        wall: number
    ) => void;

    start: boolean | string | GW.utils.Loc;
    upTile: number;
    downTile: number;
    wall: number;
}

export class Stairs {
    public width: number;
    public height: number;
    public isFloorFn: GW.utils.XYMatchFunc;
    public isDiggableFn: GW.utils.XYMatchFunc;

    constructor(
        width: number,
        height: number,
        isFloorFn: GW.utils.XYMatchFunc,
        isDiggableFn: GW.utils.XYMatchFunc
    ) {
        this.width = width;
        this.height = height;
        this.isFloorFn = isFloorFn;
        this.isDiggableFn = isDiggableFn;
    }

    create(setFn: DigFn, opts: Partial<StairOpts> = {}) {
        let needUp = opts.up !== false;
        let needDown = opts.down !== false;
        const minDistance =
            opts.minDistance ||
            Math.floor(Math.max(this.width, this.height) / 2);
        const isValidLoc = opts.isValidXY || this.isStairXY.bind(this);
        const setupFn = opts.setup || this.setupStairs.bind(this);

        const locations: Record<string, GW.utils.Loc> = {};
        let upLoc: GW.utils.Loc | undefined;
        let downLoc: GW.utils.Loc | undefined;

        if (opts.start && typeof opts.start !== 'string') {
            let start = opts.start;
            if (start === true) {
                start = GW.random.matchingXY(
                    this.width,
                    this.height,
                    isValidLoc
                );
            } else {
                start = GW.random.matchingXYNear(
                    GW.utils.x(start),
                    GW.utils.y(start),
                    isValidLoc
                );
            }
            locations.start = start;
        }

        if (Array.isArray(opts.up) && Array.isArray(opts.down)) {
            const up = opts.up;
            upLoc = GW.random.matchingXYNear(
                GW.utils.x(up),
                GW.utils.y(up),
                isValidLoc
            );
            const down = opts.down;
            downLoc = GW.random.matchingXYNear(
                GW.utils.x(down),
                GW.utils.y(down),
                isValidLoc
            );
        } else if (Array.isArray(opts.up) && !Array.isArray(opts.down)) {
            const up = opts.up;
            upLoc = GW.random.matchingXYNear(
                GW.utils.x(up),
                GW.utils.y(up),
                isValidLoc
            );
            if (needDown) {
                downLoc = GW.random.matchingXY(
                    this.width,
                    this.height,
                    (x, y) => {
                        if (
                            // @ts-ignore
                            GW.utils.distanceBetween(x, y, upLoc[0], upLoc[1]) <
                            minDistance
                        )
                            return false;
                        return isValidLoc(x, y);
                    }
                );
            }
        } else if (Array.isArray(opts.down) && !Array.isArray(opts.up)) {
            const down = opts.down;
            downLoc = GW.random.matchingXYNear(
                GW.utils.x(down),
                GW.utils.y(down),
                isValidLoc
            );
            if (needUp) {
                upLoc = GW.random.matchingXY(
                    this.width,
                    this.height,
                    (x, y) => {
                        if (
                            GW.utils.distanceBetween(
                                x,
                                y,
                                // @ts-ignore
                                downLoc[0],
                                // @ts-ignore
                                downLoc[1]
                            ) < minDistance
                        )
                            return false;
                        return isValidLoc(x, y);
                    }
                );
            }
        } else if (needUp) {
            upLoc = GW.random.matchingXY(this.width, this.height, isValidLoc);
            if (needDown) {
                downLoc = GW.random.matchingXY(
                    this.width,
                    this.height,
                    (x, y) => {
                        if (
                            // @ts-ignore
                            GW.utils.distanceBetween(x, y, upLoc[0], upLoc[1]) <
                            minDistance
                        )
                            return false;
                        return isValidLoc(x, y);
                    }
                );
            }
        } else if (needDown) {
            downLoc = GW.random.matchingXY(this.width, this.height, isValidLoc);
        }

        if (upLoc) {
            locations.up = upLoc.slice() as GW.utils.Loc;
            setupFn(
                upLoc[0],
                upLoc[1],
                setFn,
                opts.upTile || SITE.UP_STAIRS,
                opts.wall || SITE.IMPREGNABLE
            );
            if (opts.start === 'up') locations.start = locations.up;
        }
        if (downLoc !== undefined) {
            locations.down = downLoc.slice() as GW.utils.Loc;
            setupFn(
                downLoc[0],
                downLoc[1],
                setFn,
                opts.downTile || SITE.DOWN_STAIRS,
                opts.wall || SITE.IMPREGNABLE
            );
            if (opts.start === 'down') locations.start = locations.down;
        }

        return upLoc || downLoc ? locations : null;
    }

    hasXY(x: number, y: number) {
        if (x < 0 || y < 0) return false;
        if (x >= this.width || y >= this.height) return false;
        return true;
    }

    isStairXY(x: number, y: number) {
        let count = 0;
        if (!this.hasXY(x, y) || !this.isDiggableFn(x, y)) return false;

        for (let i = 0; i < 4; ++i) {
            const dir = GW.utils.DIRS[i];
            if (!this.hasXY(x + dir[0], y + dir[1])) return false;
            if (!this.hasXY(x - dir[0], y - dir[1])) return false;
            if (this.isFloorFn(x + dir[0], y + dir[1])) {
                count += 1;
                if (
                    !this.isDiggableFn(x - dir[0] + dir[1], y - dir[1] + dir[0])
                )
                    return false;
                if (
                    !this.isDiggableFn(x - dir[0] - dir[1], y - dir[1] - dir[0])
                )
                    return false;
            } else if (!this.isDiggableFn(x + dir[0], y + dir[1])) {
                return false;
            }
        }
        return count == 1;
    }

    setupStairs(
        x: number,
        y: number,
        setFn: DigFn,
        tile: number,
        wall: number
    ) {
        const indexes = GW.random.sequence(4);

        let dir: GW.utils.Loc | null = null;
        for (let i = 0; i < indexes.length; ++i) {
            dir = GW.utils.DIRS[i];
            const x0 = x + dir[0];
            const y0 = y + dir[1];
            if (this.isFloorFn(x0, y0)) {
                if (this.isDiggableFn(x - dir[0], y - dir[1])) break;
            }

            dir = null;
        }

        if (!dir) GW.utils.ERROR('No stair direction found!');

        setFn(x, y, tile);

        const dirIndex = GW.utils.CLOCK_DIRS.findIndex(
            // @ts-ignore
            (d) => d[0] == dir[0] && d[1] == dir[1]
        );

        for (let i = 0; i < GW.utils.CLOCK_DIRS.length; ++i) {
            const l = i ? i - 1 : 7;
            const r = (i + 1) % 8;
            if (i == dirIndex || l == dirIndex || r == dirIndex) continue;
            const d = GW.utils.CLOCK_DIRS[i];
            setFn(x + d[0], y + d[1], wall);
            // map.setCellFlags(x + d[0], y + d[1], Flags.Cell.IMPREGNABLE);
        }

        // dungeon.debug('setup stairs', x, y, tile);
        return true;
    }
}

export function addStairs(map: GW.grid.NumGrid, opts: any = {}) {
    const stairs = new Stairs(
        map.width,
        map.height,
        SITE.isFloor.bind(SITE, map),
        SITE.isDiggable.bind(SITE, map)
    );
    return stairs.create(SITE.setGrid.bind(SITE, map), opts);
}
