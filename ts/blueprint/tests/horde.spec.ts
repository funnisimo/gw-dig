import 'jest-extended';

import * as GWU from 'gw-utils';
import * as GWM from 'gw-map';
import * as GWD from '../..';

describe('Mixed Item Library', () => {
    beforeAll(() => {
        GWM.tile.install('CARPET', {
            depth: 'SURFACE',
            ch: ';',
            fg: 'brown',
        });

        GWM.tile.install('STATUE_INERT', {
            extends: 'WALL',
            ch: '&',
            flags: '!L_BLOCKS_VISION',
        });

        GWM.tile.install('MANACLE_T', {
            extends: 'FLOOR',
            ch: '|',
            fg: 'silver',
            name: 'Manacles',
            tags: 'MANACLES',
        });
        GWM.tile.install('MANACLE_R', {
            extends: 'FLOOR',
            ch: '-',
            fg: 'silver',
            name: 'Manacles',
            tags: 'MANACLES',
        });
        GWM.tile.install('MANACLE_B', {
            extends: 'FLOOR',
            ch: '|',
            fg: 'silver',
            name: 'Manacles',
            tags: 'MANACLES',
        });
        GWM.tile.install('MANACLE_L', {
            extends: 'FLOOR',
            ch: '-',
            fg: 'silver',
            name: 'Manacles',
            tags: 'MANACLES',
        });
        GWM.tile.install('MANACLE_TR', {
            extends: 'FLOOR',
            ch: '/',
            fg: 'silver',
            name: 'Manacles',
            tags: 'MANACLES',
        });
        GWM.tile.install('MANACLE_BR', {
            extends: 'FLOOR',
            ch: '\\',
            fg: 'silver',
            name: 'Manacles',
            tags: 'MANACLES',
        });
        GWM.tile.install('MANACLE_BL', {
            extends: 'FLOOR',
            ch: '/',
            fg: 'silver',
            name: 'Manacles',
            tags: 'MANACLES',
        });
        GWM.tile.install('MANACLE_TL', {
            extends: 'FLOOR',
            ch: '\\',
            fg: 'silver',
            name: 'Manacles',
            tags: 'MANACLES',
        });

        expect(
            GWM.tile.tiles.STATUE_INERT.hasAllEntityFlags(
                GWM.flags.Entity.L_WALL_FLAGS
            )
        ).toBeFalsy(); // !L_BLOCKS_VISION!

        // [FOLIAGE_CHAR,	fungusForestLightColor,0,						45,	15,	DF_PLAIN_FIRE,	0,			DF_TRAMPLED_FUNGUS_FOREST, 0,	FUNGUS_FOREST_LIGHT,(T_OBSTRUCTS_VISION | T_IS_FLAMMABLE), (TM_STAND_IN_TILE | TM_VANISHES_UPON_PROMOTION | TM_PROMOTES_ON_STEP),"a luminescent fungal forest", "luminescent fungal growth fills the area, groping upward from the rich soil."],
        // [TRAMPLED_FOLIAGE_CHAR,fungusForestLightColor,0,				60,	15,	DF_PLAIN_FIRE,	0,			DF_FUNGUS_FOREST_REGROW, 100,	FUNGUS_LIGHT,	(T_IS_FLAMMABLE), (TM_VANISHES_UPON_PROMOTION),                                                     "trampled fungal foliage", "luminescent fungal growth fills the area, groping upward from the rich soil."],

        GWM.tile.install('FUNGUS_FOREST', {
            depth: 'SURFACE',
            ch: '%',
            fg: 'green',
            priority: 55,
            flags: 'L_BLOCKS_VISION, T_IS_FLAMMABLE, T_STAND_IN_TILE',
            effects: {
                enter: { tile: 'FUNGUS_FOREST_TRAMPLED' },
            },
        });

        GWM.tile.install('FUNGUS_FOREST_TRAMPLED', {
            extends: 'FUNGUS_FOREST',
            ch: '*',
            flags: '!L_BLOCKS_VISION',
            effects: {
                enter: null,
                tick: { chance: 100, tile: 'FUNGUS_FOREST' },
            },
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

        GWM.actor.install('ACTOR', {
            name: 'an Actor',
            ch: 'a',
            fg: 'pink',
        });

        GWM.horde.install('TROUPE', {
            leader: 'ACTOR',
            tags: 'ENTERTAINER',
            members: { ACTOR: '2-4' },
        });

        GWM.horde.install('HANIBAL', {
            leader: 'ACTOR',
            tags: 'CAPTIVE',
        });
    });

    test('Single Horde Room', () => {
        const map = GWM.map.make(80, 34);
        map.properties.depth = 1;

        const digger = new GWD.Digger({
            seed: 12345,
            rooms: { count: 40, first: 'ENTRANCE', digger: 'CHOICE' },
            doors: { chance: 0 },
            loops: false,
            lakes: false,
        });

        digger.create(map);

        const room = GWD.blueprint.install('SIMPLE_HORDE', {
            size: '20-40',
            frequency: '8-40: 20',
            flags: 'BP_ROOM',
            steps: [{ horde: true }],
        });

        const builder = new GWD.blueprint.Builder({
            // blueprints: [room],
            // log: true,
        });
        builder.build(map, room, 63, 8);

        // map.dump();

        let count = 0;
        map.eachActor((a) => {
            ++count;
            expect(a.kind).toBe(GWM.actor.kinds.ACTOR);
        });
        expect(count).toEqual(5);
    });

    function addManacle(
        map: GWM.map.MapType,
        x: number,
        y: number,
        dirIndex: number
    ) {
        const manacles = [
            'MANACLE_T',
            'MANACLE_R',
            'MANACLE_B',
            'MANACLE_L',
            'MANACLE_TR',
            'MANACLE_BR',
            'MANACLE_BL',
            'MANACLE_TL',
        ];
        const dir = GWU.xy.DIRS[dirIndex];
        let newX = x + dir[0];
        let newY = y + dir[1];
        if (
            map.hasXY(newX, newY) &&
            map.cell(newX, newY).isFloor() &&
            !map.cell(newX, newY).hasDepthTile(GWM.flags.Depth.LIQUID)
        ) {
            map.setTile(x + dir[0], y + dir[1], manacles[dirIndex]);
            return true;
        }
        return false;
    }

    function captiveAlly(loc: GWM.effect.MapXY, _ctx: GWM.effect.EffectCtx) {
        const map = loc.map;
        const x = loc.x;
        const y = loc.y;

        if (!map.hasActor(x, y)) {
            return false;
        }

        const fallback = [
            [GWU.xy.LEFT_UP, GWU.xy.UP, GWU.xy.LEFT],
            [GWU.xy.LEFT_DOWN, GWU.xy.DOWN, GWU.xy.LEFT],
            [GWU.xy.RIGHT_UP, GWU.xy.UP, GWU.xy.RIGHT],
            [GWU.xy.RIGHT_DOWN, GWU.xy.DOWN, GWU.xy.RIGHT],
        ];
        let didSomething = false;
        let i: number, j: number;
        for (i = 0; i < 4; i++) {
            for (j = 0; j < 3; j++) {
                const dirIndex = fallback[i][j];
                if (addManacle(map, x, y, dirIndex)) {
                    didSomething = true;
                    break; // leave j loop
                }
            }
        }

        // TODO - Make the actor a captive ally

        return didSomething;
    }

    test('horde with effect', () => {
        const map = GWM.map.make(80, 34);
        map.properties.depth = 1;

        const digger = new GWD.Digger({
            seed: 12345,
            rooms: { count: 40, first: 'ENTRANCE', digger: 'CHOICE' },
            doors: { chance: 0 },
            loops: false,
            lakes: false,
        });

        digger.create(map);

        const room = GWD.blueprint.install('HORDE_WITH_EFFECT', {
            size: '20-40',
            frequency: '8-40: 20',
            flags: 'BP_ROOM',
            steps: [{ horde: { tags: 'CAPTIVE', effect: captiveAlly } }],
        });

        const builder = new GWD.blueprint.Builder({
            // blueprints: [room],
            // log: true,
        });
        builder.build(map, room, 63, 8);

        // map.dump();

        let count = 0;
        map.eachActor((a) => {
            ++count;
            expect(a.kind).toBe(GWM.actor.kinds.ACTOR);
        });
        expect(count).toEqual(1);

        expect(
            map.cells.count((c) => c.hasTileTag('MANACLES'))
        ).toBeGreaterThan(3);
    });

    test('horde adopts item', () => {
        GWM.actor.install('KING', {
            name: 'the King',
            ch: 'k',
            fg: 'purple',
        });

        GWM.actor.install('JESTER', {
            name: 'a Jester',
            ch: 'j',
            fg: 'green',
        });

        GWM.horde.install('KING', {
            leader: 'KING',
            tags: 'BOSS',
            members: { JESTER: '2-4' },
        });

        GWM.tile.install('CAGE', {
            name: 'a Cage',
            priority: 'WALL-1',
            ch: 'C',
            bg: 'silver',
            flags: 'L_BLOCKS_MOVE',
            effects: {
                key: { tile: 'CAGE_OPEN', flags: 'SUPERPRIORITY' },
            },
        });

        GWM.tile.install('CAGE_OPEN', {
            extends: 'FLOOR',
            name: 'an Open Cage',
            ch: 'O',
        });

        GWM.item.install('KEY', {
            name: 'a Key',
            ch: '!',
            fg: 'yellow',
            tags: 'KEY',
        });

        const map = GWM.map.make(80, 34);
        map.properties.depth = 1;

        const digger = new GWD.Digger({
            seed: 12345,
            rooms: { count: 40, first: 'ENTRANCE', digger: 'CHOICE' },
            doors: { chance: 0 },
            loops: false,
            lakes: false,
        });

        digger.create(map);

        // Build room with CAGE, KEY (KEY is KEY, OUTSOURCE ITEM)
        const keyRoom = GWD.blueprint.install('KEY_ROOM', {
            size: '20-40',
            frequency: '1-40: 20',
            flags: 'BP_ROOM',
            steps: [
                {
                    tile: 'CAGE',
                    item: 'KEY',
                    flags: 'BS_OUTSOURCE_ITEM_TO_MACHINE, BS_ITEM_IS_KEY',
                },
            ],
        });

        // Build room with HORDE (HORDE_TAKES_ITEM)
        const monstRoom = GWD.blueprint.install('MONST_ROOM', {
            size: '20-40',
            frequency: '1-40: 20',
            flags: 'BP_ROOM, BP_ADOPT_ITEM',
            steps: [{ horde: 'BOSS', flags: 'BS_HORDE_TAKES_ITEM' }],
        });

        const builder = new GWD.blueprint.Builder({
            blueprints: [keyRoom, monstRoom],
            // log: true,
        });
        const result = builder.build(map, keyRoom, 63, 8);

        // map.dump();

        expect(result).toBeTruthy();

        let kingCount = 0;
        map.eachActor((a) => {
            if (a.kind === GWM.actor.kinds.KING) {
                ++kingCount;
                expect(a.items).not.toBeNull();
                const item = a.items!;
                expect(item.key).not.toBeNull();
            }
        });
        expect(kingCount).toEqual(1);
    });
});
