import { execSync } from 'node:child_process';

import {
  cleanupTestProject,
  createTestProject,
  installPlugin,
  PLUGIN_PACKAGE_NAME,
} from './utils/create-test-project';

describe('nx-plugin', () => {
  let projectDirectory: string;

  beforeAll(() => {
    projectDirectory = createTestProject();

    installPlugin(projectDirectory);
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
