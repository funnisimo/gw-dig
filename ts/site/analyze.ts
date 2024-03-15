import * as GWU from 'gw-utils/index';

export interface AnalysisBase {
    readonly height: number;
    readonly width: number;

    hasXY: GWU.xy.XYMatchFunc;

    blocksPathing: GWU.xy.XYMatchFunc;
    blocksMove: GWU.xy.XYMatchFunc;
    blocksDiagonal: GWU.xy.XYMatchFunc;
    isSecretDoor: GWU.xy.XYMatchFunc;
}

export interface LoopSite extends AnalysisBase {
    setInLoop: GWU.xy.XYFunc;
    clearInLoop: GWU.xy.XYFunc;
    isInLoop: GWU.xy.XYMatchFunc;
}

export interface ChokeSite extends AnalysisBase {
    clearChokepoint: GWU.xy.XYFunc;
    setChokepoint: GWU.xy.XYFunc;
    isChokepoint: GWU.xy.XYMatchFunc;
    setChokeCount(x: number, y: number, count: number): void;
    getChokeCount(x: number, y: number): number;

    setGateSite: GWU.xy.XYFunc;
    clearGateSite: GWU.xy.XYFunc;
    isGateSite: GWU.xy.XYMatchFunc;

    isAreaMachine: GWU.xy.XYMatchFunc;
    isInLoop: GWU.xy.XYMatchFunc;
}

export type AnalysisSite = LoopSite & ChokeSite;

export function analyze(map: AnalysisSite, updateChokeCounts = true) {
    updateLoopiness(map);
    updateChokepoints(map, updateChokeCounts);
}

/////////////////////////////////////////////////////
/////////////////////////////////////////////////////
// TODO - Move to Map?

