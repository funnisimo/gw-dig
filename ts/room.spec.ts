import 'jest-extended';
import * as GW from 'gw-utils';
import * as Dig from './dig';

describe('dig', () => {
    let grid: GW.grid.NumGrid;

    beforeEach(() => {
        grid = GW.grid.alloc(50, 30);
    });

    afterEach(() => {
        GW.grid.free(grid);
    });

    test('rectangularRoom', () => {
        GW.random.seed(12345);
        const room = Dig.rectangularRoom(
            { width: grid.width - 2, height: grid.height - 2, minPct: 100 },
            grid
        );

        expect(room).toContainKeys(['digger', 'x', 'y', 'width', 'height']);

        grid.forEach((v, i, j) => {
            if (grid.isBoundaryXY(i, j)) {
                expect(v).toEqual(0);
            } else {
                expect(v).toEqual(1);
            }
        });
    });

    test('digCavern', () => {
        GW.random.seed(123456);
        expect(grid.count(1)).toEqual(0);
        const room = Dig.cavern({ width: 10, height: 10 }, grid);

        expect(room).toContainKeys(['digger', 'x', 'y', 'width', 'height']);

        // GW.grid.dump(grid);
        expect(grid.count(1)).toBeGreaterThan(0);
    });
});
