import * as GWU from 'gw-utils/index';

export type ItemId = string;

export interface ItemInstance {
    id: string;
    make?: Record<string, any>;
    key?: { x: number; y: number; disposable?: boolean };
    x: number; // -1 means not on map (carried)
    y: number; // -1 means not on map
}

export interface ItemConfig {
    id: ItemId;
    make?: Record<string, any>;

    tags?: GWU.tags.TagBase;
    frequency?: GWU.frequency.FrequencyConfig;

    // flags?: GWU.flag.FlagBase;
    requiredTile?: string;
    feature?: string;
    blueprint?: string;
}

export interface ItemMatchOptions {
    tags: string | string[];
    forbidTags: string | string[];
    rng?: GWU.rng.Random;
}

export interface ItemInfo {
    id: ItemId;
    make: Record<string, any>;

    tags: string[];
    frequency: GWU.frequency.FrequencyFn;

    flags: number;
    requiredTile: string | null;
    feature: string | null;
    blueprint: string | null;
}

export const items: ItemInfo[] = [];

export function installItem(config: ItemConfig): ItemInfo;
export function installItem(id: string, cfg: Omit<ItemConfig, 'id'>): ItemInfo;
export function installItem(
    config: ItemConfig | string,
    cfg?: Omit<ItemConfig, 'id'>
): ItemInfo {
    const info = {} as ItemInfo;
    if (typeof config === 'string') {
        info.id = config;
        if (!cfg) throw new Error('Need a configuration.');
        config = cfg as ItemConfig;
    } else {
        info.id = config.id;
    }

    info.make = config.make || {};

    info.tags = [];
    if (config.tags) {
        if (typeof config.tags === 'string') {
            config.tags = config.tags.split(/[:|,]/g).map((t) => t.trim());
        }
        info.tags = config.tags;
    }

    info.frequency = GWU.frequency.make(config.frequency || 100);
    info.flags = 0;

    info.requiredTile = config.requiredTile || null;
    info.feature = config.feature || null;
    info.blueprint = config.blueprint || null;

    items.push(info);

    return info;
}

export function pickItem(
    depth: number,
    tagRules: string | { tags: string } | { id: string },
    rng?: GWU.rng.Random
): ItemInfo | null {
    rng = rng || GWU.random;
    if (typeof tagRules !== 'string' && 'id' in tagRules) {
        // @ts-ignore
        return items.find((i) => i.id === tagRules.id) || null;
    }
    tagRules = typeof tagRules === 'string' ? tagRules : tagRules.tags;
    const tagMatch = GWU.tags.makeMatch(tagRules);
    const choices = items.filter((item) => tagMatch(item.tags));
    if (choices.length == 0) return null;

    const freq = choices.map((info) => info.frequency(depth));
    const choice = rng.weighted(freq);
    return choices[choice] || null;
}

export function makeItem(info: ItemInfo): ItemInstance {
    return {
        id: info.id,
        make: info.make,
        x: -1,
        y: -1,
    };
}

export function getItemInfo(id: string): ItemInfo | undefined {
    return items.find((i) => i.id === id);
}
