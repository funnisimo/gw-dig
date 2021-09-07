import * as GWU from 'gw-utils';
import { Room } from './types';
import { DigSite } from './site/digSite';
import { Blueprint, Flags } from './blueprint/blueprint';
import { Logger } from './logger';
import { BuildData } from './blueprint/data';
import { BuildStep, StepFlags } from './blueprint/buildStep';

export class ConsoleLogger implements Logger {
    async onDigFirstRoom(site: DigSite) {
        console.group('dig first room');
        site.dump();
        console.groupEnd();
    }

    async onRoomCandidate(roomSite: DigSite): Promise<any> {
        console.group('room candidate');
        roomSite.dump();
        console.groupEnd();
    }

    async onRoomFailed(
        _site: DigSite,
        _room: Room,
        _roomSite: DigSite,
        error: string
    ): Promise<any> {
        console.log('Room Failed - ', error);
    }

    async onRoomSuccess(site: DigSite, room: Room): Promise<any> {
        console.group('Added Room - ' + room.toString());
        site.dump();
        console.groupEnd();
    }

    async onLoopsAdded(_site: DigSite): Promise<any> {
        console.log('loops added');
    }
    async onLakesAdded(_site: DigSite): Promise<any> {
        console.log('lakes added');
    }
    async onBridgesAdded(_site: DigSite): Promise<any> {
        console.log('bridges added');
    }
    async onStairsAdded(_site: DigSite): Promise<any> {
        console.log('stairs added');
    }

    //

    async onBuildError(_data: BuildData, error: string) {
        console.log(`onBuildError - error: ${error}`);
    }

    async onBlueprintPick(
        _data: BuildData,
        blueprint: Blueprint,
        flags: number,
        depth: number
    ) {
        console.log(
            `onBlueprintPick - ${
                blueprint.id
            }, depth = ${depth}, matchingFlags = ${GWU.flag.toString(
                Flags,
                flags
            )}`
        );
    }

    async onBlueprintCandidates(data: BuildData, blueprint: Blueprint) {
        const label = `onBlueprintCandidates - ${blueprint.id}`;
        console.group(label);
        data.candidates.dump();
        console.groupEnd();
    }

    async onBlueprintStart(data: BuildData, blueprint: Blueprint) {
        console.group(
            `onBlueprintStart - ${blueprint.id} @ ${data.originX},${
                data.originY
            } : stepCount: ${
                blueprint.steps.length
            }, size: [${blueprint.size.toString()}], flags: ${GWU.flag.toString(
                Flags,
                blueprint.flags
            )}`
        );
    }

    async onBlueprintInterior(data: BuildData, blueprint: Blueprint) {
        console.group(`onBlueprintInterior - ${blueprint.id}`);
        data.interior.dump();
        console.groupEnd();
    }

    async onBlueprintFail(
        data: BuildData,
        blueprint: Blueprint,
        error: string
    ) {
        console.log(
            `onBlueprintFail - ${blueprint.id} @ ${data.originX},${data.originY} : error: ${error}`
        );
        console.groupEnd();
    }

    async onBlueprintSuccess(data: BuildData, blueprint: Blueprint) {
        console.log(
            `onBlueprintSuccess - ${blueprint.id} @ ${data.originX},${data.originY}`
        );
        console.groupEnd();
    }

    async onStepStart(data: BuildData, blueprint: Blueprint, step: BuildStep) {
        console.group(
            `onStepStart - ${blueprint.id}[${
                blueprint.steps.indexOf(step) + 1
            }/${blueprint.steps.length}] @ ${data.originX},${
                data.originY
            } : count: [${step.count.toString()}], flags: ${GWU.flag.toString(
                StepFlags,
                step.flags
            )}`
        );
    }

    async onStepCandidates(
        data: BuildData,
        blueprint: Blueprint,
        step: BuildStep,
        candidates: GWU.grid.NumGrid,
        wantCount: number
    ) {
        const haveCount = candidates.count((v) => v == 1);
        console.log(
            `onStepCandidates - ${blueprint.id}[${
                blueprint.steps.indexOf(step) + 1
            }/${blueprint.steps.length}] @ ${data.originX},${
                data.originY
            } : wantCount: ${wantCount}, have: ${haveCount}`
        );
        candidates.dump();
    }

    async onStepInstanceSuccess(
        _data: BuildData,
        _blueprint: Blueprint,
        _step: BuildStep,
        x: number,
        y: number
    ) {
        console.log(`onStepInstance @ ${x},${y}`);
    }

    async onStepInstanceFail(
        _data: BuildData,
        _blueprint: Blueprint,
        _step: BuildStep,
        x: number,
        y: number,
        error: string
    ) {
        console.log(`onStepInstanceFail @ ${x},${y} - error: ${error}`);
    }

    async onStepSuccess(
        data: BuildData,
        blueprint: Blueprint,
        step: BuildStep
    ) {
        console.log(
            `onStepSuccess - ${blueprint.id}[${
                blueprint.steps.indexOf(step) + 1
            }/${blueprint.steps.length}] @ ${data.originX},${
                data.originY
            } : count: [${step.count.toString()}], flags: ${GWU.flag.toString(
                StepFlags,
                step.flags
            )}`
        );
        console.groupEnd();
    }

    async onStepFail(
        data: BuildData,
        blueprint: Blueprint,
        step: BuildStep,
        error: string
    ) {
        console.log(
            `onStepFail - ${blueprint.id}[${
                blueprint.steps.indexOf(step) + 1
            }/${blueprint.steps.length}] @ ${data.originX},${
                data.originY
            } : error : ${error}`
        );
        console.groupEnd();
    }
}
