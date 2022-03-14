import 'jest-extended';

import * as GWU from 'gw-utils';
// import * as GWM from 'gw-map';
import * as GWD from '../..';

describe('buildStep - noBlockOrigin', () => {
    test('trap path', () => {
        const trap = GWD.site.installTile('TRAP', {
            extends: 'FLOOR',
            priority: '+1',
            blocksPathing: true,
        });

        expect(trap.blocksPathing).toBeTruthy();

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

        const map = new GWD.site.Site(80, 34);

        digger.create(map);
        const builder = new GWD.blueprint.Builder({
            // log: true,
            blueprints: [vestibule, room],
            seed: 12345,
        });

        const result = builder.build(map, room);

        // map.dump();
        expect(result).toBeTruthy();
        expect(map.hasTile(4, 26, 'TRAP')).toBeFalsy();

        const costFn = (x: number, y: number) => {
            if (map.isWall(x, y)) return GWU.path.OBSTRUCTION;
            if (map.isFloor(x, y) || map.isDoor(x, y) || map.isBridge(x, y)) {
                return map.hasActor(x, y) ? GWU.path.AVOIDED : 1;
            }
            if (map.isDeep(x, y)) return GWU.path.FORBIDDEN; // ???
            return 1;
        };

        const path = GWU.path.getPathBetween(
            map.width,
            map.height,
            4,
            25,
            9,
            30,
            costFn,
            false
        );
        // console.log(path);
        expect(path).toBeArray();
        expect(path!.length).toBeGreaterThan(9);
    });
});
