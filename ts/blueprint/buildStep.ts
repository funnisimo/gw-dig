import * as GWU from 'gw-utils';
import * as GWM from 'gw-map';

import { BuildData } from './data';
import { Blueprint } from './blueprint';

export interface StepOptions {
    tile: string | number;
    flags: GWU.flag.FlagBase;
    pad: number;
    count: GWU.range.RangeBase;
    item: string | Partial<GWM.item.MatchOptions>;
    horde: any;
    effect: Partial<GWM.effect.EffectConfig> | string;
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

    BF_ALLOW_BOUNDARY = Fl(28), // allow build it in the outermost walls of the level

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

        if (this.buildAtOrigin && this.count.hi > 1) {
            throw new Error(
                'Cannot have count > 1 for step with BF_BUILD_AT_ORIGIN.'
            );
        }
    }

    get allowBoundary(): boolean {
        return !!(this.flags & StepFlags.BF_ALLOW_BOUNDARY);
    }

    get notInHallway(): boolean {
        return !!(this.flags & StepFlags.BF_NOT_IN_HALLWAY);
    }

    get buildInWalls(): boolean {
        return !!(this.flags & StepFlags.BF_BUILD_IN_WALLS);
    }

    get buildAnywhere(): boolean {
        return !!(this.flags & StepFlags.BF_BUILD_ANYWHERE_ON_LEVEL);
    }

    get repeatUntilNoProgress(): boolean {
        return !!(this.flags & StepFlags.BF_REPEAT_UNTIL_NO_PROGRESS);
    }

    get permitBlocking(): boolean {
        return !!(this.flags & StepFlags.BF_PERMIT_BLOCKING);
    }

    get treatAsBlocking(): boolean {
        return !!(this.flags & StepFlags.BF_TREAT_AS_BLOCKING);
    }

    get adoptItem(): boolean {
        return !!(this.flags & StepFlags.BF_ADOPT_ITEM);
    }

    get itemIsKey(): boolean {
        return !!(this.flags & StepFlags.BF_ITEM_IS_KEY);
    }

    get keyIsDisposable(): boolean {
        return !!(this.flags & StepFlags.BF_KEY_DISPOSABLE);
    }

    get outsourceItem(): boolean {
        return !!(this.flags & StepFlags.BF_OUTSOURCE_ITEM_TO_MACHINE);
    }

    get impregnable(): boolean {
        return !!(this.flags & StepFlags.BF_IMPREGNABLE);
    }

    get buildVestibule(): boolean {
        return !!(this.flags & StepFlags.BF_BUILD_VESTIBULE);
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

    get buildsInstances(): boolean {
        return !!(
            this.effect ||
            this.tile != -1 ||
            this.item ||
            this.horde ||
            this.adoptItem
        );
    }

    // cellIsCandidate(
    //     builder: BuildData,
    //     blueprint: Blueprint,
    //     x: number,
    //     y: number,
    //     distanceBound: [number, number]
    // ) {
    //     return cellIsCandidate(builder, blueprint, this, x, y, distanceBound);
    // }

    // distanceBound(builder: BuildData): [number, number] {
    //     return calcDistanceBound(builder, this);
    // }

    // updateViewMap(builder: BuildData): void {
    //     updateViewMap(builder, this);
    // }

    // build(
    //     builder: BuildData,
    //     blueprint: Blueprint,
    //     adoptedItem: GWM.item.Item | null
    // ): boolean {
    //     return buildStep(builder, blueprint, this, adoptedItem);
    // }

    markCandidates(
        data: BuildData,
        blueprint: Blueprint,
        candidates: GWU.grid.NumGrid,
        distanceBound: [number, number] = [0, 10000]
    ): number {
        updateViewMap(data, this);

        let count = 0;
        candidates.update((_v, i, j) => {
            if (cellIsCandidate(data, blueprint, this, i, j, distanceBound)) {
                count++;
                return 1;
            } else {
                return 0;
            }
        });
        return count;
    }
}

