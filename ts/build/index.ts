export * as blueprint from './blueprint';

import { Site } from '../site';
import { ChokeFinder } from './chokeFinder';
import { LoopFinder } from './loopFinder';

export * from './loopFinder';
export * from './chokeFinder';

export function analyze(site: Site) {

    const loops = new LoopFinder();
    loops.compute(site);

    const chokes = new ChokeFinder(true);
    chokes.compute(site);

}
