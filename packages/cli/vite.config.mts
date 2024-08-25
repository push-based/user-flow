/// <reference types='vitest' />
import { defineConfig } from 'vite';

import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';

export default defineConfig({
  cacheDir: '../../.vite/packages/cli',

  plugins: [nxViteTsPaths()],

  test: {
    globals: true,
    environment: 'node',
    include: ['src/**/*.test.ts'],
    pool: 'threads',
    poolOptions: { threads: { singleThread: true } },
    reporters: ['basic'],
    coverage: {
      reportsDirectory: '../../coverage/packages/cli',
      provider: 'v8',
    },
    watch: false,
  },
});
