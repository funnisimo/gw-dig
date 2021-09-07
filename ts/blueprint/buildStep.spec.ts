import * as GWU from 'gw-utils';
import * as GWM from 'gw-map';

import * as BUILDER from './builder';
import * as BLUE from './blueprint';
import * as STEP from './buildStep';
import * as DIG from '../index';

describe('buildStep', () => {
    test('constructor', () => {
        const step = new STEP.BuildStep({
            flags: 'BF_EVERYWHERE',
            tile: 'FLOOR',
        });

        expect(step.flags & STEP.StepFlags.BF_EVERYWHERE).toBeTruthy();
        expect(step.tile).toEqual('FLOOR');
        expect(step.pad).toEqual(0);
        expect(step.count).toBeInstanceOf(GWU.range.Range);
        expect(step.count.lo).toEqual(1);
        expect(step.count.hi).toEqual(1);
        expect(step.item).toBeNull();
        expect(step.horde).toBeNull();
        expect(step.effect).toBeNull();
    });

    test('build tile', async () => {
        GWU.rng.random.seed(12345);

        GWM.tile.install('TEST', {
            name: 'test',
            ch: 'A',
            flags: 'L_BLOCKS_MOVE',
        });

        const map = GWM.map.make(80, 34);
        const builder = new BUILDER.Builder(map);
        const blue = new BLUE.Blueprint({
            flags: 'BP_ROOM',
            size: '10-25',
            steps: [{ tile: 'TEST', count: '2-5' }],
        });
        // const step = blue.steps[0];

        const digger = new DIG.Digger();
        await digger.create(map);

        expect(await builder.build(blue)).toBeTruthy();

        // map.dump();

        expect(map.count((c) => c.hasTile('TEST'))).toBeGreaterThan(1);
    });

    test('build spawn', async () => {
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
        const builder = new BUILDER.Builder(map);

        const blue = new BLUE.Blueprint({
            flags: 'BP_ROOM',
            size: '10-25',
            steps: [{ effect: { tile: 'A,100', next: { tile: 'B' } } }],
        });
        // const step = blue.steps[0];

        const digger = new DIG.Digger();
        await digger.create(map);

        expect(await builder.build(blue)).toBeTruthy();

        // map.dump();

        expect(map.count((c) => c.hasTile('A'))).toBeGreaterThan(1);
        expect(map.count((c) => c.hasTile('B'))).toEqual(1);
    });

    test('tile everywhere', async () => {
        GWM.tile.install('A', {
            name: 'A',
            ch: 'A',
        });

        const map = GWM.map.make(80, 34);
        const builder = new BUILDER.Builder(map);

        const blue = new BLUE.Blueprint({
            flags: 'BP_ROOM',
            size: '10-25',
            steps: [{ tile: 'A', flags: 'BF_EVERYWHERE' }],
        });
        // const step = blue.steps[0];

        const digger = new DIG.Digger({
            seed: 12345,
            loops: false,
            lakes: false,
        });
        await digger.create(map);

        // map.dump();

        expect(await builder.build(blue)).toBeTruthy();

        // map.dump();

        expect(map.count((c) => c.hasTile('A'))).toEqual(12);
    });

    test('tile near origin', async () => {
        GWM.tile.install('A', {
            name: 'A',
            ch: 'A',
        });

        const map = GWM.map.make(80, 34);
        const builder = new BUILDER.Builder(map);

        const blue = new BLUE.Blueprint({
            flags: 'BP_ROOM',
            size: '10-25',
            steps: [{ tile: 'A', flags: 'BF_NEAR_ORIGIN' }],
        });
        // const step = blue.steps[0];

        const digger = new DIG.Digger({
            seed: 12345,
            lakes: false,
            loops: false,
        });
        await digger.create(map);

        expect(await builder.build(blue)).toBeTruthy();

        // map.dump();

        expect(builder.data.originX).toEqual(52);
        expect(builder.data.originY).toEqual(6);

        expect(map.count((c) => c.hasTile('A'))).toEqual(1);

        map.cells.forEach((c, x, y) => {
            if (!c.hasTile('A')) return;
            expect(
                GWU.xy.distanceBetween(
                    x,
                    y,
                    builder.data.originX,
                    builder.data.originY
                )
            ).toBeLessThan(4);
        });
    });

    test('tile far from origin', async () => {
        // GWU.rng.random.seed(12345);

        GWM.tile.install('A', {
            name: 'A',
            ch: 'A',
        });

        const map = GWM.map.make(80, 34);
        const builder = new BUILDER.Builder(map);

        const blue = new BLUE.Blueprint({
            flags: 'BP_ROOM',
            size: '10-25',
            steps: [{ tile: 'A', flags: 'BF_FAR_FROM_ORIGIN' }],
        });
        // const step = blue.steps[0];

        const digger = new DIG.Digger({
            seed: 12345,
            lakes: false,
            loops: false,
        });
        await digger.create(map);

        expect(await builder.build(blue)).toBeTruthy();

        // map.dump();

        expect(builder.data.originX).toEqual(52);
        expect(builder.data.originY).toEqual(6);

        expect(map.count((c) => c.hasTile('A'))).toEqual(1);

        map.cells.forEach((c, x, y) => {
            if (!c.hasTile('A')) return;
            expect(
                GWU.xy.distanceBetween(
                    x,
                    y,
                    builder.data.originX,
                    builder.data.originY
                )
            ).toBeGreaterThan(3);
        });
    });
});
