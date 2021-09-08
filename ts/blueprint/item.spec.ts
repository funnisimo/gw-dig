import * as GWM from 'gw-map';

import * as BLUE from './index';
import * as ROOM from '../room';
import { Digger } from '../digger';

describe('Builder', () => {
    let map: GWM.map.Map;
    let builder: BLUE.Builder;

    beforeAll(() => {
        GWM.tile.install('CARPET', { extends: 'FLOOR', ch: '%', fg: 0x800 });
        ROOM.install('ENTRANCE', new ROOM.BrogueEntrance());
        ROOM.install(
            'ROOM',
            new ROOM.Rectangular({ width: '4-10', height: '4-10' })
        );

        map = GWM.map.make(80, 34, { visible: true });

        const digger = new Digger({
            seed: 12345,
            rooms: { count: 20, first: 'ENTRANCE', digger: 'ROOM' },
            doors: { chance: 0 },
            loops: false,
            lakes: false,
        });
        digger.create(map);

        builder = new BLUE.Builder();
    });

    test('Build Item', async () => {
        GWM.item.install('ITEM', {
            name: 'a shovel',
            tags: 'SHOVEL',
            ch: '!',
            fg: 'gold',
        });

        const blue = BLUE.install('ROOM', {
            flags: 'BP_ROOM',
            size: '10-100',
            steps: [{ item: 'SHOVEL', flags: 'BS_FAR_FROM_ORIGIN' }],
        });

        expect(await builder.build(map, blue)).toBeTruthy();

        // map.dump();

        let count = 0;
        map.eachItem((i) => {
            ++count;
            expect(i.hasTag('SHOVEL')).toBeTruthy();
        });
        expect(count).toEqual(1);
    });
});
