import 'jest-extended';
import '../../test/matchers';
import * as SITE from './index';

describe('analyze', () => {
    let map: SITE.Site;
    const TILES = {
        '#': 'WALL',
        ' ': 'FLOOR',
        '+': 'DOOR',
    };

    describe('updateLoopiness', () => {
        test('Marks loop', () => {
            map = new SITE.Site(9, 9);
            SITE.loadSite(
                map,
                [
                    '#########',
                    '#   +   #',
                    '#   #   #',
                    '#   #   #',
                    '##+###+##',
                    '#   +   #',
                    '#   #   #',
                    '#   #   #',
                    '#########',
                ],
                TILES
            );

            // map.dump();

            SITE.updateLoopiness(map);

            // map.dump((c) => (c.hasCellFlag(Flags.Cell.IS_IN_LOOP) ? '*' : ' '));

            expect(map._tiles.count((_c, x, y) => map.isInLoop(x, y))).toEqual(
                16
            );
        });
    });

    describe('chokepoints', () => {
        test('no gate sites or chokepoints', () => {
            map = new SITE.Site(9, 9);
            SITE.loadSite(
                map,
                [
                    '#########',
                    '#   +   #',
                    '#   #   #',
                    '#   #   #',
                    '##+###+##',
                    '#   +   #',
                    '#   #   #',
                    '#   #   #',
                    '#########',
                ],
                TILES
            );

            SITE.updateLoopiness(map);
            SITE.updateChokepoints(map, true);

            expect(
                map._tiles.count((_c, x, y) => map.isGateSite(x, y))
            ).toEqual(4);
            expect(
                map._tiles.count((_c, x, y) => map.isChokepoint(x, y))
            ).toEqual(0);
        });

        test('gate sites and chokepoints', () => {
            map = new SITE.Site(20, 20);
            SITE.loadSite(
                map,
                [
                    '####################',
                    '#    +      #      #',
                    '#    #      #      #',
                    '#    #      +      #',
                    '##############+#####',
                    '#    #             #',
                    '#    +             #',
                    '#    #             #',
                    '#    #             #',
                    '##################+#',
                    '#    #      #      #',
                    '#    #      +      #',
                    '#    +      #      #',
                    '#    #      #      #',
                    '#    #      #      #',
                    '##+############+####',
                    '#    #             #',
                    '#    +             #',
                    '#    #             #',
                    '####################',
                ],
                TILES
            );

            SITE.updateLoopiness(map);
            SITE.updateChokepoints(map, true);

            // map.dump((c, x, y) =>
            //     map.isGateSite(x, y) ? 'G' : SITE.getTile(c).ch || ' '
            // );
            // map.dump((c, x, y) =>
            //     map.isChokepoint(x, y) ? 'C' : SITE.getTile(c).ch || ' '
            // );
            expect(
                map._tiles.count((_c, x, y) => map.isGateSite(x, y))
            ).toEqual(10);
            expect(
                map._tiles.count((_c, x, y) => map.isChokepoint(x, y))
            ).toEqual(5);

            expect(map.getChokeCount(1, 1)).toEqual(12);
            expect(map.getChokeCount(5, 1)).toEqual(12);

            expect(map.getChokeCount(6, 1)).toEqual(31);
            expect(map.getChokeCount(12, 3)).toEqual(31);

            expect(map.getChokeCount(13, 3)).toEqual(50);
            expect(map.getChokeCount(14, 4)).toEqual(50);

            expect(map.getChokeCount(1, 5)).toEqual(16);
            expect(map.getChokeCount(5, 6)).toEqual(16);

            expect(map.getChokeCount(6, 5)).toEqual(7 * 18 - 6);
            expect(map.getChokeCount(18, 9)).toEqual(7 * 18 - 6);
        });
    });
});
