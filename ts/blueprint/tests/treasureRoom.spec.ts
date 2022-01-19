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

        expect(
            GWM.tile.tiles.STATUE_INERT.hasAllEntityFlags(
                GWM.flags.Entity.L_WALL_FLAGS
            )
        ).toBeFalsy(); // !L_BLOCKS_VISION!

        // [FOLIAGE_CHAR,	fungusForestLightColor,0,						45,	15,	DF_PLAIN_FIRE,	0,			DF_TRAMPLED_FUNGUS_FOREST, 0,	FUNGUS_FOREST_LIGHT,(T_OBSTRUCTS_VISION | T_IS_FLAMMABLE), (TM_STAND_IN_TILE | TM_VANISHES_UPON_PROMOTION | TM_PROMOTES_ON_STEP),"a luminescent fungal forest", "luminescent fungal growth fills the area, groping upward from the rich soil."],
        // [TRAMPLED_FOLIAGE_CHAR,fungusForestLightColor,0,				60,	15,	DF_PLAIN_FIRE,	0,			DF_FUNGUS_FOREST_REGROW, 100,	FUNGUS_LIGHT,	(T_IS_FLAMMABLE), (TM_VANISHES_UPON_PROMOTION),                                                     "trampled fungal foliage", "luminescent fungal growth fills the area, groping upward from the rich soil."],

        GWM.tile.install('FUNGUS_FOREST', {
            depth: 'SURFACE',
            ch: '%',
            fg: 'green',
            priority: 55,
            flags: 'L_BLOCKS_VISION, T_IS_FLAMMABLE, T_STAND_IN_TILE',
            effects: {
                enter: { tile: 'FUNGUS_FOREST_TRAMPLED' },
            },
        });

        GWM.tile.install('FUNGUS_FOREST_TRAMPLED', {
            extends: 'FUNGUS_FOREST',
            ch: '*',
            flags: '!L_BLOCKS_VISION',
            effects: {
                enter: null,
                tick: { chance: 100, tile: 'FUNGUS_FOREST' },
            },
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

        GWM.item.install('POTION_1', {
            tags: 'POTION',
            name: 'Potion of Happiness',
            ch: 'H',
            fg: 'yellow',
        });

        GWM.item.install('POTION_2', {
            tags: 'POTION',
            name: 'Potion of Wellness',
            ch: 'W',
            fg: 'yellow',
        });

        GWM.item.install('SCROLL_1', {
            tags: 'SCROLL',
            name: 'Recipe Scroll',
            ch: 'R',
            fg: 'yellow',
        });

        GWM.item.install('SCROLL_2', {
            tags: 'SCROLL',
            name: 'Todo List',
            ch: 'T',
            fg: 'yellow',
        });
    });

    test('Treasure Room', () => {
        const map = GWM.map.make(80, 34);
        map.data.depth = 1;

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

        // // Treasure room -- apothecary or archive (potions or scrolls)
        // [[8, AMULET_LEVEL],	[20, 40],	20,		6,			0,                  (BP_ROOM | BP_PURGE_INTERIOR | BP_SURROUND_WITH_WALLS | BP_OPEN_INTERIOR | BP_IMPREGNABLE | BP_REWARD),	[
        // 	[0,			CARPET,		DUNGEON,		[0,0],		0,			0,			-1,			0,				0,				0,			0,			(MF_EVERYWHERE)],
        // 	[0,			0,			0,				[5,7],		2,			(POTION),	-1,			0,				2,				0,			0,			(MF_GENERATE_ITEM | MF_ALTERNATIVE | MF_TREAT_AS_BLOCKING)],
        // 	[0,			0,			0,				[4,6],		2,			(SCROLL),	-1,			0,				2,				0,			0,			(MF_GENERATE_ITEM | MF_ALTERNATIVE | MF_TREAT_AS_BLOCKING)],
        // 	[0,			FUNGUS_FOREST,SURFACE,		[3,4],		0,			0,			-1,			0,				2,				0,			0,			0],
        // 	[0,			0,          0,              [1,1],		1,			0,          0,          0,				2,				0,			0,          (MF_BUILD_AT_ORIGIN | MF_PERMIT_BLOCKING | MF_BUILD_VESTIBULE)],
        // [0,			STATUE_INERT,DUNGEON,		[2,3],		0,			0,			-1,			0,				2,				0,          0,          (MF_TREAT_AS_BLOCKING | MF_BUILD_IN_WALLS | MF_IMPREGNABLE)]]],

        const room = GWD.blueprint.install('MIXED_ITEM_LIBRARY', {
            size: '20-40',
            frequency: '8-40: 20',
            flags:
                'BP_ROOM | BP_PURGE_INTERIOR | BP_SURROUND_WITH_WALLS | BP_OPEN_INTERIOR | BP_IMPREGNABLE | BP_REWARD',
            steps: [
                { tile: 'CARPET', flags: 'BS_EVERYWHERE' },
                {
                    item: 'POTION',
                    count: '5-7',
                    pad: 1,
                    flags: 'BS_TREAT_AS_BLOCKING, BS_ALTERNATIVE',
                },
                {
                    item: 'SCROLL',
                    count: '4-6',
                    pad: 1,
                    flags: 'BS_TREAT_AS_BLOCKING, BS_ALTERNATIVE',
                },
                { tile: 'FUNGUS_FOREST', count: '3-4', pad: 1 },
                { flags: 'BS_BUILD_VESTIBULE' },
                {
                    tile: 'STATUE_INERT',
                    count: '2-3',
                    flags: 'BS_BUILD_IN_WALLS | BS_TREAT_AS_BLOCKING',
                },
            ],
        });

        const builder = new GWD.blueprint.Builder({
            blueprints: [vestibule, room],
            // log: true,
        });
        builder.build(map, room, 63, 8);

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
        map.eachItem(() => {
            ++count;
        });
        expect(count).toBeWithin(4, 8);
    });
});
