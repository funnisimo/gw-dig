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
            expect(Hall.pickHallWidth({ hallWidth: 0 })).toEqual(1);
            expect(Hall.pickHallWidth({ hallWidth: 1 })).toEqual(1);
            expect(Hall.pickHallWidth({ hallWidth: 2 })).toEqual(2);
            expect(Hall.pickHallWidth({ hallWidth: 4 })).toEqual(3);
        });

        test('array', () => {
            expect(
                UTILS.results(() => Hall.pickHallWidth({ hallWidth: [70, 30] }))
            ).toEqual([1, 2]);

            expect(
                UTILS.results(() =>
                    Hall.pickHallWidth({ hallWidth: [50, 30, 20] })
                )
            ).toEqual([1, 2, 3]);
        });

        test('object', () => {
            expect(
                UTILS.results(() =>
                    Hall.pickHallWidth({ hallWidth: { 0: 70, 2: 30, 4: 20 } })
                )
            ).toEqual([1, 2, 3]);

            expect(
                UTILS.results(() =>
                    Hall.pickHallWidth({
                        hallWidth: { 0: 50, 1: 30, 2: 20, 5: 10 },
                    })
                )
            ).toEqual([1, 2, 3]);
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
            const hall = Hall.attachHallway(grid, room, {});
            expect(hall).toBeNull();
        });

        test('basic hall - down', () => {
            room.doors[GW.utils.DOWN] = [25, 30];
            const hall = Hall.attachHallway(grid, room, {});
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
            const hall = Hall.attachHallway(grid, room, {});
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
            const hall = Hall.attachHallway(grid, room, {});
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
            const hall = Hall.attachHallway(grid, room, {});
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
            const hall = Hall.attachHallway(grid, room, { width: 2 });
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
            const hall = Hall.attachHallway(grid, room, { width: 2 });
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
            const hall = Hall.attachHallway(grid, room, { width: 2 });
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

        test('basic hall - right, width:2', () => {
            room.doors[GW.utils.RIGHT] = [30, 25];
            const hall = Hall.attachHallway(grid, room, { width: 2 });
            // grid.dump();
            expect(hall).not.toBeNull();
            expect(hall!.x).toEqual(30);
            expect(hall!.y).toEqual(24);
            expect(hall!.length).toEqual(10);
            expect(hall!.width).toEqual(2);
            expect(hall!.x2).toEqual(39);
            expect(hall!.y2).toEqual(25);
            expect(hall!.doors).toEqual([undefined, [40, 24]]);
        });
    });
});
