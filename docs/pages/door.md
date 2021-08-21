## Room with a Door

The most basic build for a map is just to add a door to the room. This recipe adds a carpet to the floor of the room and puts a door on the entrance.

```js
const canvas = GW.canvas.make({ font: 'monospace', width: 80, height: 34 });
const map = GW.map.make(80, 34, { visible: true });

GW.tile.install('CARPET', { extends: 'FLOOR', ch: '%', fg: 0x800 });
GWDig.room.install('ENTRANCE', new GWDig.room.BrogueEntrance());
GWDig.room.install(
    'ROOM',
    new GWDig.room.Rectangular({ width: '4-10', height: '4-10' })
);

const level = new GWDig.Level({
    seed: 12345,
    rooms: { count: 20, first: 'ENTRANCE', digger: 'ROOM' },
    doors: { chance: 0 },
    loops: false,
    lakes: false,
});
level.create(map);

const builder = new GWDig.blueprint.Builder(map, 1);

const blue = new GWDig.blueprint.Blueprint({
    flags: 'BP_ROOM',
    size: '10-100',
    steps: [
        { tile: 'CARPET', flags: 'BF_EVERYWHERE' },
        { tile: 'DOOR', flags: 'BF_BUILD_AT_ORIGIN' },
    ],
});

SHOW(builder.buildBlueprint(blue));

map.drawInto(canvas);
SHOW(canvas.node);
canvas.render();
```
