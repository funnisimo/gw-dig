import * as GWM from 'gw-map';
import * as BLUE from '../blueprint';

export interface MachineHordeConfig extends GWM.horde.HordeConfig {
    blueprint: BLUE.BlueType;
}

export class MachineHorde extends GWM.horde.Horde {
    machine: BLUE.BlueType | null = null;

    constructor(config: MachineHordeConfig) {
        super(config);
        this.machine = config.blueprint || null;
    }

    _addLeader(
        leader: GWM.actor.Actor,
        map: GWM.map.Map,
        x: number,
        y: number,
        opts: GWM.horde.SpawnOptions
    ): boolean {
        if (this.machine) {
            BLUE.build(this.machine, map, x, y);
        }

        if (!super._addLeader(leader, map, x, y, opts)) return false;

        return true;
    }
}
