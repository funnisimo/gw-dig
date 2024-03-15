import * as GWU from 'gw-utils/index';
import { Site, tileId } from '../site';
import { FeatureFn, FeatureConfig, installType, makeArray } from './feature';

const Fl = GWU.flag.fl;

///////////////////////////////////////////////////////
// TILE EVENT

export enum Flags {
    // E_ALWAYS_FIRE = Fl(10), // Fire even if the cell is marked as having fired this turn
    // E_NEXT_ALWAYS = Fl(0), // Always fire the next effect, even if no tiles changed.
    // E_NEXT_EVERYWHERE = Fl(1), // next effect spawns in every cell that this effect spawns in, instead of only the origin

    // E_FIRED = Fl(2), // has already been fired once

    // E_NO_MARK_FIRED = Fl(3), // Do not mark this cell as having fired an effect (so can log messages multiple times)
    // MUST_REPLACE_LAYER
    // NEEDS_EMPTY_LAYER
    // E_PROTECTED = Fl(4),

    // E_NO_REDRAW_CELL = Fl(),
    E_TREAT_AS_BLOCKING = Fl(5), // If filling the footprint of this effect with walls would disrupt level connectivity, then abort.
    E_PERMIT_BLOCKING = Fl(6), // Generate this effect without regard to level connectivity.
    E_ABORT_IF_BLOCKS_MAP = Fl(7),
    E_BLOCKED_BY_ITEMS = Fl(8), // Do not fire this effect in a cell that has an item.
    E_BLOCKED_BY_ACTORS = Fl(9), // Do not fire this effect in a cell that has an item.
    E_BLOCKED_BY_OTHER_LAYERS = Fl(10), // Will not propagate into a cell if any layer in that cell has a superior priority.
    E_SUPERPRIORITY = Fl(11), // Will overwrite terrain of a superior priority.

    E_IGNORE_FOV = Fl(12),

    // E_SPREAD_CIRCLE = Fl(13), // Spread in a circle around the spot (using FOV), radius calculated using spread+decrement
    // E_SPREAD_LINE = Fl(14), // Spread in a line in one random direction

    E_EVACUATE_CREATURES = Fl(15), // Creatures in the effect area get moved outside of it
    E_EVACUATE_ITEMS = Fl(16), // Creatures in the effect area get moved outside of it

    E_BUILD_IN_WALLS = Fl(17),
    E_MUST_TOUCH_WALLS = Fl(18),
    E_NO_TOUCH_WALLS = Fl(19),

    E_CLEAR_GROUND = Fl(21), // clear all existing tiles
    E_CLEAR_SURFACE = Fl(22),
    E_CLEAR_LIQUID = Fl(23),
    E_CLEAR_GAS = Fl(24),

    E_CLEAR_TILE = Fl(25), // Clear this tile

    E_CLEAR_CELL = E_CLEAR_GROUND |
        E_CLEAR_SURFACE |
        E_CLEAR_LIQUID |
        E_CLEAR_GAS,

    E_ONLY_IF_EMPTY = E_BLOCKED_BY_ITEMS | E_BLOCKED_BY_ACTORS,
    // E_NULLIFY_CELL = E_NULL_SURFACE | E_NULL_LIQUID | E_NULL_GAS,

    // These should be effect types
    // E_ACTIVATE_DORMANT_MONSTER = Fl(27), // Dormant monsters on this tile will appear -- e.g. when a statue bursts to reveal a monster.
    // E_AGGRAVATES_MONSTERS = Fl(28), // Will act as though an aggravate monster scroll of effectRadius radius had been read at that point.
    // E_RESURRECT_ALLY = Fl(29), // Will bring back to life your most recently deceased ally.
}

export interface SpreadInfo {
    grow: number;
    decrement: number;
    matchTile: string;
    features: FeatureFn[];
    flags: number;
}

export interface SpreadConfig
    extends Partial<Omit<SpreadInfo, 'flags' | 'features'>> {
    features?: FeatureConfig;
    flags?: GWU.flag.FlagBase;
}

export interface SpreadFn extends FeatureFn {
    config: SpreadInfo;
}

export type SpreadArgs = [number, number, FeatureConfig, SpreadConfig?];

