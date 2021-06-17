import { random, path, utils as utils$1, grid, range, blob } from 'gw-utils';

const NOTHING = 0;
const FLOOR = 1;
const DOOR = 2;
const WALL = 3;
const DEEP = 4;
const SHALLOW = 5;
const BRIDGE = 6;
const UP_STAIRS = 7;
const DOWN_STAIRS = 17;
const IMPREGNABLE = 8;
const TILEMAP = {
    [NOTHING]: 'NULL',
    [FLOOR]: 'FLOOR',
    [DOOR]: 'DOOR',
    [WALL]: 'WALL',
    [IMPREGNABLE]: 'IMPREGNABLE',
    [DEEP]: 'LAKE',
    [SHALLOW]: 'SHALLOW',
    [BRIDGE]: 'BRIDGE',
    [UP_STAIRS]: 'UP_STAIRS',
    [DOWN_STAIRS]: 'DOWN_STAIRS',
};
const SEQ = [];
function initSeqence(length) {
    SEQ.length = length;
    for (let i = 0; i < length; ++i) {
        SEQ[i] = i;
    }
    random.shuffle(SEQ);
}
function fillCostGrid(source, costGrid) {
    costGrid.update((_v, x, y) => source.isPassable(x, y) ? 1 : path.OBSTRUCTION);
}
class GridSite {
    constructor(grid) {
        this.grid = grid;
    }
    get width() {
        return this.grid.width;
    }
    get height() {
        return this.grid.height;
    }
    hasXY(x, y) {
        return this.grid.hasXY(x, y);
    }
    isBoundaryXY(x, y) {
        return this.grid.isBoundaryXY(x, y);
    }
    get(x, y) {
        return this.grid.get(x, y) || 0;
    }
    copy(other, offsetX = 0, offsetY = 0) {
        this.grid.forEach((_c, i, j) => {
            const otherX = i - offsetX;
            const otherY = j - offsetY;
            const v = other.get(otherX, otherY);
            if (!v)
                return;
            this.grid.set(i, j, v);
        });
    }
    isPassable(x, y) {
        return (this.isFloor(x, y) ||
            this.isDoor(x, y) ||
            this.isBridge(x, y) ||
            this.isStairs(x, y) ||
            this.isShallow(x, y));
    }
    isNothing(x, y) {
        const v = this.grid.get(x, y);
        return v === NOTHING;
    }
    isDiggable(x, y) {
        const v = this.grid.get(x, y);
        return v === NOTHING;
    }
    isFloor(x, y) {
        return this.grid.get(x, y) == FLOOR;
    }
    isDoor(x, y) {
        const v = this.grid.get(x, y);
        return v === DOOR;
    }
    isBridge(x, y) {
        const v = this.grid.get(x, y);
        return v === BRIDGE;
    }
    isWall(x, y) {
        const v = this.grid.get(x, y);
        return v === WALL || v === IMPREGNABLE;
    }
    isObstruction(x, y) {
        return this.isNothing(x, y) || this.isWall(x, y);
    }
    isStairs(x, y) {
        const v = this.grid.get(x, y);
        return v === UP_STAIRS || v === DOWN_STAIRS;
    }
    isDeep(x, y) {
        return this.grid.get(x, y) === DEEP;
    }
    isShallow(x, y) {
        return this.grid.get(x, y) === SHALLOW;
    }
    isAnyWater(x, y) {
        return this.isDeep(x, y) || this.isShallow(x, y);
    }
    isSet(x, y) {
        return (this.grid.get(x, y) || 0) > 0;
    }
    setTile(x, y, tile) {
        if (this.grid.hasXY(x, y))
            this.grid[x][y] = tile;
    }
}

const DIRS = utils$1.DIRS;
function attachRoom(map, roomGrid, room, opts) {
    // console.log('attachRoom');
    const doorSites = room.hall ? room.hall.doors : room.doors;
    const site = new GridSite(map);
    // Slide hyperspace across real space, in a random but predetermined order, until the room matches up with a wall.
    for (let i = 0; i < SEQ.length; i++) {
        const x = Math.floor(SEQ[i] / map.height);
        const y = SEQ[i] % map.height;
        if (!(map.get(x, y) == NOTHING))
            continue;
        const dir = directionOfDoorSite(site, x, y);
        if (dir != utils$1.NO_DIRECTION) {
            const oppDir = (dir + 2) % 4;
            const door = doorSites[oppDir];
            if (!door)
                continue;
            const offsetX = x - door[0];
            const offsetY = y - door[1];
            if (door[0] != -1 && roomFitsAt(map, roomGrid, offsetX, offsetY)) {
                // TYPES.Room fits here.
                grid.offsetZip(map, roomGrid, offsetX, offsetY, (_d, _s, i, j) => {
                    map[i][j] = opts.room.tile || FLOOR;
                });
                attachDoor(map, room, opts, x, y, oppDir);
                // door[0] = -1;
                // door[1] = -1;
                room.translate(offsetX, offsetY);
                return true;
            }
        }
    }
    return false;
}
function attachDoor(map, room, opts, x, y, dir) {
    if (opts.door === 0)
        return; // no door at all
    const tile = opts.door || DOOR;
    map[x][y] = tile; // Door site.
    // most cases...
    if (!room.hall || !(room.hall.width > 1) || room.hall.dir !== dir) {
        return;
    }
    if (dir === utils$1.UP || dir === utils$1.DOWN) {
        let didSomething = true;
        let k = 1;
        while (didSomething) {
            didSomething = false;
            if (map.get(x - k, y) === 0) {
                if (map.get(x - k, y - 1) && map.get(x - k, y + 1)) {
                    map[x - k][y] = tile;
                    didSomething = true;
                }
            }
            if (map.get(x + k, y) === 0) {
                if (map.get(x + k, y - 1) && map.get(x + k, y + 1)) {
                    map[x + k][y] = tile;
                    didSomething = true;
                }
            }
            ++k;
        }
    }
    else {
        let didSomething = true;
        let k = 1;
        while (didSomething) {
            didSomething = false;
            if (map.get(x, y - k) === 0) {
                if (map.get(x - 1, y - k) && map.get(x + 1, y - k)) {
                    map[x][y - k] = opts.door;
                    didSomething = true;
                }
            }
            if (map.get(x, y + k) === 0) {
                if (map.get(x - 1, y + k) && map.get(x + 1, y + k)) {
                    map[x][y + k] = opts.door;
                    didSomething = true;
                }
            }
            ++k;
        }
    }
}
function roomFitsAt(map, roomGrid, roomToSiteX, roomToSiteY) {
    let xRoom, yRoom, xSite, ySite, i, j;
    // console.log('roomFitsAt', roomToSiteX, roomToSiteY);
    for (xRoom = 0; xRoom < roomGrid.width; xRoom++) {
        for (yRoom = 0; yRoom < roomGrid.height; yRoom++) {
            if (roomGrid[xRoom][yRoom]) {
                xSite = xRoom + roomToSiteX;
                ySite = yRoom + roomToSiteY;
                for (i = xSite - 1; i <= xSite + 1; i++) {
                    for (j = ySite - 1; j <= ySite + 1; j++) {
                        if (!map.hasXY(i, j) ||
                            map.isBoundaryXY(i, j) ||
                            !(map.get(i, j) === NOTHING)) {
                            // console.log('- NO');
                            return false;
                        }
                    }
                }
            }
        }
    }
    // console.log('- YES');
    return true;
}
// If the indicated tile is a wall on the room stored in grid, and it could be the site of
// a door out of that room, then return the outbound direction that the door faces.
// Otherwise, return def.NO_DIRECTION.
function directionOfDoorSite(site, x, y) {
    let dir, solutionDir;
    let newX, newY, oppX, oppY;
    solutionDir = utils$1.NO_DIRECTION;
    for (dir = 0; dir < 4; dir++) {
        newX = x + DIRS[dir][0];
        newY = y + DIRS[dir][1];
        oppX = x - DIRS[dir][0];
        oppY = y - DIRS[dir][1];
        if (site.hasXY(oppX, oppY) &&
            site.hasXY(newX, newY) &&
            site.isFloor(oppX, oppY)) {
            // This grid cell would be a valid tile on which to place a door that, facing outward, points dir.
            if (solutionDir != utils$1.NO_DIRECTION) {
                // Already claimed by another direction; no doors here!
                return utils$1.NO_DIRECTION;
            }
            solutionDir = dir;
        }
    }
    return solutionDir;
}
function chooseRandomDoorSites(site) {
    let i, j, k, newX, newY;
    let dir;
    let doorSiteFailed;
    const DOORS = [[], [], [], []];
    // const grid = GW.grid.alloc(sourceGrid.width, sourceGrid.height);
    // grid.copy(sourceGrid);
    const h = site.height;
    const w = site.width;
    for (i = 0; i < w; i++) {
        for (j = 0; j < h; j++) {
            if (site.isDiggable(i, j)) {
                dir = directionOfDoorSite(site, i, j);
                if (dir != utils$1.NO_DIRECTION) {
                    // Trace a ray 10 spaces outward from the door site to make sure it doesn't intersect the room.
                    // If it does, it's not a valid door site.
                    newX = i + utils$1.DIRS[dir][0];
                    newY = j + utils$1.DIRS[dir][1];
                    doorSiteFailed = false;
                    for (k = 0; k < 10 && site.hasXY(newX, newY) && !doorSiteFailed; k++) {
                        if (site.isSet(newX, newY)) {
                            doorSiteFailed = true;
                        }
                        newX += utils$1.DIRS[dir][0];
                        newY += utils$1.DIRS[dir][1];
                    }
                    if (!doorSiteFailed) {
                        DOORS[dir].push([i, j]);
                    }
                }
            }
        }
    }
    let doorSites = [];
    // Pick four doors, one in each direction, and store them in doorSites[dir].
    for (dir = 0; dir < 4; dir++) {
        const loc = random.item(DOORS[dir]) || [-1, -1];
        doorSites[dir] = [loc[0], loc[1]];
    }
    // GW.grid.free(grid);
    return doorSites;
}
function forceRoomAtMapLoc(map, xy, roomGrid, room, opts) {
    // console.log('forceRoomAtMapLoc', xy);
    const site = new GridSite(map);
    // Slide room across map, in a random but predetermined order, until the room matches up with a wall.
    for (let i = 0; i < SEQ.length; i++) {
        const x = Math.floor(SEQ[i] / map.height);
        const y = SEQ[i] % map.height;
        if (roomGrid[x][y])
            continue;
        const dir = directionOfDoorSite(site, x, y);
        if (dir != utils$1.NO_DIRECTION) {
            const dx = xy[0] - x;
            const dy = xy[1] - y;
            if (roomFitsAt(map, roomGrid, dx, dy)) {
                grid.offsetZip(map, roomGrid, dx, dy, (_d, _s, i, j) => {
                    map[i][j] = opts.room.tile || FLOOR;
                });
                if (opts.room.door !== false) {
                    const door = opts.room.door === true || !opts.room.door
                        ? DOOR
                        : opts.room.door;
                    map[xy[0]][xy[1]] = door; // Door site.
                }
                // TODO - Update doors - we may have to erase one...
                room.translate(dx, dy);
                return true;
            }
        }
    }
    return false;
}
function attachRoomAtMapDoor(map, mapDoors, roomGrid, room, opts) {
    const doorIndexes = random.sequence(mapDoors.length);
    // console.log('attachRoomAtMapDoor', mapDoors.join(', '));
    // Slide hyperspace across real space, in a random but predetermined order, until the room matches up with a wall.
    for (let i = 0; i < doorIndexes.length; i++) {
        const index = doorIndexes[i];
        const door = mapDoors[index];
        if (!door)
            continue;
        const x = door[0];
        const y = door[1];
        if (attachRoomAtXY(map, x, y, roomGrid, room, opts)) {
            return true;
        }
    }
    return false;
}
function attachRoomAtXY(map, x, y, roomGrid, room, opts) {
    const doorSites = room.hall ? room.hall.doors : room.doors;
    const dirs = random.sequence(4);
    // console.log('attachRoomAtXY', x, y, doorSites.join(', '));
    for (let dir of dirs) {
        const oppDir = (dir + 2) % 4;
        const door = doorSites[oppDir];
        if (!door)
            continue;
        if (door[0] != -1 &&
            roomFitsAt(map, roomGrid, x - door[0], y - door[1])) {
            // dungeon.debug("attachRoom: ", x, y, oppDir);
            // TYPES.Room fits here.
            const offX = x - door[0];
            const offY = y - door[1];
            grid.offsetZip(map, roomGrid, offX, offY, (_d, _s, i, j) => {
                map[i][j] = opts.room.tile || FLOOR;
            });
            attachDoor(map, room, opts, x, y, oppDir);
            room.translate(offX, offY);
            // const newDoors = doorSites.map((site) => {
            //     const x0 = site[0] + offX;
            //     const y0 = site[1] + offY;
            //     if (x0 == x && y0 == y) return [-1, -1] as GW.utils.Loc;
            //     return [x0, y0] as GW.utils.Loc;
            // });
            return true;
        }
    }
    return false;
}

