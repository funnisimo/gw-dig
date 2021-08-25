import * as GWU from 'gw-utils';
import * as GWM from 'gw-map';

import * as SITE from '../site';
import * as STEP from './buildStep';
import { Builder } from './builder';

const Fl = GWU.flag.fl;

export enum Flags {
    BP_ROOM = Fl(10), // spawns in a dead-end room that is dominated by a chokepoint of the given size (as opposed to a random place of the given size)
    BP_VESTIBULE = Fl(1), // spawns in a doorway (location must be given) and expands outward, to guard the room
    BP_REWARD = Fl(7), // metered reward machines
    BP_ADOPT_ITEM = Fl(0), // the machine must adopt an item (e.g. a door key)

    BP_PURGE_PATHING_BLOCKERS = Fl(2), // clean out traps and other T_PATHING_BLOCKERs
    BP_PURGE_INTERIOR = Fl(3), // clean out all of the terrain in the interior before generating the machine
    BP_PURGE_LIQUIDS = Fl(4), // clean out all of the liquids in the interior before generating the machine

    BP_SURROUND_WITH_WALLS = Fl(5), // fill in any impassable gaps in the perimeter (e.g. water, lava, brimstone, traps) with wall
    BP_IMPREGNABLE = Fl(6), // impassable perimeter and interior tiles are locked; tunneling bolts will bounce off harmlessly

    BP_OPEN_INTERIOR = Fl(8), // clear out walls in the interior, widen the interior until convex or bumps into surrounding areas
    BP_MAXIMIZE_INTERIOR = Fl(9), // same as BP_OPEN_INTERIOR but expands the room as far as it can go, potentially surrounding the whole level.
    BP_REDESIGN_INTERIOR = Fl(14), // nuke and pave -- delete all terrain in the interior and build entirely new rooms within the bounds

    BP_TREAT_AS_BLOCKING = Fl(11), // abort the machine if, were it filled with wall tiles, it would disrupt the level connectivity
    BP_REQUIRE_BLOCKING = Fl(12), // abort the machine unless, were it filled with wall tiles, it would disrupt the level connectivity

    BP_NO_INTERIOR_FLAG = Fl(13), // don't flag the area as being part of a machine
}

export interface Options {
    tags: string | string[];
    frequency: GWU.frequency.FrequencyConfig;
    size: string | number[];
    flags: GWU.flag.FlagBase;
    steps: Partial<STEP.StepOptions>[];
}

export class Blueprint {
    public tags: string[] = [];
    public frequency: GWU.frequency.FrequencyFn;
    public size: GWU.range.Range;
    public flags: number = 0;
    public steps: STEP.BuildStep[] = [];
    public id: string = 'n/a';

    constructor(opts: Partial<Options> = {}) {
        if (opts.tags) {
            if (typeof opts.tags === 'string') {
                opts.tags = opts.tags.split(/[,|]/).map((v) => v.trim());
            }
            this.tags = opts.tags;
        }
        this.frequency = GWU.frequency.make(opts.frequency || 100);

        if (opts.size) {
            this.size = GWU.range.make(opts.size);
            if (this.size.lo > this.size.hi)
                throw new Error('Blueprint size must be small to large.');
        } else {
            this.size = GWU.range.make([0, 999999]);
        }
        if (opts.flags) {
            this.flags = GWU.flag.from(Flags, opts.flags);
        }
        if (opts.steps) {
            this.steps = opts.steps.map((cfg) => new STEP.BuildStep(cfg));
        }
    }

    getChance(level: number, tags?: string | string[]) {
        if (tags && tags.length) {
            if (typeof tags === 'string') {
                tags = tags.split(/[,|]/).map((v) => v.trim());
            }
            // Must match all tags!
            if (!tags.every((want) => this.tags.includes(want))) return 0;
        }
        return this.frequency(level);
    }

