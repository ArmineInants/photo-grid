module.exports = {
    preset: 'ts-jest/presets/default-esm',
    testEnvironment: 'jsdom',
    moduleNameMapper: {
      '^@/(.*)$': '<rootDir>/src/$1'
    },
    setupFilesAfterEnv: [
      '<rootDir>/jest.setup.env.ts',
      '<rootDir>/src/setupTests.ts'
    ],
    transform: {
      '^.+\\.(ts|tsx)$': ['ts-jest', {
        useESM: true,
        tsconfig: 'tsconfig.app.json'
      }]
    },
    extensionsToTreatAsEsm: ['.ts', '.tsx'],
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
    transformIgnorePatterns: [
      'node_modules/(?!(@testing-library/jest-dom)/)'
    ]
};