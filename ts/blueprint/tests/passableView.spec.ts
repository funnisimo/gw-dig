import * as GWU from 'gw-utils';
import * as GWM from 'gw-map';
import * as GWD from '../..';
import { BuildData, CandidateType } from '..';
import { MapSite } from '../../site';

describe('inPassableViewOfOrigin', () => {
    let candidates: GWU.grid.NumGrid;

    afterEach(() => {
        GWU.grid.free(candidates);
    });

    test('notInHallway', async () => {
        const map = GWM.map.make(80, 34, { visible: true });

        GWM.tile.install('PORTCULLIS_CLOSED', {
            extends: 'WALL',
            priority: '+1',
            fg: 0x800,
            bg: GWM.tile.tiles.FLOOR.sprite.bg,
            flags:
                '!L_BLOCKS_VISION, !L_BLOCKS_GAS, L_LIST_IN_SIDEBAR, L_VISUALLY_DISTINCT, T_CONNECTS_LEVEL',
        });

        GWM.tile.install('WALL_LEVER', {
            extends: 'WALL',
            priority: '+10',
            fg: 0x800,
            ch: '\\',
            flags: 'L_LIST_IN_SIDEBAR, L_VISUALLY_DISTINCT',
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
        await digger.create(map);

        const vestibule = GWD.blueprint.install('VESTIBULE', {
            flags: 'BP_VESTIBULE',
            size: 1,
            steps: [
                {
                    tile: 'PORTCULLIS_CLOSED',
                    flags:
                        'BS_BUILD_AT_ORIGIN, BS_PERMIT_BLOCKING, BS_IMPREGNABLE',
                },
                {
                    tile: 'WALL_LEVER',
                    flags:
                        'BS_BUILD_IN_WALLS, BS_IN_PASSABLE_VIEW_OF_ORIGIN, BS_BUILD_ANYWHERE_ON_LEVEL, BS_NOT_IN_HALLWAYS',
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

        expect(await builder.build(map, room, 73, 14)).toBeTruthy();

        const data = new BuildData(new MapSite(map), vestibule);
        data.originX = 73;
        data.originY = 14;
        vestibule.fillInterior(data);

        // We don't even need the portcullis to be there to block the doorway...
        expect(data.site.blocksPathing(73, 14)).toBeFalsy();

        candidates = GWU.grid.alloc(map.width, map.height);

        const leverStep = vestibule.steps[1];
        leverStep.markCandidates(data, candidates);

        // data.interior.dump();
        // candidates.dump();

        // steps to side of origin (now blocked) should not be there...
        expect(candidates.count((v) => v == CandidateType.OK)).toBeGreaterThan(
            5
        );
        expect(candidates[72][14]).toEqual(CandidateType.INVALID_WALL);
        expect(candidates[74][14]).toEqual(CandidateType.INVALID_WALL);
    });
});
