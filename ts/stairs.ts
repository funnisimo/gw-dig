import * as GWU from 'gw-utils';

import * as SITE from './site';

export interface StairOpts {
    up: boolean | GWU.utils.Loc;
    down: boolean | GWU.utils.Loc;
    minDistance: number;

    start: boolean | string | GWU.utils.Loc;
    upTile: number;
    downTile: number;
    wall: number;
}

export class Stairs {
    public options: StairOpts = {
        up: true,
        down: true,
        minDistance: 10,
        start: false,
        upTile: SITE.UP_STAIRS,
        downTile: SITE.DOWN_STAIRS,
        wall: SITE.IMPREGNABLE,
    };

    constructor(options: Partial<StairOpts> = {}) {
        Object.assign(this.options, options);
    }

    create(site: SITE.DigSite) {
        let needUp = this.options.up !== false;
        let needDown = this.options.down !== false;
        const minDistance =
            this.options.minDistance ||
            Math.floor(Math.max(site.width, site.height) / 2);

        const locations: Record<string, GWU.utils.Loc> = {};
        let upLoc: GWU.utils.Loc | null = null;
        let downLoc: GWU.utils.Loc | null = null;

        const isValidLoc = this.isStairXY.bind(this, site);

        if (this.options.start && typeof this.options.start !== 'string') {
            let start = this.options.start;
            if (start === true) {
                start = GWU.random.matchingLoc(
                    site.width,
                    site.height,
                    isValidLoc
                );
            } else {
                start = GWU.random.matchingLocNear(
                    GWU.utils.x(start),
                    GWU.utils.y(start),
                    isValidLoc
                );
            }
            locations.start = start;
        }

        if (
            Array.isArray(this.options.up) &&
            Array.isArray(this.options.down)
        ) {
            const up = this.options.up;
            upLoc = GWU.random.matchingLocNear(
                GWU.utils.x(up),
                GWU.utils.y(up),
                isValidLoc
            );
            const down = this.options.down;
            downLoc = GWU.random.matchingLocNear(
                GWU.utils.x(down),
                GWU.utils.y(down),
                isValidLoc
            );
        } else if (
            Array.isArray(this.options.up) &&
            !Array.isArray(this.options.down)
        ) {
            const up = this.options.up;
            upLoc = GWU.random.matchingLocNear(
                GWU.utils.x(up),
                GWU.utils.y(up),
                isValidLoc
            );
            if (needDown) {
                downLoc = GWU.random.matchingLoc(
                    site.width,
                    site.height,
                    (x, y) => {
                        if (
                            // @ts-ignore
                            GWU.utils.distanceBetween(
                                x,
                                y,
                                upLoc![0],
                                upLoc![1]
                            ) < minDistance
                        )
                            return false;
                        return isValidLoc(x, y);
                    }
                );
            }
        } else if (
            Array.isArray(this.options.down) &&
            !Array.isArray(this.options.up)
        ) {
            const down = this.options.down;
            downLoc = GWU.random.matchingLocNear(
                GWU.utils.x(down),
                GWU.utils.y(down),
                isValidLoc
            );
            if (needUp) {
                upLoc = GWU.random.matchingLoc(
                    site.width,
                    site.height,
                    (x, y) => {
                        if (
                            GWU.utils.distanceBetween(
                                x,
                                y,
                                downLoc![0],
                                downLoc![1]
                            ) < minDistance
                        )
                            return false;
                        return isValidLoc(x, y);
                    }
                );
            }
        } else if (needUp) {
            upLoc = GWU.random.matchingLoc(site.width, site.height, isValidLoc);
            if (needDown) {
                downLoc = GWU.random.matchingLoc(
                    site.width,
                    site.height,
                    (x, y) => {
                        if (
                            // @ts-ignore
                            GWU.utils.distanceBetween(
                                x,
                                y,
                                upLoc![0],
                                upLoc![1]
                            ) < minDistance
                        )
                            return false;
                        return isValidLoc(x, y);
                    }
                );
            }
        } else if (needDown) {
            downLoc = GWU.random.matchingLoc(
                site.width,
                site.height,
                isValidLoc
            );
        }

        if (upLoc) {
            locations.up = upLoc.slice() as GWU.utils.Loc;
            this.setupStairs(site, upLoc[0], upLoc[1], this.options.upTile);
            if (this.options.start === 'up') locations.start = locations.up;
        }
        if (downLoc) {
            locations.down = downLoc.slice() as GWU.utils.Loc;
            this.setupStairs(
                site,
                downLoc[0],
                downLoc[1],
                this.options.downTile
            );
            if (this.options.start === 'down') locations.start = locations.down;
        }

        return upLoc || downLoc ? locations : null;
    }

    hasXY(site: SITE.DigSite, x: number, y: number) {
        if (x < 0 || y < 0) return false;
        if (x >= site.width || y >= site.height) return false;
        return true;
    }

    isStairXY(site: SITE.DigSite, x: number, y: number) {
        let count = 0;
        if (!this.hasXY(site, x, y) || !site.isDiggable(x, y)) return false;

        for (let i = 0; i < 4; ++i) {
            const dir = GWU.utils.DIRS[i];
            if (!this.hasXY(site, x + dir[0], y + dir[1])) return false;
            if (!this.hasXY(site, x - dir[0], y - dir[1])) return false;
            if (site.isFloor(x + dir[0], y + dir[1])) {
                count += 1;
                if (!site.isDiggable(x - dir[0] + dir[1], y - dir[1] + dir[0]))
                    return false;
                if (!site.isDiggable(x - dir[0] - dir[1], y - dir[1] - dir[0]))
                    return false;
            } else if (!site.isDiggable(x + dir[0], y + dir[1])) {
                return false;
            }
        }
        return count == 1;
    }

    setupStairs(site: SITE.DigSite, x: number, y: number, tile: number) {
        const indexes = GWU.random.sequence(4);

        let dir: GWU.utils.Loc | null = null;
        for (let i = 0; i < indexes.length; ++i) {
            dir = GWU.utils.DIRS[i];
            const x0 = x + dir[0];
            const y0 = y + dir[1];
            if (site.isFloor(x0, y0)) {
                if (site.isDiggable(x - dir[0], y - dir[1])) break;
            }

            dir = null;
        }

        if (!dir) GWU.utils.ERROR('No stair direction found!');

        site.setTile(x, y, tile);

        const dirIndex = GWU.utils.CLOCK_DIRS.findIndex(
            // @ts-ignore
            (d) => d[0] == dir[0] && d[1] == dir[1]
        );

        const wall = this.options.wall;

        for (let i = 0; i < GWU.utils.CLOCK_DIRS.length; ++i) {
            const l = i ? i - 1 : 7;
            const r = (i + 1) % 8;
            if (i == dirIndex || l == dirIndex || r == dirIndex) continue;
            const d = GWU.utils.CLOCK_DIRS[i];
            site.setTile(x + d[0], y + d[1], wall);
            // map.setCellFlags(x + d[0], y + d[1], Flags.Cell.IMPREGNABLE);
        }

        // dungeon.debug('setup stairs', x, y, tile);
        return true;
    }
}
