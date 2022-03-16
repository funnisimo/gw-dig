// import * as GWM from 'gw-map';

import * as BLUE from './index';
import * as ROOM from '../room';
import { Digger } from '../digger';
import * as SITE from '../site';

describe('Builder', () => {
    test.only('Build Vestiblue', () => {
        const map = new SITE.Site(80, 34);
        SITE.installTile('CARPET');

        ROOM.install('ENTRANCE', new ROOM.BrogueEntrance());
        ROOM.install(
            'ROOM',
            new ROOM.Rectangular({ width: '4-10', height: '4-10' })
        );

        const digger = new Digger({
            seed: 12345,
            rooms: { count: 20, first: 'ENTRANCE', digger: 'ROOM' },
            doors: { chance: 0 },
            loops: false,
            lakes: false,
        });
        digger.create(map);

        // GWM.map.analyze(map);

        BLUE.install('VESTIBULE', {
            flags: 'BP_VESTIBULE',
            size: [1, 1],
            steps: [
                {
                    tile: 'DOOR',
                    flags: 'BS_BUILD_AT_ORIGIN, BS_PERMIT_BLOCKING',
                },
            ],
        });

        const blue = BLUE.install('ROOM', {
            flags: 'BP_ROOM',
            size: '10-100',
            steps: [
                { tile: 'CARPET', flags: 'BS_EVERYWHERE' },
                { flags: 'BS_BUILD_AT_ORIGIN, BS_BUILD_VESTIBULE' },
            ],
        });

        const builder = new BLUE.Builder();

        const result = builder.build(map, blue, 61, 8);

        // map.dump();

        expect(result).toBeTruthy();
        expect(map.hasTile(61, 8, 'DOOR')).toBeTruthy();
        expect(map.getChokeCount(61, 8)).toEqual(45);
    });

    test('Vestibule with Wall Lever', () => {
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

        const map = new SITE.Site(80, 34);

        const portcullis = SITE.installTile('PORTCULLIS_CLOSED', {
            blocksMove: true,
            connectsLevel: true,
        });
        // expect(portcullis.blocksVision).toBeFalsy();
        expect(portcullis.blocksMove).toBeTruthy();

        const wallLever = SITE.installTile('WALL_LEVER', {
            blocksMove: true,
        });
        // expect(wallLever.blocksVision()).toBeTruthy();
        expect(wallLever.blocksMove).toBeTruthy();

        ROOM.install('ENTRANCE', new ROOM.BrogueEntrance());
        ROOM.install(
            'ROOM',
            new ROOM.Rectangular({ width: '4-10', height: '4-10' })
        );

        const digger = new Digger({
            seed: 12345,
            rooms: { count: 20, first: 'ENTRANCE', digger: 'ROOM' },
            doors: { chance: 0 },
            loops: false,
            lakes: false,
        });
        digger.create(map);

        map.analyze();

        BLUE.install('VESTIBULE', {
            flags: 'BP_VESTIBULE',
            size: [1, 1],
            steps: [
                {
                    tile: 'PORTCULLIS_CLOSED',
                    flags:
                        'BS_BUILD_AT_ORIGIN, BS_PERMIT_BLOCKING, BS_IMPREGNABLE',
                },
                {
                    tile: 'WALL_LEVER',
                    flags:
                        'BS_BUILD_IN_WALLS, BS_IN_PASSABLE_VIEW_OF_ORIGIN, BS_BUILD_ANYWHERE_ON_LEVEL',
                },
            ],
        });

        const blue = BLUE.install('ROOM', {
            flags: 'BP_ROOM',
            size: '10-100',
            steps: [
                {
                    flags:
                        'BS_BUILD_AT_ORIGIN, BS_BUILD_VESTIBULE, MF_PERMIT_BLOCKING',
                },
            ],
        });

        const builder = new BLUE.Builder();

        expect(builder.build(map, blue)).toBeTruthy();

        // map.dump();

        expect(
            map._tiles.count((c) => c === SITE.tileId('PORTCULLIS_CLOSED'))
        ).toEqual(1);
        expect(
            map._tiles.count((c) => c === SITE.tileId('WALL_LEVER'))
        ).toEqual(1);
    });
});