var utils = {
    __proto__: null,
    attachRoom: attachRoom,
    attachDoor: attachDoor,
    roomFitsAt: roomFitsAt,
    directionOfDoorSite: directionOfDoorSite,
    chooseRandomDoorSites: chooseRandomDoorSites,
    forceRoomAtMapLoc: forceRoomAtMapLoc,
    attachRoomAtMapDoor: attachRoomAtMapDoor
};

class Hall {
    constructor(loc, dir, length, width = 1) {
        this.width = 1;
        this.doors = [];
        this.x = loc[0];
        this.y = loc[1];
        const d = utils$1.DIRS[dir];
        this.length = length;
        this.width = width;
        // console.log('Hall', loc, d, length, width);
        if (dir === utils$1.UP || dir === utils$1.DOWN) {
            this.x2 = this.x + (width - 1);
            this.y2 = this.y + (length - 1) * d[1];
        }
        else {
            this.x2 = this.x + (length - 1) * d[0];
            this.y2 = this.y + (width - 1);
        }
        // console.log(' - ', [this.x2, this.y2]);
        this.dir = dir;
    }
    translate(dx, dy) {
        this.x += dx;
        this.y += dy;
        this.x2 += dx;
        this.y2 += dy;
        if (this.doors) {
            this.doors.forEach((d) => {
                if (!d)
                    return;
                if (d[0] < 0 || d[1] < 0)
                    return;
                d[0] += dx;
                d[1] += dy;
            });
        }
    }
}
class Room extends utils$1.Bounds {
    constructor(x, y, width, height) {
        super(x, y, width, height);
        this.doors = [];
        this.hall = null;
    }
    get cx() {
        return this.x + Math.floor(this.width / 2);
    }
    get cy() {
        return this.y + Math.floor(this.height / 2);
    }
    translate(dx, dy) {
        this.x += dx;
        this.y += dy;
        if (this.doors) {
            this.doors.forEach((d) => {
                if (!d)
                    return;
                if (d[0] < 0 || d[1] < 0)
                    return;
                d[0] += dx;
                d[1] += dy;
            });
        }
        if (this.hall) {
            this.hall.translate(dx, dy);
        }
    }
}

const DIRS$1 = utils$1.DIRS;
function isDoorLoc(site, loc, dir) {
    if (!site.hasXY(loc[0], loc[1]))
        return false;
    // TODO - boundary?
    if (!site.isDiggable(loc[0], loc[1]))
        return false; // must be a wall/diggable space
    const room = [loc[0] - dir[0], loc[1] - dir[1]];
    if (!site.hasXY(room[0], room[1]))
        return false;
    // TODO - boundary?
    if (!site.isFloor(room[0], room[1]))
        return false; // must have floor in opposite direction
    return true;
}
function pickWidth(opts = {}) {
    return utils$1.clamp(_pickWidth(opts), 1, 3);
}
function _pickWidth(opts) {
    if (!opts)
        return 1;
    if (typeof opts === 'number')
        return opts;
    if (opts.width === undefined)
        return 1;
    let width = opts.width;
    if (typeof width === 'number')
        return width;
    else if (Array.isArray(width)) {
        // @ts-ignore
        width = random.weighted(width) + 1;
    }
    else if (typeof width === 'string') {
        width = range.make(width).value();
    }
    else {
        width = Number.parseInt(random.weighted(width));
    }
    return width;
}
function pickLength(dir, lengths) {
    if (dir == utils$1.UP || dir == utils$1.DOWN) {
        return lengths[1].value();
    }
    else {
        return lengths[0].value();
    }
}
function pickHallDirection(site, doors, lengths) {
    // Pick a direction.
    let dir = utils$1.NO_DIRECTION;
    if (dir == utils$1.NO_DIRECTION) {
        const dirs = random.sequence(4);
        for (let i = 0; i < 4; i++) {
            dir = dirs[i];
            const length = lengths[(i + 1) % 2].hi; // biggest measurement
            const door = doors[dir];
            if (door && door[0] != -1 && door[1] != -1) {
                const dx = door[0] + Math.floor(DIRS$1[dir][0] * length);
                const dy = door[1] + Math.floor(DIRS$1[dir][1] * length);
                if (site.hasXY(dx, dy)) {
                    break; // That's our direction!
                }
            }
            dir = utils$1.NO_DIRECTION;
        }
    }
    return dir;
}
function pickHallExits(site, x, y, dir, obliqueChance) {
    let newX, newY;
    const allowObliqueHallwayExit = random.chance(obliqueChance);
    const hallDoors = [
    // [-1, -1],
    // [-1, -1],
    // [-1, -1],
    // [-1, -1],
    ];
    for (let dir2 = 0; dir2 < 4; dir2++) {
        newX = x + DIRS$1[dir2][0];
        newY = y + DIRS$1[dir2][1];
        if ((dir2 != dir && !allowObliqueHallwayExit) ||
            !site.hasXY(newX, newY) ||
            site.isSet(newX, newY)) ;
        else {
            hallDoors[dir2] = [newX, newY];
        }
    }
    return hallDoors;
}
class HallDigger {
    constructor(options = {}) {
        this.config = {
            width: range.make(1),
            length: [range.make('2-15'), range.make('2-9')],
            tile: FLOOR,
            obliqueChance: 15,
            chance: 100,
        };
        this._setOptions(options);
    }
    _setOptions(options = {}) {
        if (options.width) {
            this.config.width = range.make(options.width);
        }
        if (options.length) {
            if (typeof options.length === 'number') {
                const l = range.make(options.length);
                this.config.length = [l, l];
            }
        }
        if (options.tile) {
            this.config.tile = options.tile;
        }
    }
    create(site, doors = []) {
        doors = doors || chooseRandomDoorSites(site);
        if (!random.chance(this.config.chance))
            return null;
        const dir = pickHallDirection(site, doors, this.config.length);
        if (dir === utils$1.NO_DIRECTION)
            return null;
        if (!doors[dir])
            return null;
        const width = this.config.width.value();
        const length = pickLength(dir, this.config.length);
        const doorLoc = doors[dir];
        if (width == 1) {
            return this.dig(site, dir, doorLoc, length);
        }
        else {
            return this.digWide(site, dir, doorLoc, length, width);
        }
    }
    _digLine(site, door, dir, length) {
        let x = door[0];
        let y = door[1];
        const tile = this.config.tile;
        for (let i = 0; i < length; i++) {
            site.setTile(x, y, tile);
            x += dir[0];
            y += dir[1];
        }
        x -= dir[0];
        y -= dir[1];
        return [x, y];
    }
    dig(site, dir, door, length) {
        const DIR = DIRS$1[dir];
        const [x, y] = this._digLine(site, door, DIR, length);
        const hall = new Hall(door, dir, length);
        hall.doors = pickHallExits(site, x, y, dir, this.config.obliqueChance);
        return hall;
    }
    digWide(site, dir, door, length, width) {
        const DIR = utils$1.DIRS[dir];
        const lower = [door[0] - DIR[1], door[1] - DIR[0]];
        const higher = [door[0] + DIR[1], door[1] + DIR[0]];
        this._digLine(site, door, DIR, length);
        let actual = 1;
        let startX = door[0];
        let startY = door[1];
        if (actual < width && isDoorLoc(site, lower, DIR)) {
            this._digLine(site, lower, DIR, length);
            startX = Math.min(lower[0], startX);
            startY = Math.min(lower[1], startY);
            ++actual;
        }
        if (actual < width && isDoorLoc(site, higher, DIR)) {
            this._digLine(site, higher, DIR, length);
            startX = Math.min(higher[0], startX);
            startY = Math.min(higher[1], startY);
            ++actual;
        }
        const hall = new Hall([startX, startY], dir, length, width);
        hall.doors = [];
        hall.doors[dir] = [
            door[0] + length * DIR[0],
            door[1] + length * DIR[1],
        ];
        hall.width = width;
        return hall;
    }
}
function dig(config, site, doors) {
    const digger = new HallDigger(config);
    return digger.create(site, doors);
}
var halls = {};
function install(id, hall) {
    // @ts-ignore
    halls[id] = hall;
    return hall;
}
install('DEFAULT', new HallDigger({ chance: 15 }));

