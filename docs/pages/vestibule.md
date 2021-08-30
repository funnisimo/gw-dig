### Vestibule

Vestibules are built at the origin site of a machine. They allow you to place interesting things at the entrance. For example, some welcoming carpet...

```js
const map = GWM.map.make(80, 34, { visible: true });
GWM.tile.install('CARPET', { extends: 'FLOOR', ch: '%', fg: 0x800 });
GWD.room.install('ENTRANCE', new GWD.room.BrogueEntrance());
GWD.room.install(
    'ROOM',
    new GWD.room.Rectangular({ width: '4-10', height: '4-10' })
);

const level = new GWD.Level({
    seed: 12345,
    rooms: { count: 20, first: 'ENTRANCE', digger: 'ROOM' },
    doors: { chance: 0 },
    loops: false,
    lakes: false,
});
level.create(map);

const builder = new GWD.blueprint.Builder(map, 1);

GWD.blueprint.install('VESTIBULE', {
    flags: 'BP_VESTIBULE',
    size: '5-10',
    steps: [
        { tile: 'DOOR', flags: 'BF_BUILD_AT_ORIGIN' },
        { tile: 'CARPET', flags: 'BF_EVERYWHERE' },
    ],
});

const blue = GWD.blueprint.install('ROOM', {
    flags: 'BP_ROOM',
    size: '10-100',
    steps: [{ flags: 'BF_BUILD_VESTIBULE' }],
});

const canvas = GWU.canvas.make({ font: 'monospace', width: 80, height: 34 });
SHOW(canvas.node);

builder.build(blue).then(() => {
    map.drawInto(canvas);
    canvas.render();
});
```

### Vestibule with lever

You can also build tiles outside the vestibule's interior area with the 'BF_BUILD_ANYWHERE_ON_LEVEL' flag.

```js
const map = GWM.map.make(80, 34, { visible: true });

const portcullis = GWM.tile.install('PORTCULLIS_CLOSED', {
    extends: 'WALL',
    priority: '+1',
    fg: 0x800,
    bg: GWM.tile.tiles.FLOOR.sprite.bg,
    flags:
        '!L_BLOCKS_VISION, !L_BLOCKS_GAS, L_LIST_IN_SIDEBAR, L_VISUALLY_DISTINCT, T_CONNECTS_LEVEL',
});

const wallLever = GWM.tile.install('WALL_LEVER', {
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

const level = new GWD.Level({
    seed: 12345,
    rooms: { count: 20, first: 'ENTRANCE', digger: 'ROOM' },
    doors: { chance: 0 },
    loops: false,
    lakes: false,
});
level.create(map);

GWM.map.analyze(map);

const builder = new GWD.blueprint.Builder(map, 1);

GWD.blueprint.install('VESTIBULE', {
    flags: 'BP_VESTIBULE',
    size: 1,
    steps: [
        {
            tile: 'PORTCULLIS_CLOSED',
            flags: 'BF_BUILD_AT_ORIGIN, BF_PERMIT_BLOCKING, BF_IMPREGNABLE',
        },
        {
            tile: 'WALL_LEVER',
            flags:
                'BF_BUILD_IN_WALLS, BF_IN_PASSABLE_VIEW_OF_ORIGIN, BF_BUILD_ANYWHERE_ON_LEVEL',
        },
    ],
});

const blue = GWD.blueprint.install('ROOM', {
    flags: 'BP_ROOM',
    size: '10-100',
    steps: [{ flags: 'BF_BUILD_AT_ORIGIN, BF_BUILD_VESTIBULE' }],
});

const canvas = GWU.canvas.make({ font: 'monospace', width: 80, height: 34 });
SHOW(canvas.node);

builder.build(blue).then(() => {
    map.drawInto(canvas);
    canvas.render();
});
```

### Throwing Tutorial

Brogue has a (now removed?) throwing tutorial that has a pressure plate in the middle of a hole. When you throw something on the pressure plate, it opens the door. Lets replicate that.

```js
const open = GWM.tile.install('PORTCULLIS_OPEN', {
    extends: 'FLOOR',
    priority: '+1',
    effects: {
        machine: {
            tile: 'PORTCULLIS_CLOSED',
            message: 'The portcullis slams down from the ceiling.',
            flags: 'E_EVACUATE_CREATURES',
        },
    },
});

const closed = GWM.tile.install('PORTCULLIS_CLOSED', {
    extends: 'WALL',
    priority: '+1',
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

const plate = GWM.tile.install('PRESSURE_PLATE', {
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

const depressed = GWM.tile.install('PRESSURE_PLATE_DEPRESSED', {
    extends: 'FLOOR',
    priority: '+10',
    ch: 'v',
    fg: 0x00f,
    effects: {
        exit: { tile: 'PRESSURE_PLATE' },
    },
});

const chasm = GWM.tile.install('CHASM', {
    extends: 'FLOOR',
    priority: '+2',
    ch: ' ',
    flavor: 'a chasm',
    flags: 'T_AUTO_DESCENT',
});

const edge = GWM.tile.install('CHASM_EDGE', {
    extends: 'FLOOR',
    priority: '+1',
    ch: ':',
    fg: 0x777,
    flavor: 'a chasm edge',
});

GWM.effect.install('CHASM_EDGE', { tile: 'CHASM_EDGE,100' });
GWM.effect.install('CHASM_MEDIUM', {
    tile: 'CHASM,150,50',
    flags: 'E_NEXT_EVERYWHERE, E_ABORT_IF_BLOCKS_MAP',
    next: 'CHASM_EDGE',
});
GWM.effect.install('HOLE_WITH_PLATE', {
    tile: 'PRESSURE_PLATE',
    next: 'CHASM_MEDIUM',
});

GWD.room.install('ENTRANCE', new GWD.room.BrogueEntrance());
GWD.room.install(
    'ROOM',
    new GWD.room.Rectangular({ width: '4-10', height: '4-10' })
);

GWD.blueprint.install('VESTIBULE', {
    flags: 'BP_VESTIBULE',
    size: '40-200',
    steps: [
        {
            effect: 'CHASM_MEDIUM',
            tile: 'PRESSURE_PLATE',
            flags:
                'BF_TREAT_AS_BLOCKING, BF_FAR_FROM_ORIGIN, BF_IN_PASSABLE_VIEW_OF_ORIGIN',
        },
        {
            tile: 'PORTCULLIS_CLOSED',
            flags: 'BF_BUILD_AT_ORIGIN, BF_PERMIT_BLOCKING, BF_IMPREGNABLE',
        },
    ],
});

const blue = GWD.blueprint.install('ROOM', {
    flags: 'BP_ROOM',
    size: '10-100',
    steps: [{ flags: 'BF_BUILD_AT_ORIGIN, BF_BUILD_VESTIBULE' }],
});

const map = GWM.map.make(80, 34, { visible: true });

const level = new GWD.Level({
    seed: 12345,
    rooms: { count: 20, first: 'ENTRANCE', digger: 'ROOM' },
    doors: { chance: 0 },
    loops: false,
    lakes: false,
});
level.create(map);

const builder = new GWD.blueprint.Builder(map, 1);

const canvas = GWU.canvas.make({
    font: 'monospace',
    width: 80,
    height: 34,
    loop: LOOP,
});
SHOW(canvas.node);

LOOP.run(
    {
        start: async () => {
            await builder.build(blue);
        },
        click: async (e) => {
            await map.fire('enter', e.x, e.y);
        },
        tick: async (e) => {
            await map.tick();
        },
        draw() {
            map.drawInto(canvas);
            canvas.render();
        },
    },
    500
);
```
