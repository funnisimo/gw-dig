
import * as GW from 'gw-utils';

import * as CHOKE from './chokeFinder';
import * as LOOP from './loopFinder';
import { GridSite, WALL, FLOOR, Flags } from '../site';

describe('LoopFinder', () => {
    let site: GridSite;

    beforeEach(() => {
        site = new GridSite(19, 19);
    });

    afterEach(() => {
        site.free();
    });

    test('basic loop', () => {
        site.tiles.fill(WALL);
        GW.utils.forRect(1, 1, 5, 5, (x, y) => (site.setTile(x, y, FLOOR)));
        GW.utils.forRect(7, 1, 5, 5, (x, y) => (site.setTile(x, y, FLOOR)));
        GW.utils.forRect(13, 1, 5, 5, (x, y) => (site.setTile(x, y, FLOOR)));

        GW.utils.forRect(1, 7, 5, 5, (x, y) => (site.setTile(x, y, FLOOR)));
        GW.utils.forRect(7, 7, 5, 5, (x, y) => (site.setTile(x, y, FLOOR)));
        GW.utils.forRect(13, 7, 5, 5, (x, y) => (site.setTile(x, y, FLOOR)));

        GW.utils.forRect(1, 13, 5, 5, (x, y) => (site.setTile(x, y, FLOOR)));
        GW.utils.forRect(7, 13, 5, 5, (x, y) => (site.setTile(x, y, FLOOR)));
        GW.utils.forRect(13, 13, 5, 5, (x, y) => (site.setTile(x, y, FLOOR)));

        site.setTile(1, 6, FLOOR);
        site.setTile(17, 6, FLOOR);

        site.setTile(6, 3, FLOOR);
        site.setTile(12, 3, FLOOR);

        site.setTile(6, 8, FLOOR);
        site.setTile(12, 8, FLOOR);

        site.setTile(1, 12, FLOOR);
        site.setTile(6, 16, FLOOR);
        site.setTile(12, 16, FLOOR);

        // site.tiles.dump();

        const loops = new LOOP.LoopFinder();
        loops.compute(site);

        const chokes = new CHOKE.ChokeFinder(true);
        chokes.compute(site);

        // site.choke.dump( (v) => {
        //     if (v == 0 ) return ' ';
        //     if (v >= 10000) return '.';
        //     const t = Math.ceil(v / 10);
        //     return String.fromCharCode(t + 64);
        // });

        // site.flags.dump( (v) => v & Flags.IS_IN_LOOP ? '*' : ' ');
        // site.flags.dump( (v) => v & Flags.IS_GATE_SITE ? '*' : ' ');
        // site.flags.dump( (v) => v & Flags.IS_CHOKEPOINT ? '*' : ' ');

        expect(site.flags.count((v) => v & Flags.IS_GATE_SITE ? true : false)).toBeGreaterThan(0);
        expect(site.flags.count((v) => v & Flags.IS_CHOKEPOINT ? true : false)).toBeGreaterThan(0);
    });
});
