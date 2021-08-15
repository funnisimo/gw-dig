import * as GW from 'gw-utils';
import { BuildSite, Flags } from './site';
// import { LoopFinder } from './loopFinder';

export class ChokeFinder {
    constructor(public withCounts = false) {}

    /////////////////////////////////////////////////////
    /////////////////////////////////////////////////////
    // TODO - Move to Map?

    compute(
        site: BuildSite
    ) {
        const floodGrid = GW.grid.alloc(site.width, site.height);

        const passMap = GW.grid.alloc(site.width, site.height);
        passMap.update((_v, x, y) => (site.isPassable(x, y) ? 1 : 0));

        // Assume loops are done already!
        // const loopFinder = new LoopFinder();
        // loopFinder.compute(
        //     site
        // );

        let passableArcCount;

        // done finding loops; now flag chokepoints
        for (let i = 1; i < passMap.width - 1; i++) {
            for (let j = 1; j < passMap.height - 1; j++) {
                site.clearSiteFlag(i, j, Flags.IS_CHOKEPOINT);
                site.setChokeCount(i, j, 30000);

                if (passMap[i][j] && !site.hasSiteFlag(i, j, Flags.IS_IN_LOOP)) {
                    passableArcCount = 0;
                    for (let dir = 0; dir < 8; dir++) {
                        const oldX = i + GW.utils.CLOCK_DIRS[(dir + 7) % 8][0];
                        const oldY = j + GW.utils.CLOCK_DIRS[(dir + 7) % 8][1];
                        const newX = i + GW.utils.CLOCK_DIRS[dir][0];
                        const newY = j + GW.utils.CLOCK_DIRS[dir][1];
                        if (
                            passMap.hasXY(newX, newY) &&
                            passMap.hasXY(oldX, oldY) &&
                            passMap[newX][newY] != passMap[oldX][oldY]
                        ) {
                            if (++passableArcCount > 2) {
                                if (
                                    (!passMap[i - 1][j] &&
                                        !passMap[i + 1][j]) ||
                                    (!passMap[i][j - 1] && !passMap[i][j + 1])
                                ) {
                                    site.setSiteFlag(i, j, Flags.IS_CHOKEPOINT);
                                }
                                break;
                            }
                        }
                    }
                }
            }
        }

        if (this.withCounts) {
            // Done finding chokepoints; now create a chokepoint map.

            // The chokepoint map is a number for each passable tile. If the tile is a chokepoint,
            // then the number indicates the number of tiles that would be rendered unreachable if the
            // chokepoint were blocked. If the tile is not a chokepoint, then the number indicates
            // the number of tiles that would be rendered unreachable if the nearest exit chokepoint
            // were blocked.
            // The cost of all of this is one depth-first flood-fill per open point that is adjacent to a chokepoint.

            // Start by roping off room machines.
            passMap.update( (v, x, y) => v && site.hasSiteFlag(x, y, Flags.IS_IN_ROOM_MACHINE) ? 0 : v);

            // Scan through and find a chokepoint next to an open point.

            for (let i = 0; i < site.width; i++) {
                for (let j = 0; j < site.height; j++) {
                    if (
                        passMap[i][j] &&
                        site.hasSiteFlag(i, j, Flags.IS_CHOKEPOINT)
                    ) {
                        for (let dir = 0; dir < 4; dir++) {
                            const newX = i + GW.utils.DIRS[dir][0];
                            const newY = j + GW.utils.DIRS[dir][1];
                            if (
                                passMap.hasXY(newX, newY) && // RUT.Map.makeValidXy(map, newXy) &&
                                passMap[newX][newY] &&
                                !(site.hasSiteFlag(newX, newY, Flags.IS_CHOKEPOINT))
                            ) {
                                // OK, (newX, newY) is an open point and (i, j) is a chokepoint.
                                // Pretend (i, j) is blocked by changing passMap, and run a flood-fill cell count starting on (newX, newY).
                                // Keep track of the flooded region in grid[][].
                                floodGrid.fill(0);
                                passMap[i][j] = 0;
                                let cellCount = floodFillCount(
                                    site,
                                    floodGrid,
                                    passMap,
                                    newX,
                                    newY
                                );
                                passMap[i][j] = 1;

                                // CellCount is the size of the region that would be obstructed if the chokepoint were blocked.
                                // CellCounts less than 4 are not useful, so we skip those cases.

                                if (cellCount >= 4) {
                                    // Now, on the chokemap, all of those flooded cells should take the lesser of their current value or this resultant number.
                                    for (let i2 = 0; i2 < floodGrid.width; i2++) {
                                        for (
                                            let j2 = 0;
                                            j2 < floodGrid.height;
                                            j2++
                                        ) {
                                            if (
                                                floodGrid[i2][j2] &&
                                                cellCount < site.getChokeCount(i2, j2)
                                            ) {
                                                site.setChokeCount(i2, j2, cellCount);
                                                site.clearSiteFlag(i2, j2, Flags.IS_GATE_SITE);
                                            }
                                        }
                                    }

                                    // The chokepoint itself should also take the lesser of its current value or the flood count.
                                    if (cellCount < site.getChokeCount(i, j)) {
                                        site.setChokeCount(i, j, cellCount);
                                        site.setSiteFlag(i, j, Flags.IS_GATE_SITE);
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }

        GW.grid.free(passMap);
        GW.grid.free(floodGrid);
    }
}

// Assumes it is called with respect to a passable (startX, startY), and that the same is not already included in results.
// Returns 10000 if the area included an area machine.
export function floodFillCount(
    site: BuildSite,
    results: GW.grid.NumGrid,
    passMap: GW.grid.NumGrid,
    startX: number,
    startY: number
) {
    let count = passMap[startX][startY] == 2 ? 5000 : 1;

    if (
        site.isDeep(startX, startY)
        // map.cells[startX][startY].flags.cellMech &
        // FLAGS.CellMech.IS_IN_AREA_MACHINE
    ) {
        count = 10000;
    }

    results[startX][startY] = 1;

    for (let dir = 0; dir < 4; dir++) {
        const newX = startX + GW.utils.DIRS[dir][0];
        const newY = startY + GW.utils.DIRS[dir][1];

        if (
            site.hasXY(newX, newY) && // RUT.Map.makeValidXy(map, newXy) &&
            passMap[newX][newY] &&
            !results[newX][newY]
        ) {
            count += floodFillCount(site, results, passMap, newX, newY);
        }
    }
    return Math.min(count, 10000);
}
