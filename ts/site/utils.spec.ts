import * as GWU from 'gw-utils';
import * as SITE from './index';

describe('UTILS', () => {
    test('directionOfDoorSite', () => {
        const a = new SITE.GridSite(10, 10);

        GWU.utils.forRect(2, 2, 3, 3, (x, y) => a.setTile(x, y, 1));
        expect(SITE.directionOfDoorSite(a, 2, 4)).toEqual(
            GWU.utils.NO_DIRECTION
        );
        expect(SITE.directionOfDoorSite(a, 1, 3)).toEqual(GWU.utils.LEFT);
        expect(SITE.directionOfDoorSite(a, 5, 3)).toEqual(GWU.utils.RIGHT);
        expect(SITE.directionOfDoorSite(a, 3, 1)).toEqual(GWU.utils.UP);
        expect(SITE.directionOfDoorSite(a, 3, 5)).toEqual(GWU.utils.DOWN);

        a.free();
    });
});
