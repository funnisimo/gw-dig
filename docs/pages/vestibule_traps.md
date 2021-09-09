### Vestibule with traps

Using 'BS_REPEAT_UNTIL_NO_PROGRESS' allows you to fill an area, except for any other restrictions that you place on it - e.g. 'BS_TREAT_AS_BLOCKING'. Here is an example of creating a set of traps that create a random safe path to the doorway.

```js
const portcullis = GWM.tile.install('TRAP', {
    extends: 'FLOOR',
    priority: '+1',
    fg: 0x800, // So you can see them - probably would want this hidden in the real game...
    flags: 'T_IS_TRAP',
    effects: {
        enter: { message: "It's a trap!", flash: true }, // Really do something nasty here, but that is another demo...
    },
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

const vestibule = GWD.blueprint.make({
    id: 'VESTIBULE',
    flags: 'BP_VESTIBULE, BP_NOT_IN_HALLWAY',
    size: '10-40',
    steps: [
        {
            tile: 'DOOR',
            flags: 'BS_BUILD_AT_ORIGIN, BS_PERMIT_BLOCKING, BS_IMPREGNABLE',
        },
        {
            tile: 'TRAP',
            flags: 'BS_REPEAT_UNTIL_NO_PROGRESS, BS_TREAT_AS_BLOCKING',
        },
    ],
});

const room = GWD.blueprint.make({
    id: 'ROOM',
    flags: 'BP_ROOM',
    size: '10-100',
    steps: [{ flags: 'BS_BUILD_AT_ORIGIN, BS_BUILD_VESTIBULE' }],
});

const map = GWM.map.make(80, 34, { visible: true });
const canvas = GWU.canvas.make({
    font: 'monospace',
    width: map.width,
    height: map.height,
});
SHOW(canvas.node);

const builder = new GWD.blueprint.Builder({
    seed: 12345,
    blueprints: [vestibule, room],
});

digger
    .create(map)
    .then(async () => {
        await builder.build(map, room);
    })
    .then(() => {
        map.drawInto(canvas);
        canvas.render();
    });
```
