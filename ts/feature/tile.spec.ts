import 'jest-extended';
import '../../test/matchers';
import * as GWU from 'gw-utils';

import { Site } from '../site';
import * as FEATURE from './index';
// import '../tile/tiles';

describe('tile effect', () => {
    let map: Site;

    beforeEach(() => {
        map = new Site(20, 20);
        GWU.data.gameHasEnded = false;
        GWU.rng.random.seed(12345);
    });

    afterEach(() => {
        map.free();
    });

    test('tile', () => {
        const effect = FEATURE.make('TILE:WALL');

        expect(map.hasTile(5, 6, 'WALL')).toBeFalsy();

        expect(effect!(map, 5, 6)).toBeTruthy();

        expect(map.hasTile(5, 6, 'WALL')).toBeTruthy();
    });

    test('tile - superpriority!', () => {
        // const effect = FEATURE.make('TILE:FLOOR');

        map.setTile(5, 6, 'WALL');
        expect(map.hasTile(5, 6, 'WALL')).toBeTruthy();

        // expect(effect!(map, 5, 6)).toBeTruthy();
        // expect(map.hasTile(5, 6, 'WALL')).toBeTruthy();

        jest.spyOn(map, 'setTile');

        const effect2 = FEATURE.make('TILE:FLOOR!');
        expect(effect2!(map, 5, 6)).toBeTruthy();
        expect(map.hasTile(5, 6, 'WALL')).toBeFalsy();

        expect(map.setTile).toHaveBeenCalledWith(
            5,
            6,
            'FLOOR',
            expect.objectContaining({ superpriority: true })
        );
    });

    test('tile - !superpriority', () => {
        // const effect = FEATURE.make({ tile: 'FLOOR' });

        map.setTile(5, 6, 'WALL');

        expect(map.hasTile(5, 6, 'WALL')).toBeTruthy();

        jest.spyOn(map, 'setTile');

        // expect(effect!(map, 5, 6)).toBeFalsy();
        // expect(map.hasTile(5, 6, 'WALL')).toBeTruthy();

        const effect2 = FEATURE.make({ tile: '!FLOOR' });
        expect(effect2!(map, 5, 6)).toBeTruthy();
        expect(map.hasTile(5, 6, 'WALL')).toBeFalsy();

        expect(map.setTile).toHaveBeenCalledWith(
            5,
            6,
            'FLOOR',
            expect.objectContaining({ superpriority: true })
        );
    });

    test.todo('tile - blocked by actor/item');
});
