import * as GWM from 'gw-map';

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
                flags: 0,
            })
        );

        const a = BLUE.blueprints.A;
        expect(a.qualifies(0, 'room')).toBeTruthy();
        expect(a.qualifies(10, 'room')).toBeFalsy();
        expect(a.qualifies(10, 'room, town')).toBeFalsy();
        expect(a.qualifies(0)).toBeTruthy();

        expect(a.frequency(1)).toEqual(50);
        expect(a.frequency(10)).toEqual(50);
    });

    test('random', () => {
        const sd = BLUE.install('SECRET_DOOR', {
            frequency: 10,
            flags: 'BP_VESTIBULE',
            steps: [{ tile: 'DOOR', flags: 'BS_BUILD_AT_ORIGIN' }],
        });

        const rm = BLUE.install('WET_ROOM', {
            frequency: 10,
            size: '10-20',
            flags: 'BP_ROOM',
            steps: [
                { tile: 'SHALLOW', flags: 'BS_EVERYWHERE' },
                {
                    flags:
                        'BS_BUILD_AT_ORIGIN, BS_BUILD_VESTIBULE, BS_PERMIT_BLOCKING',
                },
            ],
        });

        expect(BLUE.random(BLUE.Flags.BP_VESTIBULE, 1)).toBe(sd);
        expect(BLUE.random(BLUE.Flags.BP_ROOM, 1)).toBe(rm);
    });

    test('Carpet Secret Room', () => {
        // Mixed item library -- can check one item out at a time
        // [[1, 12],           [30, 50],	30,		6,			0,                  (BP_ROOM | BP_PURGE_INTERIOR | BP_SURROUND_WITH_WALLS | BP_OPEN_INTERIOR | BP_IMPREGNABLE | BP_REWARD),	[
        // 	[0,	CARPET,		DUNGEON,		[0,0],		0,			0,			-1,			0,				0,				0,			0,			(BS_EVERYWHERE)],
        // 	[0,	0,          0,              [1,1],		1,			0,          0,        0,				2,					0,			0,          (BS_BUILD_AT_ORIGIN | BS_PERMIT_BLOCKING | BS_BUILD_VESTIBULE)],
        // 	[0,	ALTAR_CAGE_OPEN,DUNGEON,	[1,1],		1,			(WEAPON|ARMOR|WAND|STAFF|RING|CHARM),-1,0,2,	0,			(ITEM_IS_KEY | ITEM_KIND_AUTO_ID | ITEM_PLAYER_AVOIDS),	(BS_GENERATE_ITEM | BS_NO_THROWING_WEAPONS | BS_TREAT_AS_BLOCKING | BS_IMPREGNABLE)],
        //  [0,	ALTAR_CAGE_OPEN,DUNGEON,	[3,3],		3,			(WEAPON|ARMOR|WAND),-1,	0,				2,					0,			(ITEM_IS_KEY | ITEM_KIND_AUTO_ID | ITEM_PLAYER_AVOIDS),	(BS_GENERATE_ITEM | BS_NO_THROWING_WEAPONS | BS_TREAT_AS_BLOCKING | BS_IMPREGNABLE)],
        // 	[0,	ALTAR_CAGE_OPEN,DUNGEON,	[2,3],		2,			(STAFF|RING|CHARM),-1,	0,				2,					0,			(ITEM_IS_KEY | ITEM_KIND_AUTO_ID | ITEM_MAX_CHARGES_KNOWN | ITEM_PLAYER_AVOIDS),	(BS_GENERATE_ITEM | BS_NO_THROWING_WEAPONS | BS_TREAT_AS_BLOCKING | BS_IMPREGNABLE)],
        //  [0,	STATUE_INERT,DUNGEON,		[2,3],		0,			0,			-1,			0,				2,				0,          0,          (BS_TREAT_AS_BLOCKING | BS_BUILD_IN_WALLS | BS_IMPREGNABLE)]]],

        GWM.tile.install('CARPET', { ch: '#', fg: 0xb36 });
        GWM.tile.install('DOOR_SECRET', {
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
                { tile: 'CARPET', flags: 'BS_EVERYWHERE' },
                {
                    tile: 'DOOR_SECRET',
                    flags: 'BS_BUILD_AT_ORIGIN | BS_PERMIT_BLOCKING',
                },
            ],
        });

        const a = BLUE.blueprints.SECRET_ROOM;
        expect(a.steps).toHaveLength(2);

        // Create Dig Site
        const map = GWM.map.make(50, 50);
        const digger = new DIG.Digger({ seed: 12345 });
        digger.create(map);

        GWM.map.analyze(map);

        // dumpSite(site);

        // Create a build site
        const builder = new BLUE.Builder();
        expect(builder.build(map, a)).toBeTruthy();

        // dumpSite(site);

        // Check that there is carpet
        // Check that there is a secret door
    });

    test('carpet', async () => {
        const map = GWM.map.make(80, 34);

        GWM.tile.install('CARPET', { extends: 'FLOOR', ch: '%' });
        DIG.room.install('ENTRANCE', new DIG.room.BrogueEntrance());
        DIG.room.install(
            'ROOM',
            new DIG.room.Rectangular({ width: '4-10', height: '4-10' })
        );

        const digger = new DIG.Digger({
            seed: 12345,
            rooms: { count: 20, first: 'ENTRANCE', digger: 'ROOM' },
            doors: { chance: 0 },
            loops: false, // { minDistance: 20, maxLength: 1 },
            stairs: { up: [40, 32], down: true },
        });
        await digger.create(map);

        const builder = new BLUE.Builder();

        const blue = new BLUE.Blueprint({
            flags: 'BP_ROOM',
            size: '10-200',
            steps: [{ tile: 'CARPET', flags: 'BS_EVERYWHERE' }],
        });

        expect(await builder.build(map, blue)).toBeTruthy();

        expect(
            map.cells.count((c, _x, _y) => {
                if (!c.hasTile('CARPET')) {
                    return false;
                }
                // console.log('carpet - ', x, y);
                return true;
            })
        ).toBeGreaterThan(9);

        // map.dump();
    });

    test.only('maximizeInterior', async () => {
        DIG.room.install('ENTRANCE', new DIG.room.BrogueEntrance());
        DIG.room.install(
            'ROOM',
            new DIG.room.Rectangular({ width: '4-10', height: '4-10' })
        );

        const digger = new DIG.Digger({
            seed: 12345,
            rooms: { count: 20, first: 'ENTRANCE', digger: 'ROOM' },
            doors: { chance: 0 },
            loops: false, // { minDistance: 20, maxLength: 1 },
            stairs: { up: [40, 32], down: true },
        });

        const builder = new BLUE.Builder();

        const blue = new BLUE.Blueprint({
            flags: 'BP_ROOM',
            size: '10-200',
            steps: [{ tile: 'CARPET', flags: 'BS_EVERYWHERE' }],
        });

        const map = GWM.map.make(80, 34);
        await digger.create(map);

        // map.dump();

        GWM.map.analyze(map);
        const site = new DIG.site.MapSite(map);
        const data = new BLUE.BuildData(site, blue);
        data.reset(61, 8);

        expect(await builder._computeInterior(data)).toBeTruthy();

        // data.interior.dump();
        const size = data.interior.count((v) => v > 0);

        BLUE.maximizeInterior(data, 3);

        // data.interior.dump();

        expect(data.interior.count((v) => v > 0)).toBeGreaterThan(size);

        // map.dump();
    });
});
