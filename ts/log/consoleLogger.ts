import * as GWU from 'gw-utils';
import { Room } from '../types';
import { DigSite } from '../site/digSite';
import { Flags } from '../blueprint/blueprint';
import { Logger } from './logger';
import { BuildData } from '../blueprint/data';
import { BuildStep, StepFlags } from '../blueprint/buildStep';

export class ConsoleLogger implements Logger {
    onDigFirstRoom(site: DigSite) {
        console.group('dig first room');
        site.dump();
        console.groupEnd();
    }

    onRoomCandidate(room: Room, roomSite: DigSite): void {
        console.group('room candidate: ' + room.toString());
        roomSite.dump();
        console.groupEnd();
    }

    onRoomFailed(
        _site: DigSite,
        _room: Room,
        _roomSite: DigSite,
        error: string
    ): void {
        console.log('Room Failed - ', error);
    }

    onRoomSuccess(site: DigSite, room: Room): void {
        console.group('Added Room - ' + room.toString());
        site.dump();
        console.groupEnd();
    }

    onLoopsAdded(_site: DigSite): void {
        console.log('loops added');
    }
    onLakesAdded(_site: DigSite): void {
        console.log('lakes added');
    }
    onBridgesAdded(_site: DigSite): void {
        console.log('bridges added');
    }
    onStairsAdded(_site: DigSite): void {
        console.log('stairs added');
    }

    //

    onBuildError(error: string) {
        console.log(`onBuildError - error: ${error}`);
    }

    onBlueprintPick(data: BuildData, flags: number, depth: number) {
        console.log(
            `onBlueprintPick - ${
                data.blueprint.id
            }, depth = ${depth}, matchingFlags = ${GWU.flag.toString(
                Flags,
                flags
            )}`
        );
    }

    onBlueprintCandidates(data: BuildData) {
        const label = `onBlueprintCandidates - ${data.blueprint.id}`;
        console.group(label);
        data.candidates.dump();
        console.groupEnd();
    }

    onBlueprintStart(data: BuildData) {
        console.group(
            `onBlueprintStart - ${data.blueprint.id} @ ${data.originX},${
                data.originY
            } : stepCount: ${
                data.blueprint.steps.length
            }, size: [${data.blueprint.size.toString()}], flags: ${GWU.flag.toString(
                Flags,
                data.blueprint.flags
            )}`
        );
    }

    onBlueprintInterior(data: BuildData) {
        console.group(`onBlueprintInterior - ${data.blueprint.id}`);
        data.interior.dump();
        console.groupEnd();
    }

    onBlueprintFail(data: BuildData, error: string) {
        console.log(
            `onBlueprintFail - ${data.blueprint.id} @ ${data.originX},${data.originY} : error: ${error}`
        );
        console.groupEnd();
    }

    onBlueprintSuccess(data: BuildData) {
        console.log(
            `onBlueprintSuccess - ${data.blueprint.id} @ ${data.originX},${data.originY}`
        );
        console.groupEnd();
    }

    onStepStart(data: BuildData, step: BuildStep) {
        console.group(
            `onStepStart - ${data.blueprint.id}[${
                data.blueprint.steps.indexOf(step) + 1
            }/${data.blueprint.steps.length}] @ ${data.originX},${
                data.originY
            } : count: [${step.count.toString()}], flags: ${GWU.flag.toString(
                StepFlags,
                step.flags
            )}`
        );
        console.log(step.toString());
    }

    onStepCandidates(
        data: BuildData,
        step: BuildStep,
        candidates: GWU.grid.NumGrid,
        wantCount: number
    ) {
        const haveCount = candidates.count((v) => v == 1);
        console.log(
            `onStepCandidates - ${data.blueprint.id}[${
                data.blueprint.steps.indexOf(step) + 1
            }/${data.blueprint.steps.length}] @ ${data.originX},${
                data.originY
            } : wantCount: ${wantCount}, have: ${haveCount}`
        );
        candidates.dump();
        if (haveCount == 0) {
            console.log('No candidates - check interior');
            data.interior.dump();
        }
    }

    onStepInstanceSuccess(
        _data: BuildData,
        _step: BuildStep,
        x: number,
        y: number
    ) {
        console.log(`onStepInstance @ ${x},${y}`);
    }

    onStepInstanceFail(
        _data: BuildData,
        _step: BuildStep,
        x: number,
        y: number,
        error: string
    ) {
        console.log(`onStepInstanceFail @ ${x},${y} - error: ${error}`);
    }

    onStepSuccess(data: BuildData, step: BuildStep) {
        console.log(
            `onStepSuccess - ${data.blueprint.id}[${
                data.blueprint.steps.indexOf(step) + 1
            }/${data.blueprint.steps.length}] @ ${data.originX},${
                data.originY
            } : count: [${step.count.toString()}], flags: ${GWU.flag.toString(
                StepFlags,
                step.flags
            )}`
        );
        console.groupEnd();
    }

    onStepFail(data: BuildData, step: BuildStep, error: string) {
        console.log(
            `onStepFail - ${data.blueprint.id}[${
                data.blueprint.steps.indexOf(step) + 1
            }/${data.blueprint.steps.length}] @ ${data.originX},${
                data.originY
            } : error : ${error}`
        );
        console.groupEnd();
    }
}
