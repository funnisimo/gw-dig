import * as GW from 'gw-utils';
import * as SITE from './site';
import * as BLUE from './blueprint';
import { StepFlags } from './buildStep';

export interface BuildData {
    site: SITE.BuildSite;
    spawnedItems: any[];
    spawnedHordes: any[];
    interior: GW.grid.NumGrid;
    occupied: GW.grid.NumGrid;
    viewMap: GW.grid.NumGrid;
    distanceMap: GW.grid.NumGrid;
    originX: number;
    originY: number;
    distance25: number;
    distance75: number;
    machineNumber: number;
}

export class Builder {
    public spawnedItems: any[] = [];
    public spawnedHordes: any[] = [];
    public interior: GW.grid.NumGrid;
    public occupied: GW.grid.NumGrid;
    public viewMap: GW.grid.NumGrid;
    public distanceMap: GW.grid.NumGrid;
    public originX: number = -1;
    public originY: number = -1;
    public distance25: number = -1;
    public distance75: number = -1;
    public machineNumber = 0;

    constructor(public site: SITE.BuildSite, public depth: number) {
        this.interior = GW.grid.alloc(site.width, site.height);
        this.occupied = GW.grid.alloc(site.width, site.height);
        this.viewMap = GW.grid.alloc(site.width, site.height);
        this.distanceMap = GW.grid.alloc(site.width, site.height);
    }

    free() {
        GW.grid.free(this.interior);
        GW.grid.free(this.occupied);
        GW.grid.free(this.viewMap);
        GW.grid.free(this.distanceMap);
    }

    buildRandom(requiredMachineFlags = BLUE.Flags.BP_ROOM) {
        let tries = 10;
        while (tries--) {
            const blueprint = BLUE.random(requiredMachineFlags, this.depth);
            if (!blueprint) {
                continue;
            }

            if (this.buildBlueprint(blueprint)) {
                return true;
            }
        }

        console.log(
            'Failed to find blueprint matching flags: ' +
                GW.flag.toString(BLUE.Flags, requiredMachineFlags)
        );
        return false;
    }

    buildBlueprint(blueprint: BLUE.Blueprint) {
        let tries = 10;
        while (tries--) {
            const loc = blueprint.pickLocation(this.site);
            if (!loc) {
                continue;
            }

            if (this.build(blueprint, loc[0], loc[1])) {
                return true;
            }
        }

        console.log('Failed to build blueprint.');
        return false;
    }

    //////////////////////////////////////////
    // Returns true if the machine got built; false if it was aborted.
    // If empty array spawnedItems or spawnedMonsters is given, will pass those back for deletion if necessary.
    build(blueprint: BLUE.Blueprint, originX: number, originY: number) {
        this.interior.fill(0);
        this.occupied.fill(0);
        this.viewMap.fill(0);
        this.distanceMap.fill(0);

        this.originX = originX;
        this.originY = originY;

        if (!blueprint.computeInterior(this)) {
            return false;
        }

        // This is the point of no return. Back up the level so it can be restored if we have to abort this machine after this point.
        const levelBackup = this.site.backup();
        this.machineNumber = this.site.nextMachineId(); // Reserve this machine number, starting with 1.

        // Perform any transformations to the interior indicated by the blueprint flags, including expanding the interior if requested.
        blueprint.prepareInteriorWithMachineFlags(this);

        // Calculate the distance map (so that features that want to be close to or far from the origin can be placed accordingly)
        // and figure out the 33rd and 67th percentiles for features that want to be near or far from the origin.
        blueprint.calcDistances(this);

        // Now decide which features will be skipped -- of the features marked MF_ALTERNATIVE, skip all but one, chosen randomly.
        // Then repeat and do the same with respect to MF_ALTERNATIVE_2, to provide up to two independent sets of alternative features per machine.

        const components = blueprint.pickComponents();

        // Keep track of all monsters and items that we spawn -- if we abort, we have to go back and delete them all.
        // let itemCount = 0, monsterCount = 0;

        // Zero out occupied[][], and use it to keep track of the personal space around each feature that gets placed.

        // Now tick through the features and build them.
        for (let index = 0; index < components.length; index++) {
            const component = components[index];
            console.log('BUILD COMPONENT', component);
            const count = component.build(this, blueprint);

            if (
                count < component.count.lo &&
                !(component.flags & StepFlags.BF_REPEAT_UNTIL_NO_PROGRESS)
            ) {
                // failure! abort!
                console.log(
                    'Failed to place blueprint because of feature; needed more instances.'
                );
                // Restore the map to how it was before we touched it.
                this.site.restore(levelBackup);
                // abortItemsAndMonsters(spawnedItems, spawnedMonsters);
                return false;
            }
        }

        // Clear out the interior flag for all non-wired cells, if requested.
        if (blueprint.noInteriorFlag) {
            blueprint.clearInteriorFlag(this);
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
}
