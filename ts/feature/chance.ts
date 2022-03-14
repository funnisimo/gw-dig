import { Site } from '../site';
import { installType, FeatureFn } from './feature';

//////////////////////////////////////////////
// chance

export function chance(opts: any): FeatureFn {
    if (Array.isArray(opts)) {
        opts = opts[0];
    }
    if (typeof opts === 'object') {
        opts = opts.chance;
    }
    if (typeof opts === 'string') {
        if (opts.endsWith('%')) {
            opts = Number.parseFloat(opts) * 100;
        } else {
            opts = Number.parseInt(opts || '10000');
        }
    }
    if (typeof opts !== 'number') {
        throw new Error(
            'Chance effect config must be number or string that can be a number.'
        );
    }
    return chanceAction.bind(undefined, opts);
}

export function chanceAction(cfg: number, site: Site): boolean {
    return site.rng.chance(cfg, 10000);
}

installType('chance', chance);
