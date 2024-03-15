import 'jest-extended';
import * as Grid from 'gw-utils/grid';
import * as Connect from './connect';

describe('connect', () => {
    let grid: Grid.NumGrid;

    beforeEach(() => {
        grid = Grid.alloc(20, 20, 0);
    });

    afterEach(() => {
        Grid.free(grid);
    });

    test('simple', () => {
        grid.set(5, 5, 1);
        grid.set(9, 5, 1);

        expect(Connect.connect(grid)).toBeTrue();

        expect(grid.get(6, 5)).toEqual(1);
        expect(grid.get(7, 5)).toEqual(1);
        expect(grid.get(8, 5)).toEqual(1);
    });

    test('double', () => {
        grid.set(5, 5, 1);
        grid.set(9, 5, 1);
        grid.set(5, 9, 1);

        expect(Connect.connect(grid)).toBeTrue();

        expect(grid.get(6, 5)).toEqual(1);
        expect(grid.get(7, 5)).toEqual(1);
        expect(grid.get(8, 5)).toEqual(1);

        expect(grid.get(5, 6)).toEqual(1);
        expect(grid.get(5, 7)).toEqual(1);
        expect(grid.get(5, 8)).toEqual(1);
    });
});
