import 'jest-extended';
import * as UTILS from '../test/utils';
import * as GW from 'gw-utils';
import * as HALL from './hall';
import * as SITE from './site';
import { Room } from './types';

describe('Hall', () => {
    beforeEach(() => {
        UTILS.mockRandom();
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

    // describe('pickLengthRange', () => {
    //     test('length', () => {
    //         let l: GW.range.Range;

    //         l = HALL.pickLengthRange(GW.utils.UP, { length: 7 });
    //         expect(l.value()).toEqual(7);

    //         l = HALL.pickLengthRange(GW.utils.UP, { length: '7-10' });
    //         expect(l.lo).toEqual(7);
    //         expect(l.hi).toEqual(10);

    //         l = HALL.pickLengthRange(GW.utils.UP, {
    //             length: ['7-10', '5-9'],
    //         });
    //         expect(l.lo).toEqual(5);
    //         expect(l.hi).toEqual(9);

    //         l = HALL.pickLengthRange(GW.utils.RIGHT, {
    //             length: [[7, 10], '5-9'],
    //         });
    //         expect(l.lo).toEqual(7);
    //         expect(l.hi).toEqual(10);

    //         l = HALL.pickLengthRange(GW.utils.LEFT, {
    //             length: [[5, 9], '7-10'],
    //         });
    //         expect(l.lo).toEqual(5);
    //         expect(l.hi).toEqual(9);
    //     });

    //     test('default', () => {
    //         let l: GW.range.Range;

    //         l = HALL.pickLengthRange(GW.utils.UP, {});
    //         expect(l.lo).toEqual(2);
    //         expect(l.hi).toEqual(9);

    //         l = HALL.pickLengthRange(GW.utils.RIGHT, {});
    //         expect(l.lo).toEqual(9);
    //         expect(l.hi).toEqual(15);
    //     });
    // });

    // describe('install', () => {
    //     test('basic', () => {
    //         const a = HALL.install('DEFAULT', HALL.dig);
    //         expect(a.fn).toBe(HALL.dig);
    //         expect(a.id).toEqual('DEFAULT');
    //         expect(HALL.halls.DEFAULT).toBe(a);
    //     });

    //     test('basic wide', () => {
    //         const a = HALL.install('WIDE', HALL.digWide);
    //         expect(a.fn).toBe(HALL.digWide);
    //         expect(a.id).toEqual('WIDE');
    //         expect(a.width).toEqual(2);
    //         expect(HALL.halls.WIDE).toBe(a);
    //     });
    // });

    describe('digHall', () => {
        let grid: GW.grid.NumGrid;
        let site: SITE.GridSite;
        let room: Room;

        beforeEach(() => {
            grid = GW.grid.alloc(50, 50);
            grid.fillRect(20, 20, 10, 10, 1);
            room = new Room(20, 20, 10, 10);
            site = new SITE.GridSite(grid);
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

        test('no chance - no hall', () => {
            const digger = new HALL.HallDigger({ chance: 0 });
            const hall = digger.create(site, room.doors);
            expect(hall).toBeNull();
        });

        test('no doors - no hall', () => {
            const digger = new HALL.HallDigger();
            const hall = digger.create(site, room.doors);
            expect(hall).toBeNull();
        });

        test('basic hall - down', () => {
            room.doors[GW.utils.DOWN] = [25, 30];
            const digger = new HALL.HallDigger();
            const hall = digger.create(site, room.doors);

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
            const digger = new HALL.HallDigger();
            const hall = digger.create(site, room.doors);

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
            const digger = new HALL.HallDigger();
            const hall = digger.create(site, room.doors);

            // grid.dump();
            expect(hall).not.toBeNull();
            expect(hall!.x).toEqual(19);
            expect(hall!.y).toEqual(25);
            expect(hall!.length).toEqual(4);
            expect(hall!.width).toEqual(1);
            expect(hall!.x2).toEqual(16);
            expect(hall!.y2).toEqual(25);
            expect(hall!.doors).toEqual([
                undefined,
                undefined,
                undefined,
                [15, 25],
            ]);
        });

        test('basic hall - right', () => {
            room.doors[GW.utils.RIGHT] = [30, 25];
            const digger = new HALL.HallDigger();
            const hall = digger.create(site, room.doors);

            // grid.dump();
            expect(hall).not.toBeNull();
            expect(hall!.x).toEqual(30);
            expect(hall!.y).toEqual(25);
            expect(hall!.length).toEqual(4);
            expect(hall!.width).toEqual(1);
            expect(hall!.x2).toEqual(33);
            expect(hall!.y2).toEqual(25);
            expect(hall!.doors).toEqual([undefined, [34, 25]]);
        });

        test('basic hall - down, width:2', () => {
            room.doors[GW.utils.DOWN] = [25, 30];
            const digger = new HALL.HallDigger({ width: 2 });
            const hall = digger.create(site, room.doors);

            // grid.dump();
            expect(hall).not.toBeNull();
            expect(hall!.x).toEqual(24);
            expect(hall!.y).toEqual(30);
            expect(hall!.length).toEqual(3);
            expect(hall!.width).toEqual(2);
            expect(hall!.x2).toEqual(25);
            expect(hall!.y2).toEqual(32);
            expect(hall!.doors).toEqual([undefined, undefined, [25, 33]]);
        });

        test('basic hall - up, width:2', () => {
            room.doors[GW.utils.UP] = [25, 19];
            const digger = new HALL.HallDigger({ width: 2 });
            const hall = digger.create(site, room.doors);

            // grid.dump();
            expect(hall).not.toBeNull();
            expect(hall!.x).toEqual(25);
            expect(hall!.y).toEqual(19);
            expect(hall!.length).toEqual(3);
            expect(hall!.width).toEqual(2);
            expect(hall!.x2).toEqual(26);
            expect(hall!.y2).toEqual(17);
            expect(hall!.doors).toEqual([[25, 16]]);
        });

        test('basic hall - left, width:2', () => {
            room.doors[GW.utils.LEFT] = [19, 25];
            const digger = new HALL.HallDigger({ width: 2 });
            const hall = digger.create(site, room.doors);

            // grid.dump();
            expect(hall).not.toBeNull();
            expect(hall!.x).toEqual(19);
            expect(hall!.y).toEqual(25);
            expect(hall!.length).toEqual(4);
            expect(hall!.width).toEqual(2);
            expect(hall!.x2).toEqual(16);
            expect(hall!.y2).toEqual(26);
            expect(hall!.doors).toEqual([
                undefined,
                undefined,
                undefined,
                [15, 25],
            ]);

            expect(grid.count(10)).toEqual(0);
        });

        test('basic hall - right, width:3', () => {
            room.doors[GW.utils.RIGHT] = [30, 25];
            const digger = new HALL.HallDigger({ width: 3, tile: 10 });
            const hall = digger.create(site, room.doors);

            // grid.dump();
            expect(hall).not.toBeNull();
            expect(hall!.x).toEqual(30);
            expect(hall!.y).toEqual(24);
            expect(hall!.length).toEqual(4);
            expect(hall!.width).toEqual(3);
            expect(hall!.x2).toEqual(33);
            expect(hall!.y2).toEqual(26);
            expect(hall!.doors).toEqual([undefined, [34, 25]]);

            expect(grid.count(10)).toBeGreaterThan(0);
        });
    });

    describe('tile', () => {
        let grid: GW.grid.NumGrid;
        let site: SITE.GridSite;
        let room: Room;

        beforeEach(() => {
            grid = GW.grid.alloc(50, 50);
            grid.fillRect(20, 20, 10, 10, 1);
            room = new Room(20, 20, 10, 10);
            site = new SITE.GridSite(grid);
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

        test('can set tile', () => {
            room.doors[GW.utils.DOWN] = [25, 30];
            const digger = new HALL.HallDigger({ tile: 10 });
            const hall = digger.create(site, room.doors);

            // grid.dump();
            expect(hall).not.toBeNull();
            expect(hall!.x).toEqual(25);
            expect(hall!.y).toEqual(30);
            expect(hall!.length).toEqual(3);
            expect(hall!.width).toEqual(1);
            expect(hall!.x2).toEqual(25);
            expect(hall!.y2).toEqual(32);
            expect(hall!.doors).toEqual([undefined, undefined, [25, 33]]);

            expect(grid[hall!.x][hall!.y]).toEqual(10);
        });
    });
});
