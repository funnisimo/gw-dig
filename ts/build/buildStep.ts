import * as GW from 'gw-utils';
import * as DIG_UTILS from '../dig/utils';
import { BuildData } from './builder';
import { Blueprint, Flags } from './blueprint';
import { Spawner } from './spawn';

export interface StepOptions {
    tile: string | number;
    flags: GW.flag.FlagBase;
    pad: number;
    count: GW.range.RangeBase;
    item: any;
    horde: any;
    spawn: Partial<GW.effect.EffectConfig> | string;
}

const Fl = GW.flag.fl;

export enum StepFlags {
    // BF_GENERATE_ITEM				= Fl(0),	// feature entails generating an item (overridden if the machine is adopting an item)
    // BF_GENERATE_HORDE			= Fl(5),	// generate a monster horde that has all of the horde flags
    // BF_NO_THROWING_WEAPONS	    = Fl(4),	// the generated item cannot be a throwing weapon
    // BF_REQUIRE_GOOD_RUNIC		= Fl(18),	// generated item must be uncursed runic

    BF_OUTSOURCE_ITEM_TO_MACHINE = Fl(1), // item must be adopted by another machine
    BF_BUILD_VESTIBULE = Fl(2), // call this at the origin of a door room to create a new door guard machine there
    BF_ADOPT_ITEM = Fl(3), // this feature will take the adopted item (be it from another machine or a previous feature)
    BF_BUILD_AT_ORIGIN = Fl(6), // generate this feature at the room entrance

    // unused                   = Fl(7),	//
    BF_PERMIT_BLOCKING = Fl(8), // permit the feature to block the map's passability (e.g. to add a locked door)
    BF_TREAT_AS_BLOCKING = Fl(9), // treat this terrain as though it blocks, for purposes of deciding whether it can be placed there

    BF_NEAR_ORIGIN = Fl(10), // feature must spawn in the rough quarter of tiles closest to the origin
    BF_FAR_FROM_ORIGIN = Fl(11), // feature must spawn in the rough quarter of tiles farthest from the origin
    BF_IN_VIEW_OF_ORIGIN = Fl(25), // this feature must be in view of the origin
    BF_IN_PASSABLE_VIEW_OF_ORIGIN = Fl(26), // this feature must be in view of the origin, where "view" is blocked by pathing blockers

    BF_MONSTER_TAKE_ITEM = Fl(12), // the item associated with this feature (including if adopted) will be in possession of the horde leader that's generated
    BF_MONSTER_SLEEPING = Fl(13), // the monsters should be asleep when generated
    BF_MONSTER_FLEEING = Fl(14), // the monsters should be permanently fleeing when generated
    BF_MONSTERS_DORMANT = Fl(19), // monsters are dormant, and appear when a dungeon feature with DFF_ACTIVATE_DORMANT_MONSTER spawns on their tile

    BF_ITEM_IS_KEY = Fl(0),
    BF_ITEM_IDENTIFIED = Fl(5),
    BF_ITEM_PLAYER_AVOIDS = Fl(4),

    BF_EVERYWHERE = Fl(15), // generate the feature on every tile of the machine (e.g. carpeting)
    BF_ALTERNATIVE = Fl(16), // build only one feature that has this flag per machine; the rest are skipped
    BF_ALTERNATIVE_2 = Fl(17), // same as BF_ALTERNATIVE, but provides for a second set of alternatives of which only one will be chosen

    // unused                       = Fl(20),	//
    BF_BUILD_IN_WALLS = Fl(21), // build in an impassable tile that is adjacent to the interior
    BF_BUILD_ANYWHERE_ON_LEVEL = Fl(22), // build anywhere on the level that is not inside the machine
    BF_REPEAT_UNTIL_NO_PROGRESS = Fl(23), // keep trying to build this feature set until no changes are made
    BF_IMPREGNABLE = Fl(24), // this feature's location will be immune to tunneling
    BF_NOT_IN_HALLWAY = Fl(27), // the feature location must have a passableArcCount of <= 1
    BF_NOT_ON_LEVEL_PERIMETER = Fl(28), // don't build it in the outermost walls of the level

    BF_SKELETON_KEY = Fl(29), // if a key is generated or adopted by this feature, it will open all locks in this machine.
    BF_KEY_DISPOSABLE = Fl(30), // if a key is generated or adopted, it will self-destruct after being used at this current location.
}

export class BuildStep {
    public tile: number = 0;
    public flags: number = 0;
    public pad: number = 0;
    public count: GW.range.Range;
    public item: any | null = null;
    public horde: any | null = null;
    public spawn: GW.effect.EffectInfo | null = null;

