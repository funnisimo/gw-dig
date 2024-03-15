import * as GWU from 'gw-utils/index';
import { Site } from '../site';

export interface FeatureObj {
    [key: string]: any;
}
export type FeatureConfig = string | FeatureObj;

export type FeatureFn = (site: Site, x: number, y: number) => boolean;
export type MakeFn = (cfg: any) => FeatureFn;

export const features: Record<string, FeatureFn> = {};

export function install(name: string, fn: FeatureFn | FeatureConfig) {
    if (typeof fn !== 'function') {
        fn = make(fn);
    }
    features[name] = fn as FeatureFn;
}

export const types: Record<string, MakeFn> = {};

export function installType(name: string, fn: MakeFn) {
    types[name] = fn;
}

// FEATURE TYPE

export function feature(id: string | string[] | { id: string }): FeatureFn {
    if (Array.isArray(id)) id = id[0];
    if (id && typeof id !== 'string') {
        id = id.id;
    }
    if (!id || !id.length) throw new Error('Feature effect needs ID');

    return featureFeature.bind(undefined, id);
}

export function featureFeature(
    id: string,
    site: Site,
    x: number,
    y: number
): boolean {
    const feat = features[id];
    if (!feat) {
        throw new Error('Failed to find feature: ' + id);
    }

    return feat(site, x, y);
}

installType('feature', feature);
installType('effect', feature);
installType('id', feature);

export function make(obj: FeatureConfig): FeatureFn;
export function make(id: string, config: FeatureConfig): FeatureFn;
export function make(
    id: string | FeatureConfig,
    config?: FeatureConfig
): FeatureFn {
    if (!id) return GWU.FALSE;
    if (typeof id === 'string') {
        if (!id.length)
            throw new Error('Cannot create effect from empty string.');

        if (!config) {
            const parts = id.split(':');
            id = parts.shift()!.toLowerCase();
            config = parts;
        }
        // string with no parameters is interpreted as id of registered feature
        if (config.length === 0) {
            config = id;
            id = 'feature';
        }
        const handler = types[id];
        if (!handler) throw new Error('Failed to find effect - ' + id);
        return handler(config || {});
    }
    let steps: FeatureFn[];

    if (Array.isArray(id)) {
        steps = id
            .map((config) => make(config))
            .filter((a) => a !== null) as FeatureFn[];
    } else if (typeof id === 'function') {
        return id as FeatureFn;
    } else {
        steps = Object.entries(id)
            .map(([key, config]) => make(key, config))
            .filter((a) => a !== null) as FeatureFn[];
    }
    if (steps.length === 1) {
        return steps[0];
    }

    return (site, x, y) => {
        return steps.every((step) => step(site, x, y));
    };
}

export function makeArray(cfg: string): FeatureFn[];
export function makeArray(obj: FeatureObj): FeatureFn[];
export function makeArray(arr: FeatureFn[]): FeatureFn[];
export function makeArray(
    cfg: string | FeatureFn | FeatureObj | FeatureFn[]
): FeatureFn[] {
    if (!cfg) return [];
    if (Array.isArray(cfg)) {
        return cfg
            .map((c) => make(c))
            .filter((fn) => fn !== null) as FeatureFn[];
    }
    if (typeof cfg === 'string') {
        if (!cfg.length)
            throw new Error('Cannot create effect from empty string.');

        const parts = cfg.split(':');
        cfg = parts.shift()!.toLowerCase();

        const handler = types[cfg];
        if (!handler) return [];
        return [handler(parts)];
    } else if (typeof cfg === 'function') {
        return [cfg] as FeatureFn[];
    }

    const steps = Object.entries(cfg).map(([key, config]) => make(key, config));
    return steps.filter((s) => s !== null) as FeatureFn[];
}
