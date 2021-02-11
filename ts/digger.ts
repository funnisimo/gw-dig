import * as GW from 'gw-utils';
import * as CONST from './gw';

export type DigFn = (config: any, grid: GW.grid.NumGrid) => string;
interface DigConfig {
    fn: DigFn;
    id: string;
}
export var diggers: Record<string, DigConfig> = {};

export function install(id: string, fn: DigFn, config: any) {
    // @ts-ignore
    config = fn(config || {}); // call to have function setup the config
    config.fn = fn;
    config.id = id;
    diggers[id] = config;
    return config;
}

export function checkConfig(config: any, opts: any) {
    config = config || {};
    opts = opts || {};

    if (!config.width || !config.height)
        GW.utils.ERROR(
            'All diggers require config to include width and height.'
        );

    Object.entries(opts).forEach(([key, expect]) => {
        const have = config[key];

        if (expect === true) {
            // needs to be a number > 0
            if (typeof have !== 'number') {
                GW.utils.ERROR(
                    'Invalid configuration for digger: ' +
                        key +
                        ' expected number received ' +
                        typeof have
                );
            }
        } else if (typeof expect === 'number') {
            // needs to be a number, this is the default
            const have = config[key];
            if (typeof have !== 'number') {
                config[key] = expect; // provide default
            }
        } else if (Array.isArray(expect)) {
            // needs to be an array with this size, these are the defaults
            if (typeof have === 'number') {
                config[key] = new Array(expect.length).fill(have);
            } else if (!Array.isArray(have)) {
                GW.utils.WARN(
                    'Received unexpected config for digger : ' +
                        key +
                        ' expected array, received ' +
                        typeof have +
                        ', using defaults.'
                );
                config[key] = expect.slice();
            } else if (expect.length > have.length) {
                for (let i = have.length; i < expect.length; ++i) {
                    have[i] = expect[i];
                }
            }
        } else {
            GW.utils.WARN(
                'Unexpected digger configuration parameter: ',
                key,
                '' + expect
            );
        }
    });

    return config;
}

export function cavern(config: any, grid: GW.grid.NumGrid) {
    config = checkConfig(config, { width: 12, height: 8 });
    if (!grid) return config;

    let destX, destY;
    let blobGrid;

    blobGrid = GW.grid.alloc(grid.width, grid.height, 0);

    const minWidth = Math.floor(0.5 * config.width); // 6
    const maxWidth = config.width;
    const minHeight = Math.floor(0.5 * config.height); // 4
    const maxHeight = config.height;

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
    GW.grid.offsetZip(
        grid,
        blobGrid,
        destX - bounds.x,
        destY - bounds.y,
        CONST.FLOOR
    );
    GW.grid.free(blobGrid);
    return config.id;
}

export function choiceRoom(config: any, grid: GW.grid.NumGrid) {
    config = config || {};
    let choices;
    if (Array.isArray(config.choices)) {
        choices = config.choices;
    } else if (typeof config.choices == 'object') {
        choices = Object.keys(config.choices);
    } else {
        GW.utils.ERROR(
            'Expected choices to be either array of choices or map { digger: weight }'
        );
    }
    for (let choice of choices) {
        if (!diggers[choice]) {
            GW.utils.ERROR('Missing digger choice: ' + choice);
        }
    }

    if (!grid) return config;

    let id;
    if (Array.isArray(config.choices)) {
        id = GW.random.item(config.choices);
    } else {
        id = GW.random.weighted(config.choices);
    }
    const digger = diggers[id];
    let digConfig = digger;
    if (config.opts) {
        digConfig = Object.assign({}, digger, config.opts);
    }
    // debug('Chose room: ', id);
    digger.fn(digConfig, grid);
    return id;
}

// From BROGUE => This is a special room that appears at the entrance to the dungeon on depth 1.
export function entranceRoom(config: any, grid: GW.grid.NumGrid) {
    config = checkConfig(config, { width: 20, height: 10 });
    if (!grid) return config;

    const roomWidth = Math.floor(0.4 * config.width); // 8
    const roomHeight = config.height;
    const roomWidth2 = config.width;
    const roomHeight2 = Math.floor(0.5 * config.height); // 5

    // ALWAYS start at bottom+center of map
    const roomX = Math.floor(grid.width / 2 - roomWidth / 2 - 1);
    const roomY = grid.height - roomHeight - 2;
    const roomX2 = Math.floor(grid.width / 2 - roomWidth2 / 2 - 1);
    const roomY2 = grid.height - roomHeight2 - 2;

    grid.fill(0);
    grid.fillRect(roomX, roomY, roomWidth, roomHeight, CONST.FLOOR);
    grid.fillRect(roomX2, roomY2, roomWidth2, roomHeight2, CONST.FLOOR);
    return config.id;
}