    get isRoom() {
        return !!(this.flags & Flags.BP_ROOM);
    }
    get isReward() {
        return !!(this.flags & Flags.BP_REWARD);
    }
    get isVestiblue() {
        return !!(this.flags & Flags.BP_VESTIBULE);
    }
    get adoptsItem() {
        return !!(this.flags & Flags.BP_ADOPT_ITEM);
    }
    get treatAsBlocking() {
        return !!(this.flags & Flags.BP_TREAT_AS_BLOCKING);
    }
    get requireBlocking() {
        return !!(this.flags & Flags.BP_REQUIRE_BLOCKING);
    }
    get purgeInterior() {
        return !!(this.flags & Flags.BP_PURGE_INTERIOR);
    }
    get purgeBlockers() {
        return !!(this.flags & Flags.BP_PURGE_PATHING_BLOCKERS);
    }
    get purgeLiquids() {
        return !!(this.flags & Flags.BP_PURGE_LIQUIDS);
    }
    get surroundWithWalls() {
        return !!(this.flags & Flags.BP_SURROUND_WITH_WALLS);
    }
    get makeImpregnable() {
        return !!(this.flags & Flags.BP_IMPREGNABLE);
    }
    get maximizeInterior() {
        return !!(this.flags & Flags.BP_MAXIMIZE_INTERIOR);
    }
    get openInterior() {
        return !!(this.flags & Flags.BP_OPEN_INTERIOR);
    }
    get noInteriorFlag() {
        return !!(this.flags & Flags.BP_NO_INTERIOR_FLAG);
    }

    qualifies(requiredFlags: number, depth: number) {
        if (
            this.frequency(depth) <= 0 ||
            // Must have the required flags:
            ~this.flags & requiredFlags ||
            // May NOT have BP_ADOPT_ITEM unless that flag is required:
            this.flags & Flags.BP_ADOPT_ITEM & ~requiredFlags ||
            // May NOT have BP_VESTIBULE unless that flag is required:
            this.flags & Flags.BP_VESTIBULE & ~requiredFlags
        ) {
            return false;
        }
        return true;
    }

    pickLocation(site: SITE.BuildSite) {
        // Find a location and map out the machine interior.
        if (this.isRoom) {
            // If it's a room machine, count up the gates of appropriate
            // choke size and remember where they are. The origin of the room will be the gate location.

            const randSite = GWU.random.matchingLoc(
                site.width,
                site.height,
                (x, y) => {
                    return (
                        site.hasCellFlag(
                            x,
                            y,
                            GWM.map.flags.Cell.IS_GATE_SITE
                        ) && this.size.contains(site.getChokeCount(x, y))
                    );
                }
            );
            if (!randSite || randSite[0] < 0 || randSite[1] < 0) {
                // If no suitable sites, abort.
                console.log(
                    'Failed to build a machine; there was no eligible door candidate for the chosen room machine from blueprint.'
                );
                return false;
            }
            return randSite;
        } else if (this.isVestiblue) {
            //  Door machines must have locations passed in. We can't pick one ourselves.
            console.log(
                'ERROR: Attempted to build a vestiblue without a location being provided.'
            );
            return false;
        }

        // Pick a random origin location.
        const pos = GWU.random.matchingLoc(site.width, site.height, (x, y) =>
            site.isPassable(x, y)
        );
        if (!pos || pos[0] < 0 || pos[1] < 0) return false;
        return pos;
    }

