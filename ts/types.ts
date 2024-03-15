import * as GWU from 'gw-utils/index';

export type TileId = string;

export interface RoomConfig {
    // fn?: RoomFn;
    // door?: boolean | number;
    // doorChance?: number;
    tile?: TileId;
    [x: string]: any;
}

// export type RoomFn = (
//     config: RoomConfig,
//     grid: GWU.grid.NumGrid
// ) => Room | RoomConfig | null;

// export interface RoomData extends RoomConfig {
//     fn: RoomFn;
//     id: string;
// }

// export type HallFn = (
//     opts: HallConfig,
//     grid: GWU.grid.NumGrid,
//     room: Room
// ) => Hall | any | null;
// export interface HallConfig {
//     fn?: HallFn;
//     chance?: number;
//     length?: GWU.range.RangeBase | [GWU.range.RangeBase, GWU.range.RangeBase];
//     width?: GWU.range.RangeBase;
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
//     locs?: GWU.xy.Loc[];
//     loc?: GWU.xy.Loc;
//     door?: number | boolean;
// }

export type DigFn = (x: number, y: number, tile: number) => any;

export class Hall extends GWU.xy.Bounds {
    public doors: GWU.xy.Loc[] = [];

    constructor(x: number, y: number, width: number, height: number) {
        super(x, y, width, height);
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
    }
}

export function makeHall(
    loc: GWU.xy.Loc,
    dirIndex: number,
    hallLength: number,
    hallWidth = 1
) {
    const dir = GWU.xy.DIRS[dirIndex];
    const x = Math.min(loc[0], loc[0] + dir[0] * (hallLength - 1));
    const y = Math.min(loc[1], loc[1] + dir[1] * (hallLength - 1));
    const width = Math.abs(dir[0] * hallLength) || hallWidth;
    const height = Math.abs(dir[1] * hallLength) || hallWidth;
    return new Hall(x, y, width, height);
}

export class Room extends GWU.xy.Bounds {
    public doors: GWU.xy.Loc[] = [];
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
//     locs: GWU.xy.Loc[] | null;
//     door: number;
// }