var hall = {
    __proto__: null,
    isDoorLoc: isDoorLoc,
    pickWidth: pickWidth,
    pickLength: pickLength,
    pickHallDirection: pickHallDirection,
    pickHallExits: pickHallExits,
    HallDigger: HallDigger,
    dig: dig,
    halls: halls,
    install: install
};

function checkConfig(config, expected = {}) {
    config = config || {};
    expected = expected || {};
    Object.entries(expected).forEach(([key, expect]) => {
        let have = config[key];
        if (key === 'tile') {
            if (have === undefined) {
                config[key] = expect;
            }
            return;
        }
        if (expect === true) {
            // needs to be present
            if (!have) {
                throw new Error('Missing required config for room digger: ' + key);
            }
        }
        else if (typeof expect === 'number') {
            // needs to be a number, this is the default
            have = have || expect;
        }
        else if (Array.isArray(expect)) {
            have = have || expect;
        }
        else {
            // just set the value
            have = have || expect;
        }
        const range$1 = range.make(have); // throws if invalid
        config[key] = range$1;
    });
    return config;
}
class RoomDigger {
    constructor(config, expected = {}) {
        this.options = {};
        this.doors = [];
        this._setOptions(config, expected);
    }
    _setOptions(config, expected = {}) {
        this.options = checkConfig(config, expected);
    }
    create(site) {
        const result = this.carve(site);
        if (result) {
            if (!result.doors ||
                result.doors.length == 0 ||
                result.doors.every((loc) => !loc || loc[0] == -1)) {
                result.doors = chooseRandomDoorSites(site);
            }
        }
        return result;
    }
}
var rooms = {};
class ChoiceRoom extends RoomDigger {
    constructor(config = {}) {
        super(config, {
            choices: ['DEFAULT'],
        });
    }
    _setOptions(config, expected = {}) {
        const choices = config.choices || expected.choices;
        if (Array.isArray(choices)) {
            this.randomRoom = random.item.bind(random, choices);
        }
        else if (typeof choices == 'object') {
            this.randomRoom = random.weighted.bind(random, choices);
        }
        else {
            throw new Error('Expected choices to be either array of room ids or weighted map - ex: { ROOM_ID: weight }');
        }
    }
    carve(site) {
        let id = this.randomRoom();
        const room = rooms[id];
        if (!room) {
            utils$1.ERROR('Missing room digger choice: ' + id);
        }
        // debug('Chose room: ', id);
        return room.create(site);
    }
}
function choiceRoom(config, grid) {
    grid.fill(0);
    const digger = new ChoiceRoom(config);
    return digger.create(new GridSite(grid));
}
class Cavern extends RoomDigger {
    constructor(config = {}) {
        super(config, {
            width: 12,
            height: 8,
        });
    }
    carve(site) {
        const width = this.options.width.value();
        const height = this.options.height.value();
        const tile = this.options.tile || FLOOR;
        const blobGrid = grid.alloc(site.width, site.height, 0);
        const minWidth = Math.floor(0.5 * width); // 6
        const maxWidth = width;
        const minHeight = Math.floor(0.5 * height); // 4
        const maxHeight = height;
        const blob$1 = new blob.Blob({
            roundCount: 5,
            minBlobWidth: minWidth,
            minBlobHeight: minHeight,
            maxBlobWidth: maxWidth,
            maxBlobHeight: maxHeight,
            percentSeeded: 55,
            birthParameters: 'ffffftttt',
            survivalParameters: 'ffffttttt',
        });
        const bounds = blob$1.carve(blobGrid.width, blobGrid.height, (x, y) => (blobGrid[x][y] = 1));
        // Position the new cave in the middle of the grid...
        const destX = Math.floor((site.width - bounds.width) / 2);
        const dx = destX - bounds.x;
        const destY = Math.floor((site.height - bounds.height) / 2);
        const dy = destY - bounds.y;
        // ...and copy it to the destination.
        blobGrid.forEach((v, x, y) => {
            if (v)
                site.setTile(x + dx, y + dy, tile);
        });
        grid.free(blobGrid);
        return new Room(destX, destY, bounds.width, bounds.height);
    }
}
function cavern(config, grid) {
    grid.fill(0);
    const digger = new Cavern(config);
    return digger.create(new GridSite(grid));
}
// From BROGUE => This is a special room that appears at the entrance to the dungeon on depth 1.
class BrogueEntrance extends RoomDigger {
    constructor(config = {}) {
        super(config, {
            width: 20,
            height: 10,
        });
    }
    carve(site) {
        const width = this.options.width.value();
        const height = this.options.height.value();
        const tile = this.options.tile || FLOOR;
        const roomWidth = Math.floor(0.4 * width); // 8
        const roomHeight = height;
        const roomWidth2 = width;
        const roomHeight2 = Math.floor(0.5 * height); // 5
        // ALWAYS start at bottom+center of map
        const roomX = Math.floor(site.width / 2 - roomWidth / 2 - 1);
        const roomY = site.height - roomHeight - 2;
        const roomX2 = Math.floor(site.width / 2 - roomWidth2 / 2 - 1);
        const roomY2 = site.height - roomHeight2 - 2;
        utils$1.forRect(roomX, roomY, roomWidth, roomHeight, (x, y) => site.setTile(x, y, tile));
        utils$1.forRect(roomX2, roomY2, roomWidth2, roomHeight2, (x, y) => site.setTile(x, y, tile));
        const room = new Room(Math.min(roomX, roomX2), Math.min(roomY, roomY2), Math.max(roomWidth, roomWidth2), Math.max(roomHeight, roomHeight2));
        room.doors[utils$1.DOWN] = [
            Math.floor(site.width / 2),
            site.height - 2,
        ];
        return room;
    }
}
function brogueEntrance(config, grid) {
    grid.fill(0);
    const digger = new BrogueEntrance(config);
    return digger.create(new GridSite(grid));
}
class Cross extends RoomDigger {
    constructor(config = {}) {
        super(config, { width: 12, height: 20 });
    }
    carve(site) {
        const width = this.options.width.value();
        const height = this.options.height.value();
        const tile = this.options.tile || FLOOR;
        const roomWidth = width;
        const roomWidth2 = Math.max(3, Math.floor((width * random.range(25, 75)) / 100)); // [4,20]
        const roomHeight = Math.max(3, Math.floor((height * random.range(25, 75)) / 100)); // [2,5]
        const roomHeight2 = height;
        const roomX = Math.floor((site.width - roomWidth) / 2);
        const roomX2 = roomX + random.range(2, Math.max(2, roomWidth - roomWidth2 - 2));
        const roomY2 = Math.floor((site.height - roomHeight2) / 2);
        const roomY = roomY2 +
            random.range(2, Math.max(2, roomHeight2 - roomHeight - 2));
        utils$1.forRect(roomX, roomY, roomWidth, roomHeight, (x, y) => site.setTile(x, y, tile));
        utils$1.forRect(roomX2, roomY2, roomWidth2, roomHeight2, (x, y) => site.setTile(x, y, tile));
        return new Room(roomX, roomY2, Math.max(roomWidth, roomWidth2), Math.max(roomHeight, roomHeight2));
    }
}
function cross(config, grid) {
    grid.fill(0);
    const digger = new Cross(config);
    return digger.create(new GridSite(grid));
}
class SymmetricalCross extends RoomDigger {
    constructor(config = {}) {
        super(config, { width: 7, height: 7 });
    }
    carve(site) {
        const width = this.options.width.value();
        const height = this.options.height.value();
        const tile = this.options.tile || FLOOR;
        let minorWidth = Math.max(3, Math.floor((width * random.range(25, 50)) / 100)); // [2,4]
        // if (height % 2 == 0 && minorWidth > 2) {
        //     minorWidth -= 1;
        // }
        let minorHeight = Math.max(3, Math.floor((height * random.range(25, 50)) / 100)); // [2,3]?
        // if (width % 2 == 0 && minorHeight > 2) {
        //     minorHeight -= 1;
        // }
        const x = Math.floor((site.width - width) / 2);
        const y = Math.floor((site.height - minorHeight) / 2);
        utils$1.forRect(x, y, width, minorHeight, (x, y) => site.setTile(x, y, tile));
        const x2 = Math.floor((site.width - minorWidth) / 2);
        const y2 = Math.floor((site.height - height) / 2);
        utils$1.forRect(x2, y2, minorWidth, height, (x, y) => site.setTile(x, y, tile));
        return new Room(Math.min(x, x2), Math.min(y, y2), Math.max(width, minorWidth), Math.max(height, minorHeight));
    }
}
function symmetricalCross(config, grid) {
    grid.fill(0);
    const digger = new SymmetricalCross(config);
    return digger.create(new GridSite(grid));
}
class Rectangular extends RoomDigger {
    constructor(config = {}) {
        super(config, {
            width: [3, 6],
            height: [3, 6],
        });
    }
    carve(site) {
        const width = this.options.width.value();
        const height = this.options.height.value();
        const tile = this.options.tile || FLOOR;
        const x = Math.floor((site.width - width) / 2);
        const y = Math.floor((site.height - height) / 2);
        utils$1.forRect(x, y, width, height, (x, y) => site.setTile(x, y, tile));
        return new Room(x, y, width, height);
    }
}
function rectangular(config, grid) {
    grid.fill(0);
    const digger = new Rectangular(config);
    return digger.create(new GridSite(grid));
}
class Circular extends RoomDigger {
    constructor(config = {}) {
        super(config, {
            radius: [3, 4],
        });
    }
    carve(site) {
        const radius = this.options.radius.value();
        const tile = this.options.tile || FLOOR;
        const x = Math.floor(site.width / 2);
        const y = Math.floor(site.height / 2);
        if (radius > 1) {
            utils$1.forCircle(x, y, radius, (x, y) => site.setTile(x, y, tile));
        }
        return new Room(x - radius, y - radius, radius * 2 + 1, radius * 2 + 1);
    }
}
function circular(config, grid) {
    grid.fill(0);
    const digger = new Circular(config);
    return digger.create(new GridSite(grid));
}
class BrogueDonut extends RoomDigger {
    constructor(config = {}) {
        super(config, {
            radius: [5, 10],
            ringMinWidth: 3,
            holeMinSize: 3,
            holeChance: 50,
        });
    }
    carve(site) {
        const radius = this.options.radius.value();
        const ringMinWidth = this.options.ringMinWidth.value();
        const holeMinSize = this.options.holeMinSize.value();
        const tile = this.options.tile || FLOOR;
        const x = Math.floor(site.width / 2);
        const y = Math.floor(site.height / 2);
        utils$1.forCircle(x, y, radius, (x, y) => site.setTile(x, y, tile));
        if (radius > ringMinWidth + holeMinSize &&
            random.chance(this.options.holeChance.value())) {
            utils$1.forCircle(x, y, random.range(holeMinSize, radius - holeMinSize), (x, y) => site.setTile(x, y, 0));
        }
        return new Room(x - radius, y - radius, radius * 2 + 1, radius * 2 + 1);
    }
}
function brogueDonut(config, grid) {
    grid.fill(0);
    const digger = new BrogueDonut(config);
    return digger.create(new GridSite(grid));
}
class ChunkyRoom extends RoomDigger {
    constructor(config = {}) {
        super(config, {
            count: [2, 12],
            width: [5, 20],
            height: [5, 20],
        });
    }
    carve(site) {
        let i, x, y;
        let chunkCount = this.options.count.value();
        const width = this.options.width.value();
        const height = this.options.height.value();
        const tile = this.options.tile || FLOOR;
        const minX = Math.floor(site.width / 2) - Math.floor(width / 2);
        const maxX = Math.floor(site.width / 2) + Math.floor(width / 2);
        const minY = Math.floor(site.height / 2) - Math.floor(height / 2);
        const maxY = Math.floor(site.height / 2) + Math.floor(height / 2);
        let left = Math.floor(site.width / 2);
        let right = left;
        let top = Math.floor(site.height / 2);
        let bottom = top;
        utils$1.forCircle(left, top, 2, (x, y) => site.setTile(x, y, tile));
        left -= 2;
        right += 2;
        top -= 2;
        bottom += 2;
        for (i = 0; i < chunkCount;) {
            x = random.range(minX, maxX);
            y = random.range(minY, maxY);
            if (site.isSet(x, y)) {
                if (x - 2 < minX)
                    continue;
                if (x + 2 > maxX)
                    continue;
                if (y - 2 < minY)
                    continue;
                if (y + 2 > maxY)
                    continue;
                left = Math.min(x - 2, left);
                right = Math.max(x + 2, right);
                top = Math.min(y - 2, top);
                bottom = Math.max(y + 2, bottom);
                utils$1.forCircle(x, y, 2, (x, y) => site.setTile(x, y, tile));
                i++;
            }
        }
        return new Room(left, top, right - left + 1, bottom - top + 1);
    }
}
function chunkyRoom(config, grid) {
    grid.fill(0);
    const digger = new ChunkyRoom(config);
    return digger.create(new GridSite(grid));
}
function install$1(id, room) {
    rooms[id] = room;
    return room;
}
install$1('DEFAULT', new Rectangular());

