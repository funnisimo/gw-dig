import * as GW from 'gw-utils';

const Fl = GW.flag.fl;

export enum Flags {
    BP_ROOM = Fl(10), // spawns in a dead-end room that is dominated by a chokepoint of the given size (as opposed to a random place of the given size)
    BP_VESTIBULE = Fl(1), // spawns in a doorway (location must be given) and expands outward, to guard the room
    BP_REWARD = Fl(7), // metered reward machines
    BP_ADOPT_ITEM = Fl(0), // the machine must adopt an item (e.g. a door key)

    BP_PURGE_PATHING_BLOCKERS = Fl(2), // clean out traps and other T_PATHING_BLOCKERs
    BP_PURGE_INTERIOR = Fl(3), // clean out all of the terrain in the interior before generating the machine
    BP_PURGE_LIQUIDS = Fl(4), // clean out all of the liquids in the interior before generating the machine

    BP_SURROUND_WITH_WALLS = Fl(5), // fill in any impassable gaps in the perimeter (e.g. water, lava, brimstone, traps) with wall
    BP_IMPREGNABLE = Fl(6), // impassable perimeter and interior tiles are locked; tunneling bolts will bounce off harmlessly

    BP_OPEN_INTERIOR = Fl(8), // clear out walls in the interior, widen the interior until convex or bumps into surrounding areas
    BP_MAXIMIZE_INTERIOR = Fl(9), // same as BP_OPEN_INTERIOR but expands the room as far as it can go, potentially surrounding the whole level.
    BP_REDESIGN_INTERIOR = Fl(14), // nuke and pave -- delete all terrain in the interior and build entirely new rooms within the bounds

    BP_TREAT_AS_BLOCKING = Fl(11), // abort the machine if, were it filled with wall tiles, it would disrupt the level connectivity
    BP_REQUIRE_BLOCKING = Fl(12), // abort the machine unless, were it filled with wall tiles, it would disrupt the level connectivity

    BP_NO_INTERIOR_FLAG = Fl(13), // don't flag the area as being part of a machine
}

export interface Options {
    tags: string | string[];
    frequency: GW.frequency.FrequencyConfig;
    size: string | number[];
    flags: GW.flag.FlagBase;
}

export class Blueprint {
    public tags: string[] = [];
    public frequency: GW.frequency.FrequencyFn;
    public size: [number, number] = [-1, -1];
    public flags: number = 0;

    constructor(opts: Partial<Options> = {}) {
        if (opts.tags) {
            if (typeof opts.tags === 'string') {
                opts.tags = opts.tags.split(/[,|]/).map((v) => v.trim());
            }
            this.tags = opts.tags;
        }
        this.frequency = GW.frequency.make(opts.frequency || 100);

        if (opts.size) {
            if (typeof opts.size === 'string') {
                const parts = opts.size
                    .split(/[,|]/)
                    .map((v) => v.trim())
                    .map((v) => Number.parseInt(v));
                if (parts.length !== 2)
                    throw new Error('Blueprint size must be of format: #-#');
                this.size = [parts[0], parts[1]];
            } else if (Array.isArray(opts.size)) {
                if (opts.size.length !== 2)
                    throw new Error('Blueprint size must be [min, max]');
                this.size = [opts.size[0], opts.size[1]];
            } else {
                throw new Error('size must be string or array.');
            }

            if (this.size[0] > this.size[1])
                throw new Error('Blueprint size must be small to large.');
        }
        if (opts.flags) {
            this.flags = GW.flag.from(Flags, opts.flags);
        }
    }

    getChance(level: number, tags?: string | string[]) {
        if (tags && tags.length) {
            if (typeof tags === 'string') {
                tags = tags.split(/[,|]/).map((v) => v.trim());
            }
            // Must match all tags!
            if (!tags.every((want) => this.tags.includes(want))) return 0;
        }
        return this.frequency(level);
    }

    get isRoom() {
        return this.flags & Flags.BP_ROOM;
    }
    get isReward() {
        return this.flags & Flags.BP_REWARD;
    }
    get isVestiblue() {
        return this.flags & Flags.BP_VESTIBULE;
    }
    get adoptsItem() {
        return this.flags & Flags.BP_ADOPT_ITEM;
    }
}

export const blueprints: Record<string, Blueprint> = {};

export function install(id: string, blueprint: Blueprint) {
    blueprints[id] = blueprint;
}
