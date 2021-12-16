import * as GWU from 'gw-utils';
import * as SITE from './site';

export interface LakeOpts {
    height: number;
    width: number;
    minSize: number;
    tries: number;
    count: number;
    canDisrupt: boolean;
    wreathTile: number;
    wreathChance: number;
    wreathSize: number;
    tile: number;
}

export class Lakes {
    options: LakeOpts = {
        height: 15,
        width: 30,
        minSize: 5,
        tries: 20,
        count: 1,
        canDisrupt: false,
        wreathTile: SITE.SHALLOW,
        wreathChance: 50,
        wreathSize: 1,
        tile: SITE.DEEP,
    };

    constructor(options: Partial<LakeOpts> = {}) {
        Object.assign(this.options, options);
    }

    create(site: SITE.DigSite): number {
        let i, j, k;
        let x: number, y: number;
        let lakeMaxHeight,
            lakeMaxWidth,
            lakeMinSize,
            tries,
            maxCount,
            canDisrupt;
        let count = 0;

        lakeMaxHeight = this.options.height || 15; // TODO - Make this a range "5-15"
        lakeMaxWidth = this.options.width || 30; // TODO - Make this a range "5-30"
        lakeMinSize = this.options.minSize || 5;
        tries = this.options.tries || 20;
        maxCount = this.options.count || 1;
        canDisrupt = this.options.canDisrupt || false;
        const hasWreath = site.rng.chance(this.options.wreathChance)
            ? true
            : false;
        const wreathTile = this.options.wreathTile || SITE.SHALLOW;
        const wreathSize = this.options.wreathSize || 1; // TODO - make this a range "0-2" or a weighted choice { 0: 50, 1: 40, 2" 10 }
        const tile = this.options.tile || SITE.DEEP;

        const lakeGrid = GWU.grid.alloc(site.width, site.height, 0);

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

            const blob = new GWU.blob.Blob({
                rng: site.rng,
                rounds: 5,
                minWidth: 4,
                minHeight: 4,
                maxWidth: width,
                maxHeight: height,
                percentSeeded: 55,
                // birthParameters: 'ffffftttt',
                // survivalParameters: 'ffffttttt',
            });

            lakeGrid.fill(0);
            const bounds = blob.carve(
                lakeGrid.width,
                lakeGrid.height,
                (x, y) => (lakeGrid[x][y] = 1)
            );

            // console.log('LAKE ATTEMPT');
            // lakeGrid.dump();

            let success = false;
            for (k = 0; k < tries && !success; k++) {
                // placement attempts
                // propose a position for the top-left of the lakeGrid in the dungeon
                x = site.rng.range(
                    1 - bounds.x,
                    lakeGrid.width - bounds.width - bounds.x - 2
                );
                y = site.rng.range(
                    1 - bounds.y,
                    lakeGrid.height - bounds.height - bounds.y - 2
                );

                if (canDisrupt || !this.isDisruptedBy(site, lakeGrid, -x, -y)) {
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
                                site.setTile(sx, sy, tile);

                                if (hasWreath) {
                                    if (site.hasTile(sx, sy, wreathTile)) {
                                        site.clearCell(sx, sy, wreathTile);
                                    }
                                    GWU.xy.forCircle(
                                        sx,
                                        sy,
                                        wreathSize,
                                        (i2, j2) => {
                                            if (
                                                site.isPassable(i2, j2) &&
                                                !lakeGrid[i2 - x][j2 - y]
                                                // SITE.isFloor(map, i, j) ||
                                                // SITE.isDoor(map, i, j)
                                            ) {
                                                site.setTile(
                                                    i2,
                                                    j2,
                                                    wreathTile
                                                );
                                            }
                                        }
                                    );
                                }
                            }
                        }
                    }
                    break;
                }
            }

            if (success) {
                ++count;
                attempts = 0;
            } else {
                ++attempts;
            }
        }
        GWU.grid.free(lakeGrid);
        return count;
    }

    isDisruptedBy(
        site: SITE.DigSite,
        lakeGrid: GWU.grid.NumGrid,
        lakeToMapX = 0,
        lakeToMapY = 0
    ) {
        const walkableGrid = GWU.grid.alloc(site.width, site.height);
        let disrupts = false;

        // Get all walkable locations after lake added
        GWU.xy.forRect(site.width, site.height, (i, j) => {
            const lakeX = i + lakeToMapX;
            const lakeY = j + lakeToMapY;
            if (lakeGrid.get(lakeX, lakeY)) {
                if (site.isStairs(i, j)) {
                    disrupts = true;
                }
            } else if (site.isPassable(i, j)) {
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

        GWU.grid.free(walkableGrid);
        return disrupts;
    }
}
