import { rng as Rng, grid as Grid, xy } from 'gw-utils/index';
import { type NumOpts, calcNumber } from './blob';

export interface CarveChunkOpts {
    rng?: Rng.Random;
    count?: NumOpts;
    width?: NumOpts;
    height?: NumOpts;
}

export function chunk(site: Grid.NumGrid, opts: CarveChunkOpts = {}) {
    const rng = opts.rng || Rng.random;
    const chunkGrid = Grid.alloc(site.width, site.height, 0);

    const chunkCount = calcNumber(rng, opts.count || 5);

    const width = calcNumber(rng, opts.width || Math.floor(site.width / 4));
    const height = calcNumber(rng, opts.height || Math.floor(site.height / 4));
    const tile = 1;

    const minX = Math.floor(site.width / 2) - Math.floor(width / 2);
    const maxX = Math.floor(site.width / 2) + Math.floor(width / 2);
    const minY = Math.floor(site.height / 2) - Math.floor(height / 2);
    const maxY = Math.floor(site.height / 2) + Math.floor(height / 2);

    let left = Math.floor(site.width / 2);
    let right = left;
    let top = Math.floor(site.height / 2);
    let bottom = top;

    xy.forCircle(left, top, 2, (x, y) => chunkGrid.set(x, y, tile));
    left -= 2;
    right += 2;
    top -= 2;
    bottom += 2;

    for (let i = 0; i < chunkCount; ) {
        const x = rng.range(minX, maxX);
        const y = rng.range(minY, maxY);
        if (site.get(x, y) == tile) {
            if (x - 2 < minX) continue;
            if (x + 2 > maxX) continue;
            if (y - 2 < minY) continue;
            if (y + 2 > maxY) continue;

            left = Math.min(x - 2, left);
            right = Math.max(x + 2, right);
            top = Math.min(y - 2, top);
            bottom = Math.max(y + 2, bottom);

            xy.forCircle(x, y, 2, (x, y) => chunkGrid.set(x, y, tile));
            i++;
        }
    }

    const bounds = chunkGrid.calcBounds(1);

    const destX = Math.floor((site.width - bounds.width) / 2);
    const dx = destX - bounds.x;
    const destY = Math.floor((site.height - bounds.height) / 2);
    const dy = destY - bounds.y;

    // ...and copy it to the destination.
    chunkGrid.forEach((v, x, y) => {
        if (v) site.set(x + dx, y + dy, 1);
    });
    Grid.free(chunkGrid);

    bounds.x += dx;
    bounds.y += dy;
    return bounds;
}
