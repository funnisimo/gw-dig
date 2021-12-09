import 'jest-extended';
import * as GWU from 'gw-utils';
import * as GWM from 'gw-map';

import * as BUILDER from './builder';
import * as BLUE from './blueprint';
import * as STEP from './buildStep';
import * as DIG from '../index';
import { BuildData } from '.';
import { MapSite } from '../site';

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
        expect(step.effect).toBeNull();
    });

    test('build tile', () => {
        GWU.rng.random.seed(12345);

        GWM.tile.install('TEST', {
            name: 'test',
            ch: 'A',
            flags: 'L_BLOCKS_MOVE',
        });

        const map = GWM.map.make(80, 34);
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

        expect(map.count((c) => c.hasTile('TEST'))).toBeGreaterThan(1);
    });

    test('build spawn', () => {
        GWU.rng.random.seed(12345);

        GWM.tile.install('A', {
            name: 'A',
            ch: 'A',
        });

        GWM.tile.install('B', {
            name: 'B',
            ch: 'B',
            priority: 60,
            flags: 'L_BLOCKS_MOVE',
        });

        const map = GWM.map.make(80, 34);
        const builder = new BUILDER.Builder();

        const blue = new BLUE.Blueprint({
            flags: 'BP_ROOM',
            size: '10-25',
            steps: [{ effect: { tile: 'A,100', next: { tile: 'B' } } }],
        });
        // const step = blue.steps[0];

        const digger = new DIG.Digger();
        digger.create(map);

        expect(builder.build(map, blue)).toBeTruthy();

        // map.dump();

        expect(map.count((c) => c.hasTile('A'))).toBeGreaterThan(1);
        expect(map.count((c) => c.hasTile('B'))).toEqual(1);
    });

    test('tile everywhere', () => {
        GWM.tile.install('A', {
            name: 'A',
            ch: 'A',
        });

        const map = GWM.map.make(80, 34);
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

        expect(map.count((c) => c.hasTile('A'))).toEqual(12);
    });

    test('tile near origin', () => {
        GWM.tile.install('A', {
            name: 'A',
            ch: 'A',
        });

        const map = GWM.map.make(80, 34);
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

        expect(map.count((c) => c.hasTile('A'))).toEqual(1);

        map.cells.forEach((c, x, y) => {
            if (!c.hasTile('A')) return;
            expect(
                GWU.xy.distanceBetween(x, y, result!.x, result!.y)
            ).toBeLessThan(4);
        });
    });

    test('tile far from origin', () => {
        // GWU.rng.random.seed(12345);

        GWM.tile.install('A', {
            name: 'A',
            ch: 'A',
        });

        const map = GWM.map.make(80, 34);
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

        expect(map.count((c) => c.hasTile('A'))).toEqual(1);

        map.cells.forEach((c, x, y) => {
            if (!c.hasTile('A')) return;
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

        let map: GWM.map.Map;
        let data: BuildData;

        beforeEach(() => {
            map = GWM.map.make(80, 34);
            map.properties.depth = 1;

            const digger = new DIG.Digger({
                seed: 12345,
                rooms: { count: 40, first: 'ENTRANCE', digger: 'CHOICE' },
                doors: { chance: 0 },
                loops: false,
                lakes: false,
            });

            digger.create(map);

            GWM.map.analyze(map);
        });

        afterEach(() => {
            if (data) data.free();
        });

        test.only('markCandidates', () => {
            // map.dump();

            const blue = new BLUE.Blueprint({
                id: 'TEST',
                size: '30-50',
                frequency: '1-12: 30',
                flags: 'BP_ROOM | BP_PURGE_INTERIOR | BP_SURROUND_WITH_WALLS | BP_OPEN_INTERIOR | BP_IMPREGNABLE | BP_REWARD',

                steps: [
                    {
                        tile: 'ALTAR_CAGE_OPEN',
                        count: 1,
                        pad: 2,
                        flags: 'BS_TREAT_AS_BLOCKING, BS_IMPREGNABLE',
                    },
                ],
            });

            const site = new MapSite(map);
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
