import * as GW from 'gw-utils';
import * as SITE from './site';
import { DigFn } from './types';

export interface BridgeOpts {
    minimumPathingDistance: number;
    maxConnectionLength: number;
}

export class Bridges {
    public width: number;
    public height: number;
    public isAnyWaterFn: GW.utils.XYMatchFunc;
    public isBridgeFn: GW.utils.XYMatchFunc;
    public isPassableFn: GW.utils.XYMatchFunc;

    constructor(
        width: number,
        height: number,
        isAnyWaterFn: GW.utils.XYMatchFunc,
        passableFn: GW.utils.XYMatchFunc,
        bridgeFn: GW.utils.XYMatchFunc
    ) {
        this.width = width;
        this.height = height;
        this.isAnyWaterFn = isAnyWaterFn;
        this.isBridgeFn = bridgeFn;
        this.isPassableFn = passableFn;
    }

    create(setFn: DigFn, opts: Partial<BridgeOpts> = {}): number {
        let count = 0;
        let newX, newY;
        let i, j, d, x, y;

        const maxConnectionLength = opts.maxConnectionLength || 5;
        const minimumPathingDistance = opts.minimumPathingDistance || 20;

        const pathGrid = GW.grid.alloc(this.width, this.height);
        const costGrid = GW.grid.alloc(this.width, this.height);

        const dirCoords: [number, number][] = [
            [1, 0],
            [0, 1],
        ];

        costGrid.update((_v, x, y) =>
            this.isPassableFn(x, y) ? 1 : GW.path.OBSTRUCTION
        );

        const SEQ = GW.random.sequence(this.width * this.height);

        for (i = 0; i < SEQ.length; i++) {
            x = Math.floor(SEQ[i] / this.height);
            y = SEQ[i] % this.height;

            if (
                // map.hasXY(x, y) &&
                // map.get(x, y) &&
                this.isPassableFn(x, y) &&
                !this.isAnyWaterFn(x, y)
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
                    if (this.isAnyWaterFn(newX, newY)) {
                        for (j = 0; j < maxConnectionLength; ++j) {
                            newX += bridgeDir[0];
                            newY += bridgeDir[1];

                            // if (!isBridgeCandidate(newX, newY, bridgeDir)) {
                            if (!this.isAnyWaterFn(newX, newY)) {
                                break;
                            }
                        }
                    }

                    if (
                        // map.get(newX, newY) &&
                        this.isPassableFn(newX, newY) &&
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
                                if (this.isBridgeCandidate(x, y, bridgeDir)) {
                                    setFn(x, y, SITE.BRIDGE); // map[x][y] = SITE.BRIDGE;
                                    costGrid[x][y] = 1; // (Cost map also needs updating.)
                                } else {
                                    setFn(x, y, SITE.FLOOR); // map[x][y] = SITE.FLOOR;
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

    isBridgeCandidate(x: number, y: number, bridgeDir: [number, number]) {
        if (this.isBridgeFn(x, y)) return true;
        if (!this.isAnyWaterFn(x, y)) return false;
        if (!this.isAnyWaterFn(x + bridgeDir[1], y + bridgeDir[0]))
            return false;
        if (!this.isAnyWaterFn(x - bridgeDir[1], y - bridgeDir[0]))
            return false;
        return true;
    }
}

// Add some loops to the otherwise simply connected network of rooms.
export function digBridges(
    map: GW.grid.NumGrid,
    minimumPathingDistance: number,
    maxConnectionLength: number
) {
    const builder = new Bridges(
        map.width,
        map.height,
        SITE.isAnyWater.bind(SITE, map),
        SITE.isPassable.bind(SITE, map),
        SITE.isBridge.bind(SITE, map)
    );
    return builder.create(SITE.setGrid.bind(SITE, map), {
        minimumPathingDistance,
        maxConnectionLength,
    });
}
