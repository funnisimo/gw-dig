import * as GWU from 'gw-utils';
import * as GWM from 'gw-map';

import * as SITE from '../site';
import { Builder } from './builder';
import { Blueprint, Flags } from './blueprint';

export interface StepOptions {
    tile: string | number;
    flags: GWU.flag.FlagBase;
    pad: number;
    count: GWU.range.RangeBase;
    item: string | Partial<GWM.item.MatchOptions>;
    horde: any;
    effect: Partial<GWM.effect.EffectConfig>;
}

const Fl = GWU.flag.fl;

export enum StepFlags {
    BF_OUTSOURCE_ITEM_TO_MACHINE = Fl(1), // item must be adopted by another machine
    BF_BUILD_VESTIBULE = Fl(2), // call this at the origin of a door room to create a new door guard machine there
    BF_ADOPT_ITEM = Fl(3), // this feature will take the adopted item (be it from another machine or a previous feature)
    BF_BUILD_AT_ORIGIN = Fl(4), // generate this feature at the room entrance

    BF_PERMIT_BLOCKING = Fl(5), // permit the feature to block the map's passability (e.g. to add a locked door)
    BF_TREAT_AS_BLOCKING = Fl(6), // treat this terrain as though it blocks, for purposes of deciding whether it can be placed there

    BF_NEAR_ORIGIN = Fl(7), // feature must spawn in the rough quarter of tiles closest to the origin
    BF_FAR_FROM_ORIGIN = Fl(8), // feature must spawn in the rough quarter of tiles farthest from the origin
    BF_IN_VIEW_OF_ORIGIN = Fl(9), // this feature must be in view of the origin
    BF_IN_PASSABLE_VIEW_OF_ORIGIN = Fl(10), // this feature must be in view of the origin, where "view" is blocked by pathing blockers

    BF_MONSTER_TAKE_ITEM = Fl(11), // the item associated with this feature (including if adopted) will be in possession of the horde leader that's generated
    BF_MONSTER_SLEEPING = Fl(12), // the monsters should be asleep when generated
    BF_MONSTER_FLEEING = Fl(13), // the monsters should be permanently fleeing when generated
    BF_MONSTERS_DORMANT = Fl(14), // monsters are dormant, and appear when a dungeon feature with DFF_ACTIVATE_DORMANT_MONSTER spawns on their tile

    BF_ITEM_IS_KEY = Fl(15),
    BF_ITEM_IDENTIFIED = Fl(16),
    BF_ITEM_PLAYER_AVOIDS = Fl(17),

    BF_EVERYWHERE = Fl(18), // generate the feature on every tile of the machine (e.g. carpeting)
    BF_ALTERNATIVE = Fl(19), // build only one feature that has this flag per machine; the rest are skipped
    BF_ALTERNATIVE_2 = Fl(20), // same as BF_ALTERNATIVE, but provides for a second set of alternatives of which only one will be chosen

    BF_BUILD_IN_WALLS = Fl(21), // build in an impassable tile that is adjacent to the interior
    BF_BUILD_ANYWHERE_ON_LEVEL = Fl(22), // build anywhere on the level that is not inside the machine
    BF_REPEAT_UNTIL_NO_PROGRESS = Fl(23), // keep trying to build this feature set until no changes are made
    BF_IMPREGNABLE = Fl(24), // this feature's location will be immune to tunneling

    // TODO - BF_ALLOW_IN_HALLWAY instead?
    BF_NOT_IN_HALLWAY = Fl(27), // the feature location must have a passableArcCount of <= 1

    // TODO - BF_ALLOW_BOUNDARY instead
    BF_NOT_ON_LEVEL_PERIMETER = Fl(28), // don't build it in the outermost walls of the level

    BF_SKELETON_KEY = Fl(29), // if a key is generated or adopted by this feature, it will open all locks in this machine.
    BF_KEY_DISPOSABLE = Fl(30), // if a key is generated or adopted, it will self-destruct after being used at this current location.
}