export function crossRoom(config: any, grid: GW.grid.NumGrid) {
    config = checkConfig(config, { width: 12, height: 20 });
    if (!grid) return config;

    const roomWidth = Math.max(
        2,
        Math.floor((config.width * GW.random.range(15, 60)) / 100)
    ); // [3,12]
    const roomWidth2 = Math.max(
        2,
        Math.floor((config.width * GW.random.range(20, 100)) / 100)
    ); // [4,20]
    const roomHeight = Math.max(
        2,
        Math.floor((config.height * GW.random.range(50, 100)) / 100)
    ); // [3,7]
    const roomHeight2 = Math.max(
        2,
        Math.floor((config.height * GW.random.range(25, 75)) / 100)
    ); // [2,5]

    const roomX = GW.random.range(
        Math.max(0, Math.floor(grid.width / 2) - (roomWidth - 1)),
        Math.min(grid.width, Math.floor(grid.width / 2))
    );
    const roomX2 =
        roomX +
        Math.floor(roomWidth / 2) +
        GW.random.range(0, 2) +
        GW.random.range(0, 2) -
        3 -
        Math.floor(roomWidth2 / 2);
    const roomY = Math.floor(grid.height / 2 - roomHeight);
    const roomY2 = Math.floor(
        grid.height / 2 -
            roomHeight2 -
            (GW.random.range(0, 2) + GW.random.range(0, 1))
    );

    grid.fill(0);

    grid.fillRect(roomX - 5, roomY + 5, roomWidth, roomHeight, CONST.FLOOR);
    grid.fillRect(roomX2 - 5, roomY2 + 5, roomWidth2, roomHeight2, CONST.FLOOR);
    return config.id;
}

export function symmetricalCrossRoom(config: any, grid: GW.grid.NumGrid) {
    config = checkConfig(config, { width: 8, height: 5 });
    if (!grid) return config;

    let majorWidth = Math.floor(
        (config.width * GW.random.range(50, 100)) / 100
    ); // [4,8]
    let majorHeight = Math.floor(
        (config.height * GW.random.range(75, 100)) / 100
    ); // [4,5]

    let minorWidth = Math.max(
        2,
        Math.floor((config.width * GW.random.range(25, 50)) / 100)
    ); // [2,4]
    if (majorHeight % 2 == 0 && minorWidth > 2) {
        minorWidth -= 1;
    }
    let minorHeight = Math.max(
        2,
        Math.floor((config.height * GW.random.range(25, 50)) / 100)
    ); // [2,3]?
    if (majorWidth % 2 == 0 && minorHeight > 2) {
        minorHeight -= 1;
    }

    grid.fill(0);
    grid.fillRect(
        Math.floor((grid.width - majorWidth) / 2),
        Math.floor((grid.height - minorHeight) / 2),
        majorWidth,
        minorHeight,
        CONST.FLOOR
    );
    grid.fillRect(
        Math.floor((grid.width - minorWidth) / 2),
        Math.floor((grid.height - majorHeight) / 2),
        minorWidth,
        majorHeight,
        CONST.FLOOR
    );
    return config.id;
}

export function rectangularRoom(config: any, grid: GW.grid.NumGrid) {
    config = checkConfig(config, { width: 6, height: 4, minPct: 50 });
    if (!grid) return config;

    const width = Math.floor(
        (config.width * GW.random.range(config.minPct, 100)) / 100
    ); // [3,6]
    const height = Math.floor(
        (config.height * GW.random.range(config.minPct, 100)) / 100
    ); // [2,4]

    grid.fill(0);
    grid.fillRect(
        Math.floor((grid.width - width) / 2),
        Math.floor((grid.height - height) / 2),
        width,
        height,
        CONST.FLOOR
    );
    return config.id;
}

export function circularRoom(config: any, grid: GW.grid.NumGrid) {
    config = checkConfig(config, { width: 6, height: 6 });
    if (!grid) return config;

    const radius = Math.floor(
        ((Math.min(config.width, config.height) - 1) *
            GW.random.range(75, 100)) /
            200
    ); // [3,4]

    grid.fill(0);
    if (radius > 1) {
        grid.fillCircle(
            Math.floor(grid.width / 2),
            Math.floor(grid.height / 2),
            radius,
            CONST.FLOOR
        );
    }

    return config.id;
}

export function brogueDonut(config: any, grid: GW.grid.NumGrid) {
    config = checkConfig(config, {
        width: 10,
        height: 10,
        altChance: 5,
        ringMinWidth: 3,
        holeMinSize: 3,
        holeChance: 50,
    });
    if (!grid) return config;

    const radius = Math.floor(
        (Math.min(config.width, config.height) * GW.random.range(75, 100)) / 100
    ); // [5,10]

    grid.fill(0);
    grid.fillCircle(
        Math.floor(grid.width / 2),
        Math.floor(grid.height / 2),
        radius,
        CONST.FLOOR
    );

    if (
        radius > config.ringMinWidth + config.holeMinSize &&
        GW.random.chance(config.holeChance)
    ) {
        grid.fillCircle(
            Math.floor(grid.width / 2),
            Math.floor(grid.height / 2),
            GW.random.range(config.holeMinSize, radius - config.holeMinSize),
            0
        );
    }
    return config.id;
}

export function chunkyRoom(config: any, grid: GW.grid.NumGrid) {
    config = checkConfig(config, { count: 8 });
    if (!grid) return config;

    let i, x, y;
    let minX, maxX, minY, maxY;
    let chunkCount = Math.floor(
        (config.count * GW.random.range(25, 100)) / 100
    ); // [2,8]

    minX = Math.floor(grid.width / 2) - Math.floor(config.width / 2);
    maxX = Math.floor(grid.width / 2) + Math.floor(config.width / 2);
    minY = Math.floor(grid.height / 2) - Math.floor(config.height / 2);
    maxY = Math.floor(grid.height / 2) + Math.floor(config.height / 2);

    grid.fill(0);
    grid.fillCircle(
        Math.floor(grid.width / 2),
        Math.floor(grid.height / 2),
        2,
        CONST.FLOOR
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

            grid.fillCircle(x, y, 2, CONST.FLOOR);
            i++;

            //            hiliteGrid(grid, /* Color. */green, 50);
            //            temporaryMessage("Added a chunk:", true);
        }
    }
    return config.id;
}
