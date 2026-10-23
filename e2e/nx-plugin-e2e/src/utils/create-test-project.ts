import { execSync } from 'node:child_process';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';

/**
 * Pinned to the workspace's own Nx version. With `@latest` the generated
 * workspace can drift ahead of the plugin it is meant to exercise.
 */
const NX_VERSION = '24.0.0';

const PUBLIC_REGISTRY = 'https://registry.npmjs.org/';

/**
 * `startLocalRegistry` points `npm_config_registry` at verdaccio for the whole
 * process. Left alone, scaffolding a workspace drags its entire dependency
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
  const localRegistry = process.env.npm_config_registry;
  const parentDirectory = mkdtempSync(join(tmpdir(), 'user-flow-e2e-'));
  const projectDirectory = join(parentDirectory, projectName);

  execSync(
    `npx --yes create-nx-workspace@${NX_VERSION} ${projectName} --preset apps --nxCloud=skip --no-interactive --packageManager=npm`,
    { cwd: parentDirectory, stdio: 'inherit', env: publicRegistryEnv() },
  );

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
