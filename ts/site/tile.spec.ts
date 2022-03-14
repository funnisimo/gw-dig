import * as TILE from './tile';

describe('Tile', () => {
    test('NONE', () => {
        const NONE = TILE.getTile('NONE');
        expect(NONE.id).toEqual('NONE');
        expect(NONE.index).toEqual(0);
        expect(NONE.priority).toEqual(0);
    });
    test('FLOOR', () => {
        const FLOOR = TILE.getTile('FLOOR');
        expect(FLOOR.id).toEqual('FLOOR');
        expect(FLOOR.index).toEqual(1);
        expect(FLOOR.priority).toEqual(10);
    });
    test('WALL', () => {
        const WALL = TILE.getTile('WALL');
        expect(WALL.id).toEqual('WALL');
        expect(WALL.index).toEqual(2);
        expect(WALL.priority).toEqual(50);
    });
    test('install empty', () => {
        const t = TILE.installTile('TEST');
        expect(t.index).toBeGreaterThan(0);
        expect(t.id).toEqual('TEST');
        expect(t.priority).toEqual(0); // no priority given, no extends
    });
    test('install priority', () => {
        const t = TILE.installTile('TEST', { priority: 40 });
        expect(t.index).toBeGreaterThan(0);
        expect(t.id).toEqual('TEST');
        expect(t.priority).toEqual(40);
    });
    test('install priority +10', () => {
        const t = TILE.installTile('TEST', { priority: '+10' });
        expect(t.index).toBeGreaterThan(0);
        expect(t.id).toEqual('TEST');
        expect(t.priority).toEqual(10);
    });
    test('install priority -10', () => {
        const t = TILE.installTile('TEST', { priority: '-10' });
        expect(t.index).toBeGreaterThan(0);
        expect(t.id).toEqual('TEST');
        expect(t.priority).toEqual(-10);
    });
});
