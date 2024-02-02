import * as GWU from 'gw-utils';
// import * as GWM from 'gw-map';
import * as GWD from '../..';
import { BuildData, CandidateType, StepFlags } from '..';
import * as SITE from '../../site';

describe('inPassableViewOfOrigin', () => {
    let candidates: GWU.grid.NumGrid;

    beforeEach(() => {
        GWU.random.seed(12345);
    });

    afterEach(() => {
        GWU.grid.free(candidates);
    });

    test('notInHallway', () => {
        const map = new SITE.Site(80, 34);

        SITE.installTile('PORTCULLIS_CLOSED', {
            extends: 'WALL',
            priority: '+1',
            blocksVision: false,
            connectsLevel: true,
        });

        SITE.installTile('WALL_LEVER', {
            extends: 'WALL',
            priority: '+10',
        });

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
        digger.create(map);

        const vestibule = GWD.blueprint.install('VESTIBULE', {
            flags: 'BP_VESTIBULE',
            size: 1,
            steps: [
                {
                    tile: 'PORTCULLIS_CLOSED',
                    flags: 'BS_BUILD_AT_ORIGIN, BS_PERMIT_BLOCKING, BS_IMPREGNABLE',
                },
                {
                    tile: 'WALL_LEVER',
                    flags: 'BS_BUILD_IN_WALLS, BS_IN_PASSABLE_VIEW_OF_ORIGIN, BS_BUILD_ANYWHERE_ON_LEVEL, BS_NOT_IN_HALLWAY',
                },
            ],
        });

        const room = GWD.blueprint.install('ROOM', {
            flags: 'BP_ROOM',
            size: '10-100',
            steps: [],
        });

        // map.dump();

        const builder = new GWD.blueprint.Builder();

        expect(builder.build(map, room, 73, 14)).toBeTruthy();

        // map.dump((v, x, y) => {
        //     return map.isInMachine(x, y) ? 'X' : GWD.site.getTile(v).ch || ' ';
        // });

        const site = map;
        site.analyze();

        const data = new BuildData(site, vestibule);
        data.originX = 73;
        data.originY = 14;
        vestibule.fillInterior(data);

        // We don't even need the portcullis to be there to block the doorway...
        expect(data.site.blocksPathing(73, 14)).toBeFalsy();

        candidates = GWU.grid.alloc(map.width, map.height);

        const leverStep = vestibule.steps[1];
        expect(leverStep.flags & StepFlags.BS_BUILD_IN_WALLS).toBeTruthy();
        expect(
            leverStep.flags & StepFlags.BS_IN_PASSABLE_VIEW_OF_ORIGIN
        ).toBeTruthy();
        expect(
            leverStep.flags & StepFlags.BS_BUILD_ANYWHERE_ON_LEVEL
        ).toBeTruthy();
        expect(leverStep.flags & StepFlags.BS_NOT_IN_HALLWAY).toBeTruthy();

        leverStep.markCandidates(data, candidates);

        // data.site.dump();
        // candidates.dump((v) => (v == 7 ? ' ' : '' + v.toString(16)));

        expect(candidates.count((v) => v == CandidateType.OK)).toEqual(3);
        expect(candidates.get(72, 14)).toEqual(CandidateType.INVALID_WALL);
        expect(candidates.get(74, 14)).toEqual(CandidateType.INVALID_WALL);
    });
});
