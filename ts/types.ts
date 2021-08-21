import * as GW from 'gw-utils';

export interface RoomConfig {
    // fn?: RoomFn;
    // door?: boolean | number;
    // doorChance?: number;
    tile?: number;
    [x: string]: any;
}

// export type RoomFn = (
//     config: RoomConfig,
//     grid: GW.grid.NumGrid
// ) => Room | RoomConfig | null;

// export interface RoomData extends RoomConfig {
//     fn: RoomFn;
//     id: string;
// }

// export type HallFn = (
//     opts: HallConfig,
//     grid: GW.grid.NumGrid,
//     room: Room
// ) => Hall | any | null;
// export interface HallConfig {
//     fn?: HallFn;
//     chance?: number;
//     length?: GW.range.RangeBase | [GW.range.RangeBase, GW.range.RangeBase];
//     width?: GW.range.RangeBase;
//     tile?: number;
//     [x: string]: any;
// }

// export interface HallData extends HallConfig {
//     fn: HallFn;
//     id: string;
// }

// export interface DigConfig {
//     room: string | any;
//     hall?: string | HallConfig | boolean;
//     tries?: number;
//     locs?: GW.utils.Loc[];
//     loc?: GW.utils.Loc;
//     door?: number | boolean;
// }

export type DigFn = (x: number, y: number, tile: number) => any;

export class Hall {
    public x: number;
    public y: number;
    public x2: number;
    public y2: number;
    public length: number;

    public dir: number;
    public width: number = 1;

    public doors: GW.utils.Loc[] = [];

    constructor(loc: GW.utils.Loc, dir: number, length: number, width = 1) {
        this.x = loc[0];
        this.y = loc[1];
        const d = GW.utils.DIRS[dir];
        this.length = length;
        this.width = width;

        // console.log('Hall', loc, d, length, width);

        if (dir === GW.utils.UP || dir === GW.utils.DOWN) {
            this.x2 = this.x + (width - 1);
            this.y2 = this.y + (length - 1) * d[1];
        } else {
            this.x2 = this.x + (length - 1) * d[0];
            this.y2 = this.y + (width - 1);
        }

        // console.log(' - ', [this.x2, this.y2]);

        this.dir = dir;
    }

    translate(dx: number, dy: number) {
        this.x += dx;
        this.y += dy;
        this.x2 += dx;
        this.y2 += dy;
        if (this.doors) {
            this.doors.forEach((d) => {
                if (!d) return;
                if (d[0] < 0 || d[1] < 0) return;
                d[0] += dx;
                d[1] += dy;
            });
        }
    }
}

export class Room extends GW.utils.Bounds {
    public doors: GW.utils.Loc[] = [];
    public hall: Hall | null = null;

    constructor(x: number, y: number, width: number, height: number) {
        super(x, y, width, height);
    }

    get cx() {
        return this.x + Math.floor(this.width / 2);
    }
    get cy() {
        return this.y + Math.floor(this.height / 2);
    }

    translate(dx: number, dy: number) {
        this.x += dx;
        this.y += dy;

        if (this.doors) {
            this.doors.forEach((d) => {
                if (!d) return;
                if (d[0] < 0 || d[1] < 0) return;
                d[0] += dx;
                d[1] += dy;
            });
        }

        if (this.hall) {
            this.hall.translate(dx, dy);
        }
    }
}

// export interface DigInfo {
//     room: RoomData;
//     hall: HallData | null;
//     tries: number;
//     locs: GW.utils.Loc[] | null;
//     door: number;
// }
