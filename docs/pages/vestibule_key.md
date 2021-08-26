### Vestibule with a key

Here, we create a locked door and place the key in a random place on the map.

The demo is interactive. Click on the key to pick it up. Move it to the door to unlock it.

```js
GWM.tile.install('LOCKED_DOOR', {
    extends: 'DOOR',
    bg: 'red',
    effects: {
        enter: null,
        key: { tile: 'FLOOR' },
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

const level = new GWD.Level({
    seed: 12345,
    rooms: { count: 20, first: 'ENTRANCE', digger: 'ROOM' },
    doors: { chance: 0 },
    loops: false,
    lakes: false,
});

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

const map = GWM.map.make(80, 34, { visible: true });
level.create(map);
const builder = new GWD.blueprint.Builder(map, 1);
builder.build(blue, 20, 11);

const canvas = GWU.canvas.make({
    font: 'monospace',
    width: map.width,
    height: map.height,
    loop: LOOP,
});
map.drawInto(canvas);
SHOW(canvas.node);
canvas.render();

let carried = null;

LOOP.run(
    {
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
            map.drawInto(canvas);
            canvas.render();
        },
    },
    200
);
```
