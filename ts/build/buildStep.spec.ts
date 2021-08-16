import * as GW from 'gw-utils';
import * as SITE from './site';
import * as BUILDER from './builder';
import * as BLUE from './blueprint';
import * as STEP from './buildStep';
import * as DIG from '../dig';

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

        const site = new SITE.MapSite(80, 34);
        const builder = new BUILDER.Builder(site, 1);
        const blue = new BLUE.Blueprint({
            flags: 'BP_ROOM',
            size: '10-25',
            steps: [{ tile: 'TEST', count: '2-5' }],
        });
        // const step = blue.steps[0];

        const level = new DIG.Level(80, 34);
        level.create((x, y, t) =>
            site.setTile(x, y, t, { superpriority: true })
        );

        expect(builder.buildBlueprint(blue)).toBeTruthy();

        // site.map.dump();

        expect(site.count((c) => c.hasTile('TEST'))).toBeGreaterThan(1);
    });

    test.only('build spawn', () => {
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

        const site = new SITE.MapSite(80, 34);
        const builder = new BUILDER.Builder(site, 1);

        debugger;

        const blue = new BLUE.Blueprint({
            flags: 'BP_ROOM',
            size: '10-25',
            steps: [{ effect: { tile: 'A,100', next: { tile: 'B' } } }],
        });
        // const step = blue.steps[0];

        const level = new DIG.Level(80, 34);
        level.create((x, y, t) =>
            site.setTile(x, y, t, { superpriority: true })
        );

        expect(builder.buildBlueprint(blue)).toBeTruthy();

        site.dump();

        expect(site.count((c) => c.hasTile('A'))).toBeGreaterThan(1);
        expect(site.count((c) => c.hasTile('B'))).toEqual(1);
    });
});
