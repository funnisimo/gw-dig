import 'jest-extended';
// import * as UTILS from '../test/utils';
import * as GW from 'gw-utils';
import * as BRIDGE from './bridge';
import * as SITE from './site';

describe('Bridge', () => {
    let grid: GW.grid.NumGrid;
    let site: SITE.Site;

    beforeEach(() => {
        grid = GW.grid.alloc(20, 20);
        site = new SITE.GridSite(grid);
    });

    afterEach(() => {
        GW.grid.free(grid);
    });

    test('candidate test', () => {
        grid.fill(SITE.FLOOR);
        GW.utils.forRect(1, 9, 18, 3, (x, y) => (grid[x][y] = SITE.DEEP));

        const bridge = new BRIDGE.Bridges();
        expect(bridge.isBridgeCandidate(site, 10, 9, [1, 0])).toBeFalsy();
        expect(bridge.isBridgeCandidate(site, 10, 9, [0, 1])).toBeTruthy();
    });

    test('create', () => {
        grid.fill(SITE.FLOOR);
        GW.utils.forRect(2, 9, 16, 3, (x, y) => (grid[x][y] = SITE.DEEP));

        expect(grid.count(6)).toEqual(0);

        const bridge = new BRIDGE.Bridges({ maxLength: 5, minDistance: 18 });
        bridge.create(site);

        // grid.dump();

        expect(grid.count(6)).toEqual(3);
    });
});
