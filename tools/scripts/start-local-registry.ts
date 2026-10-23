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

export default async () => {
  // local registry target to run
  const localRegistryTarget = '@push-based/user-flow-source:local-registry';
  // storage folder for the local registry
  const storage = './tmp/local-registry/storage';

  global.stopLocalRegistry = await startLocalRegistry({
    localRegistryTarget,
    storage,
    verbose: false,
  });

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
  } finally {
    for (const [path, contents] of originalManifests) {
      writeFileSync(path, contents);
    }
  }
};
