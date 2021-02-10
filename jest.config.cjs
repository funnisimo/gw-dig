module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    setupFilesAfterEnv: [
      "jest-extended",
      "<rootDir>/test/matchers.ts"
    ],
    coverageDirectory: "./coverage",
    collectCoverageFrom: ['ts/**'],
    moduleFileExtensions: ['js', 'json', 'ts', 'node', 'mjs']
  };
  