var room = {
    __proto__: null,
    checkConfig: checkConfig,
    RoomDigger: RoomDigger,
    rooms: rooms,
    ChoiceRoom: ChoiceRoom,
    choiceRoom: choiceRoom,
    Cavern: Cavern,
    cavern: cavern,
    BrogueEntrance: BrogueEntrance,
    brogueEntrance: brogueEntrance,
    Cross: Cross,
    cross: cross,
    SymmetricalCross: SymmetricalCross,
    symmetricalCross: symmetricalCross,
    Rectangular: Rectangular,
    rectangular: rectangular,
    Circular: Circular,
    circular: circular,
    BrogueDonut: BrogueDonut,
    brogueDonut: brogueDonut,
    ChunkyRoom: ChunkyRoom,
    chunkyRoom: chunkyRoom,
    install: install$1
};

class Lakes {
    constructor(options = {}) {
        this.options = {
            height: 15,
            width: 30,
            minSize: 5,
            tries: 20,
            count: 1,
            canDisrupt: false,
            wreath: 0,
            wreathTile: SHALLOW,
            tile: DEEP,
        };
        Object.assign(this.options, options);
    }
    create(site) {
        let i, j, k;
        let x, y;
        let lakeMaxHeight, lakeMaxWidth, lakeMinSize, tries, maxCount, canDisrupt;
        let count = 0;
        lakeMaxHeight = this.options.height || 15; // TODO - Make this a range "5-15"
        lakeMaxWidth = this.options.width || 30; // TODO - Make this a range "5-30"
        lakeMinSize = this.options.minSize || 5;
        tries = this.options.tries || 20;
        maxCount = this.options.count || 1;
        canDisrupt = this.options.canDisrupt || false;
        const wreath = this.options.wreath || 0; // TODO - make this a range "0-2" or a weighted choice { 0: 50, 1: 40, 2" 10 }
        const wreathTile = this.options.wreathTile || SHALLOW;
        const tile = this.options.tile || DEEP;
        const lakeGrid = grid.alloc(site.width, site.height, 0);
        let attempts = 0;
        while (attempts < maxCount && count < maxCount) {
            // lake generations
            const width = Math.round(((lakeMaxWidth - lakeMinSize) * (maxCount - attempts)) /
                maxCount) + lakeMinSize;
            const height = Math.round(((lakeMaxHeight - lakeMinSize) * (maxCount - attempts)) /
                maxCount) + lakeMinSize;
            const blob$1 = new blob.Blob({
                roundCount: 5,
                minBlobWidth: 4,
                minBlobHeight: 4,
                maxBlobWidth: width,
                maxBlobHeight: height,
                percentSeeded: 55,
                birthParameters: 'ffffftttt',
                survivalParameters: 'ffffttttt',
            });
            const bounds = blob$1.carve(lakeGrid.width, lakeGrid.height, (x, y) => (lakeGrid[x][y] = 1));
            // lakeGrid.dump();
            let success = false;
            for (k = 0; k < tries && !success; k++) {
                // placement attempts
                // propose a position for the top-left of the lakeGrid in the dungeon
                x = random.range(1 - bounds.x, lakeGrid.width - bounds.width - bounds.x - 2);
                y = random.range(1 - bounds.y, lakeGrid.height - bounds.height - bounds.y - 2);
                if (canDisrupt || !this.isDisruptedBy(site, lakeGrid, -x, -y)) {
                    // level with lake is completely connected
                    //   dungeon.debug("Placed a lake!", x, y);
                    success = true;
                    // copy in lake
                    for (i = 0; i < bounds.width; i++) {
                        // skip boundary
                        for (j = 0; j < bounds.height; j++) {
                            // skip boundary
                            if (lakeGrid[i + bounds.x][j + bounds.y]) {
                                const sx = i + bounds.x + x;
                                const sy = j + bounds.y + y;
                                site.setTile(sx, sy, tile);
                                if (wreath) {
                                    utils$1.forCircle(sx, sy, wreath, (i, j) => {
                                        if (site.isPassable(i, j)
                                        // SITE.isFloor(map, i, j) ||
                                        // SITE.isDoor(map, i, j)
                                        ) {
                                            site.setTile(i, j, wreathTile);
                                        }
                                    });
                                }
                            }
                        }
                    }
                    break;
                }
            }
            if (success) {
                ++count;
            }
            else {
                ++attempts;
            }
        }
        grid.free(lakeGrid);
        return count;
    }
    isDisruptedBy(site, lakeGrid, lakeToMapX = 0, lakeToMapY = 0) {
        const walkableGrid = grid.alloc(site.width, site.height);
        let disrupts = false;
        // Get all walkable locations after lake added
        utils$1.forRect(site.width, site.height, (i, j) => {
            const lakeX = i + lakeToMapX;
            const lakeY = j + lakeToMapY;
            if (lakeGrid.get(lakeX, lakeY)) {
                if (site.isStairs(i, j)) {
                    disrupts = true;
                }
            }
            else if (site.isPassable(i, j)) {
                walkableGrid[i][j] = 1;
            }
        });
        let first = true;
        for (let i = 0; i < walkableGrid.width && !disrupts; ++i) {
            for (let j = 0; j < walkableGrid.height && !disrupts; ++j) {
                if (walkableGrid[i][j] == 1) {
                    if (first) {
                        walkableGrid.floodFill(i, j, 1, 2);
                        first = false;
                    }
                    else {
                        disrupts = true;
                    }
                }
            }
        }
        // console.log('WALKABLE GRID');
        // walkableGrid.dump();
        grid.free(walkableGrid);
        return disrupts;
    }
}

