import * as GWU from 'gw-utils';
// import * as GWM from 'gw-map';
import * as Digger from './digger';
// import * as Lake from './lake';
import * as SITE from './site';

describe('Lakes', () => {
    beforeEach(() => {
        GWU.random.seed(12345);
    });

    test('basic lakes', () => {
        const digger = new Digger.Digger({
            rooms: 40,
        });
        // const map = GWM.map.make(80, 40);
        const site = new SITE.Site(80, 40);

        digger.start(site);
        digger.addRooms(site);
        digger.addLoops(site, {});
        digger.addLakes(site, { count: 2 });

        // map.dump();

        expect(
            site._tiles.count((t) => t === SITE.tileId('DEEP'))
        ).toBeGreaterThan(0);
    });
});
