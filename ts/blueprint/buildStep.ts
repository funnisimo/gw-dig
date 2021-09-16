import * as GWU from 'gw-utils';
import * as GWM from 'gw-map';

import { BuildData } from './data';
import { Blueprint } from './blueprint';

export interface ItemOptions extends GWM.item.MatchOptions {
    make: any;
    id: string;
}

export interface HordeOptions extends GWM.horde.HordeConfig {
    id: string;
    effect: string | GWM.effect.EffectBase;
    random: boolean;
    rng?: GWU.rng.Random;
}

export interface StepOptions {
    tile: string | number;
    flags: GWU.flag.FlagBase;
    pad: number;
    count: GWU.range.RangeBase;
    item: string | Partial<ItemOptions>;
    horde: boolean | string | Partial<HordeOptions>;
    effect: Partial<GWM.effect.EffectConfig> | string;
}

const Fl = GWU.flag.fl;

export enum StepFlags {
    BS_OUTSOURCE_ITEM_TO_MACHINE = Fl(1), // item must be adopted by another machine
    BS_BUILD_VESTIBULE = Fl(2), // call this at the origin of a door room to create a new door guard machine there
    BS_ADOPT_ITEM = Fl(3), // this feature will take the adopted item (be it from another machine or a previous feature)
    BS_BUILD_AT_ORIGIN = Fl(4), // generate this feature at the room entrance

    BS_PERMIT_BLOCKING = Fl(5), // permit the feature to block the map's passability (e.g. to add a locked door)
    BS_TREAT_AS_BLOCKING = Fl(6), // treat this terrain as though it blocks, for purposes of deciding whether it can be placed there

    BS_NEAR_ORIGIN = Fl(7), // feature must spawn in the rough quarter of tiles closest to the origin
    BS_FAR_FROM_ORIGIN = Fl(8), // feature must spawn in the rough quarter of tiles farthest from the origin
    BS_IN_VIEW_OF_ORIGIN = Fl(9), // this feature must be in view of the origin
    BS_IN_PASSABLE_VIEW_OF_ORIGIN = Fl(10), // this feature must be in view of the origin, where "view" is blocked by pathing blockers

    BS_HORDE_TAKES_ITEM = Fl(11), // the item associated with this feature (including if adopted) will be in possession of the horde leader that's generated
    BS_HORDE_SLEEPING = Fl(12), // the monsters should be asleep when generated
    BS_HORDE_FLEEING = Fl(13), // the monsters should be permanently fleeing when generated
    BS_HORDES_DORMANT = Fl(14), // monsters are dormant, and appear when a dungeon feature with DFF_ACTIVATE_DORMANT_MONSTER spawns on their tile

    BS_ITEM_IS_KEY = Fl(15),
    BS_ITEM_IDENTIFIED = Fl(16),
    BS_ITEM_PLAYER_AVOIDS = Fl(17),

    BS_EVERYWHERE = Fl(18), // generate the feature on every tile of the machine (e.g. carpeting)
    BS_ALTERNATIVE = Fl(19), // build only one feature that has this flag per machine; the rest are skipped
    BS_ALTERNATIVE_2 = Fl(20), // same as BS_ALTERNATIVE, but provides for a second set of alternatives of which only one will be chosen

    BS_BUILD_IN_WALLS = Fl(21), // build in an impassable tile that is adjacent to the interior
    BS_BUILD_ANYWHERE_ON_LEVEL = Fl(22), // build anywhere on the level that is not inside the machine
    BS_REPEAT_UNTIL_NO_PROGRESS = Fl(23), // keep trying to build this feature set until no changes are made
    BS_IMPREGNABLE = Fl(24), // this feature's location will be immune to tunneling

    BS_NO_BLOCK_ORIGIN = Fl(25), // Treat as blocking, but do not block the path to the origin

    // TODO - BS_ALLOW_IN_HALLWAY instead?
    BS_NOT_IN_HALLWAY = Fl(27), // the feature location must have a passableArcCount of <= 1

    BS_ALLOW_BOUNDARY = Fl(28), // allow build it in the outermost walls of the level

    BS_SKELETON_KEY = Fl(29), // if a key is generated or adopted by this feature, it will open all locks in this machine.
    BS_KEY_DISPOSABLE = Fl(30), // if a key is generated or adopted, it will self-destruct after being used at this current location.
}

