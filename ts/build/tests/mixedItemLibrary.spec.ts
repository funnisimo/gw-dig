import 'jest-extended';

// import * as GWU from 'gw-utils/index';
// import * as GWM from 'gw-map';
import * as GWD from '../../index';

describe('Mixed Item Library', () => {
    beforeAll(() => {
        GWD.site.installTile('CARPET', {});

        GWD.site.installTile('STATUE_INERT', {
            extends: 'WALL',
            blocksVision: false,
        });

        // [ALTAR_CHAR,	altarForeColor,		altarBackColor,		17, 0,	0,				0,			DF_ITEM_CAGE_CLOSE,	0,			CANDLE_LIGHT,	(T_OBSTRUCTS_SURFACE_EFFECTS), (TM_VANISHES_UPON_PROMOTION | TM_IS_WIRED | TM_PROMOTES_WITHOUT_KEY | TM_LIST_IN_SIDEBAR | TM_VISUALLY_DISTINCT),"a candle-lit altar",	"a cage, open on the bottom, hangs over this altar on a retractable chain."],
        // [WALL_CHAR,		altarBackColor,		veryDarkGray,			17, 0,	0,				0,			DF_ITEM_CAGE_OPEN,	0,			CANDLE_LIGHT,	(T_OBSTRUCTS_PASSABILITY | T_OBSTRUCTS_SURFACE_EFFECTS), (TM_STAND_IN_TILE | TM_VANISHES_UPON_PROMOTION | TM_PROMOTES_WITH_KEY | TM_IS_WIRED | TM_LIST_IN_SIDEBAR | TM_VISUALLY_DISTINCT),"an iron cage","the missing item must be replaced before you can access the remaining items."],

        GWD.site.installTile('ALTAR_CAGE_OPEN', {
            priority: 'WALL-1',
        });

        GWD.site.installTile('ALTAR_CAGE_CLOSED', {
            priority: 'WALL-1',
            blocksMove: true,
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

        GWD.site.installItem('SWORD', {
            tags: 'WEAPON',
        });

        GWD.site.installItem('DAGGER', {
            tags: 'WEAPON',
        });

        GWD.site.installItem('SPEAR', {
            tags: 'WEAPON,THROWN',
        });

        GWD.site.installItem('CHARM', {
            tags: 'CHARM',
        });
        GWD.site.installItem('RING', {
            tags: 'RING',
        });
    });

    test('Mixed Item Libaray', () => {
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

        // // Mixed item library -- can check one item out at a time
        // [[1, 12],           [30, 50],	30,		6,			0,                  (BP_ROOM | BP_PURGE_INTERIOR | BP_SURROUND_WITH_WALLS | BP_OPEN_INTERIOR | BP_IMPREGNABLE | BP_REWARD),	[
        // 	[0,			CARPET,		DUNGEON,		[0,0],		0,			0,			-1,			0,				0,				0,			0,			(MF_EVERYWHERE)],
        // 	[0,			0,          0,              [1,1],		1,			0,          0,        0,				2,					0,			0,          (MF_BUILD_AT_ORIGIN | MF_PERMIT_BLOCKING | MF_BUILD_VESTIBULE)],

        // 	[0,			ALTAR_CAGE_OPEN,DUNGEON,	[1,1],		1,			(WEAPON|ARMOR|WAND|STAFF|RING|CHARM),-1,0,2,	0,			(ITEM_IS_KEY | ITEM_KIND_AUTO_ID | ITEM_PLAYER_AVOIDS),	(MF_GENERATE_ITEM | MF_NO_THROWING_WEAPONS | MF_TREAT_AS_BLOCKING | MF_IMPREGNABLE)],
        //  [0,			ALTAR_CAGE_OPEN,DUNGEON,	[3,3],		3,			(WEAPON|ARMOR|WAND),-1,	0,				2,					0,			(ITEM_IS_KEY | ITEM_KIND_AUTO_ID | ITEM_PLAYER_AVOIDS),	(MF_GENERATE_ITEM | MF_NO_THROWING_WEAPONS | MF_TREAT_AS_BLOCKING | MF_IMPREGNABLE)],
        // 	[0,			ALTAR_CAGE_OPEN,DUNGEON,	[2,3],		2,			(STAFF|RING|CHARM),-1,	0,				2,					0,			(ITEM_IS_KEY | ITEM_KIND_AUTO_ID | ITEM_MAX_CHARGES_KNOWN | ITEM_PLAYER_AVOIDS),	(MF_GENERATE_ITEM | MF_NO_THROWING_WEAPONS | MF_TREAT_AS_BLOCKING | MF_IMPREGNABLE)],

        // [0,			STATUE_INERT,DUNGEON,		[2,3],		0,			0,			-1,			0,				2,				0,          0,          (MF_TREAT_AS_BLOCKING | MF_BUILD_IN_WALLS | MF_IMPREGNABLE)]]],

        const room = GWD.blueprint.install('MIXED_ITEM_LIBRARY', {
            size: '30-60', // did 60 to make it large enough to use on chosen room (to force openInterior into action)
            frequency: '1-12: 30',
            flags: 'BP_ROOM | BP_PURGE_INTERIOR | BP_SURROUND_WITH_WALLS | BP_OPEN_INTERIOR | BP_IMPREGNABLE | BP_REWARD',
            steps: [
                { tile: 'CARPET', flags: 'BS_EVERYWHERE' },
                { flags: 'BS_BUILD_VESTIBULE' },
                {
                    tile: 'ALTAR_CAGE_OPEN',
                    item: 'WEAPON & !THROWN |ARMOR|WAND|STAFF|RING|CHARM',
                    count: 1,
                    pad: 1, // pad is the radius of the circle around the tile (so 1 padding is all 8 tiles around the altar)
                    flags: 'BS_TREAT_AS_BLOCKING, BS_ITEM_IS_KEY',
                },
                {
                    tile: 'ALTAR_CAGE_OPEN',
                    item: 'WEAPON & !THROWN | ARMOR | WAND ',
                    count: 3,
                    pad: 1,
                    flags: 'BS_TREAT_AS_BLOCKING, BS_ITEM_IS_KEY',
                },
                {
                    tile: 'ALTAR_CAGE_OPEN',
                    item: 'STAFF|RING|CHARM',
                    count: '2-3',
                    pad: 1,
                    flags: 'BS_TREAT_AS_BLOCKING, BS_ITEM_IS_KEY',
                },
                {
                    tile: 'STATUE_INERT',
                    count: '2-3',
                    flags: 'BS_BUILD_IN_WALLS | BS_TREAT_AS_BLOCKING',
                },
            ],
        });

        expect(room.flags & GWD.blueprint.Flags.BP_ROOM).toBeTruthy();
        expect(room.flags & GWD.blueprint.Flags.BP_PURGE_INTERIOR).toBeTruthy();
        expect(
            room.flags & GWD.blueprint.Flags.BP_SURROUND_WITH_WALLS
        ).toBeTruthy();
        expect(room.flags & GWD.blueprint.Flags.BP_OPEN_INTERIOR).toBeTruthy();
        expect(room.flags & GWD.blueprint.Flags.BP_IMPREGNABLE).toBeTruthy();
        expect(room.flags & GWD.blueprint.Flags.BP_REWARD).toBeTruthy();

        expect(room.frequency(1)).toEqual(30);

        const builder = new GWD.blueprint.Builder({
            blueprints: [vestibule, room],
            // log: true,
        });
        builder.build(map, room, 68, 21);

        // map.dump();

        expect(
            map._tiles.count((c) => c === GWD.site.tileId('CARPET'))
        ).toBeGreaterThan(30); // carpet everywhere
        expect(map._tiles.count((c) => c === GWD.site.tileId('DOOR'))).toEqual(
            1
        ); // vestibule (door)
        expect(
            map._tiles.count((c) => c === GWD.site.tileId('STATUE_INERT'))
        ).toBeWithin(2, 4); // 2-3 statues
        expect(
            map._tiles.count((c) => c === GWD.site.tileId('ALTAR_CAGE_OPEN'))
        ).toBeWithin(6, 8);

        expect(
            map._tiles.count(
                (_c, x, y) => map.isImpregnable(x, y) && map.isInMachine(x, y)
            )
        ).toBeWithin(30, 100); // extra for walls around

        // map.cells
        //     .map((c) => (c.hasCellFlag(GWM.flags.Cell.IMPREGNABLE) ? 1 : 0))
        //     .dump();

        let count = 0;
        map.eachItem((i) => {
            ++count;
            expect(i.id).not.toEqual('SPEAR'); // !THROWN
            expect(i.key).toBeObject();
            expect(i.key!.x).toEqual(i.x);
            expect(i.key!.y).toEqual(i.y);
        });
        expect(count).toBeWithin(6, 8);
    });
});