var lake = {
    __proto__: null,
    Lakes: Lakes
};

class Bridges {
    constructor(options = {}) {
        this.options = {
            minDistance: 20,
            maxLength: 5,
        };
        Object.assign(this.options, options);
    }
    create(site) {
        let count = 0;
        let newX, newY;
        let i, j, d, x, y;
        const maxLength = this.options.maxLength;
        const minDistance = this.options.minDistance;
        const pathGrid = grid.alloc(site.width, site.height);
        const costGrid = grid.alloc(site.width, site.height);
        const dirCoords = [
            [1, 0],
            [0, 1],
        ];
        costGrid.update((_v, x, y) => site.isPassable(x, y) ? 1 : path.OBSTRUCTION);
        const SEQ = random.sequence(site.width * site.height);
        for (i = 0; i < SEQ.length; i++) {
            x = Math.floor(SEQ[i] / site.height);
            y = SEQ[i] % site.height;
            if (
            // map.hasXY(x, y) &&
            // map.get(x, y) &&
            site.isPassable(x, y) &&
                !site.isAnyWater(x, y)) {
                for (d = 0; d <= 1; d++) {
                    // Try right, then down
                    const bridgeDir = dirCoords[d];
                    newX = x + bridgeDir[0];
                    newY = y + bridgeDir[1];
                    j = maxLength;
                    // if (!map.hasXY(newX, newY)) continue;
                    // check for line of lake tiles
                    // if (isBridgeCandidate(newX, newY, bridgeDir)) {
                    if (site.isAnyWater(newX, newY)) {
                        for (j = 0; j < maxLength; ++j) {
                            newX += bridgeDir[0];
                            newY += bridgeDir[1];
                            // if (!isBridgeCandidate(newX, newY, bridgeDir)) {
                            if (!site.isAnyWater(newX, newY)) {
                                break;
                            }
                        }
                    }
                    if (
                    // map.get(newX, newY) &&
                    site.isPassable(newX, newY) &&
                        j < maxLength) {
                        path.calculateDistances(pathGrid, newX, newY, costGrid, false);
                        // pathGrid.fill(30000);
                        // pathGrid[newX][newY] = 0;
                        // dijkstraScan(pathGrid, costGrid, false);
                        if (pathGrid[x][y] > minDistance &&
                            pathGrid[x][y] < path.NO_PATH) {
                            // and if the pathing distance between the two flanking floor tiles exceeds minDistance,
                            // dungeon.debug(
                            //     'Adding Bridge',
                            //     x,
                            //     y,
                            //     ' => ',
                            //     newX,
                            //     newY
                            // );
                            while (x !== newX || y !== newY) {
                                if (this.isBridgeCandidate(site, x, y, bridgeDir)) {
                                    site.setTile(x, y, BRIDGE); // map[x][y] = SITE.BRIDGE;
                                    costGrid[x][y] = 1; // (Cost map also needs updating.)
                                }
                                else {
                                    site.setTile(x, y, FLOOR); // map[x][y] = SITE.FLOOR;
                                    costGrid[x][y] = 1;
                                }
                                x += bridgeDir[0];
                                y += bridgeDir[1];
                            }
                            ++count;
                            break;
                        }
                    }
                }
            }
        }
        grid.free(pathGrid);
        grid.free(costGrid);
        return count;
    }
    isBridgeCandidate(site, x, y, bridgeDir) {
        if (site.isBridge(x, y))
            return true;
        if (!site.isAnyWater(x, y))
            return false;
        if (!site.isAnyWater(x + bridgeDir[1], y + bridgeDir[0]))
            return false;
        if (!site.isAnyWater(x - bridgeDir[1], y - bridgeDir[0]))
            return false;
        return true;
    }
}

var bridge = {
    __proto__: null,
    Bridges: Bridges
};

class Stairs {
    constructor(options = {}) {
        this.options = {
            up: true,
            down: true,
            minDistance: 10,
            start: false,
            upTile: UP_STAIRS,
            downTile: DOWN_STAIRS,
            wall: IMPREGNABLE,
        };
        Object.assign(this.options, options);
    }
    create(site) {
        let needUp = this.options.up !== false;
        let needDown = this.options.down !== false;
        const minDistance = this.options.minDistance ||
            Math.floor(Math.max(site.width, site.height) / 2);
        const locations = {};
        let upLoc;
        let downLoc;
        const isValidLoc = this.isStairXY.bind(this, site);
        if (this.options.start && typeof this.options.start !== 'string') {
            let start = this.options.start;
            if (start === true) {
                start = random.matchingXY(site.width, site.height, isValidLoc);
            }
            else {
                start = random.matchingXYNear(utils$1.x(start), utils$1.y(start), isValidLoc);
            }
            locations.start = start;
        }
        if (Array.isArray(this.options.up) &&
            Array.isArray(this.options.down)) {
            const up = this.options.up;
            upLoc = random.matchingXYNear(utils$1.x(up), utils$1.y(up), isValidLoc);
            const down = this.options.down;
            downLoc = random.matchingXYNear(utils$1.x(down), utils$1.y(down), isValidLoc);
        }
        else if (Array.isArray(this.options.up) &&
            !Array.isArray(this.options.down)) {
            const up = this.options.up;
            upLoc = random.matchingXYNear(utils$1.x(up), utils$1.y(up), isValidLoc);
            if (needDown) {
                downLoc = random.matchingXY(site.width, site.height, (x, y) => {
                    if (
                    // @ts-ignore
                    utils$1.distanceBetween(x, y, upLoc[0], upLoc[1]) <
                        minDistance)
                        return false;
                    return isValidLoc(x, y);
                });
            }
        }
        else if (Array.isArray(this.options.down) &&
            !Array.isArray(this.options.up)) {
            const down = this.options.down;
            downLoc = random.matchingXYNear(utils$1.x(down), utils$1.y(down), isValidLoc);
            if (needUp) {
                upLoc = random.matchingXY(site.width, site.height, (x, y) => {
                    if (utils$1.distanceBetween(x, y, 
                    // @ts-ignore
                    downLoc[0], 
                    // @ts-ignore
                    downLoc[1]) < minDistance)
                        return false;
                    return isValidLoc(x, y);
                });
            }
        }
        else if (needUp) {
            upLoc = random.matchingXY(site.width, site.height, isValidLoc);
            if (needDown) {
                downLoc = random.matchingXY(site.width, site.height, (x, y) => {
                    if (
                    // @ts-ignore
                    utils$1.distanceBetween(x, y, upLoc[0], upLoc[1]) <
                        minDistance)
                        return false;
                    return isValidLoc(x, y);
                });
            }
        }
        else if (needDown) {
            downLoc = random.matchingXY(site.width, site.height, isValidLoc);
        }
        if (upLoc) {
            locations.up = upLoc.slice();
            this.setupStairs(site, upLoc[0], upLoc[1], this.options.upTile);
            if (this.options.start === 'up')
                locations.start = locations.up;
        }
        if (downLoc !== undefined) {
            locations.down = downLoc.slice();
            this.setupStairs(site, downLoc[0], downLoc[1], this.options.downTile);
            if (this.options.start === 'down')
                locations.start = locations.down;
        }
        return upLoc || downLoc ? locations : null;
    }
    hasXY(site, x, y) {
        if (x < 0 || y < 0)
            return false;
        if (x >= site.width || y >= site.height)
            return false;
        return true;
    }
    isStairXY(site, x, y) {
        let count = 0;
        if (!this.hasXY(site, x, y) || !site.isDiggable(x, y))
            return false;
        for (let i = 0; i < 4; ++i) {
            const dir = utils$1.DIRS[i];
            if (!this.hasXY(site, x + dir[0], y + dir[1]))
                return false;
            if (!this.hasXY(site, x - dir[0], y - dir[1]))
                return false;
            if (site.isFloor(x + dir[0], y + dir[1])) {
                count += 1;
                if (!site.isDiggable(x - dir[0] + dir[1], y - dir[1] + dir[0]))
                    return false;
                if (!site.isDiggable(x - dir[0] - dir[1], y - dir[1] - dir[0]))
                    return false;
            }
            else if (!site.isDiggable(x + dir[0], y + dir[1])) {
                return false;
            }
        }
        return count == 1;
    }
    setupStairs(site, x, y, tile) {
        const indexes = random.sequence(4);
        let dir = null;
        for (let i = 0; i < indexes.length; ++i) {
            dir = utils$1.DIRS[i];
            const x0 = x + dir[0];
            const y0 = y + dir[1];
            if (site.isFloor(x0, y0)) {
                if (site.isDiggable(x - dir[0], y - dir[1]))
                    break;
            }
            dir = null;
        }
        if (!dir)
            utils$1.ERROR('No stair direction found!');
        site.setTile(x, y, tile);
        const dirIndex = utils$1.CLOCK_DIRS.findIndex(
        // @ts-ignore
        (d) => d[0] == dir[0] && d[1] == dir[1]);
        const wall = this.options.wall;
        for (let i = 0; i < utils$1.CLOCK_DIRS.length; ++i) {
            const l = i ? i - 1 : 7;
            const r = (i + 1) % 8;
            if (i == dirIndex || l == dirIndex || r == dirIndex)
                continue;
            const d = utils$1.CLOCK_DIRS[i];
            site.setTile(x + d[0], y + d[1], wall);
            // map.setCellFlags(x + d[0], y + d[1], Flags.Cell.IMPREGNABLE);
        }
        // dungeon.debug('setup stairs', x, y, tile);
        return true;
    }
}

