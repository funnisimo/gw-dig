import * as GWU from 'gw-utils';
import * as GWM from 'gw-map';

import * as SITE from '../site';
import * as BLUE from './blueprint';
import * as STEP from './buildStep';

import { BuildData, DataOptions } from './data';
import { NullLogger, BuildLogger } from './logger';
import { ConsoleLogger } from './consoleLogger';
import { DisruptOptions } from '../site';

export type BlueType = BLUE.Blueprint | string;

export interface BuilderOptions extends DataOptions {
    blueprints: BlueType[] | { [key: string]: BlueType };
    log: BuildLogger | boolean;
}

export class Builder {
    data: BuildData;
    blueprints: BLUE.Blueprint[] | null = null;
    log: BuildLogger;

    constructor(map: GWM.map.Map, options: Partial<BuilderOptions> = {}) {
        this.data = new BuildData(map, options);
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
    }

    _pickRandom(requiredFlags: number): BLUE.Blueprint | null {
        const blueprints = this.blueprints || Object.values(BLUE.blueprints);
        const weights = blueprints.map((b) => {
            if (!b.qualifies(requiredFlags)) return 0;
            return b.frequency(this.data.depth);
        });

        const index = this.data.map.rng.weighted(weights) as number;
        return blueprints[index] || null;
    }

    async buildRandom(
        requiredMachineFlags = BLUE.Flags.BP_ROOM,
        x = -1,
        y = -1,
        adoptedItem: GWM.item.Item | null = null
    ) {
        const data = this.data;
        data.site.analyze();

        let tries = 0;
        while (tries < 10) {
            const blueprint = this._pickRandom(requiredMachineFlags);
            if (!blueprint) {
                await this.log.onError(
                    data,
                    `Failed to find matching blueprint: requiredMachineFlags : ${GWU.flag.toString(
                        BLUE.Flags,
                        requiredMachineFlags
                    )}, depth: ${data.depth}`
                );
                return false;
            }

            await this.log.onBlueprintPick(
                data,
                blueprint,
                requiredMachineFlags,
                data.depth
            );

            if (await this._buildAt(blueprint, x, y, adoptedItem)) {
                return true;
            }
            ++tries;
        }

        // console.log(
        //     'Failed to build random blueprint matching flags: ' +
        //         GWU.flag.toString(BLUE.Flags, requiredMachineFlags) +
        //         ' tried : ' +
        //         tries.join(', ')
        // );
        return false;
    }

    async build(
        blueprint: BLUE.Blueprint | string,
        x = -1,
        y = -1,
        adoptedItem: GWM.item.Item | null = null
    ) {
        const data = this.data;

        if (typeof blueprint === 'string') {
            const id = blueprint;
            blueprint = BLUE.blueprints[id];
            if (!blueprint) throw new Error('Failed to find blueprint - ' + id);
        }

        data.site.analyze();

        return await this._buildAt(blueprint, x, y, adoptedItem);
    }

    async _buildAt(
        blueprint: BLUE.Blueprint,
        x = -1,
        y = -1,
        adoptedItem: GWM.item.Item | null = null
    ) {
        const data = this.data;
        if (x >= 0 && y >= 0) {
            return await this._build(blueprint, x, y, adoptedItem);
        }

        let count = await this._markCandidates(blueprint);
        if (!count) {
            return false;
        }

        let tries = 20; // TODO - Make property of Blueprint
        while (count-- && tries--) {
            const loc = BLUE.pickCandidateLoc(data, blueprint) || false;
            if (loc) {
                if (await this._build(blueprint, loc[0], loc[1], adoptedItem)) {
                    return true;
                }
            }
        }

        await this.log.onBlueprintFail(
            data,
            blueprint,
            'No suitable locations found to build blueprint.'
        );
        return false;
    }

