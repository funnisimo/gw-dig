import * as MAP from 'gw-map';
import * as BUILD from './index';

describe('Blueprint', () => {
    test('install', () => {
        BUILD.blueprint.install(
            'A',
            new BUILD.blueprint.Blueprint({
                frequency: 50,
                tags: 'room',
            })
        );

        const a = BUILD.blueprint.blueprints.A;
        expect(a.getChance(1, 'room')).toEqual(50);
        expect(a.getChance(10, 'room')).toEqual(50);
        expect(a.getChance(10, 'room, town')).toEqual(0);
        expect(a.getChance(10)).toEqual(50);
    });

    test('Mixed Item Library', () => {
        // Mixed item library -- can check one item out at a time
        // [[1, 12],           [30, 50],	30,		6,			0,                  (BP_ROOM | BP_PURGE_INTERIOR | BP_SURROUND_WITH_WALLS | BP_OPEN_INTERIOR | BP_IMPREGNABLE | BP_REWARD),	[
        // 	[0,	CARPET,		DUNGEON,		[0,0],		0,			0,			-1,			0,				0,				0,			0,			(BF_EVERYWHERE)],
        // 	[0,	0,          0,              [1,1],		1,			0,          0,        0,				2,					0,			0,          (BF_BUILD_AT_ORIGIN | BF_PERMIT_BLOCKING | BF_BUILD_VESTIBULE)],
        // 	[0,	ALTAR_CAGE_OPEN,DUNGEON,	[1,1],		1,			(WEAPON|ARMOR|WAND|STAFF|RING|CHARM),-1,0,2,	0,			(ITEM_IS_KEY | ITEM_KIND_AUTO_ID | ITEM_PLAYER_AVOIDS),	(BF_GENERATE_ITEM | BF_NO_THROWING_WEAPONS | BF_TREAT_AS_BLOCKING | BF_IMPREGNABLE)],
        //  [0,	ALTAR_CAGE_OPEN,DUNGEON,	[3,3],		3,			(WEAPON|ARMOR|WAND),-1,	0,				2,					0,			(ITEM_IS_KEY | ITEM_KIND_AUTO_ID | ITEM_PLAYER_AVOIDS),	(BF_GENERATE_ITEM | BF_NO_THROWING_WEAPONS | BF_TREAT_AS_BLOCKING | BF_IMPREGNABLE)],
        // 	[0,	ALTAR_CAGE_OPEN,DUNGEON,	[2,3],		2,			(STAFF|RING|CHARM),-1,	0,				2,					0,			(ITEM_IS_KEY | ITEM_KIND_AUTO_ID | ITEM_MAX_CHARGES_KNOWN | ITEM_PLAYER_AVOIDS),	(BF_GENERATE_ITEM | BF_NO_THROWING_WEAPONS | BF_TREAT_AS_BLOCKING | BF_IMPREGNABLE)],
        //  [0,	STATUE_INERT,DUNGEON,		[2,3],		0,			0,			-1,			0,				2,				0,          0,          (BF_TREAT_AS_BLOCKING | BF_BUILD_IN_WALLS | BF_IMPREGNABLE)]]],

        MAP.tile.install('CARPET', { ch: '#', fg: 0xb36 });
        MAP.tile.install('ALTAR', { ch: 'T', fg: 0xf63 });
        MAP.tile.install('STATUE', { ch: '&', fg: 0x663 });

        BUILD.blueprint.install('MIXED_ITEM_LIBRARY', {
            frequency: '1-12: 30',
            size: '30-50',
            flags:
                'BP_ROOM | BP_REWARD | BP_PURGE_INTERIOR | BP_SURROUND_WITH_WALLS | BP_OPEN_INTERIOR | BP_IMPREGNABLE',
            steps: [
                { tile: 'CARPET', flags: 'BF_EVERYWHERE' },
                {
                    flags:
                        'BF_BUILD_AT_ORIGIN | BF_PERMIT_BLOCKING | BF_BUILD_VESTIBULE',
                },
                {
                    tile: 'ALTAR',
                    item: {
                        tags: 'WEAPON|ARMOR|WAND|STAFF|RING|CHARM',
                        forbidTags: 'THROWN',
                    },
                    pad: 2,
                    count: 1,
                    flags:
                        'BF_ITEM_IS_KEY | BF_ITEM_IDENTIFIED | BF_ITEM_PLAYER_AVOIDS | BF_TREAT_AS_BLOCKING | BF_IMPREGNABLE',
                },
                {
                    tile: 'ALTAR',
                    item: {
                        tags: 'WEAPON|ARMOR|WAND',
                        forbidTags: 'THROWN',
                    },
                    pad: 2,
                    count: 3,
                    flags:
                        'BF_ITEM_IS_KEY | BF_ITEM_IDENTIFIED | BF_ITEM_PLAYER_AVOIDS | BF_TREAT_AS_BLOCKING | BF_IMPREGNABLE',
                },
                {
                    tile: 'ALTAR',
                    item: { tags: 'STAFF|RING|CHARM' },
                    pad: 2,
                    count: '2-3',
                    flags:
                        'BF_ITEM_IS_KEY | BF_ITEM_IDENTIFIED | BF_ITEM_PLAYER_AVOIDS | BF_TREAT_AS_BLOCKING | BF_IMPREGNABLE',
                },
                {
                    tile: 'STATUE',
                    pad: 2,
                    flags:
                        'BF_TREAT_AS_BLOCKING | BF_BUILD_IN_WALLS | BF_IMPREGNABLE',
                },
            ],
        });

        const a = BUILD.blueprint.blueprints.MIXED_ITEM_LIBRARY;
        expect(a.getChance(1)).toEqual(30);
        expect(a.getChance(10)).toEqual(30);
        expect(a.getChance(15)).toEqual(0);
        expect(a.steps).toHaveLength(6);
    });
});
