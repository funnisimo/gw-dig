module.exports = {
    preset: 'ts-jest/presets/default-esm',
    testEnvironment: 'node',
    setupFilesAfterEnv: ['jest-extended/all'],
    coverageDirectory: './coverage',
    collectCoverageFrom: ['ts/**'],
    moduleFileExtensions: ['js', 'json', 'ts', 'node', 'mjs'],

    moduleNameMapper: {
        '^(\\.{1,2}/.*)\\.js$': '$1',
    },
    transform: {
        // '^.+\\.[tj]sx?$' to process js/ts with `ts-jest`
        // '^.+\\.m?[tj]sx?$' to process js/ts/mjs/mts with `ts-jest`
        // '^.+\\.tsx?$': for ts
        '^.+\\.[tj]sx?$': [
            'ts-jest',
            {
                useESM: true,
            },
        ],
    },
};
