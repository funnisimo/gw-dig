import 'jest-extended';
import * as UTILS from '../test/utils';
import * as GW from 'gw-utils';
import * as Dig from './dig';

describe('Dig', () => {
    let map: GW.grid.NumGrid;

    beforeAll(() => {
        Dig.install('ROOM', Dig.rectangularRoom, {
            width: 20,
            height: 10,
        });
        Dig.install('CROSS', Dig.crossRoom, {
            width: 12,
            height: 7,
        });
        Dig.install('SYMMETRICAL_CROSS', Dig.symmetricalCrossRoom, {
            width: 8,
            height: 5,
        });
        Dig.install('SMALL_ROOM', Dig.rectangularRoom, {
            width: 6,
            height: 4,
        });
        Dig.install('LARGE_ROOM', Dig.rectangularRoom, {
            width: 40,
            height: 20,
        });
        Dig.install('HUGE_ROOM', Dig.rectangularRoom, {
            width: 76,
            height: 28,
        });
        Dig.install('SMALL_CIRCLE', Dig.circularRoom, {
            width: 6,
            height: 6,
        });
        Dig.install('LARGE_CIRCLE', Dig.circularRoom, {
            width: 10,
            height: 10,
        });
        Dig.install('BROGUE_DONUT', Dig.brogueDonut, {
            width: 10,
            height: 10,
            ringMinWidth: 3,
            holeMinSize: 3,
            holeChance: 50,
        });
        Dig.install('COMPACT_CAVE', Dig.cavern, {
            width: 12,
            height: 8,
        });
        Dig.install('LARGE_NS_CAVE', Dig.cavern, {
            width: 12,
            height: 27,
        });
        Dig.install('LARGE_EW_CAVE', Dig.cavern, {
            width: 27,
            height: 8,
        });
        Dig.install('BROGUE_CAVE', Dig.choiceRoom, {
            choices: ['COMPACT_CAVE', 'LARGE_NS_CAVE', 'LARGE_EW_CAVE'],
        });
        Dig.install('HUGE_CAVE', Dig.cavern, {
            width: 77,
            height: 27,
        });
        Dig.install('BROGUE_ENTRANCE', Dig.entranceRoom, {
            width: 20,
            height: 10,
        });
        Dig.install('CHUNKY', Dig.chunkyRoom, {
            width: 10,
            height: 10,
        });

        Dig.install('PROFILE', Dig.choiceRoom, {
            choices: {
                ROOM: 10,
                CROSS: 20,
                SYMMETRICAL_CROSS: 20,
                LARGE_ROOM: 5,
                SMALL_CIRCLE: 10,
                LARGE_CIRCLE: 5,
                BROGUE_DONUT: 5,
                CHUNKY: 10,
            },
        });

        Dig.install('FIRST_ROOM', Dig.choiceRoom, {
            choices: {
                ROOM: 5,
                CROSS: 5,
                SYMMETRICAL_CROSS: 5,
                LARGE_ROOM: 5,
                HUGE_ROOM: 5,
                LARGE_CIRCLE: 5,
                BROGUE_DONUT: 5,
                BROGUE_CAVE: 30, // These are harder to match
                HUGE_CAVE: 30, // ...
                BROGUE_ENTRANCE: 5,
                CHUNKY: 5,
            },
        });
    });

    beforeEach(() => {
        UTILS.mockRandom();
        GW.random.seed(12345);
        map = GW.grid.alloc(80, 30);
    });

    afterEach(() => {
        GW.grid.free(map);
        jest.restoreAllMocks();
    });

    function tileAt(x: number, y: number) {
        return map.get(x, y);
    }

    test('dig on empty map', () => {
        Dig.start(map);

        const room = Dig.dig(map, { digger: 'ROOM', tries: 20 });

        // map.dump();

        expect(room!.doors).toBeArray();

        Dig.finish(map);

        expect(map.count(Dig.FLOOR)).toBeGreaterThan(0);
    });

    test('can randomly attach rooms', () => {
        Dig.start(map);

        let locs: boolean | GW.utils.Loc[] = [[38, 28]];
        let roomCount = 4;

        let room = Dig.dig(map, { digger: 'ROOM', locs, tries: 20 });
        if (!room) {
            fail('Failed on first room!');
        }

        for (let i = 0; i < roomCount; ++i) {
            room = Dig.dig(map, { digger: 'ROOM', tries: 20 });
            if (!room) {
                fail('Failed to dig map on room #' + (i + 1));
            }
        }

        // map.dump();

        expect(room!.doors).toEqual([
            [14, 6],
            [22, 10], // [-1, -1],
            [18, 12],
            [11, 8],
        ]);
        expect(tileAt(38, 28)).toEqual(Dig.DOOR); // starting door

        map.forRect(38, 22, 19, 6, (_c, i, j) =>
            expect(tileAt(i, j)).toEqual(Dig.FLOOR)
        );

        expect(tileAt(37, 22)).toEqual(Dig.DOOR);
        expect(tileAt(33, 18)).toEqual(Dig.DOOR);
        expect(tileAt(18, 12)).toEqual(Dig.DOOR);
        expect(tileAt(30, 12)).toEqual(Dig.DOOR);
    });

    test('can chain five rooms', () => {
        Dig.start(map);

        let locs: boolean | GW.utils.Loc[] = [[38, 28]];
        let roomCount = 5;
        let room: Dig.Room | null;

        for (let i = 0; i < roomCount; ++i) {
            room = Dig.dig(map, {
                digger: 'ROOM',
                locs,
                tries: 20,
                tile: Dig.FLOOR,
            });
            expect(room).toBeObject();
            locs = room!.doors;
        }

        // map.dump();

        expect(room!.doors).toEqual([
            [14, 3],
            [29, 7],
            [25, 9],
            [11, 8],
        ]);
        expect(tileAt(38, 28)).toEqual(Dig.DOOR);

        map.forRect(38, 22, 19, 6, (_c, i, j) =>
            expect(tileAt(i, j)).toEqual(Dig.FLOOR)
        );

        expect(tileAt(37, 23)).toEqual(Dig.DOOR);
        expect(tileAt(34, 19)).toEqual(Dig.DOOR);
        expect(tileAt(27, 15)).toEqual(Dig.DOOR);
        expect(tileAt(25, 9)).toEqual(Dig.DOOR);
    });

    // test('adds loops', () => {
    //     Dig.start(map);

    //     let locs: boolean | GW.utils.Loc[] = [[38, 28]];
    //     let roomCount = 15;

    //     for (let i = 0; i < roomCount; ++i) {
    //         const ok = Dig.dig(map, {
    //             digger: 'ROOM',
    //             locs,
    //             tile: Dig.FLOOR,
    //             width: 14,
    //             height: 10,
    //         });
    //         if (!ok) {
    //             fail('Failed to dig map on room #' + (i + 1));
    //         }
    //         locs = null;
    //     }

    //     // map.dump();

    //     expect(tileAt(24, 7)).toEqual(0);
    //     expect(tileAt(65, 18)).toEqual(0);

    //     Dig.addLoops(20, 5);

    //     // map.dump();

    //     expect(tileAt(24, 7)).toEqual(Dig.DOOR); // added door
    //     expect(tileAt(65, 18)).toEqual(Dig.DOOR); // added door
    // });

    // test('can add a lake and bridges', () => {
    //     Dig.start(map);

    //     map.fill(Dig.FLOOR);

    //     Dig.digLake();
    //     Dig.digLake();

    //     Dig.addBridges(20, 10);

    //     // map.dump();

    //     expect(tileAt(15, 15)).toEqual('LAKE');
    //     expect(surfaceAt(20, 21)).toEqual('BRIDGE');
    // });

    // test('Use this to visualize maps built in dungeon example', () => {
    //     GW.random.seed(1297684405);

    //     // Dig.log = console.log;

    //     const startingXY = [39, 28];

    //     map.fill(0);
    //     Dig.start(map);

    //     let loc = [startingXY[0], startingXY[1]];
    //     let roomCount = 0;

    //     Dig.dig(map, {
    //         digger: 'FIRST_ROOM',
    //         loc,
    //         tries: 20,
    //         placeDoor: false,
    //     });

    //     let fails = 0;
    //     while (fails < 20) {
    //         if (
    //             !Dig.dig(map, {
    //                 digger: 'PROFILE',
    //                 tries: 1,
    //                 hallChance: 10,
    //             })
    //         ) {
    //             ++fails;
    //         }
    //     }

    //     Dig.addLoops(20, 5);

    //     let lakeCount = GW.random.number(5);
    //     for (let i = 0; i < lakeCount; ++i) {
    //         Dig.digLake();
    //     }

    //     Dig.addBridges(40, 8);

    //     if (!Dig.addStairs({ up: startingXY })) {
    //         console.error('Failed to place stairs.');
    //     }

    //     Dig.finish(map);

    //     // map.dump();

    //     // expect(tileAt(31, 7)).toEqual(3);  // BRIDGE
    //     // expect(tileAt(32, 7)).not.toEqual(3);  // BRIDGE
    // });
});
