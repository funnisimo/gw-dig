import * as GWU from 'gw-utils';
import * as GWM from 'gw-map';

import * as SITE from '../site';
import * as BLUE from './blueprint';
import * as STEP from './buildStep';

// export interface BuildData {
//     site: SITE.BuildSite;
//     spawnedItems: any[];
//     spawnedHordes: any[];
//     interior: GWU.grid.NumGrid;
//     occupied: GWU.grid.NumGrid;
//     viewMap: GWU.grid.NumGrid;
//     distanceMap: GWU.grid.NumGrid;
//     originX: number;
//     originY: number;
//     distance25: number;
//     distance75: number;
//     machineNumber: number;
// }

export class BuildData {
    public site: SITE.MapSite;
    public spawnedItems: GWM.item.Item[] = [];
    public spawnedHordes: GWM.actor.Actor[] = [];
    public interior: GWU.grid.NumGrid;
    public occupied: GWU.grid.NumGrid;
    public viewMap: GWU.grid.NumGrid;
    public distanceMap: GWU.grid.NumGrid;
    public originX: number = -1;
    public originY: number = -1;
    public distance25: number = -1;
    public distance75: number = -1;
    public machineNumber = 0;
    public depth = 0;

    constructor(public map: GWM.map.Map, depth: number) {
        this.site = new SITE.MapSite(map);
        this.interior = GWU.grid.alloc(map.width, map.height);
        this.occupied = GWU.grid.alloc(map.width, map.height);
        this.viewMap = GWU.grid.alloc(map.width, map.height);
        this.distanceMap = GWU.grid.alloc(map.width, map.height);
        this.depth = depth;
    }

    free() {
        GWU.grid.free(this.interior);
        GWU.grid.free(this.occupied);
        GWU.grid.free(this.viewMap);
        GWU.grid.free(this.distanceMap);
    }

    reset(originX: number, originY: number) {
        this.interior.fill(0);
        this.occupied.fill(0);
        this.viewMap.fill(0);
        this.distanceMap.fill(0);

        this.originX = originX;
        this.originY = originY;
    }

    calcDistances(maxSize: number) {
        this.distanceMap.fill(0);
        SITE.computeDistanceMap(
            this.site,
            this.distanceMap,
            this.originX,
            this.originY,
            maxSize
        );
        let qualifyingTileCount = 0;
        const distances = new Array(100).fill(0);

        this.interior.forEach((v, x, y) => {
            if (!v) return;
            const dist = this.distanceMap[x][y];
            if (dist < 100) {
                distances[dist]++; // create a histogram of distances -- poor man's sort function
                qualifyingTileCount++;
            }
        });

        let distance25 = Math.round(qualifyingTileCount / 4);
        let distance75 = Math.round((3 * qualifyingTileCount) / 4);
        for (let i = 0; i < 100; i++) {
            if (distance25 <= distances[i]) {
                distance25 = i;
                break;
            } else {
                distance25 -= distances[i];
            }
        }

        for (let i = 0; i < 100; i++) {
            if (distance75 <= distances[i]) {
                distance75 = i;
                break;
            } else {
                distance75 -= distances[i];
            }
        }

        this.distance25 = distance25;
        this.distance75 = distance75;
    }
}

export class Builder {
    data: BuildData;

    constructor(map: GWM.map.Map, depth: number) {
        this.data = new BuildData(map, depth);
    }

