import * as GW from 'gw-utils';
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
        Object.assign(this.options, options);
    }

    create(site: SITE.DigSite): number {
        let count = 0;
        let newX, newY;
        let i, j, d, x, y;

        const maxLength = this.options.maxLength;
        const minDistance = this.options.minDistance;

        const pathGrid = GW.grid.alloc(site.width, site.height);
        const costGrid = GW.grid.alloc(site.width, site.height);

        const dirCoords: [number, number][] = [
            [1, 0],
            [0, 1],
        ];

        costGrid.update((_v, x, y) =>
            site.isPassable(x, y) ? 1 : GW.path.OBSTRUCTION
        );

        const seq = GW.random.sequence(site.width * site.height);

        for (i = 0; i < seq.length; i++) {
            x = Math.floor(seq[i] / site.height);
            y = seq[i] % site.height;

            if (
                // map.hasXY(x, y) &&
                // map.get(x, y) &&
                site.isPassable(x, y) &&
                !site.isAnyLiquid(x, y)
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
                    if (site.isAnyLiquid(newX, newY)) {
                        for (j = 0; j < maxLength; ++j) {
                            newX += bridgeDir[0];
                            newY += bridgeDir[1];

                            // if (!isBridgeCandidate(newX, newY, bridgeDir)) {
                            if (!site.isAnyLiquid(newX, newY)) {
                                break;
                            }
                        }
                    }

                    if (
                        // map.get(newX, newY) &&
                        site.isPassable(newX, newY) &&
                        j < maxLength
                    ) {
                        GW.path.calculateDistances(
                            pathGrid,
                            newX,
                            newY,
                            costGrid,
                            false
                        );
                        // pathGrid.fill(30000);
                        // pathGrid[newX][newY] = 0;
                        // dijkstraScan(pathGrid, costGrid, false);
                        if (
                            pathGrid[x][y] > minDistance &&
                            pathGrid[x][y] < GW.path.NO_PATH
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
                                    site.setTile(x, y, SITE.BRIDGE); // map[x][y] = SITE.BRIDGE;
                                    costGrid[x][y] = 1; // (Cost map also needs updating.)
                                } else {
                                    site.setTile(x, y, SITE.FLOOR); // map[x][y] = SITE.FLOOR;
                                    costGrid[x][y] = 1;
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
        GW.grid.free(pathGrid);
        GW.grid.free(costGrid);
        return count;
    }

    isBridgeCandidate(
        site: SITE.DigSite,
        x: number,
        y: number,
        bridgeDir: [number, number]
    ) {
        if (site.isBridge(x, y)) return true;
        if (!site.isAnyLiquid(x, y)) return false;
        if (!site.isAnyLiquid(x + bridgeDir[1], y + bridgeDir[0])) return false;
        if (!site.isAnyLiquid(x - bridgeDir[1], y - bridgeDir[0])) return false;
        return true;
    }
}