var stairs = {
    __proto__: null,
    Stairs: Stairs
};

class LoopDigger {
    constructor(options = {}) {
        this.options = {
            minDistance: 100,
            maxLength: 1,
        };
        Object.assign(this.options, options);
    }
    create(site) {
        let startX, startY, endX, endY;
        let i, j, d, x, y;
        const minDistance = Math.min(this.options.minDistance, Math.floor(Math.max(site.width, site.height) / 2));
        const maxLength = this.options.maxLength;
        const pathGrid = grid.alloc(site.width, site.height);
        const costGrid = grid.alloc(site.width, site.height);
        const dirCoords = [
            [1, 0],
            [0, 1],
        ];
        fillCostGrid(site, costGrid);
        function isValidTunnelStart(x, y, dir) {
            if (!site.hasXY(x, y))
                return false;
            if (!site.hasXY(x + dir[1], y + dir[0]))
                return false;
            if (!site.hasXY(x - dir[1], y - dir[0]))
                return false;
            if (site.isSet(x, y))
                return false;
            if (site.isSet(x + dir[1], y + dir[0]))
                return false;
            if (site.isSet(x - dir[1], y - dir[0]))
                return false;
            return true;
        }
        function isValidTunnelEnd(x, y, dir) {
            if (!site.hasXY(x, y))
                return false;
            if (!site.hasXY(x + dir[1], y + dir[0]))
                return false;
            if (!site.hasXY(x - dir[1], y - dir[0]))
                return false;
            if (site.isSet(x, y))
                return true;
            if (site.isSet(x + dir[1], y + dir[0]))
                return true;
            if (site.isSet(x - dir[1], y - dir[0]))
                return true;
            return false;
        }
        let count = 0;
        for (i = 0; i < SEQ.length; i++) {
            x = Math.floor(SEQ[i] / site.height);
            y = SEQ[i] % site.height;
            if (!site.isSet(x, y)) {
                for (d = 0; d <= 1; d++) {
                    // Try a horizontal door, and then a vertical door.
                    let dir = dirCoords[d];
                    if (!isValidTunnelStart(x, y, dir))
                        continue;
                    j = maxLength;
                    // check up/left
                    if (site.hasXY(x + dir[0], y + dir[1]) &&
                        site.isPassable(x + dir[0], y + dir[1])) {
                        // just can't build directly into a door
                        if (!site.hasXY(x - dir[0], y - dir[1]) ||
                            site.isDoor(x - dir[0], y - dir[1])) {
                            continue;
                        }
                    }
                    else if (site.hasXY(x - dir[0], y - dir[1]) &&
                        site.isPassable(x - dir[0], y - dir[1])) {
                        if (!site.hasXY(x + dir[0], y + dir[1]) ||
                            site.isDoor(x + dir[0], y + dir[1])) {
                            continue;
                        }
                        dir = dir.map((v) => -1 * v);
                    }
                    else {
                        continue; // not valid start for tunnel
                    }
                    startX = x + dir[0];
                    startY = y + dir[1];
                    endX = x;
                    endY = y;
                    for (j = 0; j < maxLength; ++j) {
                        endX -= dir[0];
                        endY -= dir[1];
                        // if (site.hasXY(endX, endY) && !grid.cell(endX, endY).isNull()) {
                        if (isValidTunnelEnd(endX, endY, dir)) {
                            break;
                        }
                    }
                    if (j < maxLength) {
                        path.calculateDistances(pathGrid, startX, startY, costGrid, false);
                        // pathGrid.fill(30000);
                        // pathGrid[startX][startY] = 0;
                        // dijkstraScan(pathGrid, costGrid, false);
                        if (pathGrid[endX][endY] > minDistance &&
                            pathGrid[endX][endY] < 30000) {
                            // and if the pathing distance between the two flanking floor tiles exceeds minDistance,
                            // dungeon.debug(
                            //     'Adding Loop',
                            //     startX,
                            //     startY,
                            //     ' => ',
                            //     endX,
                            //     endY,
                            //     ' : ',
                            //     pathGrid[endX][endY]
                            // );
                            while (endX !== startX || endY !== startY) {
                                if (site.isNothing(endX, endY)) {
                                    site.setTile(endX, endY, FLOOR);
                                    costGrid[endX][endY] = 1; // (Cost map also needs updating.)
                                }
                                endX += dir[0];
                                endY += dir[1];
                            }
                            // TODO - Door is optional
                            site.setTile(x, y, DOOR); // then turn the tile into a doorway.
                            ++count;
                            break;
                        }
                    }
                }
            }
        }
        grid.free(pathGrid);
        grid.free(costGrid);
        return count;
    }
}
// Add some loops to the otherwise simply connected network of rooms.
function digLoops(grid, opts = {}) {
    const digger = new LoopDigger(opts);
    const site = new GridSite(grid);
    return digger.create(site);
}

var loop = {
    __proto__: null,
    LoopDigger: LoopDigger,
    digLoops: digLoops
};