    //////////////////////////////////////////
    // Returns true if the machine got built; false if it was aborted.
    // If empty array spawnedItems or spawnedMonsters is given, will pass those back for deletion if necessary.
    async _build(
        blueprint: BLUE.Blueprint,
        originX: number,
        originY: number,
        adoptedItem: GWM.item.Item | null = null
    ) {
        const data = this.data;
        data.reset(originX, originY);

        await this.log.onBlueprintStart(data, blueprint, adoptedItem);

        if (!(await this._computeInterior(blueprint))) {
            return false;
        }

        // This is the point of no return. Back up the level so it can be restored if we have to abort this machine after this point.
        const snapshot = data.site.snapshot();
        data.machineNumber = data.site.nextMachineId(); // Reserve this machine number, starting with 1.

        // Perform any transformations to the interior indicated by the blueprint flags, including expanding the interior if requested.
        BLUE.prepareInterior(data, blueprint);

        // Calculate the distance map (so that features that want to be close to or far from the origin can be placed accordingly)
        // and figure out the 33rd and 67th percentiles for features that want to be near or far from the origin.
        data.calcDistances(blueprint.size.hi);

        // Now decide which features will be skipped -- of the features marked MF_ALTERNATIVE, skip all but one, chosen randomly.
        // Then repeat and do the same with respect to MF_ALTERNATIVE_2, to provide up to two independent sets of alternative features per machine.

        const components = blueprint.pickComponents(data.site.rng);

        // Zero out occupied[][], and use it to keep track of the personal space around each feature that gets placed.

        // Now tick through the features and build them.
        for (let index = 0; index < components.length; index++) {
            const component = components[index];
            // console.log('BUILD COMPONENT', component);

            if (!(await this._buildStep(blueprint, component, adoptedItem))) {
                // failure! abort!
                // Restore the map to how it was before we touched it.
                await this.log.onBlueprintFail(
                    data,
                    blueprint,
                    `Failed to build step ${index + 1}.`
                );
                snapshot.restore();
                // abortItemsAndMonsters(spawnedItems, spawnedMonsters);
                return false;
            }
        }

        // Clear out the interior flag for all non-wired cells, if requested.
        if (blueprint.noInteriorFlag) {
            SITE.clearInteriorFlag(data.site, data.machineNumber);
        }

        // if (torchBearer && torch) {
        // 	if (torchBearer->carriedItem) {
        // 		deleteItem(torchBearer->carriedItem);
        // 	}
        // 	removeItemFromChain(torch, floorItems);
        // 	torchBearer->carriedItem = torch;
        // }

        await this.log.onBlueprintSuccess(data, blueprint);

        snapshot.cancel();

        // console.log('Built a machine from blueprint:', originX, originY);
        return true;
    }

    async _markCandidates(blueprint: BLUE.Blueprint): Promise<number> {
        const data = this.data;
        const count = BLUE.markCandidates(data, blueprint);

        if (count <= 0) {
            await this.log.onBlueprintFail(
                data,
                blueprint,
                'No suitable candidate locations found.'
            );
            return 0;
        }

        await this.log.onBlueprintCandidates(data, blueprint);

        return count;
    }

    async _computeInterior(blueprint: BLUE.Blueprint): Promise<boolean> {
        let fail = null;
        const data = this.data;
        let count = blueprint.fillInterior(data);

        // Now make sure the interior map satisfies the machine's qualifications.
        if (!count) {
            fail = 'Interior error.';
        } else if (!blueprint.size.contains(count)) {
            fail = `Interior wrong size - have: ${count}, want: ${blueprint.size.toString()}`;
        } else if (
            blueprint.treatAsBlocking &&
            SITE.siteDisruptedBy(data.site, data.interior, {
                machine: data.site.machineCount,
            })
        ) {
            fail = 'Interior blocks map.';
        } else if (
            blueprint.requireBlocking &&
            SITE.siteDisruptedSize(data.site, data.interior) < 100
        ) {
            fail = 'Interior does not block enough cells.';
        }

        if (!fail) {
            await this.log.onBlueprintInterior(data, blueprint);

            return true;
        }

        await this.log.onBlueprintFail(data, blueprint, fail);
        return false;
    }