export function updateViewMap(builder: BuildData, buildStep: BuildStep): void {
    if (
        buildStep.flags &
        (StepFlags.BF_IN_VIEW_OF_ORIGIN |
            StepFlags.BF_IN_PASSABLE_VIEW_OF_ORIGIN)
    ) {
        const site = builder.site;
        if (buildStep.flags & StepFlags.BF_IN_PASSABLE_VIEW_OF_ORIGIN) {
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
                    return site.blocksPathing(x, y) || site.blocksVision(x, y);
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

export function calcDistanceBound(
    builder: BuildData,
    buildStep: BuildStep
): [number, number] {
    const distanceBound: [number, number] = [0, 10000];
    if (buildStep.flags & StepFlags.BF_NEAR_ORIGIN) {
        distanceBound[1] = builder.distance25;
    }
    if (buildStep.flags & StepFlags.BF_FAR_FROM_ORIGIN) {
        distanceBound[0] = builder.distance75;
    }
    return distanceBound;
}

export function cellIsCandidate(
    builder: BuildData,
    blueprint: Blueprint,
    buildStep: BuildStep,
    x: number,
    y: number,
    distanceBound: [number, number]
) {
    const site = builder.site;

    // No building in the hallway if it's prohibited.
    // This check comes before the origin check, so an area machine will fail altogether
    // if its origin is in a hallway and the feature that must be built there does not permit as much.
    if (
        buildStep.notInHallway &&
        GWU.xy.arcCount(
            x,
            y,
            (i, j) => site.hasXY(i, j) && site.isPassable(i, j)
        ) > 1
    ) {
        return false;
    }

    // No building along the perimeter of the level if it's prohibited.
    if (
        (x == 0 || x == site.width - 1 || y == 0 || y == site.height - 1) &&
        !buildStep.allowBoundary
    ) {
        return false;
    }

    // The origin is a candidate if the feature is flagged to be built at the origin.
    // If it's a room, the origin (i.e. doorway) is otherwise NOT a candidate.
    if (buildStep.buildAtOrigin) {
        return x == builder.originX && y == builder.originY;
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
        buildStep.flags &
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
        GWU.xy.eachNeighbor(
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

    if (buildStep.buildInWalls) {
        // If we're supposed to build in a wall...
        const cellMachine = site.getMachine(x, y);
        if (
            !builder.interior[x][y] &&
            (!cellMachine || cellMachine == builder.machineNumber) &&
            site.isWall(x, y)
        ) {
            let ok = false;
            // ...and this location is a wall that's not already machined...
            GWU.xy.eachNeighbor(
                x,
                y,
                (newX, newY) => {
                    if (!site.hasXY(newX, newY)) return;
                    if (
                        !builder.interior[newX][newY] &&
                        !buildStep.buildAnywhere
                    ) {
                        return;
                    }
                    // ...and it's next to an interior spot or permitted elsewhere and next to passable spot...
                    if (
                        buildStep.buildAnywhere &&
                        !site.blocksPathing(newX, newY) &&
                        !site.getMachine(newX, newY) &&
                        !(newX == builder.originX && newY == builder.originY)
                    ) {
                        ok = true;
                    }
                },
                true
            );
            return ok;
        }
        return false;
    } else if (site.isWall(x, y)) {
        // Can't build in a wall unless instructed to do so.
        return false;
    } else if (buildStep.buildAnywhere) {
        if (
            (buildStep.item && site.blocksItems(x, y)) ||
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

export function makePersonalSpace(
    builder: BuildData,
    x: number,
    y: number,
    candidates: GWU.grid.NumGrid,
    personalSpace: number
) {
    let count = 0;

    for (let i = x - personalSpace + 1; i <= x + personalSpace - 1; i++) {
        for (let j = y - personalSpace + 1; j <= y + personalSpace - 1; j++) {
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

// export function buildStep(
//     builder: BuildData,
//     blueprint: Blueprint,
//     buildStep: BuildStep,
//     adoptedItem: GWM.item.Item | null
// ): boolean {
//     let wantCount = 0;
//     let builtCount = 0;

//     const site = builder.site;

//     const candidates = GWU.grid.alloc(site.width, site.height);

//     // Figure out the distance bounds.
//     const distanceBound = calcDistanceBound(builder, buildStep);
//     buildStep.updateViewMap(builder);

//     // If the StepFlags.BF_REPEAT_UNTIL_NO_PROGRESS flag is set, repeat until we fail to build the required number of instances.

//     // Make a master map of candidate locations for this feature.
//     let qualifyingTileCount = markCandidates(
//         candidates,
//         builder,
//         blueprint,
//         buildStep,
//         distanceBound
//     );

//     if (!buildStep.generateEverywhere) {
//         wantCount = buildStep.count.value();
//     }

//     if (!qualifyingTileCount || qualifyingTileCount < buildStep.count.lo) {
//         console.log(
//             ' - Only %s qualifying tiles - want at least %s.',
//             qualifyingTileCount,
//             buildStep.count.lo
//         );
//         GWU.grid.free(candidates);
//         return false;
//     }

//     let x = 0,
//         y = 0;

//     let success = true;
//     let didSomething = false;

//     do {
//         success = true;
//         // Find a location for the feature.
//         if (buildStep.buildAtOrigin) {
//             // Does the feature want to be at the origin? If so, put it there. (Just an optimization.)
//             x = builder.originX;
//             y = builder.originY;
//         } else {
//             // Pick our candidate location randomly, and also strike it from
//             // the candidates map so that subsequent instances of this same feature can't choose it.
//             [x, y] = GWU.rng.random.matchingLoc(
//                 candidates.width,
//                 candidates.height,
//                 (x, y) => candidates[x][y] > 0
//             );
//         }
//         // Don't waste time trying the same place again whether or not this attempt succeeds.
//         candidates[x][y] = 0;
//         qualifyingTileCount--;

//         // Try to build the DF first, if any, since we don't want it to be disrupted by subsequently placed terrain.
//         if (buildStep.effect) {
//             success = site.fireEffect(buildStep.effect, x, y);
//             didSomething = success;
//         }

//         // Now try to place the terrain tile, if any.
//         if (success && buildStep.tile !== -1) {
//             const tile = GWM.tile.get(buildStep.tile);
//             if (
//                 !(buildStep.flags & StepFlags.BF_PERMIT_BLOCKING) &&
//                 (tile.blocksMove() ||
//                     buildStep.flags & StepFlags.BF_TREAT_AS_BLOCKING)
//             ) {
//                 // Yes, check for blocking.
//                 success = !SITE.siteDisruptedByXY(site, x, y, {
//                     machine: site.machineCount,
//                 });
//             }
//             if (success) {
//                 success = site.setTile(x, y, tile);
//                 didSomething = didSomething || success;
//             }
//         }

//         // Generate an actor, if necessary

//         // Generate an item, if necessary
//         if (success && buildStep.item) {
//             const item = site.makeRandomItem(buildStep.item);
//             if (!item) {
//                 success = false;
//             }

//             if (buildStep.flags & StepFlags.BF_ITEM_IS_KEY) {
//                 item.key = GWM.entity.makeKeyInfo(
//                     x,
//                     y,
//                     !!(buildStep.flags & StepFlags.BF_KEY_DISPOSABLE)
//                 );
//             }

//             if (buildStep.flags & StepFlags.BF_OUTSOURCE_ITEM_TO_MACHINE) {
//                 success = builder.buildRandom(
//                     Flags.BP_ADOPT_ITEM,
//                     -1,
//                     -1,
//                     item
//                 );
//                 if (success) {
//                     didSomething = true;
//                 }
//             } else {
//                 success = site.addItem(x, y, item);
//                 didSomething = didSomething || success;
//             }
//         } else if (success && buildStep.flags & StepFlags.BF_ADOPT_ITEM) {
//             // adopt item if necessary
//             if (!adoptedItem) {
//                 GWU.grid.free(candidates);
//                 throw new Error(
//                     'Failed to build blueprint because there is no adopted item.'
//                 );
//             }

//             if (buildStep.flags & StepFlags.BF_TREAT_AS_BLOCKING) {
//                 // Yes, check for blocking.
//                 success = !SITE.siteDisruptedByXY(site, x, y);
//             }

//             if (success) {
//                 success = site.addItem(x, y, adoptedItem);
//                 if (success) {
//                     didSomething = true;
//                 } else {
//                     console.log('- failed to add item', x, y);
//                 }
//             } else {
//                 // console.log('- blocks map', x, y);
//             }
//         }

//         if (success && didSomething) {
//             // OK, if placement was successful, clear some personal space around the feature so subsequent features can't be generated too close.
//             qualifyingTileCount -= makePersonalSpace(
//                 builder,
//                 x,
//                 y,
//                 candidates,
//                 buildStep.pad
//             );
//             builtCount++; // we've placed an instance

//             // Mark the feature location as part of the machine, in case it is not already inside of it.
//             if (!(blueprint.flags & Flags.BP_NO_INTERIOR_FLAG)) {
//                 site.setMachine(x, y, builder.machineNumber, blueprint.isRoom);
//             }

//             // Mark the feature location as impregnable if requested.
//             if (buildStep.flags & StepFlags.BF_IMPREGNABLE) {
//                 site.setCellFlag(x, y, GWM.flags.Cell.IMPREGNABLE);
//             }
//         }

//         // Finished with this instance!
//     } while (
//         qualifyingTileCount > 0 &&
//         (buildStep.generateEverywhere ||
//             builtCount < wantCount ||
//             buildStep.flags & StepFlags.BF_REPEAT_UNTIL_NO_PROGRESS)
//     );

//     if (success && buildStep.flags & StepFlags.BF_BUILD_VESTIBULE) {
//         // Generate a door guard machine.
//         // Try to create a sub-machine that qualifies.

//         success = builder.buildRandom(
//             Flags.BP_VESTIBULE,
//             builder.originX,
//             builder.originY
//         );

//         if (!success) {
//             // console.log(
//             //     `Depth ${builder.depth}: Failed to place blueprint ${blueprint.id} because it requires a vestibule and we couldn't place one.`
//             // );
//             // failure! abort!
//             GWU.grid.free(candidates);
//             return false;
//         }
//         ++builtCount;
//     }

//     //DEBUG printf("\nFinished feature %i. Here's the candidates map:", feat);
//     //DEBUG logBuffer(candidates);

//     success = builtCount > 0;

//     GWU.grid.free(candidates);
//     return success;
// }
