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
    size: [10, 10],
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

builder.build(blue, 20, 11);

const canvas = GWU.canvas.make({ font: 'monospace', width: 80, height: 34 });
map.drawInto(canvas);
SHOW(canvas.node);
canvas.render();
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
    'GWD.room',
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
    size: [1, 1],
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

builder.build(blue, 20, 11);

const canvas = GWU.canvas.make({ font: 'monospace', width: 80, height: 34 });
map.drawInto(canvas);
SHOW(canvas.node);
canvas.render();
```
