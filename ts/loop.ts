import * as GWU from 'gw-utils';
import * as SITE from './site';

export interface LoopOptions {
    minDistance: number;
    maxLength: number;
    doorChance: number;
}

export interface LoopConfig {
    minDistance: number;
    maxLength: number;
    doorChance: number;
}

export class LoopDigger {
    public options: LoopConfig = {
        minDistance: 100,
        maxLength: 1,
        doorChance: 50,
    };

    constructor(options: Partial<LoopOptions> = {}) {
        GWU.object.assignObject(this.options, options);
    }

    create(site: SITE.Site) {
        let startX, startY, endX, endY;
        let i, j, d, x, y;

        const minDistance = Math.min(
            this.options.minDistance,
            Math.floor(Math.max(site.width, site.height) / 2)
        );
        const maxLength = this.options.maxLength;

        const pathGrid = new GWU.path.DijkstraMap();
        // const costGrid = GWU.grid.alloc(site.width, site.height);

        const dirCoords: [number, number][] = [
            [1, 0],
            [0, 1],
        ];

        // SITE.fillCostGrid(site, costGrid);

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
        const seq = site.rng.sequence(site.width * site.height);

        for (i = 0; i < seq.length; i++) {
            x = Math.floor(seq[i] / site.height);
            y = seq[i] % site.height;

            if (!site.isSet(x, y)) {
                for (d = 0; d <= 1; d++) {
                    // Try a horizontal door, and then a vertical door.
                    let dir = dirCoords[d];
                    if (!isValidTunnelStart(x, y, dir)) continue;
                    j = maxLength;

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

                    for (j = 0; j < maxLength; ++j) {
                        endX -= dir[0];
                        endY -= dir[1];

                        // if (site.hasXY(endX, endY) && !grid.cell(endX, endY).isNull()) {
                        if (isValidTunnelEnd(endX, endY, dir)) {
                            break;
                        }
                    }

                    if (j < maxLength) {
                        SITE.computeDistanceMap(
                            site,
                            pathGrid,
                            startX,
                            startY,
                            888
                        );

                        // pathGrid.fill(30000);
                        // pathGrid[startX][startY] = 0;
                        // dijkstraScan(pathGrid, costGrid, false);
                        if (
                            pathGrid.getDistance(endX, endY) > minDistance &&
                            pathGrid.getDistance(endX, endY) < GWU.path.BLOCKED
                        ) {
                            // and if the pathing distance between the two flanking floor tiles exceeds minDistance,

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
                                    site.setTile(endX, endY, 'FLOOR');
                                    // costGrid[endX][endY] = 1; // (Cost map also needs updating.)
                                }
                                endX += dir[0];
                                endY += dir[1];
                            }
                            // TODO - Door is optional
                            const tile = site.rng.chance(
                                this.options.doorChance
                            )
                                ? 'DOOR'
                                : 'FLOOR';
                            site.setTile(x, y, tile); // then turn the tile into a doorway.
                            ++count;
                            break;
                        }
                    }
                }
            }
        }
        // pathGrid.free();
        // GWU.grid.free(costGrid);

        return count;
    }
}

// Add some loops to the otherwise simply connected network of rooms.
export function digLoops(site: SITE.Site, opts: Partial<LoopOptions> = {}) {
    const digger = new LoopDigger(opts);
    return digger.create(site);
}
