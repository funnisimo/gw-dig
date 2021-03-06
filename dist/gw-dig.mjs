import { random, path, utils as utils$1, grid, range } from 'gw-utils';

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
    source.forEach((_v, x, y) => {
        costGrid[x][y] = isPassable(source, x, y) ? 1 : path.OBSTRUCTION;
    });
}
function isPassable(grid, x, y) {
    return (isFloor(grid, x, y) ||
        isDoor(grid, x, y) ||
        isBridge(grid, x, y) ||
        isStairs(grid, x, y) ||
        isShallow(grid, x, y));
}
function isNothing(grid, x, y) {
    const v = grid.get(x, y);
    return v === NOTHING;
}
function isFloor(grid, x, y) {
    return grid.get(x, y) == FLOOR;
}
function isDoor(grid, x, y) {
    const v = grid.get(x, y);
    return v === DOOR;
}
function isBridge(grid, x, y) {
    const v = grid.get(x, y);
    return v === BRIDGE;
}
function isWall(grid, x, y) {
    const v = grid.get(x, y);
    return v === WALL || v === IMPREGNABLE;
}
function isObstruction(grid, x, y) {
    return isNothing(grid, x, y) || isWall(grid, x, y);
}
function isStairs(grid, x, y) {
    const v = grid.get(x, y);
    return v === UP_STAIRS || v === DOWN_STAIRS;
}
function isDeep(grid, x, y) {
    return grid.get(x, y) === DEEP;
}
function isShallow(grid, x, y) {
    return grid.get(x, y) === SHALLOW;
}
function isAnyWater(grid, x, y) {
    return isDeep(grid, x, y) || isShallow(grid, x, y);
}

