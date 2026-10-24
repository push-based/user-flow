module.exports = {
  displayName: 'nx-plugin-e2e',
  preset: '../../jest.preset.js',
  transform: {
    '^.+\\.[tj]s$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.spec.json' }],
  },
  moduleFileExtensions: ['ts', 'js', 'html'],
  coverageDirectory: '../../coverage/e2e/nx-plugin-e2e',
  // scaffolding a workspace and installing into it is far slower than a unit test
  testTimeout: 600_000,
  // teardown kills the forked registry, but its verdaccio grandchild keeps the
  // pipe open on linux and jest would otherwise never exit
  forceExit: true,
  globalSetup: '../../tools/scripts/start-local-registry.ts',
  globalTeardown: '../../tools/scripts/stop-local-registry.ts',
};
