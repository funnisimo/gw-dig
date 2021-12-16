import * as GWU from 'gw-utils';
import * as GWM from 'gw-map';
import * as Digger from './digger';
// import * as Lake from './lake';
import { MapSite } from './site';

describe('Lakes', () => {
    beforeEach(() => {
        GWU.random.seed(12345);
    });

    test('basic lakes', () => {
        const digger = new Digger.Digger({
            rooms: 40,
        });
        const map = GWM.map.make(80, 40);
        const site = new MapSite(map);

        digger.start(site);
        digger.addRooms(site);
        digger.addLoops(site, {});
        digger.addLakes(site, { count: 2 });

        // map.dump();

        expect(map.count((c) => c.hasTile('LAKE'))).toBeGreaterThan(0);
    });
});
