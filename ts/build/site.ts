import * as GW from 'gw-utils';
import * as DigSite from '../dig/site';

const Fl = GW.flag.fl;

export enum Flags {
    IS_IN_LOOP = Fl(0), // this cell is part of a terrain loop
    IS_CHOKEPOINT = Fl(1), // if this cell is blocked, part of the map will be rendered inaccessible
    IS_GATE_SITE = Fl(2), // consider placing a locked door here

    IS_IN_ROOM_MACHINE = Fl(3),
    IS_IN_AREA_MACHINE = Fl(4),

    IMPREGNABLE = Fl(5), // no tunneling allowed!

    IS_WIRED = Fl(6),
    IS_CIRCUIT_BREAKER = Fl(7),

    IS_IN_MACHINE = IS_IN_ROOM_MACHINE | IS_IN_AREA_MACHINE, // sacred ground; don't generate items here, or teleport randomly to it
}

export interface PlaceOptions {
    superpriority: boolean;
    blockedByOtherLayers: boolean;
    blockedByActors: boolean;
    blockedByItems: boolean;
    volume: number;
}

export type PlaceTileOptions = Partial<PlaceOptions>;

export interface BuildSite extends DigSite.DigSite {
    hasSiteFlag: (x: number, y: number, flag: number) => boolean;
    setSiteFlag: (x: number, y: number, flag: number) => void;
    clearSiteFlag: (x: number, y: number, flag: number) => void;

    getChokeCount: (x: number, y: number) => number;
    setChokeCount: (x: number, y: number, count: number) => void;

    isOccupied: GW.utils.XYMatchFunc;
    hasItem: GW.utils.XYMatchFunc;
    hasActor: GW.utils.XYMatchFunc;

    placeTile: (
        x: number,
        y: number,
        tile: number | string,
        options: PlaceTileOptions
    ) => boolean;

    backup: () => any;
    restore: (backup: any) => void;
    deleteBackup: (backup: any) => void;

    nextMachineId: () => number;
    getMachine: (x: number, y: number) => number;
    setMachine: (x: number, y: number, id: number, isRoom?: boolean) => void;
}

export class GridSite extends DigSite.GridSite implements BuildSite {
    public flags: GW.grid.NumGrid;
    public choke: GW.grid.NumGrid;
    public machine: GW.grid.NumGrid;
    public machineCount = 0;

    constructor(width: number, height: number) {
        super(width, height);
        this.flags = GW.grid.alloc(width, height);
        this.choke = GW.grid.alloc(width, height);
        this.machine = GW.grid.alloc(width, height);
    }

    free() {
        GW.grid.free(this.flags);
        GW.grid.free(this.choke);
        GW.grid.free(this.machine);
        super.free();
    }

    backup(): GridSite {
        const backup = new GridSite(this.width, this.height);
        backup.tiles.copy(this.tiles);
        backup.flags.copy(this.flags);
        backup.choke.copy(this.choke);
        return backup;
    }

    restore(backup: GridSite) {
        this.tiles.copy(backup.tiles);
        this.flags.copy(backup.flags);
        this.choke.copy(backup.choke);
        backup.free();
    }

    deleteBackup(backup: GridSite) {
        backup.free();
    }

    hasSiteFlag(x: number, y: number, flag: number): boolean {
        const have = this.flags.get(x, y) || 0;
        return !!(have & flag);
    }

    setSiteFlag(x: number, y: number, flag: number): void {
        const value = (this.flags.get(x, y) || 0) | flag;
        this.flags.set(x, y, value);
    }

    clearSiteFlag(x: number, y: number, flag: number): void {
        const value = (this.flags.get(x, y) || 0) & ~flag;
        this.flags.set(x, y, value);
    }

    getChokeCount(x: number, y: number): number {
        return this.choke.get(x, y) || 0;
    }

    setChokeCount(x: number, y: number, count: number) {
        this.choke.set(x, y, count);
    }

    isOccupied(_x: number, _y: number) {
        return false;
    }
    hasItem(_x: number, _y: number) {
        return false;
    }
    hasActor(_x: number, _y: number) {
        return false;
    }

    placeTile(
        x: number,
        y: number,
        tile: number | string,
        _options?: PlaceTileOptions
    ) {
        return this.setTile(x, y, tile);
    }

    nextMachineId(): number {
        return ++this.machineCount;
    }
    getMachine(x: number, y: number) {
        return this.machine[x][y];
    }
    setMachine(x: number, y: number, id: number, isRoom = true) {
        this.machine[x][y] = id;
        if (id == 0) {
            this.clearSiteFlag(x, y, Flags.IS_IN_MACHINE);
        } else {
            this.setSiteFlag(
                x,
                y,
                isRoom ? Flags.IS_IN_ROOM_MACHINE : Flags.IS_IN_AREA_MACHINE
            );
        }
    }
}
