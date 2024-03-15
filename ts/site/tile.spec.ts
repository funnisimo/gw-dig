import * as TILE from './tile';

describe('Tile', () => {
    test('NONE', () => {
        const NONE = TILE.getTile('NONE')!;
        expect(NONE.id).toEqual('NONE');
        expect(NONE.index).toEqual(0);
        expect(NONE.priority).toEqual(0);
    });
    test('FLOOR', () => {
        const FLOOR = TILE.getTile('FLOOR')!;
        expect(FLOOR.id).toEqual('FLOOR');
        expect(FLOOR.index).toEqual(1);
        expect(FLOOR.priority).toEqual(10);
    });
    test('WALL', () => {
        const WALL = TILE.getTile('WALL')!;
        expect(WALL.id).toEqual('WALL');
        expect(WALL.index).toEqual(2);
        expect(WALL.priority).toEqual(50);
    });

    describe('installTile - TEST', () => {
        test('install empty', () => {
            const t = TILE.installTile('TEST1');
            expect(t.index).toBeGreaterThan(0);
            expect(t.id).toEqual('TEST1');
            expect(t.priority).toEqual(0); // no priority given, no extends
            expect(t).not.toHaveProperty('extends');
        });
        test('install extends', () => {
            const t2 = TILE.installTile('TEST2', {
                priority: 40,
                tags: ['a', 'b'],
            });
            expect(t2.index).toBeGreaterThan(0);
            expect(t2.id).toEqual('TEST2');
            expect(t2.priority).toEqual(40);
            expect(t2.tags).toEqual(['a', 'b']);

            const t3 = TILE.installTile('TEST3', {
                extends: 'TEST2',
                priority: '+10',
                tags: ['!a', 'c'],
            });
            expect(t3.index).toBeGreaterThan(0);
            expect(t3.id).toEqual('TEST3');
            expect(t3.priority).toEqual(50);
            expect(t3.tags).toEqual(['b', 'c']);

            const t4 = TILE.installTile('TEST4', {
                priority: 'TEST2-10',
                tags: ['!b', 'c'],
            });
            expect(t4.index).toBeGreaterThan(0);
            expect(t4.id).toEqual('TEST4');
            expect(t4.priority).toEqual(30);
            expect(t4.tags).toEqual(['c']);
        });
    });

    test('custom field', () => {
        const factory = new TILE.TileFactory();

        factory.installField('test', (c, u) => (c || 0) + Number.parseInt(u));

        const t = factory.install('TEST', {
            test: '1',
        });
        expect(t.test).toEqual(1);

        const t2 = factory.install('TEST3', {
            extends: 'TEST',
            test: 2,
        });
        expect(t2.test).toEqual(3);
    });
});
