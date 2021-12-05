import 'jest-extended';
import * as UTILS from '../test/utils';
import * as GWU from 'gw-utils';
import * as HALL from './hall';
import { Room, Hall } from './types';

describe('Hall', () => {
    beforeEach(() => {
        GWU.random.seed(12345);
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    describe('pickWidth', () => {
        test('number', () => {
            expect(HALL.pickWidth({})).toEqual(1);
            expect(HALL.pickWidth(1)).toEqual(1);
            expect(HALL.pickWidth({ width: 0 })).toEqual(1);
            expect(HALL.pickWidth({ width: 1 })).toEqual(1);
            expect(HALL.pickWidth({ width: 2 })).toEqual(2);
            expect(HALL.pickWidth({ width: 4 })).toEqual(3);
        });

        test('array', () => {
            expect(
                UTILS.results(() => HALL.pickWidth({ width: [70, 30] }))
            ).toEqual([1, 2]);

            expect(
                UTILS.results(() => HALL.pickWidth({ width: [50, 30, 20] }))
            ).toEqual([1, 2, 3]);
        });

        test('object', () => {
            expect(
                UTILS.results(() =>
                    HALL.pickWidth({ width: { 0: 70, 2: 30, 4: 20 } })
                )
            ).toEqual([1, 2, 3]);

            expect(
                UTILS.results(() =>
                    HALL.pickWidth({
                        width: { 0: 50, 1: 30, 2: 20, 5: 10 },
                    })
                )
            ).toEqual([1, 2, 3]);
        });
    });

    describe('pickLengthRange', () => {
        test('length', () => {
            let l: GWU.range.Range;

            l = HALL.pickLengthRange(GWU.xy.UP, { length: 7 });
            expect(l.value()).toEqual(7);

            l = HALL.pickLengthRange(GWU.xy.UP, { length: '7-10' });
            expect(l.lo).toEqual(7);
            expect(l.hi).toEqual(10);

            l = HALL.pickLengthRange(GWU.xy.UP, {
                length: ['7-10', '5-9'],
            });
            expect(l.lo).toEqual(5);
            expect(l.hi).toEqual(9);

            l = HALL.pickLengthRange(GWU.xy.RIGHT, {
                length: [[7, 10], '5-9'],
            });
            expect(l.lo).toEqual(7);
            expect(l.hi).toEqual(10);

            l = HALL.pickLengthRange(GWU.xy.LEFT, {
                length: [[5, 9], '7-10'],
            });
            expect(l.lo).toEqual(5);
            expect(l.hi).toEqual(9);
        });

        test('default', () => {
            let l: GWU.range.Range;

            l = HALL.pickLengthRange(GWU.xy.UP, {});
            expect(l.lo).toEqual(2);
            expect(l.hi).toEqual(9);

            l = HALL.pickLengthRange(GWU.xy.RIGHT, {});
            expect(l.lo).toEqual(9);
            expect(l.hi).toEqual(15);
        });
    });

    describe('install', () => {
        test('basic', () => {
            const a = HALL.install('DEFAULT', HALL.dig);
            expect(a.fn).toBe(HALL.dig);
            expect(a.id).toEqual('DEFAULT');
            expect(HALL.halls.DEFAULT).toBe(a);
        });

        test('basic wide', () => {
            const a = HALL.install('WIDE', HALL.digWide);
            expect(a.fn).toBe(HALL.digWide);
            expect(a.id).toEqual('WIDE');
            expect(a.width).toEqual(2);
            expect(HALL.halls.WIDE).toBe(a);
        });
    });

    describe('digHall', () => {
        let grid: GWU.grid.NumGrid;
        let room: Room;

        beforeEach(() => {
            grid = GWU.grid.alloc(50, 50);
            grid.fillRect(20, 20, 10, 10, 1);
            room = new Room('TEST', 20, 20, 10, 10);
            // room.doors = [
            //     [-1, -1],
            //     [-1, -1],
            //     [-1, -1],
            //     [-1, -1],
            // ];
        });

        afterEach(() => {
            GWU.grid.free(grid);
        });

        test('no room doors - no hall', () => {
            const hall = HALL.dig({}, grid, room);
            expect(hall).toBeNull();
        });

        test('basic hall - down', () => {
            room.doors[GWU.xy.DOWN] = [25, 30];
            const hall = HALL.dig({}, grid, room);
            // grid.dump();
            expect(hall).not.toBeNull();
            expect(hall!.x).toEqual(25);
            expect(hall!.y).toEqual(30);
            expect(hall!.length).toEqual(6);
            expect(hall!.width).toEqual(1);
            expect(hall!.x2).toEqual(25);
            expect(hall!.y2).toEqual(35);
            expect(hall!.doors).toEqual([undefined, undefined, [25, 36]]);
        });

        test('basic hall - up', () => {
            room.doors[GWU.xy.UP] = [25, 19];
            const hall = HALL.dig({}, grid, room);
            // grid.dump();
            expect(hall).not.toBeNull();
            expect(hall!.x).toEqual(25);
            expect(hall!.y).toEqual(19);
            expect(hall!.length).toEqual(6);
            expect(hall!.width).toEqual(1);
            expect(hall!.x2).toEqual(25);
            expect(hall!.y2).toEqual(14);
            expect(hall!.doors).toEqual([[25, 13]]);
        });

        test('basic hall - left', () => {
            room.doors[GWU.xy.LEFT] = [19, 25];
            const hall = HALL.dig({}, grid, room);
            // grid.dump();
            expect(hall).not.toBeNull();
            expect(hall!.x).toEqual(19);
            expect(hall!.y).toEqual(25);
            expect(hall!.length).toEqual(12);
            expect(hall!.width).toEqual(1);
            expect(hall!.x2).toEqual(8);
            expect(hall!.y2).toEqual(25);
            expect(hall!.doors).toEqual([
                undefined,
                undefined,
                undefined,
                [7, 25],
            ]);
        });

        test('basic hall - right', () => {
            room.doors[GWU.xy.RIGHT] = [30, 25];
            const hall = HALL.dig({}, grid, room);
            // grid.dump();
            expect(hall).not.toBeNull();
            expect(hall!.x).toEqual(30);
            expect(hall!.y).toEqual(25);
            expect(hall!.length).toEqual(12);
            expect(hall!.width).toEqual(1);
            expect(hall!.x2).toEqual(41);
            expect(hall!.y2).toEqual(25);
            expect(hall!.doors).toEqual([undefined, [42, 25]]);
        });

        test('basic hall - down, width:2', () => {
            room.doors[GWU.xy.DOWN] = [25, 30];
            const hall = HALL.digWide({ width: 2 }, grid, room);
            // grid.dump();
            expect(hall).not.toBeNull();
            expect(hall!.x).toEqual(25);
            expect(hall!.y).toEqual(30);
            expect(hall!.length).toEqual(6);
            expect(hall!.width).toEqual(2);
            expect(hall!.x2).toEqual(26);
            expect(hall!.y2).toEqual(35);
            expect(hall!.doors).toEqual([undefined, undefined, [25, 36]]);
        });

        test('basic hall - up, width:2', () => {
            room.doors[GWU.xy.UP] = [25, 19];
            const hall = HALL.digWide({}, grid, room);
            // grid.dump();
            expect(hall).not.toBeNull();
            expect(hall!.x).toEqual(25);
            expect(hall!.y).toEqual(19);
            expect(hall!.length).toEqual(6);
            expect(hall!.width).toEqual(2);
            expect(hall!.x2).toEqual(26);
            expect(hall!.y2).toEqual(14);
            expect(hall!.doors).toEqual([[25, 13]]);
        });

        test('basic hall - left, width:2', () => {
            room.doors[GWU.xy.LEFT] = [19, 25];
            const hall = HALL.digWide({ width: 2 }, grid, room);
            // grid.dump();
            expect(hall).not.toBeNull();
            expect(hall!.x).toEqual(19);
            expect(hall!.y).toEqual(25);
            expect(hall!.length).toEqual(12);
            expect(hall!.width).toEqual(2);
            expect(hall!.x2).toEqual(8);
            expect(hall!.y2).toEqual(26);
            expect(hall!.doors).toEqual([
                undefined,
                undefined,
                undefined,
                [7, 25],
            ]);

            expect(grid.count(10)).toEqual(0);
        });

        test('basic hall - right, width:3', () => {
            room.doors[GWU.xy.RIGHT] = [30, 25];
            const hall = HALL.digWide({ width: '3', tile: 10 }, grid, room);
            // grid.dump();
            expect(hall).not.toBeNull();
            expect(hall!.x).toEqual(30);
            expect(hall!.y).toEqual(25);
            expect(hall!.length).toEqual(12);
            expect(hall!.width).toEqual(3);
            expect(hall!.x2).toEqual(41);
            expect(hall!.y2).toEqual(27);
            expect(hall!.doors).toEqual([undefined, [42, 25]]);

            expect(grid.count(10)).toBeGreaterThan(0);
        });
    });

    describe('tile', () => {
        let grid: GWU.grid.NumGrid;
        let room: Room;

        beforeEach(() => {
            grid = GWU.grid.alloc(50, 50);
            grid.fillRect(20, 20, 10, 10, 1);
            room = new Room('TEST', 20, 20, 10, 10);
            // room.doors = [
            //     [-1, -1],
            //     [-1, -1],
            //     [-1, -1],
            //     [-1, -1],
            // ];
        });

        afterEach(() => {
            GWU.grid.free(grid);
        });

        test('can set tile', () => {
            room.doors[GWU.xy.DOWN] = [25, 30];
            const hall = HALL.dig({ tile: 10 }, grid, room) as Hall;
            // grid.dump();
            expect(hall).not.toBeNull();
            expect(hall!.x).toEqual(25);
            expect(hall!.y).toEqual(30);
            expect(hall!.length).toEqual(6);
            expect(hall!.width).toEqual(1);
            expect(hall!.x2).toEqual(25);
            expect(hall!.y2).toEqual(35);
            expect(hall!.doors).toEqual([undefined, undefined, [25, 36]]);

            expect(grid[hall!.x][hall!.y]).toEqual(10);
        });
    });
});
