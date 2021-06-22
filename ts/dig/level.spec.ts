
import * as GW from 'gw-utils';
import * as Dig from './index';


describe('Level', () => {
    test('basic', () => {
        const grid = new GW.grid.NumGrid(40, 40);

        const level = new Dig.Level(40, 40, {
            seed: 23456,
            rooms: { count: 20, first: 'BROGUE_ENTRANCE', digger: 'ROOM' },
            doors: { chance: 50 },
            halls: { chance: 50 },
            loops: { minDistance: 20, maxLength: 5 },
            lakes: { count: 5, wreathSize: 1, wreathChance: 100 },
            bridges: {
                minDistance: 10,
                maxLength: 10,
            },
            stairs: { up: [20, 38], down: true },
        });
        level.create((x, y, v) => {
            grid[x][y] = v;
        });

        // grid.dump();

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
