import 'jest-extended';

// import * as GWU from 'gw-utils';
import * as GWM from 'gw-map';
import * as GWD from '../..';

describe('Mixed Item Library', () => {
    beforeAll(() => {
        GWM.tile.install('CARPET', {
            depth: 'SURFACE',
            ch: ';',
            fg: 'brown',
        });

        GWM.tile.install('STATUE_INERT', {
            extends: 'WALL',
            ch: '&',
            flags: '!L_BLOCKS_VISION',
        });

        // [ALTAR_CHAR,	altarForeColor,		pedestalBackColor,		17, 0,	0,				0,			0,				0,				CANDLE_LIGHT,	(T_OBSTRUCTS_SURFACE_EFFECTS), 0,																	"a stone pedestal",		"elaborate carvings wind around this ancient pedestal."],

        GWM.tile.install('PEDESTAL', {
            ch: 'T',
            fg: 'gray',
            priority: 83, // 100 - 17
            flags: 'L_BLOCKS_SURFACE',
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

        const items: GWM.item.ItemKind[] = [];

        items.push(
            GWM.item.install('SWORD', {
                tags: 'WEAPON',
                name: 'Sword',
                ch: 'S',
                fg: 'yellow',
            })
        );

        items.push(
            GWM.item.install('DAGGER', {
                tags: 'WEAPON',
                name: 'Dagger',
                ch: 'D',
                fg: 'yellow',
            })
        );

        items.push(
            GWM.item.install('SPEAR', {
                tags: 'WEAPON,THROWN',
                name: 'Spear',
                ch: 'P',
                fg: 'yellow',
            })
        );

        items.push(
            GWM.item.install('LEATHER_ARMOR', {
                tags: 'ARMOR',
                name: 'Leather Armor',
                ch: 'A',
                fg: 'yellow',
            })
        );

        items.push(
            GWM.item.install('CHAIN_ARMOR', {
                tags: 'ARMOR',
                name: 'Chainmail',
                ch: 'C',
                fg: 'yellow',
            })
        );

        items.push(
            GWM.item.install('STAFF_FIRE', {
                tags: 'STAFF',
                name: 'Staff of Fire',
                ch: 'F',
                fg: 'yellow',
            })
        );

        items.push(
            GWM.item.install('STAFF_TACO', {
                tags: 'STAFF',
                name: 'Staff of Tacos',
                ch: 'U',
                fg: 'yellow',
            })
        );

        items.push(
            GWM.item.install('MENU', {
                tags: 'SCROLL',
                name: 'Daily specials',
                ch: 'M',
                fg: 'yellow',
            })
        );

        items.push(
            GWM.item.install('ORANGE_JUICE', {
                tags: 'POTION',
                name: 'Orange Juice',
                ch: 'O',
                fg: 'yellow',
            })
        );
        items.forEach((kind) => {
            jest.spyOn(kind, 'make');
        });
    });

    test('Good Item Room', async () => {
        const map = GWM.map.make(80, 34);
        map.properties.depth = 1;

        const digger = new GWD.Digger({
            seed: 12345,
            rooms: { count: 40, first: 'ENTRANCE', digger: 'CHOICE' },
            doors: { chance: 0 },
            loops: false,
            lakes: false,
        });

        await digger.create(map);

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
        await builder.build(map, room, 63, 8);

        // map.dump();

        expect(map.cells.count((c) => c.hasTile('CARPET'))).toBeGreaterThan(20); // carpet everywhere
        expect(map.cells.count((c) => c.hasTile('DOOR'))).toEqual(1); // vestibule (door)
        expect(map.cells.count((c) => c.hasTile('STATUE_INERT'))).toBeWithin(
            2,
            4
        ); // 2-3 statues

        expect(
            map.cells.count(
                (c) =>
                    c.hasCellFlag(GWM.flags.Cell.IMPREGNABLE) && c.machineId > 0
            )
        ).toBeWithin(30, 100); // extra for walls around

        // map.cells
        //     .map((c) => (c.hasCellFlag(GWM.flags.Cell.IMPREGNABLE) ? 1 : 0))
        //     .dump();

        let count = 0;
        map.eachItem((item) => {
            ++count;
            expect(item.kind.make).toHaveBeenCalledWith(item, {
                runic: true,
                cursed: false,
            });
        });
        expect(count).toBeWithin(1, 3);
    });

    test('Specific Item', async () => {
        const map = GWM.map.make(80, 34);
        map.properties.depth = 1;

        const digger = new GWD.Digger({
            seed: 12345,
            rooms: { count: 40, first: 'ENTRANCE', digger: 'CHOICE' },
            doors: { chance: 0 },
            loops: false,
            lakes: false,
        });

        await digger.create(map);

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
        await builder.build(map, room, 63, 8);

        // map.dump();

        expect(map.cells.count((c) => c.hasTile('CARPET'))).toBeGreaterThan(20); // carpet everywhere
        expect(map.cells.count((c) => c.hasTile('DOOR'))).toEqual(1); // vestibule (door)
        expect(map.cells.count((c) => c.hasTile('STATUE_INERT'))).toBeWithin(
            2,
            4
        ); // 2-3 statues

        expect(
            map.cells.count(
                (c) =>
                    c.hasCellFlag(GWM.flags.Cell.IMPREGNABLE) && c.machineId > 0
            )
        ).toBeWithin(30, 100); // extra for walls around

        // map.cells
        //     .map((c) => (c.hasCellFlag(GWM.flags.Cell.IMPREGNABLE) ? 1 : 0))
        //     .dump();

        let count = 0;
        map.eachItem((item) => {
            ++count;
            expect(item.kind).toBeOneOf([
                GWM.item.kinds.MENU,
                GWM.item.kinds.ORANGE_JUICE,
            ]);
        });
        expect(count).toBeWithin(1, 3);
    });
});
