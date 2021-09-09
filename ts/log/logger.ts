import * as GWU from 'gw-utils';
import * as GWM from 'gw-map';

import { DigSite } from '../site/digSite';
import { Room } from '../types';
import { BuildData } from '../blueprint/data';
import { BuildStep } from '../blueprint/buildStep';

export interface Logger {
    onDigFirstRoom(site: DigSite): Promise<any>;
    onRoomCandidate(room: Room, roomSite: DigSite): Promise<any>;
    onRoomFailed(
        site: DigSite,
        room: Room,
        roomSite: DigSite,
        error: string
    ): Promise<any>;
    onRoomSuccess(site: DigSite, room: Room): Promise<any>;

    onLoopsAdded(site: DigSite): Promise<any>;
    onLakesAdded(site: DigSite): Promise<any>;
    onBridgesAdded(site: DigSite): Promise<any>;
    onStairsAdded(site: DigSite): Promise<any>;

    //

    onBuildError(error: string): Promise<any>;

    onBlueprintPick(
        data: BuildData,
        flags: number,
        depth: number
    ): Promise<any>;

    onBlueprintCandidates(data: BuildData): Promise<any>;

    onBlueprintStart(
        data: BuildData,
        adoptedItem: GWM.item.Item | null
    ): Promise<any>;

    onBlueprintInterior(data: BuildData): Promise<any>;

    onBlueprintFail(data: BuildData, error: string): Promise<any>;

    onBlueprintSuccess(data: BuildData): Promise<any>;

    onStepStart(
        data: BuildData,
        step: BuildStep,
        item: GWM.item.Item | null
    ): Promise<any>;

    onStepCandidates(
        data: BuildData,
        step: BuildStep,
        candidates: GWU.grid.NumGrid,
        wantCount: number
    ): Promise<any>;

    onStepInstanceSuccess(
        data: BuildData,
        step: BuildStep,
        x: number,
        y: number
    ): Promise<any>;

    onStepInstanceFail(
        data: BuildData,
        step: BuildStep,
        x: number,
        y: number,
        error: string
    ): Promise<any>;

    onStepSuccess(data: BuildData, step: BuildStep): Promise<any>;

    onStepFail(data: BuildData, step: BuildStep, error: string): Promise<any>;
}

export class NullLogger implements Logger {
    async onDigFirstRoom(): Promise<any> {}
    async onRoomCandidate(): Promise<any> {}
    async onRoomFailed(): Promise<any> {}
    async onRoomSuccess(): Promise<any> {}
    async onLoopsAdded(): Promise<any> {}
    async onLakesAdded(): Promise<any> {}
    async onBridgesAdded(): Promise<any> {}
    async onStairsAdded(): Promise<any> {}

    async onBuildError(): Promise<any> {}
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
