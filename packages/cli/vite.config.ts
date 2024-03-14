/// <reference types='vitest' />
import { defineConfig } from 'vite';

import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';

export default defineConfig({
  root: __dirname,
  cacheDir: '../../node_modules/.vite/packages/cli',

  plugins: [nxViteTsPaths()],

  test: {
    globals: true,
    cache: {
      dir: '../../node_modules/.vitest',
    },
    environment: 'node',
    include: ['src/**/*.test.ts'],

    reporters: ['default'],
    coverage: {
      reportsDirectory: '../../coverage/packages/cli',
      provider: 'v8',
    },
  },
});
