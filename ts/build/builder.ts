import * as GWU from 'gw-utils';
// import * as GWM from 'gw-map';

import * as SITE from '../site';
import * as BLUE from './blueprint';
import * as STEP from './buildStep';
import * as ITEM from '../site/item';
import * as HORDE from '../site/horde';

import { BuildData } from './data';
import { NullLogger, Logger } from '../site/log/logger';
import { ConsoleLogger } from '../site/log/consoleLogger';
import { DisruptOptions, Site } from '../site';

export type BlueType = BLUE.Blueprint | string;

export interface BuilderOptions {
    blueprints: BlueType[] | { [key: string]: BlueType };
    log: Logger | boolean;
    seed: number;
}

export interface BuildInfo {
    x: number;
    y: number;
}

export type BuildResult = BuildInfo | null;

export class Builder {
    blueprints: BLUE.Blueprint[] | null = null;
    log: Logger;
    seed: number;

    constructor(options: Partial<BuilderOptions> = {}) {
        if (options.blueprints) {
            if (!Array.isArray(options.blueprints)) {
                options.blueprints = Object.values(options.blueprints);
            }
            this.blueprints = options.blueprints.map((v) => BLUE.get(v));
        }
        if (options.log === true) {
            this.log = new ConsoleLogger();
        } else {
            this.log = options.log || new NullLogger();
        }
        if (options.seed) {
            this.seed = options.seed;
        } else {
            this.seed = 0;
        }
    }

    _pickRandom(
        requiredFlags: number,
        depth: number,
        rng?: GWU.rng.Random
    ): BLUE.Blueprint | null {
        rng = rng || GWU.rng.random;
        const blueprints = this.blueprints || Object.values(BLUE.blueprints);
        const weights = blueprints.map((b) => {
            if (!b.qualifies(requiredFlags)) return 0;
            return b.frequency(depth);
        });

        const index = rng.weighted(weights) as number;
        return blueprints[index] || null;
    }

    buildRandom(
        site: Site,
        requiredMachineFlags = BLUE.Flags.BP_ROOM,
        x = -1,
        y = -1,
        adoptedItem: ITEM.ItemInstance | null = null
    ): BuildResult {
        const depth = site.depth;

        let tries = 0;
        while (tries < 10) {
            const blueprint = this._pickRandom(
                requiredMachineFlags,
                depth,
                site.rng
            );
            if (!blueprint) {
                this.log.onBuildError(
                    `Failed to find matching blueprint: requiredMachineFlags : ${GWU.flag.toString(
                        BLUE.Flags,
                        requiredMachineFlags
                    )}, depth: ${depth}`
                );
                return null;
            }

            const data = new BuildData(site, blueprint);
            site.analyze();

            this.log.onBlueprintPick(data, requiredMachineFlags, depth);

            if (this._buildAt(data, x, y, adoptedItem)) {
                return { x, y };
            }
            ++tries;
        }

        // console.log(
        //     'Failed to build random blueprint matching flags: ' +
        //         GWU.flag.toString(BLUE.Flags, requiredMachineFlags) +
        //         ' tried : ' +
        //         tries.join(', ')
        // );
        return null;
    }

    build(
        site: Site,
        blueprint: BLUE.Blueprint | string,
        x = -1,
        y = -1,
        adoptedItem: ITEM.ItemInstance | null = null
    ): BuildResult {
        if (typeof blueprint === 'string') {
            const id = blueprint;
            blueprint = BLUE.blueprints[id];
            if (!blueprint) throw new Error('Failed to find blueprint - ' + id);
        }

        if (this.seed) {
            site.rng.seed(this.seed);
        }

        const data = new BuildData(site, blueprint);
        site.analyze();

        return this._buildAt(data, x, y, adoptedItem);
    }