export class BuildStep {
    public tile: string | number = -1;
    public flags: number = 0;
    public pad: number = 0;
    public count: GWU.range.Range;
    public item: string | Partial<GWM.item.MatchOptions> | null = null;
    public horde: any | null = null;
    public effect: GWM.effect.EffectInfo | null = null;
    public chance = 0;
    public next: null;
    public id = 'n/a';

    constructor(cfg: Partial<StepOptions> = {}) {
        this.tile = cfg.tile ?? -1;
        if (cfg.flags) {
            this.flags = GWU.flag.from(StepFlags, cfg.flags);
        }
        if (cfg.pad) {
            this.pad = cfg.pad;
        }
        this.count = GWU.range.make(cfg.count || 1);
        this.item = cfg.item || null;
        this.horde = cfg.horde || null;

        if (cfg.effect) {
            this.effect = GWM.effect.from(cfg.effect);
        }

        if (this.item && this.flags & StepFlags.BF_ADOPT_ITEM) {
            throw new Error(
                'Cannot have blueprint step with item and BF_ADOPT_ITEM.'
            );
        }
    }

    get repeatUntilNoProgress(): boolean {
        return !!(this.flags & StepFlags.BF_REPEAT_UNTIL_NO_PROGRESS);
    }

    cellIsCandidate(
        builder: Builder,
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
            GWU.utils.arcCount(
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
            GWU.utils.eachNeighbor(
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
                GWU.utils.eachNeighbor(x, y, (newX, newY) => {
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
                    GWM.flags.Cell.IS_CHOKEPOINT |
                        GWM.flags.Cell.IS_IN_LOOP |
                        GWM.flags.Cell.IS_IN_MACHINE
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
        builder: Builder,
        x: number,
        y: number,
        candidates: GWU.grid.NumGrid
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

    distanceBound(builder: Builder): [number, number] {
        const distanceBound: [number, number] = [0, 10000];
        if (this.flags & StepFlags.BF_NEAR_ORIGIN) {
            distanceBound[1] = builder.distance25;
        }
        if (this.flags & StepFlags.BF_FAR_FROM_ORIGIN) {
            distanceBound[0] = builder.distance75;
        }
        return distanceBound;
    }

    updateViewMap(builder: Builder): void {
        if (
            this.flags &
            (StepFlags.BF_IN_VIEW_OF_ORIGIN |
                StepFlags.BF_IN_PASSABLE_VIEW_OF_ORIGIN)
        ) {
            const site = builder.site;
            if (this.flags & StepFlags.BF_IN_PASSABLE_VIEW_OF_ORIGIN) {
                const fov = new GWU.fov.FOV({
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
                const fov = new GWU.fov.FOV({
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
        candidates: GWU.grid.NumGrid,
        builder: Builder,
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

    build(builder: Builder, blueprint: Blueprint): boolean {
        let wantCount = 0;
        let builtCount = 0;

        const site = builder.site;

        const candidates = GWU.grid.alloc(site.width, site.height);

        // Figure out the distance bounds.
        const distanceBound = this.distanceBound(builder);
        this.updateViewMap(builder);

        // If the StepFlags.BF_REPEAT_UNTIL_NO_PROGRESS flag is set, repeat until we fail to build the required number of instances.

        // Make a master map of candidate locations for this feature.
        let qualifyingTileCount = this.markCandidates(
            candidates,
            builder,
            blueprint,
            distanceBound
        );

        if (!this.generateEverywhere) {
            wantCount = this.count.value();
        }

        if (!qualifyingTileCount || qualifyingTileCount < this.count.lo) {
            console.warn(
                'Only %s qualifying tiles - want at least %s.',
                qualifyingTileCount,
                this.count.lo
            );
            return false;
        }

        let x = 0,
            y = 0;

        let success = true;

        do {
            success = true;
            // Find a location for the feature.
            if (this.buildAtOrigin) {
                // Does the feature want to be at the origin? If so, put it there. (Just an optimization.)
                x = builder.originX;
                y = builder.originY;
            } else {
                // Pick our candidate location randomly, and also strike it from
                // the candidates map so that subsequent instances of this same feature can't choose it.
                [x, y] = GWU.random.matchingLoc(
                    candidates.width,
                    candidates.height,
                    (x, y) => candidates[x][y] > 0
                );
            }
            // Don't waste time trying the same place again whether or not this attempt succeeds.
            candidates[x][y] = 0;
            qualifyingTileCount--;

            // Try to build the DF first, if any, since we don't want it to be disrupted by subsequently placed terrain.
            if (this.effect) {
                success = site.fireEffect(this.effect, x, y);
            }

            // Now try to place the terrain tile, if any.
            if (success && this.tile !== -1) {
                const tile = GWM.tile.get(this.tile);
                if (
                    !(this.flags & StepFlags.BF_PERMIT_BLOCKING) &&
                    (tile.blocksMove() ||
                        this.flags & StepFlags.BF_TREAT_AS_BLOCKING)
                ) {
                    // Yes, check for blocking.
                    const blockingMap = GWU.grid.alloc(site.width, site.height);
                    blockingMap[x][y] = 1;
                    success = !SITE.siteDisruptedBy(site, blockingMap, {
                        machine: site.machineCount,
                    });
                    GWU.grid.free(blockingMap);
                }
                if (success) {
                    site.setTile(x, y, tile);
                }
            }

            // OK, if placement was successful, clear some personal space around the feature so subsequent features can't be generated too close.
            if (success) {
                qualifyingTileCount -= this.makePersonalSpace(
                    builder,
                    x,
                    y,
                    candidates
                );
                builtCount++; // we've placed an instance
                //DEBUG printf("\nPlaced instance #%i of feature %i at (%i, %i).", instance, feat, featX, featY);
            }

            // Generate an actor, if necessary

            // Generate an item, if necessary
            if (success && this.item) {
                const item = site.makeRandomItem(this.item);
                if (!item) {
                    success = false;
                }

                if (this.flags & StepFlags.BF_ITEM_IS_KEY) {
                    item.key = GWM.entity.makeKeyInfo(
                        x,
                        y,
                        !!(this.flags & StepFlags.BF_KEY_DISPOSABLE)
                    );
                }

                if (this.flags & StepFlags.BF_OUTSOURCE_ITEM_TO_MACHINE) {
                    success = builder.buildRandom(
                        Flags.BP_ADOPT_ITEM,
                        -1,
                        -1,
                        item
                    );
                } else {
                    success = site.addItem(x, y, item);
                }
            } else if (success && this.flags & StepFlags.BF_ADOPT_ITEM) {
                // adopt item if necessary
                if (!builder.adoptedItem) {
                    throw new Error(
                        'Failed to build blueprint because there is no adopted item.'
                    );
                }

                if (this.flags & StepFlags.BF_TREAT_AS_BLOCKING) {
                    // Yes, check for blocking.
                    const blockingMap = GWU.grid.alloc(site.width, site.height);
                    blockingMap[x][y] = 1;
                    success = !SITE.siteDisruptedBy(site, blockingMap);
                    GWU.grid.free(blockingMap);
                }

                success = success && site.addItem(x, y, builder.adoptedItem);
                if (success) {
                    builder.adoptedItem = null;
                }
            }

            if (success) {
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
                    site.setCellFlag(x, y, GWM.flags.Cell.IMPREGNABLE);
                }
            }

            // Finished with this instance!
        } while (
            qualifyingTileCount > 0 &&
            (this.generateEverywhere ||
                builtCount < wantCount ||
                this.flags & StepFlags.BF_REPEAT_UNTIL_NO_PROGRESS)
        );

        success = builtCount > 0;

        if (this.flags & StepFlags.BF_BUILD_VESTIBULE) {
            // Generate a door guard machine.
            // Try to create a sub-machine that qualifies.

            success = builder.buildRandom(
                Flags.BP_VESTIBULE,
                builder.originX,
                builder.originY
            );

            if (!success) {
                console.log(
                    `Depth ${builder.depth}: Failed to place blueprint ${blueprint.id} because it requires a vestibule and we couldn't place one.`
                );
                // failure! abort!
                return false;
            }
        }

        //DEBUG printf("\nFinished feature %i. Here's the candidates map:", feat);
        //DEBUG logBuffer(candidates);

        GWU.grid.free(candidates);
        return success;
    }
}
