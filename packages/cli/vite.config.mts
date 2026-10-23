/// <reference types='vitest' />
import { defineConfig } from 'vite';

import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';

export default defineConfig({
  cacheDir: '../../node_modules/.vite/packages/cli',

  plugins: [nxViteTsPaths()],

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
