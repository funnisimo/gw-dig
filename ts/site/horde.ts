import * as GWU from 'gw-utils/index';
import { ItemInstance } from './item';
import * as FEATURE from '../feature';
import { Site } from '../site';

export type HordeId = string;

export interface ActorInstance {
    id: string;
    make: Record<string, any>;
    x: number;
    y: number;
    machine: number;
    leader?: ActorInstance; // number??
    item?: ItemInstance;
}

export interface MemberConfig {
    count?: GWU.range.RangeBase;
    make?: Record<string, any>;
}

export interface HordeConfig {
    id?: string;
    leader: HordeId;
    make?: Record<string, any>;
    members?: Record<HordeId, GWU.range.RangeBase | MemberConfig>;

    tags?: GWU.tags.TagBase;
    frequency?: GWU.frequency.FrequencyConfig;

    // flags?: GWU.flag.FlagBase;
    requiredTile?: string; // ID
    feature?: string; // ID
    blueprint?: string; // ID
}

export interface MemberInfo {
    count: GWU.range.Range;
    make: Record<string, any>;
}

export interface HordeInfo {
    id?: string;
    leader: HordeId;
    make: Record<string, any>;
    members: Record<HordeId, MemberInfo>;

    tags: string[];
    frequency: GWU.frequency.FrequencyFn;

    flags: number;
    requiredTile: string | null;
    feature: FEATURE.FeatureFn | null;
    blueprint: string | null;
}

export const hordes: HordeInfo[] = [];

export function installHorde(config: HordeConfig): HordeInfo {
    const info = {} as HordeInfo;
    info.id = config.id || config.leader;
    info.leader = config.leader;
    info.make = config.make || {};
    info.members = {};
    if (config.members) {
        Object.entries(config.members).forEach(([key, value]) => {
            let member = {} as MemberInfo;
            if (
                typeof value === 'object' &&
                ('count' in value || 'make' in value)
            ) {
                member.count = GWU.range.make(value.count || 1);
                member.make = value.make || {};
            } else {
                // @ts-ignore
                member.count = GWU.range.make(value);
            }
            info.members[key] = member;
        });
    }

    info.tags = [];
    if (config.tags) {
        if (typeof config.tags === 'string') {
            config.tags = config.tags.split(/[:|,]/g).map((t) => t.trim());
        }
        info.tags = config.tags;
    }

    info.frequency = GWU.frequency.make(config.frequency);
    info.flags = 0;

    info.requiredTile = config.requiredTile || null;
    info.feature = config.feature ? FEATURE.make(config.feature) : null;
    info.blueprint = config.blueprint || null;

    hordes.push(info);

    return info;
}

export function pickHorde(
    depth: number,
    rules: string | { id: string } | { tags: string | string[] },
    rng?: GWU.rng.Random
): HordeInfo | null {
    rng = rng || GWU.random;
    let tagMatch: GWU.tags.TagMatchFn;
    if (typeof rules === 'string') {
        tagMatch = GWU.tags.makeMatch(rules);
    } else if ('id' in rules) {
        return hordes.find((h) => h.id === rules.id) || null;
    } else {
        tagMatch = GWU.tags.makeMatch(rules);
    }

    const choices = hordes.filter((horde) => tagMatch(horde.tags));
    if (choices.length == 0) return null;

    const freq = choices.map((info) => info.frequency(depth));
    const choice = rng.weighted(freq);
    return choices[choice] || null;
}

export interface HordeFlagsType {
    horde: number;
}

export interface SpawnOptions {
    canSpawn: GWU.xy.XYMatchFunc;
    rng: GWU.rng.Random;
    machine: number;
}

