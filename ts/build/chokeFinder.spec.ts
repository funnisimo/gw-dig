import * as GW from 'gw-utils';

import * as CHOKE from './chokeFinder';
import * as LOOP from './loopFinder';
import { WALL, FLOOR } from '../dig/site';
import { MapSite } from './site';

describe('LoopFinder', () => {
    let site: MapSite;

    beforeEach(() => {
        site = new MapSite(19, 19);
    });

    afterEach(() => {
        site.free();
    });

    test('basic loop', () => {
        site.map.fill(WALL);

        const opts = { superpriority: true };

        GW.utils.forRect(1, 1, 5, 5, (x, y) => site.setTile(x, y, FLOOR, opts));
        GW.utils.forRect(7, 1, 5, 5, (x, y) => site.setTile(x, y, FLOOR, opts));
        GW.utils.forRect(13, 1, 5, 5, (x, y) =>
            site.setTile(x, y, FLOOR, opts)
        );

        GW.utils.forRect(1, 7, 5, 5, (x, y) => site.setTile(x, y, FLOOR, opts));
        GW.utils.forRect(7, 7, 5, 5, (x, y) => site.setTile(x, y, FLOOR, opts));
        GW.utils.forRect(13, 7, 5, 5, (x, y) =>
            site.setTile(x, y, FLOOR, opts)
        );

        GW.utils.forRect(1, 13, 5, 5, (x, y) =>
            site.setTile(x, y, FLOOR, opts)
        );
        GW.utils.forRect(7, 13, 5, 5, (x, y) =>
            site.setTile(x, y, FLOOR, opts)
        );
        GW.utils.forRect(13, 13, 5, 5, (x, y) =>
            site.setTile(x, y, FLOOR, opts)
        );

        site.setTile(1, 6, FLOOR, opts);
        site.setTile(17, 6, FLOOR, opts);

        site.setTile(6, 3, FLOOR, opts);
        site.setTile(12, 3, FLOOR, opts);

        site.setTile(6, 8, FLOOR, opts);
        site.setTile(12, 8, FLOOR, opts);

        site.setTile(1, 12, FLOOR, opts);
        site.setTile(6, 16, FLOOR, opts);
        site.setTile(12, 16, FLOOR, opts);

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

        expect(
            site.map.count((c) => c.hasCellFlag(GW.map.flags.Cell.IS_GATE_SITE))
        ).toBeGreaterThan(0);
        expect(
            site.map.count((c) =>
                c.hasCellFlag(GW.map.flags.Cell.IS_CHOKEPOINT)
            )
        ).toBeGreaterThan(0);
    });
});
