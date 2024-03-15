import * as GWU from 'gw-utils/index';
import * as SITE from '../site';
import { Blueprint } from './blueprint';

export class BuildData {
    site: SITE.Site;
    blueprint: Blueprint;
    interior: GWU.grid.NumGrid;
    occupied: GWU.grid.NumGrid;
    candidates: GWU.grid.NumGrid;
    viewMap: GWU.grid.NumGrid;
    distanceMap: GWU.path.DijkstraMap;
    originX: number = -1;
    originY: number = -1;
    distance25: number = -1;
    distance75: number = -1;
    machineNumber: number;
    // depth = 0;
    // seed = 0;

    constructor(site: SITE.Site, blueprint: Blueprint, machine = 0) {
        this.site = site;
        this.blueprint = blueprint;
        this.interior = GWU.grid.alloc(site.width, site.height);
        this.occupied = GWU.grid.alloc(site.width, site.height);
        this.viewMap = GWU.grid.alloc(site.width, site.height);
        this.distanceMap = new GWU.path.DijkstraMap(site.width, site.height);
        this.candidates = GWU.grid.alloc(site.width, site.height);
        this.machineNumber = machine;
    }

    free() {
        GWU.grid.free(this.interior);
        GWU.grid.free(this.occupied);
        GWU.grid.free(this.viewMap);
        GWU.grid.free(this.candidates);
    }

    get rng(): GWU.rng.Random {
        return this.site.rng;
    }

    reset(originX: number, originY: number) {
        this.interior.fill(0);
        this.occupied.fill(0);
        this.viewMap.fill(0);
        this.distanceMap.reset(this.site.width, this.site.height);
        // this.candidates.fill(0);

        this.originX = originX;
        this.originY = originY;
        this.distance25 = 0;
        this.distance75 = 0;

        // if (this.seed) {
        //     this.site.setSeed(this.seed);
        // }
    }

    calcDistances(maxDistance: number) {
        SITE.computeDistanceMap(
            this.site,
            this.distanceMap,
            this.originX,
            this.originY,
            maxDistance
        );

        let qualifyingTileCount = 0;
        const distances = new Array(100).fill(0);

        this.interior.forEach((v, x, y) => {
            if (!v) return;
            const dist = Math.round(this.distanceMap.getDistance(x, y));
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