export class BuildStep {
    public tile: string | number = -1;
    public flags: number = 0;
    public pad: number = 0;
    public count: GWU.range.Range;
    public item: Partial<ItemOptions> | null = null;
    public horde: Partial<HordeOptions> | null = null;
    public effect: GWM.effect.EffectInfo | null = null;
    public chance = 0;
    // public next: null = null;
    // public id = 'n/a';

    constructor(cfg: Partial<StepOptions> = {}) {
        this.tile = cfg.tile ?? -1;
        if (cfg.flags) {
            this.flags = GWU.flag.from(StepFlags, cfg.flags);
        }
        if (cfg.pad) {
            this.pad = cfg.pad;
        }
        this.count = GWU.range.make(cfg.count || 1);
        if (typeof cfg.item === 'string') {
            this.item = { tags: cfg.item };
        } else {
            this.item = cfg.item || null;
        }
        if (cfg.horde) {
            if (typeof cfg.horde === 'string') {
                this.horde = { tags: cfg.horde };
            } else if (cfg.horde === true) {
                this.horde = { random: true };
            } else {
                this.horde = cfg.horde;
            }
        }

        if (cfg.effect) {
            this.effect = GWM.effect.from(cfg.effect);
        }

        if (this.item && this.flags & StepFlags.BS_ADOPT_ITEM) {
            throw new Error(
                'Cannot have blueprint step with item and BS_ADOPT_ITEM.'
            );
        }

        if (this.buildAtOrigin && this.count.hi > 1) {
            throw new Error(
                'Cannot have count > 1 for step with BS_BUILD_AT_ORIGIN.'
            );
        }
        if (this.buildAtOrigin && this.repeatUntilNoProgress) {
            throw new Error(
                'Cannot have BS_BUILD_AT_ORIGIN and BS_REPEAT_UNTIL_NO_PROGRESS together in a build step.'
            );
        }
        if (this.hordeTakesItem && !this.horde) {
            throw new Error(
                'Cannot have BS_HORDE_TAKES_ITEM without a horde configured.'
            );
        }
    }

    get allowBoundary(): boolean {
        return !!(this.flags & StepFlags.BS_ALLOW_BOUNDARY);
    }

    get notInHallway(): boolean {
        return !!(this.flags & StepFlags.BS_NOT_IN_HALLWAY);
    }

    get buildInWalls(): boolean {
        return !!(this.flags & StepFlags.BS_BUILD_IN_WALLS);
    }

    get buildAnywhere(): boolean {
        return !!(this.flags & StepFlags.BS_BUILD_ANYWHERE_ON_LEVEL);
    }

    get repeatUntilNoProgress(): boolean {
        return !!(this.flags & StepFlags.BS_REPEAT_UNTIL_NO_PROGRESS);
    }

    get permitBlocking(): boolean {
        return !!(this.flags & StepFlags.BS_PERMIT_BLOCKING);
    }

    get treatAsBlocking(): boolean {
        return !!(
            this.flags &
            (StepFlags.BS_TREAT_AS_BLOCKING | StepFlags.BS_NO_BLOCK_ORIGIN)
        );
    }

    get noBlockOrigin(): boolean {
        return !!(this.flags & StepFlags.BS_NO_BLOCK_ORIGIN);
    }

    get adoptItem(): boolean {
        return !!(this.flags & StepFlags.BS_ADOPT_ITEM);
    }

    get itemIsKey(): boolean {
        return !!(this.flags & StepFlags.BS_ITEM_IS_KEY);
    }

    get keyIsDisposable(): boolean {
        return !!(this.flags & StepFlags.BS_KEY_DISPOSABLE);
    }

    get outsourceItem(): boolean {
        return !!(this.flags & StepFlags.BS_OUTSOURCE_ITEM_TO_MACHINE);
    }

    get impregnable(): boolean {
        return !!(this.flags & StepFlags.BS_IMPREGNABLE);
    }

    get buildVestibule(): boolean {
        return !!(this.flags & StepFlags.BS_BUILD_VESTIBULE);
    }

    get hordeTakesItem(): boolean {
        return !!(this.flags & StepFlags.BS_HORDE_TAKES_ITEM);
    }

    get generateEverywhere(): boolean {
        return !!(
            this.flags &
            StepFlags.BS_EVERYWHERE &
            ~StepFlags.BS_BUILD_AT_ORIGIN
        );
    }

