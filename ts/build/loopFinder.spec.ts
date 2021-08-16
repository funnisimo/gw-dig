import * as GW from 'gw-utils';

import * as LOOP from './loopFinder';
import { WALL, FLOOR } from '../dig/site';
import { MapSite } from './site';

describe('LoopFinder', () => {
    let site: MapSite;

    beforeEach(() => {
        site = new MapSite(11, 11);
    });

    afterEach(() => {
        site.free();
    });

    test('basic loop', () => {
        site.fill(WALL);
        const opts = { superpriority: true };

        GW.utils.forRect(1, 1, 4, 4, (x, y) => site.setTile(x, y, FLOOR, opts));
        GW.utils.forRect(6, 1, 4, 4, (x, y) => site.setTile(x, y, FLOOR, opts));
        GW.utils.forRect(1, 6, 4, 4, (x, y) => site.setTile(x, y, FLOOR, opts));
        GW.utils.forRect(6, 6, 4, 4, (x, y) => site.setTile(x, y, FLOOR, opts));
        site.setTile(5, 1, FLOOR, opts);
        site.setTile(1, 5, FLOOR, opts);
        site.setTile(6, 5, FLOOR, opts);
        site.setTile(5, 8, FLOOR, opts);

        const loop = new LOOP.LoopFinder();
        loop.compute(site);

        // site.map.dump();

        expect(
            site.count((c) => c.hasCellFlag(GW.map.flags.Cell.IS_IN_LOOP))
        ).toBeGreaterThan(0);
    });
});
