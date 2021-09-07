import * as GWM from 'gw-map';

import * as BLUE from './index';
import * as ROOM from '../room';
import { Level } from '../digger';

describe('Builder', () => {
    test('seeding map', async () => {
        const map = GWM.map.make(80, 34, { visible: true, seed: 23456 });
        expect(map.seed).toEqual(23456);

        const builder = new BLUE.Builder(map, { seed: 12345 });
        expect(map.seed).toEqual(23456);

        builder.data.reset(0, 0);
        expect(map.seed).toEqual(12345);
    });

    test.only('Build Vestiblue', async () => {
        const map = GWM.map.make(80, 34, { visible: true });
        GWM.tile.install('CARPET', { extends: 'FLOOR', ch: '%', fg: 0x800 });
        ROOM.install('ENTRANCE', new ROOM.BrogueEntrance());
        ROOM.install(
            'ROOM',
            new ROOM.Rectangular({ width: '4-10', height: '4-10' })
        );

        const level = new Level({
            seed: 12345,
            rooms: { count: 20, first: 'ENTRANCE', digger: 'ROOM' },
            doors: { chance: 0 },
            loops: false,
            lakes: false,
        });
        level.create(map);

        // GWM.map.analyze(map);

        BLUE.install('VESTIBULE', {
            flags: 'BP_VESTIBULE',
            size: [1, 1],
            steps: [
                {
                    tile: 'DOOR',
                    flags: 'BF_BUILD_AT_ORIGIN, BF_PERMIT_BLOCKING',
                },
            ],
        });

        const blue = BLUE.install('ROOM', {
            flags: 'BP_ROOM',
            size: '10-100',
            steps: [
                { tile: 'CARPET', flags: 'BF_EVERYWHERE' },
                { flags: 'BF_BUILD_AT_ORIGIN, BF_BUILD_VESTIBULE' },
            ],
        });

        const builder = new BLUE.Builder(map);

        const result = await builder.build(blue, 61, 8);

        // map.dump();

        expect(result).toBeTruthy();

        expect(map.hasTile(61, 8, 'DOOR')).toBeTruthy();

        expect(map.cell(61, 8).chokeCount).toEqual(45);
    });

    test('Vestibule with Wall Lever', async () => {
        // Portcullis (closed, dormant)
        // [WALL_CHAR,		gray,					floorBackColor,		10,	0,	DF_PLAIN_FIRE,	0,			DF_OPEN_PORTCULLIS,	0,			NO_LIGHT,		(T_OBSTRUCTS_PASSABILITY | T_OBSTRUCTS_ITEMS), (TM_STAND_IN_TILE | TM_VANISHES_UPON_PROMOTION | TM_IS_WIRED | TM_LIST_IN_SIDEBAR | TM_VISUALLY_DISTINCT | TM_CONNECTS_LEVEL), "a heavy portcullis",	"The iron bars rattle but will not budge; they are firmly locked in place."],
        // [FLOOR_CHAR,	floorForeColor,		floorBackColor,		95,	0,	DF_PLAIN_FIRE,	0,			DF_ACTIVATE_PORTCULLIS,0,		NO_LIGHT,		(0), (TM_VANISHES_UPON_PROMOTION | TM_IS_WIRED),                                                    "the ground",			""],

        // Effects - Portcullis (activate, open)
        // [PORTCULLIS_CLOSED,			DUNGEON,	0,		0,		DFF_EVACUATE_CREATURES_FIRST,	"with a heavy mechanical sound, an iron portcullis falls from the ceiling!", GENERIC_FLASH_LIGHT],
        // [PORTCULLIS_DORMANT,		DUNGEON,	0,		0,		0,  "the portcullis slowly rises from the ground into a slot in the ceiling.", GENERIC_FLASH_LIGHT],

        // Wall Lever
        // [LEVER_CHAR,	wallForeColor,			wallBackColor,			0,	0,	DF_PLAIN_FIRE,	0,			DF_PULL_LEVER,  0,				NO_LIGHT,		(T_OBSTRUCTS_EVERYTHING), (TM_STAND_IN_TILE | TM_VANISHES_UPON_PROMOTION | TM_IS_WIRED | TM_PROMOTES_ON_PLAYER_ENTRY | TM_LIST_IN_SIDEBAR | TM_VISUALLY_DISTINCT | TM_INVERT_WHEN_HIGHLIGHTED),"a lever", "The lever moves."],
        // [LEVER_PULLED_CHAR,wallForeColor,		wallBackColor,			0,	0,	DF_PLAIN_FIRE,	0,			0,				0,				NO_LIGHT,		(T_OBSTRUCTS_EVERYTHING), (TM_STAND_IN_TILE),                                                       "an inactive lever",    "The lever won't budge."],

        // Lever and either an exploding wall or a portcullis
        //   [[4, AMULET_LEVEL],	[1, 1],     8,		3,			0,                  (BP_VESTIBULE),	[
        //     [0,         WORM_TUNNEL_OUTER_WALL,DUNGEON,[1,1],	1,			0,			-1,			0,				1,				0,			0,			(MF_BUILD_AT_ORIGIN | MF_PERMIT_BLOCKING | MF_IMPREGNABLE | MF_ALTERNATIVE)],
        // [0,			PORTCULLIS_CLOSED,DUNGEON,  [1,1],      1,			0,			0,			0,				3,				0,			0,			(MF_BUILD_AT_ORIGIN | MF_PERMIT_BLOCKING | MF_IMPREGNABLE | MF_ALTERNATIVE)],
        // [0,			WALL_LEVER,DUNGEON,  [1,1],      1,			0,			-1,			0,				1,				0,			0,			(MF_BUILD_IN_WALLS | MF_IN_PASSABLE_VIEW_OF_ORIGIN | MF_BUILD_ANYWHERE_ON_LEVEL)]]],

        const map = GWM.map.make(80, 34, { visible: true });

        const portcullis = GWM.tile.install('PORTCULLIS_CLOSED', {
            extends: 'WALL',
            priority: '+1',
            ch: 'A',
            fg: 0x800,
            bg: GWM.tile.tiles.FLOOR.sprite.bg,
            flags:
                '!L_BLOCKS_VISION, !L_BLOCKS_GAS, L_LIST_IN_SIDEBAR, L_VISUALLY_DISTINCT, T_CONNECTS_LEVEL',
        });
        expect(portcullis.blocksVision()).toBeFalsy();
        expect(portcullis.blocksMove()).toBeTruthy();

        const wallLever = GWM.tile.install('WALL_LEVER', {
            extends: 'WALL',
            priority: '+10',
            fg: 0x800,
            ch: '\\',
            flags: 'L_LIST_IN_SIDEBAR, L_VISUALLY_DISTINCT',
        });
        expect(wallLever.blocksVision()).toBeTruthy();
        expect(wallLever.blocksMove()).toBeTruthy();

        ROOM.install('ENTRANCE', new ROOM.BrogueEntrance());
        ROOM.install(
            'ROOM',
            new ROOM.Rectangular({ width: '4-10', height: '4-10' })
        );

        const level = new Level({
            seed: 12345,
            rooms: { count: 20, first: 'ENTRANCE', digger: 'ROOM' },
            doors: { chance: 0 },
            loops: false,
            lakes: false,
        });
        level.create(map);

        GWM.map.analyze(map);

        BLUE.install('VESTIBULE', {
            flags: 'BP_VESTIBULE',
            size: [1, 1],
            steps: [
                {
                    tile: 'PORTCULLIS_CLOSED',
                    flags:
                        'BF_BUILD_AT_ORIGIN, BF_PERMIT_BLOCKING, BF_IMPREGNABLE',
                },
                {
                    tile: 'WALL_LEVER',
                    flags:
                        'BF_BUILD_IN_WALLS, BF_IN_PASSABLE_VIEW_OF_ORIGIN, BF_BUILD_ANYWHERE_ON_LEVEL',
                },
            ],
        });

        const blue = BLUE.install('ROOM', {
            flags: 'BP_ROOM',
            size: '10-100',
            steps: [
                {
                    flags:
                        'BF_BUILD_AT_ORIGIN, BF_BUILD_VESTIBULE, MF_PERMIT_BLOCKING',
                },
            ],
        });

        const builder = new BLUE.Builder(map);

        expect(await builder.build(blue)).toBeTruthy();

        // map.dump();

        expect(map.cells.count((c) => c.hasTile('PORTCULLIS_CLOSED'))).toEqual(
            1
        );
        expect(map.cells.count((c) => c.hasTile('WALL_LEVER'))).toEqual(1);
    });
});
