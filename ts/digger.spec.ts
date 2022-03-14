import * as GWU from 'gw-utils';
// import * as GWM from 'gw-map';
import * as Dig from './index';
import { Digger } from './digger';
import * as SITE from './site';

describe('Level', () => {
    test('basic', () => {
        const grid = new GWU.grid.NumGrid(40, 40);

        Dig.room.install('ENTRANCE', new Dig.room.BrogueEntrance());
        Dig.room.install('ROOM', new Dig.room.Rectangular());

        const digger = new Dig.Digger({
            seed: 12345,
            rooms: { count: 20, first: 'ENTRANCE', digger: 'ROOM' },
            doors: { chance: 50 },
            halls: { chance: 50 },
            loops: { minDistance: 20, maxLength: 5 },
            lakes: {
                count: 5,
                wreathSize: 1,
                wreathChance: 100,
                width: 10,
                height: 10,
            },
            bridges: {
                minDistance: 10,
                maxLength: 10,
            },
            stairs: { up: [20, 38], down: true },
        });
        digger.create(40, 40, (x, y, v) => {
            grid[x][y] = v;
        });

        // grid.dump((v) => {
        //     if (v == Dig.site.FLOOR) return '.';
        //     if (v == Dig.site.WALL) return '#';
        //     return '' + v;
        // });

        expect(grid.count(SITE.tileId('NOTHING'))).toEqual(0);
        expect(grid.count(SITE.tileId('FLOOR'))).toBeGreaterThan(0);
        expect(grid.count(SITE.tileId('WALL'))).toBeGreaterThan(0);
        expect(grid.count(SITE.tileId('DOOR'))).toBeGreaterThan(0);
        expect(grid.count(SITE.tileId('DEEP'))).toBeGreaterThan(0);
        expect(grid.count(SITE.tileId('SHALLOW'))).toBeGreaterThan(0);
        expect(grid.count(SITE.tileId('BRIDGE'))).toBeGreaterThan(0);
        expect(grid.count(SITE.tileId('DOWN_STAIRS'))).toEqual(1);
        expect(grid.count(SITE.tileId('IMPREGNABLE'))).toBeGreaterThan(0);
        expect(grid.count(SITE.tileId('UP_STAIRS'))).toEqual(1);
    });

    describe('roomFitsAt', () => {
        test('roomFitsAt - just room', () => {
            const site = new SITE.Site(100, 100);
            const roomSite = new SITE.Site(100, 100);
            const digger = new Digger();

            // Top left of site
            GWU.xy.forRect(1, 1, 9, 9, (x, y) => site.setTile(x, y, 'FLOOR'));

            GWU.xy.forRect(45, 45, 9, 9, (x, y) =>
                roomSite.setTile(x, y, 'FLOOR')
            );
            const room = new Dig.Room(45, 45, 10, 10);
            // room.doors[GWU.xy.UP] = [-1,-1];
            // room.doors[GWU.xy.RIGHT] = [-1,-1];
            // room.doors[GWU.xy.DOWN] = [-1,-1];
            // room.doors[GWU.xy.LEFT] = [44,50];

            expect(
                digger._roomFitsAt(site, roomSite, room, -34, -44)
            ).toBeTruthy();
            expect(
                digger._roomFitsAt(site, roomSite, room, -44, -34)
            ).toBeTruthy();
            expect(
                digger._roomFitsAt(site, roomSite, room, -44, -44)
            ).toBeFalsy();

            // Middle of nowhere
            expect(
                digger._roomFitsAt(site, roomSite, room, -20, -20)
            ).toBeTruthy();
            expect(
                digger._roomFitsAt(site, roomSite, room, 20, 20)
            ).toBeTruthy();
        });

        test('roomFitsAt - up hall', () => {
            const site = new SITE.Site(100, 100);
            const roomSite = new SITE.Site(100, 100);
            const digger = new Digger();

            // Top left of site
            GWU.xy.forRect(1, 1, 9, 9, (x, y) => site.setTile(x, y, 'FLOOR'));

            GWU.xy.forRect(45, 45, 9, 9, (x, y) =>
                roomSite.setTile(x, y, 'FLOOR')
            );
            const room = new Dig.Room(45, 45, 10, 10);

            GWU.xy.forLine(50, 44, [0, -1], 5, (x, y) =>
                roomSite.setTile(x, y, 'FLOOR')
            );
            const hall = Dig.makeHall([50, 44], 0, 5);
            expect(hall.x).toEqual(50);
            expect(hall.width).toEqual(1);
            expect(hall.y).toEqual(40);
            expect(hall.height).toEqual(5);

            room.hall = hall;

            // roomSite.tiles.dump();

            // Hall off top
            expect(
                digger._roomFitsAt(site, roomSite, room, -34, -44)
            ).toBeFalsy();

            // Hall into other room
            expect(
                digger._roomFitsAt(site, roomSite, room, -44, -34)
            ).toBeFalsy();

            // Room overlap
            expect(
                digger._roomFitsAt(site, roomSite, room, -44, -44)
            ).toBeFalsy();

            // OK
            expect(
                digger._roomFitsAt(site, roomSite, room, -44, -29)
            ).toBeTruthy();
        });
    });

    test('multiple calls with map', () => {
        Dig.room.install('ENTRANCE', new Dig.room.BrogueEntrance());
        Dig.room.install(
            'ROOM',
            new Dig.room.Rectangular({ width: '4-10', height: '4-10' })
        );

        const grid = GWU.grid.make(40, 40);

        const digger = new Dig.Digger({
            seed: 12345,
            rooms: { count: 20, first: 'ENTRANCE', digger: 'ROOM' },
            doors: { chance: 0 },
            loops: false,
            lakes: false,
        });
        digger.create(40, 40, (x, y, v) => {
            grid[x][y] = v;
        });

        let lines: string[] = [];
        grid.dump(undefined, (line: string) => {
            lines.push(line);
        });
        grid.fill(0);

        digger.create(40, 40, (x, y, v) => {
            grid[x][y] = v;
        });
        let lines2: string[] = [];
        grid.dump(undefined, (line: string) => {
            lines2.push(line);
        });

        expect(lines).toEqual(lines2);
    });

    describe('seeds', () => {
        test('682067209748479 - shallows over lakes', () => {
            const seed = 682067209748479;

            const grid = GWU.grid.make(80, 40);
            const digger = new Dig.Digger({
                seed,
                stairs: false,
            });
            digger.create(80, 40, (x, y, v) => {
                grid[x][y] = v;
            });

            // map.dump();
            expect(grid.get(42, 17)).toEqual(SITE.tileId('LAKE'));
        });

        test.todo('171105058815999 - bridge too short @ 49,12');
        test.todo('2645057213562879 - bridge too short');

        test.skip('3636220756230143 - bridge too short : h & v', () => {
            const seed = 3636220756230143;
            const grid = GWU.grid.make(80, 40);
            const digger = new Dig.Digger({
                seed,
                stairs: false,
                bridges: 10,
            });
            digger.create(80, 40, (x, y, v) => {
                grid[x][y] = v;
            });

            grid.dump();
            expect(grid.get(39, 15)).toEqual(SITE.tileId('BRIDGE'));
        });

        test('2385039633416191 - door orphaned @ 48,27', () => {
            const seed = 2385039633416191;

            const grid = GWU.grid.make(80, 40);
            const digger = new Dig.Digger({
                seed,
                stairs: false,
            });
            digger.create(80, 40, (x, y, v) => {
                grid[x][y] = v;
            });

            // grid.dump();
            expect(grid.get(48, 27)).not.toEqual(SITE.tileId('DOOR'));
        });

        test('1200255339069439 - 2 doors @ 61,21', () => {
            const seed = 1200255339069439;

            const grid = GWU.grid.make(80, 40);
            const digger = new Dig.Digger({
                seed,
                stairs: false,
            });
            digger.create(grid);

            // grid.dump();

            expect(grid.get(61, 21)).toEqual(SITE.tileId('DOOR'));
            expect(grid.get(62, 21)).not.toEqual(SITE.tileId('DOOR'));
        });
    });
});