    // Assume site has been analyzed (aka GateSites and ChokeCounts set)
    computeInterior(builder: Builder) {
        let failsafe = this.isRoom ? 10 : 20;
        let tryAgain;
        const interior = builder.interior;
        const site = builder.site;

        do {
            tryAgain = false;
            if (--failsafe <= 0) {
                console.log(
                    'Failed to build a machine; failed repeatedly to find a suitable blueprint location.'
                );
                return false;
            }

            interior.fill(0);

            // Find a location and map out the machine interior.
            if (this.isRoom) {
                // If it's a room machine, count up the gates of appropriate
                // choke size and remember where they are. The origin of the room will be the gate location.

                // Now map out the interior into interior[][].
                // Start at the gate location and do a depth-first floodfill to grab all adjoining tiles with the
                // same or lower choke value, ignoring any tiles that are already part of a machine.
                // If we get false from this, try again. If we've tried too many times already, abort.
                tryAgain = !this.addTileToInteriorAndIterate(
                    builder,
                    builder.originX,
                    builder.originY
                );
            } else if (this.isVestiblue) {
                if (!this.computeInteriorForVestibuleMachine(builder)) {
                    // TODO - tryagain = true?
                    console.error(
                        'ERROR: Attempted to build a door machine from blueprint: not enough room.'
                    );
                    return false;
                }
                // success
            } else {
                // Find a location and map out the interior for a non-room machine.
                // The strategy here is simply to pick a random location on the map,
                // expand it along a pathing map by one space in all directions until the size reaches
                // the chosen size, and then make sure the resulting space qualifies.
                // If not, try again. If we've tried too many times already, abort.

                let distanceMap = GWU.grid.alloc(
                    interior.width,
                    interior.height
                );

                SITE.computeDistanceMap(
                    site,
                    distanceMap,
                    builder.originX,
                    builder.originY,
                    this.size.hi
                );

                const seq = GWU.random.sequence(site.width * site.height);
                let qualifyingTileCount = 0; // Keeps track of how many interior cells we've added.
                let totalFreq = this.size.value(); // Keeps track of the goal size.

                for (
                    let k = 0;
                    k < 1000 && qualifyingTileCount < totalFreq;
                    k++
                ) {
                    for (
                        let n = 0;
                        n < seq.length && qualifyingTileCount < totalFreq;
                        n++
                    ) {
                        const i = Math.floor(seq[n] / site.height);
                        const j = seq[n] % site.height;

                        if (distanceMap[i][j] == k) {
                            interior[i][j] = 1;
                            qualifyingTileCount++;

                            if (
                                site.isOccupied(i, j) ||
                                site.hasCellFlag(
                                    i,
                                    j,
                                    GWM.map.flags.Cell.IS_IN_MACHINE
                                )
                            ) {
                                // Abort if we've entered another machine or engulfed another machine's item or monster.
                                tryAgain = true;
                                qualifyingTileCount = totalFreq; // This is a hack to drop out of these three for-loops.
                            }
                        }
                    }
                }

                // Now make sure the interior map satisfies the machine's qualifications.
                if (qualifyingTileCount < totalFreq) {
                    tryAgain = true;
                    console.log('too small');
                } else if (
                    this.treatAsBlocking &&
                    SITE.siteDisruptedBy(site, interior, {
                        machine: site.machineCount,
                    })
                ) {
                    console.log('disconnected');
                    tryAgain = true;
                } else if (
                    this.requireBlocking &&
                    SITE.siteDisruptedSize(site, interior) < 100
                ) {
                    console.log('not disconnected enough');
                    tryAgain = true; // BP_REQUIRE_BLOCKING needs some work to make sure the disconnect is interesting.
                }
                // If locationFailsafe runs out, tryAgain will still be true, and we'll try a different machine.
                // If we're not choosing the blueprint, then don't bother with the locationFailsafe; just use the higher-level failsafe.

                GWU.grid.free(distanceMap);
            }

            // Now loop if necessary.
        } while (tryAgain);

        // console.log(tryAgain, failsafe);

        return true;
    }

    // Assumes (startX, startY) is in the machine.
    // Returns true if everything went well, and false if we ran into a machine component
    // that was already there, as we don't want to build a machine around it.
    addTileToInteriorAndIterate(
        builder: Builder,
        startX: number,
        startY: number
    ): boolean {
        let goodSoFar = true;
        const interior = builder.interior;
        const site = builder.site;

        interior[startX][startY] = 1;
        const startChokeCount = site.getChokeCount(startX, startY);

        for (let dir = 0; dir < 4 && goodSoFar; dir++) {
            const newX = startX + GWU.utils.DIRS[dir][0];
            const newY = startY + GWU.utils.DIRS[dir][1];
            if (!site.hasXY(newX, newY)) continue;
            if (interior[newX][newY]) continue; // already done

            if (
                site.isOccupied(newX, newY) ||
                (site.hasCellFlag(
                    newX,
                    newY,
                    GWM.map.flags.Cell.IS_IN_MACHINE
                ) &&
                    !site.hasCellFlag(
                        newX,
                        newY,
                        GWM.map.flags.Cell.IS_GATE_SITE
                    ))
            ) {
                // Abort if there's an item in the room.
                // Items haven't been populated yet, so the only way this could happen is if another machine
                // previously placed an item here.
                // Also abort if we're touching another machine at any point other than a gate tile.
                return false;
            }
            if (
                site.getChokeCount(newX, newY) <= startChokeCount && // don't have to worry about walls since they're all 30000
                !site.hasCellFlag(newX, newY, GWM.map.flags.Cell.IS_IN_MACHINE)
            ) {
                goodSoFar = this.addTileToInteriorAndIterate(
                    builder,
                    newX,
                    newY
                );
            }
        }
        return goodSoFar;
    }

