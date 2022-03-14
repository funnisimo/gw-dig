import * as GWU from 'gw-utils';
import * as Utils from './utils';

import * as TILE from './tile';
import * as ITEM from './item';
import * as HORDE from './horde';
import * as ANALYZE from './analyze';

export interface SetTileOptions {
    superpriority?: boolean;
    blockedByOtherLayers?: boolean;
    blockedByActors?: boolean;
    blockedByItems?: boolean;
    volume?: number;
    machine?: number;
}

export enum Flags {
    CHOKEPOINT = GWU.flag.fl(0),
    GATE_SITE = GWU.flag.fl(1),
    IN_LOOP = GWU.flag.fl(2),
    IN_MACHINE = GWU.flag.fl(3),
    IN_AREA_MACHINE = GWU.flag.fl(4),
    IMPREGNABLE = GWU.flag.fl(5),
}

export interface SiteOptions {
    rng?: GWU.rng.Random;
}

export class Site {
    _tiles: GWU.grid.NumGrid;
    _doors: GWU.grid.NumGrid;
    _flags: GWU.grid.NumGrid;
    _machine: GWU.grid.NumGrid;
    _chokeCounts: GWU.grid.NumGrid;

    rng: GWU.rng.Random = GWU.rng.random;

    items: ITEM.ItemInstance[] = [];
    actors: HORDE.ActorInstance[] = [];

    depth: number;
    machineCount: number;

    constructor(width: number, height: number, opts: SiteOptions = {}) {
        this.depth = 0;
        this.machineCount = 0;

        this._tiles = GWU.grid.alloc(width, height);
        this._doors = GWU.grid.alloc(width, height);
        this._flags = GWU.grid.alloc(width, height);
        this._machine = GWU.grid.alloc(width, height);
        this._chokeCounts = GWU.grid.alloc(width, height);

        if (opts.rng) {
            this.rng = opts.rng;
        }
    }

    free() {
        GWU.grid.free(this._tiles);
        GWU.grid.free(this._doors);
        GWU.grid.free(this._flags);
        GWU.grid.free(this._machine);
        GWU.grid.free(this._chokeCounts);
    }
    clear() {
        this._tiles.fill(0);
        this._doors.fill(0);
        this._flags.fill(0);
        this._machine.fill(0);
        this._chokeCounts.fill(0);
        // this.depth = 0;
        this.machineCount = 0;
    }
    dump(fmt?: GWU.grid.GridFormat<number>) {
        if (fmt) {
            return this._tiles.dump(fmt);
        }

        this._tiles.dump((c) => TILE.getTile(c).ch || '?');
    }
    // drawInto(buffer: GWU.canvas.Buffer): void {
    //     buffer.blackOut();
    //     this.tiles.forEach((t, x, y) => {
    //         const tile = GWM.tile.get(t);
    //         buffer.drawSprite(x, y, tile.sprite);
    //     });
    // }

    copy(other: Site) {
        this.depth = other.depth;
        this.machineCount = other.machineCount;

        this._tiles.copy(other._tiles);
        this._doors.copy(other._doors);
        this._machine.copy(other._machine);
        this._flags.copy(other._flags);
        this._chokeCounts.copy(other._chokeCounts);

        this.rng = other.rng;

        this.items = other.items.slice();
        this.actors = other.actors.slice();
    }

    copyTiles(other: Site, offsetX = 0, offsetY = 0) {
        GWU.xy.forRect(this.width, this.height, (x, y) => {
            const otherX = x - offsetX;
            const otherY = y - offsetY;

            const v = other._tiles.get(otherX, otherY);
            if (!v) return;
            this._tiles[x][y] = v;
        });
    }

    setSeed(seed: number) {
        this.rng.seed(seed);
    }

    get width() {
        return this._tiles.width;
    }
    get height() {
        return this._tiles.height;
    }

    hasXY(x: number, y: number) {
        return this._tiles.hasXY(x, y);
    }
    isBoundaryXY(x: number, y: number) {
        return this._tiles.isBoundaryXY(x, y);
    }

    isPassable(x: number, y: number) {
        return (
            this.isFloor(x, y) ||
            this.isDoor(x, y) ||
            this.isBridge(x, y) ||
            this.isStairs(x, y) ||
            this.isShallow(x, y)
        );
    }

    isNothing(x: number, y: number) {
        return this.hasTile(x, y, 'NOTHING');
    }

