import * as GWU from 'gw-utils';
import * as GWM from 'gw-map';

import * as SITE from '../site';
import * as BLUE from './blueprint';

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

export class Builder {
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

    constructor(public map: GWM.map.Map, public depth: number) {
        this.site = new SITE.MapSite(map);
        this.interior = GWU.grid.alloc(map.width, map.height);
        this.occupied = GWU.grid.alloc(map.width, map.height);
        this.viewMap = GWU.grid.alloc(map.width, map.height);
        this.distanceMap = GWU.grid.alloc(map.width, map.height);
    }

    free() {
        GWU.grid.free(this.interior);
        GWU.grid.free(this.occupied);
        GWU.grid.free(this.viewMap);
        GWU.grid.free(this.distanceMap);
    }

    buildRandom(requiredMachineFlags = BLUE.Flags.BP_ROOM, x = -1, y = -1) {
        let tries = 10;
        while (tries--) {
            const blueprint = BLUE.random(requiredMachineFlags, this.depth);
            if (!blueprint) {
                continue;
            }

            if (this.build(blueprint, x, y)) {
                return true;
            }
        }

        console.log(
            'Failed to find blueprint matching flags: ' +
                GWU.flag.toString(BLUE.Flags, requiredMachineFlags)
        );
        return false;
    }

    build(blueprint: BLUE.Blueprint, x = -1, y = -1) {
        let tries = 10;

        this.site.analyze();

        if (x >= 0 && y >= 0) {
            return this._build(blueprint, x, y);
        }

        while (tries--) {
            const loc = blueprint.pickLocation(this.site);
            if (!loc) {
                continue;
            }

            if (this._build(blueprint, loc[0], loc[1])) {
                return true;
            }
        }

        console.log('Failed to build blueprint.');
        return false;
    }

    //////////////////////////////////////////
    // Returns true if the machine got built; false if it was aborted.
    // If empty array spawnedItems or spawnedMonsters is given, will pass those back for deletion if necessary.
    _build(blueprint: BLUE.Blueprint, originX: number, originY: number) {
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
            // console.log('BUILD COMPONENT', component);
            const count = component.build(this, blueprint);

            if (
                count == 0 ||
                (count < component.count.lo && !component.repeatUntilNoProgress)
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
