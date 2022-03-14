import * as ITEM from './item';

describe('Horde', () => {
    afterEach(() => {
        ITEM.items.length = 0;
    });

    test('install', () => {
        const me = ITEM.installItem({
            id: 'ME',
            frequency: 100,
        });

        expect(me.make).toEqual({});
        expect(me.tags).toEqual([]);

        expect(ITEM.pickItem(10, 'wild')).toBeNull();
        expect(ITEM.pickItem(10, '')).toBe(me);
    });

    test('install', () => {
        const me = ITEM.installItem({
            id: 'ME',
            frequency: 100,
            tags: 'awesome',
        });

        expect(me.tags).toEqual(['awesome']);

        expect(ITEM.pickItem(10, 'wild')).toBeNull();
        expect(ITEM.pickItem(10, '')).toBe(me);
        expect(ITEM.pickItem(10, 'awesome')).toBe(me);
    });
});
