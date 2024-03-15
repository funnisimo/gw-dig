// GW-DIG: rollup.config.js

// GW-UTILS: rollup.config.js

import terser from '@rollup/plugin-terser';
import dts from 'rollup-plugin-dts';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';

export default [
    {
        input: 'ts/index.ts',
        external: ['gw-utils'],
        plugins: [nodeResolve(), commonjs(), typescript()],
        output: [
            {
                file: 'dist/gw-dig.min.js',
                format: 'umd',
                name: 'GWD',
                // freeze: false,
                // extend: true,
                sourcemap: true,
                globals: {
                    'gw-utils': 'GWU',
                },
                plugins: [terser()],
            },
            {
                file: 'dist/gw-dig.js',
                format: 'umd',
                name: 'GWD',
                // freeze: false,
                // extend: true,
                sourcemap: true,
                globals: {
                    'gw-utils': 'GWU',
                },
            },
            {
                file: 'dist/gw-dig.mjs',
                format: 'es',
                // freeze: false,
                sourcemap: true,
                globals: {
                    'gw-utils': 'GWU',
                },
            },
        ],
    },
    {
        input: 'ts/index.ts',
        output: [{ file: 'dist/gw-dig.d.ts', format: 'es' }],
        plugins: [dts()],
    },
];