export function spread(config: SpreadArgs | SpreadConfig): SpreadFn;
export function spread(
    grow: number,
    decrement: number,
    action: FeatureConfig,
    opts?: SpreadConfig
): SpreadFn;
export function spread(...args: any[]): SpreadFn {
    let config = {} as SpreadInfo;
    if (!args.length) {
        throw new Error('Must have config to create spread.');
    }
    if (args.length === 1) {
        if (typeof args[0] === 'string') {
            args = args[0].split(':').map((t) => t.trim());
        } else if (Array.isArray(args[0])) {
            args = args[0];
        } else {
            Object.assign(config, args[0]);
            args = [config];
        }
    }
    if (args.length >= 3) {
        Object.assign(config, args[3] || {});
        config.grow = Number.parseInt(args[0]);
        config.decrement = Number.parseInt(args[1]);
        config.features = args[2];
    } else if (args.length === 2) {
        throw new Error('Must have actions to run for spread.');
    }

    if (typeof config.grow !== 'number')
        config.grow = Number.parseInt(config.grow || 0);
    if (typeof config.decrement !== 'number')
        config.decrement = Number.parseInt(config.decrement || 100);
    config.flags = GWU.flag.from(Flags, config.flags || 0);
    config.matchTile = config.matchTile || '';

    if (
        typeof config.features === 'string' &&
        // @ts-ignore
        config.features.indexOf(':') < 0
    ) {
        if (tileId(config.features) >= 0) {
            // @ts-ignore
            config.features = 'TILE:' + config.features;
        }
    }

    const action = makeArray(config.features);
    if (!action) throw new Error('Failed to make action for spread.');
    config.features = action;

    const fn = spreadFeature.bind(undefined, config) as SpreadFn;
    fn.config = config;
    return fn;
}

installType('spread', spread);

export function spreadFeature(
    cfg: SpreadInfo,
    site: Site,
    x: number,
    y: number
): boolean {
    const abortIfBlocking = !!(cfg.flags & Flags.E_ABORT_IF_BLOCKS_MAP);

    const map = site;
    let didSomething = false;

    const spawnMap = GWU.grid.alloc(map.width, map.height);

    if (!computeSpawnMap(cfg, spawnMap, site, x, y)) {
        GWU.grid.free(spawnMap);
        return false;
    }

    if (abortIfBlocking && mapDisruptedBy(map, spawnMap)) {
        GWU.grid.free(spawnMap);
        return false;
    }

    if (cfg.flags & Flags.E_EVACUATE_CREATURES) {
        // first, evacuate creatures, so that they do not re-trigger the tile.
        if (evacuateCreatures(map, spawnMap)) {
            didSomething = true;
        }
    }

    if (cfg.flags & Flags.E_EVACUATE_ITEMS) {
        // first, evacuate items, so that they do not re-trigger the tile.
        if (evacuateItems(map, spawnMap)) {
            didSomething = true;
        }
    }

    if (cfg.flags & Flags.E_CLEAR_CELL) {
        // first, clear other tiles (not base/ground)
        if (clearCells(map, spawnMap, cfg.flags)) {
            didSomething = true;
        }
    }

    spawnMap.update((v) => {
        if (!v) return 0;
        return 1;
    });

    cfg.features.forEach((fn, i) => {
        spawnMap.forEach((v, x, y) => {
            if (v !== i + 1) return;

            if (fn(site, x, y)) {
                didSomething = true;
                spawnMap.increment(x, y);
            }
        });
    });

    if (didSomething) {
        didSomething = true;
    }
    GWU.grid.free(spawnMap);
    return didSomething;
}

