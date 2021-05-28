import * as GW from 'gw-utils';
import * as SITE from './site';

export interface LoopOptions {
    minimumPathingDistance: number;
    maxConnectionLength: number;
}

export interface LoopConfig {
    minimumPathingDistance: number;
    maxConnectionLength: number;
}

export class LoopDigger {
    public options: LoopConfig = {
        minimumPathingDistance: 100,
        maxConnectionLength: 1,
    };

    constructor(options: Partial<LoopOptions> = {}) {
        Object.assign(this.options, options);
    }

    create(site: SITE.Site) {
        let startX, startY, endX, endY;
        let i, j, d, x, y;

        const minimumPathingDistance = Math.min(
            this.options.minimumPathingDistance,
            Math.floor(Math.max(site.width, site.height) / 2)
        );
        const maxConnectionLength = this.options.maxConnectionLength;

        const pathGrid = GW.grid.alloc(site.width, site.height);
        const costGrid = GW.grid.alloc(site.width, site.height);

        const dirCoords: [number, number][] = [
            [1, 0],
            [0, 1],
        ];

        SITE.fillCostGrid(site, costGrid);

        function isValidTunnelStart(
            x: number,
            y: number,
            dir: [number, number]
        ) {
            if (!site.hasXY(x, y)) return false;
            if (!site.hasXY(x + dir[1], y + dir[0])) return false;
            if (!site.hasXY(x - dir[1], y - dir[0])) return false;
            if (site.isSet(x, y)) return false;
            if (site.isSet(x + dir[1], y + dir[0])) return false;
            if (site.isSet(x - dir[1], y - dir[0])) return false;
            return true;
        }

        function isValidTunnelEnd(x: number, y: number, dir: [number, number]) {
            if (!site.hasXY(x, y)) return false;
            if (!site.hasXY(x + dir[1], y + dir[0])) return false;
            if (!site.hasXY(x - dir[1], y - dir[0])) return false;
            if (site.isSet(x, y)) return true;
            if (site.isSet(x + dir[1], y + dir[0])) return true;
            if (site.isSet(x - dir[1], y - dir[0])) return true;
            return false;
        }

        let count = 0;
        for (i = 0; i < SITE.SEQ.length; i++) {
            x = Math.floor(SITE.SEQ[i] / site.height);
            y = SITE.SEQ[i] % site.height;

            if (!site.isSet(x, y)) {
                for (d = 0; d <= 1; d++) {
                    // Try a horizontal door, and then a vertical door.
                    let dir = dirCoords[d];
                    if (!isValidTunnelStart(x, y, dir)) continue;
                    j = maxConnectionLength;

                    // check up/left
                    if (
                        site.hasXY(x + dir[0], y + dir[1]) &&
                        site.isPassable(x + dir[0], y + dir[1])
                    ) {
                        // just can't build directly into a door
                        if (
                            !site.hasXY(x - dir[0], y - dir[1]) ||
                            site.isDoor(x - dir[0], y - dir[1])
                        ) {
                            continue;
                        }
                    } else if (
                        site.hasXY(x - dir[0], y - dir[1]) &&
                        site.isPassable(x - dir[0], y - dir[1])
                    ) {
                        if (
                            !site.hasXY(x + dir[0], y + dir[1]) ||
                            site.isDoor(x + dir[0], y + dir[1])
                        ) {
                            continue;
                        }
                        dir = dir.map((v) => -1 * v) as [number, number];
                    } else {
                        continue; // not valid start for tunnel
                    }

                    startX = x + dir[0];
                    startY = y + dir[1];
                    endX = x;
                    endY = y;

                    for (j = 0; j < maxConnectionLength; ++j) {
                        endX -= dir[0];
                        endY -= dir[1];

                        // if (site.hasXY(endX, endY) && !grid.cell(endX, endY).isNull()) {
                        if (isValidTunnelEnd(endX, endY, dir)) {
                            break;
                        }
                    }

                    if (j < maxConnectionLength) {
                        GW.path.calculateDistances(
                            pathGrid,
                            startX,
                            startY,
                            costGrid,
                            false
                        );
                        // pathGrid.fill(30000);
                        // pathGrid[startX][startY] = 0;
                        // dijkstraScan(pathGrid, costGrid, false);
                        if (
                            pathGrid[endX][endY] > minimumPathingDistance &&
                            pathGrid[endX][endY] < 30000
                        ) {
                            // and if the pathing distance between the two flanking floor tiles exceeds minimumPathingDistance,

                            // dungeon.debug(
                            //     'Adding Loop',
                            //     startX,
                            //     startY,
                            //     ' => ',
                            //     endX,
                            //     endY,
                            //     ' : ',
                            //     pathGrid[endX][endY]
                            // );

                            while (endX !== startX || endY !== startY) {
                                if (site.isNothing(endX, endY)) {
                                    site.setTile(endX, endY, SITE.FLOOR);
                                    costGrid[endX][endY] = 1; // (Cost map also needs updating.)
                                }
                                endX += dir[0];
                                endY += dir[1];
                            }
                            // TODO - Door is optional
                            site.setTile(x, y, SITE.DOOR); // then turn the tile into a doorway.
                            ++count;
                            break;
                        }
                    }
                }
            }
        }
        GW.grid.free(pathGrid);
        GW.grid.free(costGrid);

        return count;
    }
}

// Add some loops to the otherwise simply connected network of rooms.
export function digLoops(
    grid: GW.grid.NumGrid,
    opts: Partial<LoopOptions> = {}
) {
    const digger = new LoopDigger(opts);
    const site = new SITE.GridSite(grid);
    return digger.create(site);
}