    computeInteriorForVestibuleMachine(builder: Builder) {
        let success = true;

        const site = builder.site;
        const interior = builder.interior;
        interior.fill(0);

        // console.log('DISTANCE MAP', originX, originY);
        // RUT.Grid.dump(distMap);

        const doorChokeCount = site.getChokeCount(
            builder.originX,
            builder.originY
        );

        const vestibuleLoc = [-1, -1];
        let vestibuleChokeCount = doorChokeCount;
        GWU.utils.eachNeighbor(
            builder.originX,
            builder.originY,
            (x, y) => {
                const count = site.getChokeCount(x, y);
                if (count == doorChokeCount) return;
                if (count > 10000) return;
                if (count < 0) return;
                vestibuleLoc[0] = x;
                vestibuleLoc[1] = y;
                vestibuleChokeCount = count;
            },
            true
        );

        const roomSize = vestibuleChokeCount - doorChokeCount;
        if (this.size.contains(roomSize)) {
            // The room entirely fits within the vestibule desired size
            const count = interior.floodFill(
                vestibuleLoc[0],
                vestibuleLoc[1],
                (_v, i, j) => {
                    if (site.isOccupied(i, j)) {
                        success = false;
                    }
                    return site.getChokeCount(i, j) === vestibuleChokeCount;
                },
                1
            );
            if (success && this.size.contains(count)) return true;
        }

        let qualifyingTileCount = 0; // Keeps track of how many interior cells we've added.
        const wantSize = this.size.value(); // Keeps track of the goal size.

        const distMap = GWU.grid.alloc(site.width, site.height);
        SITE.computeDistanceMap(
            site,
            distMap,
            builder.originX,
            builder.originY,
            this.size.hi
        );

        const cells = GWU.random.sequence(site.width * site.height);
        success = true;
        for (let k = 0; k < 1000 && qualifyingTileCount < wantSize; k++) {
            for (
                let i = 0;
                i < cells.length && qualifyingTileCount < wantSize;
                ++i
            ) {
                const x = Math.floor(cells[i] / site.height);
                const y = cells[i] % site.height;

                const dist = distMap[x][y];

                if (dist != k) continue;
                if (site.isOccupied(x, y)) {
                    success = false;
                    qualifyingTileCount = wantSize;
                }
                if (site.getChokeCount(x, y) <= doorChokeCount) continue;

                interior[x][y] = 1;
                qualifyingTileCount += 1;
            }
        }

        // Now make sure the interior map satisfies the machine's qualifications.
        if (
            this.treatAsBlocking &&
            SITE.siteDisruptedBy(site, interior, { machine: site.machineCount })
        ) {
            success = false;
        } else if (
            this.requireBlocking &&
            SITE.siteDisruptedSize(site, interior) < 100
        ) {
            success = false;
        }
        GWU.grid.free(distMap);
        return success;
    }

