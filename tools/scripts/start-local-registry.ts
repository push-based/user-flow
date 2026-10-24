/**
 * This script starts a local registry for e2e testing purposes.
 * It is meant to be called in jest's globalSetup.
 */

/// <reference path="registry.d.ts" />

import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

import { workspaceRoot } from '@nx/devkit';
import { startLocalRegistry } from '@nx/js/plugins/jest/local-registry';
import { releasePublish, releaseVersion } from 'nx/release';

/**
 * `nx release version` writes the e2e version into the source manifests. They are
 * restored once publishing is done so an e2e run never leaves the tree dirty.
 *
 * Absolute, because the test runner's cwd is the project root, not the workspace root.
 */
const VERSIONED_MANIFESTS = [
  'packages/cli/package.json',
  'packages/nx-plugin/package.json',
].map((manifest) => join(workspaceRoot, manifest));

const REGISTRY_START_TIMEOUT_MS = 180_000;

/**
 * `startLocalRegistry` resolves only once verdaccio prints its URL, and never
 * rejects if that line does not arrive - which strands the run until the CI job
 * is killed. Bound it so the failure is reported instead.
 */
function withTimeout<T>(
  promise: Promise<T>,
  ms: number,
  message: string,
): Promise<T> {
  let timer: NodeJS.Timeout;
  return Promise.race([
    promise.finally(() => clearTimeout(timer)),
    new Promise<never>((_, reject) => {
      timer = setTimeout(() => reject(new Error(`${message} (${ms}ms)`)), ms);
    }),
  ]);
}

export default async () => {
  // local registry target to run
  const localRegistryTarget = '@push-based/user-flow-source:local-registry';
  // storage folder for the local registry
  const storage = './tmp/local-registry/storage';

  global.stopLocalRegistry = await withTimeout(
    startLocalRegistry({
      localRegistryTarget,
      storage,
      // verdaccio's own output, otherwise a registry that never reports ready
      // leaves no trace of why
      verbose: true,
    }),
    REGISTRY_START_TIMEOUT_MS,
    'local registry did not report ready',
  );

  const originalManifests = new Map(
    VERSIONED_MANIFESTS.map((path) => [path, readFileSync(path, 'utf8')]),
  );

  try {
    await releaseVersion({
      specifier: '0.0.0-e2e',
      stageChanges: false,
      gitCommit: false,
      gitTag: false,
      // nx.json sets `release.git.push: true` for the real release pipeline.
      // Without this an e2e run would push to origin.
      gitPush: false,
      firstRelease: true,
      versionActionsOptionsOverrides: {
        skipLockFileUpdate: true,
      },
    });
    const publishResults = await releasePublish({
      tag: 'e2e',
      firstRelease: true,
      // nx.json pins `nx-release-publish` to the public npm registry for the real
      // release pipeline, and that target option wins over the npm_config_registry
      // env var startLocalRegistry sets. Point publishing back at the local one.
      registry: process.env.npm_config_registry,
    });

    // `releasePublish` resolves with a per-project status instead of throwing. Without
    // this the run limps on and fails later as an opaque ETARGET on install.
    const failed = Object.entries(publishResults)
      .filter(([, { code }]) => code !== 0)
      .map(([project]) => project);
    if (failed.length > 0) {
      throw new Error(
        `Failed to publish to the local registry: ${failed.join(', ')}`,
      );
    }
  } catch (error) {
    // jest skips globalTeardown when globalSetup throws, which would strand
    // verdaccio holding its port for every later run on this machine
    global.stopLocalRegistry?.();
    throw error;
  } finally {
    for (const [path, contents] of originalManifests) {
      writeFileSync(path, contents);
    }
  }
};
