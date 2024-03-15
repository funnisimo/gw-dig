import 'jest-extended';

// import * as GWU from 'gw-utils/index';
// import * as GWM from 'gw-map';
import * as GWD from '..';

describe('Machine Horde', () => {
    beforeAll(() => {
        GWD.site.installTile('CARPET');

        GWD.site.installTile('JUNK');

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

        GWD.site.installHorde({
            leader: 'INVENTOR',
            blueprint: 'JUNK',
            tags: 'SCIENTIST',
        });

        GWD.blueprint.install('JUNK', {
            size: '10-40',
            // flags: 'BP_ROOM',
            steps: [{ tile: 'JUNK', count: '3-5' }],
        });
    });

    test('Tinker Room', () => {
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

        const room = GWD.blueprint.install('INVENTOR_ROOM', {
            size: '20-50',
            frequency: '8-40: 20',
            flags: 'BP_ROOM',
            steps: [{ horde: { id: 'INVENTOR' } }],
        });

        const builder = new GWD.blueprint.Builder({
            blueprints: [room],
            // log: true,
        });
        builder.build(map, room, 63, 8);

        // const horde = GWD.site.pickHorde(map.depth, 'SCIENTIST')!;
        // expect(horde.leader).toEqual('INVENTOR');

        // if (horde) {
        //     const result = GWD.site.spawnHorde(horde, map);
        //     expect(result).toBeTruthy();
        // }

        // map.dump();

        let count = 0;
        map.eachActor((a) => {
            ++count;
            expect(a.id).toEqual('INVENTOR');
        });
        expect(count).toEqual(1);

        expect(
            map._tiles.count((c) => c === GWD.site.tileId('JUNK'))
        ).toBeGreaterThan(2);
    });
});
