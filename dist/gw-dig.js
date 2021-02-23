(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('gw-utils')) :
    typeof define === 'function' && define.amd ? define(['exports', 'gw-utils'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.GW = global.GW || {}, global.GW));
}(this, (function (exports, GW) { 'use strict';

    const NOTHING = 0;
    const FLOOR = 1;
    const DOOR = 2;
    const WALL = 3;
    const LAKE = 4;
    const BRIDGE = 5;

    class Hall {
        constructor(loc, dir, length, width = 1) {
            this.width = 1;
            this.doors = [];
            this.x = loc[0];
            this.y = loc[1];
            const d = GW.utils.DIRS[dir];
            this.length = length;
            this.width = width;
            if (dir === GW.utils.UP || dir === GW.utils.DOWN) {
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
    var rooms = {};
    function install(id, fn, config) {
        // @ts-ignore
        config = fn(config || {}); // call to have function setup the config
        config.fn = fn;
        config.id = id;
        rooms[id] = config;
        return config;
    }
    function checkConfig(config, opts) {
        config = config || {};
        opts = opts || {};
        Object.entries(opts).forEach(([key, expect]) => {
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
                    GW.utils.WARN('Missing required config for digger: ' + key);
                    return;
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
                GW.utils.WARN('Unexpected digger configuration parameter: ', key, '' + expect);
                return;
            }
            const range = GW.range.make(have);
            if (!range) {
                GW.utils.ERROR('Invalid configuration for digger: ' + key);
            }
            config[key] = range;
        });
        return config;
    }
    function cavern(config, grid) {
        config = checkConfig(config, { width: 12, height: 8 });
        if (!grid)
            return config;
        let destX, destY;
        let blobGrid;
        const width = config.width.value();
        const height = config.height.value();
        const tile = config.tile || FLOOR;
        blobGrid = GW.grid.alloc(grid.width, grid.height, 0);
        const minWidth = Math.floor(0.5 * width); // 6
        const maxWidth = width;
        const minHeight = Math.floor(0.5 * height); // 4
        const maxHeight = height;
        grid.fill(0);
        const bounds = blobGrid.fillBlob(5, minWidth, minHeight, maxWidth, maxHeight, 55, 'ffffffttt', 'ffffttttt');
        // Position the new cave in the middle of the grid...
        destX = Math.floor((grid.width - bounds.width) / 2);
        destY = Math.floor((grid.height - bounds.height) / 2);
        // ...and copy it to the master grid.
        GW.grid.offsetZip(grid, blobGrid, destX - bounds.x, destY - bounds.y, tile);
        GW.grid.free(blobGrid);
        return new Room(config.id, destX, destY, bounds.width, bounds.height);
    }
    function choiceRoom(config, grid) {
        config = config || {};
        let choices;
        if (Array.isArray(config.choices)) {
            choices = GW.random.item.bind(GW.random, config.choices);
        }
        else if (typeof config.choices == 'object') {
            choices = GW.random.weighted.bind(GW.random, config.choices);
        }
        else {
            return GW.utils.ERROR('Expected choices to be either array of choices or map { digger: weight }');
        }
        if (!grid)
            return config;
        let id = choices();
        const digger = rooms[id];
        if (!digger) {
            return GW.utils.ERROR('Missing digger choice: ' + id);
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
        const roomWidth2 = Math.max(3, Math.floor((width * GW.random.range(25, 75)) / 100)); // [4,20]
        const roomHeight = Math.max(3, Math.floor((height * GW.random.range(25, 75)) / 100)); // [2,5]
        const roomHeight2 = height;
        const roomX = Math.floor((grid.width - roomWidth) / 2);
        const roomX2 = roomX + GW.random.range(2, Math.max(2, roomWidth - roomWidth2 - 2));
        const roomY2 = Math.floor((grid.height - roomHeight2) / 2);
        const roomY = roomY2 + GW.random.range(2, Math.max(2, roomHeight2 - roomHeight - 2));
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
        let minorWidth = Math.max(3, Math.floor((width * GW.random.range(25, 50)) / 100)); // [2,4]
        if (height % 2 == 0 && minorWidth > 2) {
            minorWidth -= 1;
        }
        let minorHeight = Math.max(3, Math.floor((height * GW.random.range(25, 50)) / 100)); // [2,3]?
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
        return new Room(config.id, x, y, radius * 2, radius * 2);
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
            GW.random.chance(config.holeChance.value())) {
            grid.fillCircle(x, y, GW.random.range(holeMinSize, radius - holeMinSize), 0);
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
            x = GW.random.range(minX, maxX);
            y = GW.random.range(minY, maxY);
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
        Hall: Hall,
        Room: Room,
        rooms: rooms,
        install: install,
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

    const DIRS = GW.utils.DIRS;
    function pickHallLength(dir, opts) {
        const horizontalLength = GW.utils.firstOpt('horizontalHallLength', opts, [
            9,
            15,
        ]);
        const verticalLength = GW.utils.firstOpt('verticalHallLength', opts, [
            2,
            9,
        ]);
        if (dir == GW.utils.UP || dir == GW.utils.DOWN) {
            return verticalLength;
        }
        else {
            return horizontalLength;
        }
    }
    function pickHallDirection(grid, room, opts) {
        const doors = room.doors;
        // Pick a direction.
        let dir = opts.dir || GW.utils.NO_DIRECTION;
        if (dir == GW.utils.NO_DIRECTION) {
            const dirs = GW.random.sequence(4);
            for (let i = 0; i < 4; i++) {
                dir = dirs[i];
                const length = pickHallLength(dir, opts)[1]; // biggest measurement
                const door = doors[dir];
                if (door && door[0] != -1 && door[1] != -1) {
                    const dx = door[0] + Math.floor(DIRS[dir][0] * length);
                    const dy = door[1] + Math.floor(DIRS[dir][1] * length);
                    if (grid.hasXY(dx, dy)) {
                        break; // That's our direction!
                    }
                }
                dir = GW.utils.NO_DIRECTION;
            }
        }
        return dir;
    }
    function pickHallExits(grid, x, y, dir, opts) {
        let newX, newY;
        const obliqueChance = GW.utils.firstOpt('obliqueChance', opts, 15);
        const allowObliqueHallwayExit = GW.random.chance(obliqueChance);
        const hallDoors = [
        // [-1, -1],
        // [-1, -1],
        // [-1, -1],
        // [-1, -1],
        ];
        for (let dir2 = 0; dir2 < 4; dir2++) {
            newX = x + DIRS[dir2][0];
            newY = y + DIRS[dir2][1];
            if ((dir2 != dir && !allowObliqueHallwayExit) ||
                !grid.hasXY(newX, newY) ||
                grid[newX][newY]) ;
            else {
                hallDoors[dir2] = [newX, newY];
            }
        }
        return hallDoors;
    }
    function digHall(grid, dir, length, room, opts) {
        const door = room.doors[dir];
        const DIR = DIRS[dir];
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
    function digHallTwo(grid, dir, length, room, opts) {
        const door = room.doors[dir];
        const tile = opts.tile || FLOOR;
        const hallDoors = [];
        let x0, y0;
        let hall;
        if (dir === GW.utils.UP) {
            x0 = Math.max(door[0] - 1, room.x);
            y0 = door[1] - length + 1;
            for (let x = x0; x < x0 + 2; ++x) {
                for (let y = y0; y < y0 + length; ++y) {
                    grid[x][y] = tile;
                }
            }
            hallDoors[dir] = [x0, y0 - 1];
            hall = new Hall([x0, door[1]], dir, length, 2);
        }
        else if (dir === GW.utils.DOWN) {
            x0 = Math.max(door[0] - 1, room.x);
            y0 = door[1] + length - 1;
            for (let x = x0; x < x0 + 2; ++x) {
                for (let y = y0; y > y0 - length; --y) {
                    grid[x][y] = tile;
                }
            }
            hallDoors[dir] = [x0, y0 + 1];
            hall = new Hall([x0, door[1]], dir, length, 2);
        }
        else if (dir === GW.utils.LEFT) {
            x0 = door[0] - length + 1;
            y0 = Math.max(door[1] - 1, room.y);
            for (let x = x0; x < x0 + length; ++x) {
                for (let y = y0; y < y0 + 2; ++y) {
                    grid[x][y] = tile;
                }
            }
            hallDoors[dir] = [x0 - 1, y0];
            hall = new Hall([door[0], y0], dir, length, 2);
        }
        else {
            //if (dir === GW.utils.RIGHT) {
            x0 = door[0] + length - 1;
            y0 = Math.max(door[1] - 1, room.y);
            for (let x = x0; x > x0 - length; --x) {
                for (let y = y0; y < y0 + 2; ++y) {
                    grid[x][y] = tile;
                }
            }
            hallDoors[dir] = [x0 + 1, y0];
            hall = new Hall([door[0], y0], dir, length, 2);
        }
        hall.doors = hallDoors;
        hall.width = 2;
        return hall;
    }
    function attachHallway(grid, room, opts) {
        opts = opts || {};
        const dir = pickHallDirection(grid, room, opts);
        if (dir === GW.utils.NO_DIRECTION)
            return null;
        console.log('dir', dir);
        const length = GW.random.range(...pickHallLength(dir, opts));
        console.log('length', length);
        const width = opts.width || 1;
        console.log('width', width);
        if (width > 1) {
            return digHallTwo(grid, dir, length, room, opts);
        }
        return digHall(grid, dir, length, room, opts);
    }

    const DIRS$1 = GW.utils.DIRS;
    var SEQ;
    function start(map) {
        SEQ = GW.random.sequence(map.width * map.height);
        map.fill(0);
    }
    function finish(map) {
        removeDiagonalOpenings(map);
        finishWalls(map);
        finishDoors(map);
    }
    // Returns an array of door sites if successful
    function dig(map, opts = {}) {
        if (typeof opts === 'string') {
            opts = { digger: opts };
        }
        const diggerId = opts.digger || opts.id || 'SMALL'; // TODO - get random id
        const digger = rooms[diggerId];
        if (!digger) {
            GW.utils.ERROR('Failed to find digger: ' + diggerId);
        }
        let locs = opts.locs || opts.loc || null;
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
            locs = [locs];
        }
        else if (locs.length == 0) {
            locs = null;
        }
        const config = Object.assign({}, digger, opts);
        const roomGrid = GW.grid.alloc(map.width, map.height);
        const hallChance = config.hallChance || config.hallway || 0;
        const attachHall = GW.random.chance(hallChance);
        // const force = config.force || false;
        let result = false;
        let room;
        let tries = config.tries || 10;
        while (--tries >= 0 && !result) {
            roomGrid.fill(NOTHING);
            // dig the room in the center
            room = digger.fn(config, roomGrid);
            room.doors = chooseRandomDoorSites(roomGrid);
            if (attachHall) {
                room.hall = attachHallway(roomGrid, room, config);
            }
            if (locs) {
                // try the doors first
                result = attachRoomAtMapDoor(map, locs, roomGrid, room, config);
            }
            else {
                result = attachRoom(map, roomGrid, room, config);
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
        GW.grid.free(roomGrid);
        return room && result ? room : null;
    }
    function attachRoom(map, roomGrid, room, opts = {}) {
        // console.log('attachRoom');
        const doorSites = room.hall ? room.hall.doors : room.doors;
        // Slide hyperspace across real space, in a random but predetermined order, until the room matches up with a wall.
        for (let i = 0; i < SEQ.length; i++) {
            const x = Math.floor(SEQ[i] / map.height);
            const y = SEQ[i] % map.height;
            if (!(map.get(x, y) == NOTHING))
                continue;
            const dir = GW.grid.directionOfDoorSite(map, x, y, FLOOR);
            if (dir != GW.utils.NO_DIRECTION) {
                const oppDir = (dir + 2) % 4;
                const offsetX = x - doorSites[oppDir][0];
                const offsetY = y - doorSites[oppDir][1];
                if (doorSites[oppDir][0] != -1 &&
                    roomFitsAt(map, roomGrid, offsetX, offsetY)) {
                    // Room fits here.
                    GW.grid.offsetZip(map, roomGrid, offsetX, offsetY, (_d, _s, i, j) => {
                        map[i][j] = opts.tile || FLOOR;
                    });
                    if (opts.door || opts.placeDoor !== false) {
                        map[x][y] = opts.door || DOOR; // Door site.
                    }
                    // doorSites[oppDir][0] = -1;
                    // doorSites[oppDir][1] = -1;
                    room.translate(offsetX, offsetY);
                    return true;
                }
            }
        }
        return false;
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
    function forceRoomAtMapLoc(map, xy, roomGrid, room, opts = {}) {
        // console.log('forceRoomAtMapLoc', xy);
        // Slide room across map, in a random but predetermined order, until the room matches up with a wall.
        for (let i = 0; i < SEQ.length; i++) {
            const x = Math.floor(SEQ[i] / map.height);
            const y = SEQ[i] % map.height;
            if (roomGrid[x][y])
                continue;
            const dir = GW.grid.directionOfDoorSite(roomGrid, x, y, FLOOR);
            if (dir != GW.utils.NO_DIRECTION) {
                const dx = xy[0] - x;
                const dy = xy[1] - y;
                if (roomFitsAt(map, roomGrid, dx, dy)) {
                    GW.grid.offsetZip(map, roomGrid, dx, dy, (_d, _s, i, j) => {
                        map[i][j] = opts.tile || FLOOR;
                    });
                    if (opts.door || opts.placeDoor !== false) {
                        map[xy[0]][xy[1]] = opts.door || DOOR; // Door site.
                    }
                    // TODO - Update doors - we may have to erase one...
                    room.translate(dx, dy);
                    return true;
                }
            }
        }
        return false;
    }
    function attachRoomAtMapDoor(map, mapDoors, roomGrid, room, opts = {}) {
        const doorIndexes = GW.random.sequence(mapDoors.length);
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
    function attachRoomAtXY(map, x, y, roomGrid, room, opts = {}) {
        const doorSites = room.hall ? room.hall.doors : room.doors;
        const dirs = GW.random.sequence(4);
        // console.log('attachRoomAtXY', x, y, doorSites.join(', '));
        for (let dir of dirs) {
            const oppDir = (dir + 2) % 4;
            const door = doorSites[oppDir];
            if (!door)
                continue;
            if (door[0] != -1 &&
                roomFitsAt(map, roomGrid, x - door[0], y - door[1])) {
                // dungeon.debug("attachRoom: ", x, y, oppDir);
                // Room fits here.
                const offX = x - door[0];
                const offY = y - door[1];
                GW.grid.offsetZip(map, roomGrid, offX, offY, (_d, _s, i, j) => {
                    map[i][j] = opts.tile || FLOOR;
                });
                if (opts.door || opts.placeDoor !== false) {
                    map[x][y] = opts.door || DOOR; // Door site.
                }
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
    function chooseRandomDoorSites(sourceGrid) {
        let i, j, k, newX, newY;
        let dir;
        let doorSiteFailed;
        const grid = GW.grid.alloc(sourceGrid.width, sourceGrid.height);
        grid.copy(sourceGrid);
        for (i = 0; i < grid.width; i++) {
            for (j = 0; j < grid.height; j++) {
                if (!grid[i][j]) {
                    dir = GW.grid.directionOfDoorSite(grid, i, j, 1);
                    if (dir != GW.utils.NO_DIRECTION) {
                        // Trace a ray 10 spaces outward from the door site to make sure it doesn't intersect the room.
                        // If it does, it's not a valid door site.
                        newX = i + DIRS$1[dir][0];
                        newY = j + DIRS$1[dir][1];
                        doorSiteFailed = false;
                        for (k = 0; k < 10 && grid.hasXY(newX, newY) && !doorSiteFailed; k++) {
                            if (grid[newX][newY]) {
                                doorSiteFailed = true;
                            }
                            newX += DIRS$1[dir][0];
                            newY += DIRS$1[dir][1];
                        }
                        if (!doorSiteFailed) {
                            grid[i][j] = dir + 200; // So as not to conflict with other tiles.
                        }
                    }
                }
            }
        }
        let doorSites = [];
        // Pick four doors, one in each direction, and store them in doorSites[dir].
        for (dir = 0; dir < 4; dir++) {
            const loc = grid.randomMatchingLoc(dir + 200) || [-1, -1];
            doorSites[dir] = [loc[0], loc[1]];
        }
        GW.grid.free(grid);
        return doorSites;
    }
    function isPassable(grid, x, y) {
        const v = grid.get(x, y);
        return v === FLOOR || v === DOOR || v === BRIDGE;
    }
    function isObstruction(grid, x, y) {
        const v = grid.get(x, y);
        return v === NOTHING || v === WALL;
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
                            if (GW.random.chance(50)) {
                                x1 = i + (1 - k);
                                y1 = j;
                            }
                            else {
                                x1 = i + k;
                                y1 = j + 1;
                            }
                            diagonalCornerRemoved = true;
                            grid[x1][y1] = FLOOR;
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
            if (cell == DOOR) {
                if ((grid.get(x + 1, y) == FLOOR ||
                    grid.get(x - 1, y) == FLOOR) &&
                    (grid.get(x, y + 1) == FLOOR ||
                        grid.get(x, y - 1) == FLOOR)) {
                    // If there's passable terrain to the left or right, and there's passable terrain
                    // above or below, then the door is orphaned and must be removed.
                    grid[x][y] = FLOOR;
                }
                else if ((grid.get(x + 1, y) !== FLOOR ? 1 : 0) +
                    (grid.get(x - 1, y) !== FLOOR ? 1 : 0) +
                    (grid.get(x, y + 1) !== FLOOR ? 1 : 0) +
                    (grid.get(x, y - 1) !== FLOOR ? 1 : 0) >=
                    3) {
                    // If the door has three or more pathing blocker neighbors in the four cardinal directions,
                    // then the door is orphaned and must be removed.
                    grid[x][y] = FLOOR;
                }
            }
        });
    }
    function finishWalls(grid) {
        grid.forEach((cell, i, j) => {
            if (cell == NOTHING) {
                grid[i][j] = WALL;
            }
        });
    }

    var dig$1 = {
        __proto__: null,
        room: room,
        Room: Room,
        Hall: Hall,
        start: start,
        finish: finish,
        dig: dig,
        attachRoom: attachRoom,
        roomFitsAt: roomFitsAt,
        forceRoomAtMapLoc: forceRoomAtMapLoc,
        chooseRandomDoorSites: chooseRandomDoorSites,
        isPassable: isPassable,
        isObstruction: isObstruction,
        removeDiagonalOpenings: removeDiagonalOpenings,
        finishDoors: finishDoors,
        finishWalls: finishWalls,
        NOTHING: NOTHING,
        FLOOR: FLOOR,
        DOOR: DOOR,
        WALL: WALL,
        LAKE: LAKE,
        BRIDGE: BRIDGE
    };

    exports.dig = dig$1;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=gw-dig.js.map
