import 'jest-extended';

// import * as GWU from 'gw-utils';
import * as GWM from 'gw-map';
import * as GWD from '..';

describe('Mixed Item Library', () => {
    beforeAll(() => {
        GWM.tile.install('CARPET', {
            depth: 'SURFACE',
            ch: ';',
            fg: 'brown',
        });

        GWM.tile.install('JUNK', {
            extends: 'FLOOR',
            ch: '&',
        });

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

        GWM.actor.install('INVENTOR', {
            name: 'an Inventor',
            ch: 'i',
            fg: 'pink',
        });

        GWM.horde.install(
            'INVENTOR',
            new GWD.horde.MachineHorde({
                leader: 'INVENTOR',
                blueprint: 'JUNK',
                tags: 'SCIENTIST',
            })
        );

        GWD.blueprint.install('JUNK', {
            size: '10-40',
            // flags: 'BP_ROOM',
            steps: [{ tile: 'JUNK', count: '3-5' }],
        });
    });

    test('Tinker Room', () => {
        const map = GWM.map.make(80, 34, { seed: 12345 });
        map.properties.depth = 1;

        const digger = new GWD.Digger({
            seed: 12345,
            rooms: { count: 40, first: 'ENTRANCE', digger: 'CHOICE' },
            doors: { chance: 0 },
            loops: false,
            lakes: false,
        });

        digger.create(map);

        // const room = GWD.blueprint.install('INVENTOR_ROOM', {
        //     size: '20-50',
        //     frequency: '8-40: 20',
        //     flags: 'BP_ROOM',
        //     steps: [{ horde: { id: 'INVENTOR' } }],
        // });

        // const builder = new GWD.blueprint.Builder({
        //     // blueprints: [room],
        //     // log: true,
        // });
        //  builder.build(map, room, 63, 8);

        const horde = GWM.horde.random('SCIENTIST');
        expect(horde).toBe(GWM.horde.hordes.INVENTOR);

        if (horde) {
            const result = horde.spawn(map);
            expect(result).toBeTruthy();
        }

        // map.dump();

        let count = 0;
        map.eachActor((a) => {
            ++count;
            expect(a.kind).toBe(GWM.actor.kinds.INVENTOR);
        });
        expect(count).toEqual(1);

        expect(map.cells.count((c) => c.hasTile('JUNK'))).toBeGreaterThan(2);
    });
});
