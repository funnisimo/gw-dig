import 'jest-extended';
import * as UTILS from '../test/utils';
import * as GW from 'gw-utils';
import * as Hall from './hall';
import { Room } from './room';

describe('Hall', () => {
    beforeEach(() => {
        UTILS.mockRandom();
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    describe('pickWidth', () => {
        test('number', () => {
            expect(Hall.pickHallWidth({})).toEqual(1);
            expect(Hall.pickHallWidth(1)).toEqual(1);
            expect(Hall.pickHallWidth({ width: 0 })).toEqual(1);
            expect(Hall.pickHallWidth({ width: 1 })).toEqual(1);
            expect(Hall.pickHallWidth({ width: 2 })).toEqual(2);
            expect(Hall.pickHallWidth({ width: 4 })).toEqual(3);
        });

        test('array', () => {
            expect(
                UTILS.results(() => Hall.pickHallWidth({ width: [70, 30] }))
            ).toEqual([1, 2]);

            expect(
                UTILS.results(() => Hall.pickHallWidth({ width: [50, 30, 20] }))
            ).toEqual([1, 2, 3]);
        });

        test('object', () => {
            expect(
                UTILS.results(() =>
                    Hall.pickHallWidth({ width: { 0: 70, 2: 30, 4: 20 } })
                )
            ).toEqual([1, 2, 3]);

            expect(
                UTILS.results(() =>
                    Hall.pickHallWidth({
                        width: { 0: 50, 1: 30, 2: 20, 5: 10 },
                    })
                )
            ).toEqual([1, 2, 3]);
        });
    });

    describe('pickLengthRange', () => {
        test('length', () => {
            let l: GW.range.Range;

            l = Hall.pickLengthRange(GW.utils.UP, { length: 7 });
            expect(l.value()).toEqual(7);

            l = Hall.pickLengthRange(GW.utils.UP, { length: '7-10' });
            expect(l.lo).toEqual(7);
            expect(l.hi).toEqual(10);

            l = Hall.pickLengthRange(GW.utils.UP, {
                length: '7-10',
                yLength: '5-9',
            });
            expect(l.lo).toEqual(5);
            expect(l.hi).toEqual(9);

            l = Hall.pickLengthRange(GW.utils.RIGHT, {
                length: [7, 10],
                yLength: '5-9',
            });
            expect(l.lo).toEqual(7);
            expect(l.hi).toEqual(10);

            l = Hall.pickLengthRange(GW.utils.LEFT, {
                length: '7-10',
                xLength: [5, 9],
            });
            expect(l.lo).toEqual(5);
            expect(l.hi).toEqual(9);
        });

        test('default', () => {
            let l: GW.range.Range;

            l = Hall.pickLengthRange(GW.utils.UP, {});
            expect(l.lo).toEqual(2);
            expect(l.hi).toEqual(9);

            l = Hall.pickLengthRange(GW.utils.RIGHT, {});
            expect(l.lo).toEqual(9);
            expect(l.hi).toEqual(15);
        });
    });

    describe('digHall', () => {
        let grid: GW.grid.NumGrid;
        let room: Room;

        beforeEach(() => {
            grid = GW.grid.alloc(50, 50);
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
            GW.grid.free(grid);
        });

        test('no room doors - no hall', () => {
            const hall = Hall.dig(grid, room, {});
            expect(hall).toBeNull();
        });

        test('basic hall - down', () => {
            room.doors[GW.utils.DOWN] = [25, 30];
            const hall = Hall.dig(grid, room, {});
            // grid.dump();
            expect(hall).not.toBeNull();
            expect(hall!.x).toEqual(25);
            expect(hall!.y).toEqual(30);
            expect(hall!.length).toEqual(3);
            expect(hall!.width).toEqual(1);
            expect(hall!.x2).toEqual(25);
            expect(hall!.y2).toEqual(32);
            expect(hall!.doors).toEqual([undefined, undefined, [25, 33]]);
        });

        test('basic hall - up', () => {
            room.doors[GW.utils.UP] = [25, 19];
            const hall = Hall.dig(grid, room, {});
            // grid.dump();
            expect(hall).not.toBeNull();
            expect(hall!.x).toEqual(25);
            expect(hall!.y).toEqual(19);
            expect(hall!.length).toEqual(3);
            expect(hall!.width).toEqual(1);
            expect(hall!.x2).toEqual(25);
            expect(hall!.y2).toEqual(17);
            expect(hall!.doors).toEqual([[25, 16]]);
        });

        test('basic hall - left', () => {
            room.doors[GW.utils.LEFT] = [19, 25];
            const hall = Hall.dig(grid, room, {});
            // grid.dump();
            expect(hall).not.toBeNull();
            expect(hall!.x).toEqual(19);
            expect(hall!.y).toEqual(25);
            expect(hall!.length).toEqual(10);
            expect(hall!.width).toEqual(1);
            expect(hall!.x2).toEqual(10);
            expect(hall!.y2).toEqual(25);
            expect(hall!.doors).toEqual([
                undefined,
                undefined,
                undefined,
                [9, 25],
            ]);
        });

        test('basic hall - right', () => {
            room.doors[GW.utils.RIGHT] = [30, 25];
            const hall = Hall.dig(grid, room, {});
            // grid.dump();
            expect(hall).not.toBeNull();
            expect(hall!.x).toEqual(30);
            expect(hall!.y).toEqual(25);
            expect(hall!.length).toEqual(10);
            expect(hall!.width).toEqual(1);
            expect(hall!.x2).toEqual(39);
            expect(hall!.y2).toEqual(25);
            expect(hall!.doors).toEqual([undefined, [40, 25]]);
        });

        test('basic hall - down, width:2', () => {
            room.doors[GW.utils.DOWN] = [25, 30];
            const hall = Hall.digWide(grid, room, { width: 2 });
            // grid.dump();
            expect(hall).not.toBeNull();
            expect(hall!.x).toEqual(24);
            expect(hall!.y).toEqual(30);
            expect(hall!.length).toEqual(3);
            expect(hall!.width).toEqual(2);
            expect(hall!.x2).toEqual(25);
            expect(hall!.y2).toEqual(32);
            expect(hall!.doors).toEqual([undefined, undefined, [24, 33]]);
        });

        test('basic hall - up, width:2', () => {
            room.doors[GW.utils.UP] = [25, 19];
            const hall = Hall.digWide(grid, room, {});
            // grid.dump();
            expect(hall).not.toBeNull();
            expect(hall!.x).toEqual(24);
            expect(hall!.y).toEqual(19);
            expect(hall!.length).toEqual(3);
            expect(hall!.width).toEqual(2);
            expect(hall!.x2).toEqual(25);
            expect(hall!.y2).toEqual(17);
            expect(hall!.doors).toEqual([[24, 16]]);
        });

        test('basic hall - left, width:2', () => {
            room.doors[GW.utils.LEFT] = [19, 25];
            const hall = Hall.digWide(grid, room, { width: 2 });
            // grid.dump();
            expect(hall).not.toBeNull();
            expect(hall!.x).toEqual(19);
            expect(hall!.y).toEqual(24);
            expect(hall!.length).toEqual(10);
            expect(hall!.width).toEqual(2);
            expect(hall!.x2).toEqual(10);
            expect(hall!.y2).toEqual(25);
            expect(hall!.doors).toEqual([
                undefined,
                undefined,
                undefined,
                [9, 24],
            ]);
        });

        test('basic hall - right, width:3', () => {
            room.doors[GW.utils.RIGHT] = [30, 25];
            const hall = Hall.digWide(grid, room, { width: 3 });
            // grid.dump();
            expect(hall).not.toBeNull();
            expect(hall!.x).toEqual(30);
            expect(hall!.y).toEqual(24);
            expect(hall!.length).toEqual(10);
            expect(hall!.width).toEqual(3);
            expect(hall!.x2).toEqual(39);
            expect(hall!.y2).toEqual(26);
            expect(hall!.doors).toEqual([undefined, [40, 24]]);
        });
    });
});
