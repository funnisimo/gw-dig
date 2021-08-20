## Room with a Door

The most basic build for a map is just to add a door to the room. This recipe adds a carpet to the floor of the room and puts a door on the entrance.

```js
const canvas = GW.canvas.make({ font: 'monospace', width: 80, height: 34 });
const map = GW.map.make(80, 34, { visible: true });

GWDig.dig.room.install('ENTRANCE', new GWDig.dig.room.BrogueEntrance());
GWDig.dig.room.install('ROOM', new GWDig.dig.room.Rectangular());

const level = new GWDig.dig.Level(80, 34, {
    seed: 12345,
    rooms: { count: 20, first: 'ENTRANCE', digger: 'ROOM' },
    doors: { chance: 50 },
    halls: { chance: 50 },
    loops: { minDistance: 20, maxLength: 5 },
    lakes: {
        count: 5,
        wreathSize: 1,
        wreathChance: 50,
        width: 10,
        height: 10,
    },
    bridges: {
        minDistance: 10,
        maxLength: 10,
    },
    stairs: { up: [40, 32], down: true },
});

level.create((x, y, t) => map.setTile(x, y, t));

map.drawInto(canvas);
SHOW(canvas.node);
canvas.render();
```