    async _buildStep(
        blueprint: BLUE.Blueprint,
        buildStep: STEP.BuildStep,
        adoptedItem: GWM.item.Item | null
    ) {
        let wantCount = 0;
        let builtCount = 0;
        const data = this.data;

        const site = data.site;

        await this.log.onStepStart(data, blueprint, buildStep, adoptedItem);

        // console.log(
        //     'buildComponent',
        //     blueprint.id,
        //     blueprint.steps.indexOf(buildStep)
        // );

        // Figure out the distance bounds.
        const distanceBound = STEP.calcDistanceBound(data, buildStep);

        // If the StepFlags.BF_REPEAT_UNTIL_NO_PROGRESS flag is set, repeat until we fail to build the required number of instances.

        // Make a master map of candidate locations for this feature.
        let qualifyingTileCount = 0;

        if (buildStep.buildVestibule) {
            // Generate a door guard machine.
            // Try to create a sub-machine that qualifies.

            let success = await this.buildRandom(
                BLUE.Flags.BP_VESTIBULE,
                data.originX,
                data.originY
            );

            if (!success) {
                await this.log.onStepFail(
                    data,
                    blueprint,
                    buildStep,
                    'Failed to build vestibule'
                );
                return false;
            }
        }

        // If we are just building a vestibule, then we can exit here...
        if (!buildStep.buildsInstances) {
            await this.log.onStepSuccess(data, blueprint, buildStep);
            return true;
        }

        const candidates = GWU.grid.alloc(site.width, site.height);

        let didSomething = false;

        do {
            didSomething = false;

            if (buildStep.buildAtOrigin) {
                candidates[data.originX][data.originY] = 1;
                qualifyingTileCount = 1;
                wantCount = 1;
            } else {
                qualifyingTileCount = buildStep.markCandidates(
                    data,
                    blueprint,
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

                await this.log.onStepCandidates(
                    data,
                    blueprint,
                    buildStep,
                    candidates,
                    wantCount
                );

                if (
                    !qualifyingTileCount ||
                    qualifyingTileCount < buildStep.count.lo
                ) {
                    await this.log.onStepFail(
                        data,
                        blueprint,
                        buildStep,
                        `Blueprint ${
                            blueprint.id
                        }, step ${blueprint.steps.indexOf(
                            buildStep
                        )} - Only ${qualifyingTileCount} qualifying tiles - want ${buildStep.count.toString()}.`
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
                    [x, y] = this.data.map.rng.matchingLoc(
                        candidates.width,
                        candidates.height,
                        (x, y) => candidates[x][y] > 0
                    );
                }
                // Don't waste time trying the same place again whether or not this attempt succeeds.
                candidates[x][y] = 0;
                qualifyingTileCount--;

                const snapshot = data.site.snapshot();

                if (
                    await this._buildStepInstance(
                        blueprint,
                        buildStep,
                        x,
                        y,
                        adoptedItem
                    )
                ) {
                    // OK, if placement was successful, clear some personal space around the feature so subsequent features can't be generated too close.
                    qualifyingTileCount -= STEP.makePersonalSpace(
                        data,
                        x,
                        y,
                        candidates,
                        buildStep.pad
                    );
                    builtCount++; // we've placed an instance
                    didSomething = true;
                    snapshot.cancel(); // This snapshot is useless b/c we made changes...
                } else {
                    snapshot.restore(); // need to undo any changes...
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
            await this.log.onStepFail(
                data,
                blueprint,
                buildStep,
                `Failed to build enough instances - want: ${buildStep.count.toString()}, built: ${builtCount}`
            );
            return false;
        }

        await this.log.onStepSuccess(data, blueprint, buildStep);

        return true;
    }

    async _buildStepInstance(
        blueprint: BLUE.Blueprint,
        buildStep: STEP.BuildStep,
        x: number,
        y: number,
        adoptedItem: GWM.item.Item | null = null
    ): Promise<boolean> {
        let success = true;
        let didSomething = true;

        const data = this.data;
        const site = data.site;

        if (success && buildStep.treatAsBlocking) {
            // Yes, check for blocking.
            const options: Partial<DisruptOptions> = {
                machine: site.machineCount,
            };
            if (buildStep.noBlockOrigin) {
                options.updateWalkable = (g) => {
                    g[data.originX][data.originY] = 1;
                    return true;
                };
            }
            if (SITE.siteDisruptedByXY(site, x, y, options)) {
                await this.log.onStepInstanceFail(
                    data,
                    blueprint,
                    buildStep,
                    x,
                    y,
                    'instance blocks map'
                );
                success = false;
            }
        }

        // Try to build the DF first, if any, since we don't want it to be disrupted by subsequently placed terrain.
        if (success && buildStep.effect) {
            success = site.buildEffect(buildStep.effect, x, y);
            didSomething = success;
            if (!success) {
                this.log.onStepInstanceFail(
                    data,
                    blueprint,
                    buildStep,
                    x,
                    y,
                    'Failed to build effect - ' +
                        JSON.stringify(buildStep.effect)
                );
            }
        }

        // Now try to place the terrain tile, if any.
        if (success && buildStep.tile !== -1) {
            const tile = GWM.tile.get(buildStep.tile);

            if (
                !buildStep.permitBlocking &&
                tile.blocksMove() &&
                !buildStep.treatAsBlocking // already did treatAsBlocking
            ) {
                if (
                    SITE.siteDisruptedByXY(site, x, y, {
                        machine: site.machineCount,
                    })
                ) {
                    await this.log.onStepInstanceFail(
                        data,
                        blueprint,
                        buildStep,
                        x,
                        y,
                        'tile blocks site'
                    );
                    success = false;
                }
            }

            if (success) {
                success = site.setTile(x, y, tile);
                didSomething = didSomething || success;
                if (!success) {
                    await this.log.onStepInstanceFail(
                        data,
                        blueprint,
                        buildStep,
                        x,
                        y,
                        'failed to set tile - ' + tile.id
                    );
                }
            }
        }

        // Generate an actor, if necessary

        // Generate an item, if necessary
        if (success && buildStep.item) {
            const item = site.makeRandomItem(buildStep.item);
            if (!item) {
                success = false;
                await this.log.onStepInstanceFail(
                    data,
                    blueprint,
                    buildStep,
                    x,
                    y,
                    'Failed to make random item - ' +
                        JSON.stringify(buildStep.item)
                );
            } else {
                if (buildStep.itemIsKey) {
                    item.key = GWM.entity.makeKeyInfo(
                        x,
                        y,
                        !!buildStep.keyIsDisposable
                    );
                }

                if (buildStep.outsourceItem) {
                    success = await this.buildRandom(
                        BLUE.Flags.BP_ADOPT_ITEM,
                        -1,
                        -1,
                        item
                    );
                    if (success) {
                        didSomething = true;
                    } else {
                        await this.log.onStepInstanceFail(
                            data,
                            blueprint,
                            buildStep,
                            x,
                            y,
                            'Failed to build machine to adopt item - ' +
                                item.kind.id
                        );
                    }
                } else {
                    success = site.addItem(x, y, item);
                    didSomething = didSomething || success;
                    if (!success) {
                        await this.log.onStepInstanceFail(
                            data,
                            blueprint,
                            buildStep,
                            x,
                            y,
                            'Failed to add item to site - ' + item.kind.id
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
                success = site.addItem(x, y, adoptedItem);
                if (success) {
                    didSomething = true;
                } else {
                    await this.log.onStepInstanceFail(
                        data,
                        blueprint,
                        buildStep,
                        x,
                        y,
                        'Failed to add adopted item to site - ' +
                            adoptedItem.kind.id
                    );
                }
            }
        }

        if (success && didSomething) {
            // Mark the feature location as part of the machine, in case it is not already inside of it.
            if (!blueprint.noInteriorFlag) {
                site.setMachine(x, y, data.machineNumber, blueprint.isRoom);
            }

            // Mark the feature location as impregnable if requested.
            if (buildStep.impregnable) {
                site.setCellFlag(x, y, GWM.flags.Cell.IMPREGNABLE);
            }

            await this.log.onStepInstanceSuccess(
                data,
                blueprint,
                buildStep,
                x,
                y
            );
        } else if (didSomething) {
            // roll back any changes?
        }

        return success && didSomething;
    }
}
