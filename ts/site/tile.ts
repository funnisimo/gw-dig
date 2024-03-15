import * as GWU from 'gw-utils/index';

export { TileId } from '../types';
// export type ToTileId = (name: TileId) => number;

export interface TileConfig {
    extends?: string;

    blocksMove?: boolean;
    blocksVision?: boolean;
    blocksPathing?: boolean;
    blocksDiagonal?: boolean; // cannot attack or move diagonally around this tile

    connectsLevel?: boolean;
    secretDoor?: boolean;
    door?: boolean;

    stairs?: boolean;
    liquid?: boolean;
    impregnable?: boolean;

    tags?: string | string[];
    priority?: number | string;
    ch?: string;

    [id: string]: any;
}

export interface NamedTileConfig extends TileConfig {
    id: string;
}

/**
 * A map of Tile Id to Config or reference to an existing tile.
 */
export type TileConfigSet = Record<string, TileConfig | string>;

export interface TileInfo extends Omit<NamedTileConfig, 'extends'> {
    index: number;
    priority: number;
    tags: string[];
}

export interface TilePlugin {
    createTile?: (tile: TileInfo, cfg: TileConfig) => void;
}

export class TileFactory {
    plugins: TilePlugin[] = [];
    tileIds: Record<string, number> = {};
    allTiles: TileInfo[] = [];
    fieldMap: GWU.object.FieldMap = {};

    constructor(withDefaults = true) {
        this.installField('extends', GWU.NOOP); // skip
        this.installField('tags', (current, updated) => {
            return GWU.tags.merge(current, updated);
        });
        this.installField('priority', this._priorityFieldMap.bind(this));

        if (withDefaults) {
            this.installSet(default_tiles);
        }
    }

    installField(name: string, fn: GWU.object.MergeFn) {
        this.fieldMap[name] = fn;
    }

    installFields(fields: GWU.object.FieldMap) {
        Object.assign(this.fieldMap, fields);
    }

    use(plugin: TilePlugin) {
        this.plugins.push(plugin);
    }

    getTile(name: string | number): TileInfo | null {
        const tile = this._getTile(name);
        if (!tile) {
            console.warn('Failed to find tile: ' + name);
        }
        return tile;
    }

    _getTile(name: string | number): TileInfo | null {
        let id: number;
        if (typeof name === 'string') {
            id = this.tileIds[name];
            if (id === undefined) {
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

    install(cfg: NamedTileConfig): TileInfo;
    install(id: string, opts?: TileConfig): TileInfo;
    install(id: string | NamedTileConfig, opts: TileConfig = {}): TileInfo {
        if (typeof id !== 'string') {
            opts = id;
            id = id.id;
        }
        const base = { id, index: this.allTiles.length, priority: 0, tags: [] };

        opts.extends = opts.extends || id;

        if (opts.extends) {
            const root = this._getTile(opts.extends);
            if (root) {
                Object.assign(base, root);
            } else if (opts.extends !== id) {
                throw new Error('Cannot extend tile: ' + opts.extends);
            }
        }

        const info = GWU.object.mergeWith(
            base,
            opts,
            this.fieldMap
        ) as TileInfo;

        info.id = id;
        info.index = this.allTiles.length;

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

    installSet(set: TileConfigSet | TileConfigSet[]) {
        const arr = Array.isArray(set) ? set : [set];
        arr.forEach((s) => {
            Object.entries(s).forEach(([k, v]) => {
                if (typeof v === 'string') {
                    // This is a reference
                    const tile = this.getTile(v);
                    if (tile) {
                        this.tileIds[k] = tile.index;
                    } else {
                        console.warn(
                            'Trying to install invalid tile reference: ' +
                                k +
                                ' => ' +
                                v
                        );
                    }
                } else {
                    this.install(k, v);
                }
            });
        });
    }

    apply(tile: TileInfo, config: TileConfig) {
        this.plugins.forEach((p) => {
            if (p.createTile) {
                p.createTile(tile, config);
            }
        });
    }

    _priorityFieldMap(current: number, updated: any): number {
        if (typeof updated === 'number') return updated;
        if (typeof updated === 'string') {
            let text = updated.replace(/ /g, '');
            let index = text.search(/[+-]/);
            if (index == 0) {
                return current + Number.parseInt(text);
            } else if (index == -1) {
                if (text.search(/[a-zA-Z]/) == 0) {
                    const tile = this._getTile(text);
                    if (!tile)
                        throw new Error(
                            'Failed to find tile for priority - ' + text + '.'
                        );
                    return tile.priority;
                } else {
                    return Number.parseInt(text);
                }
            } else {
                const id = text.substring(0, index);
                const delta = Number.parseInt(text.substring(index));
                const tile = this._getTile(id);
                if (!tile)
                    throw new Error(
                        'Failed to find tile for priority - ' + id + '.'
                    );

                return tile.priority + delta;
            }
        } else if (updated !== undefined) {
            return updated;
        }
        return current;
    }
}

// export const tileIds: Record<string, number> = {};
// export const allTiles: TileInfo[] = [];

export const default_tiles: TileConfigSet = {
    NONE: {
        blocksDiagonal: true,
        priority: 0,
        ch: '',
    },
    NOTHING: 'NONE',
    NULL: 'NONE',

    FLOOR: { priority: 10, ch: '.' },
    WALL: {
        blocksMove: true,
        blocksVision: true,
        blocksDiagonal: true,
        priority: 50,
        ch: '#',
    },
    DOOR: {
        blocksVision: true,
        door: true,
        priority: 60,
        ch: '+',
    },
    SECRET_DOOR: {
        blocksMove: true,
        secretDoor: true,
        priority: 70,
        ch: '%',
    },
    UP_STAIRS: {
        stairs: true,
        priority: 80,
        ch: '>',
    },
    DOWN_STAIRS: {
        stairs: true,
        priority: 80,
        ch: '<',
    },
    LAKE: {
        priority: 40,
        liquid: true,
        ch: '~',
    },
    DEEP: 'LAKE',
    SHALLOW: { priority: 30, ch: '`' },
    BRIDGE: { priority: 45, ch: '=' }, // layers help here
    IMPREGNABLE: {
        priority: 200,
        ch: '%',
        impregnable: true,
        blocksMove: true,
        blocksVision: true,
        blocksDiagonal: true,
    },
};

// TODO - make this a let and don't export it?  Then add: 'use(factory)' to set it from outside.
export const tileFactory = new TileFactory(true);

export function installTile(cfg: NamedTileConfig): TileInfo;
export function installTile(id: string, opts?: TileConfig): TileInfo;
export function installTile(...args: any[]): TileInfo {
    if (args.length == 1) {
        return tileFactory.install(args[0]);
    }
    return tileFactory.install(args[0], args[1]);
}

export function installField(name: string, fn: GWU.object.MergeFn) {
    tileFactory.installField(name, fn);
}

export function installFields(fields: GWU.object.FieldMap) {
    tileFactory.installFields(fields);
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
