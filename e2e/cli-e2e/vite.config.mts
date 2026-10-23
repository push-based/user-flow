/// <reference types="vitest" />
import { defineConfig } from 'vite';
import { nxReadySignal } from '@nx/vite/plugins/nx-ready-signal.plugin';

export default defineConfig({
  resolve: {
    tsconfigPaths: true,
  },
  cacheDir: '../../node_modules/.vite/cli-e2e',

  plugins: [nxReadySignal()],

  test: {
    globals: true,
    reporters: [['default', { summary: false }]],
    testTimeout: 30_000,

    pool: 'threads',
    maxWorkers: 1,

    environment: 'node',
    include: ['tests/**/*.e2e.test.ts'],
    setupFiles: ['setup.e2e.ts'],
    globalSetup: ['../../global-setup.e2e.ts'],
  },
});