    isDiggable(x: number, y: number) {
        return this.hasTile(x, y, 'NOTHING') || this.hasTile(x, y, 'WALL');
    }

    isProtected(_x: number, _y: number): boolean {
        return false;
    }

    isFloor(x: number, y: number) {
        return this.hasTile(x, y, 'FLOOR');
    }

    isDoor(x: number, y: number) {
        return this.hasTile(x, y, 'DOOR');
    }

    isSecretDoor(x: number, y: number) {
        return this.hasTile(x, y, 'SECRET_DOOR');
    }

    isBridge(x: number, y: number) {
        return this.hasTile(x, y, 'BRIDGE');
    }

    isWall(x: number, y: number) {
        return this.hasTile(x, y, 'WALL') || this.hasTile(x, y, 'IMPREGNABLE');
    }

    blocksMove(x: number, y: number) {
        return this.isNothing(x, y) || this.isWall(x, y) || this.isDeep(x, y);
    }

    blocksDiagonal(x: number, y: number) {
        return this.isNothing(x, y) || this.isWall(x, y);
    }

    blocksPathing(x: number, y: number) {
        return (
            this.isNothing(x, y) ||
            this.isWall(x, y) ||
            this.isDeep(x, y) ||
            this.isStairs(x, y)
        );
    }

    blocksVision(x: number, y: number) {
        return this.isNothing(x, y) || this.isWall(x, y);
    }

    blocksItems(x: number, y: number) {
        return this.blocksPathing(x, y) || this.blocksPathing(x, y);
        // site.hasCellFlag(
        //     x,
        //     y,
        //     GWM.flags.Cell.IS_CHOKEPOINT |
        //         GWM.flags.Cell.IS_IN_LOOP |
        //         GWM.flags.Cell.IS_IN_MACHINE
        // );
    }

    blocksEffects(x: number, y: number) {
        return this.isWall(x, y);
    }

    isStairs(x: number, y: number) {
        return (
            this.hasTile(x, y, 'UP_STAIRS') || this.hasTile(x, y, 'DOWN_STAIRS')
        );
    }

    isDeep(x: number, y: number) {
        return this.hasTile(x, y, 'DEEP');
    }

    isShallow(x: number, y: number) {
        return this.hasTile(x, y, 'SHALLOW');
    }

    isAnyLiquid(x: number, y: number) {
        return this.isDeep(x, y) || this.isShallow(x, y);
    }

    isSet(x: number, y: number) {
        return (this._tiles.get(x, y) || 0) > 0;
    }

    tileBlocksMove(tile: string): boolean {
        return TILE.getTile(tile).blocksMove || false;
    }

    setTile(x: number, y: number, tile: string, _opts: SetTileOptions = {}) {
        // if (tile instanceof GWM.tile.Tile) {
        //     tile = tile.index;
        // }
        // if (typeof tile === 'string') {
        const id = TILE.tileId(tile);
        // }
        if (!this._tiles.hasXY(x, y)) return false;
        this._tiles[x][y] = id;
        return true;
    }
    clearTile(x: number, y: number) {
        if (this.hasXY(x, y)) {
            this._tiles[x][y] = 0;
        }
    }
    makeImpregnable(x: number, y: number): void {
        this._flags[x][y] |= Flags.IMPREGNABLE;
        // site.setCellFlag(x, y, GWM.flags.Cell.IMPREGNABLE);
    }

    isImpregnable(x: number, y: number): boolean {
        return !!(this._flags[x][y] & Flags.IMPREGNABLE);
    }

    hasTile(x: number, y: number, tile: string): boolean {
        // if (tile instanceof GWM.tile.Tile) {
        //     tile = tile.index;
        // }
        // if (typeof tile === 'string') {
        const id = TILE.tileId(tile);
        // }
        return this._tiles.hasXY(x, y) && this._tiles[x][y] == id;
    }

    getChokeCount(x: number, y: number): number {
        return this._chokeCounts[x][y];
    }
    setChokeCount(x: number, y: number, count: number): void {
        this._chokeCounts[x][y] = count;
    }

    setChokepoint(x: number, y: number): void {
        this._flags[x][y] |= Flags.CHOKEPOINT;
    }
    isChokepoint(x: number, y: number): boolean {
        return !!(this._flags[x][y] & Flags.CHOKEPOINT);
    }
    clearChokepoint(x: number, y: number): void {
        this._flags[x][y] &= ~Flags.CHOKEPOINT;
    }