    prepareInteriorWithMachineFlags(builder: Builder) {
        const interior = builder.interior;
        const site = builder.site;

        // If requested, clear and expand the room as far as possible until either it's convex or it bumps into surrounding rooms
        if (this.maximizeInterior) {
            this.expandMachineInterior(builder, 1);
        } else if (this.openInterior) {
            this.expandMachineInterior(builder, 4);
        }

        // If requested, cleanse the interior -- no interesting terrain allowed.
        if (this.purgeInterior) {
            interior.forEach((v, x, y) => {
                if (v) site.setTile(x, y, SITE.FLOOR);
            });
        }

        // If requested, purge pathing blockers -- no traps allowed.
        if (this.purgeBlockers) {
            interior.forEach((v, x, y) => {
                if (!v) return;
                if (site.blocksPathing(x, y)) {
                    site.setTile(x, y, SITE.FLOOR);
                }
            });
        }

        // If requested, purge the liquid layer in the interior -- no liquids allowed.
        if (this.purgeLiquids) {
            interior.forEach((v, x, y) => {
                if (v && site.isAnyLiquid(x, y)) {
                    site.setTile(x, y, SITE.FLOOR);
                }
            });
        }

        // Surround with walls if requested.
        if (this.surroundWithWalls) {
            interior.forEach((v, x, y) => {
                if (
                    !v ||
                    site.hasCellFlag(x, y, GWM.map.flags.Cell.IS_GATE_SITE)
                )
                    return;
                GWU.utils.eachNeighbor(
                    x,
                    y,
                    (i, j) => {
                        if (!interior.hasXY(i, j)) return; // Not valid x,y
                        if (interior[i][j]) return; // is part of machine
                        if (site.isWall(i, j)) return; // is already a wall (of some sort)
                        if (
                            site.hasCellFlag(
                                i,
                                j,
                                GWM.map.flags.Cell.IS_GATE_SITE
                            )
                        )
                            return; // is a door site
                        if (
                            site.hasCellFlag(
                                i,
                                j,
                                GWM.map.flags.Cell.IS_IN_MACHINE
                            )
                        )
                            return; // is part of a machine
                        if (!site.blocksPathing(i, j)) return; // is not a blocker for the player (water?)
                        site.setTile(i, j, SITE.WALL);
                    },
                    false
                );
            });
        }

        // Completely clear the interior, fill with granite, and cut entirely new rooms into it from the gate site.
        // Then zero out any portion of the interior that is still wall.
        // if (flags & BPFlags.BP_REDESIGN_INTERIOR) {
        //     RUT.Map.Blueprint.redesignInterior(map, interior, originX, originY, dungeonProfileIndex);
        // }

        // Reinforce surrounding tiles and interior tiles if requested to prevent tunneling in or through.
        if (this.makeImpregnable) {
            interior.forEach((v, x, y) => {
                if (
                    !v ||
                    site.hasCellFlag(x, y, GWM.map.flags.Cell.IS_GATE_SITE)
                )
                    return;
                site.setCellFlag(x, y, GWM.map.flags.Cell.IMPREGNABLE);
                GWU.utils.eachNeighbor(
                    x,
                    y,
                    (i, j) => {
                        if (!interior.hasXY(i, j)) return;
                        if (interior[i][j]) return;
                        if (
                            site.hasCellFlag(
                                i,
                                j,
                                GWM.map.flags.Cell.IS_GATE_SITE
                            )
                        )
                            return;
                        site.setCellFlag(i, j, GWM.map.flags.Cell.IMPREGNABLE);
                    },
                    false
                );
            });
        }

        // If necessary, label the interior as IS_IN_AREA_MACHINE or IS_IN_ROOM_MACHINE and mark down the number.
        const machineNumber = builder.machineNumber;
        interior.forEach((v, x, y) => {
            if (!v) return;
            site.setMachine(x, y, machineNumber, this.isRoom);
            // secret doors mess up machines
            if (site.isSecretDoor(x, y)) {
                site.setTile(x, y, SITE.DOOR);
            }
        });
    }

    expandMachineInterior(builder: Builder, minimumInteriorNeighbors = 1) {
        let madeChange;
        const interior = builder.interior;
        const site = builder.site;

        do {
            madeChange = false;
            interior.forEach((_v, x, y) => {
                // if (v && site.isDoor(x, y)) {
                //     site.setTile(x, y, SITE.FLOOR); // clean out the doors...
                //     return;
                // }
                if (site.hasCellFlag(x, y, GWM.map.flags.Cell.IS_IN_MACHINE))
                    return;
                if (!site.blocksPathing(x, y)) return;

                let nbcount = 0;
                GWU.utils.eachNeighbor(
                    x,
                    y,
                    (i, j) => {
                        if (!interior.hasXY(i, j)) return; // Not in map
                        if (interior[i][j] && !site.blocksPathing(i, j)) {
                            ++nbcount; // in machine and open tile
                        }
                    },
                    false
                );

                if (nbcount < minimumInteriorNeighbors) return;

                nbcount = 0;
                GWU.utils.eachNeighbor(
                    x,
                    y,
                    (i, j) => {
                        if (!interior.hasXY(i, j)) return; // not on map
                        if (interior[i][j]) return; // already part of machine
                        if (
                            !site.isWall(i, j) ||
                            site.hasCellFlag(
                                i,
                                j,
                                GWM.map.flags.Cell.IS_IN_MACHINE
                            )
                        ) {
                            ++nbcount; // tile is not a wall or is in a machine
                        }
                    },
                    false
                );

                if (nbcount) return;

                // Eliminate this obstruction; welcome its location into the machine.
                madeChange = true;
                interior[x][y] = 1;
                if (site.blocksPathing(x, y)) {
                    site.setTile(x, y, SITE.FLOOR);
                }
                GWU.utils.eachNeighbor(x, y, (i, j) => {
                    if (!interior.hasXY(i, j)) return;
                    if (site.isSet(i, j)) return;
                    site.setTile(i, j, SITE.WALL);
                });
            });
        } while (madeChange);
    }

