import * as GW from 'gw-utils';
import * as SITE from './site';
import * as DIG_UTILS from '../dig/utils';

export type SpawnConfig = GW.map.SpawnConfig;
// {
//     tile: number | string;
//     grow: number;
//     decrement: number;
//     matchTile: number | string;
//     flags: GW.flag.FlagBase;
//     volume: number;
//     next: string;
// }

export type SpawnInfo = GW.map.SpawnInfo;
// {
//     tile: number;
//     grow: number;
//     decrement: number;
//     matchTile: number;
//     flags: number;
//     volume: number;
//     next: string | null;
// }

// export class SpawnEffect implements GW.effect.EffectHandler {
//     make(
//         src: Partial<GW.effect.EffectConfig>,
//         dest: GW.effect.EffectInfo
//     ): boolean {
//         if (!src.tile) return true; // no error

//         let config = src.tile;
//         if (typeof config === 'string') {
//             const parts = config.split(/[,|]/).map((p) => p.trim());
//             config = {
//                 tile: parts[0],
//                 grow: Number.parseInt(parts[1]),
//                 decrement: Number.parseInt(parts[2]),
//             };
//         } else if (typeof config === 'number') {
//             config = { tile: config };
//         }

//         const info: SpawnInfo = {
//             tile: 0,
//             grow: config.grow || 100,
//             decrement: config.decrement || 0,
//             matchTile: 0,
//             flags: GW.flag.from(GW.effect.Flags, config.flags),
//             volume: config.volume || 0,
//             next: config.next || null,
//         };

//         if (typeof config.tile === 'string') {
//             const obj = MAP.tile.tiles[config.tile];
//             if (!obj) {
//                 throw new Error(
//                     'Failed to find tile with name: ' + config.tile
//                 );
//             }
//             info.tile = obj.index;
//         } else {
//             info.tile = config.tile || 0;
//         }

//         if (!info.tile) {
//             throw new Error('Must have tile.');
//         }

//         if (typeof config.matchTile === 'string') {
//             const obj = MAP.tile.tiles[config.matchTile];
//             if (!obj) {
//                 throw new Error(
//                     'Failed to find tile with name: ' + config.tile
//                 );
//             }
//             info.matchTile = obj.index;
//         } else {
//             info.matchTile = config.matchTile || 0;
//         }

//         dest.tile = info;
//         return true;
//     }

//     async fire(
//         config: any,
//         map: GW.types.MapType,
//         x: number,
//         y: number,
//         ctx: Partial<GW.effect.EffectCtx>
//     ): Promise<boolean> {
//         if (!config.tile) return false; // did nothing

//         const spawner = new Spawner(config.tile);

//         const locs = GW.grid.alloc(site.width, site.height);
//         const count = spawner.fill(x, y, site, locs);
//         if (spawner.abortIfBlocks) {
//             if (DIG_UTILS.siteDisruptedBy(site, locs)) {
//                 return false;
//             }
//         }

//         spawner.spawnTiles(site, locs);

//         GW.grid.free(locs);

//         return count > 0;
//     }
// }

export function spawn(
    effect: GW.effect.EffectInfo,
    x: number,
    y: number,
    site: SITE.BuildSite
): boolean {
    const spawner = new Spawner(effect);

    const locs = GW.grid.alloc(site.width, site.height);
    const count = spawner.fill(x, y, site, locs);
    if (!count) {
        GW.grid.free(locs);
        return false;
    }

    if (spawner.abortIfBlocks) {
        if (DIG_UTILS.siteDisruptedBy(site, locs)) {
            GW.grid.free(locs);
            return false;
        }
    }

    const didSomething = spawner.spawnTiles(site, locs);
    GW.grid.free(locs);
    return didSomething;
}

export class Spawner {
    public info: GW.effect.EffectInfo;

    constructor(info: GW.effect.EffectInfo) {
        this.info = info;

        if (!info.tile) throw new Error('Invalid effect - requires "tile".');

        // if (this.growProb >= 100) {
        //     this.probDecrement = this.probDecrement || 100;

        //     if (this.probDecrement <= 0) {
        //         this.probDecrement = growProb;
        //     }
        // }
    }

