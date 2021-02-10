import { Random, types as Types, colors as COLORS } from 'gw-utils';
import { Map } from '../ts/map';
import { Layer } from '../ts/flags';

export const rnd = jest.fn();
export const counts = new Array(100).fill(0);

export let v = 0;
let index = 0;
const addends = [3, 17, 37, 5, 59];

export function mockRandom() {
    v = 0;
    rnd.mockImplementation(() => {
        index = (index + 1) % addends.length;
        const add = addends[index];
        v = (v + add) % 100;
        counts[v] += 1;
        return v / 100;
    });
    const make = jest.fn().mockImplementation(() => {
        counts.fill(0);
        index = 0;
        return rnd;
    });
    // @ts-ignore
    Random.configure({ make });
    make.mockClear();
    return rnd;
}

export async function alwaysAsync(fn: Function, count = 1000) {
    for (let i = 0; i < count; ++i) {
        await fn();
    }
}

export function countTile(map: Map, tile: string) {
    let count = 0;
    map.forEach((cell) => {
        if (cell.hasTile(tile)) ++count;
    });
    return count;
}

export function makeActor() {
    return ({
        rememberedInCell: null,
        sprite: { ch: '@', fg: COLORS.blue, bg: -1 },
        layer: Layer.ACTOR,
        priority: 50,
        isPlayer: jest.fn().mockReturnValue(false),
        delete: jest.fn(),
        avoidsCell: jest.fn().mockReturnValue(false),
        blocksVision: jest.fn().mockReturnValue(false),
    } as unknown) as Types.ActorType;
}

export function makePlayer() {
    const player = makeActor();
    // @ts-ignore
    player.isPlayer.mockReturnValue(true);
    return player;
}

export function makeItem() {
    return ({
        quantity: 1,
        sprite: { ch: '!', fg: 'white' },
        layer: Layer.ITEM,
        isDetected: jest.fn().mockReturnValue(false),
        forbidsCell: jest.fn().mockReturnValue(false),
        clone: jest.fn().mockImplementation(makeItem),
        delete: jest.fn(),
    } as unknown) as Types.ItemType;
}
