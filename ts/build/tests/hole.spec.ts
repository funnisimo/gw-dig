// import * as GWM from 'gw-map';
import * as GWD from '../..';

describe('Blueprint - hole', () => {
    beforeAll(() => {
        GWD.site.installTile('PORTCULLIS_OPEN', {
            priority: 10, // 'FLOOR+1'
        });

        GWD.site.installTile('PORTCULLIS_CLOSED', {
            blocksMove: true,
            connectsLevel: true,
            priority: 101, // 'WALL+1'
        });

        GWD.site.installTile('PRESSURE_PLATE', {
            priority: 20, // 'FLOOR+10',
        });

        GWD.site.installTile('PRESSURE_PLATE_DEPRESSED', {
            priority: 20, // 'FLOOR+10',
        });

        GWD.site.installTile('CHASM', {
            priority: 11, // 'FLOOR+2',
        });

        GWD.site.installTile('CHASM_EDGE', {
            priority: 10, // 'FLOOR+1',
        });

        GWD.room.install('ENTRANCE', new GWD.room.BrogueEntrance());
        GWD.room.install(
            'ROOM',
            new GWD.room.Rectangular({ width: '4-10', height: '4-10' })
        );
    });

    test.only('hole - failed to place', () => {
        GWD.feature.install('CHASM_EDGE', { spread: [100, 100, 'CHASM_EDGE'] });
        GWD.feature.install('CHASM_MEDIUM', {
            spread: [
                150,
                50,
                [{ tile: 'CHASM' }, { id: 'CHASM_EDGE' }],
                { flags: 'E_ABORT_IF_BLOCKS_MAP' },
            ],
        });
        GWD.feature.install('HOLE_WITH_PLATE', [
            { id: 'CHASM_MEDIUM' },
            { tile: 'PRESSURE_PLATE' },
        ]);

        GWD.blueprint.install('VESTIBULE', {
            flags: 'BP_VESTIBULE',
            size: '40-100',
            steps: [
                {
                    feature: 'HOLE_WITH_PLATE',
                    // tile: 'PRESSURE_PLATE',
                    flags:
                        'BS_TREAT_AS_BLOCKING, BS_FAR_FROM_ORIGIN, BS_IN_PASSABLE_VIEW_OF_ORIGIN',
                },
                {
                    tile: 'PORTCULLIS_CLOSED',
                    flags:
                        'BS_BUILD_AT_ORIGIN, BS_PERMIT_BLOCKING, BS_IMPREGNABLE',
                },
            ],
        });

        const blue = GWD.blueprint.install('ROOM', {
            flags: 'BP_ROOM',
            size: '10-100',
            steps: [{ flags: 'BS_BUILD_AT_ORIGIN, BS_BUILD_VESTIBULE' }],
        });

        const digger = new GWD.Digger({
            seed: 123456,
            rooms: { count: 20, first: 'ENTRANCE', digger: 'ROOM' },
            doors: { chance: 0 },
            loops: false,
            lakes: false,
        });

        const map = new GWD.site.Site(80, 34);
        digger.create(map);

        const builder = new GWD.blueprint.Builder();

        // jest.spyOn(builder, '_buildAt');

        // map.dump();

        const result = builder.build(map, blue, 59, 10);

        // map.dump();

        expect(result).toBeFalsy();

        // expect(builder._buildAt).toHaveBeenCalledTimes(11); // (ROOM + 10 * (VESTIBULE @ 1 locs))

        expect(map._tiles.count((c) => c === GWD.site.tileId('CHASM'))).toEqual(
            0
        );
        expect(
            map._tiles.count((c) => c === GWD.site.tileId('CHASM_EDGE'))
        ).toEqual(0);
        expect(
            map._tiles.count((c) => c === GWD.site.tileId('PORTCULLIS_CLOSED'))
        ).toEqual(0);
    });
});
