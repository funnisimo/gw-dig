# Room with a Door

The most basic build for a map is just to add a door to the room. This recipe adds a carpet to the floor of the room and puts a door on the entrance.

## Setup

```js
GWM.tile.install('CARPET', { extends: 'FLOOR', ch: '%', fg: 0x800 });
GWD.room.install('ENTRANCE', new GWD.room.BrogueEntrance());
GWD.room.install(
    'ROOM',
    new GWD.room.Rectangular({ width: '4-10', height: '4-10' })
);
```

## Using tile effect

```js
const map = GWM.map.make(80, 34, { visible: true });

const digger = new GWD.Digger({
    //seed: 12345,
    rooms: { count: 40, first: 'ENTRANCE', digger: 'ROOM' },
    doors: { chance: 0 },
    loops: false,
    lakes: false,
});

const builder = new GWD.blueprint.Builder({
    //seed: 12345
});

const room = GWD.blueprint.make({
    id: 'ROOM',
    flags: 'BP_ROOM',
    size: '10-100',
    steps: [
        { tile: 'CARPET', flags: 'BS_EVERYWHERE' },
        { tile: 'DOOR', flags: 'BS_BUILD_AT_ORIGIN' },
    ],
});

const canvas = GWU.canvas.make({
    font: 'monospace',
    width: 80,
    height: 34,
    loop: LOOP,
});
SHOW(canvas.node);

async function buildMap() {
    map.clear();
    await digger.create(map);
    await builder.build(map, room);
    map.drawInto(canvas);
    canvas.render();
}

LOOP.run({
    start: buildMap,
    Enter: buildMap,
});
```

## Door via Vestibule

Another way to protect a room is to use a vestibule machine. This builds another machine on the outside of the room that protects the room. Here we do a simple door vestibule, but as we will see later, vestibules can get more complicated.

```js
const map = GWM.map.make(80, 34, { visible: true });

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
    steps: [{ tile: 'DOOR', flags: 'BS_BUILD_AT_ORIGIN' }],
});

const room = GWD.blueprint.make({
    id: 'ROOM',
    flags: 'BP_ROOM',
    size: '10-100',
    steps: [
        { tile: 'CARPET', flags: 'BS_EVERYWHERE' },
        { flags: 'BS_BUILD_VESTIBULE' },
    ],
});

const builder = new GWD.blueprint.Builder({
    // seed: 12345,
    blueprints: { room, vestibule },
});

const canvas = GWU.canvas.make({
    font: 'monospace',
    width: 80,
    height: 34,
    loop: LOOP,
});
SHOW(canvas.node);

async function buildMap() {
    map.clear();
    await digger.create(map);
    await builder.build(map, room);
    map.drawInto(canvas);
    canvas.render();
}

LOOP.run({
    start: buildMap,
    Enter: buildMap,
});
```