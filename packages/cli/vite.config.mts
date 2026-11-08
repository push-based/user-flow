/// <reference types='vitest' />
import { defineConfig } from 'vite';

export default defineConfig({
  resolve: {
    tsconfigPaths: true,
  },
  cacheDir: '../../node_modules/.vite/packages/cli',

  plugins: [],

  test: {
    globals: true,
    environment: 'node',
    include: ['src/**/*.test.ts'],
    pool: 'threads',
    maxWorkers: 1,
    reporters: [['default', { summary: false }]],
    coverage: {
      reportsDirectory: '../../coverage/packages/cli',
      provider: 'v8',
    },
  },
});
