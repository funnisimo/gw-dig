import 'jest-extended';
// import * as UTILS from '../test/utils';
import * as GWU from 'gw-utils';
import * as Dig from './dig';

describe('dig', () => {
    let grid: GWU.grid.NumGrid;

    beforeEach(() => {
        GWU.random.seed(12345);
        grid = GWU.grid.alloc(50, 30);
    });

    afterEach(() => {
        GWU.grid.free(grid);
        jest.restoreAllMocks();
    });

    test('install', () => {
        const config = Dig.room.install('TEST', Dig.room.rectangular, {
            width: '10-20',
            height: '5-9',
        });
        expect(Dig.room.rooms.TEST).toBe(config);
        expect(Dig.room.rooms.TEST).toMatchObject({
            width: expect.any(GWU.range.Range),
            height: expect.any(GWU.range.Range),
            fn: Dig.room.rectangular,
        });
    });

    describe('checkConfig', () => {
        test('basic', () => {
            const config = Dig.room.checkConfig(
                {
                    height: '8',
                },
                { width: 10, height: [3 - 6] }
            );

            expect(config.width.value()).toEqual(10);
            expect(config.height.value()).toEqual(8);
        });

        test('invalid', () => {
            expect(() => {
                Dig.room.checkConfig({ height: 'TEST' }, { height: true });
            }).toThrow();
        });

        test('required', () => {
            const config = Dig.room.checkConfig(
                {
                    height: '8',
                },
                { height: true }
            );
            expect(config.height.value()).toEqual(8);

            expect(() => {
                Dig.room.checkConfig({}, { height: true });
            }).toThrow();
        });

        test('not valid range', () => {
            expect(() => {
                Dig.room.checkConfig({}, { other: 'TEST' });
            }).toThrow();
        });

        test('tile - expected', () => {
            const config = Dig.room.checkConfig(
                {
                    height: '8',
                },
                { width: 10, height: [3 - 6], tile: 1 }
            );

            expect(config.width.value()).toEqual(10);
            expect(config.height.value()).toEqual(8);
            expect(config.tile).toEqual(1);
        });

        test('tile - passed', () => {
            const config = Dig.room.checkConfig(
                {
                    height: '8',
                    tile: 8,
                },
                { width: 10, height: [3 - 6] }
            );

            expect(config.width.value()).toEqual(10);
            expect(config.height.value()).toEqual(8);
            expect(config.tile).toEqual(8);
        });

        test('tile - both', () => {
            const config = Dig.room.checkConfig(
                {
                    height: '8',
                    tile: 8,
                },
                { width: 10, height: [3 - 6], tile: 3 }
            );

            expect(config.width.value()).toEqual(10);
            expect(config.height.value()).toEqual(8);
            expect(config.tile).toEqual(8);
        });
    });

    test('rectangular', () => {
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

    test('rectangular - tile', () => {
        const room = Dig.room.rectangular(
            { width: grid.width - 2, height: grid.height - 2, tile: 10 },
            grid
        );

        expect(room).toContainKeys(['digger', 'x', 'y', 'width', 'height']);

        grid.forEach((v, i, j) => {
            if (grid.isBoundaryXY(i, j)) {
                expect(v).toEqual(0);
            } else {
                expect(v).toEqual(10);
            }
        });
    });

    test('circular', () => {
        const room = Dig.room.circular({}, grid);

        expect(room).toContainKeys(['digger', 'x', 'y', 'width', 'height']);
        // grid.dump();

        expect(room).toMatchObject({ x: 22, y: 12, width: 7, height: 7 });
        expect(grid.count(1)).toBeGreaterThan(0);
        expect(room.cx).toEqual(25);
        expect(room.cy).toEqual(15);
        expect(grid[room.cx][room.cy]).toEqual(1);
    });

    test('circular - tile', () => {
        const room = Dig.room.circular({ tile: 10 }, grid);

        expect(room).toContainKeys(['digger', 'x', 'y', 'width', 'height']);
        // grid.dump();

        expect(room).toMatchObject({ x: 22, y: 12, width: 7, height: 7 });
        expect(grid.count(1)).toEqual(0);
        expect(grid.count(10)).toBeGreaterThan(0);
        expect(room.cx).toEqual(25);
        expect(room.cy).toEqual(15);
        expect(grid[room.cx][room.cy]).toEqual(10);
    });

    test('brogueDonut', () => {
        GWU.random.seed(123456);

        const room = Dig.room.brogueDonut({ holeChance: 100, radius: 7 }, grid);

        expect(room).toContainKeys(['digger', 'x', 'y', 'width', 'height']);
        // grid.dump();
        expect(grid[25][15]).toEqual(0);
        expect(room).toMatchObject({ x: 18, y: 8, width: 15, height: 15 });
        expect(grid[room.cx][room.cy]).toEqual(0);
    });

    test('brogueDonut - tile', () => {
        GWU.random.seed(123456);

        const room = Dig.room.brogueDonut(
            { holeChance: 100, radius: 7, tile: 10 },
            grid
        );

        expect(room).toContainKeys(['digger', 'x', 'y', 'width', 'height']);
        // grid.dump();
        expect(grid[25][15]).toEqual(0);
        expect(room).toMatchObject({ x: 18, y: 8, width: 15, height: 15 });
        expect(grid.count(1)).toEqual(0);
        expect(grid.count(10)).toBeGreaterThan(0);
        expect(grid[room.cx][room.cy]).toEqual(0);
    });

    test('chunkyRoom', () => {
        GWU.random.seed(123456);

        const room = Dig.room.chunkyRoom({}, grid);

        expect(room).toContainKeys(['digger', 'x', 'y', 'width', 'height']);
        // grid.dump();
        expect(room).toMatchObject({ x: 21, y: 12, width: 10, height: 8 });
        expect(grid.count(1)).toBeGreaterThan(0);
    });

    test('chunkyRoom - tile', () => {
        GWU.random.seed(123456);

        const room = Dig.room.chunkyRoom({ tile: 10 }, grid);

        expect(room).toContainKeys(['digger', 'x', 'y', 'width', 'height']);
        // grid.dump();
        expect(room).toMatchObject({ x: 21, y: 12, width: 10, height: 8 });
        expect(grid.count(1)).toEqual(0);
        expect(grid.count(10)).toBeGreaterThan(0);
    });

    test('cavern', () => {
        GWU.random.seed(123456);
        expect(grid.count(1)).toEqual(0);

        const room = Dig.room.cavern({ width: 10, height: 10 }, grid);

        expect(room).toContainKeys(['digger', 'x', 'y', 'width', 'height']);

        // grid.dump();
        expect(grid.count(1)).toBeGreaterThan(0);
    });

    test('cavern - tile', () => {
        GWU.random.seed(123456);
        expect(grid.count(1)).toEqual(0);

        const room = Dig.room.cavern({ width: 10, height: 10, tile: 10 }, grid);

        expect(room).toContainKeys(['digger', 'x', 'y', 'width', 'height']);

        // grid.dump();
        expect(grid.count(1)).toEqual(0);
        expect(grid.count(10)).toBeGreaterThan(0);
    });

    test('entrance', () => {
        GWU.random.seed(123456);
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

    test('entrance - tile', () => {
        GWU.random.seed(123456);
        expect(grid.count(1)).toEqual(0);

        const room = Dig.room.entrance({ tile: 10 }, grid);

        expect(room).toContainKeys(['digger', 'x', 'y', 'width', 'height']);

        // grid.dump();
        expect(grid.count(1)).toEqual(0);
        expect(grid.count(10)).toBeGreaterThan(0);
        expect(room.x).toEqual(14);
        expect(room.y).toEqual(18);
        expect(room.width).toEqual(20);
        expect(room.height).toEqual(10);
    });

    test('cross', () => {
        GWU.random.seed(123456);
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

    test('cross - tile', () => {
        GWU.random.seed(123456);
        expect(grid.count(1)).toEqual(0);

        const room = Dig.room.cross({ tile: 10 }, grid);

        expect(room).toContainKeys(['digger', 'x', 'y', 'width', 'height']);

        // grid.dump();
        expect(grid.count(1)).toEqual(0);
        expect(grid.count(10)).toBeGreaterThan(0);
        expect(room.x).toEqual(19);
        expect(room.y).toEqual(5);
        expect(room.width).toEqual(12);
        expect(room.height).toEqual(20);
    });

    test('symmetricalCross', () => {
        GWU.random.seed(123456);
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

    test('symmetricalCross - tile', () => {
        GWU.random.seed(123456);
        expect(grid.count(1)).toEqual(0);

        const room = Dig.room.symmetricalCross({ tile: 10 }, grid);

        expect(room).toContainKeys(['digger', 'x', 'y', 'width', 'height']);

        // grid.dump();
        expect(grid.count(1)).toEqual(0);
        expect(grid.count(10)).toBeGreaterThan(0);
        expect(room.x).toEqual(21);
        expect(room.y).toEqual(11);
        expect(room.width).toEqual(7);
        expect(room.height).toEqual(7);
    });

    test('choice - invalid', () => {
        expect(() => {
            Dig.room.choiceRoom({}, grid);
        }).toThrow();
    });

    test('choice - unknown', () => {
        expect(() => {
            Dig.room.choiceRoom({ choices: ['INVALID'] }, grid);
        }).toThrow();
    });

    test('choice', () => {
        const room = Dig.room.choiceRoom(
            { choices: ['DEFAULT', 'DEFAULT'] },
            grid
        );
        expect(room).not.toBeNull();
    });

    test('choice - opts', () => {
        const room = Dig.room.choiceRoom(
            { choices: ['DEFAULT', 'DEFAULT'], opts: { width: 10 } },
            grid
        );
        expect(room).not.toBeNull();
        expect(room!.width).toEqual(10);
    });
});
