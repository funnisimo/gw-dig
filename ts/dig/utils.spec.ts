import * as GW from 'gw-utils';
import * as UTILS from './utils';
import * as SITE from '../site';


describe('UTILS', () => {

    test('directionOfDoorSite', () => {
        const a = new SITE.GridSite(10, 10);
    
        GW.utils.forRect(2, 2, 3, 3, (x, y) => a.setTile(x, y, 1));
        expect(UTILS.directionOfDoorSite(a, 2, 4)).toEqual(
            GW.utils.NO_DIRECTION
        );
        expect(UTILS.directionOfDoorSite(a, 1, 3)).toEqual(GW.utils.LEFT);
        expect(UTILS.directionOfDoorSite(a, 5, 3)).toEqual(GW.utils.RIGHT);
        expect(UTILS.directionOfDoorSite(a, 3, 1)).toEqual(GW.utils.UP);
        expect(UTILS.directionOfDoorSite(a, 3, 5)).toEqual(GW.utils.DOWN);
    
        a.free();
    });
    
});
