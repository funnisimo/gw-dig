import * as GW from 'gw-utils';
import * as TYPES from './types';
import * as UTILS from './utils';
import * as SITE from '../site';

export function checkConfig(
    config: TYPES.RoomConfig,
    expected: TYPES.RoomConfig = {}
) {
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
                throw new Error(
                    'Missing required config for room digger: ' + key
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

export abstract class RoomDigger {
    public options: TYPES.RoomConfig = {};
    public doors: GW.utils.Loc[] = [];

    constructor(config: TYPES.RoomConfig, expected: TYPES.RoomConfig = {}) {
        this._setOptions(config, expected);
    }

    _setOptions(config: TYPES.RoomConfig, expected: TYPES.RoomConfig = {}) {
        this.options = checkConfig(config, expected);
    }

    create(site: SITE.Site): TYPES.Room {
        const result = this.carve(site);
        if (result) {
            if (
                !result.doors ||
                result.doors.length == 0 ||
                result.doors.every((loc) => !loc || loc[0] == -1)
            ) {
                result.doors = UTILS.chooseRandomDoorSites(site);
            }
        }
        return result;
    }

    abstract carve(site: SITE.Site): TYPES.Room;
}

export var rooms: Record<string, RoomDigger> = {};

export class ChoiceRoom extends RoomDigger {
    // @ts-ignore
    public randomRoom: () => any;

    constructor(config: TYPES.RoomConfig = {}) {
        super(config, {
            choices: ['DEFAULT'],
        });
    }

    _setOptions(config: TYPES.RoomConfig, expected: TYPES.RoomConfig = {}) {
        const choices = config.choices || expected.choices;
        if (Array.isArray(choices)) {
            this.randomRoom = GW.random.item.bind(GW.random, choices);
        } else if (typeof choices == 'object') {
            this.randomRoom = GW.random.weighted.bind(GW.random, choices);
        } else {
            throw new Error(
                'Expected choices to be either array of room ids or weighted map - ex: { ROOM_ID: weight }'
            );
        }
    }

    carve(site: SITE.Site) {
        let id = this.randomRoom() as string;
        const room = rooms[id];
        if (!room) {
            GW.utils.ERROR('Missing room digger choice: ' + id);
        }

        // debug('Chose room: ', id);
        return room.create(site);
    }
}

export function choiceRoom(config: TYPES.RoomConfig, site: SITE.Site) {
    // grid.fill(0);
    const digger = new ChoiceRoom(config);
    return digger.create(site);
}

export class Cavern extends RoomDigger {
    constructor(config: Partial<TYPES.RoomConfig> = {}) {
        super(config, {
            width: 12,
            height: 8,
        });
    }

    carve(site: SITE.Site) {
        const width = this.options.width.value();
        const height = this.options.height.value();
        const tile = this.options.tile || SITE.FLOOR;

        const blobGrid = GW.grid.alloc(site.width, site.height, 0);

        const minWidth = Math.floor(0.5 * width); // 6
        const maxWidth = width;
        const minHeight = Math.floor(0.5 * height); // 4
        const maxHeight = height;

        const blob = new GW.blob.Blob({
            rounds: 5,
            minWidth: minWidth,
            minHeight: minHeight,
            maxWidth: maxWidth,
            maxHeight: maxHeight,
            percentSeeded: 55,
            birthParameters: 'ffffftttt',
            survivalParameters: 'ffffttttt',
        });

        const bounds = blob.carve(
            blobGrid.width,
            blobGrid.height,
            (x, y) => (blobGrid[x][y] = 1)
        );

        // Position the new cave in the middle of the grid...
        const destX = Math.floor((site.width - bounds.width) / 2);
        const dx = destX - bounds.x;
        const destY = Math.floor((site.height - bounds.height) / 2);
        const dy = destY - bounds.y;

        // ...and copy it to the destination.
        blobGrid.forEach((v, x, y) => {
            if (v) site.setTile(x + dx, y + dy, tile);
        });
        GW.grid.free(blobGrid);

        return new TYPES.Room(destX, destY, bounds.width, bounds.height);
    }
}

export function cavern(config: TYPES.RoomConfig, site: SITE.Site) {
    // grid.fill(0);
    const digger = new Cavern(config);
    return digger.create(site);
}

// From BROGUE => This is a special room that appears at the entrance to the dungeon on depth 1.
export class BrogueEntrance extends RoomDigger {
    constructor(config: Partial<TYPES.RoomConfig> = {}) {
        super(config, {
            width: 20,
            height: 10,
        });
    }

    carve(site: SITE.Site) {
        const width = this.options.width.value();
        const height = this.options.height.value();
        const tile = this.options.tile || SITE.FLOOR;

        const roomWidth = Math.floor(0.4 * width); // 8
        const roomHeight = height;
        const roomWidth2 = width;
        const roomHeight2 = Math.floor(0.5 * height); // 5

        // ALWAYS start at bottom+center of map
        const roomX = Math.floor(site.width / 2 - roomWidth / 2 - 1);
        const roomY = site.height - roomHeight - 2;
        const roomX2 = Math.floor(site.width / 2 - roomWidth2 / 2 - 1);
        const roomY2 = site.height - roomHeight2 - 2;

        GW.utils.forRect(roomX, roomY, roomWidth, roomHeight, (x, y) =>
            site.setTile(x, y, tile)
        );
        GW.utils.forRect(roomX2, roomY2, roomWidth2, roomHeight2, (x, y) =>
            site.setTile(x, y, tile)
        );
        const room = new TYPES.Room(
            Math.min(roomX, roomX2),
            Math.min(roomY, roomY2),
            Math.max(roomWidth, roomWidth2),
            Math.max(roomHeight, roomHeight2)
        );

        room.doors[GW.utils.DOWN] = [
            Math.floor(site.width / 2),
            site.height - 2,
        ];
        return room;
    }
}

export function brogueEntrance(
    config: TYPES.RoomConfig,
    site: SITE.Site
) {
    // grid.fill(0);
    const digger = new BrogueEntrance(config);
    return digger.create(site);
}

export class Cross extends RoomDigger {
    constructor(config: Partial<TYPES.RoomConfig> = {}) {
        super(config, { width: 12, height: 20 });
    }

    carve(site: SITE.Site) {
        const width = this.options.width.value();
        const height = this.options.height.value();
        const tile = this.options.tile || SITE.FLOOR;

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

        const roomX = Math.floor((site.width - roomWidth) / 2);
        const roomX2 =
            roomX + GW.random.range(2, Math.max(2, roomWidth - roomWidth2 - 2));

        const roomY2 = Math.floor((site.height - roomHeight2) / 2);
        const roomY =
            roomY2 +
            GW.random.range(2, Math.max(2, roomHeight2 - roomHeight - 2));

        GW.utils.forRect(roomX, roomY, roomWidth, roomHeight, (x, y) =>
            site.setTile(x, y, tile)
        );
        GW.utils.forRect(roomX2, roomY2, roomWidth2, roomHeight2, (x, y) =>
            site.setTile(x, y, tile)
        );
        return new TYPES.Room(
            roomX,
            roomY2,
            Math.max(roomWidth, roomWidth2),
            Math.max(roomHeight, roomHeight2)
        );
    }
}

export function cross(config: TYPES.RoomConfig, site: SITE.Site) {
    // grid.fill(0);
    const digger = new Cross(config);
    return digger.create(site);
}

export class SymmetricalCross extends RoomDigger {
    constructor(config: Partial<TYPES.RoomConfig> = {}) {
        super(config, { width: 7, height: 7 });
    }

    carve(site: SITE.Site) {
        const width = this.options.width.value();
        const height = this.options.height.value();
        const tile = this.options.tile || SITE.FLOOR;

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

        const x = Math.floor((site.width - width) / 2);
        const y = Math.floor((site.height - minorHeight) / 2);
        GW.utils.forRect(x, y, width, minorHeight, (x, y) =>
            site.setTile(x, y, tile)
        );
        const x2 = Math.floor((site.width - minorWidth) / 2);
        const y2 = Math.floor((site.height - height) / 2);
        GW.utils.forRect(x2, y2, minorWidth, height, (x, y) =>
            site.setTile(x, y, tile)
        );
        return new TYPES.Room(
            Math.min(x, x2),
            Math.min(y, y2),
            Math.max(width, minorWidth),
            Math.max(height, minorHeight)
        );
    }
}

export function symmetricalCross(
    config: TYPES.RoomConfig,
    site: SITE.Site
) {
    // grid.fill(0);
    const digger = new SymmetricalCross(config);
    return digger.create(site);
}

export class Rectangular extends RoomDigger {
    constructor(config: Partial<TYPES.RoomConfig> = {}) {
        super(config, {
            width: [3, 6],
            height: [3, 6],
        });
    }

    carve(site: SITE.Site) {
        const width = this.options.width.value();
        const height = this.options.height.value();
        const tile = this.options.tile || SITE.FLOOR;

        const x = Math.floor((site.width - width) / 2);
        const y = Math.floor((site.height - height) / 2);
        GW.utils.forRect(x, y, width, height, (x, y) =>
            site.setTile(x, y, tile)
        );
        return new TYPES.Room(x, y, width, height);
    }
}

export function rectangular(config: TYPES.RoomConfig, site: SITE.Site) {
    // grid.fill(0);
    const digger = new Rectangular(config);
    return digger.create(site);
}

export class Circular extends RoomDigger {
    constructor(config: Partial<TYPES.RoomConfig> = {}) {
        super(config, {
            radius: [3, 4],
        });
    }

    carve(site: SITE.Site) {
        const radius = this.options.radius.value();
        const tile = this.options.tile || SITE.FLOOR;

        const x = Math.floor(site.width / 2);
        const y = Math.floor(site.height / 2);
        if (radius > 1) {
            GW.utils.forCircle(x, y, radius, (x, y) =>
                site.setTile(x, y, tile)
            );
        }

        return new TYPES.Room(
            x - radius,
            y - radius,
            radius * 2 + 1,
            radius * 2 + 1
        );
    }
}

export function circular(config: TYPES.RoomConfig, site: SITE.Site) {
    // grid.fill(0);
    const digger = new Circular(config);
    return digger.create(site);
}

export class BrogueDonut extends RoomDigger {
    constructor(config: Partial<TYPES.RoomConfig> = {}) {
        super(config, {
            radius: [5, 10],
            ringMinWidth: 3,
            holeMinSize: 3,
            holeChance: 50,
        });
    }

    carve(site: SITE.Site) {
        const radius = this.options.radius.value();
        const ringMinWidth = this.options.ringMinWidth.value();
        const holeMinSize = this.options.holeMinSize.value();
        const tile = this.options.tile || SITE.FLOOR;

        const x = Math.floor(site.width / 2);
        const y = Math.floor(site.height / 2);
        GW.utils.forCircle(x, y, radius, (x, y) => site.setTile(x, y, tile));

        if (
            radius > ringMinWidth + holeMinSize &&
            GW.random.chance(this.options.holeChance.value())
        ) {
            GW.utils.forCircle(
                x,
                y,
                GW.random.range(holeMinSize, radius - holeMinSize),
                (x, y) => site.setTile(x, y, 0)
            );
        }

        return new TYPES.Room(
            x - radius,
            y - radius,
            radius * 2 + 1,
            radius * 2 + 1
        );
    }
}

export function brogueDonut(config: TYPES.RoomConfig, site: SITE.Site) {
    // grid.fill(0);
    const digger = new BrogueDonut(config);
    return digger.create(site);
}

export class ChunkyRoom extends RoomDigger {
    constructor(config: Partial<TYPES.RoomConfig> = {}) {
        super(config, {
            count: [2, 12],
            width: [5, 20],
            height: [5, 20],
        });
    }

    carve(site: SITE.Site) {
        let i, x, y;
        let chunkCount = this.options.count.value();

        const width = this.options.width.value();
        const height = this.options.height.value();
        const tile = this.options.tile || SITE.FLOOR;

        const minX = Math.floor(site.width / 2) - Math.floor(width / 2);
        const maxX = Math.floor(site.width / 2) + Math.floor(width / 2);
        const minY = Math.floor(site.height / 2) - Math.floor(height / 2);
        const maxY = Math.floor(site.height / 2) + Math.floor(height / 2);

        let left = Math.floor(site.width / 2);
        let right = left;
        let top = Math.floor(site.height / 2);
        let bottom = top;

        GW.utils.forCircle(left, top, 2, (x, y) => site.setTile(x, y, tile));
        left -= 2;
        right += 2;
        top -= 2;
        bottom += 2;

        for (i = 0; i < chunkCount; ) {
            x = GW.random.range(minX, maxX);
            y = GW.random.range(minY, maxY);
            if (site.isSet(x, y)) {
                if (x - 2 < minX) continue;
                if (x + 2 > maxX) continue;
                if (y - 2 < minY) continue;
                if (y + 2 > maxY) continue;

                left = Math.min(x - 2, left);
                right = Math.max(x + 2, right);
                top = Math.min(y - 2, top);
                bottom = Math.max(y + 2, bottom);

                GW.utils.forCircle(x, y, 2, (x, y) => site.setTile(x, y, tile));
                i++;
            }
        }

        return new TYPES.Room(left, top, right - left + 1, bottom - top + 1);
    }
}

export function chunkyRoom(config: TYPES.RoomConfig, site: SITE.Site) {
    // grid.fill(0);
    const digger = new ChunkyRoom(config);
    return digger.create(site);
}

export function install(id: string, room: RoomDigger) {
    rooms[id] = room;
    return room;
}

install('DEFAULT', new Rectangular());
