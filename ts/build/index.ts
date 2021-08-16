export * as blueprint from './blueprint';

import { BuildSite } from './site';
import { ChokeFinder } from './chokeFinder';
import { LoopFinder } from './loopFinder';

export * as site from './site';
export const analyze = { ChokeFinder, LoopFinder };
export * from './blueprint';
export * from './buildStep';
export * from './builder';

export function analyzeSite(site: BuildSite) {
    const loops = new LoopFinder();
    loops.compute(site);

    const chokes = new ChokeFinder(true);
    chokes.compute(site);
}
