/**
 * Regenerates the frozen Nx workspace the plugin e2e installs into.
 *
 *   npm run e2e:update-workspace-fixture
 *
 * Run it after bumping Nx. The e2e refuses to start while the fixture and the
 * workspace disagree, so a forgotten refresh fails loudly.
 */

import { execFileSync } from 'node:child_process';
import { cpSync, mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import {
  FIXTURE_DIR,
  FIXTURE_FILES,
  nxVersion,
} from '../src/utils/workspace-fixture';

const WORKSPACE_NAME = 'workspace';

const scaffoldDirectory = mkdtempSync(join(tmpdir(), 'user-flow-fixture-'));

try {
  execFileSync(
    'npx',
    [
      '--yes',
      `create-nx-workspace@${nxVersion()}`,
      WORKSPACE_NAME,
      '--preset=apps',
      '--nxCloud=skip',
      '--no-interactive',
      '--packageManager=npm',
    ],
    { cwd: scaffoldDirectory, stdio: 'inherit' },
  );

  rmSync(FIXTURE_DIR, { recursive: true, force: true });
  mkdirSync(join(FIXTURE_DIR, 'packages'), { recursive: true });
  // the target of the generated `workspaces` glob, which npm resolves on install
  writeFileSync(join(FIXTURE_DIR, 'packages', '.gitkeep'), '');

  for (const file of FIXTURE_FILES) {
    cpSync(
      join(scaffoldDirectory, WORKSPACE_NAME, file),
      join(FIXTURE_DIR, file),
    );
  }

  console.log(`Updated the e2e workspace fixture in "${FIXTURE_DIR}"`);
  console.log(
    'Review the diff - a newer Nx may add config files this script does not copy.',
  );
} finally {
  rmSync(scaffoldDirectory, { recursive: true, force: true });
}
