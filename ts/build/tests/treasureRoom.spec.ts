import 'jest-extended';

// import * as GWU from 'gw-utils';
// import * as GWM from 'gw-map';
import * as GWD from '../../index';

describe('Mixed Item Library', () => {
    beforeAll(() => {
        GWD.site.installTile('CARPET', {
            ch: ';',
        });

        GWD.site.installTile('STATUE_INERT', {
            extends: 'WALL',
            ch: '&',
            blocksVision: false,
        });

        expect(GWD.site.getTile('STATUE_INERT')!.blocksVision).toBeFalsy(); // !L_BLOCKS_VISION!

        // [FOLIAGE_CHAR,	fungusForestLightColor,0,						45,	15,	DF_PLAIN_FIRE,	0,			DF_TRAMPLED_FUNGUS_FOREST, 0,	FUNGUS_FOREST_LIGHT,(T_OBSTRUCTS_VISION | T_IS_FLAMMABLE), (TM_STAND_IN_TILE | TM_VANISHES_UPON_PROMOTION | TM_PROMOTES_ON_STEP),"a luminescent fungal forest", "luminescent fungal growth fills the area, groping upward from the rich soil."],
        // [TRAMPLED_FOLIAGE_CHAR,fungusForestLightColor,0,				60,	15,	DF_PLAIN_FIRE,	0,			DF_FUNGUS_FOREST_REGROW, 100,	FUNGUS_LIGHT,	(T_IS_FLAMMABLE), (TM_VANISHES_UPON_PROMOTION),                                                     "trampled fungal foliage", "luminescent fungal growth fills the area, groping upward from the rich soil."],

        GWD.site.installTile('FUNGUS_FOREST', {
            ch: '%',
            priority: 55,
            blocksVision: true,
        });

        GWD.site.installTile('FUNGUS_FOREST_TRAMPLED', {
            extends: 'FUNGUS_FOREST',
            ch: '*',
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

        GWD.site.installItem('POTION_1', {
            tags: 'POTION',
        });

        GWD.site.installItem('POTION_2', {
            tags: 'POTION',
        });

        GWD.site.installItem('SCROLL_1', {
            tags: 'SCROLL',
        });

        GWD.site.installItem('SCROLL_2', {
            tags: 'SCROLL',
        });
    });

    test('Treasure Room', () => {
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
            flags: 'BP_ROOM | BP_PURGE_INTERIOR | BP_SURROUND_WITH_WALLS | BP_OPEN_INTERIOR | BP_IMPREGNABLE | BP_REWARD',
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
        map.eachItem(() => {
            ++count;
        });
        expect(count).toBeWithin(4, 8);
    });
});
