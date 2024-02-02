import * as GWU from 'gw-utils';

export { TileId } from '../types';
// export type ToTileId = (name: TileId) => number;

export interface TileConfig {
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

export interface TileOptions extends TileConfig {
    id: string;
}

export interface TileInfo extends TileOptions {
    id: string;
    index: number;
    priority: number;
    tags: string[];
}

export interface TilePlugin {
    createTile: (tile: TileInfo, cfg: TileConfig) => void;
}

export class TileFactory {
    plugins: TilePlugin[] = [];
    tileIds: Record<string, number> = {};
    allTiles: TileInfo[] = [];

    constructor(withDefaults = true) {
        if (withDefaults) {
            installDefaults(this);
        }
    }

    use(plugin: TilePlugin) {
        this.plugins.push(plugin);
    }

    getTile(name: string | number): TileInfo | null {
        let id: number;
        if (typeof name === 'string') {
            id = this.tileIds[name];
            if (id === undefined) {
                // TODO - Log?  Will hit this during default installs.
                return null;
            }
        } else {
            id = name;
        }
        return this.allTiles[id] || null;
    }

    hasTile(name: string | number): boolean {
        return this.getTile(name) !== null;
    }

    tileId(name: string | number): number {
        if (typeof name === 'number') return name;
        return this.tileIds[name] ?? -1; // TODO: -1 vs 0?
    }

    // TODO - Remove?
    blocksMove(name: string | number): boolean {
        const info = this.getTile(name);
        return (!!info && info.blocksMove) || false;
    }

    install(cfg: TileOptions): TileInfo;
    install(id: string, opts?: TileConfig): TileInfo;
    install(id: string | TileOptions, opts: TileConfig = {}): TileInfo {
        if (typeof id !== 'string') {
            opts = id;
            id = id.id;
        }
        const base = { id, index: this.allTiles.length, priority: 0, tags: [] };

        opts.extends = opts.extends || id;

        if (opts.extends) {
            const root = this.getTile(opts.extends);
            if (root) {
                Object.assign(base, root);
            } else if (opts.extends !== id) {
                throw new Error('Cannot extend tile: ' + opts.extends);
            }
        }

        const info: TileInfo = GWU.object.assignOmitting(
            'priority, extends',
            base,
            opts
        ) as TileInfo;

        info.id = id;
        info.index = this.allTiles.length;

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

        // Do any custom tile setup
        this.apply(info, opts);

        if (this.tileIds[id]) {
            info.index = this.tileIds[id];
            this.allTiles[info.index] = info;
        } else {
            this.allTiles.push(info);
            this.tileIds[id] = info.index;
        }

        return info;
    }

    apply(tile: TileInfo, config: TileConfig) {
        this.plugins.forEach((p) => {
            if (p.createTile) {
                p.createTile(tile, config);
            }
        });
    }
}

// export const tileIds: Record<string, number> = {};
// export const allTiles: TileInfo[] = [];

export const tileFactory = new TileFactory(true);

export function installTile(cfg: TileOptions): TileInfo;
export function installTile(id: string, opts?: TileConfig): TileInfo;
export function installTile(...args: any[]): TileInfo {
    if (args.length == 1) {
        return tileFactory.install(args[0]);
    }
    return tileFactory.install(args[0], args[1]);
}

export function getTile(name: string | number): TileInfo | null {
    return tileFactory.getTile(name);
}

export function tileId(name: string | number): number {
    return tileFactory.tileId(name);
}

export function blocksMove(name: string | number): boolean {
    return tileFactory.blocksMove(name);
}

function installDefaults(factory: TileFactory) {
    factory.tileIds['NOTHING'] = factory.tileIds['NULL'] = factory.install(
        'NONE',
        {
            priority: 0,
            ch: '',
        }
    ).index;

    factory.install('FLOOR', { priority: 10, ch: '.' });
    factory.install('WALL', {
        blocksMove: true,
        blocksVision: true,
        priority: 50,
        ch: '#',
    });
    factory.install('DOOR', {
        blocksVision: true,
        door: true,
        priority: 60,
        ch: '+',
    });
    factory.install('SECRET_DOOR', {
        blocksMove: true,
        secretDoor: true,
        priority: 70,
        ch: '%',
    });
    factory.install('UP_STAIRS', {
        stairs: true,
        priority: 80,
        ch: '>',
    });
    factory.install('DOWN_STAIRS', {
        stairs: true,
        priority: 80,
        ch: '<',
    });
    factory.tileIds['DEEP'] = factory.install('LAKE', {
        priority: 40,
        liquid: true,
        ch: '~',
    }).index;
    factory.install('SHALLOW', { priority: 30, ch: '`' });
    factory.install('BRIDGE', { priority: 45, ch: '=' }); // layers help here
    factory.install('IMPREGNABLE', {
        priority: 200,
        ch: '%',
        impregnable: true,
        blocksMove: true,
        blocksVision: true,
    });
}
