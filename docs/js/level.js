let CANVAS = null;
let BUFFER = null;
let LEVEL_ID = 0;
let DUNGEON = null;
const startingXY = [40, 28];

GW.random.seed(12345);

function newDungeon() {
    DUNGEON = new GW.dig.Dungeon({
        levels: 10,
        width: 80,
        height: 34,
        seed: 23456,
        rooms: {
            count: 20,
            digger: 'DEFAULT',
            entrance: new GW.dig.room.BrogueEntrance(),
            // first: 'FIRST_ROOM',
        },
        doors: { chance: 50 },
        halls: { chance: 25 },
        loops: { minDistance: 20, maxLength: 5 },
        lakes: { count: 5, wreath: 1, wreathChance: 25 },
        bridges: {
            minDistance: 20,
            maxLength: 5,
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
