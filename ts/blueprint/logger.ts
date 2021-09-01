import * as GWU from 'gw-utils';
import * as GWM from 'gw-map';

import { BuildData } from './data';
import { Blueprint } from './blueprint';
import { BuildStep } from './buildStep';

export interface BuildLogger {
    onError(data: BuildData, error: string): Promise<any>;

    onBlueprintPick(
        data: BuildData,
        blueprint: Blueprint,
        flags: number,
        depth: number
    ): Promise<any>;

    onBlueprintCandidates(data: BuildData, blueprint: Blueprint): Promise<any>;

    onBlueprintStart(
        data: BuildData,
        blueprint: Blueprint,
        adoptedItem: GWM.item.Item | null
    ): Promise<any>;

    onBlueprintInterior(data: BuildData, blueprint: Blueprint): Promise<any>;

    onBlueprintFail(
        data: BuildData,
        blueprint: Blueprint,
        error: string
    ): Promise<any>;

    onBlueprintSuccess(data: BuildData, blueprint: Blueprint): Promise<any>;

    onStepStart(
        data: BuildData,
        blueprint: Blueprint,
        step: BuildStep,
        item: GWM.item.Item | null
    ): Promise<any>;

    onStepCandidates(
        data: BuildData,
        blueprint: Blueprint,
        step: BuildStep,
        candidates: GWU.grid.NumGrid,
        wantCount: number
    ): Promise<any>;

    onStepInstanceSuccess(
        data: BuildData,
        blueprint: Blueprint,
        step: BuildStep,
        x: number,
        y: number
    ): Promise<any>;

    onStepInstanceFail(
        data: BuildData,
        blueprint: Blueprint,
        step: BuildStep,
        x: number,
        y: number,
        error: string
    ): Promise<any>;

    onStepSuccess(
        data: BuildData,
        blueprint: Blueprint,
        step: BuildStep
    ): Promise<any>;

    onStepFail(
        data: BuildData,
        blueprint: Blueprint,
        step: BuildStep,
        error: string
    ): Promise<any>;
}

export class NullLogger implements BuildLogger {
    async onError(): Promise<any> {}
    async onBlueprintPick(): Promise<any> {}
    async onBlueprintCandidates(): Promise<any> {}
    async onBlueprintStart(): Promise<any> {}
    async onBlueprintInterior(): Promise<any> {}
    async onBlueprintFail(): Promise<any> {}
    async onBlueprintSuccess(): Promise<any> {}
    async onStepStart(): Promise<any> {}
    async onStepCandidates(): Promise<any> {}
    async onStepInstanceSuccess(): Promise<any> {}
    async onStepInstanceFail(): Promise<any> {}
    async onStepSuccess(): Promise<any> {}
    async onStepFail(): Promise<any> {}
}
