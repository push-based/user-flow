import { defineConfig } from 'tsdown';

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    cli: 'src/cli.ts',
  },
  outDir: '../../dist/packages/cli',
  tsconfig: 'tsconfig.lib.json',
  platform: 'node',
  format: 'esm',
  dts: true,
  sourcemap: true,
  copy: [
    { from: '../../README.md', to: '../../dist/packages/cli' },
    { from: 'CHANGELOG.md', to: '../../dist/packages/cli' },
    { from: 'package.json', to: '../../dist/packages/cli' },
  ],
});
