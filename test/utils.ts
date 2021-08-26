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
