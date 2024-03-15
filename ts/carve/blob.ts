import { rng as Rng, grid as Grid, blob as Blob, xy } from 'gw-utils/index';

export type NumOpts =
    | number
    | [number]
    | [number, number]
    | ((rng: Rng.Random) => number);

export interface CarveBlobOpts {
    rng?: Rng.Random;
    width?: NumOpts;
    height?: NumOpts;
    minWidthPct?: number;
    minHeightPct?: number;
    rounds?: number;
    percentSeeded?: number;
    birthParameters?: string;
    survivalParameters?: string;
    seedWidthPct?: number;
    seedHeightPct?: number;
    largestOnly?: boolean;
}

export function calcNumber(rng: Rng.Random, config: NumOpts): number {
    if (typeof config === 'number') {
        return config;
    }
    if (Array.isArray(config)) {
        if (config.length == 1) {
            return rng.int(config[0]);
        } else if (config.length == 2) {
            return rng.range(config[0], config[1]);
        }
    }
    if (typeof config === 'function') {
        return config(rng);
    }
    throw new Error('Invalid number config: ' + JSON.stringify(config));
}

export function asPercent(num: number): number {
    if (num <= 1) return num;
    return num / 100;
}

export function blob(site: Grid.NumGrid, opts: CarveBlobOpts = {}): xy.Bounds {
    const rng = opts.rng || Rng.random;

    const width = calcNumber(rng, opts.width || site.width - 2);
    const height = calcNumber(rng, opts.height || site.height - 2);

    const blobGrid = Grid.alloc(site.width, site.height, 0);

    const minWidthPct = asPercent(opts.minWidthPct || 50);
    const minHeightPct = asPercent(opts.minHeightPct || 50);
    const minWidth = Math.floor(minWidthPct * width);
    const maxWidth = width;
    const minHeight = Math.floor(minHeightPct * height);
    const maxHeight = height;

    const blobOpts = {
        rng: rng,
        rounds: opts.rounds || 5,
        minWidth: minWidth,
        minHeight: minHeight,
        maxWidth: maxWidth,
        maxHeight: maxHeight,
        percentSeeded: opts.percentSeeded || 55,
        birthParameters: opts.birthParameters || 'ffffftttt',
        survivalParameters: opts.survivalParameters || 'ffffttttt',
        largestOnly: opts.largestOnly !== false, // true by default
    } as Blob.BlobConfig;

    if (opts.seedWidthPct) {
        blobOpts.seedWidth = Math.floor(
            blobOpts.maxWidth * asPercent(opts.seedWidthPct)
        );
    }
    if (opts.seedHeightPct) {
        blobOpts.seedHeight = Math.floor(
            blobOpts.maxHeight * asPercent(opts.seedHeightPct)
        );
    }

    const blob = new Blob.Blob(blobOpts);

    const bounds = blob.carve(blobGrid.width, blobGrid.height, (x, y) =>
        blobGrid.set(x, y, 1)
    );

    // Position the new cave in the middle of the grid...
    const destX = Math.floor((site.width - bounds.width) / 2);
    const dx = destX - bounds.x;
    const destY = Math.floor((site.height - bounds.height) / 2);
    const dy = destY - bounds.y;

    // ...and copy it to the destination.
    blobGrid.forEach((v, x, y) => {
        if (v) site.set(x + dx, y + dy, 1);
    });
    Grid.free(blobGrid);

    bounds.x += dx;
    bounds.y += dy;
    return bounds;
}
