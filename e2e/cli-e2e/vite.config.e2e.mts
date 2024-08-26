/// <reference types="vitest" />
import { defineConfig } from 'vite';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';

export default defineConfig({
  cacheDir: '../../node_modules/.vite/cli-e2e',

  plugins: [nxViteTsPaths()],

  test: {
    globals: true,
    reporters: ['basic'],
    testTimeout: 30_000,

    pool: 'threads',
    poolOptions: { threads: { singleThread: true } },

    environment: 'node',
    include: ['tests/**/*.e2e.test.ts'],
    setupFiles: ['setup.e2e.ts'],
    globalSetup: ['../../global-setup.e2e.ts'],
  },
});
