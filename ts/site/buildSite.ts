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

    makeRandomItem(
        tags: string | Partial<GWM.item.MatchOptions>
    ): GWM.item.Item;
    addItem(x: number, y: number, item: GWM.item.Item): boolean;

    analyze(): void;
    buildEffect(effect: GWM.effect.EffectInfo, x: number, y: number): boolean;

    snapshot(): Snapshot;

    nextMachineId(): number;
    setMachine(x: number, y: number, id: number, isRoom?: boolean): void;
}
