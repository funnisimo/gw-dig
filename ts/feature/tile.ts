import { SetTileOptions, Site } from '../site';
import { FeatureFn, installType } from './feature';

//////////////////////////////////////////////
// TILE

export interface TileOptions extends SetTileOptions {
    id: string;
    protected?: boolean;
}

export function tile(src: string | TileOptions): FeatureFn {
    if (!src) throw new Error('Tile effect needs configuration.');

    if (typeof src === 'string') {
        src = { id: src };
    } else if (Array.isArray(src)) {
        src = { id: src[0] };
    } else if (!src.id) {
        throw new Error('Tile effect needs configuration with id.');
    }

    const opts: TileOptions = src;
    if (opts.id.includes('!')) {
        opts.superpriority = true;
    }
    if (opts.id.includes('~')) {
        opts.blockedByActors = true;
        opts.blockedByItems = true;
    }
    // if (opts.id.includes('+')) {
    //     opts.protected = true;
    // }
    opts.id = opts.id.replace(/[!~+]*/g, '');

    return tileAction.bind(undefined, opts);
}

export function tileAction(
    cfg: TileOptions,
    site: Site,
    x: number,
    y: number
): boolean {
    cfg.machine = 0; // >???<
    if (site.setTile(x, y, cfg.id, cfg)) {
        return true;
    }
    return false;
}

installType('tile', tile);
