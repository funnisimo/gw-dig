import 'jest-extended';
import * as UTILS from '../test/utils';
import * as GWU from 'gw-utils';
import * as HALL from './hall';
import * as SITE from './site';
import { Room, Hall } from './types';

describe('Hall', () => {
    beforeEach(() => {
        // UTILS.mockRandom();
        GWU.rng.random.seed(12345);
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    describe('pickWidth', () => {
        test('number', () => {
            expect(HALL.pickWidth({})).toEqual(1);
            expect(HALL.pickWidth(1)).toEqual(1);
            expect(HALL.pickWidth(0)).toEqual(1);
            expect(HALL.pickWidth(1)).toEqual(1);
            expect(HALL.pickWidth(2)).toEqual(2);
            expect(HALL.pickWidth(4)).toEqual(3);
        });

        test('array', () => {
            expect(UTILS.results(() => HALL.pickWidth([70, 30]))).toEqual([
                1, 2,
            ]);

            expect(UTILS.results(() => HALL.pickWidth([50, 30, 20]))).toEqual([
                1, 2, 3,
            ]);
        });

        test('object', () => {
            expect(
                UTILS.results(() => HALL.pickWidth({ 0: 70, 2: 30, 4: 20 }))
            ).toEqual([1, 2, 3]);

            expect(
                UTILS.results(() =>
                    HALL.pickWidth({ 0: 50, 1: 30, 2: 20, 5: 10 })
                )
            ).toEqual([1, 2, 3]);
        });
    });

    // describe('pickLengthRange', () => {
    //     test('length', () => {
    //         let l: GWU.range.Range;

    //         l = HALL.pickLengthRange(GWU.utils.UP, { length: 7 });
    //         expect(l.value()).toEqual(7);

    //         l = HALL.pickLengthRange(GWU.utils.UP, { length: '7-10' });
    //         expect(l.lo).toEqual(7);
    //         expect(l.hi).toEqual(10);

    //         l = HALL.pickLengthRange(GWU.utils.UP, {
    //             length: ['7-10', '5-9'],
    //         });
    //         expect(l.lo).toEqual(5);
    //         expect(l.hi).toEqual(9);

    //         l = HALL.pickLengthRange(GWU.utils.RIGHT, {
    //             length: [[7, 10], '5-9'],
    //         });
    //         expect(l.lo).toEqual(7);
    //         expect(l.hi).toEqual(10);

    //         l = HALL.pickLengthRange(GWU.utils.LEFT, {
    //             length: [[5, 9], '7-10'],
    //         });
    //         expect(l.lo).toEqual(5);
    //         expect(l.hi).toEqual(9);
    //     });

    //     test('default', () => {
    //         let l: GWU.range.Range;

    //         l = HALL.pickLengthRange(GWU.utils.UP, {});
    //         expect(l.lo).toEqual(2);
    //         expect(l.hi).toEqual(9);

    //         l = HALL.pickLengthRange(GWU.utils.RIGHT, {});
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
        let site: SITE.Site;
        let room: Room;

        beforeEach(() => {
            room = new Room(20, 20, 10, 10);
            const tiles = new SITE.TileFactory();
            tiles.install('TEST');
            site = new SITE.Site(50, 50, { tiles });
            site._tiles.fillRect(20, 20, 10, 10, 1);
            // room.doors = [
            //     [-1, -1],
            //     [-1, -1],
            //     [-1, -1],
            //     [-1, -1],
            // ];
        });

        afterEach(() => {
            site.free();
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
            room.doors[GWU.xy.DOWN] = [25, 30];
            const digger = new HALL.HallDigger();
            const hall = digger.create(site, room.doors);

            // grid.dump();
            expect(hall).not.toBeNull();
            expect(hall!.x).toEqual(25);
            expect(hall!.y).toEqual(30);
            expect(hall!.height).toEqual(6);
            expect(hall!.width).toEqual(1);
            expect(hall!.doors).toEqual([undefined, undefined, [25, 36]]);
        });

        test('basic hall - up', () => {
            room.doors[GWU.xy.UP] = [25, 19];
            const digger = new HALL.HallDigger();
            const hall = digger.create(site, room.doors) as Hall;

            // grid.dump();
            expect(hall).not.toBeNull();
            expect(hall.x).toEqual(25);
            expect(hall.y).toEqual(14);
            expect(hall.height).toEqual(6);
            expect(hall.width).toEqual(1);
            expect(hall.doors).toEqual([[25, 13]]);
        });

        test('basic hall - left', () => {
            room.doors[GWU.xy.LEFT] = [19, 25];
            const digger = new HALL.HallDigger();
            const hall = digger.create(site, room.doors);

            // grid.dump();
            expect(hall).not.toBeNull();
            expect(hall!.x).toEqual(11);
            expect(hall!.y).toEqual(25);
            expect(hall!.height).toEqual(1);
            expect(hall!.width).toEqual(9);
            expect(hall!.doors).toEqual([
                undefined,
                undefined,
                undefined,
                [10, 25],
            ]);
        });

        test('basic hall - right', () => {
            room.doors[GWU.xy.RIGHT] = [30, 25];
            const digger = new HALL.HallDigger();
            const hall = digger.create(site, room.doors) as Hall;

            // grid.dump();
            expect(hall).not.toBeNull();
            expect(hall.x).toEqual(30);
            expect(hall.y).toEqual(25);
            expect(hall.height).toEqual(1);
            expect(hall.width).toEqual(9);
            expect(hall.doors).toEqual([undefined, [39, 25]]);
        });

        test('basic hall - down, width:2', () => {
            room.doors[GWU.xy.DOWN] = [25, 30];
            const digger = new HALL.HallDigger({ width: 2 });
            const hall = digger.create(site, room.doors);

            // grid.dump();
            expect(hall).not.toBeNull();
            expect(hall!.x).toEqual(24);
            expect(hall!.y).toEqual(30);
            expect(hall!.height).toEqual(6);
            expect(hall!.width).toEqual(2);
            expect(hall!.doors).toEqual([undefined, undefined, [25, 36]]);
        });

        test('basic hall - up, width:2', () => {
            room.doors[GWU.xy.UP] = [25, 19];
            const digger = new HALL.HallDigger({ width: 2 });
            const hall = digger.create(site, room.doors) as Hall;

            // grid.dump();
            expect(hall).not.toBeNull();
            expect(hall.x).toEqual(25);
            expect(hall.y).toEqual(14);
            expect(hall.height).toEqual(6);
            expect(hall.width).toEqual(2);
            expect(hall.doors).toEqual([[25, 13]]);
        });

        test('basic hall - left, width:2', () => {
            room.doors[GWU.xy.LEFT] = [19, 25];
            const digger = new HALL.HallDigger({ width: 2 });
            const hall = digger.create(site, room.doors) as Hall;

            // grid.dump();
            expect(hall).not.toBeNull();
            expect(hall.x).toEqual(11);
            expect(hall.y).toEqual(25);
            expect(hall.height).toEqual(2);
            expect(hall.width).toEqual(9);
            expect(hall.doors).toEqual([
                undefined,
                undefined,
                undefined,
                [10, 25],
            ]);

            expect(site._tiles.count(10)).toEqual(0);
        });

        test('basic hall - right, width:3', () => {
            room.doors[GWU.xy.RIGHT] = [30, 25];
            const digger = new HALL.HallDigger({ width: 3, tile: 'TEST' });
            const hall = digger.create(site, room.doors);

            // site._tiles.dump();

            expect(hall).not.toBeNull();
            expect(hall!.x).toEqual(30);
            expect(hall!.y).toEqual(24);
            expect(hall!.height).toEqual(3);
            expect(hall!.width).toEqual(9);
            expect(hall!.doors).toEqual([undefined, [39, 25]]);

            expect(
                site._tiles.count(site.tileFactory.tileId('TEST'))
            ).toBeGreaterThan(0);
        });
    });

    describe('tile', () => {
        let site: SITE.Site;
        let room: Room;

        beforeEach(() => {
            room = new Room(20, 20, 10, 10);
            const tiles = new SITE.TileFactory();
            tiles.install('TEST');
            site = new SITE.Site(50, 50, { tiles });
            site._tiles.fillRect(20, 20, 10, 10, 1);
            // room.doors = [
            //     [-1, -1],
            //     [-1, -1],
            //     [-1, -1],
            //     [-1, -1],
            // ];
        });

        afterEach(() => {
            site.free();
        });

        test('can set tile', () => {
            room.doors[GWU.xy.DOWN] = [25, 30];
            const digger = new HALL.HallDigger({ tile: 'TEST' });
            const hall = digger.create(site, room.doors);

            // site.dump();
            expect(hall).not.toBeNull();
            expect(hall!.x).toEqual(25);
            expect(hall!.y).toEqual(30);
            expect(hall!.height).toEqual(6);
            expect(hall!.width).toEqual(1);
            expect(hall!.doors).toEqual([undefined, undefined, [25, 36]]);

            expect(site._tiles[hall!.x][hall!.y]).toEqual(
                site.tileFactory.tileId('TEST')
            );
        });
    });
});
