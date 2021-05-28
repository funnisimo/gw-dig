import * as GW from 'gw-utils';
import * as SITE from './site';

export interface BridgeOpts {
    minimumPathingDistance: number;
    maxConnectionLength: number;
}

export class Bridges {
    public options: BridgeOpts = {
        minimumPathingDistance: 20,
        maxConnectionLength: 5,
    };

    constructor(options: Partial<BridgeOpts> = {}) {
        Object.assign(this.options, options);
    }

    create(site: SITE.Site): number {
        let count = 0;
        let newX, newY;
        let i, j, d, x, y;

        const maxConnectionLength = this.options.maxConnectionLength;
        const minimumPathingDistance = this.options.minimumPathingDistance;

        const pathGrid = GW.grid.alloc(site.width, site.height);
        const costGrid = GW.grid.alloc(site.width, site.height);

        const dirCoords: [number, number][] = [
            [1, 0],
            [0, 1],
        ];

        costGrid.update((_v, x, y) =>
            site.isPassable(x, y) ? 1 : GW.path.OBSTRUCTION
        );

        const SEQ = GW.random.sequence(site.width * site.height);

        for (i = 0; i < SEQ.length; i++) {
            x = Math.floor(SEQ[i] / site.height);
            y = SEQ[i] % site.height;

            if (
                // map.hasXY(x, y) &&
                // map.get(x, y) &&
                site.isPassable(x, y) &&
                !site.isAnyWater(x, y)
            ) {
                for (d = 0; d <= 1; d++) {
                    // Try right, then down
                    const bridgeDir = dirCoords[d];
                    newX = x + bridgeDir[0];
                    newY = y + bridgeDir[1];
                    j = maxConnectionLength;

                    // if (!map.hasXY(newX, newY)) continue;

                    // check for line of lake tiles
                    // if (isBridgeCandidate(newX, newY, bridgeDir)) {
                    if (site.isAnyWater(newX, newY)) {
                        for (j = 0; j < maxConnectionLength; ++j) {
                            newX += bridgeDir[0];
                            newY += bridgeDir[1];

                            // if (!isBridgeCandidate(newX, newY, bridgeDir)) {
                            if (!site.isAnyWater(newX, newY)) {
                                break;
                            }
                        }
                    }

                    if (
                        // map.get(newX, newY) &&
                        site.isPassable(newX, newY) &&
                        j < maxConnectionLength
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
                            pathGrid[x][y] > minimumPathingDistance &&
                            pathGrid[x][y] < GW.path.NO_PATH
                        ) {
                            // and if the pathing distance between the two flanking floor tiles exceeds minimumPathingDistance,

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
        site: SITE.Site,
        x: number,
        y: number,
        bridgeDir: [number, number]
    ) {
        if (site.isBridge(x, y)) return true;
        if (!site.isAnyWater(x, y)) return false;
        if (!site.isAnyWater(x + bridgeDir[1], y + bridgeDir[0])) return false;
        if (!site.isAnyWater(x - bridgeDir[1], y - bridgeDir[0])) return false;
        return true;
    }
}