export function spawnHorde(
    info: HordeInfo,
    map: Site,
    x = -1,
    y = -1,
    opts: Partial<SpawnOptions> = {}
): ActorInstance | null {
    // Leader info
    opts.canSpawn = opts.canSpawn || GWU.TRUE;
    opts.rng = opts.rng || map.rng;
    opts.machine = opts.machine || 0;

    const leader = _spawnLeader(info, map, x, y, opts as SpawnOptions);
    if (!leader) return null;

    _spawnMembers(info, leader, map, opts as SpawnOptions);
    return leader;
}

function _spawnLeader(
    info: HordeInfo,
    map: Site,
    x: number,
    y: number,
    opts: SpawnOptions
): ActorInstance | null {
    const leader: ActorInstance = {
        id: info.leader,
        make: info.make,
        x,
        y,
        machine: opts.machine || 0,
    };

    if (x >= 0 && y >= 0) {
        if (!map.canSpawnActor(x, y, leader)) return null;
    } else {
        [x, y] = _pickLeaderLoc(leader, map, opts) || [-1, -1];
        if (x < 0 || y < 0) {
            return null;
        }
    }

    // pre-placement stuff?  machine? effect?

    if (!_addLeader(leader, map, x, y, opts)) {
        return null;
    }

    return leader;
}

function _addLeader(
    leader: ActorInstance,
    map: Site,
    x: number,
    y: number,
    _opts: SpawnOptions
): number {
    return map.addActor(x, y, leader);
}

function _addMember(
    member: ActorInstance,
    map: Site,
    x: number,
    y: number,
    leader: ActorInstance,
    _opts: SpawnOptions
): number {
    member.leader = leader;
    return map.addActor(x, y, member);
}

function _spawnMembers(
    horde: HordeInfo,
    leader: ActorInstance,
    map: Site,
    opts: SpawnOptions
): number {
    const entries = Object.entries(horde.members);

    if (entries.length == 0) return 0;

    let count = 0;
    entries.forEach(([kindId, config]) => {
        const count = config.count.value(opts.rng);
        for (let i = 0; i < count; ++i) {
            _spawnMember(kindId, config, map, leader, opts);
        }
    });

    return count;
}

function _spawnMember(
    id: string,
    member: MemberInfo,
    map: Site,
    leader: ActorInstance,
    opts: SpawnOptions
): ActorInstance | null {
    const instance = {
        id,
        make: member.make,
        x: -1,
        y: -1,
        machine: leader.machine,
    };

    const [x, y] = _pickMemberLoc(instance, map, leader, opts) || [-1, -1];
    if (x < 0 || y < 0) {
        return null;
    }

    // pre-placement stuff?  machine? effect?

    if (!_addMember(instance, map, x, y, leader, opts)) {
        return null;
    }

    return instance;
}

function _pickLeaderLoc(
    leader: ActorInstance,
    map: Site,
    opts: SpawnOptions
): GWU.xy.Loc | null {
    let loc = opts.rng.matchingLoc(map.width, map.height, (x, y) => {
        if (!map.hasXY(x, y)) return false;

        if (map.hasActor(x, y)) return false; // Brogue kills existing actors, but lets do this instead

        if (!opts.canSpawn(x, y)) return false;
        if (!map.canSpawnActor(x, y, leader)) return false;
        // const cell = map.cell(x, y);

        // if (leader.avoidsCell(cell)) return false;

        // if (Map.isHallway(map, x, y)) {
        //     return false;
        // }
        return true;
    });
    return loc;
}

function _pickMemberLoc(
    actor: ActorInstance,
    map: Site,
    leader: ActorInstance,
    opts: SpawnOptions
): GWU.xy.Loc | null {
    let loc = opts.rng.matchingLocNear(leader.x, leader.y, (x, y) => {
        if (!map.hasXY(x, y)) return false;
        if (map.hasActor(x, y)) return false;
        // if (map.fov.isAnyKindOfVisible(x, y)) return false;

        if (!map.canSpawnActor(x, y, actor)) return false;
        if (!opts.canSpawn(x, y)) return false;
        return true;
    });
    return loc;
}
