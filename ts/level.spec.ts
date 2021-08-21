import * as GW from 'gw-utils';
import * as Dig from './index';

describe('Level', () => {
    test('basic', () => {
        const grid = new GW.grid.NumGrid(40, 40);

        Dig.room.install('ENTRANCE', new Dig.room.BrogueEntrance());
        Dig.room.install('ROOM', new Dig.room.Rectangular());

        const level = new Dig.Level({
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
        level.create(40, 40, (x, y, v) => {
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
});
