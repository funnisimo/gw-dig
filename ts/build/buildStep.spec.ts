import 'jest-extended';
import * as GWU from 'gw-utils';
// import * as GWM from 'gw-map';

import * as BUILDER from './builder';
import * as BLUE from './blueprint';
import * as STEP from './buildStep';
import * as DIG from '../index';
import { BuildData } from '.';
import { Site } from '../site';
import * as SITE from '../site/tile';

describe('buildStep', () => {
    test('constructor', () => {
        const step = new STEP.BuildStep({
            flags: 'BS_EVERYWHERE',
            tile: 'FLOOR',
        });

        expect(step.flags & STEP.StepFlags.BS_EVERYWHERE).toBeTruthy();
        expect(step.tile).toEqual('FLOOR');
        expect(step.pad).toEqual(0);
        expect(step.count).toBeInstanceOf(GWU.range.Range);
        expect(step.count.lo).toEqual(1);
        expect(step.count.hi).toEqual(1);
        expect(step.item).toBeNull();
        expect(step.horde).toBeNull();
        expect(step.feature).toBeNull();
    });

    test('build tile', () => {
        GWU.rng.random.seed(12345);

        SITE.installTile('TEST', { blocksMove: true });

        const map = new Site(80, 34);
        const builder = new BUILDER.Builder();
        const blue = new BLUE.Blueprint({
            flags: 'BP_ROOM',
            size: '10-25',
            steps: [{ tile: 'TEST', count: '2-5' }],
        });
        // const step = blue.steps[0];

        const digger = new DIG.Digger();
        digger.create(map);

        expect(builder.build(map, blue)).toBeTruthy();

        // map.dump();

        expect(
            map._tiles.count((c) => c === SITE.tileId('TEST'))
        ).toBeGreaterThan(1);
    });

    test('build spawn', () => {
        GWU.rng.random.seed(12345);

        SITE.installTile('A', { ch: 'A' });

        SITE.installTile('B', { blocksMove: true, ch: 'B' });

        const map = new Site(80, 34);
        const builder = new BUILDER.Builder();

        const blue = new BLUE.Blueprint({
            flags: 'BP_ROOM',
            size: '10-25',
            steps: [{ feature: [{ spread: [100, 100, 'A'] }, { tile: 'B' }] }],
        });
        // const step = blue.steps[0];

        const digger = new DIG.Digger();
        digger.create(map);

        expect(builder.build(map, blue)).toBeTruthy();

        // map.dump();

        expect(map._tiles.count((c) => c == SITE.tileId('A'))).toBeGreaterThan(
            1
        );
        expect(map._tiles.count((c) => c == SITE.tileId('B'))).toEqual(1);
    });

    test('tile everywhere', () => {
        SITE.installTile('A', { ch: 'A' });

        const map = new Site(80, 34);
        const builder = new BUILDER.Builder();

        const blue = new BLUE.Blueprint({
            flags: 'BP_ROOM',
            size: '10-25',
            steps: [{ tile: 'A', flags: 'BS_EVERYWHERE' }],
        });
        // const step = blue.steps[0];

        const digger = new DIG.Digger({
            seed: 12345,
            loops: false,
            lakes: false,
        });
        digger.create(map);

        // map.dump();

        expect(builder.build(map, blue)).toBeTruthy();

        // map.dump();

        expect(map._tiles.count((c) => c == SITE.tileId('A'))).toEqual(12);
    });

    test('tile near origin', () => {
        SITE.installTile('A');

        const map = new Site(80, 34);
        const builder = new BUILDER.Builder();

        const blue = new BLUE.Blueprint({
            flags: 'BP_ROOM',
            size: '10-25',
            steps: [{ tile: 'A', flags: 'BS_NEAR_ORIGIN' }],
        });
        // const step = blue.steps[0];

        const digger = new DIG.Digger({
            seed: 12345,
            lakes: false,
            loops: false,
        });
        digger.create(map);

        const result = builder.build(map, blue);
        expect(result).toBeTruthy();

        // map.dump();

        expect(map._tiles.count((c) => c == SITE.tileId('A'))).toEqual(1);

        map._tiles.forEach((c, x, y) => {
            if (!(c == SITE.tileId('A'))) return;
            expect(
                GWU.xy.distanceBetween(x, y, result!.x, result!.y)
            ).toBeLessThan(4);
        });
    });

    test('tile far from origin', () => {
        // GWU.rng.random.seed(12345);

        SITE.installTile('A');

        const map = new Site(80, 34);
        const builder = new BUILDER.Builder();

        const blue = new BLUE.Blueprint({
            flags: 'BP_ROOM',
            size: '10-25',
            steps: [{ tile: 'A', flags: 'BS_FAR_FROM_ORIGIN' }],
        });
        // const step = blue.steps[0];

        const digger = new DIG.Digger({
            seed: 12345,
            lakes: false,
            loops: false,
        });
        digger.create(map);

        const result = builder.build(map, blue);
        expect(result).toBeTruthy();

        // map.dump();

        expect(result!.x).toEqual(52);
        expect(result!.y).toEqual(6);

        expect(map._tiles.count((c) => c == SITE.tileId('A'))).toEqual(1);

        map._tiles.forEach((c, x, y) => {
            if (!(c === SITE.tileId('A'))) return;
            expect(
                GWU.xy.distanceBetween(x, y, result!.x, result!.y)
            ).toBeGreaterThan(3);
        });
    });

    describe('markCandidates', () => {
        beforeAll(() => {
            DIG.room.install('ENTRANCE', new DIG.room.BrogueEntrance());
            DIG.room.install(
                'ROOM',
                new DIG.room.Rectangular({ width: '4-10', height: '4-10' })
            );
            DIG.room.install('CHUNK', new DIG.room.ChunkyRoom());
            DIG.room.install(
                'CHOICE',
                new DIG.room.ChoiceRoom({ choices: { ROOM: 100, CHUNK: 50 } })
            );
        });

        let map: Site;
        let data: BuildData;

        beforeEach(() => {
            map = new Site(80, 34);
            map.depth = 1;

            const digger = new DIG.Digger({
                seed: 12345,
                rooms: { count: 40, first: 'ENTRANCE', digger: 'CHOICE' },
                doors: { chance: 0 },
                loops: false,
                lakes: false,
            });

            digger.create(map);

            map.analyze();
        });

        afterEach(() => {
            if (data) data.free();
        });

        test('markCandidates', () => {
            // map.dump();

            const blue = new BLUE.Blueprint({
                id: 'TEST',
                size: '30-50',
                frequency: '1-12: 30',
                flags:
                    'BP_ROOM | BP_PURGE_INTERIOR | BP_SURROUND_WITH_WALLS | BP_OPEN_INTERIOR | BP_IMPREGNABLE | BP_REWARD',

                steps: [
                    {
                        tile: 'ALTAR_CAGE_OPEN',
                        count: 1,
                        pad: 2,
                        flags: 'BS_TREAT_AS_BLOCKING, BS_IMPREGNABLE',
                    },
                ],
            });

            const site = map;
            data = new BuildData(site, blue);
            data.reset(58, 21);

            const count = blue.fillInterior(data);
            expect(count).toBeWithin(30, 51);

            const step = blue.steps[0];

            const candidates = GWU.grid.make(map.width, map.height);
            const candidateCount = step.markCandidates(data, candidates);

            expect(candidateCount).toBeGreaterThan(0);
        });
    });
});
