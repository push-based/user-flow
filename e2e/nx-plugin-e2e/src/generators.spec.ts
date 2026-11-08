import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

import {
  addProject,
  cleanupTestProject,
  createTestProject,
  installPlugin,
  PLUGIN_PACKAGE_NAME,
  publicRegistryEnv,
} from './utils/create-test-project';

const DEMO_PROJECT = 'demo';
const TARGET_NAME = 'user-flow';
const CLI_PACKAGE_NAME = '@push-based/user-flow';

describe('nx-plugin generators', () => {
  let workspace: string;
  let projectRoot: string;

  const nx = (...args: string[]): string =>
    execFileSync('npx', ['nx', ...args], {
      cwd: workspace,
      encoding: 'utf8',
      env: {
        ...publicRegistryEnv(),
        // the suite edits project files between invocations; a daemon would
        // answer from a graph it cached before those edits
        NX_DAEMON: 'false',
      },
    });

  const readJson = (...segments: string[]) =>
    JSON.parse(readFileSync(join(workspace, ...segments), 'utf8'));

  beforeAll(() => {
    workspace = createTestProject();
    installPlugin(workspace);
    projectRoot = addProject(workspace, DEMO_PROJECT);
  });

  afterAll(() => {
    if (workspace) {
      cleanupTestProject(workspace);
    }
  });

  describe('init', () => {
    beforeAll(() => {
      nx('g', `${PLUGIN_PACKAGE_NAME}:init`, '--no-interactive');
    });

    it('should add the plugin under its own name', () => {
      const { devDependencies } = readJson('package.json');

      // a bare `PLUGIN_NAME` object key used to write that string verbatim,
      // leaving consumers with a dependency no registry can resolve
      expect(Object.keys(devDependencies)).not.toContain('PLUGIN_NAME');
      expect(devDependencies[PLUGIN_PACKAGE_NAME]).toBeDefined();
    });

    it('should add the cli the executor shells out to', () => {
      expect(
        readJson('package.json').devDependencies[CLI_PACKAGE_NAME],
      ).toBeDefined();
    });

    it('should pin the plugin at the version that did the generating', () => {
      const installed = readJson(
        'node_modules',
        ...PLUGIN_PACKAGE_NAME.split('/'),
        'package.json',
      ).version;

      // the range used to be a hardcoded '^0.0.0' that matched nothing real
      expect(
        readJson('package.json').devDependencies[PLUGIN_PACKAGE_NAME],
      ).toBe(`^${installed}`);
    });

    it('should register a default target name for the target generator', () => {
      expect(
        readJson('nx.json').generators[`${PLUGIN_PACKAGE_NAME}:target`],
      ).toEqual({
        targetName: TARGET_NAME,
      });
    });
  });

  describe('target', () => {
    beforeAll(() => {
      nx(
        'g',
        `${PLUGIN_PACKAGE_NAME}:target`,
        `--projectName=${DEMO_PROJECT}`,
        '--no-interactive',
      );
    });

    it('should write an rc file into the project', () => {
      expect(
        existsSync(join(workspace, projectRoot, '.user-flowrc.json')),
      ).toBe(true);
    });

    it('should point the generated target at the plugin executor', () => {
      const { targets } = readJson(projectRoot, 'project.json');

      expect(targets[TARGET_NAME].executor).toBe(
        `${PLUGIN_PACKAGE_NAME}:${TARGET_NAME}`,
      );
      expect(targets[TARGET_NAME].options).toMatchObject({
        rcPath: `${projectRoot}/.user-flowrc.json`,
        outputPath: `dist/user-flow/${projectRoot}`,
      });
    });

    it('should leave nx able to resolve the generated target', () => {
      // reading project.json only proves we wrote json. This proves nx loads the
      // plugin's executors.json and resolves the target through it.
      const project = JSON.parse(nx('show', 'project', DEMO_PROJECT, '--json'));

      expect(project.targets[TARGET_NAME].executor).toBe(
        `${PLUGIN_PACKAGE_NAME}:${TARGET_NAME}`,
      );
    });

    it('should refuse to overwrite an existing target', () => {
      expect(() =>
        nx(
          'g',
          `${PLUGIN_PACKAGE_NAME}:target`,
          `--projectName=${DEMO_PROJECT}`,
          '--no-interactive',
        ),
      ).toThrow();
    });

    it('should reject a run without the required projectName', () => {
      expect(() =>
        nx('g', `${PLUGIN_PACKAGE_NAME}:target`, '--no-interactive'),
      ).toThrow();
    });
  });
});
