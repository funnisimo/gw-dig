import * as GWM from 'gw-map';
import * as GWD from '../..';

describe('Blueprint - hole', () => {
    beforeAll(() => {
        GWM.tile.install('PORTCULLIS_OPEN', {
            extends: 'FLOOR',
            priority: '+1',
            ch: 'O',
            effects: {
                machine: {
                    tile: 'PORTCULLIS_CLOSED',
                    message: 'The portcullis slams down from the ceiling.',
                    flags: 'E_EVACUATE_CREATURES',
                },
            },
        });

        GWM.tile.install('PORTCULLIS_CLOSED', {
            extends: 'WALL',
            priority: '+1',
            ch: 'C',
            fg: 0x0f0,
            bg: GWM.tile.tiles.FLOOR.sprite.bg,
            flags:
                '!L_BLOCKS_VISION, !L_BLOCKS_GAS, L_LIST_IN_SIDEBAR, L_VISUALLY_DISTINCT, T_CONNECTS_LEVEL',
            effects: {
                machine: {
                    tile: 'PORTCULLIS_OPEN',
                    message: 'The portcullis rises into the ceiling.',
                    flags: 'E_SUPERPRIORITY',
                },
            },
        });

        GWM.tile.install('PRESSURE_PLATE', {
            extends: 'FLOOR',
            priority: '+10',
            ch: '^',
            fg: 0x00f,
            flags: 'T_IS_TRAP, L_LIST_IN_SIDEBAR, L_VISUALLY_DISTINCT',
            effects: {
                enter: {
                    activateMachine: true,
                    message: 'the pressure plate clicks.',
                    tile: 'PRESSURE_PLATE_DEPRESSED',
                },
            },
        });

        GWM.tile.install('PRESSURE_PLATE_DEPRESSED', {
            extends: 'FLOOR',
            priority: '+10',
            ch: 'v',
            fg: 0x00f,
            effects: {
                exit: { tile: 'PRESSURE_PLATE' },
            },
        });

        GWM.tile.install('CHASM', {
            extends: 'FLOOR',
            priority: '+2',
            ch: 'X',
            flavor: 'a chasm',
            flags: 'T_AUTO_DESCENT',
        });

        GWM.tile.install('CHASM_EDGE', {
            extends: 'FLOOR',
            priority: '+1',
            ch: ':',
            fg: 0x777,
            flavor: 'a chasm edge',
        });

        GWD.room.install('ENTRANCE', new GWD.room.BrogueEntrance());
        GWD.room.install(
            'ROOM',
            new GWD.room.Rectangular({ width: '4-10', height: '4-10' })
        );
    });

    test('hole - failed to place', async () => {
        GWM.effect.install('CHASM_EDGE', { tile: 'CHASM_EDGE,100' });
        GWM.effect.install('CHASM_MEDIUM', {
            tile: 'CHASM,150,50',
            flags: 'E_NEXT_EVERYWHERE, E_ABORT_IF_BLOCKS_MAP',
            next: 'CHASM_EDGE',
        });
        GWM.effect.install('HOLE_WITH_PLATE', {
            effect: 'CHASM_MEDIUM',
            next: { tile: 'PRESSURE_PLATE' },
        });

        GWD.blueprint.install('VESTIBULE', {
            flags: 'BP_VESTIBULE',
            size: '40-100',
            steps: [
                {
                    effect: 'HOLE_WITH_PLATE',
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

        const map = GWM.map.make(80, 34, { visible: true });
        digger.create(map);

        const builder = new GWD.blueprint.Builder();

        // jest.spyOn(builder, '_buildAt');

        // map.dump();

        const result = await builder.build(map, blue, 59, 10);

        // map.dump();

        expect(result).toBeFalsy();

        // expect(builder._buildAt).toHaveBeenCalledTimes(11); // (ROOM + 10 * (VESTIBULE @ 1 locs))

        expect(map.cells.count((c) => c.hasTile('CHASM'))).toEqual(0);
        expect(map.cells.count((c) => c.hasTile('CHASM_EDGE'))).toEqual(0);
        expect(map.cells.count((c) => c.hasTile('PORTCULLIS_CLOSED'))).toEqual(
            0
        );
    });
});
