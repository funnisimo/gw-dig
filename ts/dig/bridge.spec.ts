import 'jest-extended';
import * as GW from 'gw-utils';
import * as BRIDGE from './bridge';
import * as SITE from '../site';

describe('Bridge', () => {
    let site: SITE.GridSite;

    beforeEach(() => {
        site = new SITE.GridSite(20, 20);
    });

    afterEach(() => {
        site.free();
    });

    test('candidate test', () => {
        site.tiles.fill(SITE.FLOOR);
        GW.utils.forRect(1, 9, 18, 3, (x, y) => (site.setTile(x, y, SITE.DEEP)));

        const bridge = new BRIDGE.Bridges();
        expect(bridge.isBridgeCandidate(site, 10, 9, [1, 0])).toBeFalsy();
        expect(bridge.isBridgeCandidate(site, 10, 9, [0, 1])).toBeTruthy();
    });

    test('create', () => {
        site.tiles.fill(SITE.FLOOR);
        GW.utils.forRect(2, 9, 16, 3, (x, y) => (site.setTile(x, y, SITE.DEEP)));

        expect(site.tiles.count(6)).toEqual(0);

        const bridge = new BRIDGE.Bridges({ maxLength: 5, minDistance: 18 });
        bridge.create(site);

        // grid.dump();

        expect(site.tiles.count(6)).toEqual(3);
    });
});