    async buildRandom(
        requiredMachineFlags = BLUE.Flags.BP_ROOM,
        x = -1,
        y = -1,
        adoptedItem: GWM.item.Item | null = null
    ) {
        this.data.site.analyze();

        let tries = [];
        while (tries.length < 10) {
            const blueprint = BLUE.random(
                requiredMachineFlags,
                this.data.depth
            );
            if (!blueprint) {
                return false;
            }
            tries.push(blueprint.id);

            if (await this._buildAt(blueprint, x, y, adoptedItem)) {
                return true;
            }
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
        if (typeof blueprint === 'string') {
            const id = blueprint;
            blueprint = BLUE.blueprints[id];
            if (!blueprint) throw new Error('Failed to find blueprint - ' + id);
        }

        this.data.site.analyze();

        return this._buildAt(blueprint, x, y, adoptedItem);
    }

    async _buildAt(
        blueprint: BLUE.Blueprint,
        x = -1,
        y = -1,
        adoptedItem: GWM.item.Item | null = null
    ) {
        if (x >= 0 && y >= 0) {
            return await this._build(blueprint, x, y, adoptedItem);
        }
        let tries = 10;

        while (tries--) {
            const loc = await this.pickLocation(blueprint);
            if (!loc) {
                continue;
            }

            if (await this._build(blueprint, loc[0], loc[1], adoptedItem)) {
                return true;
            }
        }

        // console.log('Failed to build blueprint - ' + blueprint.id);
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

        if (!(await this.computeInterior(blueprint))) {
            return false;
        }

        // This is the point of no return. Back up the level so it can be restored if we have to abort this machine after this point.
        const levelBackup = data.site.backup();
        data.machineNumber = data.site.nextMachineId(); // Reserve this machine number, starting with 1.

        // Perform any transformations to the interior indicated by the blueprint flags, including expanding the interior if requested.
        BLUE.prepareInterior(data, blueprint);

        // Calculate the distance map (so that features that want to be close to or far from the origin can be placed accordingly)
        // and figure out the 33rd and 67th percentiles for features that want to be near or far from the origin.
        this.data.calcDistances(blueprint.size.hi);

        // Now decide which features will be skipped -- of the features marked MF_ALTERNATIVE, skip all but one, chosen randomly.
        // Then repeat and do the same with respect to MF_ALTERNATIVE_2, to provide up to two independent sets of alternative features per machine.

        const components = blueprint.pickComponents();

        // Zero out occupied[][], and use it to keep track of the personal space around each feature that gets placed.

        // Now tick through the features and build them.
        for (let index = 0; index < components.length; index++) {
            const component = components[index];
            // console.log('BUILD COMPONENT', component);

            if (
                !(await this.buildComponent(blueprint, component, adoptedItem))
            ) {
                // failure! abort!
                // Restore the map to how it was before we touched it.
                data.site.restore(levelBackup);
                // abortItemsAndMonsters(spawnedItems, spawnedMonsters);
                return false;
            }
        }

        // Clear out the interior flag for all non-wired cells, if requested.
        if (blueprint.noInteriorFlag) {
            SITE.clearInteriorFlag(data.site, this.data.machineNumber);
        }

        // if (torchBearer && torch) {
        // 	if (torchBearer->carriedItem) {
        // 		deleteItem(torchBearer->carriedItem);
        // 	}
        // 	removeItemFromChain(torch, floorItems);
        // 	torchBearer->carriedItem = torch;
        // }

        // console.log('Built a machine from blueprint:', originX, originY);
        return true;
    }

    async pickLocation(blueprint: BLUE.Blueprint) {
        return BLUE.pickLocation(this.data.site, blueprint);
    }

    async computeInterior(blueprint: BLUE.Blueprint) {
        return BLUE.computeInterior(this.data, blueprint);
    }

    async buildComponent(
        blueprint: BLUE.Blueprint,
        buildStep: STEP.BuildStep,
        adoptedItem: GWM.item.Item | null
    ) {
        let wantCount = 0;
        let builtCount = 0;
        const builder = this.data;

        const site = builder.site;

        const candidates = GWU.grid.alloc(site.width, site.height);

        // console.log(
        //     'buildComponent',
        //     blueprint.id,
        //     blueprint.steps.indexOf(buildStep)
        // );

        // Figure out the distance bounds.
        const distanceBound = STEP.calcDistanceBound(builder, buildStep);
        STEP.updateViewMap(builder, buildStep);

        // If the StepFlags.BF_REPEAT_UNTIL_NO_PROGRESS flag is set, repeat until we fail to build the required number of instances.

        // Make a master map of candidate locations for this feature.
        let qualifyingTileCount = STEP.markCandidates(
            candidates,
            builder,
            blueprint,
            buildStep,
            distanceBound
        );

        if (!buildStep.generateEverywhere) {
            wantCount = buildStep.count.value();
        }

        if (!qualifyingTileCount || qualifyingTileCount < buildStep.count.lo) {
            // console.log(
            //     `Blueprint ${blueprint.id}, step ${blueprint.steps.indexOf(
            //         buildStep
            //     )} - Only ${qualifyingTileCount} qualifying tiles - want ${buildStep.count.toString()}.`
            // );
            return false;
        }

        let x = 0,
            y = 0;

        let success = true;
        let didSomething = false;

        do {
            success = true;
            // Find a location for the feature.
            if (buildStep.buildAtOrigin) {
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
            if (buildStep.effect) {
                success = site.fireEffect(buildStep.effect, x, y);
                didSomething = success;
            }

            // Now try to place the terrain tile, if any.
            if (success && buildStep.tile !== -1) {
                const tile = GWM.tile.get(buildStep.tile);
                if (
                    !buildStep.permitBlocking &&
                    (tile.blocksMove() || buildStep.treatAsBlocking)
                ) {
                    // Yes, check for blocking.
                    success = !SITE.siteDisruptedByXY(site, x, y, {
                        machine: site.machineCount,
                    });
                }
                if (success) {
                    success = site.setTile(x, y, tile);
                    didSomething = didSomething || success;
                }
            }

            // Generate an actor, if necessary

            // Generate an item, if necessary
            if (success && buildStep.item) {
                const item = site.makeRandomItem(buildStep.item);
                if (!item) {
                    success = false;
                }

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
                    }
                } else {
                    success = site.addItem(x, y, item);
                    didSomething = didSomething || success;
                }
            } else if (success && buildStep.adoptItem) {
                // adopt item if necessary
                if (!adoptedItem) {
                    throw new Error(
                        'Failed to build blueprint because there is no adopted item.'
                    );
                }

                if (buildStep.treatAsBlocking) {
                    // Yes, check for blocking.
                    success = !SITE.siteDisruptedByXY(site, x, y);
                }

                if (success) {
                    success = site.addItem(x, y, adoptedItem);
                    if (success) {
                        didSomething = true;
                    } else {
                        console.log('- failed to add item', x, y);
                    }
                } else {
                    // console.log('- blocks map', x, y);
                }
            }

            if (success && didSomething) {
                // OK, if placement was successful, clear some personal space around the feature so subsequent features can't be generated too close.
                qualifyingTileCount -= STEP.makePersonalSpace(
                    builder,
                    x,
                    y,
                    candidates,
                    buildStep.pad
                );
                builtCount++; // we've placed an instance

                // Mark the feature location as part of the machine, in case it is not already inside of it.
                if (!blueprint.noInteriorFlag) {
                    site.setMachine(
                        x,
                        y,
                        builder.machineNumber,
                        blueprint.isRoom
                    );
                }

                // Mark the feature location as impregnable if requested.
                if (buildStep.impregnable) {
                    site.setCellFlag(x, y, GWM.flags.Cell.IMPREGNABLE);
                }
            }

            // Finished with this instance!
        } while (
            qualifyingTileCount > 0 &&
            (buildStep.generateEverywhere ||
                builtCount < wantCount ||
                buildStep.repeatUntilNoProgress)
        );

        if (success && buildStep.buildVestibule) {
            // Generate a door guard machine.
            // Try to create a sub-machine that qualifies.

            success = await this.buildRandom(
                BLUE.Flags.BP_VESTIBULE,
                builder.originX,
                builder.originY
            );

            if (!success) {
                // console.log(
                //     `Depth ${builder.depth}: Failed to place blueprint ${blueprint.id} because it requires a vestibule and we couldn't place one.`
                // );
                // failure! abort!
                return false;
            }
            ++builtCount;
        }

        //DEBUG printf("\nFinished feature %i. Here's the candidates map:", feat);
        //DEBUG logBuffer(candidates);

        success = builtCount > 0;

        GWU.grid.free(candidates);
        return success;
    }
}