    constructor(cfg: Partial<StepOptions> = {}) {
        if (cfg.tile) {
            if (typeof cfg.tile === 'string') {
                const t = GW.tile.tiles[cfg.tile];
                if (!t) {
                    throw new Error('Failed to find tile: ' + cfg.tile);
                }
                this.tile = t.index;
            } else {
                this.tile = cfg.tile;
            }
        }
        if (cfg.flags) {
            this.flags = GW.flag.from(StepFlags, cfg.flags);
        }
        if (cfg.pad) {
            this.pad = cfg.pad;
        }
        this.count = GW.range.make(cfg.count || 1);
        this.item = cfg.item || null;
        this.horde = cfg.horde || null;

        if (cfg.spawn) {
            this.spawn = GW.effect.from(cfg.spawn);
        }
    }

    cellIsCandidate(
        builder: BuildData,
        blueprint: Blueprint,
        x: number,
        y: number,
        distanceBound: [number, number]
    ) {
        const site = builder.site;

        // No building in the hallway if it's prohibited.
        // This check comes before the origin check, so an area machine will fail altogether
        // if its origin is in a hallway and the feature that must be built there does not permit as much.
        if (
            this.flags & StepFlags.BF_NOT_IN_HALLWAY &&
            GW.utils.arcCount(
                x,
                y,
                (i, j) => site.hasXY(i, j) && site.isPassable(i, j)
            ) > 1
        ) {
            return false;
        }

        // No building along the perimeter of the level if it's prohibited.
        if (
            this.flags & StepFlags.BF_NOT_ON_LEVEL_PERIMETER &&
            (x == 0 || x == site.width - 1 || y == 0 || y == site.height - 1)
        ) {
            return false;
        }

        // The origin is a candidate if the feature is flagged to be built at the origin.
        // If it's a room, the origin (i.e. doorway) is otherwise NOT a candidate.
        if (this.flags & StepFlags.BF_BUILD_AT_ORIGIN) {
            return x == builder.originX && y == builder.originY ? true : false;
        } else if (
            blueprint.isRoom &&
            x == builder.originX &&
            y == builder.originY
        ) {
            return false;
        }

        // No building in another feature's personal space!
        if (builder.occupied[x][y]) {
            return false;
        }

        // Must be in the viewmap if the appropriate flag is set.
        if (
            this.flags &
                (StepFlags.BF_IN_VIEW_OF_ORIGIN |
                    StepFlags.BF_IN_PASSABLE_VIEW_OF_ORIGIN) &&
            !builder.viewMap[x][y]
        ) {
            return false;
        }

        // Do a distance check if the feature requests it.
        let distance = 10000;
        if (site.isWall(x, y)) {
            // Distance is calculated for walls too.
            GW.utils.eachNeighbor(
                x,
                y,
                (i, j) => {
                    if (!builder.distanceMap.hasXY(i, j)) return;
                    if (
                        !site.blocksPathing(i, j) &&
                        distance > builder.distanceMap[i][j] + 1
                    ) {
                        distance = builder.distanceMap[i][j] + 1;
                    }
                },
                true
            );
        } else {
            distance = builder.distanceMap[x][y];
        }

        if (
            distance > distanceBound[1] || // distance exceeds max
            distance < distanceBound[0]
        ) {
            // distance falls short of min
            return false;
        }

        if (this.flags & StepFlags.BF_BUILD_IN_WALLS) {
            // If we're supposed to build in a wall...
            const cellMachine = site.getMachine(x, y);
            if (
                !builder.interior[x][y] &&
                (!cellMachine || cellMachine == builder.machineNumber) &&
                site.isWall(x, y)
            ) {
                let ok = false;
                // ...and this location is a wall that's not already machined...
                GW.utils.eachNeighbor(x, y, (newX, newY) => {
                    if (
                        site.hasXY(newX, newY) && // ...and it's next to an interior spot or permitted elsewhere and next to passable spot...
                        ((builder.interior[newX][newY] &&
                            !(
                                newX == builder.originX &&
                                newY == builder.originY
                            )) ||
                            (this.flags &
                                StepFlags.BF_BUILD_ANYWHERE_ON_LEVEL &&
                                !site.blocksPathing(newX, newY) &&
                                !site.getMachine(newX, newY)))
                    ) {
                        ok = true;
                    }
                });
                return ok;
            }
            return false;
        } else if (site.isWall(x, y)) {
            // Can't build in a wall unless instructed to do so.
            return false;
        } else if (this.flags & StepFlags.BF_BUILD_ANYWHERE_ON_LEVEL) {
            if (
                (this.item && site.blocksItems(x, y)) ||
                site.hasCellFlag(
                    x,
                    y,
                    GW.map.flags.Cell.IS_CHOKEPOINT |
                        GW.map.flags.Cell.IS_IN_LOOP |
                        GW.map.flags.Cell.IS_IN_MACHINE
                )
            ) {
                return false;
            } else {
                return true;
            }
        } else if (builder.interior[x][y]) {
            return true;
        }
        return false;
    }

