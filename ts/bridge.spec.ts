import 'jest-extended';
import * as GWU from 'gw-utils';
import * as BRIDGE from './bridge';
import * as SITE from './site';

describe('Bridge', () => {
    let site: SITE.GridSite;

    beforeEach(() => {
        site = new SITE.GridSite(20, 20);
    });

    afterEach(() => {
        site.free();
    });

    test.skip('candidate test', () => {
        site.tiles.fill(SITE.FLOOR);
        GWU.xy.forRect(1, 9, 18, 3, (x, y) => site.setTile(x, y, SITE.DEEP));

        const bridge = new BRIDGE.Bridges();
        expect(bridge.isBridgeCandidate(site, 10, 9, [1, 0])).toBeFalsy();
        expect(bridge.isBridgeCandidate(site, 10, 9, [0, 1])).toBeTruthy();
    });

    test('create', () => {
        site.tiles.fill(SITE.FLOOR);
        GWU.xy.forRect(2, 9, 16, 3, (x, y) => site.setTile(x, y, SITE.DEEP));

        expect(site.tiles.count(SITE.BRIDGE)).toEqual(0);

        const bridge = new BRIDGE.Bridges({ maxLength: 5, minDistance: 18 });
        bridge.create(site);

        // grid.dump();

        expect(site.tiles.count(SITE.BRIDGE)).toEqual(3);
    });
});
