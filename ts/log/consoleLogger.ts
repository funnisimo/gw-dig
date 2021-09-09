import * as GWU from 'gw-utils';
import { Room } from '../types';
import { DigSite } from '../site/digSite';
import { Flags } from '../blueprint/blueprint';
import { Logger } from './logger';
import { BuildData } from '../blueprint/data';
import { BuildStep, StepFlags } from '../blueprint/buildStep';

export class ConsoleLogger implements Logger {
    async onDigFirstRoom(site: DigSite) {
        console.group('dig first room');
        site.dump();
        console.groupEnd();
    }

    async onRoomCandidate(room: Room, roomSite: DigSite): Promise<any> {
        console.group('room candidate: ' + room.toString());
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

    async onBuildError(error: string) {
        console.log(`onBuildError - error: ${error}`);
    }

    async onBlueprintPick(data: BuildData, flags: number, depth: number) {
        console.log(
            `onBlueprintPick - ${
                data.blueprint.id
            }, depth = ${depth}, matchingFlags = ${GWU.flag.toString(
                Flags,
                flags
            )}`
        );
    }

    async onBlueprintCandidates(data: BuildData) {
        const label = `onBlueprintCandidates - ${data.blueprint.id}`;
        console.group(label);
        data.candidates.dump();
        console.groupEnd();
    }

    async onBlueprintStart(data: BuildData) {
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

    async onBlueprintInterior(data: BuildData) {
        console.group(`onBlueprintInterior - ${data.blueprint.id}`);
        data.interior.dump();
        console.groupEnd();
    }

    async onBlueprintFail(data: BuildData, error: string) {
        console.log(
            `onBlueprintFail - ${data.blueprint.id} @ ${data.originX},${data.originY} : error: ${error}`
        );
        console.groupEnd();
    }

    async onBlueprintSuccess(data: BuildData) {
        console.log(
            `onBlueprintSuccess - ${data.blueprint.id} @ ${data.originX},${data.originY}`
        );
        console.groupEnd();
    }

    async onStepStart(data: BuildData, step: BuildStep) {
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

    async onStepCandidates(
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

    async onStepInstanceSuccess(
        _data: BuildData,
        _step: BuildStep,
        x: number,
        y: number
    ) {
        console.log(`onStepInstance @ ${x},${y}`);
    }

    async onStepInstanceFail(
        _data: BuildData,
        _step: BuildStep,
        x: number,
        y: number,
        error: string
    ) {
        console.log(`onStepInstanceFail @ ${x},${y} - error: ${error}`);
    }

    async onStepSuccess(data: BuildData, step: BuildStep) {
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

    async onStepFail(data: BuildData, step: BuildStep, error: string) {
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
