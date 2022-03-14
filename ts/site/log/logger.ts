import * as GWU from 'gw-utils';
// import * as GWM from 'gw-map';

import { Site } from '../site';
import { Room } from '../../types';
import { BuildData } from '../../build/data';
import { BuildStep } from '../../build/buildStep';
import * as ITEM from '../item';

export interface Logger {
    onDigFirstRoom(site: Site): void;
    onRoomCandidate(room: Room, roomSite: Site): void;
    onRoomFailed(site: Site, room: Room, roomSite: Site, error: string): void;
    onRoomSuccess(site: Site, room: Room): void;

    onLoopsAdded(site: Site): void;
    onLakesAdded(site: Site): void;
    onBridgesAdded(site: Site): void;
    onStairsAdded(site: Site): void;

    //

    onBuildError(error: string): void;

    onBlueprintPick(data: BuildData, flags: number, depth: number): void;

    onBlueprintCandidates(data: BuildData): void;

    onBlueprintStart(
        data: BuildData,
        adoptedItem: ITEM.ItemInstance | null
    ): void;

    onBlueprintInterior(data: BuildData): void;

    onBlueprintFail(data: BuildData, error: string): void;

    onBlueprintSuccess(data: BuildData): void;

    onStepStart(
        data: BuildData,
        step: BuildStep,
        item: ITEM.ItemInstance | null
    ): void;

    onStepCandidates(
        data: BuildData,
        step: BuildStep,
        candidates: GWU.grid.NumGrid,
        wantCount: number
    ): void;

    onStepInstanceSuccess(
        data: BuildData,
        step: BuildStep,
        x: number,
        y: number
    ): void;

    onStepInstanceFail(
        data: BuildData,
        step: BuildStep,
        x: number,
        y: number,
        error: string
    ): void;

    onStepSuccess(data: BuildData, step: BuildStep): void;

    onStepFail(data: BuildData, step: BuildStep, error: string): void;
}

export class NullLogger implements Logger {
    onDigFirstRoom(): void {}
    onRoomCandidate(): void {}
    onRoomFailed(): void {}
    onRoomSuccess(): void {}
    onLoopsAdded(): void {}
    onLakesAdded(): void {}
    onBridgesAdded(): void {}
    onStairsAdded(): void {}

    onBuildError(): void {}
    onBlueprintPick(): void {}
    onBlueprintCandidates(): void {}
    onBlueprintStart(): void {}
    onBlueprintInterior(): void {}
    onBlueprintFail(): void {}
    onBlueprintSuccess(): void {}
    onStepStart(): void {}
    onStepCandidates(): void {}
    onStepInstanceSuccess(): void {}
    onStepInstanceFail(): void {}
    onStepSuccess(): void {}
    onStepFail(): void {}
}