    get abortIfBlocks() {
        return !!(this.info.flags & GW.effect.Flags.E_ABORT_IF_BLOCKS_MAP);
    }

    spawn(x: number, y: number, site: SITE.BuildSite) {
        const locs = GW.grid.alloc(site.width, site.height);
        const count = this.fill(x, y, site, locs);
        if (this.abortIfBlocks) {
            if (DIG_UTILS.siteDisruptedBy(site, locs)) {
                return false;
            }
        }

        this.spawnTiles(site, locs);

        GW.grid.free(locs);
        return count;
    }

    compute(x: number, y: number, cb: GW.utils.XYMatchFunc) {
        const config: SpawnConfig = this.info.tile;
        let growProb = config.grow;
        let probDec = config.decrement;

        if (!cb(x, y)) {
            return 0;
        }

        let todo: [number, number][] = [
            [x + 1, y],
            [x - 1, y],
            [x, y + 1],
            [x, y - 1],
        ];
        let working: [number, number][] = [];
        const done = new Set([`${x},${y}`]);

        let count = 1;

        while (todo.length && growProb > 0) {
            [working, todo] = [todo, working];

            while (working.length) {
                let [i, j] = working.pop()!;
                if (GW.random.chance(growProb) && cb(i, j)) {
                    count++;
                    GW.utils.eachNeighbor(
                        i,
                        j,
                        (i2, j2) => {
                            const index = i2 + ',' + j2;
                            if (done.has(index)) return;
                            done.add(index);
                            todo.push([i2, j2]);
                        },
                        true
                    );
                }
            }

            growProb -= probDec;
        }

        return count;
    }

    fill(x: number, y: number, site: SITE.BuildSite, grid: GW.grid.NumGrid) {
        return this.compute(x, y, (i, j) => {
            if (!this.cellIsOk(site, i, j, i == x && j == y)) return false;
            grid[i][j] = 1;
            return true;
        });
    }

    cellIsOk(site: SITE.BuildSite, x: number, y: number, isStart: boolean) {
        if (!site.hasXY(x, y)) return false;

        if (site.blocksEffects(x, y) && !this.info.tile.matchTile && !isStart) {
            return false;
        }

        if (this.info.flags & GW.effect.Flags.E_BUILD_IN_WALLS) {
            if (!site.isWall(x, y)) return false;
        } else if (this.info.flags & GW.effect.Flags.E_MUST_TOUCH_WALLS) {
            let ok = false;
            GW.utils.eachNeighbor(
                x,
                y,
                (i, j) => {
                    if (site.isWall(i, j)) {
                        ok = true;
                    }
                },
                true
            );
            if (!ok) return false;
        } else if (this.info.flags & GW.effect.Flags.E_NO_TOUCH_WALLS) {
            let ok = true;
            if (site.isWall(x, y)) return false; // or on wall
            GW.utils.eachNeighbor(
                x,
                y,
                (i, j) => {
                    if (site.isWall(i, j)) {
                        ok = false;
                    }
                },
                true
            );
            if (!ok) return false;
        }

        if (
            this.info.tile.matchTile &&
            !isStart &&
            !site.hasTile(x, y, this.info.tile.matchTile)
        ) {
            return false;
        }

        return true;
    }

    spawnTiles(site: SITE.BuildSite, locs: GW.grid.NumGrid) {
        let didSomething = false;
        const options = {
            superpriority: !!(
                this.info.flags & GW.effect.Flags.E_SUPERPRIORITY
            ),
            blockedByOtherLayers: !!(
                this.info.flags & GW.effect.Flags.E_BLOCKED_BY_OTHER_LAYERS
            ),
            blockedByActors: !!(
                this.info.flags & GW.effect.Flags.E_BLOCKED_BY_ACTORS
            ),
            blockedByItems: !!(
                this.info.flags & GW.effect.Flags.E_BLOCKED_BY_ITEMS
            ),
            volume: this.info.tile.volume,
        };

        locs.forEach((v, i, j) => {
            if (v) {
                locs[i][j] = 0;

                if (site.placeTile(i, j, this.info.tile, options)) {
                    locs[i][j] = 1;
                    didSomething = true;
                }
            }
        });
        return didSomething;
    }
}
