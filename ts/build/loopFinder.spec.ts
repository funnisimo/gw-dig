import * as GW from 'gw-utils';

import * as LOOP from './loopFinder';
import { WALL, FLOOR } from '../dig/site';
import { GridSite, Flags } from './site';

describe('LoopFinder', () => {
    let site: GridSite;

    beforeEach(() => {
        site = new GridSite(11, 11);
    });

    afterEach(() => {
        site.free();
    });

    test('basic loop', () => {
        site.tiles.fill(WALL);
        GW.utils.forRect(1, 1, 4, 4, (x, y) => (site.setTile(x, y, FLOOR)));
        GW.utils.forRect(6, 1, 4, 4, (x, y) => (site.setTile(x, y, FLOOR)));
        GW.utils.forRect(1, 6, 4, 4, (x, y) => (site.setTile(x, y, FLOOR)));
        GW.utils.forRect(6, 6, 4, 4, (x, y) => (site.setTile(x, y, FLOOR)));
        site.setTile(5, 1, FLOOR);
        site.setTile(1, 5, FLOOR);
        site.setTile(6, 5, FLOOR);
        site.setTile(5, 8, FLOOR);
        // grid.dump();

        const loop = new LOOP.LoopFinder();
        loop.compute(site);

        // site.flags.dump();

        expect(site.flags.count(Flags.IS_IN_LOOP)).toBeGreaterThan(0);
    });
});
