### Vestibule

Vestibules are built at the origin site of a machine. They allow you to place interesting things at the entrance. For example, some welcoming carpet...

First lets install some things that we will use over and over in these examples...

```js
// TILES
GWM.tile.install('CARPET', { extends: 'FLOOR', ch: '%', fg: 0x800 });

GWM.tile.install('WALL_LEVER', {
    extends: 'WALL',
    priority: '+10',
    fg: 0x800,
    ch: '\\',
    flags: 'L_LIST_IN_SIDEBAR, L_VISUALLY_DISTINCT',
});

GWM.tile.install('PORTCULLIS_OPEN', {
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

GWM.tile.install('PORTCULLIS_CLOSED', {
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
    ch: ' ',
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

// EFFECTS
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

// DIGGER ROOMS
GWD.room.install('ENTRANCE', new GWD.room.BrogueEntrance());
GWD.room.install(
    'ROOM',
    new GWD.room.Rectangular({ width: '4-10', height: '4-10' })
);
```

# Carpet outside room

Now lets build a room with a door and some carpet outside the room...

```js
const map = GWM.map.make(80, 34, {
    visible: true,
    // seed: 12345
});

const digger = new GWD.Digger({
    // seed: 12345,
    rooms: { count: 40, first: 'ENTRANCE', digger: 'ROOM' },
    doors: { chance: 0 },
    loops: false,
    lakes: false,
});

const vestibule = GWD.blueprint.make({
    id: 'VESTIBULE',
    flags: 'BP_VESTIBULE',
    size: '5-10',
    steps: [
        { tile: 'DOOR', flags: 'BF_BUILD_AT_ORIGIN' },
        { tile: 'CARPET', flags: 'BF_EVERYWHERE' },
    ],
});

const room = GWD.blueprint.make({
    id: 'ROOM',
    flags: 'BP_ROOM',
    size: '10-100',
    steps: [{ flags: 'BF_BUILD_VESTIBULE' }],
});

const builder = new GWD.blueprint.Builder(map, {
    // seed: 12345,
    blueprints: [vestibule, room],
});

const canvas = GWU.canvas.make({
    font: 'monospace',
    width: 80,
    height: 34,
    loop: LOOP,
});
SHOW(canvas.node);

async function buildMap() {
    await digger.create(map);
    await builder.build(room);
}

LOOP.run({
    start: buildMap,
    Enter: buildMap,
    draw() {
        map.drawInto(canvas);
        canvas.render();
    },
});
```

### Vestibule with lever

You can also build tiles outside the vestibule's interior area with the 'BF_BUILD_ANYWHERE_ON_LEVEL' flag.

```js
const map = GWM.map.make(80, 34, { visible: true });

const digger = new GWD.Digger({
    seed: 12345,
    rooms: { count: 20, first: 'ENTRANCE', digger: 'ROOM' },
    doors: { chance: 0 },
    loops: false,
    lakes: false,
});

const vestibule = GWD.blueprint.make({
    id: 'VESTIBULE',
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
                'BF_BUILD_IN_WALLS, BF_IN_PASSABLE_VIEW_OF_ORIGIN, BF_BUILD_ANYWHERE_ON_LEVEL, BF_NOT_IN_HALLWAYS',
        },
    ],
});

const room = GWD.blueprint.make({
    id: 'ROOM',
    flags: 'BP_ROOM',
    size: '10-100',
    steps: [{ flags: 'BF_BUILD_AT_ORIGIN, BF_BUILD_VESTIBULE' }],
});

const builder = new GWD.blueprint.Builder(map, {
    seed: 12345,
    blueprints: { vestibule, room },
});

const canvas = GWU.canvas.make({ font: 'monospace', width: 80, height: 34 });
SHOW(canvas.node);

digger
    .create(map)
    .then(async () => {
        await builder.build(room);
    })
    .then(() => {
        map.drawInto(canvas);
        canvas.render();
    });
```

### Throwing Tutorial

Brogue has a (now removed?) throwing tutorial that has a pressure plate in the middle of a hole. When you throw something on the pressure plate, it opens the door. Lets replicate that.

```js
const vestibule = GWD.blueprint.make({
    id: 'VESTIBULE',
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

const room = GWD.blueprint.make({
    id: 'ROOM',
    flags: 'BP_ROOM',
    size: '10-100',
    steps: [{ flags: 'BF_BUILD_AT_ORIGIN, BF_BUILD_VESTIBULE' }],
});

const map = GWM.map.make(80, 34, { visible: true });

const digger = new GWD.Digger({
    seed: 12345,
    rooms: { count: 20, first: 'ENTRANCE', digger: 'ROOM' },
    doors: { chance: 0 },
    loops: false,
    lakes: false,
});

const builder = new GWD.blueprint.Builder(map, {
    seed: 12345,
    blueprints: { room, vestibule },
});

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
            await digger.create(map);
            await builder.build(room);
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
