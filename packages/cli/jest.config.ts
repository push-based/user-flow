/* eslint-disable */
export default {
  displayName: 'cli',
  preset: '../../jest.preset.js',
  transform: {
    '^.+\\.[tj]s$': ['ts-jest', '<rootDir>/tsconfig.spec.json'],
  },
  transformIgnorePatterns: ['/node_modules/(?!markdown-table/.*)'],
  moduleFileExtensions: ['ts', 'js', 'html'],
  coverageDirectory: '../../coverage/packages/cli',
  testTimeout: 40_000,
};
