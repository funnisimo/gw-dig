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
    fg: 'yellow',
    priority: 'WALL-1',
    flags: 'L_BLOCKS_EFFECTS, L_LIST_IN_SIDEBAR, L_VISUALLY_DISTINCT',
    effects: {
        machine: { tile: 'ALTAR_CAGE_CLOSED' },
        noKey: { activateMachine: true },
    },
    light: null, // 'CANDLE_LIGHT'
});

GWM.tile.install('ALTAR_CAGE_CLOSED', {
    ch: 'C',
    fg: 'yellow',
    priority: 'WALL-1',
    flags:
        'L_BLOCKS_MOVE, T_STAND_IN_TILE, L_BLOCKS_EFFECTS, L_LIST_IN_SIDEBAR, L_VISUALLY_DISTINCT',
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

// // Mixed item library -- can check one item out at a time
// [[1, 12],           [30, 50],	30,		6,			0,                  (BP_ROOM | BP_PURGE_INTERIOR | BP_SURROUND_WITH_WALLS | BP_OPEN_INTERIOR | BP_IMPREGNABLE | BP_REWARD),	[
// 	[0,			CARPET,		DUNGEON,		[0,0],		0,			0,			-1,			0,				0,				0,			0,			(MF_EVERYWHERE)],
// 	[0,			0,          0,              [1,1],		1,			0,          0,        0,				2,					0,			0,          (MF_BUILD_AT_ORIGIN | MF_PERMIT_BLOCKING | MF_BUILD_VESTIBULE)],

// 	[0,			ALTAR_CAGE_OPEN,DUNGEON,	[1,1],		1,			(WEAPON|ARMOR|WAND|STAFF|RING|CHARM),-1,0,2,	0,			(ITEM_IS_KEY | ITEM_KIND_AUTO_ID | ITEM_PLAYER_AVOIDS),	(MF_GENERATE_ITEM | MF_NO_THROWING_WEAPONS | MF_TREAT_AS_BLOCKING | MF_IMPREGNABLE)],
//  [0,			ALTAR_CAGE_OPEN,DUNGEON,	[3,3],		3,			(WEAPON|ARMOR|WAND),-1,	0,				2,					0,			(ITEM_IS_KEY | ITEM_KIND_AUTO_ID | ITEM_PLAYER_AVOIDS),	(MF_GENERATE_ITEM | MF_NO_THROWING_WEAPONS | MF_TREAT_AS_BLOCKING | MF_IMPREGNABLE)],
// 	[0,			ALTAR_CAGE_OPEN,DUNGEON,	[2,3],		2,			(STAFF|RING|CHARM),-1,	0,				2,					0,			(ITEM_IS_KEY | ITEM_KIND_AUTO_ID | ITEM_MAX_CHARGES_KNOWN | ITEM_PLAYER_AVOIDS),	(MF_GENERATE_ITEM | MF_NO_THROWING_WEAPONS | MF_TREAT_AS_BLOCKING | MF_IMPREGNABLE)],

// [0,			STATUE_INERT,DUNGEON,		[2,3],		0,			0,			-1,			0,				2,				0,          0,          (MF_TREAT_AS_BLOCKING | MF_BUILD_IN_WALLS | MF_IMPREGNABLE)]]],

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

LOOP.run({
    async start() {
        await digger.create(map);
        await builder.build(map, room, 68, 21);
    },
    draw() {
        map.drawInto(canvas);
        canvas.render();
    },
});
```