export function mapDisruptedBy(
    map: Site,
    blockingGrid: GWU.grid.NumGrid,
    blockingToMapX = 0,
    blockingToMapY = 0
) {
    const walkableGrid = GWU.grid.alloc(map.width, map.height);
    let disrupts = false;

    // Get all walkable locations after lake added
    GWU.xy.forRect(map.width, map.height, (i, j) => {
        const lakeX = i + blockingToMapX;
        const lakeY = j + blockingToMapY;
        if (blockingGrid.get(lakeX, lakeY)) {
            if (map.isStairs(i, j)) {
                disrupts = true;
            }
        } else if (!map.blocksMove(i, j)) {
            walkableGrid.set(i, j, 1);
        }
    });

    let first = true;
    for (let i = 0; i < walkableGrid.width && !disrupts; ++i) {
        for (let j = 0; j < walkableGrid.height && !disrupts; ++j) {
            if (walkableGrid.get(i, j) == 1) {
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
    // walkableGWU.grid.dump();

    GWU.grid.free(walkableGrid);
    return disrupts;
}

// Spread

function cellIsOk(
    effect: SpreadInfo,
    map: Site,
    x: number,
    y: number,
    isStart: boolean
) {
    if (!map.hasXY(x, y)) return false;
    if (map.isProtected(x, y)) return false;

    if (map.blocksEffects(x, y) && !effect.matchTile && !isStart) {
        return false;
    }

    if (effect.flags & Flags.E_BUILD_IN_WALLS) {
        if (!map.isWall(x, y)) return false;
    } else if (effect.flags & Flags.E_MUST_TOUCH_WALLS) {
        let ok = false;
        GWU.xy.eachNeighbor(
            x,
            y,
            (i, j) => {
                if (map.isWall(i, j)) {
                    ok = true;
                }
            },
            true
        );
        if (!ok) return false;
    } else if (effect.flags & Flags.E_NO_TOUCH_WALLS) {
        let ok = true;
        if (map.isWall(x, y)) return false; // or on wall
        GWU.xy.eachNeighbor(
            x,
            y,
            (i, j) => {
                if (map.isWall(i, j)) {
                    ok = false;
                }
            },
            true
        );
        if (!ok) return false;
    }

    // if (ctx.bounds && !ctx.bounds.containsXY(x, y)) return false;
    if (effect.matchTile && !isStart && !map.hasTile(x, y, effect.matchTile)) {
        return false;
    }

    return true;
}

export function computeSpawnMap(
    effect: SpreadInfo,
    spawnMap: GWU.grid.NumGrid,
    site: Site,
    x: number,
    y: number
) {
    let i, j, dir, t, x2, y2;
    let madeChange;

    // const bounds = ctx.bounds || null;
    // if (bounds) {
    //   // Activation.debug('- bounds', bounds);
    // }

    const map = site;
    let startProb = effect.grow || 0;
    let probDec = effect.decrement || 0;

    spawnMap.fill(0);

    if (!cellIsOk(effect, map, x, y, true)) {
        return false;
    }

    spawnMap.set(x, y, 1);
    t = 1; // incremented before anything else happens
    let count = 1;

    if (startProb) {
        madeChange = true;
        if (startProb >= 100) {
            probDec = probDec || 100;
        }

        if (probDec <= 0) {
            probDec = startProb;
        }
        while (madeChange && startProb > 0) {
            madeChange = false;
            t++;
            for (i = 0; i < map.width; i++) {
                for (j = 0; j < map.height; j++) {
                    if (spawnMap.get(i, j) == t - 1) {
                        for (dir = 0; dir < 4; dir++) {
                            x2 = i + GWU.xy.DIRS[dir][0];
                            y2 = j + GWU.xy.DIRS[dir][1];
                            if (
                                spawnMap.hasXY(x2, y2) &&
                                !spawnMap.get(x2, y2) &&
                                map.rng.chance(startProb) &&
                                cellIsOk(effect, map, x2, y2, false)
                            ) {
                                spawnMap.set(x2, y2, t);
                                madeChange = true;
                                ++count;
                            }
                        }
                    }
                }
            }
            startProb -= probDec;
        }
    }

    return count > 0;
}

export function clearCells(map: Site, spawnMap: GWU.grid.NumGrid, _flags = 0) {
    let didSomething = false;
    // const clearAll = (flags & Flags.E_CLEAR_CELL) === Flags.E_CLEAR_CELL;
    spawnMap.forEach((v, i, j) => {
        if (!v) return;

        // if (clearAll) {
        map.clearTile(i, j);
        // } else {
        //     if (flags & Flags.E_CLEAR_GAS) {
        //         cell.clearDepth(Flags.Depth.GAS);
        //     }
        //     if (flags & Flags.E_CLEAR_LIQUID) {
        //         cell.clearDepth(Flags.Depth.LIQUID);
        //     }
        //     if (flags & Flags.E_CLEAR_SURFACE) {
        //         cell.clearDepth(Flags.Depth.SURFACE);
        //     }
        //     if (flags & Flags.E_CLEAR_GROUND) {
        //         cell.clearDepth(Flags.Depth.GROUND);
        //     }
        // }
        didSomething = true;
    });
    return didSomething;
}

export function evacuateCreatures(map: Site, blockingMap: GWU.grid.NumGrid) {
    let didSomething = false;
    map.eachActor((a) => {
        if (!blockingMap.get(a.x, a.y)) return;
        const loc = map.rng.matchingLocNear(a.x, a.y, (x, y) => {
            if (!map.hasXY(x, y)) return false;
            if (blockingMap.get(x, y)) return false;
            return !map.forbidsActor(x, y, a);
        });
        if (loc && loc[0] >= 0 && loc[1] >= 0) {
            a.y = loc[0];
            a.y = loc[1];
            // map.redrawXY(loc[0], loc[1]);
            didSomething = true;
        }
    });
    return didSomething;
}

export function evacuateItems(map: Site, blockingMap: GWU.grid.NumGrid) {
    let didSomething = false;
    map.eachItem((i) => {
        if (!blockingMap.get(i.x, i.y)) return;
        const loc = map.rng.matchingLocNear(i.x, i.y, (x, y) => {
            if (!map.hasXY(x, y)) return false;
            if (blockingMap.get(x, y)) return false;
            return !map.forbidsItem(x, y, i);
        });
        if (loc && loc[0] >= 0 && loc[1] >= 0) {
            i.x = loc[0];
            i.y = loc[1];
            // map.redrawXY(loc[0], loc[1]);
            didSomething = true;
        }
    });
    return didSomething;
}
