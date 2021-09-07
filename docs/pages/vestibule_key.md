### Vestibule with a key

Here, we create a locked door and place the key in a random place on the map.

The demo is interactive. Click on the key to pick it up. Move it to the door to unlock it.

First, lets setup our dungeon builder...

```js
GWM.tile.install('LOCKED_DOOR', {
    extends: 'DOOR',
    bg: 'red',
    effects: {
        enter: null,
        key: { tile: 'DOOR' },
    },
});

GWM.item.install('KEY', {
    name: 'a key',
    ch: '~',
    fg: 'gold',
    tags: 'key',
});

GWD.room.install('ENTRANCE', new GWD.room.BrogueEntrance());
GWD.room.install(
    'ROOM',
    new GWD.room.Rectangular({ width: '4-10', height: '4-10' })
);

// Just
GWD.blueprint.install('ADPOTER', {
    flags: 'BP_ADOPT_ITEM',
    // size: '10-100',
    steps: [
        {
            flags: 'BF_ADOPT_ITEM, BF_TREAT_AS_BLOCKING',
        },
    ],
});

GWD.blueprint.install('VESTIBULE', {
    flags: 'BP_VESTIBULE',
    // size: '10-100',
    steps: [
        {
            tile: 'LOCKED_DOOR',
            item: 'key',
            flags:
                'BF_BUILD_AT_ORIGIN, BF_PERMIT_BLOCKING, BF_IMPREGNABLE, BF_ITEM_IS_KEY, BF_OUTSOURCE_ITEM_TO_MACHINE, BF_KEY_DISPOSABLE',
        },
    ],
});

const blue = GWD.blueprint.install('ROOM', {
    flags: 'BP_ROOM',
    size: '10-100',
    steps: [{ flags: 'BF_BUILD_AT_ORIGIN, BF_BUILD_VESTIBULE' }],
});
```

Now, lets generate a new dungeon...

```js
const map = GWM.map.make(80, 34, { visible: true });
const level = new GWD.Level({
    rooms: { count: 20, first: 'ENTRANCE', digger: 'ROOM' },
    doors: { chance: 0 },
    loops: false,
    lakes: false,
});
const builder = new GWD.blueprint.Builder(map);

const canvas = GWU.canvas.make({
    font: 'monospace',
    width: map.width,
    height: map.height,
    loop: LOOP,
});
canvas.node.tabIndex = -1;

SHOW(canvas.node);
// canvas.render();
const buffer = canvas.buffer;

let elapsed = 0;

async function buildMap() {
    buffer.blackOut();
    buffer.drawText(0, 0, 'Building Level', 'yellow');
    buffer.render();

    let start = Date.now();

    level.create(map);
    await builder.build('ROOM');

    elapsed = Date.now() - start;
}

let carried = null;

LOOP.run(
    {
        start: async () => {
            await buildMap();
        },
        Enter: buildMap,
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
        draw: () => {
            map.drawInto(buffer);
            buffer.drawText(0, 0, 'Elapsed: ' + Math.floor(elapsed), 'yellow');
            buffer.render();
        },
    },
    200
);
```
