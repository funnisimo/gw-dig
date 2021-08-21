import * as GW from 'gw-utils';
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
        expect(step.tile).toBeGreaterThan(0);
        expect(step.pad).toEqual(0);
        expect(step.count).toBeInstanceOf(GW.range.Range);
        expect(step.count.lo).toEqual(1);
        expect(step.count.hi).toEqual(1);
        expect(step.item).toBeNull();
        expect(step.horde).toBeNull();
        expect(step.effect).toBeNull();
    });

    test('build tile', () => {
        GW.random.seed(12345);

        GW.tile.install('TEST', {
            name: 'test',
            ch: 'A',
            flags: 'L_BLOCKS_MOVE',
        });

        const map = GW.map.make(80, 34);
        const builder = new BUILDER.Builder(map, 1);
        const blue = new BLUE.Blueprint({
            flags: 'BP_ROOM',
            size: '10-25',
            steps: [{ tile: 'TEST', count: '2-5' }],
        });
        // const step = blue.steps[0];

        const level = new DIG.Level();
        level.create(map);

        expect(builder.buildBlueprint(blue)).toBeTruthy();

        // site.map.dump();

        expect(map.count((c) => c.hasTile('TEST'))).toBeGreaterThan(1);
    });

    test('build spawn', () => {
        GW.random.seed(12345);

        GW.tile.install('A', {
            name: 'A',
            ch: 'A',
        });

        GW.tile.install('B', {
            name: 'B',
            ch: 'B',
            priority: 60,
            flags: 'L_BLOCKS_MOVE',
        });

        const map = GW.map.make(80, 34);
        const builder = new BUILDER.Builder(map, 1);

        const blue = new BLUE.Blueprint({
            flags: 'BP_ROOM',
            size: '10-25',
            steps: [{ effect: { tile: 'A,100', next: { tile: 'B' } } }],
        });
        // const step = blue.steps[0];

        const level = new DIG.Level();
        level.create(map);

        expect(builder.buildBlueprint(blue)).toBeTruthy();

        // site.dump();

        expect(map.count((c) => c.hasTile('A'))).toBeGreaterThan(1);
        expect(map.count((c) => c.hasTile('B'))).toEqual(1);
    });

    test('tile everywhere', () => {
        GW.random.seed(12345);

        GW.tile.install('A', {
            name: 'A',
            ch: 'A',
        });

        const map = GW.map.make(80, 34);
        const builder = new BUILDER.Builder(map, 1);

        const blue = new BLUE.Blueprint({
            flags: 'BP_ROOM',
            size: '10-25',
            steps: [{ tile: 'A', flags: 'BF_EVERYWHERE' }],
        });
        // const step = blue.steps[0];

        const level = new DIG.Level();
        level.create(map);

        // site.dump();

        expect(builder.buildBlueprint(blue)).toBeTruthy();

        // site.dump();

        expect(map.count((c) => c.hasTile('A'))).toEqual(12);
    });

    test('tile near origin', () => {
        GW.random.seed(12345);

        GW.tile.install('A', {
            name: 'A',
            ch: 'A',
        });

        const map = GW.map.make(80, 34);
        const builder = new BUILDER.Builder(map, 1);

        const blue = new BLUE.Blueprint({
            flags: 'BP_ROOM',
            size: '10-25',
            steps: [{ tile: 'A', flags: 'BF_NEAR_ORIGIN' }],
        });
        // const step = blue.steps[0];

        const level = new DIG.Level();
        level.create(map);

        expect(builder.buildBlueprint(blue)).toBeTruthy();

        // site.dump();

        expect(builder.originX).toEqual(5);
        expect(builder.originY).toEqual(27);

        expect(map.count((c) => c.hasTile('A'))).toEqual(1);

        map.cells.forEach((c, x, y) => {
            if (!c.hasTile('A')) return;
            expect(
                GW.utils.distanceBetween(x, y, builder.originX, builder.originY)
            ).toBeLessThan(4);
        });
    });

    test('tile far from origin', () => {
        GW.random.seed(12345);

        GW.tile.install('A', {
            name: 'A',
            ch: 'A',
        });

        const map = GW.map.make(80, 34);
        const builder = new BUILDER.Builder(map, 1);

        const blue = new BLUE.Blueprint({
            flags: 'BP_ROOM',
            size: '10-25',
            steps: [{ tile: 'A', flags: 'BF_FAR_FROM_ORIGIN' }],
        });
        // const step = blue.steps[0];

        const level = new DIG.Level();
        level.create(map);

        expect(builder.buildBlueprint(blue)).toBeTruthy();

        // site.dump();

        expect(builder.originX).toEqual(5);
        expect(builder.originY).toEqual(27);

        expect(map.count((c) => c.hasTile('A'))).toEqual(1);

        map.cells.forEach((c, x, y) => {
            if (!c.hasTile('A')) return;
            expect(
                GW.utils.distanceBetween(x, y, builder.originX, builder.originY)
            ).toBeGreaterThan(3);
        });
    });
});
