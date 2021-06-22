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
        // 	[0,	CARPET,		DUNGEON,		[0,0],		0,			0,			-1,			0,				0,				0,			0,			(MF_EVERYWHERE)],
        // 	[0,	0,          0,              [1,1],		1,			0,          0,        0,				2,					0,			0,          (MF_BUILD_AT_ORIGIN | MF_PERMIT_BLOCKING | MF_BUILD_VESTIBULE)],
        // 	[0,	ALTAR_CAGE_OPEN,DUNGEON,	[1,1],		1,			(WEAPON|ARMOR|WAND|STAFF|RING|CHARM),-1,0,2,	0,			(ITEM_IS_KEY | ITEM_KIND_AUTO_ID | ITEM_PLAYER_AVOIDS),	(MF_GENERATE_ITEM | MF_NO_THROWING_WEAPONS | MF_TREAT_AS_BLOCKING | MF_IMPREGNABLE)],
        //  [0,	ALTAR_CAGE_OPEN,DUNGEON,	[3,3],		3,			(WEAPON|ARMOR|WAND),-1,	0,				2,					0,			(ITEM_IS_KEY | ITEM_KIND_AUTO_ID | ITEM_PLAYER_AVOIDS),	(MF_GENERATE_ITEM | MF_NO_THROWING_WEAPONS | MF_TREAT_AS_BLOCKING | MF_IMPREGNABLE)],
        // 	[0,	ALTAR_CAGE_OPEN,DUNGEON,	[2,3],		2,			(STAFF|RING|CHARM),-1,	0,				2,					0,			(ITEM_IS_KEY | ITEM_KIND_AUTO_ID | ITEM_MAX_CHARGES_KNOWN | ITEM_PLAYER_AVOIDS),	(MF_GENERATE_ITEM | MF_NO_THROWING_WEAPONS | MF_TREAT_AS_BLOCKING | MF_IMPREGNABLE)],
        //  [0,	STATUE_INERT,DUNGEON,		[2,3],		0,			0,			-1,			0,				2,				0,          0,          (MF_TREAT_AS_BLOCKING | MF_BUILD_IN_WALLS | MF_IMPREGNABLE)]]],

        BUILD.blueprint.install(
            'MIXED_ITEM_LIBRARY',
            new BUILD.blueprint.Blueprint({
                frequency: '1-12: 30',
                size: '30-50',
                flags:
                    'BP_ROOM | BP_REWARD | BP_PURGE_INTERIOR | BP_SURROUND_WITH_WALLS | BP_OPEN_INTERIOR | BP_IMPREGNABLE',
            })
        );

        const a = BUILD.blueprint.blueprints.A;
        expect(a.getChance(1, 'room')).toEqual(50);
        expect(a.getChance(10, 'room')).toEqual(50);
        expect(a.getChance(10, 'room, town')).toEqual(0);
        expect(a.getChance(10)).toEqual(50);
    });
});
