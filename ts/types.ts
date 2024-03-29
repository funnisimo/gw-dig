import * as GWU from 'gw-utils';

export interface RoomConfig {
    fn?: RoomFn;
    door?: boolean | number;
    doorChance?: number;
    tile?: number;
    [x: string]: any;
}

export type RoomFn = (
    config: RoomConfig,
    grid: GWU.grid.NumGrid
) => Room | RoomConfig | null;

export interface RoomData extends RoomConfig {
    fn: RoomFn;
    id: string;
}

export type HallFn = (
    opts: HallConfig,
    grid: GWU.grid.NumGrid,
    room: Room
) => Hall | any | null;
export interface HallConfig {
    fn?: HallFn;
    chance?: number;
    length?: GWU.range.RangeBase | [GWU.range.RangeBase, GWU.range.RangeBase];
    width?: GWU.range.RangeBase;
    tile?: number;
    [x: string]: any;
}

export interface HallData extends HallConfig {
    fn: HallFn;
    id: string;
}

export interface DigConfig {
    room: string | any;
    hall?: string | HallConfig | boolean;
    tries?: number;
    locs?: GWU.xy.Loc[];
    loc?: GWU.xy.Loc;
    door?: number | boolean;
}

export class Hall {
    public x: number;
    public y: number;
    public x2: number;
    public y2: number;
    public length: number;

    public dir: number;
    public width: number = 1;

    public doors: GWU.xy.Loc[] = [];

    constructor(loc: GWU.xy.Loc, dir: number, length: number, width = 1) {
        this.x = loc[0];
        this.y = loc[1];
        const d = GWU.xy.DIRS[dir];
        this.length = length;
        this.width = width;
        if (dir === GWU.xy.UP || dir === GWU.xy.DOWN) {
            this.x2 = this.x + (width - 1);
            this.y2 = this.y + (length - 1) * d[1];
        } else {
            this.x2 = this.x + (length - 1) * d[0];
            this.y2 = this.y + (width - 1);
        }
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

export class Room {
    public digger: string;
    public x: number;
    public y: number;
    public width: number;
    public height: number;

    public doors: GWU.xy.Loc[] = [];

    public hall: Hall | null = null;

    constructor(
        digger: string,
        x: number,
        y: number,
        width: number,
        height: number
    ) {
        this.digger = digger;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
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

export interface DigInfo {
    room: RoomData;
    hall: HallData | null;
    tries: number;
    locs: GWU.xy.Loc[] | null;
    door: number;
}
