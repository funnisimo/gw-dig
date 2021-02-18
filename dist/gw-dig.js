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
        constructor(loc, dir, length, doors) {
            this.width = 1;
            this.x = loc[0];
            this.y = loc[1];
            const d = GW.utils.DIRS[dir];
            this.x2 = this.x + length * d[0];
            this.y2 = this.y + length * d[1];
            this.dir = dir;
            this.length = length;
            this.doors = doors;
        }
        translate(dx, dy) {
            this.x += dx;
            this.y += dy;
            this.x2 += dx;
            this.y2 += dy;
            if (this.doors) {
                this.doors.forEach((d) => {
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
    var diggers = {};
    function install(id, fn, config) {
        // @ts-ignore
        config = fn(config || {}); // call to have function setup the config
        config.fn = fn;
        config.id = id;
        diggers[id] = config;
        return config;
    }
    function checkConfig(config, opts) {
        config = config || {};
        opts = opts || {};
        if (!config.width || !config.height)
            GW.utils.ERROR('All diggers require config to include width and height.');
        Object.entries(opts).forEach(([key, expect]) => {
            const have = config[key];
            if (expect === true) {
                // needs to be a number > 0
                if (typeof have !== 'number') {
                    GW.utils.ERROR('Invalid configuration for digger: ' +
                        key +
                        ' expected number received ' +
                        typeof have);
                }
            }
            else if (typeof expect === 'number') {
                // needs to be a number, this is the default
                const have = config[key];
                if (typeof have !== 'number') {
                    config[key] = expect; // provide default
                }
            }
            else if (Array.isArray(expect)) {
                // needs to be an array with this size, these are the defaults
                if (typeof have === 'number') {
                    config[key] = new Array(expect.length).fill(have);
                }
                else if (!Array.isArray(have)) {
                    GW.utils.WARN('Received unexpected config for digger : ' +
                        key +
                        ' expected array, received ' +
                        typeof have +
                        ', using defaults.');
                    config[key] = expect.slice();
                }
                else if (expect.length > have.length) {
                    for (let i = have.length; i < expect.length; ++i) {
                        have[i] = expect[i];
                    }
                }
            }
            else {
                GW.utils.WARN('Unexpected digger configuration parameter: ', key, '' + expect);
            }
        });
        return config;
    }
    function cavern(config, grid) {
        config = checkConfig(config, { width: 12, height: 8 });
        if (!grid)
            return config;
        let destX, destY;
        let blobGrid;
        blobGrid = GW.grid.alloc(grid.width, grid.height, 0);
        const minWidth = Math.floor(0.5 * config.width); // 6
        const maxWidth = config.width;
        const minHeight = Math.floor(0.5 * config.height); // 4
        const maxHeight = config.height;
        grid.fill(0);
        const bounds = blobGrid.fillBlob(5, minWidth, minHeight, maxWidth, maxHeight, 55, 'ffffffttt', 'ffffttttt');
        // Position the new cave in the middle of the grid...
        destX = Math.floor((grid.width - bounds.width) / 2);
        destY = Math.floor((grid.height - bounds.height) / 2);
        // ...and copy it to the master grid.
        GW.grid.offsetZip(grid, blobGrid, destX - bounds.x, destY - bounds.y, FLOOR);
        GW.grid.free(blobGrid);
        return new Room(config.id, destX, destY, bounds.width, bounds.height);
    }
    function choiceRoom(config, grid) {
        config = config || {};
        let choices;
        if (Array.isArray(config.choices)) {
            choices = config.choices;
        }
        else if (typeof config.choices == 'object') {
            choices = Object.keys(config.choices);
        }
        else {
            GW.utils.ERROR('Expected choices to be either array of choices or map { digger: weight }');
        }
        for (let choice of choices) {
            if (!diggers[choice]) {
                GW.utils.ERROR('Missing digger choice: ' + choice);
            }
        }
        if (!grid)
            return config;
        let id;
        if (Array.isArray(config.choices)) {
            id = GW.random.item(config.choices);
        }
        else {
            id = GW.random.weighted(config.choices);
        }
        const digger = diggers[id];
        let digConfig = digger;
        if (config.opts) {
            digConfig = Object.assign({}, digger, config.opts);
        }
        // debug('Chose room: ', id);
        return digger.fn(digConfig, grid);
    }
    // From BROGUE => This is a special room that appears at the entrance to the dungeon on depth 1.
    function entranceRoom(config, grid) {
        config = checkConfig(config, { width: 20, height: 10 });
        if (!grid)
            return config;
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
        grid.fillRect(roomX, roomY, roomWidth, roomHeight, FLOOR);
        grid.fillRect(roomX2, roomY2, roomWidth2, roomHeight2, FLOOR);
        return new Room(config.id, Math.min(roomX, roomX2), Math.min(roomY, roomY2), Math.max(roomWidth, roomWidth2), Math.max(roomHeight, roomHeight2));
    }
    function crossRoom(config, grid) {
        config = checkConfig(config, { width: 12, height: 20 });
        if (!grid)
            return config;
        const roomWidth = Math.max(2, Math.floor((config.width * GW.random.range(15, 60)) / 100)); // [3,12]
        const roomWidth2 = Math.max(2, Math.floor((config.width * GW.random.range(20, 100)) / 100)); // [4,20]
        const roomHeight = Math.max(2, Math.floor((config.height * GW.random.range(50, 100)) / 100)); // [3,7]
        const roomHeight2 = Math.max(2, Math.floor((config.height * GW.random.range(25, 75)) / 100)); // [2,5]
        const roomX = GW.random.range(Math.max(0, Math.floor(grid.width / 2) - (roomWidth - 1)), Math.min(grid.width, Math.floor(grid.width / 2)));
        const roomX2 = roomX +
            Math.floor(roomWidth / 2) +
            GW.random.range(0, 2) +
            GW.random.range(0, 2) -
            3 -
            Math.floor(roomWidth2 / 2);
        const roomY = Math.floor(grid.height / 2 - roomHeight);
        const roomY2 = Math.floor(grid.height / 2 -
            roomHeight2 -
            (GW.random.range(0, 2) + GW.random.range(0, 1)));
        grid.fill(0);
        grid.fillRect(roomX - 5, roomY + 5, roomWidth, roomHeight, FLOOR);
        grid.fillRect(roomX2 - 5, roomY2 + 5, roomWidth2, roomHeight2, FLOOR);
        return new Room(config.id, Math.min(roomX, roomX2) - 5, Math.min(roomY, roomY2) - 5, Math.max(roomWidth, roomWidth2), Math.max(roomHeight, roomHeight2));
    }
    function symmetricalCrossRoom(config, grid) {
        config = checkConfig(config, { width: 8, height: 5 });
        if (!grid)
            return config;
        let majorWidth = Math.floor((config.width * GW.random.range(50, 100)) / 100); // [4,8]
        let majorHeight = Math.floor((config.height * GW.random.range(75, 100)) / 100); // [4,5]
        let minorWidth = Math.max(2, Math.floor((config.width * GW.random.range(25, 50)) / 100)); // [2,4]
        if (majorHeight % 2 == 0 && minorWidth > 2) {
            minorWidth -= 1;
        }
        let minorHeight = Math.max(2, Math.floor((config.height * GW.random.range(25, 50)) / 100)); // [2,3]?
        if (majorWidth % 2 == 0 && minorHeight > 2) {
            minorHeight -= 1;
        }
        grid.fill(0);
        const x = Math.floor((grid.width - majorWidth) / 2);
        const y = Math.floor((grid.height - minorHeight) / 2);
        grid.fillRect(x, y, majorWidth, minorHeight, FLOOR);
        const x2 = Math.floor((grid.width - minorWidth) / 2);
        const y2 = Math.floor((grid.height - majorHeight) / 2);
        grid.fillRect(x2, y2, minorWidth, majorHeight, FLOOR);
        return new Room(config.id, Math.min(x, x2), Math.min(y, y2), Math.max(majorWidth, minorWidth), Math.max(majorHeight, minorHeight));
    }
    function rectangularRoom(config, grid) {
        config = checkConfig(config, { width: 6, height: 4, minPct: 50 });
        if (!grid)
            return config;
        const width = Math.floor((config.width * GW.random.range(config.minPct, 100)) / 100); // [3,6]
        const height = Math.floor((config.height * GW.random.range(config.minPct, 100)) / 100); // [2,4]
        grid.fill(0);
        const x = Math.floor((grid.width - width) / 2);
        const y = Math.floor((grid.height - height) / 2);
        grid.fillRect(x, y, width, height, FLOOR);
        return new Room(config.id, x, y, width, height);
    }
    function circularRoom(config, grid) {
        config = checkConfig(config, { width: 6, height: 6 });
        if (!grid)
            return config;
        const radius = Math.floor(((Math.min(config.width, config.height) - 1) *
            GW.random.range(75, 100)) /
            200); // [3,4]
        grid.fill(0);
        const x = Math.floor(grid.width / 2);
        const y = Math.floor(grid.height / 2);
        if (radius > 1) {
            grid.fillCircle(x, y, radius, FLOOR);
        }
        return new Room(config.id, x, y, radius * 2, radius * 2);
    }
    function brogueDonut(config, grid) {
        config = checkConfig(config, {
            width: 10,
            height: 10,
            altChance: 5,
            ringMinWidth: 3,
            holeMinSize: 3,
            holeChance: 50,
        });
        if (!grid)
            return config;
        const radius = Math.floor((Math.min(config.width, config.height) * GW.random.range(75, 100)) / 100); // [5,10]
        grid.fill(0);
        const x = Math.floor(grid.width / 2);
        const y = Math.floor(grid.height / 2);
        grid.fillCircle(x, y, radius, FLOOR);
        if (radius > config.ringMinWidth + config.holeMinSize &&
            GW.random.chance(config.holeChance)) {
            grid.fillCircle(x, y, GW.random.range(config.holeMinSize, radius - config.holeMinSize), 0);
        }
        return new Room(config.id, x, y, radius * 2, radius * 2);
    }
    function chunkyRoom(config, grid) {
        config = checkConfig(config, { count: 8 });
        if (!grid)
            return config;
        let i, x, y;
        let minX, maxX, minY, maxY;
        let chunkCount = Math.floor((config.count * GW.random.range(25, 100)) / 100); // [2,8]
        minX = Math.floor(grid.width / 2) - Math.floor(config.width / 2);
        maxX = Math.floor(grid.width / 2) + Math.floor(config.width / 2);
        minY = Math.floor(grid.height / 2) - Math.floor(config.height / 2);
        maxY = Math.floor(grid.height / 2) + Math.floor(config.height / 2);
        grid.fill(0);
        grid.fillCircle(Math.floor(grid.width / 2), Math.floor(grid.height / 2), 2, FLOOR);
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
                grid.fillCircle(x, y, 2, FLOOR);
                i++;
                //            hiliteGrid(grid, /* Color. */green, 50);
                //            temporaryMessage("Added a chunk:", true);
            }
        }
        return new Room(config.id, minX, minY, maxX - minX + 1, maxY - minY + 1);
    }

    const DIRS = GW.utils.DIRS;
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
        const digger = diggers[diggerId];
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
        // const force = config.force || false;
        let result = false;
        let room;
        let tries = config.tries || 10;
        while (--tries >= 0 && !result) {
            roomGrid.fill(NOTHING);
            // dig the room in the center
            room = digger.fn(config, roomGrid);
            const attachHall = GW.random.chance(hallChance);
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
            const x = mapDoors[index][0];
            const y = mapDoors[index][1];
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
            if (doorSites[oppDir][0] != -1 &&
                roomFitsAt(map, roomGrid, x - doorSites[oppDir][0], y - doorSites[oppDir][1])) {
                // dungeon.debug("attachRoom: ", x, y, oppDir);
                // Room fits here.
                const offX = x - doorSites[oppDir][0];
                const offY = y - doorSites[oppDir][1];
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
                        newX = i + DIRS[dir][0];
                        newY = j + DIRS[dir][1];
                        doorSiteFailed = false;
                        for (k = 0; k < 10 && grid.hasXY(newX, newY) && !doorSiteFailed; k++) {
                            if (grid[newX][newY]) {
                                doorSiteFailed = true;
                            }
                            newX += DIRS[dir][0];
                            newY += DIRS[dir][1];
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
    function attachHallway(grid, room, opts) {
        let i, x, y, newX, newY;
        let dir, dir2;
        opts = opts || {};
        const tile = opts.tile || FLOOR;
        const horizontalLength = GW.utils.firstOpt('horizontalHallLength', opts, [
            9,
            15,
        ]);
        const verticalLength = GW.utils.firstOpt('verticalHallLength', opts, [
            2,
            9,
        ]);
        const obliqueChance = GW.utils.firstOpt('obliqueChance', opts, 15);
        const doors = room.doors;
        // Pick a direction.
        dir = opts.dir || GW.utils.NO_DIRECTION;
        if (dir == GW.utils.NO_DIRECTION) {
            const dirs = GW.random.sequence(4);
            for (i = 0; i < 4; i++) {
                dir = dirs[i];
                const dx = doors[dir][0] + Math.floor(DIRS[dir][0] * horizontalLength[1]);
                const dy = doors[dir][1] + Math.floor(DIRS[dir][1] * verticalLength[1]);
                if (doors[dir][0] != -1 &&
                    doors[dir][1] != -1 &&
                    grid.hasXY(dx, dy)) {
                    break; // That's our direction!
                }
            }
            if (i == 4) {
                return null; // No valid direction for hallways.
            }
        }
        let maxLength = 0;
        if (dir == GW.utils.UP || dir == GW.utils.DOWN) {
            maxLength = GW.random.range(verticalLength[0], verticalLength[1]);
        }
        else {
            maxLength = GW.random.range(horizontalLength[0], horizontalLength[1]);
        }
        x = doors[dir][0];
        y = doors[dir][1];
        const attachLoc = [x - DIRS[dir][0], y - DIRS[dir][1]];
        let length = 0;
        for (length = 0; length < maxLength; length++) {
            if (grid.hasXY(x, y)) {
                grid[x][y] = tile;
            }
            else {
                break;
            }
            x += DIRS[dir][0];
            y += DIRS[dir][1];
        }
        if (length < 2) {
            return null;
        }
        x = GW.utils.clamp(x - DIRS[dir][0], 0, grid.width - 1);
        y = GW.utils.clamp(y - DIRS[dir][1], 0, grid.height - 1); // Now (x, y) points at the last interior cell of the hallway.
        const allowObliqueHallwayExit = GW.random.chance(obliqueChance);
        const hallDoors = [
            [-1, -1],
            [-1, -1],
            [-1, -1],
            [-1, -1],
        ];
        for (dir2 = 0; dir2 < 4; dir2++) {
            newX = x + DIRS[dir2][0];
            newY = y + DIRS[dir2][1];
            if ((dir2 != dir && !allowObliqueHallwayExit) ||
                !grid.hasXY(newX, newY) ||
                grid[newX][newY]) {
                hallDoors[dir2][0] = -1;
                hallDoors[dir2][1] = -1;
            }
            else {
                hallDoors[dir2][0] = newX;
                hallDoors[dir2][1] = newY;
            }
        }
        return new Hall(attachLoc, dir, length, hallDoors);
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
        start: start,
        finish: finish,
        dig: dig,
        attachRoom: attachRoom,
        roomFitsAt: roomFitsAt,
        forceRoomAtMapLoc: forceRoomAtMapLoc,
        chooseRandomDoorSites: chooseRandomDoorSites,
        attachHallway: attachHallway,
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
        BRIDGE: BRIDGE,
        Hall: Hall,
        Room: Room,
        diggers: diggers,
        install: install,
        checkConfig: checkConfig,
        cavern: cavern,
        choiceRoom: choiceRoom,
        entranceRoom: entranceRoom,
        crossRoom: crossRoom,
        symmetricalCrossRoom: symmetricalCrossRoom,
        rectangularRoom: rectangularRoom,
        circularRoom: circularRoom,
        brogueDonut: brogueDonut,
        chunkyRoom: chunkyRoom
    };

    exports.dig = dig$1;
    exports.diggers = diggers;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=gw-dig.js.map
