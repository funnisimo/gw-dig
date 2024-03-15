import * as Grid from 'gw-utils/grid';
import * as Rng from 'gw-utils/rng';
import * as XY from 'gw-utils/xy';

export interface CarveConnectOpts {
    rng?: Rng.Random;
    connectValue?: number | ((v: number) => boolean);
    maxTunnel?: number;
    tunnelValue?: number;
}

export function connect(
    dest: Grid.NumGrid,
    opts: CarveConnectOpts = {}
): boolean {
    let connectValue: (v: number) => boolean;
    if (typeof opts.connectValue === 'function') {
        connectValue = opts.connectValue;
    } else {
        let c = opts.connectValue === undefined ? 1 : opts.connectValue;
        connectValue = (v) => v == c;
    }

    const regions = Grid.alloc(dest.width, dest.height, 0);

    dest.forEach((v, i, j) => {
        if (connectValue(v)) {
            // an unmarked blob
            // Mark all the cells and returns the total size:
            regions.set(i, j, 1);
        }
    });

    let blobNumber = 1;
    let topBlobSize = 0;
    let topBlobNumber = 0;
    let status: boolean[] = [true, true];

    regions.forEach((v, i, j) => {
        if (v == 1) {
            ++blobNumber;
            status.push(false);
            let blobSize = regions.floodFill(i, j, 1, blobNumber);
            if (blobSize > topBlobSize) {
                topBlobNumber = blobNumber;
                topBlobSize = blobSize;
            }
        }
    });

    // empty or 1 region
    if (blobNumber <= 2) {
        Grid.free(regions);
        return true;
    }

    let maxTunnel = opts.maxTunnel || 5;
    let tunnelValue = opts.tunnelValue || 1;
    status[topBlobNumber] = true;

    regions.randomEach((v, x, y) => {
        if (status[v] == true) return;

        XY.DIRS4.forEach((dir) => {
            // let log = false;
            for (let i = 1; i <= maxTunnel; ++i) {
                let nx = x + dir[0] * i;
                let ny = y + dir[1] * i;
                if (!regions.hasXY(nx, ny)) {
                    // log = false;
                    break;
                }
                let v2 = regions.get(nx, ny)!;
                if (v2 == 0) {
                    // skip
                    // log = true;
                } else if (v2 != v) {
                    regions.floodFill(x, y, v, v2);
                    for (let j = 1; j <= i; ++j) {
                        let tx = x + dir[0] * j;
                        let ty = y + dir[1] * j;
                        regions.set(tx, ty, v2);
                        dest.set(tx, ty, tunnelValue);
                        // log = false;
                    }
                    status[v] = true;
                    v = v2; // In case we connect in another direction too!
                    break;
                } else {
                    break;
                }
            }
            // if (log) {
            //     console.log(
            //         ' - Failed to find tunnel from ' +
            //             x +
            //             ',' +
            //             y +
            //             ' in dir ' +
            //             dir
            //     );
            //     regions.dump();
            // }
        });
    }, opts.rng);

    Grid.free(regions);
    return status.every((v) => v);
}
