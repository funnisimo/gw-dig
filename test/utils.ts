// import * as GWU from 'gw-utils';

// const Random = GWU.rng.Random;

// export const rnd = jest.fn();
// export const counts = new Array(100).fill(0);

// export let v = 0;
// let index = 0;
// const addends = [3, 17, 37, 5, 59];

// export function mockRandom() {
//     v = 0;
//     rnd.mockImplementation(() => {
//         index = (index + 1) % addends.length;
//         const add = addends[index];
//         v = (v + add) % 100;
//         counts[v] += 1;
//         return v / 100;
//     });
//     const make = jest.fn().mockImplementation(() => {
//         counts.fill(0);
//         index = 0;
//         return rnd;
//     });
//     // @ts-ignore
//     Random.configure({ make });
//     make.mockClear();
//     return rnd;
// }

export function always(fn: Function, count = 1000) {
    for (let i = 0; i < count; ++i) {
        fn();
    }
}

export async function alwaysAsync(fn: Function, count = 1000) {
    for (let i = 0; i < count; ++i) {
        await fn();
    }
}

export function results(fn: Function, count = 1000): any[] {
    const r = [];
    for (let i = 0; i < count; ++i) {
        const v = fn();
        if (r.indexOf(v) < 0) {
            r.push(v);
        }
    }
    r.sort();
    return r;
}