    calcDistances(builder: Builder) {
        builder.distanceMap.fill(0);
        SITE.computeDistanceMap(
            builder.site,
            builder.distanceMap,
            builder.originX,
            builder.originY,
            this.size.hi
        );
        let qualifyingTileCount = 0;
        const distances = new Array(100).fill(0);

        builder.interior.forEach((v, x, y) => {
            if (!v) return;
            const dist = builder.distanceMap[x][y];
            if (dist < 100) {
                distances[dist]++; // create a histogram of distances -- poor man's sort function
                qualifyingTileCount++;
            }
        });

        let distance25 = Math.round(qualifyingTileCount / 4);
        let distance75 = Math.round((3 * qualifyingTileCount) / 4);
        for (let i = 0; i < 100; i++) {
            if (distance25 <= distances[i]) {
                distance25 = i;
                break;
            } else {
                distance25 -= distances[i];
            }
        }

        for (let i = 0; i < 100; i++) {
            if (distance75 <= distances[i]) {
                distance75 = i;
                break;
            } else {
                distance75 -= distances[i];
            }
        }

        builder.distance25 = distance25;
        builder.distance75 = distance75;
    }

    pickComponents() {
        const alternativeFlags = [
            STEP.StepFlags.BF_ALTERNATIVE,
            STEP.StepFlags.BF_ALTERNATIVE_2,
        ];

        const keepFeature = new Array(this.steps.length).fill(true);

        for (let j = 0; j <= 1; j++) {
            let totalFreq = 0;
            for (let i = 0; i < keepFeature.length; i++) {
                if (this.steps[i].flags & alternativeFlags[j]) {
                    keepFeature[i] = false;
                    totalFreq++;
                }
            }
            if (totalFreq > 0) {
                let randIndex = GWU.random.range(1, totalFreq);
                for (let i = 0; i < keepFeature.length; i++) {
                    if (this.steps[i].flags & alternativeFlags[j]) {
                        if (randIndex == 1) {
                            keepFeature[i] = true; // This is the alternative that gets built. The rest do not.
                            break;
                        } else {
                            randIndex--;
                        }
                    }
                }
            }
        }

        return this.steps.filter((_f, i) => keepFeature[i]);
    }

    clearInteriorFlag(builder: Builder) {
        builder.interior.forEach((v, x, y) => {
            if (!v) return;
            if (
                !builder.site.hasCellFlag(
                    x,
                    y,
                    GWM.map.flags.Cell.IS_WIRED |
                        GWM.map.flags.Cell.IS_CIRCUIT_BREAKER
                )
            ) {
                builder.site.setMachine(x, y, 0);
            }
        });

        // for (i = 0; i < map.width; i++) {
        //     for (j = 0; j < map.height; j++) {
        //         const cell = RUT.Map.getCell(map, i, j);
        //         if (
        //             cell.machineNumber == map.machineNumber &&
        //             !RUT.Cell.hasMechFlag(
        //                 cell,
        //                 MechFlags.TM_IS_WIRED |
        //                     MechFlags.TM_IS_CIRCUIT_BREAKER
        //             )
        //         ) {
        //             cell.flags &= ~CellFlags.IS_IN_MACHINE;
        //             cell.machineNumber = 0;
        //         }
        //     }
        // }
    }

    // async function redesignInterior( interior, originX, originY, theDungeonProfileIndex) {
    //     let i, j, n, newX, newY;
    //     let dir;
    //     let orphanList = [];
    //     let orphanCount = 0;

    //     let grid, pathingGrid, costGrid;
    //     grid = allocGrid();

    //     for (i=0; i<DCOLS; i++) {
    //         for (j=0; j<DROWS; j++) {
    //             if (interior[i][j]) {
    //                 if (i == originX && j == originY) {
    //                     grid[i][j] = 1; // All rooms must grow from this space.
    //                 } else {
    //                     grid[i][j] = 0; // Other interior squares are fair game for placing rooms.
    //                 }
    //             } else if (cellIsPassableOrDoor(i, j)) {
    //                 grid[i][j] = 1; // Treat existing level as already built (though shielded by a film of -1s).
    //                 for (dir = 0; dir < 4; dir++) {
    //                     newX = i + nbDirs[dir][0];
    //                     newY = j + nbDirs[dir][1];
    //                     if (coordinatesAreInMap(newX, newY)
    //                         && interior[newX][newY]
    //                         && (newX != originX || newY != originY)) {

