import * as GWM from 'gw-map';
import * as GWD from '..';

describe('Blueprint - key', () => {
    beforeAll(() => {
        GWM.tile.install('LOCKED_DOOR', {
            extends: 'DOOR',
            bg: 'red',
            ch: 'L',
            effects: {
                enter: null,
                key: { tile: 'FLOOR' },
            },
        });

        GWM.item.install('KEY', {
            name: 'a key',
            ch: 'K',
            fg: 'gold',
            tags: 'key',
        });

        GWD.room.install('ENTRANCE', new GWD.room.BrogueEntrance());
        GWD.room.install(
            'ROOM',
            new GWD.room.Rectangular({ width: '4-10', height: '4-10' })
        );
    });

    test('outsource key to machine', async () => {
        const digger = new GWD.Digger({
            seed: 12345,
            rooms: { count: 20, first: 'ENTRANCE', digger: 'ROOM' },
            doors: { chance: 0 },
            loops: false,
            lakes: false,
        });

        // Just put it anywhere on the digger... (not a room or a vestibule)
        GWD.blueprint.install('ADPOTER', {
            flags: 'BP_ADOPT_ITEM',
            steps: [
                {
                    flags: 'BS_ADOPT_ITEM, BS_TREAT_AS_BLOCKING',
                },
            ],
        });

        GWD.blueprint.install('VESTIBULE', {
            flags: 'BP_VESTIBULE',
            // size: '10-100',
            steps: [
                {
                    tile: 'LOCKED_DOOR',
                    item: 'key',
                    flags:
                        'BS_BUILD_AT_ORIGIN, BS_PERMIT_BLOCKING, BS_IMPREGNABLE, BS_ITEM_IS_KEY, BS_OUTSOURCE_ITEM_TO_MACHINE, BS_KEY_DISPOSABLE',
                },
            ],
        });

        const blue = GWD.blueprint.install('ROOM', {
            flags: 'BP_ROOM',
            size: '10-100',
            steps: [{ flags: 'BS_BUILD_AT_ORIGIN, BS_BUILD_VESTIBULE' }],
        });

        const map = GWM.map.make(80, 34);
        await digger.create(map);
        const builder = new GWD.blueprint.Builder();

        // @ts-ignore
        // const _logger = new GWD.blueprint.Logger();

        await builder.build(map, blue);

        // map.dump();

        let count = 0;
        map.eachItem((i) => {
            ++count;
            expect(i.hasTag('key')).toBeTruthy();
            expect(i.key).not.toBeNull();
            expect(i.key!.disposable).toBeTruthy();
        });
        expect(count).toEqual(1);

        expect(map.cells.count((c) => c.hasTile('LOCKED_DOOR'))).toEqual(1);
    });

    test('key - failed to place', async () => {
        const digger = new GWD.Digger({
            seed: 34567890,
            rooms: { count: 20, first: 'ENTRANCE', digger: 'ROOM' },
            doors: { chance: 0 },
            loops: false,
            lakes: false,
        });

        // Just
        GWD.blueprint.install('ADPOTER', {
            flags: 'BP_ADOPT_ITEM, BP_NOT_IN_HALLWAY',
            size: '1',
            steps: [
                {
                    flags: 'BS_ADOPT_ITEM, BS_TREAT_AS_BLOCKING',
                },
            ],
        });

        GWD.blueprint.install('VESTIBULE', {
            flags: 'BP_VESTIBULE',
            size: '0',
            steps: [
                {
                    tile: 'LOCKED_DOOR',
                    item: 'key',
                    flags:
                        'BS_BUILD_AT_ORIGIN, BS_PERMIT_BLOCKING, BS_IMPREGNABLE, BS_ITEM_IS_KEY, BS_OUTSOURCE_ITEM_TO_MACHINE, BS_KEY_DISPOSABLE',
                },
            ],
        });

        const blue = GWD.blueprint.install('ROOM', {
            flags: 'BP_ROOM',
            size: '10-100',
            steps: [{ flags: 'BS_BUILD_AT_ORIGIN, BS_BUILD_VESTIBULE' }],
        });

        const map = GWM.map.make(80, 34);
        await digger.create(map);

        const builder = new GWD.blueprint.Builder();

        // @ts-ignore
        // const _logger = new GWD.blueprint.Logger();

        const result = await builder.build(map, blue);

        // map.dump();

        expect(result).toBeTruthy();
        let count = 0;
        map.eachItem(() => ++count);
        expect(count).toEqual(1);
    });
});
