import { execSync } from 'node:child_process';

import { workspaceRoot } from '@nx/devkit';

import startLocalRegistry from './tools/scripts/start-local-registry';
import stopLocalRegistry from './tools/scripts/stop-local-registry';

/**
 * The CLI goes into the workspace's own node_modules, because the tests invoke a
 * bare `user-flow` and rely on the PATH npm sets up.
 *
 * `--no-save` leaves package.json and package-lock.json byte-identical, so an
 * interrupted run can no longer strand the checkout with a `0.0.0-e2e`
 * dependency and a rewritten lockfile.
 *
 * Pinned to the workspace root, because npm would otherwise install into
 * whichever package the runner happened to start in.
 */
const npm = (args: string) =>
  execSync(`npm ${args}`, { cwd: workspaceRoot, stdio: 'inherit' });

// by dist-tag, so the version `nx release` published stays an implementation detail
const PACKAGE = '@push-based/user-flow';

export async function setup() {
  console.log('Setup e2e test');
  await startLocalRegistry();

  try {
    npm(`install --no-save ${PACKAGE}@e2e`);
  } catch (error) {
    // vitest skips teardown when setup throws, which would strand verdaccio
    // holding its port for every later run on this machine
    stopLocalRegistry();
    throw error;
  }
}

export async function teardown() {
  console.log('Teardown e2e test');
  try {
    // before the registry goes down - npm still resolves metadata while removing
    npm(`uninstall --no-save ${PACKAGE}`);
  } finally {
    stopLocalRegistry();
  }
}
