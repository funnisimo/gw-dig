import * as GWU from 'gw-utils';
import * as GWM from 'gw-map';

import * as DIG from './digSite';

export interface Snapshot {
    restore(): void;
    cancel(): void;
}

export interface BuildSite extends DIG.DigSite {
    readonly depth: number;
    readonly machineCount: number;

    getChokeCount(x: number, y: number): number;
    setChokeCount(x: number, y: number, count: number): void;

    isOccupied: GWU.xy.XYMatchFunc;
    hasItem: GWU.xy.XYMatchFunc;
    hasActor: GWU.xy.XYMatchFunc;

    hasCellFlag(x: number, y: number, flag: number): boolean;
    setCellFlag(x: number, y: number, flag: number): void;
    clearCellFlag(x: number, y: number, flag: number): void;

    makeItem(id: string, makeOptions?: any): GWM.item.Item | null;
    makeRandomItem(
        tags: Partial<GWM.item.MatchOptions>,
        makeOptions?: any
    ): GWM.item.Item;
    addItem(x: number, y: number, item: GWM.item.Item): boolean;

    spawnHorde(
        horde: GWM.horde.Horde,
        x: number,
        y: number,
        opts?: Partial<GWM.horde.SpawnOptions>
    ): GWM.actor.Actor | null;

    analyze(): void;
    buildEffect(effect: GWM.effect.Effect, x: number, y: number): boolean;

    snapshot(): Snapshot;

    nextMachineId(): number;
    setMachine(x: number, y: number, id: number, isRoom?: boolean): void;
}
