import 'jest-extended';
import * as UTILS from '../test/utils';
import * as GW from 'gw-utils';
import * as Dig from './dig';

describe('dig', () => {
    let grid: GW.grid.NumGrid;

    beforeEach(() => {
        UTILS.mockRandom();
        grid = GW.grid.alloc(50, 30);
    });

    afterEach(() => {
        GW.grid.free(grid);
        jest.restoreAllMocks();
    });

    test('install', () => {
        const config = Dig.room.install('TEST', Dig.room.rectangular, {
            width: '10-20',
            height: '5-9',
        });
        expect(Dig.room.rooms.TEST).toBe(config);
        expect(Dig.room.rooms.TEST).toMatchObject({
            width: expect.any(GW.range.Range),
            height: expect.any(GW.range.Range),
            fn: Dig.room.rectangular,
        });
    });

    test('checkConfig', () => {
        const config = Dig.room.checkConfig(
            {
                height: '8',
            },
            { width: 10, height: [3 - 6] }
        );

        expect(config.width.value()).toEqual(10);
        expect(config.height.value()).toEqual(8);
    });

    test('rectangular', () => {
        GW.random.seed(12345);

        const room = Dig.room.rectangular(
            { width: grid.width - 2, height: grid.height - 2 },
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

    test('circular', () => {
        GW.random.seed(12345);

        const room = Dig.room.circular({}, grid);

        expect(room).toContainKeys(['digger', 'x', 'y', 'width', 'height']);
        // grid.dump();

        expect(room).toMatchObject({ x: 25, y: 15, width: 6, height: 6 });
    });

    test('brogueDonut', () => {
        GW.random.seed(123456);

        const room = Dig.room.brogueDonut({ holeChance: 100, radius: 7 }, grid);

        expect(room).toContainKeys(['digger', 'x', 'y', 'width', 'height']);
        // grid.dump();
        expect(grid[25][15]).toEqual(0);
        expect(room).toMatchObject({ x: 18, y: 8, width: 15, height: 15 });
    });

    test('chunkyRoom', () => {
        GW.random.seed(123456);

        const room = Dig.room.chunkyRoom({}, grid);

        expect(room).toContainKeys(['digger', 'x', 'y', 'width', 'height']);
        // grid.dump();
        expect(room).toMatchObject({ x: 21, y: 12, width: 8, height: 8 });
    });

    test('cavern', () => {
        GW.random.seed(123456);
        expect(grid.count(1)).toEqual(0);

        const room = Dig.room.cavern({ width: 10, height: 10 }, grid);

        expect(room).toContainKeys(['digger', 'x', 'y', 'width', 'height']);

        // grid.dump();
        expect(grid.count(1)).toBeGreaterThan(0);
    });

    test('entrance', () => {
        GW.random.seed(123456);
        expect(grid.count(1)).toEqual(0);

        const room = Dig.room.entrance({}, grid);

        expect(room).toContainKeys(['digger', 'x', 'y', 'width', 'height']);

        // grid.dump();
        expect(grid.count(1)).toBeGreaterThan(0);
        expect(room.x).toEqual(14);
        expect(room.y).toEqual(18);
        expect(room.width).toEqual(20);
        expect(room.height).toEqual(10);
    });

    test('cross', () => {
        GW.random.seed(123456);
        expect(grid.count(1)).toEqual(0);

        const room = Dig.room.cross({}, grid);

        expect(room).toContainKeys(['digger', 'x', 'y', 'width', 'height']);

        // grid.dump();
        expect(grid.count(1)).toBeGreaterThan(0);
        expect(room.x).toEqual(19);
        expect(room.y).toEqual(5);
        expect(room.width).toEqual(12);
        expect(room.height).toEqual(20);
    });

    test('symmetricalCross', () => {
        GW.random.seed(123456);
        expect(grid.count(1)).toEqual(0);

        const room = Dig.room.symmetricalCross({}, grid);

        expect(room).toContainKeys(['digger', 'x', 'y', 'width', 'height']);

        // grid.dump();
        expect(grid.count(1)).toBeGreaterThan(0);
        expect(room.x).toEqual(21);
        expect(room.y).toEqual(11);
        expect(room.width).toEqual(7);
        expect(room.height).toEqual(7);
    });
});