export function updateChokepoints(map: ChokeSite, updateCounts: boolean) {
    const blockMap = GWU.grid.alloc(map.width, map.height);
    const grid = GWU.grid.alloc(map.width, map.height);

    for (let i = 0; i < map.width; i++) {
        for (let j = 0; j < map.height; j++) {
            if (map.blocksDiagonal(i, j)) {
                blockMap.set(i, j, 2);
            } else if (
                (map.blocksPathing(i, j) || map.blocksMove(i, j)) &&
                !map.isSecretDoor(i, j)
            ) {
                // cell.flags &= ~Flags.Cell.IS_IN_LOOP;
                blockMap.set(i, j, 1);
            } else {
                // cell.flags |= Flags.Cell.IS_IN_LOOP;
                blockMap.set(i, j, 0);
            }
        }
    }

    let passableArcCount;

    // done finding loops; now flag chokepoints
    for (let i = 1; i < blockMap.width - 1; i++) {
        for (let j = 1; j < blockMap.height - 1; j++) {
            map.clearChokepoint(i, j);
            if (!blockMap.get(i, j)) {
                if (!map.isInLoop(i, j)) {
                    passableArcCount = 0;
                    for (let dir = 0; dir < 8; dir++) {
                        const oldX = i + GWU.xy.CLOCK_DIRS[(dir + 7) % 8][0];
                        const oldY = j + GWU.xy.CLOCK_DIRS[(dir + 7) % 8][1];
                        const newX = i + GWU.xy.CLOCK_DIRS[dir][0];
                        const newY = j + GWU.xy.CLOCK_DIRS[dir][1];
                        if (
                            (map.hasXY(newX, newY) && // RUT.Map.makeValidXy(map, newXy) &&
                                blockMap.get(newX, newY)! > 0) !=
                            (map.hasXY(oldX, oldY) && // RUT.Map.makeValidXy(map, oldXy) &&
                                blockMap.get(oldX, oldY)! > 0)
                        ) {
                            if (++passableArcCount > 2) {
                                if (
                                    (blockMap.get(i - 1, j) &&
                                        blockMap.get(i + 1, j)) ||
                                    (blockMap.get(i, j - 1) &&
                                        blockMap.get(i, j + 1))
                                ) {
                                    map.setChokepoint(i, j);
                                }
                                break;
                            }
                        }
                    }
                }
                const left = i - 1;
                const right = i + 1;
                const up = j - 1;
                const down = j + 1;

                if (blockMap.get(i, up) && blockMap.get(i, down)) {
                    if (!blockMap.get(left, j) && !blockMap.get(right, j)) {
                        if (
                            !blockMap.get(left, up) ||
                            !blockMap.get(left, down) ||
                            !blockMap.get(right, up) ||
                            !blockMap.get(right, down)
                        ) {
                            map.setGateSite(i, j);
                        }
                    }
                } else if (blockMap.get(left, j) && blockMap.get(right, j)) {
                    if (!blockMap.get(i, up) && !blockMap.get(i, down)) {
                        if (
                            !blockMap.get(left, up) ||
                            !blockMap.get(left, down) ||
                            !blockMap.get(right, up) ||
                            !blockMap.get(right, down)
                        ) {
                            map.setGateSite(i, j);
                        }
                    }
                }
            }
        }
    }

    if (updateCounts) {
        // Done finding chokepoints; now create a chokepoint map.

        // The chokepoint map is a number for each passable tile. If the tile is a chokepoint,
        // then the number indicates the number of tiles that would be rendered unreachable if the
        // chokepoint were blocked. If the tile is not a chokepoint, then the number indicates
        // the number of tiles that would be rendered unreachable if the nearest exit chokepoint
        // were blocked.
        // The cost of all of this is one depth-first flood-fill per open point that is adjacent to a chokepoint.

        // Start by setting the chokepoint values really high, and roping off room machines.
        for (let i = 0; i < map.width; i++) {
            for (let j = 0; j < map.height; j++) {
                map.setChokeCount(i, j, 30000);
                // Not sure why this was done in Brogue
                // if (map.cell(i, j).flags.cell & Flags.Cell.IS_IN_ROOM_MACHINE) {
                //     passMap[i][j] = 0;
                // }
            }
        }

        // Scan through and find a chokepoint next to an open point.

        for (let i = 0; i < map.width; i++) {
            for (let j = 0; j < map.height; j++) {
                if (!blockMap.get(i, j) && map.isChokepoint(i, j)) {
                    for (let dir = 0; dir < 4; dir++) {
                        const newX = i + GWU.xy.DIRS[dir][0];
                        const newY = j + GWU.xy.DIRS[dir][1];
                        if (
                            map.hasXY(newX, newY) && // RUT.Map.makeValidXy(map, newXy) &&
                            !blockMap.get(newX, newY) &&
                            !map.isChokepoint(newX, newY)
                        ) {
                            // OK, (newX, newY) is an open point and (i, j) is a chokepoint.
                            // Pretend (i, j) is blocked by changing passMap, and run a flood-fill cell count starting on (newX, newY).
                            // Keep track of the flooded region in grid[][].
                            grid.fill(0);
                            blockMap.set(i, j, 1);
                            let cellCount = floodFillCount(
                                map,
                                grid,
                                blockMap,
                                newX,
                                newY
                            );
                            blockMap.set(i, j, 0);

                            // CellCount is the size of the region that would be obstructed if the chokepoint were blocked.
                            // CellCounts less than 4 are not useful, so we skip those cases.

                            if (cellCount >= 4) {
                                // Now, on the chokemap, all of those flooded cells should take the lesser of their current value or this resultant number.
                                for (let i2 = 0; i2 < grid.width; i2++) {
                                    for (let j2 = 0; j2 < grid.height; j2++) {
                                        if (
                                            grid.get(i2, j2) &&
                                            cellCount <
                                                map.getChokeCount(i2, j2)
                                        ) {
                                            map.setChokeCount(
                                                i2,
                                                j2,
                                                cellCount
                                            );
                                            // map.clearGateSite(i2, j2);
                                        }
                                    }
                                }

                                // The chokepoint itself should also take the lesser of its current value or the flood count.
                                if (cellCount < map.getChokeCount(i, j)) {
                                    map.setChokeCount(i, j, cellCount);
                                    // map.setGateSite(i, j);
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    GWU.grid.free(blockMap);
    GWU.grid.free(grid);
}

// Assumes it is called with respect to a passable (startX, startY), and that the same is not already included in results.
// Returns 10000 if the area included an area machine.
export function floodFillCount(
    map: ChokeSite,
    results: GWU.grid.NumGrid,
    blockMap: GWU.grid.NumGrid,
    startX: number,
    startY: number
) {
    function getCount(x: number, y: number): number {
        let count = 1;

        if (map.isAreaMachine(x, y)) {
            // huh?
            count = 10000;
        }
        return count;
    }

    let count = 0;
    const todo: GWU.xy.Loc[] = [[startX, startY]];
    const free: GWU.xy.Loc[] = [];

    while (todo.length) {
        const item = todo.pop()!;
        free.push(item);
        const x = item[0];
        const y = item[1];
        if (results.get(x, y)) continue;

        results.set(x, y, 1);
        count += getCount(x, y);

        for (let dir = 0; dir < 4; dir++) {
            const newX = x + GWU.xy.DIRS[dir][0];
            const newY = y + GWU.xy.DIRS[dir][1];

            if (
                map.hasXY(newX, newY) && // RUT.Map.makeValidXy(map, newXy) &&
                !blockMap.get(newX, newY) &&
                !results.get(newX, newY)
            ) {
                const item = free.pop() || [-1, -1];
                item[0] = newX;
                item[1] = newY;
                todo.push(item);
            }
        }
    }

    return Math.min(count, 10000);
}

////////////////////////////////////////////////////////
////////////////////////////////////////////////////////

export function updateLoopiness(map: LoopSite) {
    resetLoopiness(map);
    checkLoopiness(map);
    cleanLoopiness(map);
}

export function resetLoopiness(map: LoopSite) {
    GWU.xy.forRect(map.width, map.height, (x, y) => {
        if (
            (map.blocksPathing(x, y) || map.blocksMove(x, y)) &&
            !map.isSecretDoor(x, y)
        ) {
            map.clearInLoop(x, y);
            // cell.flags.cell &= ~Flags.Cell.IS_IN_LOOP;
            // passMap[i][j] = false;
        } else {
            map.setInLoop(x, y);
            // cell.flags.cell |= Flags.Cell.IS_IN_LOOP;
            // passMap[i][j] = true;
        }
    });
}

export function checkLoopiness(map: LoopSite) {
    let inString;
    let newX, newY, dir, sdir;
    let numStrings, maxStringLength, currentStringLength;

    const todo = GWU.grid.alloc(map.width, map.height, 1);
    let tryAgain = true;

    while (tryAgain) {
        tryAgain = false;
        todo.forEach((v, x, y) => {
            if (!v) return;
            // const cell = map.cell(x, y);

            todo.set(x, y, 0);

            if (!map.isInLoop(x, y)) {
                return;
            }

            // find an unloopy neighbor to start on
            for (sdir = 0; sdir < 8; sdir++) {
                newX = x + GWU.xy.CLOCK_DIRS[sdir][0];
                newY = y + GWU.xy.CLOCK_DIRS[sdir][1];

                if (!map.hasXY(newX, newY)) continue;

                // const cell = map.cell(newX, newY);
                if (!map.isInLoop(newX, newY)) {
                    break;
                }
            }
            if (sdir == 8) {
                // no unloopy neighbors
                return; // leave cell loopy
            }

            // starting on this unloopy neighbor,
            // work clockwise and count up:
            // (a) the number of strings of loopy neighbors, and
            // (b) the length of the longest such string.
            numStrings = maxStringLength = currentStringLength = 0;
            inString = false;
            for (dir = sdir; dir < sdir + 8; dir++) {
                newX = x + GWU.xy.CLOCK_DIRS[dir % 8][0];
                newY = y + GWU.xy.CLOCK_DIRS[dir % 8][1];
                if (!map.hasXY(newX, newY)) continue;

                // const newCell = map.cell(newX, newY);
                if (map.isInLoop(newX, newY)) {
                    currentStringLength++;
                    if (!inString) {
                        numStrings++;
                        inString = true;
                        if (numStrings > 1) {
                            break; // more than one string here; leave loopy
                        }
                    }
                } else if (inString) {
                    if (currentStringLength > maxStringLength) {
                        maxStringLength = currentStringLength;
                    }
                    currentStringLength = 0;
                    inString = false;
                }
            }

            if (inString && currentStringLength > maxStringLength) {
                maxStringLength = currentStringLength;
            }
            if (numStrings == 1 && maxStringLength <= 4) {
                map.clearInLoop(x, y);
                // cell.clearCellFlag(Flags.Cell.IS_IN_LOOP);
                // console.log(x, y, numStrings, maxStringLength);
                // map.dump((c) =>
                //     c.hasCellFlag(Flags.Cell.IS_IN_LOOP) ? '*' : ' '
                // );

                for (dir = 0; dir < 8; dir++) {
                    newX = x + GWU.xy.CLOCK_DIRS[dir][0];
                    newY = y + GWU.xy.CLOCK_DIRS[dir][1];
                    if (map.hasXY(newX, newY) && map.isInLoop(newX, newY)) {
                        todo.set(newX, newY, 1);
                        tryAgain = true;
                    }
                }
            }
        });
    }
}

export function fillInnerLoopGrid(map: LoopSite, grid: GWU.grid.NumGrid) {
    for (let x = 0; x < map.width; ++x) {
        for (let y = 0; y < map.height; ++y) {
            // const cell = map.cell(x, y);
            if (map.isInLoop(x, y)) {
                grid.set(x, y, 1);
            } else if (x > 0 && y > 0) {
                // const up = map.cell(x, y - 1);
                // const left = map.cell(x - 1, y);
                if (
                    map.isInLoop(x, y - 1) &&
                    map.isInLoop(x - 1, y)
                    // up.flags.cell & Flags.Cell.IS_IN_LOOP &&
                    // left.flags.cell & Flags.Cell.IS_IN_LOOP
                ) {
                    grid.set(x, y, 1);
                }
            }
        }
    }
}

export function cleanLoopiness(map: LoopSite) {
    // remove extraneous loop markings
    const grid = GWU.grid.alloc(map.width, map.height);
    fillInnerLoopGrid(map, grid);

    // const xy = { x: 0, y: 0 };
    let designationSurvives;

    for (let i = 0; i < grid.width; i++) {
        for (let j = 0; j < grid.height; j++) {
            // const cell = map.cell(i, j);
            if (map.isInLoop(i, j)) {
                designationSurvives = false;
                for (let dir = 0; dir < 8; dir++) {
                    let newX = i + GWU.xy.CLOCK_DIRS[dir][0];
                    let newY = j + GWU.xy.CLOCK_DIRS[dir][1];

                    if (
                        map.hasXY(newX, newY) && // RUT.Map.makeValidXy(map, xy, newX, newY) &&
                        !grid.get(newX, newY) &&
                        !map.isInLoop(newX, newY)
                    ) {
                        designationSurvives = true;
                        break;
                    }
                }
                if (!designationSurvives) {
                    grid.set(i, j, 1);
                    map.clearInLoop(i, j);
                    // map.cell(i, j).flags.cell &= ~Flags.Cell.IS_IN_LOOP;
                }
            }
        }
    }
    GWU.grid.free(grid);
}

////////////////////////////////////////////////////////
////////////////////////////////////////////////////////
