import { execFileSync } from 'node:child_process';
import { cpSync, mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';

import {
  assertFixtureMatchesWorkspace,
  FIXTURE_DIR,
} from './workspace-fixture';

const PUBLIC_REGISTRY = 'https://registry.npmjs.org/';

/**
 * `startLocalRegistry` points `npm_config_registry` at verdaccio for the whole
 * process. Left alone, installing a workspace drags its entire dependency
 * tree - ~220MB across 159 scopes - through the local proxy on every run.
 *
 * Only `@push-based/*` has to come from verdaccio, so everything else is sent
 * back to the public registry.
 */
export function publicRegistryEnv(): NodeJS.ProcessEnv {
  return { ...process.env, npm_config_registry: PUBLIC_REGISTRY };
}

/**
 * Creates a throwaway Nx workspace outside the repository.
 *
 * The parent directory is unique per call so concurrent runs - e.g. several
 * git worktrees - cannot clobber each other.
 *
 * @returns The directory the test workspace was created in
 */
export function createTestProject(projectName = 'test-project'): string {
  assertFixtureMatchesWorkspace();

  const localRegistry = process.env.npm_config_registry;
  const parentDirectory = mkdtempSync(join(tmpdir(), 'user-flow-e2e-'));
  const projectDirectory = join(parentDirectory, projectName);

  cpSync(FIXTURE_DIR, projectDirectory, { recursive: true });

  if (localRegistry) {
    // Scope the local registry to the packages under test. The default registry
    // stays public, so only these two resolve through verdaccio.
    writeFileSync(
      join(projectDirectory, '.npmrc'),
      [
        `@push-based:registry=${localRegistry}`,
        `//${new URL(localRegistry).host}/:_authToken=secretVerdaccioToken`,
        '',
      ].join('\n'),
    );
  }

  // `ci` rather than `install`: it reproduces the committed lockfile exactly,
  // and refuses to run at all if the lockfile and the manifest drift apart.
  execFileSync('npm', ['ci'], {
    cwd: projectDirectory,
    stdio: 'inherit',
    env: publicRegistryEnv(),
  });

  console.log(`Created test project in "${projectDirectory}"`);

  return projectDirectory;
}

/**
 * Removes a workspace created by {@link createTestProject}, including the
 * unique parent directory it lives in.
 */
export function cleanupTestProject(projectDirectory: string): void {
  rmSync(dirname(projectDirectory), { recursive: true, force: true });
}

export const PLUGIN_PACKAGE_NAME = '@push-based/user-flow-nx-plugin';

/**
 * Installs the plugin the jest globalSetup built and published to the local
 * registry, so the generators under test are the ones a consumer would get.
 */
export function installPlugin(projectDirectory: string): void {
  execFileSync('npm', ['install', '-D', `${PLUGIN_PACKAGE_NAME}@e2e`], {
    cwd: projectDirectory,
    stdio: 'inherit',
    env: publicRegistryEnv(),
  });
}

/**
 * Adds a minimal library for the generators to target.
 *
 * Hand-written rather than generated, so the suite asserts on our generators
 * instead of on whatever `@nx/js:library` emits this week.
 *
 * @returns The project root, relative to the workspace
 */
export function addProject(projectDirectory: string, name: string): string {
  const projectRoot = `packages/${name}`;
  const absoluteRoot = join(projectDirectory, projectRoot);

  mkdirSync(absoluteRoot, { recursive: true });
  writeJson(join(absoluteRoot, 'package.json'), {
    name,
    version: '0.0.0',
    private: true,
  });
  writeJson(join(absoluteRoot, 'project.json'), {
    name,
    $schema: '../../node_modules/nx/schemas/project-schema.json',
    root: projectRoot,
    projectType: 'library',
    // the target generator writes into this map, so it has to exist
    targets: {},
  });

  return projectRoot;
}

function writeJson(path: string, contents: unknown): void {
  writeFileSync(path, `${JSON.stringify(contents, null, 2)}\n`);
}
