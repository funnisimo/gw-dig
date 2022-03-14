import * as GWU from 'gw-utils';

export { TileId } from '../types';
// export type ToTileId = (name: TileId) => number;

export interface TileOptions {
    blocksMove?: boolean;
    blocksVision?: boolean;
    blocksPathing?: boolean;

    connectsLevel?: boolean;
    secretDoor?: boolean;
    door?: boolean;

    stairs?: boolean;
    liquid?: boolean;
    impregnable?: boolean;

    tags?: string | string[];
    priority?: number | string;
    ch?: string;

    extends?: string;
}

interface TileInfo extends TileOptions {
    id: string;
    index: number;
    priority: number;
    tags: string[];
}

const tiles: Record<string, number> = {};
const all: TileInfo[] = [];

export function installTile(id: string, opts: TileOptions = {}): TileInfo {
    const base = { id, index: all.length, priority: 0, tags: [] };

    if (opts.extends) {
        const root = getTile(opts.extends);
        if (!root) throw new Error('Cannot extend tile: ' + opts.extends);
        Object.assign(base, root);
    }

    const info: TileInfo = GWU.object.assignOmitting(
        'priority, extends',
        base,
        opts
    ) as TileInfo;

    info.id = id;
    info.index = all.length;

    if (opts.tags) {
        info.tags = GWU.tags.make(opts.tags);
    }

    if (typeof opts.priority === 'string') {
        let text = opts.priority.replace(/ /g, '');
        let index = text.search(/[+-]/);
        if (index == 0) {
            info.priority = info.priority + Number.parseInt(text);
        } else if (index == -1) {
            if (text.search(/[a-zA-Z]/) == 0) {
                const tile = getTile(text);
                if (!tile)
                    throw new Error(
                        'Failed to find tile for priority - ' + text + '.'
                    );
                info.priority = tile.priority;
            } else {
                info.priority = Number.parseInt(text);
            }
        } else {
            const id = text.substring(0, index);
            const delta = Number.parseInt(text.substring(index));
            const tile = getTile(id);
            if (!tile)
                throw new Error(
                    'Failed to find tile for priority - ' + id + '.'
                );

            info.priority = tile.priority + delta;
        }
    } else if (opts.priority !== undefined) {
        info.priority = opts.priority;
    }

    if (info.blocksPathing === undefined) {
        if (info.blocksMove) {
            info.blocksPathing = true;
        }
    }

    if (tiles[id]) {
        info.index = tiles[id];
        all[info.index] = info;
    } else {
        all.push(info);
        tiles[id] = info.index;
    }

    return info;
}

export function getTile(name: string | number): TileInfo {
    if (typeof name === 'string') {
        name = tiles[name];
    }
    return all[name];
}

export function tileId(name: string | number): number {
    if (typeof name === 'number') return name;
    return tiles[name] ?? -1;
}

export function blocksMove(name: string | number): boolean {
    const info = getTile(name);
    return info.blocksMove || false;
}

tiles['NOTHING'] = tiles['NULL'] = installTile('NONE', {
    priority: 0,
    ch: '',
}).index;

installTile('FLOOR', { priority: 10, ch: '.' });
installTile('WALL', {
    blocksMove: true,
    blocksVision: true,
    priority: 50,
    ch: '#',
});
installTile('DOOR', {
    blocksVision: true,
    door: true,
    priority: 60,
    ch: '+',
});
installTile('SECRET_DOOR', {
    blocksMove: true,
    secretDoor: true,
    priority: 70,
    ch: '%',
});
installTile('UP_STAIRS', {
    stairs: true,
    priority: 80,
    ch: '>',
});
installTile('DOWN_STAIRS', {
    stairs: true,
    priority: 80,
    ch: '<',
});
tiles['DEEP'] = installTile('LAKE', {
    priority: 40,
    liquid: true,
    ch: '~',
}).index;
installTile('SHALLOW', { priority: 30, ch: '`' });
installTile('BRIDGE', { priority: 45, ch: '=' }); // layers help here
installTile('IMPREGNABLE', { priority: 200, ch: '%', impregnable: true });
