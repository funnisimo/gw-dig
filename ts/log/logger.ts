import * as GWU from 'gw-utils';
import * as GWM from 'gw-map';

import { DigSite } from '../site/digSite';
import { Room } from '../types';
import { BuildData } from '../blueprint/data';
import { BuildStep } from '../blueprint/buildStep';

export interface Logger {
    onDigFirstRoom(site: DigSite): void;
    onRoomCandidate(room: Room, roomSite: DigSite): void;
    onRoomFailed(
        site: DigSite,
        room: Room,
        roomSite: DigSite,
        error: string
    ): void;
    onRoomSuccess(site: DigSite, room: Room): void;

    onLoopsAdded(site: DigSite): void;
    onLakesAdded(site: DigSite): void;
    onBridgesAdded(site: DigSite): void;
    onStairsAdded(site: DigSite): void;

    //

    onBuildError(error: string): void;

    onBlueprintPick(data: BuildData, flags: number, depth: number): void;

    onBlueprintCandidates(data: BuildData): void;

    onBlueprintStart(data: BuildData, adoptedItem: GWM.item.Item | null): void;

    onBlueprintInterior(data: BuildData): void;

    onBlueprintFail(data: BuildData, error: string): void;

    onBlueprintSuccess(data: BuildData): void;

    onStepStart(
        data: BuildData,
        step: BuildStep,
        item: GWM.item.Item | null
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
