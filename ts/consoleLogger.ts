import * as GWU from 'gw-utils';
import { Blueprint, Flags } from './blueprint/blueprint';
import { BuildLogger } from './logger';
import { BuildData } from './blueprint/data';
import { BuildStep, StepFlags } from './blueprint/buildStep';

export class ConsoleLogger implements BuildLogger {
    async onError(_data: BuildData, error: string) {
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
