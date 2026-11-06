import { chmodSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { defineConfig, type Plugin } from 'rolldown';
import { dts } from 'rolldown-plugin-dts';

// Nx loads this config from the workspace root, so paths must not depend on the cwd
const projectRoot = import.meta.dirname;
const fromRoot = (path: string) => join(projectRoot, path);
const tsconfig = fromRoot('tsconfig.lib.json');

const pkg = JSON.parse(readFileSync(fromRoot('package.json'), 'utf-8'));
const dependencies = Object.keys(pkg.dependencies ?? {});

/** Files published next to the bundle, keyed by their name in the output. */
const assets: Record<string, string> = {
  'README.md': '../../README.md',
  'CHANGELOG.md': 'CHANGELOG.md',
  'package.json': 'package.json',
};

function copyAssets(): Plugin {
  return {
    name: 'copy-assets',
    buildStart() {
      for (const [fileName, path] of Object.entries(assets)) {
        const source = fromRoot(path);
        this.addWatchFile(source);
        this.emitFile({
          type: 'asset',
          fileName,
          source: readFileSync(source),
        });
      }
    },
  };
}

/**
 * npx and `npm link` run the bin straight from the output folder, and they only
 * set its executable bit when they first link it, so a rebuild would undo that.
 */
function executableBin(): Plugin {
  return {
    name: 'executable-bin',
    writeBundle({ dir = '' }, bundle) {
      for (const output of Object.values(bundle)) {
        if (
          output.type === 'chunk' &&
          output.isEntry &&
          output.code.startsWith('#!')
        ) {
          chmodSync(join(dir, output.fileName), 0o755);
        }
      }
    },
  };
}

export default defineConfig({
  input: {
    index: fromRoot('src/index.ts'),
    cli: fromRoot('src/cli.ts'),
  },
  platform: 'node',
  tsconfig,
  // dependencies are installed with the package, so they stay out of the bundle
  external: (id) =>
    dependencies.some((dep) => id === dep || id.startsWith(`${dep}/`)),
  plugins: [dts({ tsconfig }), copyAssets(), executableBin()],
  output: {
    dir: fromRoot('../../dist/packages/cli'),
    format: 'esm',
    entryFileNames: '[name].mjs',
    chunkFileNames: '[name]-[hash].mjs',
    sourcemap: true,
    cleanDir: true,
  },
});
