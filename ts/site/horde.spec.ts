import * as HORDE from './horde';

describe('Horde', () => {
    afterEach(() => {
        HORDE.hordes.length = 0;
    });

    test('install', () => {
        const me = HORDE.installHorde({
            leader: 'ME',
            frequency: 100,
        });

        expect(me.make).toEqual({});
        expect(me.members).toEqual({});
        expect(me.tags).toEqual([]);

        expect(HORDE.pickHorde(10, 'wild')).toBeNull();
        expect(HORDE.pickHorde(10, '')).toBe(me);
    });

    test('install', () => {
        const me = HORDE.installHorde({
            leader: 'ME',
            frequency: 100,
            tags: 'awesome',
        });

        expect(me.tags).toEqual(['awesome']);

        expect(HORDE.pickHorde(10, 'wild')).toBeNull();
        expect(HORDE.pickHorde(10, '')).toBe(me);
        expect(HORDE.pickHorde(10, 'awesome')).toBe(me);
    });
});