function start(grid) {
    initSeqence(grid.width * grid.height);
    grid.fill(0);
}
function finish(grid) {
    removeDiagonalOpenings(grid);
    finishWalls(grid);
    finishDoors(grid);
}
// Returns an array of door sites if successful
function addRoom(map, opts) {
    opts = opts || { room: 'DEFAULT', hall: 'DEFAULT', tries: 10 };
    if (typeof opts === 'string') {
        opts = { room: opts };
    }
    if (opts.loc) {
        opts.locs = [opts.loc];
    }
    let roomDigger;
    if (typeof opts.room === 'function')
        opts.room = opts.room();
    if (!opts.room)
        roomDigger = rooms.DEFAULT;
    else if (typeof opts.room === 'string') {
        const name = opts.room;
        roomDigger = rooms[name];
        if (!roomDigger) {
            throw new Error('Failed to find room: ' + name);
        }
    }
    else if (opts.room instanceof RoomDigger) {
        roomDigger = opts.room;
    }
    else {
        throw new Error('No room to build!');
    }
    // const roomConfig = opts.room as TYPES.RoomConfig;
    let hallConfig = null;
    if (opts.hall === true)
        opts.hall = 'DEFAULT';
    if (opts.hall !== false && !opts.hall)
        opts.hall = 'DEFAULT';
    if (typeof opts.hall === 'function')
        opts.hall = { fn: opts.hall };
    if (typeof opts.hall === 'string') {
        const name = opts.hall;
        opts.hall = halls[name];
        if (!opts.hall) {
            utils$1.ERROR('Failed to find hall: ' + name);
            return null;
        }
        hallConfig = opts.hall;
    }
    else {
        if (opts.hall && opts.hall.fn) {
            hallConfig = opts.hall;
        }
    }
    if (opts.door === false) {
        opts.door = 0;
    }
    else if (opts.door === true) {
        opts.door = DOOR;
    }
    else if (typeof opts.door === 'number') {
        opts.door = random.chance(opts.door) ? DOOR : FLOOR;
    }
    else {
        opts.door = FLOOR;
    }
    let locs = opts.locs || null;
    // @ts-ignore
    if (locs && locs.doors)
        locs = locs.doors;
    if (!locs || !Array.isArray(locs)) {
        locs = null;
        if (map.count(FLOOR) === 0) {
            // empty map
            const x = Math.floor(map.width / 2);
            const y = map.height - 2;
            locs = [[x, y]];
        }
    }
    else if (locs &&
        locs.length &&
        locs.length == 2 &&
        typeof locs[0] == 'number') {
        // @ts-ignore
        locs = [locs];
    }
    else if (locs.length == 0) {
        locs = null;
    }
    const roomGrid = grid.alloc(map.width, map.height);
    const site = new GridSite(roomGrid);
    let attachHall = false;
    if (hallConfig) {
        let hallChance = hallConfig.chance !== undefined ? hallConfig.chance : 15;
        attachHall = random.chance(hallChance);
    }
    // const force = config.force || false;
    let room$1 = null;
    let result = false;
    let tries = opts.tries || 10;
    while (--tries >= 0 && !result) {
        roomGrid.fill(NOTHING);
        // dig the room in the center
        room$1 = roomDigger.create(site);
        // optionally add a hall
        if (attachHall) {
            const hallDigger = new HallDigger();
            room$1.hall = hallDigger.create(site, room$1.doors);
        }
        if (locs) {
            // try the doors first
            result = attachRoomAtMapDoor(map, locs, roomGrid, room$1, opts);
        }
        else {
            result = attachRoom(map, roomGrid, room$1, opts);
        }
        // console.log(
        //     'try',
        //     room.hall ? 'hall: ' + room.hall.dir : 'no hall',
        //     result
        // );
        // if (!result) {
        //     roomGrid.dump();
        //     map.dump();
        //     console.log(
        //         'room doors',
        //         (room.hall ? room.hall.doors : room.doors).join(', ')
        //     );
        //     console.log('map locs', locs.join(', '));
        // }
    }
    grid.free(roomGrid);
    return room$1 && result ? room$1 : null;
}
// Add some loops to the otherwise simply connected network of rooms.
function addLoops(grid, minDistance, maxLength) {
    return digLoops(grid, { minDistance, maxLength });
}
function addLakes(map, opts = {}) {
    const lakes = new Lakes(opts);
    const site = new GridSite(map);
    return lakes.create(site);
}
function addBridges(grid, opts = {}) {
    const bridges = new Bridges(opts);
    const site = new GridSite(grid);
    return bridges.create(site);
}
function addStairs(grid, opts = {}) {
    const stairs$1 = new Stairs(opts);
    const site = new GridSite(grid);
    return stairs$1.create(site);
}
function removeDiagonalOpenings(grid) {
    let i, j, k, x1, y1;
    let diagonalCornerRemoved;
    const site = new GridSite(grid);
    do {
        diagonalCornerRemoved = false;
        for (i = 0; i < grid.width - 1; i++) {
            for (j = 0; j < grid.height - 1; j++) {
                for (k = 0; k <= 1; k++) {
                    if (site.isPassable(i + k, j) &&
                        !site.isPassable(i + (1 - k), j) &&
                        site.isObstruction(i + (1 - k), j) &&
                        !site.isPassable(i + k, j + 1) &&
                        site.isObstruction(i + k, j + 1) &&
                        site.isPassable(i + (1 - k), j + 1)) {
                        if (random.chance(50)) {
                            x1 = i + (1 - k);
                            y1 = j;
                        }
                        else {
                            x1 = i + k;
                            y1 = j + 1;
                        }
                        diagonalCornerRemoved = true;
                        grid[x1][y1] = FLOOR; // todo - pick one of the passable tiles around it...
                    }
                }
            }
        }
    } while (diagonalCornerRemoved == true);
}
function finishDoors(grid) {
    grid.forEach((cell, x, y) => {
        if (grid.isBoundaryXY(x, y))
            return;
        // todo - isDoorway...
        if (cell == DOOR) {
            if (
            // TODO - isPassable
            (grid.get(x + 1, y) == FLOOR ||
                grid.get(x - 1, y) == FLOOR) &&
                (grid.get(x, y + 1) == FLOOR ||
                    grid.get(x, y - 1) == FLOOR)) {
                // If there's passable terrain to the left or right, and there's passable terrain
                // above or below, then the door is orphaned and must be removed.
                grid[x][y] = FLOOR; // todo - take passable neighbor value
            }
            else if (
            // todo - isPassable
            (grid.get(x + 1, y) !== FLOOR ? 1 : 0) +
                (grid.get(x - 1, y) !== FLOOR ? 1 : 0) +
                (grid.get(x, y + 1) !== FLOOR ? 1 : 0) +
                (grid.get(x, y - 1) !== FLOOR ? 1 : 0) >=
                3) {
                // If the door has three or more pathing blocker neighbors in the four cardinal directions,
                // then the door is orphaned and must be removed.
                grid[x][y] = FLOOR; // todo - take passable neighbor
            }
        }
    });
}
function finishWalls(grid, tile = WALL) {
    grid.forEach((cell, i, j) => {
        if (cell == NOTHING) {
            grid[i][j] = tile;
        }
    });
}
class Level {
    constructor(width, height, options = {}) {
        this.rooms = {};
        this.doors = { chance: 15 };
        this.halls = { chance: 15 };
        this.loops = {};
        this.lakes = {};
        this.bridges = {};
        this.stairs = {};
        this.boundary = true;
        this.startLoc = [-1, -1];
        this.endLoc = [-1, -1];
        this.height = height;
        this.width = width;
        if (options.seed) {
            random.seed(options.seed);
        }
        utils$1.setOptions(this.rooms, options.rooms);
        utils$1.setOptions(this.halls, options.halls);
        utils$1.setOptions(this.loops, options.loops);
        utils$1.setOptions(this.lakes, options.lakes);
        utils$1.setOptions(this.bridges, options.bridges);
        utils$1.setOptions(this.stairs, options.stairs);
        utils$1.setOptions(this.doors, options.doors);
        this.startLoc = options.startLoc || [Math.floor(width / 2), height - 2];
        this.endLoc = options.endLoc || [-1, -1];
    }
    makeSite(grid) {
        return new GridSite(grid);
    }
    create(setFn) {
        const grid$1 = grid.alloc(this.width, this.height, 0);
        const site = this.makeSite(grid$1);
        this.start(site);
        this.addFirstRoom(site);
        let fails = 0;
        while (fails < 20) {
            if (this.addRoom(site)) {
                fails = 0;
            }
            else {
                ++fails;
            }
        }
        this.addLoops(site, this.loops);
        this.addLakes(site, this.lakes);
        this.addBridges(site, this.bridges);
        this.addStairs(site, this.stairs);
        this.finish(site);
        grid$1.forEach((v, x, y) => {
            if (v)
                setFn(x, y, v);
        });
        grid.free(grid$1);
        return true;
    }
    start(_site) {
        initSeqence(this.width * this.height);
    }
    getDigger(id) {
        if (!id)
            throw new Error('Missing digger!');
        if (id instanceof RoomDigger)
            return id;
        if (typeof id === 'string') {
            const digger = rooms[id];
            if (!digger) {
                throw new Error('Failed to find digger - ' + id);
            }
            return digger;
        }
        return new ChoiceRoom(id);
    }
    addFirstRoom(site) {
        const grid$1 = grid.alloc(site.width, site.height);
        const roomSite = this.makeSite(grid$1);
        let digger = this.getDigger(this.rooms.first || this.rooms.digger || 'DEFAULT');
        let room = digger.create(roomSite);
        if (room &&
            !this._attachRoomAtLoc(site, roomSite, room, this.startLoc)) {
            room = null;
        }
        grid.free(grid$1);
        // Should we add the starting stairs now too?
        return room;
    }
    addRoom(site) {
        const grid$1 = grid.alloc(site.width, site.height);
        const roomSite = this.makeSite(grid$1);
        let digger = this.getDigger(this.rooms.digger || 'DEFAULT');
        let room = digger.create(roomSite);
        // attach hall?
        if (this.halls.chance) {
            let hall$1 = dig(this.halls, roomSite, room.doors);
            if (hall$1) {
                room.hall = hall$1;
            }
        }
        if (room && !this._attachRoom(site, roomSite, room)) {
            room = null;
        }
        grid.free(grid$1);
        return room;
    }
    _attachRoom(site, roomSite, room) {
        // console.log('attachRoom');
        const doorSites = room.hall ? room.hall.doors : room.doors;
        // Slide hyperspace across real space, in a random but predetermined order, until the room matches up with a wall.
        for (let i = 0; i < SEQ.length; i++) {
            const x = Math.floor(SEQ[i] / this.height);
            const y = SEQ[i] % this.height;
            if (!site.isNothing(x, y))
                continue;
            const dir = directionOfDoorSite(site, x, y);
            if (dir != utils$1.NO_DIRECTION) {
                const oppDir = (dir + 2) % 4;
                const door = doorSites[oppDir];
                if (!door)
                    continue;
                const offsetX = x - door[0];
                const offsetY = y - door[1];
                if (door[0] != -1 &&
                    this._roomFitsAt(site, roomSite, offsetX, offsetY)) {
                    // TYPES.Room fits here.
                    site.copy(roomSite, offsetX, offsetY);
                    this._attachDoor(site, room, x, y, oppDir);
                    // door[0] = -1;
                    // door[1] = -1;
                    room.translate(offsetX, offsetY);
                    return true;
                }
            }
        }
        return false;
    }
    _attachRoomAtLoc(site, roomSite, room, attachLoc) {
        const [x, y] = attachLoc;
        const doorSites = room.hall ? room.hall.doors : room.doors;
        const dirs = random.sequence(4);
        // console.log('attachRoomAtXY', x, y, doorSites.join(', '));
        for (let dir of dirs) {
            const oppDir = (dir + 2) % 4;
            const door = doorSites[oppDir];
            if (!door || door[0] == -1)
                continue;
            const offX = x - door[0];
            const offY = y - door[1];
            if (this._roomFitsAt(site, roomSite, offX, offY)) {
                // dungeon.debug("attachRoom: ", x, y, oppDir);
                // TYPES.Room fits here.
                site.copy(roomSite, offX, offY);
                // this._attachDoor(site, room, x, y, oppDir);  // No door on first room!
                room.translate(offX, offY);
                // const newDoors = doorSites.map((site) => {
                //     const x0 = site[0] + offX;
                //     const y0 = site[1] + offY;
                //     if (x0 == x && y0 == y) return [-1, -1] as GW.utils.Loc;
                //     return [x0, y0] as GW.utils.Loc;
                // });
                return true;
            }
        }
        return false;
    }
    _roomFitsAt(map, roomGrid, roomToSiteX, roomToSiteY) {
        let xRoom, yRoom, xSite, ySite, i, j;
        // console.log('roomFitsAt', roomToSiteX, roomToSiteY);
        for (xRoom = 0; xRoom < roomGrid.width; xRoom++) {
            for (yRoom = 0; yRoom < roomGrid.height; yRoom++) {
                if (roomGrid.isSet(xRoom, yRoom)) {
                    xSite = xRoom + roomToSiteX;
                    ySite = yRoom + roomToSiteY;
                    for (i = xSite - 1; i <= xSite + 1; i++) {
                        for (j = ySite - 1; j <= ySite + 1; j++) {
                            if (!map.hasXY(i, j) ||
                                map.isBoundaryXY(i, j) ||
                                !map.isNothing(i, j)) {
                                // console.log('- NO');
                                return false;
                            }
                        }
                    }
                }
            }
        }
        // console.log('- YES');
        return true;
    }
    _attachDoor(map, room, x, y, dir) {
        const opts = this.doors;
        if (opts.chance === 0)
            return; // no door at all
        const isDoor = opts.chance && random.chance(opts.chance); // did not pass chance
        const tile = isDoor ? opts.tile || DOOR : FLOOR;
        map.setTile(x, y, tile); // Door site.
        // most cases...
        if (!room.hall || !(room.hall.width > 1) || room.hall.dir !== dir) {
            return;
        }
        if (dir === utils$1.UP || dir === utils$1.DOWN) {
            let didSomething = true;
            let k = 1;
            while (didSomething) {
                didSomething = false;
                if (map.isNothing(x - k, y)) {
                    if (map.isSet(x - k, y - 1) && map.isSet(x - k, y + 1)) {
                        map.setTile(x - k, y, tile);
                        didSomething = true;
                    }
                }
                if (map.isNothing(x + k, y)) {
                    if (map.isSet(x + k, y - 1) && map.isSet(x + k, y + 1)) {
                        map.setTile(x + k, y, tile);
                        didSomething = true;
                    }
                }
                ++k;
            }
        }
        else {
            let didSomething = true;
            let k = 1;
            while (didSomething) {
                didSomething = false;
                if (map.isNothing(x, y - k)) {
                    if (map.isSet(x - 1, y - k) && map.isSet(x + 1, y - k)) {
                        map.setTile(x, y - k, tile);
                        didSomething = true;
                    }
                }
                if (map.isNothing(x, y + k)) {
                    if (map.isSet(x - 1, y + k) && map.isSet(x + 1, y + k)) {
                        map.setTile(x, y + k, tile);
                        didSomething = true;
                    }
                }
                ++k;
            }
        }
    }
    addLoops(site, opts) {
        const digger = new LoopDigger(opts);
        return digger.create(site);
    }
    addLakes(site, opts) {
        const digger = new Lakes(opts);
        return digger.create(site);
    }
    addBridges(site, opts) {
        const digger = new Bridges(opts);
        return digger.create(site);
    }
    addStairs(site, opts) {
        const digger = new Stairs(opts);
        return digger.create(site);
    }
    finish(site) {
        this._removeDiagonalOpenings(site);
        this._finishWalls(site);
        this._finishDoors(site);
    }
    _removeDiagonalOpenings(site) {
        let i, j, k, x1, y1;
        let diagonalCornerRemoved;
        do {
            diagonalCornerRemoved = false;
            for (i = 0; i < this.width - 1; i++) {
                for (j = 0; j < this.height - 1; j++) {
                    for (k = 0; k <= 1; k++) {
                        if (site.isPassable(i + k, j) &&
                            !site.isPassable(i + (1 - k), j) &&
                            site.isObstruction(i + (1 - k), j) &&
                            !site.isPassable(i + k, j + 1) &&
                            site.isObstruction(i + k, j + 1) &&
                            site.isPassable(i + (1 - k), j + 1)) {
                            if (random.chance(50)) {
                                x1 = i + (1 - k);
                                y1 = j;
                            }
                            else {
                                x1 = i + k;
                                y1 = j + 1;
                            }
                            diagonalCornerRemoved = true;
                            site.setTile(x1, y1, FLOOR); // todo - pick one of the passable tiles around it...
                        }
                    }
                }
            }
        } while (diagonalCornerRemoved == true);
    }
    _finishDoors(site) {
        utils$1.forRect(this.width, this.height, (x, y) => {
            if (site.isBoundaryXY(x, y))
                return;
            // todo - isDoorway...
            if (site.isDoor(x, y)) {
                if (
                // TODO - isPassable
                (site.isFloor(x + 1, y) || site.isFloor(x - 1, y)) &&
                    (site.isFloor(x, y + 1) || site.isFloor(x, y - 1))) {
                    // If there's passable terrain to the left or right, and there's passable terrain
                    // above or below, then the door is orphaned and must be removed.
                    site.setTile(x, y, FLOOR); // todo - take passable neighbor value
                }
                else if ((site.isObstruction(x + 1, y) ? 1 : 0) +
                    (site.isObstruction(x - 1, y) ? 1 : 0) +
                    (site.isObstruction(x, y + 1) ? 1 : 0) +
                    (site.isObstruction(x, y - 1) ? 1 : 0) >=
                    3) {
                    // If the door has three or more pathing blocker neighbors in the four cardinal directions,
                    // then the door is orphaned and must be removed.
                    site.setTile(x, y, FLOOR); // todo - take passable neighbor
                }
            }
        });
    }
    _finishWalls(site) {
        const boundaryTile = this.boundary ? IMPREGNABLE : WALL;
        utils$1.forRect(this.width, this.height, (x, y) => {
            if (site.isNothing(x, y)) {
                if (site.isBoundaryXY(x, y)) {
                    site.setTile(x, y, boundaryTile);
                }
                else {
                    site.setTile(x, y, WALL);
                }
            }
        });
    }
}
class Dungeon {
    constructor(options = {}) {
        this.config = {
            levels: 1,
            width: 80,
            height: 34,
            rooms: { count: 20, digger: 'DEFAULT' },
            halls: {},
            loops: {},
            lakes: {},
            bridges: {},
            stairs: {},
            boundary: true,
        };
        this.seeds = [];
        this.stairLocs = [];
        utils$1.setOptions(this.config, options);
        if (this.config.seed) {
            random.seed(this.config.seed);
        }
        this.initSeeds();
        this.initStairLocs();
    }
    get levels() {
        return this.config.levels;
    }
    initSeeds() {
        for (let i = 0; i < this.config.levels; ++i) {
            this.seeds[i] = random.number();
        }
    }
    initStairLocs() {
        let startLoc = this.config.startLoc || [
            Math.floor(this.config.width / 2),
            this.config.height - 2,
        ];
        const minDistance = this.config.stairDistance ||
            Math.floor(Math.max(this.config.width / 2, this.config.height / 2));
        for (let i = 0; i < this.config.levels; ++i) {
            const endLoc = random.matchingXY(this.config.width, this.config.height, (x, y) => {
                return (utils$1.distanceBetween(startLoc[0], startLoc[1], x, y) > minDistance);
            });
            this.stairLocs.push([
                [startLoc[0], startLoc[1]],
                [endLoc[0], endLoc[1]],
            ]);
            startLoc = endLoc;
        }
    }
    getLevel(id, cb) {
        if (id < 0 || id > this.config.levels)
            throw new Error('Invalid level id: ' + id);
        random.seed(this.seeds[id]);
        // Generate the level
        const [startLoc, endLoc] = this.stairLocs[id];
        const stairOpts = Object.assign({}, this.config.stairs);
        if (this.config.goesUp) {
            stairOpts.down = startLoc;
            stairOpts.up = endLoc;
            if (id == 0 && this.config.startTile) {
                stairOpts.downTile = this.config.startTile;
            }
            if (id == this.config.levels - 1 && this.config.endTile) {
                stairOpts.upTile = this.config.endTile;
            }
        }
        else {
            stairOpts.down = endLoc;
            stairOpts.up = startLoc;
            if (id == 0 && this.config.startTile) {
                stairOpts.upTile = this.config.startTile;
            }
            if (id == this.config.levels - 1 && this.config.endTile) {
                stairOpts.downTile = this.config.endTile;
            }
        }
        const rooms = Object.assign({}, this.config.rooms);
        if (id === 0 && rooms.entrance) {
            rooms.first = rooms.entrance;
        }
        const levelOpts = {
            loops: this.config.loops,
            lakes: this.config.lakes,
            bridges: this.config.bridges,
            rooms: rooms,
            stairs: stairOpts,
            boundary: this.config.boundary,
            width: this.config.width,
            height: this.config.height,
        };
        return this.makeLevel(id, levelOpts, cb);
        // TODO - Update startLoc, endLoc
    }
    makeLevel(id, opts, cb) {
        const level = new Level(this.config.width, this.config.height, opts);
        const result = level.create(cb);
        if (!utils$1.equalsXY(level.endLoc, opts.endLoc) ||
            !utils$1.equalsXY(level.startLoc, opts.startLoc)) {
            this.stairLocs[id] = [level.startLoc, level.endLoc];
        }
        return result;
    }
}

var dig$1 = {
    __proto__: null,
    room: room,
    hall: hall,
    lake: lake,
    bridge: bridge,
    stairs: stairs,
    utils: utils,
    loop: loop,
    start: start,
    finish: finish,
    addRoom: addRoom,
    addLoops: addLoops,
    addLakes: addLakes,
    addBridges: addBridges,
    addStairs: addStairs,
    removeDiagonalOpenings: removeDiagonalOpenings,
    finishDoors: finishDoors,
    finishWalls: finishWalls,
    Level: Level,
    Dungeon: Dungeon,
    NOTHING: NOTHING,
    FLOOR: FLOOR,
    DOOR: DOOR,
    WALL: WALL,
    DEEP: DEEP,
    SHALLOW: SHALLOW,
    BRIDGE: BRIDGE,
    UP_STAIRS: UP_STAIRS,
    DOWN_STAIRS: DOWN_STAIRS,
    IMPREGNABLE: IMPREGNABLE,
    TILEMAP: TILEMAP,
    SEQ: SEQ,
    initSeqence: initSeqence,
    fillCostGrid: fillCostGrid,
    GridSite: GridSite,
    Hall: Hall,
    Room: Room
};

export { dig$1 as dig };