    _buildAt(
        data: BuildData,
        x = -1,
        y = -1,
        adoptedItem: ITEM.ItemInstance | null = null
    ): BuildResult {
        if (x >= 0 && y >= 0) {
            return this._build(data, x, y, adoptedItem);
        }

        let count = this._markCandidates(data);
        if (!count) {
            return null;
        }

        let tries = 20; // TODO - Make property of Blueprint
        while (count-- && tries--) {
            const loc = BLUE.pickCandidateLoc(data) || false;
            if (loc) {
                if (this._build(data, loc[0], loc[1], adoptedItem)) {
                    return { x: loc[0], y: loc[1] };
                }
            }
        }

        this.log.onBlueprintFail(
            data,
            'No suitable locations found to build blueprint.'
        );
        return null;
    }

    //////////////////////////////////////////
    // Returns true if the machine got built; false if it was aborted.
    // If empty array spawnedItems or spawnedMonsters is given, will pass those back for deletion if necessary.
    _build(
        data: BuildData,
        originX: number,
        originY: number,
        adoptedItem: ITEM.ItemInstance | null = null
    ): BuildResult {
        data.reset(originX, originY);
        this.log.onBlueprintStart(data, adoptedItem);

        if (!this._computeInterior(data)) {
            return null;
        }

        // This is the point of no return. Back up the level so it can be restored if we have to abort this machine after this point.
        const snapshot = data.site.snapshot();
        data.machineNumber = data.site.nextMachineId(); // Reserve this machine number, starting with 1.

        // Perform any transformations to the interior indicated by the blueprint flags, including expanding the interior if requested.
        BLUE.prepareInterior(data);

        // Calculate the distance map (so that features that want to be close to or far from the origin can be placed accordingly)
        // and figure out the 33rd and 67th percentiles for features that want to be near or far from the origin.
        data.calcDistances(data.blueprint.size.hi);

        // Now decide which features will be skipped -- of the features marked MF_ALTERNATIVE, skip all but one, chosen randomly.
        // Then repeat and do the same with respect to MF_ALTERNATIVE_2, to provide up to two independent sets of alternative features per machine.

        const components = data.blueprint.pickComponents(data.site.rng);

        // Zero out occupied[][], and use it to keep track of the personal space around each feature that gets placed.

        // Now tick through the features and build them.
        for (let index = 0; index < components.length; index++) {
            const component = components[index];
            // console.log('BUILD COMPONENT', component);

            if (!this._buildStep(data, component, adoptedItem)) {
                // failure! abort!
                // Restore the map to how it was before we touched it.
                this.log.onBlueprintFail(
                    data,
                    `Failed to build step ${component.index + 1}/${
                        data.blueprint.steps.length
                    }.`
                );
                data.site.restore(snapshot);
                snapshot.free();
                // abortItemsAndMonsters(spawnedItems, spawnedMonsters);
                return null;
            }
        }

        // Clear out the interior flag for all non-wired cells, if requested.
        if (data.blueprint.noInteriorFlag) {
            SITE.clearInteriorFlag(data.site, data.machineNumber);
        }

        // if (torchBearer && torch) {
        // 	if (torchBearer->carriedItem) {
        // 		deleteItem(torchBearer->carriedItem);
        // 	}
        // 	removeItemFromChain(torch, floorItems);
        // 	torchBearer->carriedItem = torch;
        // }

        this.log.onBlueprintSuccess(data);

        snapshot.free();

        // console.log('Built a machine from blueprint:', originX, originY);
        return { x: originX, y: originY };
    }

    _markCandidates(data: BuildData): number {
        const count = BLUE.markCandidates(data);

        if (count <= 0) {
            this.log.onBlueprintFail(
                data,
                'No suitable candidate locations found.'
            );
            return 0;
        }

        this.log.onBlueprintCandidates(data);

        return count;
    }

    _computeInterior(data: BuildData): boolean {
        let fail = null;
        let count = data.blueprint.fillInterior(data);

        // Now make sure the interior map satisfies the machine's qualifications.
        if (!count) {
            fail = 'Interior error.';
        } else if (!data.blueprint.size.contains(count)) {
            fail = `Interior wrong size - have: ${count}, want: ${data.blueprint.size.toString()}`;
        } else if (
            data.blueprint.treatAsBlocking &&
            SITE.siteDisruptedBy(data.site, data.interior, {
                machine: data.site.machineCount,
            })
        ) {
            fail = 'Interior blocks map.';
        } else if (
            data.blueprint.requireBlocking &&
            SITE.siteDisruptedSize(data.site, data.interior) < 100
        ) {
            fail = 'Interior does not block enough cells.';
        }

        if (!fail) {
            this.log.onBlueprintInterior(data);

            return true;
        }

        this.log.onBlueprintFail(data, fail);
        return false;
    }

