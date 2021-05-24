import * as GW from 'gw-utils';
import * as SITE from './site';
import { DigFn } from './types';

export interface LakeOpts {
    height: number;
    width: number;
    minSize: number;
    tries: number;
    count: number;
    canDisrupt: boolean;
    wreath: number;
    wreathTile: number;
    tile: number;
}

class Lakes {
    public width: number;
    public height: number;
    public disruptsFn: GW.utils.XYMatchFunc;
    public passableFn: GW.utils.XYMatchFunc;

    constructor(
        width: number,
        height: number,
        disruptsFn: GW.utils.XYMatchFunc,
        passableFn: GW.utils.XYMatchFunc
    ) {
        this.width = width;
        this.height = height;
        this.disruptsFn = disruptsFn;
        this.passableFn = passableFn;
    }

    create(setFn: DigFn, opts: Partial<LakeOpts> = {}): number {
        let i, j, k;
        let x, y;
        let lakeMaxHeight,
            lakeMaxWidth,
            lakeMinSize,
            tries,
            maxCount,
            canDisrupt;
        let count = 0;

        lakeMaxHeight = opts.height || 15; // TODO - Make this a range "5-15"
        lakeMaxWidth = opts.width || 30; // TODO - Make this a range "5-30"
        lakeMinSize = opts.minSize || 5;
        tries = opts.tries || 20;
        maxCount = opts.count || 1;
        canDisrupt = opts.canDisrupt || false;
        const wreath = opts.wreath || 0; // TODO - make this a range "0-2" or a weighted choice { 0: 50, 1: 40, 2" 10 }
        const wreathTile = opts.wreathTile || SITE.SHALLOW;
        const tile = opts.tile || SITE.DEEP;

        const lakeGrid = GW.grid.alloc(this.width, this.height, 0);

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

                if (canDisrupt || !this.isDisruptedBy(lakeGrid, -x, -y)) {
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
                                setFn(sx, sy, tile);

                                if (wreath) {
                                    GW.utils.forCircle(
                                        sx,
                                        sy,
                                        wreath,
                                        (i, j) => {
                                            if (
                                                this.passableFn(i, j)
                                                // SITE.isFloor(map, i, j) ||
                                                // SITE.isDoor(map, i, j)
                                            ) {
                                                setFn(i, j, wreathTile);
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
            } else {
                ++attempts;
            }
        }
        GW.grid.free(lakeGrid);
        return count;
    }

    isDisruptedBy(lakeGrid: GW.grid.NumGrid, lakeToMapX = 0, lakeToMapY = 0) {
        const walkableGrid = GW.grid.alloc(this.width, this.height);
        let disrupts = false;

        // Get all walkable locations after lake added
        GW.utils.forRect(this.width, this.height, (i, j) => {
            const lakeX = i + lakeToMapX;
            const lakeY = j + lakeToMapY;
            if (lakeGrid.get(lakeX, lakeY)) {
                if (this.disruptsFn(i, j)) {
                    disrupts = true;
                }
            } else if (this.passableFn(i, j)) {
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
}

export function digLakes(map: GW.grid.NumGrid, opts: any = {}) {
    const digger = new Lakes(
        map.width,
        map.height,
        SITE.isStairs.bind(SITE, map),
        SITE.isPassable.bind(SITE, map)
    );
    return digger.create(SITE.setGrid.bind(SITE, map), opts);
}
