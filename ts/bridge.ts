import * as GWU from 'gw-utils';
import * as SITE from './site';

export interface BridgeOpts {
    minDistance: number;
    maxLength: number;
}

export class Bridges {
    public options: BridgeOpts = {
        minDistance: 20,
        maxLength: 5,
    };

    constructor(options: Partial<BridgeOpts> = {}) {
        GWU.object.assignObject(this.options, options);
    }

    create(site: SITE.Site): number {
        let count = 0;
        let newX, newY;
        let i, j, d, x, y;

        const maxLength = this.options.maxLength;
        const minDistance = this.options.minDistance;

        const pathGrid = new GWU.path.DijkstraMap();
        // const costGrid = GWU.grid.alloc(site.width, site.height);

        const dirCoords: [number, number][] = [
            [1, 0],
            [0, 1],
        ];

        const seq = site.rng.sequence(site.width * site.height);

        for (i = 0; i < seq.length; i++) {
            x = Math.floor(seq[i] / site.height);
            y = seq[i] % site.height;

            if (
                // map.hasXY(x, y) &&
                // map.get(x, y) &&
                site.isPassable(x, y) &&
                (site.isBridge(x, y) || !site.isAnyLiquid(x, y))
            ) {
                for (d = 0; d <= 1; d++) {
                    // Try right, then down
                    const bridgeDir = dirCoords[d];
                    newX = x + bridgeDir[0];
                    newY = y + bridgeDir[1];
                    j = maxLength;

                    // if (!map.hasXY(newX, newY)) continue;

                    // check for line of lake tiles
                    // if (isBridgeCandidate(newX, newY, bridgeDir)) {
                    if (
                        site.isAnyLiquid(newX, newY) &&
                        !site.isBridge(newX, newY)
                    ) {
                        for (j = 0; j < maxLength; ++j) {
                            newX += bridgeDir[0];
                            newY += bridgeDir[1];

                            // if (!isBridgeCandidate(newX, newY, bridgeDir)) {
                            if (
                                site.isBridge(newX, newY) ||
                                !site.isAnyLiquid(newX, newY)
                            ) {
                                break;
                            }
                        }
                    }

                    if (
                        // map.get(newX, newY) &&
                        site.isPassable(newX, newY) &&
                        j < maxLength
                    ) {
                        SITE.computeDistanceMap(
                            site,
                            pathGrid,
                            newX,
                            newY,
                            999
                        );

                        if (
                            pathGrid.getDistance(x, y) > minDistance &&
                            pathGrid.getDistance(x, y) < GWU.path.BLOCKED
                        ) {
                            // and if the pathing distance between the two flanking floor tiles exceeds minDistance,

                            // dungeon.debug(
                            //     'Adding Bridge',
                            //     x,
                            //     y,
                            //     ' => ',
                            //     newX,
                            //     newY
                            // );

                            while (x !== newX || y !== newY) {
                                if (
                                    this.isBridgeCandidate(
                                        site,
                                        x,
                                        y,
                                        bridgeDir
                                    )
                                ) {
                                    site.setTile(x, y, 'BRIDGE'); // map[x][y] = SITE.BRIDGE;
                                    // costGrid[x][y] = 1; // (Cost map also needs updating.)
                                } else {
                                    site.setTile(x, y, 'FLOOR'); // map[x][y] = SITE.FLOOR;
                                    // costGrid[x][y] = 1;
                                }
                                x += bridgeDir[0];
                                y += bridgeDir[1];
                            }
                            ++count;
                            break;
                        }
                    }
                }
            }
        }
        // GWU.grid.free(costGrid);
        return count;
    }

    isBridgeCandidate(
        site: SITE.Site,
        x: number,
        y: number,
        _bridgeDir: [number, number]
    ) {
        if (site.isBridge(x, y)) return true;
        if (!site.isAnyLiquid(x, y)) return false;
        // if (!site.isAnyLiquid(x + bridgeDir[1], y + bridgeDir[0])) return false;
        // if (!site.isAnyLiquid(x - bridgeDir[1], y - bridgeDir[0])) return false;
        return true;
    }
}
