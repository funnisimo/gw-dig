let CANVAS = null;
let BUFFER = null;
let LEVEL_ID = 0;
let DUNGEON = null;
const startingXY = [40, 28];

GW.dig.room.install(
    'ROOM',
    new GW.dig.room.Rectangular({ width: 20, height: 10 })
);
GW.dig.room.install('CROSS', new GW.dig.room.Cross({ width: 12, height: 7 }));
GW.dig.room.install(
    'SYMMETRICAL_CROSS',
    new GW.dig.room.SymmetricalCross({
        width: 8,
        height: 5,
    })
);
GW.dig.room.install(
    'SMALL_ROOM',
    new GW.dig.room.Rectangular({
        width: 6,
        height: 4,
    })
);
GW.dig.room.install(
    'LARGE_ROOM',
    new GW.dig.room.Rectangular({
        width: 40,
        height: 20,
    })
);
GW.dig.room.install(
    'HUGE_ROOM',
    new GW.dig.room.Rectangular({
        width: 76,
        height: 28,
    })
);
GW.dig.room.install(
    'SMALL_CIRCLE',
    new GW.dig.room.Circular({
        width: 6,
        height: 6,
    })
);
GW.dig.room.install(
    'LARGE_CIRCLE',
    new GW.dig.room.Circular({
        width: 10,
        height: 10,
    })
);
GW.dig.room.install(
    'BROGUE_DONUT',
    new GW.dig.room.BrogueDonut({
        width: 10,
        height: 10,
        ringMinWidth: 3,
        holeMinSize: 3,
        holeChance: 50,
    })
);
GW.dig.room.install(
    'COMPACT_CAVE',
    new GW.dig.room.Cavern({
        width: 12,
        height: 8,
    })
);
GW.dig.room.install(
    'LARGE_NS_CAVE',
    new GW.dig.room.Cavern({
        width: 12,
        height: 27,
    })
);
GW.dig.room.install(
    'LARGE_EW_CAVE',
    new GW.dig.room.Cavern({
        width: 27,
        height: 8,
    })
);
GW.dig.room.install(
    'BROGUE_CAVE',
    new GW.dig.room.ChoiceRoom({
        choices: ['COMPACT_CAVE', 'LARGE_NS_CAVE', 'LARGE_EW_CAVE'],
    })
);
GW.dig.room.install(
    'HUGE_CAVE',
    new GW.dig.room.Cavern({ width: 77, height: 27 })
);
GW.dig.room.install(
    'BROGUE_ENTRANCE',
    new GW.dig.room.BrogueEntrance({
        width: 20,
        height: 10,
    })
);
GW.dig.room.install(
    'CHUNKY',
    new GW.dig.room.ChunkyRoom({
        width: 10,
        height: 10,
    })
);

GW.dig.room.install(
    'PROFILE',
    new GW.dig.room.ChoiceRoom({
        choices: {
            ROOM: 10,
            CROSS: 20,
            SYMMETRICAL_CROSS: 20,
            LARGE_ROOM: 5,
            SMALL_CIRCLE: 10,
            LARGE_CIRCLE: 5,
            BROGUE_DONUT: 5,
            CHUNKY: 10,
        },
    })
);

GW.dig.room.install(
    'FIRST_ROOM',
    new GW.dig.room.ChoiceRoom({
        choices: {
            ROOM: 5,
            CROSS: 5,
            SYMMETRICAL_CROSS: 5,
            LARGE_ROOM: 5,
            HUGE_ROOM: 5,
            LARGE_CIRCLE: 5,
            BROGUE_DONUT: 5,
            BROGUE_CAVE: 30, // These are harder to match
            HUGE_CAVE: 30, // ...
            BROGUE_ENTRANCE: 5,
            CHUNKY: 5,
        },
    })
);

function newDungeon(seed) {
    if (typeof seed !== 'number') seed = 0;
    seed = seed || Date.now();
    console.log('New Dungeon - ' + seed);

    DUNGEON = new GW.dig.Dungeon({
        levels: 10,
        width: 80,
        height: 34,
        seed,
        rooms: {
            count: 20,
            digger: 'PROFILE',
            entrance: 'BROGUE_ENTRANCE',
            first: 'FIRST_ROOM',
        },
        doors: { chance: 50 },
        halls: { chance: 25 },
        loops: { minDistance: 20, maxLength: 7 },
        lakes: { count: 2, wreathSize: 1, wreathChance: 25 },
        bridges: {
            minDistance: 20,
            maxLength: 7,
        },
    });
    LEVEL_ID = 0;

    showCurrentLevel();
}

function changeLevel(e) {
    if (!e.dir) return false;

    LEVEL_ID = GW.utils.clamp(
        LEVEL_ID + e.dir[0] + e.dir[1],
        0,
        DUNGEON.levels - 1
    );
    showCurrentLevel();
}

function prevLevel() {
    LEVEL_ID = Math.max(0, LEVEL_ID - 1);
    showCurrentLevel();
}

function nextLevel() {
    LEVEL_ID = Math.min(DUNGEON.levels - 1, LEVEL_ID + 1);
    showCurrentLevel();
}

function showCurrentLevel() {
    console.log('level = ' + LEVEL_ID);
    BUFFER.blackOut();
    DUNGEON.getLevel(LEVEL_ID, (x, y, v) => {
        const id = GW.dig.TILEMAP[v];
        const sprite = GW.tiles[id].sprite;
        BUFFER.drawSprite(x, y, sprite);
    });
    BUFFER.render();
}

// start the environment
function start() {
    GW.random.seed(12345);

    CANVAS = GW.canvas.make({ width: 80, height: 34, div: 'game' });
    BUFFER = CANVAS.buffer;
    LEVEL_ID = 0;

    newDungeon();

    document.onkeydown = GW.io.onkeydown;

    GW.loop.run({
        Enter: newDungeon,

        dir: changeLevel,

        '>': nextLevel,
        '+': nextLevel,

        '<': prevLevel,
        '-': prevLevel,

        // '?': showHelp,
    });
}

window.onload = start;
