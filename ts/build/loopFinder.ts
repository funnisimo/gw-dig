import * as GW from 'gw-utils';

import * as SITE from './site';

////////////////////////////////////////////////////////
////////////////////////////////////////////////////////

export class LoopFinder {
    constructor() {}

    compute(site: SITE.BuildSite) {
        // const grid = GW.grid.alloc(site.width, site.height);

        this._initGrid(site);
        GW.utils.forRect(site.width, site.height, (x, y) =>
            this._checkCell(site, x, y)
        );
        // grid.forEach((_v, x, y) => this._checkCell(site, grid, x, y));

        // grid.forEach((v, x, y) => cb(x, y, !!v));
        // GW.grid.free(grid);
    }

    _initGrid(site: SITE.BuildSite) {
        GW.utils.forRect(site.width, site.height, (x, y) => {
            if (site.isPassable(x, y)) {
                site.setCellFlag(x, y, GW.map.flags.Cell.IS_IN_LOOP);
            } else {
                site.clearCellFlag(x, y, GW.map.flags.Cell.IS_IN_LOOP);
            }
        });
    }

    _checkCell(site: SITE.BuildSite, x: number, y: number) {
        let inString;
        let newX, newY, dir, sdir;
        let numStrings, maxStringLength, currentStringLength;

        const v = site.hasCellFlag(x, y, GW.map.flags.Cell.IS_IN_LOOP);
        if (!v) return;

        // find an unloopy neighbor to start on
        for (sdir = 0; sdir < 8; sdir++) {
            newX = x + GW.utils.CLOCK_DIRS[sdir][0];
            newY = y + GW.utils.CLOCK_DIRS[sdir][1];

            if (!site.hasXY(newX, newY)) continue;
            if (!site.hasCellFlag(newX, newY, GW.map.flags.Cell.IS_IN_LOOP)) {
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
            newX = x + GW.utils.CLOCK_DIRS[dir % 8][0];
            newY = y + GW.utils.CLOCK_DIRS[dir % 8][1];
            if (!site.hasXY(newX, newY)) continue;

            const newCell = site.hasCellFlag(
                newX,
                newY,
                GW.map.flags.Cell.IS_IN_LOOP
            );
            if (newCell) {
                currentStringLength++;
                if (!inString) {
                    if (numStrings > 0) {
                        return false; // more than one string here; leave loopy
                    }
                    numStrings++;
                    inString = true;
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
            site.clearCellFlag(x, y, GW.map.flags.Cell.IS_IN_LOOP);

            for (dir = 0; dir < 8; dir++) {
                const newX = x + GW.utils.CLOCK_DIRS[dir][0];
                const newY = y + GW.utils.CLOCK_DIRS[dir][1];
                if (site.hasXY(newX, newY)) {
                    this._checkCell(site, newX, newY);
                }
            }
        }
    }

    _fillInnerLoopGrid(site: SITE.BuildSite, innerGrid: GW.grid.NumGrid) {
        for (let x = 0; x < site.width; ++x) {
            for (let y = 0; y < site.height; ++y) {
                if (site.hasCellFlag(x, y, GW.map.flags.Cell.IS_IN_LOOP)) {
                    innerGrid[x][y] = 1;
                } else if (x > 0 && y > 0) {
                    const up = site.hasCellFlag(
                        x,
                        y - 1,
                        GW.map.flags.Cell.IS_IN_LOOP
                    );
                    const left = site.hasCellFlag(
                        x - 1,
                        y,
                        GW.map.flags.Cell.IS_IN_LOOP
                    );
                    if (up && left) {
                        innerGrid[x][y] = 1;
                    }
                }
            }
        }
    }

    _update(site: SITE.BuildSite) {
        // remove extraneous loop markings
        const innerLoop = GW.grid.alloc(site.width, site.height);
        this._fillInnerLoopGrid(site, innerLoop);

        // const xy = { x: 0, y: 0 };
        let designationSurvives;

        for (let i = 0; i < site.width; i++) {
            for (let j = 0; j < site.height; j++) {
                if (site.hasCellFlag(i, j, GW.map.flags.Cell.IS_IN_LOOP)) {
                    designationSurvives = false;
                    for (let dir = 0; dir < 8; dir++) {
                        let newX = i + GW.utils.CLOCK_DIRS[dir][0];
                        let newY = j + GW.utils.CLOCK_DIRS[dir][1];

                        if (
                            site.hasXY(newX, newY) && // RUT.Map.makeValidXy(map, xy, newX, newY) &&
                            !innerLoop[newX][newY] &&
                            !site.hasCellFlag(
                                newX,
                                newY,
                                GW.map.flags.Cell.IS_IN_LOOP
                            )
                        ) {
                            designationSurvives = true;
                            break;
                        }
                    }
                    if (!designationSurvives) {
                        innerLoop[i][j] = 1;
                        site.clearCellFlag(i, j, GW.map.flags.Cell.IS_IN_LOOP);
                    }
                }
            }
        }
        GW.grid.free(innerLoop);
    }
}

////////////////////////////////////////////////////////
////////////////////////////////////////////////////////
