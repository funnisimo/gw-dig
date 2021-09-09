import 'jest-extended';

// import * as GWU from 'gw-utils';
import * as GWM from 'gw-map';
import * as GWD from '../..';

describe('buildStep - noBlockOrigin', () => {
    test('trap path', async () => {
        const trap = GWM.tile.install('TRAP', {
            extends: 'FLOOR',
            ch: 'T',
            priority: '+1',
            fg: 0x800, // So you can see them - probably would want this hidden in the real game...
            flags: 'T_IS_TRAP',
            effects: {
                enter: { message: "It's a trap!", flash: true }, // Really do something nasty here, but that is another demo...
            },
        });

        expect(trap.blocksPathing()).toBeTruthy();

        GWD.room.install('ENTRANCE', new GWD.room.BrogueEntrance());
        GWD.room.install(
            'ROOM',
            new GWD.room.Rectangular({ width: '4-10', height: '4-10' })
        );

        const digger = new GWD.Digger({
            seed: 12345,
            rooms: { count: 20, first: 'ENTRANCE', digger: 'ROOM' },
            doors: { chance: 0 },
            loops: false,
            lakes: false,
        });

        const vestibule = GWD.blueprint.make({
            id: 'VESTIBULE',
            flags: 'BP_VESTIBULE, BP_NOT_IN_HALLWAY',
            size: '10-40',
            steps: [
                {
                    tile: 'DOOR',
                    flags:
                        'BS_BUILD_AT_ORIGIN, BS_PERMIT_BLOCKING, BS_IMPREGNABLE',
                },
                {
                    tile: 'TRAP',
                    flags:
                        'BS_REPEAT_UNTIL_NO_PROGRESS, BS_TREAT_AS_BLOCKING, BS_NO_BLOCK_ORIGIN',
                },
            ],
        });

        const room = GWD.blueprint.make({
            id: 'ROOM',
            flags: 'BP_ROOM',
            size: '10-100',
            steps: [{ flags: 'BS_BUILD_AT_ORIGIN, BS_BUILD_VESTIBULE' }],
        });

        const map = GWM.map.make(80, 34, { visible: true });

        await digger.create(map);
        const builder = new GWD.blueprint.Builder({
            // log: true,
            blueprints: [vestibule, room],
        });

        map.seed = 12345;
        const result = await builder.build(map, room);

        // map.dump();
        expect(result).toBeTruthy();
        expect(map.hasTile(4, 26, 'TRAP')).toBeFalsy();

        const path = GWM.path.getPathBetween(map, 4, 25, 9, 30, {
            eightWays: false,
        });
        // console.log(path);
        expect(path).toBeArray();
        expect(path!.length).toBeGreaterThan(9);
    });
});
