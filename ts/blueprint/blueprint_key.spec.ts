import * as GWM from 'gw-map';
import * as GWD from '..';

describe('Blueprint - key', () => {
    beforeAll(() => {
        GWM.tile.install('LOCKED_DOOR', {
            extends: 'DOOR',
            bg: 'red',
            effects: {
                enter: null,
                key: { tile: 'FLOOR' },
            },
        });

        GWM.item.install('KEY', {
            name: 'a key',
            ch: '~',
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
        const level = new GWD.Level({
            seed: 12345,
            rooms: { count: 20, first: 'ENTRANCE', digger: 'ROOM' },
            doors: { chance: 0 },
            loops: false,
            lakes: false,
        });

        // Just put it anywhere on the level... (not a room or a vestibule)
        GWD.blueprint.install('ADPOTER', {
            flags: 'BP_ADOPT_ITEM',
            steps: [
                {
                    flags: 'BF_ADOPT_ITEM, BF_TREAT_AS_BLOCKING',
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
                        'BF_BUILD_AT_ORIGIN, BF_PERMIT_BLOCKING, BF_IMPREGNABLE, BF_ITEM_IS_KEY, BF_OUTSOURCE_ITEM_TO_MACHINE, BF_KEY_DISPOSABLE',
                },
            ],
        });

        const blue = GWD.blueprint.install('ROOM', {
            flags: 'BP_ROOM',
            size: '10-100',
            steps: [{ flags: 'BF_BUILD_AT_ORIGIN, BF_BUILD_VESTIBULE' }],
        });

        const map = GWM.map.make(80, 34, { visible: true });
        level.create(map);
        const builder = new GWD.blueprint.Builder(map, 1);
        await builder.build(blue, 20, 11);

        // map.dump();

        let count = 0;
        map.eachItem((i) => {
            ++count;
            expect(i.hasTag('key')).toBeTruthy();
            expect(i.key).not.toBeNull();
            expect(i.key!.x).toEqual(20);
            expect(i.key!.y).toEqual(11);
            expect(i.key!.disposable).toBeTruthy();
        });
        expect(count).toEqual(1);
    });

    test('key - failed to place', async () => {
        const level = new GWD.Level({
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
                    flags: 'BF_ADOPT_ITEM, BF_TREAT_AS_BLOCKING',
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
                        'BF_BUILD_AT_ORIGIN, BF_PERMIT_BLOCKING, BF_IMPREGNABLE, BF_ITEM_IS_KEY, BF_OUTSOURCE_ITEM_TO_MACHINE, BF_KEY_DISPOSABLE',
                },
            ],
        });

        const blue = GWD.blueprint.install('ROOM', {
            flags: 'BP_ROOM',
            size: '10-100',
            steps: [{ flags: 'BF_BUILD_AT_ORIGIN, BF_BUILD_VESTIBULE' }],
        });

        const map = GWM.map.make(80, 34, { visible: true });
        level.create(map);

        // map.dump();

        const builder = new GWD.blueprint.Builder(map, 1);
        await builder.build(blue);

        let count = 0;
        map.eachItem(() => ++count);
        expect(count).toEqual(1);
    });
});
