import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { workspaceRoot } from '@nx/devkit';

/**
 * A frozen copy of what `create-nx-workspace` emits.
 *
 * Scaffolding on demand resolved a fresh dependency tree on every run: the
 * generated manifest floats on `^`/`~` ranges - `typescript`, `prettier`,
 * `tslib`, `@types/node` - and ships no lockfile of its own, so an upstream
 * release could turn the e2e red with no change on our side. Committing the
 * scaffold's own lockfile pins the whole tree by integrity hash instead.
 */
export const FIXTURE_DIR = join(
  workspaceRoot,
  'e2e/nx-plugin-e2e/fixtures/workspace',
);

/** What the refresh script copies out of a fresh scaffold. */
export const FIXTURE_FILES = [
  'package.json',
  'package-lock.json',
  'nx.json',
  'tsconfig.json',
  'tsconfig.base.json',
];

function nxDevDependency(manifestPath: string): string | undefined {
  const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
  return manifest.devDependencies?.nx;
}

/** The Nx version this workspace builds the plugin against. */
export function nxVersion(): string {
  const version = nxDevDependency(join(workspaceRoot, 'package.json'));
  if (!version) {
    throw new Error('No `nx` devDependency found in the workspace manifest');
  }
  return version;
}

/**
 * The fixture only means anything while it matches the Nx the plugin is built
 * against. Fail here, rather than let the suite silently exercise the plugin
 * against a stale Nx after an upgrade.
 */
export function assertFixtureMatchesWorkspace(): void {
  const fixture = nxDevDependency(join(FIXTURE_DIR, 'package.json'));
  const workspace = nxVersion();

  if (fixture !== workspace) {
    throw new Error(
      `The e2e workspace fixture pins nx ${fixture}, but this workspace uses nx ${workspace}. ` +
        'Run `npm run e2e:update-workspace-fixture` and commit the result.',
    );
  }
}
