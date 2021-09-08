import 'jest-extended';

// import * as GWU from 'gw-utils';
import * as GWM from 'gw-map';
import * as GWD from '../..';

// // Mixed item library -- can check one item out at a time
// [[1, 12],           [30, 50],	30,		6,			0,                  (BP_ROOM | BP_PURGE_INTERIOR | BP_SURROUND_WITH_WALLS | BP_OPEN_INTERIOR | BP_IMPREGNABLE | BP_REWARD),	[
// 	[0,			CARPET,		DUNGEON,		[0,0],		0,			0,			-1,			0,				0,				0,			0,			(MF_EVERYWHERE)],
// 	[0,			0,          0,              [1,1],		1,			0,          0,        0,				2,					0,			0,          (MF_BUILD_AT_ORIGIN | MF_PERMIT_BLOCKING | MF_BUILD_VESTIBULE)],

// 	[0,			ALTAR_CAGE_OPEN,DUNGEON,	[1,1],		1,			(WEAPON|ARMOR|WAND|STAFF|RING|CHARM),-1,0,2,	0,			(ITEM_IS_KEY | ITEM_KIND_AUTO_ID | ITEM_PLAYER_AVOIDS),	(MF_GENERATE_ITEM | MF_NO_THROWING_WEAPONS | MF_TREAT_AS_BLOCKING | MF_IMPREGNABLE)],
// [0,			ALTAR_CAGE_OPEN,DUNGEON,	[3,3],		3,			(WEAPON|ARMOR|WAND),-1,	0,				2,					0,			(ITEM_IS_KEY | ITEM_KIND_AUTO_ID | ITEM_PLAYER_AVOIDS),	(MF_GENERATE_ITEM | MF_NO_THROWING_WEAPONS | MF_TREAT_AS_BLOCKING | MF_IMPREGNABLE)],
// 	[0,			ALTAR_CAGE_OPEN,DUNGEON,	[2,3],		2,			(STAFF|RING|CHARM),-1,	0,				2,					0,			(ITEM_IS_KEY | ITEM_KIND_AUTO_ID | ITEM_MAX_CHARGES_KNOWN | ITEM_PLAYER_AVOIDS),	(MF_GENERATE_ITEM | MF_NO_THROWING_WEAPONS | MF_TREAT_AS_BLOCKING | MF_IMPREGNABLE)],

// [0,			STATUE_INERT,DUNGEON,		[2,3],		0,			0,			-1,			0,				2,				0,          0,          (MF_TREAT_AS_BLOCKING | MF_BUILD_IN_WALLS | MF_IMPREGNABLE)]]],

describe('Mixed Item Library', () => {
    beforeAll(() => {
        GWM.tile.install('CARPET', {
            depth: 'SURFACE',
            ch: '%',
            fg: 'brown',
        });

        GWM.tile.install('STATUE_INERT', {
            extends: 'WALL',
            ch: '&',
            flags: '!T_BLOCKS_VISION',
        });

        GWD.room.install('ENTRANCE', new GWD.room.BrogueEntrance());
        GWD.room.install(
            'ROOM',
            new GWD.room.Rectangular({ width: '4-10', height: '4-10' })
        );
    });

    test('Mixed Item Libaray', async () => {
        const map = GWM.map.make(80, 34);
        map.properties.depth = 1;

        const digger = new GWD.Digger({
            seed: 12345,
            rooms: { count: 40, first: 'ENTRANCE', digger: 'ROOM' },
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

        const room = GWD.blueprint.install('MIXED_ITEM_LIBRARY', {
            size: '30-50',
            frequency: '1-12',
            flags:
                'BP_ROOM | BP_PURGE_INTERIOR | BP_SURROUND_WITH_WALLS | BP_OPEN_INTERIOR | BP_IMPREGNABLE | BP_REWARD',
            steps: [
                { tile: 'CARPET', flags: 'BS_EVERYWHERE' },
                { flags: 'BS_BUILD_VESTIBULE' }, // messes up data.interior?...

                {
                    tile: 'STATUE_INERT',
                    count: '2-3',
                    flags:
                        'BS_BUILD_IN_WALLS | BS_TREAT_AS_BLOCKING, BS_IMPREGNABLE',
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

        expect(room.frequency(1)).toEqual(100);

        const builder = new GWD.blueprint.Builder({
            blueprints: [vestibule, room],
            // log: true,
        });
        await builder.build(map, room);

        map.dump();

        expect(map.cells.count((c) => c.hasTile('CARPET'))).toBeGreaterThan(30); // carpet everywhere
        expect(map.cells.count((c) => c.hasTile('DOOR'))).toEqual(1); // vestibule (door)
        expect(map.cells.count((c) => c.hasTile('STATUE_INERT'))).toBeWithin(
            2,
            4
        ); // 2-3 statues
    });
});
