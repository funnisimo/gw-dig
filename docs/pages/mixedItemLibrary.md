# Mixed Item Library

Here is an example reward room that has many treasure items in it. If you move one of the items off the altar that it sits on, all of the other altars close - thus locking them. This way you only get to take 1 item from the room.

Use the mouse click to pickup an item, then move it around. Click again to drop.

## Setup

```js
GWM.tile.install('CARPET', {
    depth: 'SURFACE',
    ch: ';',
    fg: 'brown',
});

GWM.tile.install('STATUE_INERT', {
    extends: 'WALL',
    ch: '&',
    flags: '!T_BLOCKS_VISION',
});

GWM.tile.install('ALTAR_CAGE_OPEN', {
    ch: 'O',
    bg: 'teal',
    priority: 'WALL-1',
    flags: 'L_BLOCKS_SURFACE, L_LIST_IN_SIDEBAR, L_VISUALLY_DISTINCT',
    effects: {
        machine: { tile: 'ALTAR_CAGE_CLOSED' },
        nokey: { activateMachine: true },
    },
    light: null, // 'CANDLE_LIGHT'
});

SHOW(GWM.tile.tiles.ALTAR_CAGE_OPEN.priority);

GWM.tile.install('ALTAR_CAGE_CLOSED', {
    ch: 'O',
    bg: 'red',
    priority: 'WALL-1',
    flags:
        'L_BLOCKS_MOVE, T_STAND_IN_TILE, L_BLOCKS_SURFACE, L_LIST_IN_SIDEBAR, L_VISUALLY_DISTINCT',
    effects: {
        machine: { tile: 'ALTAR_CAGE_OPEN' },
        key: { activateMachine: true },
    },
    light: null, // 'CANDLE_LIGHT'
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

GWM.item.install('SWORD', {
    tags: 'WEAPON',
    name: 'Sword',
    ch: 'S',
    fg: 'yellow',
});

GWM.item.install('DAGGER', {
    tags: 'WEAPON',
    name: 'Dagger',
    ch: 'D',
    fg: 'yellow',
});

GWM.item.install('SPEAR', {
    tags: 'WEAPON,THROWN',
    name: 'Spear',
    ch: 'P',
    fg: 'yellow',
});

GWM.item.install('CHARM', {
    tags: 'CHARM',
    name: 'Charm',
    ch: 'C',
    fg: 'yellow',
});
GWM.item.install('RING', {
    tags: 'RING',
    name: 'Ring',
    ch: 'R',
    fg: 'yellow',
});
```

## Library

```js
const map = GWM.map.make(80, 34);
map.properties.depth = 1;

const digger = new GWD.Digger({
    seed: 12345,
    rooms: { count: 40, first: 'ENTRANCE', digger: 'CHOICE' },
    doors: { chance: 0 },
    loops: false,
    lakes: false,
});

const vestibule = GWD.blueprint.install('DOOR', {
    size: '1',
    frequency: '1+',
    flags: 'BP_VESTIBULE',
    steps: [{ tile: 'DOOR', flags: 'BS_BUILD_AT_ORIGIN' }],
});

const room = GWD.blueprint.install('MIXED_ITEM_LIBRARY', {
    size: '30-60', // did 60 to make it large enough to use on chosen room (to force openInterior into action)
    frequency: '1-12: 30',
    flags:
        'BP_ROOM | BP_PURGE_INTERIOR | BP_SURROUND_WITH_WALLS | BP_OPEN_INTERIOR | BP_IMPREGNABLE | BP_REWARD',
    steps: [
        { tile: 'CARPET', flags: 'BS_EVERYWHERE' },
        { flags: 'BS_BUILD_VESTIBULE' },
        {
            tile: 'ALTAR_CAGE_OPEN',
            item: 'WEAPON|ARMOR|WAND|STAFF|RING|CHARM & !THROWN',
            count: 1,
            pad: 1, // pad is the radius of the circle around the tile (so 1 padding is all 8 tiles around the altar)
            flags: 'BS_TREAT_AS_BLOCKING, BS_ITEM_IS_KEY',
        },
        {
            tile: 'ALTAR_CAGE_OPEN',
            item: 'WEAPON|ARMOR|WAND & !THROWN',
            count: 3,
            pad: 1,
            flags: 'BS_TREAT_AS_BLOCKING, BS_ITEM_IS_KEY',
        },
        {
            tile: 'ALTAR_CAGE_OPEN',
            item: 'STAFF|RING|CHARM',
            count: '2-3',
            pad: 1,
            flags: 'BS_TREAT_AS_BLOCKING, BS_ITEM_IS_KEY',
        },
        {
            tile: 'STATUE_INERT',
            count: '2-3',
            flags: 'BS_BUILD_IN_WALLS | BS_TREAT_AS_BLOCKING',
        },
    ],
});

const builder = new GWD.blueprint.Builder({
    blueprints: [vestibule, room],
    // log: true,
});

const canvas = GWU.canvas.make({
    font: 'monospace',
    width: 80,
    height: 34,
    loop: LOOP,
});
SHOW(canvas.node);

let carried = null;

LOOP.run({
    async start() {
        await digger.create(map);
        await builder.build(map, room, 68, 21);
    },
    click: (e) => {
        if (carried) {
            carried = null;
        } else {
            carried = map.itemAt(e.x, e.y);
        }
    },
    mousemove: async (e) => {
        if (!carried) return;
        await map.moveItem(e.x, e.y, carried);
        if (carried.isDestroyed) {
            carried = null;
        }
    },
    tick: async (e) => {
        await map.tick();
    },
    draw() {
        map.drawInto(canvas);
        canvas.render();
    },
});
```
