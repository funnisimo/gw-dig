import * as GWU from 'gw-utils';
import * as GWM from 'gw-map';
import * as SITE from '../site';

export interface DataOptions {
    depth: number;
    seed: number;
}

export class BuildData {
    public site: SITE.MapSite;
    public interior: GWU.grid.NumGrid;
    public occupied: GWU.grid.NumGrid;
    public candidates: GWU.grid.NumGrid;
    public viewMap: GWU.grid.NumGrid;
    public distanceMap: GWU.grid.NumGrid;
    public originX: number = -1;
    public originY: number = -1;
    public distance25: number = -1;
    public distance75: number = -1;
    public machineNumber = 0;
    public depth = 0;
    public seed = 0;

    constructor(public map: GWM.map.Map, options: Partial<DataOptions> = {}) {
        this.site = new SITE.MapSite(map);
        this.interior = GWU.grid.alloc(map.width, map.height);
        this.occupied = GWU.grid.alloc(map.width, map.height);
        this.viewMap = GWU.grid.alloc(map.width, map.height);
        this.distanceMap = GWU.grid.alloc(map.width, map.height);
        this.candidates = GWU.grid.alloc(map.width, map.height);
        this.depth = options.depth || 1;
        this.seed = options.seed || 0;
    }

    free() {
        GWU.grid.free(this.interior);
        GWU.grid.free(this.occupied);
        GWU.grid.free(this.viewMap);
        GWU.grid.free(this.distanceMap);
        GWU.grid.free(this.candidates);
    }

    reset(originX: number, originY: number) {
        this.interior.fill(0);
        this.occupied.fill(0);
        this.viewMap.fill(0);
        this.distanceMap.fill(0);
        // this.candidates.fill(0);

        this.originX = originX;
        this.originY = originY;
        this.distance25 = 0;
        this.distance75 = 0;

        if (this.seed) {
            this.site.setSeed(this.seed);
        }
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
