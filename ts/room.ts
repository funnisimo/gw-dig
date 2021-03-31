import * as GW from 'gw-utils';
import * as CONST from './tiles';

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
        if (dir === GW.utils.UP || dir === GW.utils.DOWN) {
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

    public doors: GW.utils.Loc[] = [];

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

export interface RoomConfig {
    fn?: RoomFn;
    door?: boolean | number;
    doorChance?: number;
    tile?: number;
    [x: string]: any;
}

export type RoomFn = (
    config: RoomConfig,
    grid: GW.grid.NumGrid
) => Room | RoomConfig | null;

export interface RoomData extends RoomConfig {
    fn: RoomFn;
    id: string;
}

export var rooms: Record<string, RoomData> = {};

export function install(id: string, fn: RoomFn, config?: RoomConfig) {
    // @ts-ignore
    const data: RoomData = fn(config || {}); // call to have function setup the config
    data.fn = fn;
    data.id = id;
    rooms[id] = data;
    return data;
}

install('DEFAULT', rectangular);

export function checkConfig(config: RoomConfig, expected: any) {
    config = config || {};
    expected = expected || {};

    Object.entries(expected).forEach(([key, expect]) => {
        let have = config[key];

        if (key === 'tile') {
            if (have === undefined) {
                config[key] = expect as number;
            }
            return;
        }
        if (expect === true) {
            // needs to be present
            if (!have) {
                return GW.utils.ERROR(
                    'Missing required config for digger: ' + key
                );
            }
        } else if (typeof expect === 'number') {
            // needs to be a number, this is the default
            have = have || expect;
        } else if (Array.isArray(expect)) {
            have = have || expect;
        } else {
            // just set the value
            have = have || expect;
        }

        const range = GW.range.make(have); // throws if invalid
        config[key] = range;
    });

    return config;
}

export function cavern(config: RoomConfig, grid: GW.grid.NumGrid) {
    config = checkConfig(config, { width: 12, height: 8 });
    if (!grid) return config;

    let destX, destY;
    let blobGrid;

    const width = config.width.value();
    const height = config.height.value();
    const tile = config.tile || CONST.FLOOR;

    blobGrid = GW.grid.alloc(grid.width, grid.height, 0);

    const minWidth = Math.floor(0.5 * width); // 6
    const maxWidth = width;
    const minHeight = Math.floor(0.5 * height); // 4
    const maxHeight = height;

    grid.fill(0);
    const bounds = blobGrid.fillBlob(
        5,
        minWidth,
        minHeight,
        maxWidth,
        maxHeight,
        55,
        'ffffffttt',
        'ffffttttt'
    );

    // Position the new cave in the middle of the grid...
    destX = Math.floor((grid.width - bounds.width) / 2);
    destY = Math.floor((grid.height - bounds.height) / 2);

    // ...and copy it to the master grid.
    GW.grid.offsetZip(grid, blobGrid, destX - bounds.x, destY - bounds.y, tile);
    GW.grid.free(blobGrid);
    return new Room(config.id, destX, destY, bounds.width, bounds.height);
}

export function choiceRoom(
    config: RoomConfig,
    grid: GW.grid.NumGrid
): Room | RoomConfig | null {
    config = config || {};
    let choices: () => any;
    if (Array.isArray(config.choices)) {
        choices = GW.random.item.bind(GW.random, config.choices);
    } else if (typeof config.choices == 'object') {
        choices = GW.random.weighted.bind(GW.random, config.choices);
    } else {
        GW.utils.ERROR(
            'Expected choices to be either array of room ids or map - ex: { ROOM_ID: weight }'
        );
    }

    if (!grid) return config;

    let id = choices!();
    const digger = rooms[id];
    if (!digger) {
        GW.utils.ERROR('Missing digger choice: ' + id);
    }

    let digConfig = digger;
    if (config.opts) {
        digConfig = Object.assign({}, digger, config.opts);
    }
    // debug('Chose room: ', id);
    return digger.fn(digConfig, grid);
}

// From BROGUE => This is a special room that appears at the entrance to the dungeon on depth 1.
export function entrance(config: RoomConfig, grid: GW.grid.NumGrid) {
    config = checkConfig(config, { width: 20, height: 10 });
    if (!grid) return config;

    const width = config.width.value();
    const height = config.height.value();
    const tile = config.tile || CONST.FLOOR;

    const roomWidth = Math.floor(0.4 * width); // 8
    const roomHeight = height;
    const roomWidth2 = width;
    const roomHeight2 = Math.floor(0.5 * height); // 5

    // ALWAYS start at bottom+center of map
    const roomX = Math.floor(grid.width / 2 - roomWidth / 2 - 1);
    const roomY = grid.height - roomHeight - 2;
    const roomX2 = Math.floor(grid.width / 2 - roomWidth2 / 2 - 1);
    const roomY2 = grid.height - roomHeight2 - 2;

    grid.fill(0);
    grid.fillRect(roomX, roomY, roomWidth, roomHeight, tile);
    grid.fillRect(roomX2, roomY2, roomWidth2, roomHeight2, tile);
    return new Room(
        config.id,
        Math.min(roomX, roomX2),
        Math.min(roomY, roomY2),
        Math.max(roomWidth, roomWidth2),
        Math.max(roomHeight, roomHeight2)
    );
}

export function cross(config: RoomConfig, grid: GW.grid.NumGrid) {
    config = checkConfig(config, { width: 12, height: 20 });
    if (!grid) return config;

    const width = config.width.value();
    const height = config.height.value();
    const tile = config.tile || CONST.FLOOR;

    const roomWidth = width;
    const roomWidth2 = Math.max(
        3,
        Math.floor((width * GW.random.range(25, 75)) / 100)
    ); // [4,20]
    const roomHeight = Math.max(
        3,
        Math.floor((height * GW.random.range(25, 75)) / 100)
    ); // [2,5]
    const roomHeight2 = height;

    const roomX = Math.floor((grid.width - roomWidth) / 2);
    const roomX2 =
        roomX + GW.random.range(2, Math.max(2, roomWidth - roomWidth2 - 2));

    const roomY2 = Math.floor((grid.height - roomHeight2) / 2);
    const roomY =
        roomY2 + GW.random.range(2, Math.max(2, roomHeight2 - roomHeight - 2));

    grid.fill(0);

    grid.fillRect(roomX, roomY, roomWidth, roomHeight, tile);
    grid.fillRect(roomX2, roomY2, roomWidth2, roomHeight2, tile);
    return new Room(
        config.id,
        roomX,
        roomY2,
        Math.max(roomWidth, roomWidth2),
        Math.max(roomHeight, roomHeight2)
    );
}

export function symmetricalCross(config: RoomConfig, grid: GW.grid.NumGrid) {
    config = checkConfig(config, { width: 7, height: 7 });
    if (!grid) return config;

    const width = config.width.value();
    const height = config.height.value();
    const tile = config.tile || CONST.FLOOR;

    let minorWidth = Math.max(
        3,
        Math.floor((width * GW.random.range(25, 50)) / 100)
    ); // [2,4]
    // if (height % 2 == 0 && minorWidth > 2) {
    //     minorWidth -= 1;
    // }
    let minorHeight = Math.max(
        3,
        Math.floor((height * GW.random.range(25, 50)) / 100)
    ); // [2,3]?
    // if (width % 2 == 0 && minorHeight > 2) {
    //     minorHeight -= 1;
    // }

    grid.fill(0);
    const x = Math.floor((grid.width - width) / 2);
    const y = Math.floor((grid.height - minorHeight) / 2);
    grid.fillRect(x, y, width, minorHeight, tile);
    const x2 = Math.floor((grid.width - minorWidth) / 2);
    const y2 = Math.floor((grid.height - height) / 2);
    grid.fillRect(x2, y2, minorWidth, height, tile);
    return new Room(
        config.id,
        Math.min(x, x2),
        Math.min(y, y2),
        Math.max(width, minorWidth),
        Math.max(height, minorHeight)
    );
}

export function rectangular(config: RoomConfig, grid: GW.grid.NumGrid) {
    config = checkConfig(config, { width: [3, 6], height: [3, 6] });
    if (!grid) return config;

    const width = config.width.value();
    const height = config.height.value();
    const tile = config.tile || CONST.FLOOR;

    grid.fill(0);
    const x = Math.floor((grid.width - width) / 2);
    const y = Math.floor((grid.height - height) / 2);
    grid.fillRect(x, y, width, height, tile);
    return new Room(config.id, x, y, width, height);
}

export function circular(config: RoomConfig, grid: GW.grid.NumGrid) {
    config = checkConfig(config, { radius: [3, 4] });
    if (!grid) return config;

    const radius = config.radius.value();
    const tile = config.tile || CONST.FLOOR;

    grid.fill(0);
    const x = Math.floor(grid.width / 2);
    const y = Math.floor(grid.height / 2);
    if (radius > 1) {
        grid.fillCircle(x, y, radius, tile);
    }

    return new Room(
        config.id,
        x - radius,
        y - radius,
        radius * 2 + 1,
        radius * 2 + 1
    );
}

export function brogueDonut(config: RoomConfig, grid: GW.grid.NumGrid) {
    config = checkConfig(config, {
        radius: [5, 10],
        ringMinWidth: 3,
        holeMinSize: 3,
        holeChance: 50,
    });
    if (!grid) return config;

    const radius = config.radius.value();
    const ringMinWidth = config.ringMinWidth.value();
    const holeMinSize = config.holeMinSize.value();
    const tile = config.tile || CONST.FLOOR;

    grid.fill(0);
    const x = Math.floor(grid.width / 2);
    const y = Math.floor(grid.height / 2);
    grid.fillCircle(x, y, radius, tile);

    if (
        radius > ringMinWidth + holeMinSize &&
        GW.random.chance(config.holeChance.value())
    ) {
        grid.fillCircle(
            x,
            y,
            GW.random.range(holeMinSize, radius - holeMinSize),
            0
        );
    }
    return new Room(
        config.id,
        x - radius,
        y - radius,
        radius * 2 + 1,
        radius * 2 + 1
    );
}

export function chunkyRoom(config: RoomConfig, grid: GW.grid.NumGrid) {
    config = checkConfig(config, {
        count: [2, 12],
        width: [5, 20],
        height: [5, 20],
    });
    if (!grid) return config;

    let i, x, y;
    let minX, maxX, minY, maxY;
    let chunkCount = config.count.value();

    const width = config.width.value();
    const height = config.height.value();
    const tile = config.tile || CONST.FLOOR;

    minX = Math.floor(grid.width / 2) - Math.floor(width / 2);
    maxX = Math.floor(grid.width / 2) + Math.floor(width / 2);
    minY = Math.floor(grid.height / 2) - Math.floor(height / 2);
    maxY = Math.floor(grid.height / 2) + Math.floor(height / 2);

    grid.fill(0);
    grid.fillCircle(
        Math.floor(grid.width / 2),
        Math.floor(grid.height / 2),
        2,
        tile
    );

    for (i = 0; i < chunkCount; ) {
        x = GW.random.range(minX, maxX);
        y = GW.random.range(minY, maxY);
        if (grid[x][y]) {
            //            colorOverDungeon(/* Color. */darkGray);
            //            hiliteGrid(grid, /* Color. */white, 100);

            if (x - 2 < minX) continue;
            if (x + 2 > maxX) continue;
            if (y - 2 < minY) continue;
            if (y + 2 > maxY) continue;

            grid.fillCircle(x, y, 2, tile);
            i++;

            //            hiliteGrid(grid, /* Color. */green, 50);
            //            temporaryMessage("Added a chunk:", true);
        }
    }

    const bounds = grid.valueBounds(tile);

    return new Room(config.id, bounds.x, bounds.y, bounds.width, bounds.height);
}