const DIRS = utils$1.DIRS;
function attachRoom(map, roomGrid, room, opts) {
    // console.log('attachRoom');
    const doorSites = room.hall ? room.hall.doors : room.doors;
    // Slide hyperspace across real space, in a random but predetermined order, until the room matches up with a wall.
    for (let i = 0; i < SEQ.length; i++) {
        const x = Math.floor(SEQ[i] / map.height);
        const y = SEQ[i] % map.height;
        if (!(map.get(x, y) == NOTHING))
            continue;
        const dir = directionOfDoorSite(map, x, y, FLOOR);
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
function directionOfDoorSite(grid, x, y, isOpen) {
    let dir, solutionDir;
    let newX, newY, oppX, oppY;
    const fnOpen = typeof isOpen === 'function'
        ? isOpen
        : (v) => v == isOpen;
    solutionDir = utils$1.NO_DIRECTION;
    for (dir = 0; dir < 4; dir++) {
        newX = x + DIRS[dir][0];
        newY = y + DIRS[dir][1];
        oppX = x - DIRS[dir][0];
        oppY = y - DIRS[dir][1];
        if (grid.hasXY(oppX, oppY) &&
            grid.hasXY(newX, newY) &&
            fnOpen(grid[oppX][oppY], oppX, oppY, grid)) {
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
function forceRoomAtMapLoc(map, xy, roomGrid, room, opts) {
    // console.log('forceRoomAtMapLoc', xy);
    // Slide room across map, in a random but predetermined order, until the room matches up with a wall.
    for (let i = 0; i < SEQ.length; i++) {
        const x = Math.floor(SEQ[i] / map.height);
        const y = SEQ[i] % map.height;
        if (roomGrid[x][y])
            continue;
        const dir = directionOfDoorSite(roomGrid, x, y, FLOOR);
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
function chooseRandomDoorSites(sourceGrid, floorTile) {
    let i, j, k, newX, newY;
    let dir;
    let doorSiteFailed;
    floorTile = floorTile || FLOOR;
    const grid$1 = grid.alloc(sourceGrid.width, sourceGrid.height);
    grid$1.copy(sourceGrid);
    for (i = 0; i < grid$1.width; i++) {
        for (j = 0; j < grid$1.height; j++) {
            if (!grid$1[i][j]) {
                dir = directionOfDoorSite(grid$1, i, j, floorTile);
                if (dir != utils$1.NO_DIRECTION) {
                    // Trace a ray 10 spaces outward from the door site to make sure it doesn't intersect the room.
                    // If it does, it's not a valid door site.
                    newX = i + DIRS[dir][0];
                    newY = j + DIRS[dir][1];
                    doorSiteFailed = false;
                    for (k = 0; k < 10 && grid$1.hasXY(newX, newY) && !doorSiteFailed; k++) {
                        if (grid$1[newX][newY]) {
                            doorSiteFailed = true;
                        }
                        newX += DIRS[dir][0];
                        newY += DIRS[dir][1];
                    }
                    if (!doorSiteFailed) {
                        grid$1[i][j] = dir + 200; // So as not to conflict with other tiles.
                    }
                }
            }
        }
    }
    let doorSites = [];
    // Pick four doors, one in each direction, and store them in doorSites[dir].
    for (dir = 0; dir < 4; dir++) {
        const loc = grid$1.randomMatchingLoc(dir + 200) || [-1, -1];
        doorSites[dir] = [loc[0], loc[1]];
    }
    grid.free(grid$1);
    return doorSites;
}

var utils = {
    __proto__: null,
    attachRoom: attachRoom,
    attachDoor: attachDoor,
    roomFitsAt: roomFitsAt,
    directionOfDoorSite: directionOfDoorSite,
    forceRoomAtMapLoc: forceRoomAtMapLoc,
    attachRoomAtMapDoor: attachRoomAtMapDoor,
    chooseRandomDoorSites: chooseRandomDoorSites
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
        if (dir === utils$1.UP || dir === utils$1.DOWN) {
            this.x2 = this.x + (width - 1);
            this.y2 = this.y + (length - 1) * d[1];
        }
        else {
            this.x2 = this.x + (length - 1) * d[0];
            this.y2 = this.y + (width - 1);
        }
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
class Room {
    constructor(digger, x, y, width, height) {
        this.doors = [];
        this.hall = null;
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
var halls = {};
function install(id, fn, config = {}) {
    // @ts-ignore
    const data = fn(config || {}); // call to have function setup the config
    data.fn = fn;
    data.id = id;
    halls[id] = data;
    return data;
}
install('DEFAULT', dig, { chance: 15 });
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
function pickLengthRange(dir, opts) {
    if (!opts.length)
        opts.length = [];
    if (Array.isArray(opts.length)) {
        if (dir == utils$1.UP || dir == utils$1.DOWN) {
            return range.make(opts.length[1] || [2, 9]);
        }
        else {
            return range.make(opts.length[0] || [9, 15]);
        }
    }
    else {
        return range.make(opts.length);
    }
}
function pickHallDirection(grid, room, opts) {
    const doors = room.doors;
    // Pick a direction.
    let dir = opts.dir || utils$1.NO_DIRECTION;
    if (dir == utils$1.NO_DIRECTION) {
        const dirs = random.sequence(4);
        for (let i = 0; i < 4; i++) {
            dir = dirs[i];
            const length = pickLengthRange(dir, opts).hi; // biggest measurement
            const door = doors[dir];
            if (door && door[0] != -1 && door[1] != -1) {
                const dx = door[0] + Math.floor(DIRS$1[dir][0] * length);
                const dy = door[1] + Math.floor(DIRS$1[dir][1] * length);
                if (grid.hasXY(dx, dy)) {
                    break; // That's our direction!
                }
            }
            dir = utils$1.NO_DIRECTION;
        }
    }
    return dir;
}
function pickHallExits(grid, x, y, dir, opts) {
    let newX, newY;
    const obliqueChance = utils$1.firstOpt('obliqueChance', opts, 15);
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
            !grid.hasXY(newX, newY) ||
            grid[newX][newY]) ;
        else {
            hallDoors[dir2] = [newX, newY];
        }
    }
    return hallDoors;
}
function digWide(opts, grid, room) {
    opts = opts || {};
    if (!opts.width) {
        opts.width = 2;
    }
    if (!grid) {
        return opts;
    }
    const dir = pickHallDirection(grid, room, opts);
    if (dir === utils$1.NO_DIRECTION)
        return null;
    const length = pickLengthRange(dir, opts).value();
    const width = pickWidth(opts) || 2;
    const door = room.doors[dir];
    const tile = opts.tile || FLOOR;
    const hallDoors = [];
    let x0, y0;
    let hall;
    if (dir === utils$1.UP) {
        x0 = utils$1.clamp(door[0], room.x, room.x + room.width - width);
        y0 = door[1] - length + 1;
        for (let x = x0; x < x0 + width; ++x) {
            for (let y = y0; y < y0 + length; ++y) {
                grid[x][y] = tile;
            }
        }
        hallDoors[dir] = [x0, y0 - 1];
        hall = new Hall([x0, door[1]], dir, length, 2);
    }
    else if (dir === utils$1.DOWN) {
        x0 = utils$1.clamp(door[0], room.x, room.x + room.width - width);
        y0 = door[1] + length - 1;
        for (let x = x0; x < x0 + width; ++x) {
            for (let y = y0; y > y0 - length; --y) {
                grid[x][y] = tile;
            }
        }
        hallDoors[dir] = [x0, y0 + 1];
        hall = new Hall([x0, door[1]], dir, length, 2);
    }
    else if (dir === utils$1.LEFT) {
        x0 = door[0] - length + 1;
        y0 = utils$1.clamp(door[1], room.y, room.y + room.height - width);
        for (let x = x0; x < x0 + length; ++x) {
            for (let y = y0; y < y0 + width; ++y) {
                grid[x][y] = tile;
            }
        }
        hallDoors[dir] = [x0 - 1, y0];
        hall = new Hall([door[0], y0], dir, length, 2);
    }
    else {
        //if (dir === GW.utils.RIGHT) {
        x0 = door[0] + length - 1;
        y0 = utils$1.clamp(door[1], room.y, room.y + room.height - width);
        for (let x = x0; x > x0 - length; --x) {
            for (let y = y0; y < y0 + width; ++y) {
                grid[x][y] = tile;
            }
        }
        hallDoors[dir] = [x0 + 1, y0];
        hall = new Hall([door[0], y0], dir, length, width);
    }
    hall.doors = hallDoors;
    hall.width = width;
    return hall;
}
function dig(opts, grid, room) {
    opts = opts || {};
    opts.width = 1;
    if (!grid) {
        return opts;
    }
    const dir = pickHallDirection(grid, room, opts);
    if (dir === utils$1.NO_DIRECTION)
        return null;
    const length = pickLengthRange(dir, opts).value();
    const door = room.doors[dir];
    const DIR = DIRS$1[dir];
    let x = door[0];
    let y = door[1];
    const tile = opts.tile || FLOOR;
    for (let i = 0; i < length; i++) {
        grid[x][y] = tile;
        x += DIR[0];
        y += DIR[1];
    }
    x -= DIR[0];
    y -= DIR[1];
    const hall = new Hall(door, dir, length);
    hall.doors = pickHallExits(grid, x, y, dir, opts);
    return hall;
}

var hall = {
    __proto__: null,
    halls: halls,
    install: install,
    pickWidth: pickWidth,
    pickLengthRange: pickLengthRange,
    pickHallDirection: pickHallDirection,
    pickHallExits: pickHallExits,
    digWide: digWide,
    dig: dig
};

var rooms = {};
function install$1(id, fn, config) {
    // @ts-ignore
    const data = fn(config || {}); // call to have function setup the config
    data.fn = fn;
    data.id = id;
    rooms[id] = data;
    return data;
}
install$1('DEFAULT', rectangular);
function checkConfig(config, expected) {
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
                return utils$1.ERROR('Missing required config for digger: ' + key);
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
function cavern(config, grid$1) {
    config = checkConfig(config, { width: 12, height: 8 });
    if (!grid$1)
        return config;
    let destX, destY;
    let blobGrid;
    const width = config.width.value();
    const height = config.height.value();
    const tile = config.tile || FLOOR;
    blobGrid = grid.alloc(grid$1.width, grid$1.height, 0);
    const minWidth = Math.floor(0.5 * width); // 6
    const maxWidth = width;
    const minHeight = Math.floor(0.5 * height); // 4
    const maxHeight = height;
    grid$1.fill(0);
    const bounds = blobGrid.fillBlob(5, minWidth, minHeight, maxWidth, maxHeight, 55, 'ffffffttt', 'ffffttttt');
    // Position the new cave in the middle of the grid...
    destX = Math.floor((grid$1.width - bounds.width) / 2);
    destY = Math.floor((grid$1.height - bounds.height) / 2);
    // ...and copy it to the master grid.
    grid.offsetZip(grid$1, blobGrid, destX - bounds.x, destY - bounds.y, tile);
    grid.free(blobGrid);
    return new Room(config.id, destX, destY, bounds.width, bounds.height);
}
function choiceRoom(config, grid) {
    config = config || {};
    let choices;
    if (Array.isArray(config.choices)) {
        choices = random.item.bind(random, config.choices);
    }
    else if (typeof config.choices == 'object') {
        choices = random.weighted.bind(random, config.choices);
    }
    else {
        utils$1.ERROR('Expected choices to be either array of room ids or map - ex: { ROOM_ID: weight }');
    }
    if (!grid)
        return config;
    let id = choices();
    const digger = rooms[id];
    if (!digger) {
        utils$1.ERROR('Missing digger choice: ' + id);
    }
    let digConfig = digger;
    if (config.opts) {
        digConfig = Object.assign({}, digger, config.opts);
    }
    // debug('Chose room: ', id);
    return digger.fn(digConfig, grid);
}
// From BROGUE => This is a special room that appears at the entrance to the dungeon on depth 1.
function entrance(config, grid) {
    config = checkConfig(config, { width: 20, height: 10 });
    if (!grid)
        return config;
    const width = config.width.value();
    const height = config.height.value();
    const tile = config.tile || FLOOR;
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
    return new Room(config.id, Math.min(roomX, roomX2), Math.min(roomY, roomY2), Math.max(roomWidth, roomWidth2), Math.max(roomHeight, roomHeight2));
}
function cross(config, grid) {
    config = checkConfig(config, { width: 12, height: 20 });
    if (!grid)
        return config;
    const width = config.width.value();
    const height = config.height.value();
    const tile = config.tile || FLOOR;
    const roomWidth = width;
    const roomWidth2 = Math.max(3, Math.floor((width * random.range(25, 75)) / 100)); // [4,20]
    const roomHeight = Math.max(3, Math.floor((height * random.range(25, 75)) / 100)); // [2,5]
    const roomHeight2 = height;
    const roomX = Math.floor((grid.width - roomWidth) / 2);
    const roomX2 = roomX + random.range(2, Math.max(2, roomWidth - roomWidth2 - 2));
    const roomY2 = Math.floor((grid.height - roomHeight2) / 2);
    const roomY = roomY2 + random.range(2, Math.max(2, roomHeight2 - roomHeight - 2));
    grid.fill(0);
    grid.fillRect(roomX, roomY, roomWidth, roomHeight, tile);
    grid.fillRect(roomX2, roomY2, roomWidth2, roomHeight2, tile);
    return new Room(config.id, roomX, roomY2, Math.max(roomWidth, roomWidth2), Math.max(roomHeight, roomHeight2));
}
function symmetricalCross(config, grid) {
    config = checkConfig(config, { width: 7, height: 7 });
    if (!grid)
        return config;
    const width = config.width.value();
    const height = config.height.value();
    const tile = config.tile || FLOOR;
    let minorWidth = Math.max(3, Math.floor((width * random.range(25, 50)) / 100)); // [2,4]
    // if (height % 2 == 0 && minorWidth > 2) {
    //     minorWidth -= 1;
    // }
    let minorHeight = Math.max(3, Math.floor((height * random.range(25, 50)) / 100)); // [2,3]?
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
    return new Room(config.id, Math.min(x, x2), Math.min(y, y2), Math.max(width, minorWidth), Math.max(height, minorHeight));
}
function rectangular(config, grid) {
    config = checkConfig(config, { width: [3, 6], height: [3, 6] });
    if (!grid)
        return config;
    const width = config.width.value();
    const height = config.height.value();
    const tile = config.tile || FLOOR;
    grid.fill(0);
    const x = Math.floor((grid.width - width) / 2);
    const y = Math.floor((grid.height - height) / 2);
    grid.fillRect(x, y, width, height, tile);
    return new Room(config.id, x, y, width, height);
}
function circular(config, grid) {
    config = checkConfig(config, { radius: [3, 4] });
    if (!grid)
        return config;
    const radius = config.radius.value();
    const tile = config.tile || FLOOR;
    grid.fill(0);
    const x = Math.floor(grid.width / 2);
    const y = Math.floor(grid.height / 2);
    if (radius > 1) {
        grid.fillCircle(x, y, radius, tile);
    }
    return new Room(config.id, x - radius, y - radius, radius * 2 + 1, radius * 2 + 1);
}
function brogueDonut(config, grid) {
    config = checkConfig(config, {
        radius: [5, 10],
        ringMinWidth: 3,
        holeMinSize: 3,
        holeChance: 50,
    });
    if (!grid)
        return config;
    const radius = config.radius.value();
    const ringMinWidth = config.ringMinWidth.value();
    const holeMinSize = config.holeMinSize.value();
    const tile = config.tile || FLOOR;
    grid.fill(0);
    const x = Math.floor(grid.width / 2);
    const y = Math.floor(grid.height / 2);
    grid.fillCircle(x, y, radius, tile);
    if (radius > ringMinWidth + holeMinSize &&
        random.chance(config.holeChance.value())) {
        grid.fillCircle(x, y, random.range(holeMinSize, radius - holeMinSize), 0);
    }
    return new Room(config.id, x - radius, y - radius, radius * 2 + 1, radius * 2 + 1);
}
function chunkyRoom(config, grid) {
    config = checkConfig(config, {
        count: [2, 12],
        width: [5, 20],
        height: [5, 20],
    });
    if (!grid)
        return config;
    let i, x, y;
    let minX, maxX, minY, maxY;
    let chunkCount = config.count.value();
    const width = config.width.value();
    const height = config.height.value();
    const tile = config.tile || FLOOR;
    minX = Math.floor(grid.width / 2) - Math.floor(width / 2);
    maxX = Math.floor(grid.width / 2) + Math.floor(width / 2);
    minY = Math.floor(grid.height / 2) - Math.floor(height / 2);
    maxY = Math.floor(grid.height / 2) + Math.floor(height / 2);
    grid.fill(0);
    grid.fillCircle(Math.floor(grid.width / 2), Math.floor(grid.height / 2), 2, tile);
    for (i = 0; i < chunkCount;) {
        x = random.range(minX, maxX);
        y = random.range(minY, maxY);
        if (grid[x][y]) {
            //            colorOverDungeon(/* Color. */darkGray);
            //            hiliteGrid(grid, /* Color. */white, 100);
            if (x - 2 < minX)
                continue;
            if (x + 2 > maxX)
                continue;
            if (y - 2 < minY)
                continue;
            if (y + 2 > maxY)
                continue;
            grid.fillCircle(x, y, 2, tile);
            i++;
            //            hiliteGrid(grid, /* Color. */green, 50);
            //            temporaryMessage("Added a chunk:", true);
        }
    }
    const bounds = grid.valueBounds(tile);
    return new Room(config.id, bounds.x, bounds.y, bounds.width, bounds.height);
}

var room = {
    __proto__: null,
    rooms: rooms,
    install: install$1,
    checkConfig: checkConfig,
    cavern: cavern,
    choiceRoom: choiceRoom,
    entrance: entrance,
    cross: cross,
    symmetricalCross: symmetricalCross,
    rectangular: rectangular,
    circular: circular,
    brogueDonut: brogueDonut,
    chunkyRoom: chunkyRoom
};

function digLakes(map, opts = {}) {
    let i, j, k;
    let x, y;
    let lakeMaxHeight, lakeMaxWidth, lakeMinSize, tries, maxCount, canDisrupt;
    let count = 0;
    lakeMaxHeight = opts.height || 15; // TODO - Make this a range "5-15"
    lakeMaxWidth = opts.width || 30; // TODO - Make this a range "5-30"
    lakeMinSize = opts.minSize || 5;
    tries = opts.tries || 20;
    maxCount = opts.count || 1;
    canDisrupt = opts.canDisrupt || false;
    const wreath = opts.wreath || 0; // TODO - make this a range "0-2" or a weighted choice { 0: 50, 1: 40, 2" 10 }
    const wreathTile = opts.wreathTile || SHALLOW;
    const tile = opts.tile || DEEP;
    const lakeGrid = grid.alloc(map.width, map.height, 0);
    let attempts = 0;
    while (attempts < maxCount && count < maxCount) {
        // lake generations
        const width = Math.round(((lakeMaxWidth - lakeMinSize) * (maxCount - attempts)) /
            maxCount) + lakeMinSize;
        const height = Math.round(((lakeMaxHeight - lakeMinSize) * (maxCount - attempts)) /
            maxCount) + lakeMinSize;
        lakeGrid.fill(NOTHING);
        const bounds = lakeGrid.fillBlob(5, 4, 4, width, height, 55, 'ffffftttt', 'ffffttttt');
        // lakeGrid.dump();
        let success = false;
        for (k = 0; k < tries && !success; k++) {
            // placement attempts
            // propose a position for the top-left of the lakeGrid in the dungeon
            x = random.range(1 - bounds.x, lakeGrid.width - bounds.width - bounds.x - 2);
            y = random.range(1 - bounds.y, lakeGrid.height - bounds.height - bounds.y - 2);
            if (canDisrupt || !lakeDisruptsPassability(map, lakeGrid, -x, -y)) {
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
                            map[sx][sy] = tile;
                            if (wreath) {
                                map.forCircle(sx, sy, wreath, (v, i, j) => {
                                    if (v === FLOOR || v === DOOR) {
                                        map[i][j] = wreathTile;
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
function lakeDisruptsPassability(map, lakeGrid, lakeToMapX = 0, lakeToMapY = 0) {
    const walkableGrid = grid.alloc(map.width, map.height);
    let disrupts = false;
    // Get all walkable locations after lake added
    map.forEach((v, i, j) => {
        const lakeX = i + lakeToMapX;
        const lakeY = j + lakeToMapY;
        if (!v) {
            return; // not walkable
        }
        else if (isStairs(map, i, j)) {
            if (lakeGrid.get(lakeX, lakeY)) {
                disrupts = true;
            }
            else {
                walkableGrid[i][j] = 1;
            }
        }
        else if (isPassable(map, i, j)) {
            if (lakeGrid.get(lakeX, lakeY))
                return;
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
function isBridgeCandidate(map, x, y, bridgeDir) {
    if (map.get(x, y) === BRIDGE)
        return true;
    if (!isAnyWater(map, x, y))
        return false;
    if (!isAnyWater(map, x + bridgeDir[1], y + bridgeDir[0]))
        return false;
    if (!isAnyWater(map, x - bridgeDir[1], y - bridgeDir[0]))
        return false;
    return true;
}
// Add some loops to the otherwise simply connected network of rooms.
function digBridges(map, minimumPathingDistance, maxConnectionLength) {
    let newX, newY;
    let i, j, d, x, y;
    maxConnectionLength = maxConnectionLength || 1; // by default only break walls down
    const siteGrid = map;
    const pathGrid = grid.alloc(map.width, map.height);
    const costGrid = grid.alloc(map.width, map.height);
    const dirCoords = [
        [1, 0],
        [0, 1],
    ];
    fillCostGrid(map, costGrid);
    const SEQ = random.sequence(map.width * map.height);
    for (i = 0; i < SEQ.length; i++) {
        x = Math.floor(SEQ[i] / siteGrid.height);
        y = SEQ[i] % siteGrid.height;
        if (map.hasXY(x, y) &&
            map.get(x, y) &&
            isPassable(map, x, y) &&
            !isAnyWater(map, x, y)) {
            for (d = 0; d <= 1; d++) {
                // Try right, then down
                const bridgeDir = dirCoords[d];
                newX = x + bridgeDir[0];
                newY = y + bridgeDir[1];
                j = maxConnectionLength;
                if (!map.hasXY(newX, newY))
                    continue;
                // check for line of lake tiles
                // if (isBridgeCandidate(newX, newY, bridgeDir)) {
                if (isAnyWater(map, newX, newY)) {
                    for (j = 0; j < maxConnectionLength; ++j) {
                        newX += bridgeDir[0];
                        newY += bridgeDir[1];
                        // if (!isBridgeCandidate(newX, newY, bridgeDir)) {
                        if (!isAnyWater(map, newX, newY)) {
                            break;
                        }
                    }
                }
                if (map.get(newX, newY) &&
                    isPassable(map, newX, newY) &&
                    j < maxConnectionLength) {
                    path.calculateDistances(pathGrid, newX, newY, costGrid, false);
                    // pathGrid.fill(30000);
                    // pathGrid[newX][newY] = 0;
                    // dijkstraScan(pathGrid, costGrid, false);
                    if (pathGrid[x][y] > minimumPathingDistance &&
                        pathGrid[x][y] < path.NO_PATH) {
                        // and if the pathing distance between the two flanking floor tiles exceeds minimumPathingDistance,
                        // dungeon.debug(
                        //     'Adding Bridge',
                        //     x,
                        //     y,
                        //     ' => ',
                        //     newX,
                        //     newY
                        // );
                        while (x !== newX || y !== newY) {
                            if (isBridgeCandidate(map, x, y, bridgeDir)) {
                                map[x][y] = BRIDGE;
                                costGrid[x][y] = 1; // (Cost map also needs updating.)
                            }
                            else {
                                map[x][y] = FLOOR;
                                costGrid[x][y] = 1;
                            }
                            x += bridgeDir[0];
                            y += bridgeDir[1];
                        }
                        break;
                    }
                }
            }
        }
    }
    grid.free(pathGrid);
    grid.free(costGrid);
}

var lake = {
    __proto__: null,
    digLakes: digLakes,
    digBridges: digBridges
};

function isValidStairLoc(_v, x, y, map) {
    let count = 0;
    if (!isObstruction(map, x, y))
        return false;
    for (let i = 0; i < 4; ++i) {
        const dir = utils$1.DIRS[i];
        if (!map.hasXY(x + dir[0], y + dir[1]))
            return false;
        if (!map.hasXY(x - dir[0], y - dir[1]))
            return false;
        if (isFloor(map, x + dir[0], y + dir[1])) {
            count += 1;
            if (!isObstruction(map, x - dir[0] + dir[1], y - dir[1] + dir[0]))
                return false;
            if (!isObstruction(map, x - dir[0] - dir[1], y - dir[1] - dir[0]))
                return false;
        }
        else if (!isObstruction(map, x + dir[0], y + dir[1])) {
            return false;
        }
    }
    return count == 1;
}
function setupStairs(map, x, y, tile) {
    const indexes = random.sequence(4);
    let dir = null;
    for (let i = 0; i < indexes.length; ++i) {
        dir = utils$1.DIRS[i];
        const x0 = x + dir[0];
        const y0 = y + dir[1];
        if (isFloor(map, x0, y0)) {
            if (isObstruction(map, x - dir[0], y - dir[1]))
                break;
        }
        dir = null;
    }
    if (!dir)
        utils$1.ERROR('No stair direction found!');
    map.set(x, y, tile);
    const dirIndex = utils$1.CLOCK_DIRS.findIndex(
    // @ts-ignore
    (d) => d[0] == dir[0] && d[1] == dir[1]);
    for (let i = 0; i < utils$1.CLOCK_DIRS.length; ++i) {
        const l = i ? i - 1 : 7;
        const r = (i + 1) % 8;
        if (i == dirIndex || l == dirIndex || r == dirIndex)
            continue;
        const d = utils$1.CLOCK_DIRS[i];
        map.set(x + d[0], y + d[1], WALL);
        // map.setCellFlags(x + d[0], y + d[1], Flags.Cell.IMPREGNABLE);
    }
    // dungeon.debug('setup stairs', x, y, tile);
    return true;
}
function addStairs(map, opts = {}) {
    let needUp = opts.up !== false;
    let needDown = opts.down !== false;
    const minDistance = opts.minDistance || Math.floor(Math.max(map.width, map.height) / 2);
    const isValidLoc = opts.isValid || isValidStairLoc;
    const setupFn = opts.setup || setupStairs;
    let upLoc = Array.isArray(opts.up) ? opts.up : null;
    let downLoc = Array.isArray(opts.down) ? opts.down : null;
    const locations = {};
    if (opts.start && typeof opts.start !== 'string') {
        let start = opts.start;
        if (start === true) {
            start = map.randomMatchingLoc(isValidLoc);
        }
        else {
            start = map.matchingLocNear(utils$1.x(start), utils$1.y(start), isValidLoc);
        }
        locations.start = start;
    }
    if (upLoc && downLoc) {
        upLoc = map.matchingLocNear(utils$1.x(upLoc), utils$1.y(upLoc), isValidLoc);
        downLoc = map.matchingLocNear(utils$1.x(downLoc), utils$1.y(downLoc), isValidLoc);
    }
    else if (upLoc && !downLoc) {
        upLoc = map.matchingLocNear(utils$1.x(upLoc), utils$1.y(upLoc), isValidLoc);
        if (needDown) {
            downLoc = map.randomMatchingLoc((v, x, y) => {
                if (utils$1.distanceBetween(x, y, upLoc[0], upLoc[1]) <
                    minDistance)
                    return false;
                return isValidLoc(v, x, y, map);
            });
        }
    }
    else if (downLoc && !upLoc) {
        downLoc = map.matchingLocNear(utils$1.x(downLoc), utils$1.y(downLoc), isValidLoc);
        if (needUp) {
            upLoc = map.randomMatchingLoc((v, x, y) => {
                if (utils$1.distanceBetween(x, y, downLoc[0], downLoc[1]) <
                    minDistance)
                    return false;
                return isValidStairLoc(v, x, y, map);
            });
        }
    }
    else if (needUp) {
        upLoc = map.randomMatchingLoc(isValidLoc);
        if (needDown) {
            downLoc = map.randomMatchingLoc((v, x, y) => {
                if (utils$1.distanceBetween(x, y, upLoc[0], upLoc[1]) <
                    minDistance)
                    return false;
                return isValidStairLoc(v, x, y, map);
            });
        }
    }
    else if (needDown) {
        downLoc = map.randomMatchingLoc(isValidLoc);
    }
    if (upLoc) {
        locations.up = upLoc.slice();
        setupFn(map, upLoc[0], upLoc[1], opts.upTile || UP_STAIRS);
        if (opts.start === 'up')
            locations.start = locations.up;
    }
    if (downLoc) {
        locations.down = downLoc.slice();
        setupFn(map, downLoc[0], downLoc[1], opts.downTile || DOWN_STAIRS);
        if (opts.start === 'down')
            locations.start = locations.down;
    }
    return upLoc || downLoc ? locations : null;
}

var stairs = {
    __proto__: null,
    isValidStairLoc: isValidStairLoc,
    setupStairs: setupStairs,
    addStairs: addStairs
};

function start(map) {
    initSeqence(map.width * map.height);
    map.fill(0);
}
function finish(map) {
    removeDiagonalOpenings(map);
    finishWalls(map);
    finishDoors(map);
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
    if (!opts.room)
        opts.room = 'DEFAULT';
    if (typeof opts.room === 'function')
        opts.room = { fn: opts.room };
    if (typeof opts.room === 'string') {
        const name = opts.room;
        opts.room = rooms[name];
        if (!opts.room) {
            utils$1.ERROR('Failed to find room: ' + name);
        }
    }
    const roomConfig = opts.room;
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
    const digger = opts.room;
    const roomGrid = grid.alloc(map.width, map.height);
    let attachHall = false;
    if (hallConfig) {
        let hallChance = hallConfig.chance !== undefined ? hallConfig.chance : 15;
        attachHall = random.chance(hallChance);
    }
    // const force = config.force || false;
    let result = false;
    let room$1;
    let tries = opts.tries || 10;
    while (--tries >= 0 && !result) {
        roomGrid.fill(NOTHING);
        // dig the room in the center
        room$1 = digger.fn(roomConfig, roomGrid);
        // TODO - Allow choice of floor tile...
        room$1.doors = chooseRandomDoorSites(roomGrid, FLOOR);
        if (attachHall && hallConfig) {
            room$1.hall = hallConfig.fn(hallConfig, roomGrid, room$1);
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
function addLoops(grid$1, minimumPathingDistance, maxConnectionLength) {
    let startX, startY, endX, endY;
    let i, j, d, x, y;
    minimumPathingDistance =
        minimumPathingDistance ||
            Math.floor(Math.min(grid$1.width, grid$1.height) / 2);
    maxConnectionLength = maxConnectionLength || 1; // by default only break walls down
    const siteGrid = grid$1;
    const pathGrid = grid.alloc(grid$1.width, grid$1.height);
    const costGrid = grid.alloc(grid$1.width, grid$1.height);
    const dirCoords = [
        [1, 0],
        [0, 1],
    ];
    fillCostGrid(grid$1, costGrid);
    function isValidTunnelStart(x, y, dir) {
        if (!grid$1.hasXY(x, y))
            return false;
        if (!grid$1.hasXY(x + dir[1], y + dir[0]))
            return false;
        if (!grid$1.hasXY(x - dir[1], y - dir[0]))
            return false;
        if (grid$1.get(x, y))
            return false;
        if (grid$1.get(x + dir[1], y + dir[0]))
            return false;
        if (grid$1.get(x - dir[1], y - dir[0]))
            return false;
        return true;
    }
    function isValidTunnelEnd(x, y, dir) {
        if (!grid$1.hasXY(x, y))
            return false;
        if (!grid$1.hasXY(x + dir[1], y + dir[0]))
            return false;
        if (!grid$1.hasXY(x - dir[1], y - dir[0]))
            return false;
        if (grid$1.get(x, y))
            return true;
        if (grid$1.get(x + dir[1], y + dir[0]))
            return true;
        if (grid$1.get(x - dir[1], y - dir[0]))
            return true;
        return false;
    }
    for (i = 0; i < SEQ.length; i++) {
        x = Math.floor(SEQ[i] / siteGrid.height);
        y = SEQ[i] % siteGrid.height;
        const cell = siteGrid[x][y];
        if (!cell) {
            for (d = 0; d <= 1; d++) {
                // Try a horizontal door, and then a vertical door.
                let dir = dirCoords[d];
                if (!isValidTunnelStart(x, y, dir))
                    continue;
                j = maxConnectionLength;
                // check up/left
                if (grid$1.hasXY(x + dir[0], y + dir[1]) &&
                    isPassable(grid$1, x + dir[0], y + dir[1])) {
                    // just can't build directly into a door
                    if (!grid$1.hasXY(x - dir[0], y - dir[1]) ||
                        isDoor(grid$1, x - dir[0], y - dir[1])) {
                        continue;
                    }
                }
                else if (grid$1.hasXY(x - dir[0], y - dir[1]) &&
                    isPassable(grid$1, x - dir[0], y - dir[1])) {
                    if (!grid$1.hasXY(x + dir[0], y + dir[1]) ||
                        isDoor(grid$1, x + dir[0], y + dir[1])) {
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
                for (j = 0; j < maxConnectionLength; ++j) {
                    endX -= dir[0];
                    endY -= dir[1];
                    // if (grid.hasXY(endX, endY) && !grid.cell(endX, endY).isNull()) {
                    if (isValidTunnelEnd(endX, endY, dir)) {
                        break;
                    }
                }
                if (j < maxConnectionLength) {
                    path.calculateDistances(pathGrid, startX, startY, costGrid, false);
                    // pathGrid.fill(30000);
                    // pathGrid[startX][startY] = 0;
                    // dijkstraScan(pathGrid, costGrid, false);
                    if (pathGrid[endX][endY] > minimumPathingDistance &&
                        pathGrid[endX][endY] < 30000) {
                        // and if the pathing distance between the two flanking floor tiles exceeds minimumPathingDistance,
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
                            if (grid$1.get(endX, endY) == 0) {
                                grid$1[endX][endY] = FLOOR;
                                costGrid[endX][endY] = 1; // (Cost map also needs updating.)
                            }
                            endX += dir[0];
                            endY += dir[1];
                        }
                        // TODO - Door is optional
                        grid$1[x][y] = DOOR; // then turn the tile into a doorway.
                        break;
                    }
                }
            }
        }
    }
    grid.free(pathGrid);
    grid.free(costGrid);
}
function addLakes(map, opts = {}) {
    return digLakes(map, opts);
}
function addBridges(map, minimumPathingDistance, maxConnectionLength) {
    return digBridges(map, minimumPathingDistance, maxConnectionLength);
}
function addStairs$1(map, opts = {}) {
    return addStairs(map, opts);
}
function removeDiagonalOpenings(grid) {
    let i, j, k, x1, y1;
    let diagonalCornerRemoved;
    do {
        diagonalCornerRemoved = false;
        for (i = 0; i < grid.width - 1; i++) {
            for (j = 0; j < grid.height - 1; j++) {
                for (k = 0; k <= 1; k++) {
                    if (isPassable(grid, i + k, j) &&
                        !isPassable(grid, i + (1 - k), j) &&
                        isObstruction(grid, i + (1 - k), j) &&
                        !isPassable(grid, i + k, j + 1) &&
                        isObstruction(grid, i + k, j + 1) &&
                        isPassable(grid, i + (1 - k), j + 1)) {
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

var dig$1 = {
    __proto__: null,
    room: room,
    hall: hall,
    lake: lake,
    stairs: stairs,
    utils: utils,
    start: start,
    finish: finish,
    addRoom: addRoom,
    addLoops: addLoops,
    addLakes: addLakes,
    addBridges: addBridges,
    addStairs: addStairs$1,
    removeDiagonalOpenings: removeDiagonalOpenings,
    finishDoors: finishDoors,
    finishWalls: finishWalls,
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
    isPassable: isPassable,
    isNothing: isNothing,
    isFloor: isFloor,
    isDoor: isDoor,
    isBridge: isBridge,
    isWall: isWall,
    isObstruction: isObstruction,
    isStairs: isStairs,
    isDeep: isDeep,
    isShallow: isShallow,
    isAnyWater: isAnyWater,
    Hall: Hall,
    Room: Room
};

export { dig$1 as dig };
