import * as GW from 'gw-utils';
import * as BLUE from './index';
import * as DIG from '../index';

// function dumpSite(site: BUILD.MapSite) {
//     site.dump((c) => {
//         const tile = c.highestPriorityTile();
//         return tile.sprite.ch || '?';
//     });
// }

describe('Blueprint', () => {
    test('install', () => {
        BLUE.install(
            'A',
            new BLUE.Blueprint({
                frequency: 50,
                tags: 'room',
            })
        );

        const a = BLUE.blueprints.A;
        expect(a.getChance(1, 'room')).toEqual(50);
        expect(a.getChance(10, 'room')).toEqual(50);
        expect(a.getChance(10, 'room, town')).toEqual(0);
        expect(a.getChance(10)).toEqual(50);
    });

    test('random', () => {
        const sd = BLUE.install('SECRET_DOOR', {
            frequency: 10,
            flags: 'BP_VESTIBULE',
            steps: [{ tile: 'DOOR', flags: 'BF_BUILD_AT_ORIGIN' }],
        });

        const rm = BLUE.install('WET_ROOM', {
            frequency: 10,
            size: '10-20',
            flags: 'BP_ROOM',
            steps: [
                { tile: 'SHALLOW', flags: 'BF_EVERYWHERE' },
                {
                    flags:
                        'BF_BUILD_AT_ORIGIN, BF_BUILD_VESTIBULE, BF_PERMIT_BLOCKING',
                },
            ],
        });

        expect(BLUE.random(BLUE.Flags.BP_VESTIBULE, 1)).toBe(sd);
        expect(BLUE.random(BLUE.Flags.BP_ROOM, 1)).toBe(rm);
    });

    test('Carpet Secret Room', () => {
        // Mixed item library -- can check one item out at a time
        // [[1, 12],           [30, 50],	30,		6,			0,                  (BP_ROOM | BP_PURGE_INTERIOR | BP_SURROUND_WITH_WALLS | BP_OPEN_INTERIOR | BP_IMPREGNABLE | BP_REWARD),	[
        // 	[0,	CARPET,		DUNGEON,		[0,0],		0,			0,			-1,			0,				0,				0,			0,			(BF_EVERYWHERE)],
        // 	[0,	0,          0,              [1,1],		1,			0,          0,        0,				2,					0,			0,          (BF_BUILD_AT_ORIGIN | BF_PERMIT_BLOCKING | BF_BUILD_VESTIBULE)],
        // 	[0,	ALTAR_CAGE_OPEN,DUNGEON,	[1,1],		1,			(WEAPON|ARMOR|WAND|STAFF|RING|CHARM),-1,0,2,	0,			(ITEM_IS_KEY | ITEM_KIND_AUTO_ID | ITEM_PLAYER_AVOIDS),	(BF_GENERATE_ITEM | BF_NO_THROWING_WEAPONS | BF_TREAT_AS_BLOCKING | BF_IMPREGNABLE)],
        //  [0,	ALTAR_CAGE_OPEN,DUNGEON,	[3,3],		3,			(WEAPON|ARMOR|WAND),-1,	0,				2,					0,			(ITEM_IS_KEY | ITEM_KIND_AUTO_ID | ITEM_PLAYER_AVOIDS),	(BF_GENERATE_ITEM | BF_NO_THROWING_WEAPONS | BF_TREAT_AS_BLOCKING | BF_IMPREGNABLE)],
        // 	[0,	ALTAR_CAGE_OPEN,DUNGEON,	[2,3],		2,			(STAFF|RING|CHARM),-1,	0,				2,					0,			(ITEM_IS_KEY | ITEM_KIND_AUTO_ID | ITEM_MAX_CHARGES_KNOWN | ITEM_PLAYER_AVOIDS),	(BF_GENERATE_ITEM | BF_NO_THROWING_WEAPONS | BF_TREAT_AS_BLOCKING | BF_IMPREGNABLE)],
        //  [0,	STATUE_INERT,DUNGEON,		[2,3],		0,			0,			-1,			0,				2,				0,          0,          (BF_TREAT_AS_BLOCKING | BF_BUILD_IN_WALLS | BF_IMPREGNABLE)]]],

        GW.tile.install('CARPET', { ch: '#', fg: 0xb36 });
        GW.tile.install('DOOR_SECRET', {
            extends: 'WALL',
            flags: 'L_SECRETLY_PASSABLE',
            effects: {
                discover: { tile: 'DOOR' },
            },
        });

        BLUE.install('SECRET_ROOM', {
            frequency: '1-12: 30',
            size: '15-25',
            flags: 'BP_ROOM',
            steps: [
                { tile: 'CARPET', flags: 'BF_EVERYWHERE' },
                {
                    tile: 'DOOR_SECRET',
                    flags: 'BF_BUILD_AT_ORIGIN | BF_PERMIT_BLOCKING',
                },
            ],
        });

        const a = BLUE.blueprints.SECRET_ROOM;
        expect(a.steps).toHaveLength(2);

        // Create Dig Site
        const map = GW.map.make(50, 50);
        const level = new DIG.Level({ seed: 12345 });
        level.create(map);

        GW.map.analyze(map);

        // dumpSite(site);

        // Create a build site
        const builder = new BLUE.Builder(map, 1);
        expect(builder.buildBlueprint(a)).toBeTruthy();

        // dumpSite(site);

        // Check that there is carpet
        // Check that there is a secret door
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

        GW.tile.install('CARPET', { ch: '#', fg: 0xb36 });
        GW.tile.install('ALTAR', { ch: 'T', fg: 0xf63 });
        GW.tile.install('STATUE', { ch: '&', fg: 0x663 });

        BLUE.install('MIXED_ITEM_LIBRARY', {
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

        const a = BLUE.blueprints.MIXED_ITEM_LIBRARY;
        expect(a.getChance(1)).toEqual(30);
        expect(a.getChance(10)).toEqual(30);
        expect(a.getChance(15)).toEqual(0);
        expect(a.steps).toHaveLength(6);
    });

    test('carpet', () => {
        const map = GW.map.make(80, 34, { visible: true });

        GW.tile.install('CARPET', { extends: 'FLOOR', ch: '%' });
        DIG.room.install('ENTRANCE', new DIG.room.BrogueEntrance());
        DIG.room.install(
            'ROOM',
            new DIG.room.Rectangular({ width: '4-10', height: '4-10' })
        );

        const level = new DIG.Level({
            seed: 12345,
            rooms: { count: 20, first: 'ENTRANCE', digger: 'ROOM' },
            doors: { chance: 0 },
            loops: false, // { minDistance: 20, maxLength: 1 },
            stairs: { up: [40, 32], down: true },
        });
        level.create(map);

        const builder = new BLUE.Builder(map, 1);

        const blue = new BLUE.Blueprint({
            flags: 'BP_ROOM',
            size: '10-200',
            steps: [{ tile: 'CARPET', flags: 'BF_EVERYWHERE' }],
        });

        expect(builder.buildBlueprint(blue)).toBeTruthy();

        expect(
            map.cells.count((c, x, y) => {
                if (!c.hasTile('CARPET')) {
                    return false;
                }
                console.log('carpet - ', x, y);
                return true;
            })
        ).toBeGreaterThan(9);

        map.dump();
    });
});