    makePersonalSpace(
        builder: BuildData,
        x: number,
        y: number,
        candidates: GW.grid.NumGrid
    ) {
        const personalSpace = this.pad;
        let count = 0;

        for (let i = x - personalSpace + 1; i <= x + personalSpace - 1; i++) {
            for (
                let j = y - personalSpace + 1;
                j <= y + personalSpace - 1;
                j++
            ) {
                if (builder.site.hasXY(i, j)) {
                    if (candidates[i][j]) {
                        candidates[i][j] = 0;
                        ++count;
                    }
                    builder.occupied[i][j] = 1;
                }
            }
        }
        return count;
    }

    get generateEverywhere(): boolean {
        return !!(
            this.flags &
            StepFlags.BF_EVERYWHERE &
            ~StepFlags.BF_BUILD_AT_ORIGIN
        );
    }

    get buildAtOrigin(): boolean {
        return !!(this.flags & StepFlags.BF_BUILD_AT_ORIGIN);
    }

    distanceBound(builder: BuildData): [number, number] {
        const distanceBound: [number, number] = [0, 10000];
        if (this.flags & StepFlags.BF_NEAR_ORIGIN) {
            distanceBound[1] = builder.distance25;
        }
        if (this.flags & StepFlags.BF_FAR_FROM_ORIGIN) {
            distanceBound[0] = builder.distance75;
        }
        return distanceBound;
    }

    updateViewMap(builder: BuildData): void {
        if (
            this.flags &
            (StepFlags.BF_IN_VIEW_OF_ORIGIN |
                StepFlags.BF_IN_PASSABLE_VIEW_OF_ORIGIN)
        ) {
            const site = builder.site;
            if (this.flags & StepFlags.BF_IN_PASSABLE_VIEW_OF_ORIGIN) {
                const fov = new GW.fov.FOV({
                    isBlocked: (x, y) => {
                        return site.blocksPathing(x, y);
                    },
                    hasXY: (x, y) => {
                        return site.hasXY(x, y);
                    },
                });
                fov.calculate(builder.originX, builder.originY, 50, (x, y) => {
                    builder.viewMap[x][y] = 1;
                });
            } else {
                const fov = new GW.fov.FOV({
                    // TileFlags.T_OBSTRUCTS_PASSABILITY |
                    //     TileFlags.T_OBSTRUCTS_VISION,
                    isBlocked: (x, y) => {
                        return (
                            site.blocksPathing(x, y) || site.blocksVision(x, y)
                        );
                    },
                    hasXY: (x, y) => {
                        return site.hasXY(x, y);
                    },
                });
                fov.calculate(builder.originX, builder.originY, 50, (x, y) => {
                    builder.viewMap[x][y] = 1;
                });
            }
            builder.viewMap[builder.originX][builder.originY] = 1;
        }
    }

    markCandidates(
        candidates: GW.grid.NumGrid,
        builder: BuildData,
        blueprint: Blueprint,
        distanceBound: [number, number]
    ): number {
        let count = 0;
        candidates.update((_v, i, j) => {
            if (this.cellIsCandidate(builder, blueprint, i, j, distanceBound)) {
                count++;
                return 1;
            } else {
                return 0;
            }
        });
        return count;
    }

