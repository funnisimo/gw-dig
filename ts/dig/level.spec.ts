import * as GW from 'gw-utils';
import * as Dig from './index';

describe('Level', () => {
    test('basic', () => {
        const grid = new GW.grid.NumGrid(40, 40);

        Dig.room.install('ENTRANCE', new Dig.room.BrogueEntrance());
        Dig.room.install('ROOM', new Dig.room.Rectangular());

        const level = new Dig.Level(40, 40, {
            seed: 12345,
            rooms: { count: 20, first: 'ENTRANCE', digger: 'ROOM' },
            doors: { chance: 50 },
            halls: { chance: 50 },
            loops: { minDistance: 20, maxLength: 5 },
            lakes: {
                count: 1,
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
        level.create((x, y, v) => {
            grid[x][y] = v;
        });

        // grid.dump((v) => {
        //     if (v == 1) return '.';
        //     if (v == 3) return '#';
        //     return '' + v;
        // });

        expect(grid.count(0)).toEqual(0);
        expect(grid.count(1)).toBeGreaterThan(0);
        expect(grid.count(2)).toBeGreaterThan(0);
        expect(grid.count(3)).toBeGreaterThan(0);
        expect(grid.count(4)).toBeGreaterThan(0);
        expect(grid.count(5)).toBeGreaterThan(0);
        expect(grid.count(6)).toBeGreaterThan(0);
        expect(grid.count(7)).toEqual(1);
        expect(grid.count(8)).toBeGreaterThan(0);
        expect(grid.count(17)).toEqual(1);
    });
});
