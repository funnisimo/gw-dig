// GW-CANVAS: rollup.config.js

import { terser } from 'rollup-plugin-terser';
import dts from 'rollup-plugin-dts';
import { nodeResolve } from '@rollup/plugin-node-resolve';

// import peerDepsExternal from 'rollup-plugin-peer-deps-external';
// import { nodeResolve } from '@rollup/plugin-node-resolve';
// import commonjs from '@rollup/plugin-commonjs';

export default [
    {
        input: 'js/index.js',
        external: ['gw-utils', 'gw-map'],
        plugins: [nodeResolve()],
        output: [
            {
                file: 'dist/gw-dig.min.js',
                format: 'umd',
                name: 'GWDig',
                // freeze: false,
                // extend: true,
                sourcemap: true,
                globals: {
                    // 'gw-map': 'GW',
                    'gw-utils': 'GW',
                },
                plugins: [terser()],
            },
            {
                file: 'dist/gw-dig.js',
                format: 'umd',
                name: 'GWDig',
                // freeze: false,
                // extend: true,
                sourcemap: false,
                globals: {
                    // 'gw-map': 'GW',
                    'gw-utils': 'GW',
                },
            },
            // {
            //   file: 'dist/gw-dig.cjs',
            //   format: 'cjs',
            //   freeze: false,
            //   globals: {
            //     'gw-map': 'GW',
            //     'gw-utils': 'GW'
            //   }
            // },
            {
                file: 'dist/gw-dig.mjs',
                format: 'es',
                freeze: false,
                globals: {
                    // 'gw-map': 'GW',
                    'gw-utils': 'GW',
                },
            },
        ],
    },
    {
        input: './js/index.d.ts',
        output: [{ file: 'dist/gw-dig.d.ts', format: 'es' }],
        plugins: [dts()],
    },
];
