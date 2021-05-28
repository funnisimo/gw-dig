import * as GW from 'gw-utils';

export interface BlobConfig {
    roundCount: number;
    minBlobWidth: number;
    minBlobHeight: number;
    maxBlobWidth: number;
    maxBlobHeight: number;
    percentSeeded: number;
    birthParameters: string /* char[9] */;
    survivalParameters: string /* char[9] */;
}

export class Blob {
    public options: BlobConfig = {
        roundCount: 5,
        minBlobWidth: 10,
        minBlobHeight: 10,
        maxBlobWidth: 40,
        maxBlobHeight: 20,
        percentSeeded: 50,
        birthParameters: 'ffffffttt',
        survivalParameters: 'ffffttttt',
    };

    constructor(opts: Partial<BlobConfig> = {}) {
        Object.assign(this.options, opts);
        this.options.birthParameters = this.options.birthParameters.toLowerCase();
        this.options.survivalParameters = this.options.survivalParameters.toLowerCase();

        if (this.options.minBlobWidth >= this.options.maxBlobWidth) {
            this.options.minBlobWidth = Math.round(
                0.75 * this.options.maxBlobWidth
            );
            this.options.maxBlobWidth = Math.round(
                1.25 * this.options.maxBlobWidth
            );
        }
        if (this.options.minBlobHeight >= this.options.maxBlobHeight) {
            this.options.minBlobHeight = Math.round(
                0.75 * this.options.maxBlobHeight
            );
            this.options.maxBlobHeight = Math.round(
                1.25 * this.options.maxBlobHeight
            );
        }
    }

    carve(dest: GW.grid.NumGrid): GW.utils.Bounds {
        let i, j, k;
        let blobNumber, blobSize, topBlobNumber, topBlobSize;

        let bounds = new GW.utils.Bounds(0, 0, 0, 0);

        const left = Math.floor((dest.width - this.options.maxBlobWidth) / 2);
        const top = Math.floor((dest.height - this.options.maxBlobHeight) / 2);

        let tries = 10;

        // Generate blobs until they satisfy the minBlobWidth and minBlobHeight restraints
        do {
            // Clear buffer.
            dest.fill(0);

            // Fill relevant portion with noise based on the percentSeeded argument.
            for (i = 0; i < this.options.maxBlobWidth; i++) {
                for (j = 0; j < this.options.maxBlobHeight; j++) {
                    dest[i + left][j + top] = GW.random.chance(
                        this.options.percentSeeded
                    )
                        ? 1
                        : 0;
                }
            }

            // Some iterations of cellular automata
            for (k = 0; k < this.options.roundCount; k++) {
                if (!this._cellularAutomataRound(dest)) {
                    k = this.options.roundCount; // cellularAutomataRound did not make any changes
                }
            }

            // Now to measure the result. These are best-of variables; start them out at worst-case values.
            topBlobSize = 0;
            topBlobNumber = 0;

            // Fill each blob with its own number, starting with 2 (since 1 means floor), and keeping track of the biggest:
            blobNumber = 2;

            for (i = 0; i < dest.width; i++) {
                for (j = 0; j < dest.height; j++) {
                    if (dest[i][j] == 1) {
                        // an unmarked blob
                        // Mark all the cells and returns the total size:
                        blobSize = dest.floodFill(i, j, 1, blobNumber);
                        if (blobSize > topBlobSize) {
                            // if this blob is a new record
                            topBlobSize = blobSize;
                            topBlobNumber = blobNumber;
                        }
                        blobNumber++;
                    }
                }
            }

            // Figure out the top blob's height and width:
            dest.valueBounds(topBlobNumber, bounds);
        } while (
            (bounds.width < this.options.minBlobWidth ||
                bounds.height < this.options.minBlobHeight ||
                topBlobNumber == 0) &&
            --tries
        );

        // Replace the winning blob with 1's, and everything else with 0's:
        for (i = 0; i < dest.width; i++) {
            for (j = 0; j < dest.height; j++) {
                if (dest[i][j] == topBlobNumber) {
                    dest[i][j] = 1;
                } else {
                    dest[i][j] = 0;
                }
            }
        }

        // Populate the returned variables.
        return bounds;
    }

    _cellularAutomataRound(grid: GW.grid.NumGrid) {
        let i, j, nbCount, newX, newY;
        let dir;
        let buffer2;

        buffer2 = GW.grid.alloc(grid.width, grid.height);
        buffer2.copy(grid); // Make a backup of this in buffer2, so that each generation is isolated.

        let didSomething = false;
        for (i = 0; i < grid.width; i++) {
            for (j = 0; j < grid.height; j++) {
                nbCount = 0;
                for (dir = 0; dir < GW.utils.DIRS.length; dir++) {
                    newX = i + GW.utils.DIRS[dir][0];
                    newY = j + GW.utils.DIRS[dir][1];
                    if (grid.hasXY(newX, newY) && buffer2[newX][newY]) {
                        nbCount++;
                    }
                }
                if (
                    !buffer2[i][j] &&
                    this.options.birthParameters[nbCount] == 't'
                ) {
                    grid[i][j] = 1; // birth
                    didSomething = true;
                } else if (
                    buffer2[i][j] &&
                    this.options.survivalParameters[nbCount] == 't'
                ) {
                    // survival
                } else {
                    grid[i][j] = 0; // death
                    didSomething = true;
                }
            }
        }

        GW.grid.free(buffer2);
        return didSomething;
    }
}

export function fillBlob(
    grid: GW.grid.NumGrid,
    opts: Partial<BlobConfig> = {}
): GW.utils.Bounds {
    const blob = new Blob(opts);
    return blob.carve(grid);
}
