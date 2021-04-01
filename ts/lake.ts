import * as GW from 'gw-utils';
import * as SITE from './site';

export function digLakes(map: GW.grid.NumGrid, opts: any = {}) {
    let i, j, k;
    let x, y;
    let lakeMaxHeight, lakeMaxWidth, lakeMinSize, tries, maxCount, canDisrupt;
    let count = 0;

    lakeMaxHeight = opts.height || 15; // TODO - Make this a range "5-15"
    lakeMaxWidth = opts.width || 30; // TODO - Make this a range "5-30"
    lakeMinSize = opts.minSize || 5;
    tries = opts.tries || 20;
    maxCount = opts.count || 1;
    canDisrupt = opts.canDisrupt || false;
    const wreath = opts.wreath || 0; // TODO - make this a range "0-2" or a weighted choice { 0: 50, 1: 40, 2" 10 }
    const wreathTile = opts.wreathTile || SITE.SHALLOW;
    const tile = opts.tile || SITE.LAKE;

    const lakeGrid = GW.grid.alloc(map.width, map.height, 0);

    let attempts = 0;
    while (attempts < maxCount && count < maxCount) {
        // lake generations

        const width =
            Math.round(
                ((lakeMaxWidth - lakeMinSize) * (maxCount - attempts)) /
                    maxCount
            ) + lakeMinSize;
        const height =
            Math.round(
                ((lakeMaxHeight - lakeMinSize) * (maxCount - attempts)) /
                    maxCount
            ) + lakeMinSize;

        lakeGrid.fill(SITE.NOTHING);
        const bounds = lakeGrid.fillBlob(
            5,
            4,
            4,
            width,
            height,
            55,
            'ffffftttt',
            'ffffttttt'
        );

        // lakeGrid.dump();

        let success = false;
        for (k = 0; k < tries && !success; k++) {
            // placement attempts
            // propose a position for the top-left of the lakeGrid in the dungeon
            x = GW.random.range(
                1 - bounds.x,
                lakeGrid.width - bounds.width - bounds.x - 2
            );
            y = GW.random.range(
                1 - bounds.y,
                lakeGrid.height - bounds.height - bounds.y - 2
            );

            if (canDisrupt || !lakeDisruptsPassability(map, lakeGrid, -x, -y)) {
                // level with lake is completely connected
                //   dungeon.debug("Placed a lake!", x, y);

                success = true;
                // copy in lake
                for (i = 0; i < bounds.width; i++) {
                    // skip boundary
                    for (j = 0; j < bounds.height; j++) {
                        // skip boundary
                        if (lakeGrid[i + bounds.x][j + bounds.y]) {
                            const sx = i + bounds.x + x;
                            const sy = j + bounds.y + y;
                            map[sx][sy] = tile;

                            if (wreath) {
                                map.forCircle(sx, sy, wreath, (v, i, j) => {
                                    if (v === SITE.FLOOR || v === SITE.DOOR) {
                                        map[i][j] = wreathTile;
                                    }
                                });
                            }
                        }
                    }
                }
                break;
            }
        }

        if (success) {
            ++count;
        } else {
            ++attempts;
        }
    }
    GW.grid.free(lakeGrid);
    return count;
}

function lakeDisruptsPassability(
    map: GW.grid.NumGrid,
    lakeGrid: GW.grid.NumGrid,
    lakeToMapX = 0,
    lakeToMapY = 0
) {
    const walkableGrid = GW.grid.alloc(map.width, map.height);
    let disrupts = false;

    // Get all walkable locations after lake added
    map.forEach((v: number, i, j) => {
        const lakeX = i + lakeToMapX;
        const lakeY = j + lakeToMapY;
        if (!v) {
            return; // not walkable
        } else if (SITE.isStairs(map, i, j)) {
            if (lakeGrid.get(lakeX, lakeY)) {
                disrupts = true;
            } else {
                walkableGrid[i][j] = 1;
            }
        } else if (SITE.isPassable(map, i, j)) {
            if (lakeGrid.get(lakeX, lakeY)) return;
            walkableGrid[i][j] = 1;
        }
    });

    let first = true;
    for (let i = 0; i < walkableGrid.width && !disrupts; ++i) {
        for (let j = 0; j < walkableGrid.height && !disrupts; ++j) {
            if (walkableGrid[i][j] == 1) {
                if (first) {
                    walkableGrid.floodFill(i, j, 1, 2);
                    first = false;
                } else {
                    disrupts = true;
                }
            }
        }
    }

    // console.log('WALKABLE GRID');
    // walkableGrid.dump();

    GW.grid.free(walkableGrid);
    return disrupts;
}

function isBridgeCandidate(
    map: GW.grid.NumGrid,
    x: number,
    y: number,
    bridgeDir: [number, number]
) {
    if (map.get(x, y) === SITE.BRIDGE) return true;
    if (!SITE.isAnyWater(map, x, y)) return false;
    if (!SITE.isAnyWater(map, x + bridgeDir[1], y + bridgeDir[0])) return false;
    if (!SITE.isAnyWater(map, x - bridgeDir[1], y - bridgeDir[0])) return false;
    return true;
}

// Add some loops to the otherwise simply connected network of rooms.
export function digBridges(
    map: GW.grid.NumGrid,
    minimumPathingDistance: number,
    maxConnectionLength: number
) {
    let newX, newY;
    let i, j, d, x, y;

    maxConnectionLength = maxConnectionLength || 1; // by default only break walls down

    const siteGrid = map;
    const pathGrid = GW.grid.alloc(map.width, map.height);
    const costGrid = GW.grid.alloc(map.width, map.height);

    const dirCoords: [number, number][] = [
        [1, 0],
        [0, 1],
    ];

    SITE.fillCostGrid(map, costGrid);

    const SEQ = GW.random.sequence(map.width * map.height);

    for (i = 0; i < SEQ.length; i++) {
        x = Math.floor(SEQ[i] / siteGrid.height);
        y = SEQ[i] % siteGrid.height;

        if (
            map.hasXY(x, y) &&
            map.get(x, y) &&
            SITE.isPassable(map, x, y) &&
            !SITE.isAnyWater(map, x, y)
        ) {
            for (d = 0; d <= 1; d++) {
                // Try right, then down
                const bridgeDir = dirCoords[d];
                newX = x + bridgeDir[0];
                newY = y + bridgeDir[1];
                j = maxConnectionLength;

                if (!map.hasXY(newX, newY)) continue;

                // check for line of lake tiles
                // if (isBridgeCandidate(newX, newY, bridgeDir)) {
                if (SITE.isAnyWater(map, newX, newY)) {
                    for (j = 0; j < maxConnectionLength; ++j) {
                        newX += bridgeDir[0];
                        newY += bridgeDir[1];

                        // if (!isBridgeCandidate(newX, newY, bridgeDir)) {
                        if (!SITE.isAnyWater(map, newX, newY)) {
                            break;
                        }
                    }
                }

                if (
                    map.get(newX, newY) &&
                    SITE.isPassable(map, newX, newY) &&
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
                            if (isBridgeCandidate(map, x, y, bridgeDir)) {
                                map[x][y] = SITE.BRIDGE;
                                costGrid[x][y] = 1; // (Cost map also needs updating.)
                            } else {
                                map[x][y] = SITE.FLOOR;
                                costGrid[x][y] = 1;
                            }
                            x += bridgeDir[0];
                            y += bridgeDir[1];
                        }
                        break;
                    }
                }
            }
        }
    }
    GW.grid.free(pathGrid);
    GW.grid.free(costGrid);
}