    setGateSite(x: number, y: number): void {
        this._flags[x][y] |= Flags.GATE_SITE;
    }
    isGateSite(x: number, y: number): boolean {
        return !!(this._flags[x][y] & Flags.GATE_SITE);
    }

    clearGateSite(x: number, y: number): void {
        this._flags[x][y] &= ~Flags.GATE_SITE;
    }

    setInLoop(x: number, y: number): void {
        this._flags[x][y] |= Flags.IN_LOOP;
    }
    isInLoop(x: number, y: number): boolean {
        return !!(this._flags[x][y] & Flags.IN_LOOP);
    }
    clearInLoop(x: number, y: number): void {
        this._flags[x][y] &= ~Flags.IN_LOOP;
    }

    analyze(updateChokeCounts = true): void {
        ANALYZE.analyze(this, updateChokeCounts);
    }

    snapshot(): Site {
        const other = new Site(this.width, this.height);
        other.copy(this);
        return other;
    }
    restore(snapshot: Site) {
        this.copy(snapshot);
    }

    nextMachineId(): number {
        this.machineCount += 1;
        return this.machineCount;
    }
    setMachine(x: number, y: number, id: number, isRoom?: boolean): void {
        this._machine[x][y] = id;
        const flag = isRoom ? Flags.IN_MACHINE : Flags.IN_AREA_MACHINE;
        this._flags[x][y] |= flag;
    }
    isAreaMachine(x: number, y: number): boolean {
        return !!(this._machine[x][y] & Flags.IN_AREA_MACHINE);
    }
    isInMachine(x: number, y: number): boolean {
        return this._machine[x][y] > 0;
    }
    getMachine(x: number, y: number): number {
        return this._machine[x][y];
    }

    needsMachine(_x: number, _y: number): boolean {
        // site.hasCellFlag(
        //     i,
        //     j,
        //     GWM.flags.Cell.IS_WIRED | GWM.flags.Cell.IS_CIRCUIT_BREAKER
        // );
        return false;
    }

    updateDoorDirs(): void {
        this._doors.update((_v, x, y) => {
            return Utils.directionOfDoorSite(this, x, y);
        });
    }
    getDoorDir(x: number, y: number): number {
        return this._doors[x][y];
    }

    // tileBlocksMove(tile: number): boolean {
    //     return (
    //         tile === WALL ||
    //         tile === DEEP ||
    //         tile === IMPREGNABLE ||
    //         tile === DIG.NOTHING
    //     );
    // }

    isOccupied(x: number, y: number): boolean {
        return this.hasActor(x, y) || this.hasItem(x, y);
    }

    canSpawnActor(x: number, y: number, _actor: HORDE.ActorInstance): boolean {
        // const cell = map.cell(x, y);
        // if (actor.avoidsCell(cell)) return false;

        // if (Map.isHallway(map, x, y)) {
        //     return false;
        // }
        return this.isFloor(x, y);
    }

    eachActor(cb: (a: HORDE.ActorInstance) => void): void {
        this.actors.forEach(cb);
    }
    addActor(x: number, y: number, a: HORDE.ActorInstance): number {
        a.x = x;
        a.y = y;
        this.actors.push(a);
        return this.actors.length;
    }
    getActor(i: number): HORDE.ActorInstance {
        return this.actors[i];
    }
    // removeActor(a: HORDE.ActorInstance): void {
    //     GWU.arrayDelete(this.actors, a);
    // }
    forbidsActor(x: number, y: number, _a: HORDE.ActorInstance): boolean {
        return !this.isFloor(x, y);
    }
    hasActor(x: number, y: number): boolean {
        return this.actors.some((a) => a.x === x && a.y === y);
    }

    eachItem(cb: (i: ITEM.ItemInstance) => void): void {
        this.items.forEach(cb);
    }
    addItem(x: number, y: number, i: ITEM.ItemInstance): number {
        i.x = x;
        i.y = y;
        this.items.push(i);
        return this.items.length;
    }
    getItem(i: number): ITEM.ItemInstance {
        return this.items[i];
    }
    // removeItem(i: ITEM.ItemInstance): void {
    //     GWU.arrayDelete(this.items, i);
    // }
    forbidsItem(x: number, y: number, _i: ITEM.ItemInstance): boolean {
        return !this.isFloor(x, y);
    }
    hasItem(x: number, y: number): boolean {
        return this.items.some((i) => i.x === x && i.y === y);
    }
}
