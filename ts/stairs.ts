import * as GWU from 'gw-utils';
import * as SITE from './site';

export function isValidStairLoc(
    _v: number,
    x: number,
    y: number,
    map: GWU.grid.NumGrid
) {
    let count = 0;
    if (!SITE.isObstruction(map, x, y)) return false;

    for (let i = 0; i < 4; ++i) {
        const dir = GWU.xy.DIRS[i];
        if (!map.hasXY(x + dir[0], y + dir[1])) return false;
        if (!map.hasXY(x - dir[0], y - dir[1])) return false;
        if (SITE.isFloor(map, x + dir[0], y + dir[1])) {
            count += 1;
            if (
                !SITE.isObstruction(
                    map,
                    x - dir[0] + dir[1],
                    y - dir[1] + dir[0]
                )
            )
                return false;
            if (
                !SITE.isObstruction(
                    map,
                    x - dir[0] - dir[1],
                    y - dir[1] - dir[0]
                )
            )
                return false;
        } else if (!SITE.isObstruction(map, x + dir[0], y + dir[1])) {
            return false;
        }
    }
    return count == 1;
}

export function setupStairs(
    map: GWU.grid.NumGrid,
    x: number,
    y: number,
    tile: number
) {
    const indexes = GWU.random.sequence(4);

    let dir: GWU.xy.Loc | null = null;
    for (let i = 0; i < indexes.length; ++i) {
        dir = GWU.xy.DIRS[i];
        const x0 = x + dir[0];
        const y0 = y + dir[1];
        if (SITE.isFloor(map, x0, y0)) {
            if (SITE.isObstruction(map, x - dir[0], y - dir[1])) break;
        }

        dir = null;
    }

    if (!dir) GWU.ERROR('No stair direction found!');

    map.set(x, y, tile);

    const dirIndex = GWU.xy.CLOCK_DIRS.findIndex(
        // @ts-ignore
        (d) => d[0] == dir[0] && d[1] == dir[1]
    );

    for (let i = 0; i < GWU.xy.CLOCK_DIRS.length; ++i) {
        const l = i ? i - 1 : 7;
        const r = (i + 1) % 8;
        if (i == dirIndex || l == dirIndex || r == dirIndex) continue;
        const d = GWU.xy.CLOCK_DIRS[i];
        map.set(x + d[0], y + d[1], SITE.WALL);
        // map.setCellFlags(x + d[0], y + d[1], Flags.Cell.IMPREGNABLE);
    }

    // dungeon.debug('setup stairs', x, y, tile);
    return true;
}

export function addStairs(map: GWU.grid.NumGrid, opts: any = {}) {
    let needUp = opts.up !== false;
    let needDown = opts.down !== false;
    const minDistance =
        opts.minDistance || Math.floor(Math.max(map.width, map.height) / 2);
    const isValidLoc = opts.isValid || isValidStairLoc;
    const setupFn = opts.setup || setupStairs;

    let upLoc = Array.isArray(opts.up) ? opts.up : null;
    let downLoc = Array.isArray(opts.down) ? opts.down : null;

    const locations: Record<string, GWU.xy.Loc> = {};

    if (opts.start && typeof opts.start !== 'string') {
        let start = opts.start;
        if (start === true) {
            start = map.randomMatchingLoc(isValidLoc);
        } else {
            start = map.matchingLocNear(
                GWU.xy.x(start),
                GWU.xy.y(start),
                isValidLoc
            );
        }
        locations.start = start;
    }

    if (upLoc && downLoc) {
        upLoc = map.matchingLocNear(
            GWU.xy.x(upLoc),
            GWU.xy.y(upLoc),
            isValidLoc
        );
        downLoc = map.matchingLocNear(
            GWU.xy.x(downLoc),
            GWU.xy.y(downLoc),
            isValidLoc
        );
    } else if (upLoc && !downLoc) {
        upLoc = map.matchingLocNear(
            GWU.xy.x(upLoc),
            GWU.xy.y(upLoc),
            isValidLoc
        );
        if (needDown) {
            downLoc = map.randomMatchingLoc((v, x, y) => {
                if (
                    GWU.xy.distanceBetween(x, y, upLoc[0], upLoc[1]) <
                    minDistance
                )
                    return false;
                return isValidLoc(v, x, y, map);
            });
        }
    } else if (downLoc && !upLoc) {
        downLoc = map.matchingLocNear(
            GWU.xy.x(downLoc),
            GWU.xy.y(downLoc),
            isValidLoc
        );
        if (needUp) {
            upLoc = map.randomMatchingLoc((v, x, y) => {
                if (
                    GWU.xy.distanceBetween(x, y, downLoc[0], downLoc[1]) <
                    minDistance
                )
                    return false;
                return isValidStairLoc(v, x, y, map);
            });
        }
    } else if (needUp) {
        upLoc = map.randomMatchingLoc(isValidLoc);
        if (needDown) {
            downLoc = map.randomMatchingLoc((v, x, y) => {
                if (
                    GWU.xy.distanceBetween(x, y, upLoc[0], upLoc[1]) <
                    minDistance
                )
                    return false;
                return isValidStairLoc(v, x, y, map);
            });
        }
    } else if (needDown) {
        downLoc = map.randomMatchingLoc(isValidLoc);
    }

    if (upLoc) {
        locations.up = upLoc.slice();
        setupFn(map, upLoc[0], upLoc[1], opts.upTile || SITE.UP_STAIRS);
        if (opts.start === 'up') locations.start = locations.up;
    }
    if (downLoc) {
        locations.down = downLoc.slice();
        setupFn(map, downLoc[0], downLoc[1], opts.downTile || SITE.DOWN_STAIRS);
        if (opts.start === 'down') locations.start = locations.down;
    }

    return upLoc || downLoc ? locations : null;
}