    build(builder: BuildData, blueprint: Blueprint) {
        let instanceCount = 0;
        let instance = 0;

        const site = builder.site;

        const candidates = GW.grid.alloc(site.width, site.height);

        // Figure out the distance bounds.
        const distanceBound = this.distanceBound(builder);
        this.updateViewMap(builder);

        do {
            // If the StepFlags.BF_REPEAT_UNTIL_NO_PROGRESS flag is set, repeat until we fail to build the required number of instances.

            // Make a master map of candidate locations for this feature.
            let qualifyingTileCount = this.markCandidates(
                candidates,
                builder,
                blueprint,
                distanceBound
            );

            if (!this.generateEverywhere) {
                instanceCount = this.count.value();
            }

            if (!qualifyingTileCount || qualifyingTileCount < this.count.lo) {
                console.warn(
                    'Only %s qualifying tiles - want at least %s.',
                    qualifyingTileCount,
                    this.count.lo
                );
                return 0; // ?? Failed ??
            }

            let x = 0,
                y = 0;

            for (
                instance = 0;
                (this.generateEverywhere || instance < instanceCount) &&
                qualifyingTileCount > 0;

            ) {
                // Find a location for the feature.
                if (this.buildAtOrigin) {
                    // Does the feature want to be at the origin? If so, put it there. (Just an optimization.)
                    x = builder.originX;
                    y = builder.originY;
                } else {
                    // Pick our candidate location randomly, and also strike it from
                    // the candidates map so that subsequent instances of this same feature can't choose it.
                    [x, y] = GW.random.matchingLoc(
                        candidates.width,
                        candidates.height,
                        (v) => v > 0
                    );
                }
                // Don't waste time trying the same place again whether or not this attempt succeeds.
                candidates[x][y] = 0;
                qualifyingTileCount--;

                let DFSucceeded = true;
                let terrainSucceeded = true;

                // Try to build the DF first, if any, since we don't want it to be disrupted by subsequently placed terrain.
                if (this.spawn) {
                    const spawner = new Spawner(this.spawn);
                    DFSucceeded = spawner.spawn(x, y, site) > 0;
                }

                // Now try to place the terrain tile, if any.
                if (DFSucceeded && this.tile) {
                    let tile: number = GW.tile.get(this.tile).index;

                    if (!tile) {
                        terrainSucceeded = false;
                        console.error('placing invalid tile', this.tile, x, y);
                    } else if (
                        !(this.flags & StepFlags.BF_PERMIT_BLOCKING) &&
                        (site.tileBlocksMove(tile) ||
                            this.flags & StepFlags.BF_TREAT_AS_BLOCKING)
                    ) {
                        // Yes, check for blocking.
                        const blockingMap = GW.grid.alloc(
                            site.width,
                            site.height
                        );
                        blockingMap[x][y] = 1;
                        terrainSucceeded = !DIG_UTILS.siteDisruptedBy(
                            site,
                            blockingMap
                        );
                        GW.grid.free(blockingMap);
                    }
                    if (terrainSucceeded) {
                        site.setTile(x, y, tile);
                    }
                }

                // OK, if placement was successful, clear some personal space around the feature so subsequent features can't be generated too close.
                // Personal space of 0 means nothing gets cleared, 1 means that only the tile itself gets cleared, and 2 means the 3x3 grid centered on it.

                if (DFSucceeded && terrainSucceeded) {
                    qualifyingTileCount -= this.makePersonalSpace(
                        builder,
                        x,
                        y,
                        candidates
                    );
                    instance++; // we've placed an instance
                    //DEBUG printf("\nPlaced instance #%i of feature %i at (%i, %i).", instance, feat, featX, featY);
                }

                if (DFSucceeded && terrainSucceeded) {
                    // Proceed only if the terrain stuff for this instance succeeded.

                    // Mark the feature location as part of the machine, in case it is not already inside of it.
                    if (!(blueprint.flags & Flags.BP_NO_INTERIOR_FLAG)) {
                        site.setMachine(
                            x,
                            y,
                            builder.machineNumber,
                            blueprint.isRoom
                        );
                    }

                    // Mark the feature location as impregnable if requested.
                    if (this.flags & StepFlags.BF_IMPREGNABLE) {
                        site.setCellFlag(x, y, GW.map.flags.Cell.IMPREGNABLE);
                    }

                    // let success = RUT.Component.generateAdoptItem(
                    //     component,
                    //     blueprint,
                    //     map,
                    //     xy.x,
                    //     xy.y,
                    //     context
                    // );
                    // if (!success) {
                    //     GW.grid.free(candidates);
                    //     return false;
                    // }

                    // // Generate a horde as necessary.
                    // success = RUT.Component.generateMonsters(
                    //     component,
                    //     blueprint,
                    //     map,
                    //     xy.x,
                    //     xy.y,
                    //     context
                    // );
                    // if (!success) {
                    //     GW.grid.free(candidates);
                    //     return false;
                    // }
                }

                // Finished with this instance!
            }
        } while (
            this.flags & StepFlags.BF_REPEAT_UNTIL_NO_PROGRESS &&
            instance <= this.count.lo
        );

        //DEBUG printf("\nFinished feature %i. Here's the candidates map:", feat);
        //DEBUG logBuffer(candidates);

        GW.grid.free(candidates);
        return instance;
    }
}
