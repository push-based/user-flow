import { execSync } from 'node:child_process';

import {
  cleanupTestProject,
  createTestProject,
  publicRegistryEnv,
} from './utils/create-test-project';

const PLUGIN_PACKAGE_NAME = '@push-based/user-flow-nx-plugin';

describe('nx-plugin', () => {
  let projectDirectory: string;

  beforeAll(() => {
    projectDirectory = createTestProject();

    // The plugin has been built and published to a local registry in the jest globalSetup.
    // Install the plugin built with the latest source code into the test repo.
    execSync(`npm install -D ${PLUGIN_PACKAGE_NAME}@e2e`, {
      cwd: projectDirectory,
      stdio: 'inherit',
      env: publicRegistryEnv(),
    });
  });

  afterAll(() => {
    if (projectDirectory) {
      cleanupTestProject(projectDirectory);
    }
  });

  it('should be installed', () => {
    // npm ls will fail if the package is not installed properly
    execSync(`npm ls ${PLUGIN_PACKAGE_NAME}`, {
      cwd: projectDirectory,
      stdio: 'inherit',
    });
  });
});
