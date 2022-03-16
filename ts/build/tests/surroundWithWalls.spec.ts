import 'jest-extended';

// import * as GWU from 'gw-utils';
// import * as GWM from 'gw-map';
import * as GWD from '../../index';

describe('Surround With Walls', () => {
    beforeAll(() => {
        GWD.room.install('ENTRANCE', new GWD.room.BrogueEntrance());
        GWD.room.install(
            'ROOM',
            new GWD.room.Rectangular({ width: '4-10', height: '4-10' })
        );
        GWD.room.install('CHUNK', new GWD.room.ChunkyRoom());
        GWD.room.install(
            'CHOICE',
            new GWD.room.ChoiceRoom({ choices: { ROOM: 100, CHUNK: 50 } })
        );
    });

    test('Surround With Walls', () => {
        const map = new GWD.site.Site(80, 34);
        map.depth = 1;

        const digger = new GWD.Digger({
            seed: 12345,
            rooms: { count: 40, first: 'ENTRANCE', digger: 'CHOICE' },
            doors: { chance: 0 },
            loops: false,
            lakes: false,
        });

        digger.create(map);

        const vestibule = GWD.blueprint.install('DOOR', {
            size: '1',
            frequency: '1+',
            flags: 'BP_VESTIBULE',
            steps: [{ tile: 'DOOR', flags: 'BS_BUILD_AT_ORIGIN' }],
        });

        const room = GWD.blueprint.install('SEALED_ROOM', {
            size: '20-40',
            frequency: '8-40: 20',
            flags:
                'BP_ROOM | BP_PURGE_INTERIOR | BP_SURROUND_WITH_WALLS | BP_OPEN_INTERIOR | BP_IMPREGNABLE | BP_REWARD',
            steps: [],
        });

        const builder = new GWD.blueprint.Builder({
            blueprints: [vestibule, room],
            // log: true,
        });
        builder.build(map, room, 63, 8);

        expect(map.isWall(62, 8)).toBeTruthy();
        expect(map.isGateSite(63, 8)).toBeTruthy();
        expect(map.isWall(64, 8)).toBeTruthy();

        // map.dump();

        expect(map.isWall(62, 9)).toBeFalsy();
        expect(map.isWall(63, 9)).toBeFalsy();
        expect(map.isWall(64, 9)).toBeFalsy();
    });
});