import 'jest-extended';

// import * as GWU from 'gw-utils';
// import * as GWM from 'gw-map';
import * as GWD from '../../index';

describe('Mixed Item Library', () => {
    beforeAll(() => {
        GWD.site.installTile('CARPET', {});

        GWD.site.installTile('STATUE_INERT', {
            blocksMove: true,
            blocksVision: false,
        });

        GWD.site.installTile('MANACLE_T', { tags: 'MANACLES' });
        GWD.site.installTile('MANACLE_R', { tags: 'MANACLES' });
        GWD.site.installTile('MANACLE_B', { tags: 'MANACLES' });
        GWD.site.installTile('MANACLE_L', { tags: 'MANACLES' });
        GWD.site.installTile('MANACLE_TR', { tags: 'MANACLES' });
        GWD.site.installTile('MANACLE_BR', { tags: 'MANACLES' });
        GWD.site.installTile('MANACLE_BL', { tags: 'MANACLES' });
        GWD.site.installTile('MANACLE_TL', { tags: 'MANACLES' });

        expect(GWD.site.getTile('STATUE_INERT').blocksVision).toBeFalsy(); // !L_BLOCKS_VISION!

        // [FOLIAGE_CHAR,	fungusForestLightColor,0,						45,	15,	DF_PLAIN_FIRE,	0,			DF_TRAMPLED_FUNGUS_FOREST, 0,	FUNGUS_FOREST_LIGHT,(T_OBSTRUCTS_VISION | T_IS_FLAMMABLE), (TM_STAND_IN_TILE | TM_VANISHES_UPON_PROMOTION | TM_PROMOTES_ON_STEP),"a luminescent fungal forest", "luminescent fungal growth fills the area, groping upward from the rich soil."],
        // [TRAMPLED_FOLIAGE_CHAR,fungusForestLightColor,0,				60,	15,	DF_PLAIN_FIRE,	0,			DF_FUNGUS_FOREST_REGROW, 100,	FUNGUS_LIGHT,	(T_IS_FLAMMABLE), (TM_VANISHES_UPON_PROMOTION),                                                     "trampled fungal foliage", "luminescent fungal growth fills the area, groping upward from the rich soil."],

        GWD.site.installTile('FUNGUS_FOREST', {
            blocksVision: true,
            priority: 55,
        });

        GWD.site.installTile('FUNGUS_FOREST_TRAMPLED', {
            extends: 'FUNGUS_FOREST',
            blocksVision: false,
        });

        GWD.room.install('ENTRANCE', new GWD.room.BrogueEntrance());
        GWD.room.install(
            'ROOM',
            new GWD.room.Rectangular({ width: '4-10', height: '4-10' })
        );
        GWD.room.install('CHUNK', new GWD.room.ChunkyRoom());
        GWD.room.install(
            'CHOICE',
            new GWD.room.ChoiceRoom({ choices: { ROOM: 100, CHUNK: 50 } })
        );

        GWD.site.installHorde({
            id: 'TROUPE',
            leader: 'ACTOR',
            tags: 'ENTERTAINER',
            members: { ACTOR: '2-4' },
        });

        GWD.site.installHorde({
            id: 'HANIBAL',
            leader: 'ACTOR',
            tags: 'CAPTIVE',
        });
    });

    test('Single Horde Room', () => {
        const map = new GWD.site.Site(80, 34);
        map.depth = 1;

        const digger = new GWD.Digger({
            seed: 12345,
            rooms: { count: 40, first: 'ENTRANCE', digger: 'CHOICE' },
            doors: { chance: 0 },
            loops: false,
            lakes: false,
        });

        digger.create(map);

        // map.dump();
        map.analyze();
        expect(map.getChokeCount(63, 8)).toBeLessThan(30);

        const room = GWD.blueprint.install('SIMPLE_HORDE', {
            size: '20-40',
            frequency: '8-40: 20',
            flags: 'BP_ROOM',
            steps: [{ horde: 'ENTERTAINER' }],
        });

        const builder = new GWD.blueprint.Builder({
            // blueprints: [room],
            // log: true,
        });
        builder.build(map, room, 63, 8);

        // map.dump();

        let count = 0;
        map.eachActor((a) => {
            ++count;
            expect(a.id).toEqual('ACTOR');
        });
        expect(count).toEqual(5);
    });

    // function addManacle(
    //     map: GWD.site.Site,
    //     x: number,
    //     y: number,
    //     dirIndex: number
    // ) {
    //     const manacles = [
    //         'MANACLE_T',
    //         'MANACLE_R',
    //         'MANACLE_B',
    //         'MANACLE_L',
    //         'MANACLE_TR',
    //         'MANACLE_BR',
    //         'MANACLE_BL',
    //         'MANACLE_TL',
    //     ];
    //     const dir = GWU.xy.DIRS[dirIndex];
    //     let newX = x + dir[0];
    //     let newY = y + dir[1];
    //     if (
    //         map.hasXY(newX, newY) &&
    //         map.isFloor(newX, newY) &&
    //         !map.isDeep(newX, newY)
    //     ) {
    //         map.setTile(x + dir[0], y + dir[1], manacles[dirIndex]);
    //         return true;
    //     }
    //     return false;
    // }

    // function captiveAlly(map: GWD.site.Site, x: number, y: number) {
    //     if (!map.hasActor(x, y)) {
    //         return false;
    //     }

    //     const fallback = [
    //         [GWU.xy.LEFT_UP, GWU.xy.UP, GWU.xy.LEFT],
    //         [GWU.xy.LEFT_DOWN, GWU.xy.DOWN, GWU.xy.LEFT],
    //         [GWU.xy.RIGHT_UP, GWU.xy.UP, GWU.xy.RIGHT],
    //         [GWU.xy.RIGHT_DOWN, GWU.xy.DOWN, GWU.xy.RIGHT],
    //     ];
    //     let didSomething = false;
    //     let i: number, j: number;
    //     for (i = 0; i < 4; i++) {
    //         for (j = 0; j < 3; j++) {
    //             const dirIndex = fallback[i][j];
    //             if (addManacle(map, x, y, dirIndex)) {
    //                 didSomething = true;
    //                 break; // leave j loop
    //             }
    //         }
    //     }

    //     // TODO - Make the actor a captive ally

    //     return didSomething;
    // }

    test('horde with effect', () => {
        const map = new GWD.site.Site(80, 34);
        map.depth = 1;

        const digger = new GWD.Digger({
            seed: 12345,
            rooms: { count: 40, first: 'ENTRANCE', digger: 'CHOICE' },
            doors: { chance: 0 },
            loops: false,
            lakes: false,
        });

        digger.create(map);

        const featureFn = jest.fn().mockReturnValue(true);

        const room = GWD.blueprint.install('HORDE_WITH_EFFECT', {
            size: '20-40',
            frequency: '8-40: 20',
            flags: 'BP_ROOM',
            steps: [{ horde: { tags: 'CAPTIVE', feature: featureFn } }],
        });

        const builder = new GWD.blueprint.Builder({
            // blueprints: [room],
            // log: true,
        });
        builder.build(map, room, 63, 8);

        // map.dump();

        let count = 0;
        map.eachActor((a) => {
            ++count;
            expect(a.id).toEqual('ACTOR');
        });
        expect(count).toEqual(1);

        expect(featureFn).toHaveBeenCalledWith(map, 63, 6);
    });

    test('horde adopts item', () => {
        GWD.site.installHorde({
            leader: 'KING',
            tags: 'BOSS',
            members: { JESTER: '2-4' },
        });

        GWD.site.installTile('CAGE', {
            priority: 'WALL-1',
            blocksMove: true,
        });

        GWD.site.installTile('CAGE_OPEN', { priority: 'FLOOR' });

        GWD.site.installItem({ id: 'KEY', tags: 'KEY' });

        const map = new GWD.site.Site(80, 34);
        map.depth = 1;

        const digger = new GWD.Digger({
            seed: 12345,
            rooms: { count: 40, first: 'ENTRANCE', digger: 'CHOICE' },
            doors: { chance: 0 },
            loops: false,
            lakes: false,
        });

        digger.create(map);

        // Build room with CAGE, KEY (KEY is KEY, OUTSOURCE ITEM)
        const keyRoom = GWD.blueprint.install('KEY_ROOM', {
            size: '20-40',
            frequency: '1-40: 20',
            flags: 'BP_ROOM',
            steps: [
                {
                    tile: 'CAGE',
                    item: 'KEY',
                    flags: 'BS_OUTSOURCE_ITEM_TO_MACHINE, BS_ITEM_IS_KEY',
                },
            ],
        });

        // Build room with HORDE (HORDE_TAKES_ITEM)
        const monstRoom = GWD.blueprint.install('MONST_ROOM', {
            size: '20-40',
            frequency: '1-40: 20',
            flags: 'BP_ROOM, BP_ADOPT_ITEM',
            steps: [{ horde: 'BOSS', flags: 'BS_HORDE_TAKES_ITEM' }],
        });

        const builder = new GWD.blueprint.Builder({
            blueprints: [keyRoom, monstRoom],
            // log: true,
        });
        const result = builder.build(map, keyRoom, 63, 8);

        // map.dump();

        expect(result).toBeTruthy();

        let kingCount = 0;
        map.eachActor((a) => {
            if (a.id === 'KING') {
                ++kingCount;
                expect(a.item).not.toBeNull();
                const item = a.item!;
                expect(item.key).not.toBeNull();
            }
        });
        expect(kingCount).toEqual(1);
    });
});