    _buildStep(
        data: BuildData,
        buildStep: STEP.BuildStep,
        adoptedItem: ITEM.ItemInstance | null
    ) {
        let wantCount = 0;
        let builtCount = 0;

        const site = data.site;

        this.log.onStepStart(data, buildStep, adoptedItem);

        // console.log(
        //     'buildComponent',
        //     blueprint.id,
        //     blueprint.steps.indexOf(buildStep)
        // );

        // Figure out the distance bounds.
        const distanceBound = STEP.calcDistanceBound(data, buildStep);

        // If the StepFlags.BS_REPEAT_UNTIL_NO_PROGRESS flag is set, repeat until we fail to build the required number of instances.

        // Make a master map of candidate locations for this feature.
        let qualifyingTileCount = 0;

        if (buildStep.buildVestibule) {
            // Generate a door guard machine.
            // Try to create a sub-machine that qualifies.

            let success = this.buildRandom(
                data.site,
                BLUE.Flags.BP_VESTIBULE,
                data.originX,
                data.originY
            );

            if (!success) {
                this.log.onStepFail(
                    data,
                    buildStep,
                    'Failed to build vestibule'
                );
                return false;
            }
        }

        // If we are just building a vestibule, then we can exit here...
        if (!buildStep.buildsInstances) {
            this.log.onStepSuccess(data, buildStep);
            return true;
        }

        const candidates = GWU.grid.alloc(site.width, site.height);

        let didSomething = false;

        do {
            didSomething = false;

            if (buildStep.buildAtOrigin) {
                candidates.set(data.originX, data.originY, 1);
                qualifyingTileCount = 1;
                wantCount = 1;
            } else {
                qualifyingTileCount = buildStep.markCandidates(
                    data,
                    candidates,
                    distanceBound
                );

                if (
                    buildStep.generateEverywhere ||
                    buildStep.repeatUntilNoProgress
                ) {
                    wantCount = qualifyingTileCount;
                } else {
                    wantCount = buildStep.count.value(site.rng);
                }

                this.log.onStepCandidates(
                    data,
                    buildStep,
                    candidates,
                    wantCount
                );

                // get rid of all error/invalid codes
                candidates.update((v) => (v == 1 ? 1 : 0));

                if (
                    !qualifyingTileCount ||
                    qualifyingTileCount < buildStep.count.lo
                ) {
                    this.log.onStepFail(
                        data,
                        buildStep,
                        `Only ${qualifyingTileCount} qualifying tiles - want ${buildStep.count.toString()}.`
                    );
                    return false;
                }
            }

            let x = 0,
                y = 0;

            while (qualifyingTileCount > 0 && builtCount < wantCount) {
                // Find a location for the feature.
                if (buildStep.buildAtOrigin) {
                    // Does the feature want to be at the origin? If so, put it there. (Just an optimization.)
                    x = data.originX;
                    y = data.originY;
                } else {
                    // Pick our candidate location randomly, and also strike it from
                    // the candidates map so that subsequent instances of this same feature can't choose it.
                    [x, y] = data.rng.matchingLoc(
                        candidates.width,
                        candidates.height,
                        (x, y) => candidates.get(x, y) == 1
                    );
                }
                // Don't waste time trying the same place again whether or not this attempt succeeds.
                candidates.set(x, y, 0);
                qualifyingTileCount--;

                const snapshot = data.site.snapshot();

                if (
                    this._buildStepInstance(data, buildStep, x, y, adoptedItem)
                ) {
                    // OK, if placement was successful, clear some personal space around the feature so subsequent features can't be generated too close.
                    qualifyingTileCount -= buildStep.makePersonalSpace(
                        data,
                        x,
                        y,
                        candidates
                    );
                    builtCount++; // we've placed an instance
                    didSomething = true;
                    snapshot.free(); // This snapshot is useless b/c we made changes...
                } else {
                    data.site.restore(snapshot); // need to undo any changes...
                    snapshot.free();
                }

                // Finished with this instance!
            }
        } while (didSomething && buildStep.repeatUntilNoProgress);

        GWU.grid.free(candidates);

        if (
            !buildStep.count.contains(builtCount) &&
            !buildStep.generateEverywhere &&
            !buildStep.repeatUntilNoProgress
        ) {
            this.log.onStepFail(
                data,
                buildStep,
                `Failed to build enough instances - want: ${buildStep.count.toString()}, built: ${builtCount}`
            );
            return false;
        }

        this.log.onStepSuccess(data, buildStep);

        return true;
    }