    get buildAtOrigin(): boolean {
        return !!(this.flags & StepFlags.BS_BUILD_AT_ORIGIN);
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

    makeItem(data: BuildData): GWM.item.Item | null {
        if (!this.item) return null;
        if (this.item.id) {
            return data.site.makeItem(this.item.id, this.item.make);
        }
        return data.site.makeRandomItem(this.item, this.item.make);
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
        candidates: GWU.grid.NumGrid,
        distanceBound: [number, number] = [0, 10000]
    ): number {
        updateViewMap(data, this);
        const blueprint = data.blueprint;
        let count = 0;
        candidates.update((_v, i, j) => {
            const candidateType = cellIsCandidate(
                data,
                blueprint,
                this,
                i,
                j,
                distanceBound
            );
            if (candidateType === CandidateType.OK) {
                count++;
            }
            return candidateType;
        });
        return count;
    }

    makePersonalSpace(
        _data: BuildData,
        x: number,
        y: number,
        candidates: GWU.grid.NumGrid
    ) {
        let count = 0;

        if (this.pad < 1) return 0; // do not mark occupied
        // or...
        // if (this.buildEverywhere) return 0;  // do not mark occupied

        for (let i = x - this.pad; i <= x + this.pad; i++) {
            for (let j = y - this.pad; j <= y + this.pad; j++) {
                if (candidates.hasXY(i, j)) {
                    if (candidates[i][j] == 1) {
                        candidates[i][j] = 0;
                        ++count;
                    }
                    // builder.occupied[i][j] = 1;
                }
            }
        }
        return count;
    }

    toString() {
        let parts = [];
        if (this.tile) {
            parts.push('tile: ' + this.tile);
        }
        if (this.effect) {
            parts.push('effect: ' + JSON.stringify(this.effect));
        }
        if (this.item) {
            parts.push('item: ' + JSON.stringify(this.item));
        }
        if (this.horde) {
            parts.push('horde: ' + JSON.stringify(this.horde));
        }
        if (this.pad > 1) {
            parts.push('pad: ' + this.pad);
        }
        if (this.count.lo > 1 || this.count.hi > 1) {
            parts.push('count: ' + this.count.toString());
        }
        if (this.chance) {
            parts.push('chance: ' + this.chance);
        }
        if (this.flags) {
            parts.push('flags: ' + GWU.flag.toString(StepFlags, this.flags));
        }
        return '{ ' + parts.join(', ') + ' }';
    }
}

export function updateViewMap(builder: BuildData, buildStep: BuildStep): void {
    if (
        buildStep.flags &
        (StepFlags.BS_IN_VIEW_OF_ORIGIN |
            StepFlags.BS_IN_PASSABLE_VIEW_OF_ORIGIN)
    ) {
        const site = builder.site;
        if (buildStep.flags & StepFlags.BS_IN_PASSABLE_VIEW_OF_ORIGIN) {
            const fov = new GWU.fov.FOV({
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
        } else {
            const fov = new GWU.fov.FOV({
                isBlocked: (x, y) => {
                    return site.blocksVision(x, y);
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
    if (buildStep.flags & StepFlags.BS_NEAR_ORIGIN) {
        distanceBound[1] = builder.distance25;
    }
    if (buildStep.flags & StepFlags.BS_FAR_FROM_ORIGIN) {
        distanceBound[0] = builder.distance75;
    }
    return distanceBound;
}

export enum CandidateType {
    NOT_CANDIDATE = 0,
    OK = 1,
    IN_HALLWAY,
    ON_BOUNDARY,
    MUST_BE_ORIGIN,
    NOT_ORIGIN,
    OCCUPIED,
    NOT_IN_VIEW,
    TOO_FAR,
    TOO_CLOSE,
    INVALID_WALL,
    BLOCKED,
    FAILED,
}

export function cellIsCandidate(
    builder: BuildData,
    blueprint: Blueprint,
    buildStep: BuildStep,
    x: number,
    y: number,
    distanceBound: [number, number]
): CandidateType {
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
        return CandidateType.IN_HALLWAY;
    }

    // if (buildStep.noBlockOrigin) {
    //     let ok = true;
    //     GWU.xy.eachNeighbor(
    //         x,
    //         y,
    //         (nx, ny) => {
    //             if (nx === builder.originX && ny === builder.originY) {
    //                 ok = false;
    //             }
    //         },
    //         true
    //     );
    //     if (!ok) return false;
    // }

    // No building along the perimeter of the level if it's prohibited.
    if (
        (x == 0 || x == site.width - 1 || y == 0 || y == site.height - 1) &&
        !buildStep.allowBoundary
    ) {
        return CandidateType.ON_BOUNDARY;
    }

    // The origin is a candidate if the feature is flagged to be built at the origin.
    // If it's a room, the origin (i.e. doorway) is otherwise NOT a candidate.
    if (buildStep.buildAtOrigin) {
        if (x == builder.originX && y == builder.originY)
            return CandidateType.OK;
        return CandidateType.MUST_BE_ORIGIN;
    } else if (
        blueprint.isRoom &&
        x == builder.originX &&
        y == builder.originY
    ) {
        return CandidateType.NOT_ORIGIN;
    }

    // No building in another feature's personal space!
    if (builder.occupied[x][y]) {
        return CandidateType.OCCUPIED;
    }

    // Must be in the viewmap if the appropriate flag is set.
    if (
        buildStep.flags &
            (StepFlags.BS_IN_VIEW_OF_ORIGIN |
                StepFlags.BS_IN_PASSABLE_VIEW_OF_ORIGIN) &&
        !builder.viewMap[x][y]
    ) {
        return CandidateType.NOT_IN_VIEW;
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

    if (distance > distanceBound[1]) return CandidateType.TOO_FAR; // distance exceeds max
    if (distance < distanceBound[0]) return CandidateType.TOO_CLOSE;

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
                    const neighborMachine = site.getMachine(newX, newY);
                    if (
                        !site.blocksPathing(newX, newY) &&
                        (!neighborMachine ||
                            neighborMachine == builder.machineNumber) &&
                        !(newX == builder.originX && newY == builder.originY)
                    ) {
                        ok = true;
                    }
                },
                true
            );
            return ok ? CandidateType.OK : CandidateType.INVALID_WALL;
        }
        return CandidateType.NOT_CANDIDATE;
    } else if (site.isWall(x, y)) {
        // Can't build in a wall unless instructed to do so.
        return CandidateType.INVALID_WALL;
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
            return CandidateType.BLOCKED;
        } else {
            return CandidateType.OK;
        }
    } else if (builder.interior[x][y]) {
        return CandidateType.OK;
    }
    return CandidateType.FAILED;
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

//     // If the StepFlags.BS_REPEAT_UNTIL_NO_PROGRESS flag is set, repeat until we fail to build the required number of instances.

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
//             [x, y] = site.rng.matchingLoc(
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
//                 !(buildStep.flags & StepFlags.BS_PERMIT_BLOCKING) &&
//                 (tile.blocksMove() ||
//                     buildStep.flags & StepFlags.BS_TREAT_AS_BLOCKING)
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

//             if (buildStep.flags & StepFlags.BS_ITEM_IS_KEY) {
//                 item.key = GWM.entity.makeKeyInfo(
//                     x,
//                     y,
//                     !!(buildStep.flags & StepFlags.BS_KEY_DISPOSABLE)
//                 );
//             }

//             if (buildStep.flags & StepFlags.BS_OUTSOURCE_ITEM_TO_MACHINE) {
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
//         } else if (success && buildStep.flags & StepFlags.BS_ADOPT_ITEM) {
//             // adopt item if necessary
//             if (!adoptedItem) {
//                 GWU.grid.free(candidates);
//                 throw new Error(
//                     'Failed to build blueprint because there is no adopted item.'
//                 );
//             }

//             if (buildStep.flags & StepFlags.BS_TREAT_AS_BLOCKING) {
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
//             if (buildStep.flags & StepFlags.BS_IMPREGNABLE) {
//                 site.setCellFlag(x, y, GWM.flags.Cell.IMPREGNABLE);
//             }
//         }

//         // Finished with this instance!
//     } while (
//         qualifyingTileCount > 0 &&
//         (buildStep.generateEverywhere ||
//             builtCount < wantCount ||
//             buildStep.flags & StepFlags.BS_REPEAT_UNTIL_NO_PROGRESS)
//     );

//     if (success && buildStep.flags & StepFlags.BS_BUILD_VESTIBULE) {
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
