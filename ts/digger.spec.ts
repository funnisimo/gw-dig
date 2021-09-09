import * as GWU from 'gw-utils';
import * as GWM from 'gw-map';
import * as Dig from './index';
import { Digger } from './digger';

describe('Level', () => {
    test('basic', async () => {
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
        await digger.create(40, 40, (x, y, v) => {
            grid[x][y] = v;
        });

        // grid.dump((v) => {
        //     if (v == Dig.site.FLOOR) return '.';
        //     if (v == Dig.site.WALL) return '#';
        //     return '' + v;
        // });

        expect(grid.count(Dig.site.NOTHING)).toEqual(0);
        expect(grid.count(Dig.site.FLOOR)).toBeGreaterThan(0);
        expect(grid.count(Dig.site.WALL)).toBeGreaterThan(0);
        expect(grid.count(Dig.site.DOOR)).toBeGreaterThan(0);
        expect(grid.count(Dig.site.DEEP)).toBeGreaterThan(0);
        expect(grid.count(Dig.site.SHALLOW)).toBeGreaterThan(0);
        expect(grid.count(Dig.site.BRIDGE)).toBeGreaterThan(0);
        expect(grid.count(Dig.site.DOWN_STAIRS)).toEqual(1);
        expect(grid.count(Dig.site.IMPREGNABLE)).toBeGreaterThan(0);
        expect(grid.count(Dig.site.UP_STAIRS)).toEqual(1);
    });

    describe('roomFitsAt', () => {
        test('roomFitsAt - just room', () => {
            const site = new Dig.site.GridSite(100, 100);
            const roomSite = new Dig.site.GridSite(100, 100);
            const digger = new Digger();

            // Top left of site
            GWU.xy.forRect(1, 1, 9, 9, (x, y) =>
                site.setTile(x, y, Dig.site.FLOOR)
            );

            GWU.xy.forRect(45, 45, 9, 9, (x, y) =>
                roomSite.setTile(x, y, Dig.site.FLOOR)
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
            const site = new Dig.site.GridSite(100, 100);
            const roomSite = new Dig.site.GridSite(100, 100);
            const digger = new Digger();

            // Top left of site
            GWU.xy.forRect(1, 1, 9, 9, (x, y) =>
                site.setTile(x, y, Dig.site.FLOOR)
            );

            GWU.xy.forRect(45, 45, 9, 9, (x, y) =>
                roomSite.setTile(x, y, Dig.site.FLOOR)
            );
            const room = new Dig.Room(45, 45, 10, 10);

            GWU.xy.forLine(50, 44, [0, -1], 5, (x, y) =>
                roomSite.setTile(x, y, Dig.site.FLOOR)
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

    test('multiple calls with map', async () => {
        Dig.room.install('ENTRANCE', new Dig.room.BrogueEntrance());
        Dig.room.install(
            'ROOM',
            new Dig.room.Rectangular({ width: '4-10', height: '4-10' })
        );

        const map = GWM.map.make(80, 34, { visible: true });

        const digger = new Dig.Digger({
            seed: 12345,
            rooms: { count: 20, first: 'ENTRANCE', digger: 'ROOM' },
            doors: { chance: 0 },
            loops: false,
            lakes: false,
        });
        await digger.create(map);

        let lines: string[] = [];
        map.dump(undefined, (line: string) => {
            lines.push(line);
        });
        map.clear();

        await digger.create(map);
        let lines2: string[] = [];
        map.dump(undefined, (line: string) => {
            lines2.push(line);
        });

        expect(lines).toEqual(lines2);
    });
});