    _buildStepInstance(
        data: BuildData,
        buildStep: STEP.BuildStep,
        x: number,
        y: number,
        adoptedItem: ITEM.ItemInstance | null = null
    ): boolean {
        let success = true;
        let didSomething = true;

        const site = data.site;

        if (success && buildStep.treatAsBlocking) {
            // Yes, check for blocking.
            const options: Partial<DisruptOptions> = {
                machine: site.machineCount,
            };
            if (buildStep.noBlockOrigin) {
                options.updateWalkable = (g) => {
                    g.set(data.originX, data.originY, 1);
                    return true;
                };
            }
            if (SITE.siteDisruptedByXY(site, x, y, options)) {
                this.log.onStepInstanceFail(
                    data,
                    buildStep,
                    x,
                    y,
                    'instance blocks map'
                );
                success = false;
            }
        }

        // Try to build the DF first, if any, since we don't want it to be disrupted by subsequently placed terrain.
        if (success && buildStep.feature) {
            success = buildStep.feature(site, x, y);
            didSomething = success;
            if (!success) {
                this.log.onStepInstanceFail(
                    data,
                    buildStep,
                    x,
                    y,
                    'Failed to build effect - ' +
                        JSON.stringify(buildStep.feature)
                );
            }
        }

        // Now try to place the terrain tile, if any.
        if (success && buildStep.tile) {
            if (
                !buildStep.permitBlocking &&
                site.tileBlocksMove(buildStep.tile) &&
                !buildStep.treatAsBlocking // already did treatAsBlocking
            ) {
                if (
                    SITE.siteDisruptedByXY(site, x, y, {
                        machine: site.machineCount,
                    })
                ) {
                    this.log.onStepInstanceFail(
                        data,
                        buildStep,
                        x,
                        y,
                        'tile blocks site'
                    );
                    success = false;
                }
            }

            if (success) {
                success = site.setTile(x, y, buildStep.tile);
                didSomething = didSomething || success;
                if (!success) {
                    this.log.onStepInstanceFail(
                        data,
                        buildStep,
                        x,
                        y,
                        'failed to set tile - ' + buildStep.tile
                    );
                }
            }
        }

        let torch: ITEM.ItemInstance | null = adoptedItem;

        // Generate an item, if necessary
        if (success && buildStep.item) {
            const itemInfo = ITEM.pickItem(data.site.depth, buildStep.item);

            if (!itemInfo) {
                success = false;
                this.log.onStepInstanceFail(
                    data,
                    buildStep,
                    x,
                    y,
                    'Failed to make random item - ' +
                        JSON.stringify(buildStep.item)
                );
            } else {
                const item = ITEM.makeItem(itemInfo);
                if (buildStep.itemIsKey) {
                    item.key = {
                        x,
                        y,
                        disposable: !!buildStep.keyIsDisposable,
                    };
                }

                if (buildStep.outsourceItem) {
                    const result = this.buildRandom(
                        data.site,
                        BLUE.Flags.BP_ADOPT_ITEM,
                        -1,
                        -1,
                        item
                    );
                    if (result) {
                        didSomething = true;
                    } else {
                        this.log.onStepInstanceFail(
                            data,
                            buildStep,
                            x,
                            y,
                            'Failed to build machine to adopt item - ' + item.id
                        );
                        success = false;
                    }
                } else if (buildStep.hordeTakesItem) {
                    torch = item;
                } else {
                    success = site.addItem(x, y, item) > 0;
                    didSomething = didSomething || success;
                    if (!success) {
                        this.log.onStepInstanceFail(
                            data,
                            buildStep,
                            x,
                            y,
                            'Failed to add item to site - ' + item.id
                        );
                    }
                }
            }
        } else if (success && buildStep.adoptItem) {
            // adopt item if necessary
            if (!adoptedItem) {
                throw new Error(
                    'Failed to build blueprint because there is no adopted item.'
                );
            }

            if (success) {
                success = site.addItem(x, y, adoptedItem) > 0;
                if (success) {
                    didSomething = true;
                } else {
                    this.log.onStepInstanceFail(
                        data,
                        buildStep,
                        x,
                        y,
                        'Failed to add adopted item to site - ' + adoptedItem.id
                    );
                }
            }
        }

        let torchBearer: HORDE.ActorInstance | null = null;

        if (success && buildStep.horde) {
            let horde = HORDE.pickHorde(
                data.site.depth,
                buildStep.horde,
                site.rng
            );
            // if (buildStep.horde.random) {
            //     horde = GWM.horde.random({ rng: site.rng });
            // } else if (buildStep.horde.id) {
            //     horde = GWM.horde.from(buildStep.horde.id);
            // } else {
            //     buildStep.horde.rng = site.rng;
            //     horde = GWM.horde.random(buildStep.horde);
            // }
            if (!horde) {
                success = false;
                this.log.onStepInstanceFail(
                    data,
                    buildStep,
                    x,
                    y,
                    'Failed to pick horde - ' + JSON.stringify(buildStep.horde)
                );
            } else {
                if (horde.blueprint) {
                    const blueprint = BLUE.get(horde.blueprint);
                    const newData = new BuildData(
                        data.site,
                        blueprint,
                        data.machineNumber
                    );
                    const result = this._build(newData, x, y, null);
                    newData.free();
                    if (!result) {
                        return false;
                    }
                }

                const leader = HORDE.spawnHorde(horde, site, x, y, {
                    machine: site.machineCount,
                });
                if (!leader) {
                    success = false;
                    this.log.onStepInstanceFail(
                        data,
                        buildStep,
                        x,
                        y,
                        'Failed to build horde - ' + horde
                    );
                } else {
                    // What to do now?
                    didSomething = true;

                    // leader adopts item...
                    if (torch && buildStep.hordeTakesItem) {
                        torchBearer = leader;
                        torchBearer.item = torch;
                        torch.x = -1;
                        torch.y = -1;
                    }

                    if (horde.feature) {
                        horde.feature(site, x, y);
                    }

                    if (buildStep.horde.feature) {
                        buildStep.horde.feature(site, x, y);
                    }
                }
            }
        }

        if (success && didSomething) {
            // Mark the feature location as part of the machine, in case it is not already inside of it.
            if (!data.blueprint.noInteriorFlag) {
                site.setMachine(
                    x,
                    y,
                    data.machineNumber,
                    data.blueprint.isRoom
                );
            }

            // Mark the feature location as impregnable if requested.
            if (buildStep.impregnable) {
                site.makeImpregnable(x, y);
            }

            this.log.onStepInstanceSuccess(data, buildStep, x, y);
        } else if (didSomething) {
            // roll back any changes?
        }

        return success && didSomething;
    }
}

////////////////////////////////////////////////////
// TODO - Change this!!!
// const blue = BLUE.get(id | blue);
// const result =  blue.buildAt(map, x, y);
//
export function build(
    blueprint: BlueType,
    site: Site,
    x: number,
    y: number,
    opts?: Partial<BuilderOptions>
): BuildResult {
    const builder = new Builder(opts);

    return builder.build(site, blueprint, x, y);
}
