import 'jest-extended';

// import * as GWU from 'gw-utils';
// import * as GWM from 'gw-map';
import * as GWD from '../..';

describe('Mixed Item Library', () => {
    beforeAll(() => {
        GWD.site.installTile('CARPET', {});

        GWD.site.installTile('STATUE_INERT', {
            extends: 'WALL',
            blocksVision: false,
        });

        // [ALTAR_CHAR,	altarForeColor,		pedestalBackColor,		17, 0,	0,				0,			0,				0,				CANDLE_LIGHT,	(T_OBSTRUCTS_SURFACE_EFFECTS), 0,																	"a stone pedestal",		"elaborate carvings wind around this ancient pedestal."],

        GWD.site.installTile('PEDESTAL', {
            priority: 83, // 100 - 17
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

        // Items

        GWD.site.installItem({
            id: 'SWORD',
            tags: 'WEAPON',
        });
        GWD.site.installItem({
            id: 'DAGGER',
            tags: 'WEAPON',
        });
        GWD.site.installItem({
            id: 'SPEAR',
            tags: 'WEAPON,THROWN',
        });
        GWD.site.installItem({
            id: 'LEATHER_ARMOR',
            tags: 'ARMOR',
        });
        GWD.site.installItem({
            id: 'CHAIN_ARMOR',
            tags: 'ARMOR',
        });
        GWD.site.installItem({
            id: 'STAFF_FIRE',
            tags: 'STAFF',
        });
        GWD.site.installItem({
            id: 'STAFF_TACO',
            tags: 'STAFF',
        });
        GWD.site.installItem({
            id: 'MENU',
            tags: 'SCROLL',
        });
        GWD.site.installItem({
            id: 'ORANGE_JUICE',
            tags: 'POTION',
        });
    });

    test('simple item', () => {
        const map = new GWD.site.Site(80, 34);

        const digger = new GWD.Digger({
            seed: 12345,
            rooms: { count: 20, first: 'ENTRANCE', digger: 'ROOM' },
            doors: { chance: 0 },
            loops: false,
            lakes: false,
        });
        digger.create(map);

        GWD.site.installItem({
            id: 'SHOVEL',
            tags: 'TOOL',
        });

        const blue = GWD.blueprint.install('ROOM', {
            flags: 'BP_ROOM',
            size: '10-100',
            steps: [{ item: 'TOOL', flags: 'BS_FAR_FROM_ORIGIN' }],
        });

        const builder = new GWD.blueprint.Builder();
        expect(builder.build(map, blue)).toBeTruthy();

        // map.dump();

        let count = 0;
        map.eachItem((i) => {
            ++count;
            const info = GWD.site.getItemInfo(i.id)!;
            expect(info.tags.includes('TOOL')).toBeTruthy();
        });
        expect(count).toEqual(1);
    });

    test('Good Item Room', () => {
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

        const vestibule = GWD.blueprint.install('DOOR', {
            size: '1',
            frequency: '1+',
            flags: 'BP_VESTIBULE',
            steps: [{ tile: 'DOOR', flags: 'BS_BUILD_AT_ORIGIN' }],
        });

        // // Guaranteed good permanent item on a glowing pedestal (runic weapon/armor or 2 staffs)
        // [[5, 16],           [10, 30],	30,		6,			0,                  (BP_ROOM | BP_PURGE_INTERIOR | BP_SURROUND_WITH_WALLS | BP_OPEN_INTERIOR | BP_IMPREGNABLE | BP_REWARD),	[
        // 	[0,			CARPET,		DUNGEON,		[0,0],		0,			0,			-1,			0,				0,				0,			0,			(MF_EVERYWHERE)],
        // [0,			STATUE_INERT,DUNGEON,		[2,3],		0,			0,			-1,			0,				2,				0,          0,          (MF_TREAT_AS_BLOCKING | MF_BUILD_IN_WALLS | MF_IMPREGNABLE)],
        // 	[0,			PEDESTAL,	DUNGEON,		[1,1],		1,			(WEAPON),	-1,			0,				2,				0,			ITEM_IDENTIFIED,(MF_GENERATE_ITEM | MF_ALTERNATIVE | MF_REQUIRE_GOOD_RUNIC | MF_NO_THROWING_WEAPONS | MF_TREAT_AS_BLOCKING)],
        // 	[0,			PEDESTAL,	DUNGEON,		[1,1],		1,			(ARMOR),	-1,			0,				2,				0,			ITEM_IDENTIFIED,(MF_GENERATE_ITEM | MF_ALTERNATIVE | MF_REQUIRE_GOOD_RUNIC | MF_TREAT_AS_BLOCKING)],
        // 	[0,			PEDESTAL,	DUNGEON,		[2,2],		2,			(STAFF),	-1,			0,				2,				0,			(ITEM_KIND_AUTO_ID | ITEM_MAX_CHARGES_KNOWN),	(MF_GENERATE_ITEM | MF_ALTERNATIVE | MF_TREAT_AS_BLOCKING)],
        // [0,			0,          0,              [1,1],		1,			0,          0,          0,				2,				0,			0,          (MF_BUILD_AT_ORIGIN | MF_PERMIT_BLOCKING | MF_BUILD_VESTIBULE)]]],

        const room = GWD.blueprint.install('GOOD_ITEM_ROOM', {
            size: '10-30',
            frequency: '5-16: 30',
            flags:
                'BP_ROOM | BP_PURGE_INTERIOR | BP_SURROUND_WITH_WALLS | BP_OPEN_INTERIOR | BP_IMPREGNABLE | BP_REWARD',
            steps: [
                { tile: 'CARPET', flags: 'BS_EVERYWHERE' },
                {
                    tile: 'STATUE_INERT',
                    count: '2-3',
                    flags: 'BS_BUILD_IN_WALLS | BS_TREAT_AS_BLOCKING',
                },
                {
                    tile: 'PEDESTAL',
                    item: {
                        tags: 'WEAPON & !THROWN',
                        make: { runic: true, cursed: false },
                    },
                    pad: 1,
                    flags:
                        'BS_TREAT_AS_BLOCKING, BS_ALTERNATIVE, BS_ITEM_IDENTIFIED',
                },
                {
                    tile: 'PEDESTAL',
                    item: {
                        tags: 'ARMOR & !THROWN',
                        make: { runic: true, cursed: false },
                    },
                    pad: 1,
                    flags:
                        'BS_TREAT_AS_BLOCKING, BS_ALTERNATIVE, BS_ITEM_IDENTIFIED',
                },
                {
                    tile: 'PEDESTAL',
                    item: {
                        tags: 'STAFF',
                        make: { runic: true, cursed: false },
                    },
                    pad: 1,
                    count: 2,
                    flags:
                        'BS_TREAT_AS_BLOCKING, BS_ALTERNATIVE, BS_ITEM_IDENTIFIED',
                },
                { flags: 'BS_BUILD_VESTIBULE' },
            ],
        });

        const builder = new GWD.blueprint.Builder({
            blueprints: [vestibule, room],
            // log: true,
        });
        builder.build(map, room, 63, 8);

        // map.dump();

        expect(
            map._tiles.count((c) => c === GWD.site.tileId('CARPET'))
        ).toBeGreaterThan(20); // carpet everywhere
        expect(map._tiles.count((c) => c === GWD.site.tileId('DOOR'))).toEqual(
            1
        ); // vestibule (door)
        expect(
            map._tiles.count((c) => c === GWD.site.tileId('STATUE_INERT'))
        ).toBeWithin(2, 4); // 2-3 statues

        expect(
            map._tiles.count(
                (_c, x, y) => map.isImpregnable(x, y) && map.isInMachine(x, y)
            )
        ).toBeWithin(30, 100); // extra for walls around

        // map.cells
        //     .map((c) => (c.hasCellFlag(GWM.flags.Cell.IMPREGNABLE) ? 1 : 0))
        //     .dump();

        let count = 0;
        map.eachItem((item) => {
            ++count;
            expect(item.make).not.toBeNull();
        });
        expect(count).toBeWithin(1, 3);
    });

    test('Specific Item', () => {
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

        const vestibule = GWD.blueprint.install('DOOR', {
            size: '1',
            frequency: '1+',
            flags: 'BP_VESTIBULE',
            steps: [{ tile: 'DOOR', flags: 'BS_BUILD_AT_ORIGIN' }],
        });

        // 	// Guaranteed good consumable item on glowing pedestals (scrolls of enchanting, potion of life)
        // [[10, AMULET_LEVEL],[10, 30],	30,		5,			0,                  (BP_ROOM | BP_PURGE_INTERIOR | BP_SURROUND_WITH_WALLS | BP_OPEN_INTERIOR | BP_IMPREGNABLE | BP_REWARD),	[
        // 	[0,			CARPET,		DUNGEON,		[0,0],		0,			0,			-1,			0,				0,				0,			0,			(MF_EVERYWHERE)],
        // [0,			STATUE_INERT,DUNGEON,		[1,3],		0,			0,			-1,			0,				2,				0,          0,          (MF_TREAT_AS_BLOCKING | MF_BUILD_IN_WALLS | MF_IMPREGNABLE)],
        // 	[0,			PEDESTAL,	DUNGEON,		[1,1],		1,			(SCROLL),	SCROLL_ENCHANTING, 0,       2,				0,			(ITEM_KIND_AUTO_ID),	(MF_GENERATE_ITEM | MF_ALTERNATIVE | MF_TREAT_AS_BLOCKING)],
        // [0,			PEDESTAL,	DUNGEON,		[1,1],		1,			(POTION),	POTION_LIFE,0,              2,				0,			(ITEM_KIND_AUTO_ID),	(MF_GENERATE_ITEM | MF_ALTERNATIVE | MF_TREAT_AS_BLOCKING)],
        // 	[0,			0,          0,              [1,1],		1,			0,          0,          0,				2,				0,			0,          (MF_BUILD_AT_ORIGIN | MF_PERMIT_BLOCKING | MF_BUILD_VESTIBULE)]]],

        const room = GWD.blueprint.install('SPECIFIC_ITEM_ROOM', {
            size: '10-30',
            frequency: '5-16: 30',
            flags:
                'BP_ROOM | BP_PURGE_INTERIOR | BP_SURROUND_WITH_WALLS | BP_OPEN_INTERIOR | BP_IMPREGNABLE | BP_REWARD',
            steps: [
                { tile: 'CARPET', flags: 'BS_EVERYWHERE' },
                {
                    tile: 'STATUE_INERT',
                    count: '1-3',
                    pad: 1,
                    flags: 'BS_BUILD_IN_WALLS | BS_TREAT_AS_BLOCKING',
                },
                {
                    tile: 'PEDESTAL',
                    item: {
                        id: 'MENU',
                    },
                    pad: 1,
                    flags:
                        'BS_TREAT_AS_BLOCKING, BS_ALTERNATIVE, BS_ITEM_IDENTIFIED',
                },
                {
                    tile: 'PEDESTAL',
                    item: {
                        id: 'ORANGE_JUICE',
                    },
                    pad: 1,
                    flags:
                        'BS_TREAT_AS_BLOCKING, BS_ALTERNATIVE, BS_ITEM_IDENTIFIED',
                },
                { flags: 'BS_BUILD_VESTIBULE' },
            ],
        });

        const builder = new GWD.blueprint.Builder({
            blueprints: [vestibule, room],
            // log: true,
        });
        builder.build(map, room, 63, 8);

        // map.dump();

        expect(
            map._tiles.count((c) => c === GWD.site.tileId('CARPET'))
        ).toBeGreaterThan(20); // carpet everywhere
        expect(map._tiles.count((c) => c === GWD.site.tileId('DOOR'))).toEqual(
            1
        ); // vestibule (door)
        expect(
            map._tiles.count((c) => c === GWD.site.tileId('STATUE_INERT'))
        ).toBeWithin(2, 4); // 2-3 statues

        expect(
            map._tiles.count(
                (_c, x, y) => map.isImpregnable(x, y) && map.isInMachine(x, y)
            )
        ).toBeWithin(30, 100); // extra for walls around

        // map.cells
        //     .map((c) => (c.hasCellFlag(GWM.flags.Cell.IMPREGNABLE) ? 1 : 0))
        //     .dump();

        let count = 0;
        map.eachItem((item) => {
            ++count;
            expect(item.id).toBeOneOf(['MENU', 'ORANGE_JUICE']);
        });
        expect(count).toBeWithin(1, 3);
    });
});