    //                         orphanList[orphanCount] = [newX, newY];
    //                         orphanCount++;
    //                         grid[i][j] = -1; // Treat the orphaned door as off limits.

    //                         break;
    //                     }
    //                 }
    //             } else {
    //                 grid[i][j] = -1; // Exterior spaces are off limits.
    //             }
    //         }
    //     }
    //     await attachRooms(grid, dungeonProfileCatalog[theDungeonProfileIndex], 40, 40);

    //     // Connect to preexisting rooms that were orphaned (mostly preexisting machine rooms).
    //     if (orphanCount > 0) {
    //         pathingGrid = allocGrid();
    //         costGrid = allocGrid();
    //         for (n = 0; n < orphanCount; n++) {

    //             if (D_INSPECT_MACHINES) {
    //                 dumpLevelToScreen();
    //                 copyGrid(pathingGrid, grid);
    //                 findReplaceGrid(pathingGrid, -1, -1, 0);
    //                 hiliteGrid(pathingGrid, /* Color. */green, 50);
    //                 plotCharWithColor('X', mapToWindowX(orphanList[n][0]), mapToWindowY(orphanList[n][1]), /* Color. */black, /* Color. */orange);
    //                 await temporaryMessage("Orphan detected:", true);
    //             }

    //             for (i=0; i<DCOLS; i++) {
    //                 for (j=0; j<DROWS; j++) {
    //                     if (interior[i][j]) {
    //                         if (grid[i][j] > 0) {
    //                             pathingGrid[i][j] = 0;
    //                             costGrid[i][j] = 1;
    //                         } else {
    //                             pathingGrid[i][j] = 30000;
    //                             costGrid[i][j] = 1;
    //                         }
    //                     } else {
    //                         pathingGrid[i][j] = 30000;
    //                         costGrid[i][j] = PDS_OBSTRUCTION;
    //                     }
    //                 }
    //             }
    //             dijkstraScan(pathingGrid, costGrid, false);

    //             i = orphanList[n][0];
    //             j = orphanList[n][1];
    //             while (pathingGrid[i][j] > 0) {
    //                 for (dir = 0; dir < 4; dir++) {
    //                     newX = i + nbDirs[dir][0];
    //                     newY = j + nbDirs[dir][1];

    //                     if (coordinatesAreInMap(newX, newY)
    //                         && pathingGrid[newX][newY] < pathingGrid[i][j]) {

    //                         grid[i][j] = 1;
    //                         i = newX;
    //                         j = newY;
    //                         break;
    //                     }
    //                 }
    //                 brogueAssert(dir < 4);
    //                 if (D_INSPECT_MACHINES) {
    //                     dumpLevelToScreen();
    //                     displayGrid(pathingGrid);
    //                     plotCharWithColor('X', mapToWindowX(i), mapToWindowY(j), /* Color. */black, /* Color. */orange);
    //                     await temporaryMessage("Orphan connecting:", true);
    //                 }
    //             }
    //         }
    //         freeGrid(pathingGrid);
    //         freeGrid(costGrid);
    //     }

    //     await addLoops(grid, 10);
    //     for(i=0; i<DCOLS; i++) {
    //         for(j=0; j<DROWS; j++) {
    //             if (interior[i][j]) {
    //                 if (grid[i][j] >= 0) {
    //                     pmap[i][j].layers[SURFACE] = pmap[i][j].layers[GAS] = NOTHING;
    //                 }
    //                 if (grid[i][j] == 0) {
    //                     pmap[i][j].layers[DUNGEON] = GRANITE;
    //                     interior[i][j] = false;
    //                 }
    //                 if (grid[i][j] >= 1) {
    //                     pmap[i][j].layers[DUNGEON] = FLOOR;
    //                 }
    //             }
    //         }
    //     }
    //     freeGrid(grid);
    // }
}

export const blueprints: Record<string, Blueprint> = {};

export function install(id: string, blueprint: Blueprint | Partial<Options>) {
    if (!(blueprint instanceof Blueprint)) {
        blueprint = new Blueprint(blueprint);
    }
    blueprints[id] = blueprint;
    blueprint.id = id;
    return blueprint;
}

export function random(requiredFlags: number, depth: number): Blueprint {
    const matches = Object.values(blueprints).filter((b) =>
        b.qualifies(requiredFlags, depth)
    );
    return GWU.random.item(matches);
}
