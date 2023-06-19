import {createTreeWithEmptyWorkspace} from '@nrwl/devkit/testing';
import {
  addProjectConfiguration,
  getWorkspaceLayout,
  readJson,
  readProjectConfiguration,
  Tree,
  updateJson,
  writeJson
} from '@nrwl/devkit';

import generator from './generator';
import {normalizeOptions} from "../target/utils";
import {join} from "path";
import {NormalizedSchema} from "./types";
import {PLUGIN_NAME} from "../constants";

const NPM_NAME = '@push-based/user-flow';
const PROJECT_NAME = 'generated-test';
const baseOptions = {projectName: PROJECT_NAME, skipPackageJson: false, url: "https://test-url.com"};
describe('init generator', () => {
  let appTree: Tree;
  let normalizedOptions: NormalizedSchema = {} as any;
  beforeEach(() => {
    appTree = createTreeWithEmptyWorkspace({layout: 'apps-libs'});

    const projectRoot = `${getWorkspaceLayout(appTree).libsDir}/${PROJECT_NAME}`;
    addProjectConfiguration(
      appTree,
      PROJECT_NAME,
      {
        root: projectRoot,
        projectType: 'library',
        sourceRoot: `${projectRoot}/src`,
        targets: {
          build: {
            executor: "@push-based/user-flow-nx-plugin:build",
          },
        },
      }
    );
    normalizedOptions = normalizeOptions(appTree, baseOptions);
    writeJson(appTree, join(normalizedOptions.projectRoot, '.user-flowrc.json'), {});
    writeJson(appTree, join(normalizedOptions.projectRoot, 'package.json'), {
      dependencies: {},
      devDependencies: {}
    })
    writeJson(appTree, join(appTree.root, 'nx.json'), {
      "extends": "nx/presets/core.json",
      "tasksRunnerOptions": {
        "default": {
          "runner": "nx-cloud",
          "options": {
            "cacheableOperations": [
              "build",
              "lint",
              "test",
              "e2e"
            ]
          }
        }
      }
    })
  });

  it('should run successfully', async () => {
    expect(appTree.children('nx.json')).toBe('')

    await generator(appTree, baseOptions);
    const config = readProjectConfiguration(appTree, PROJECT_NAME);
    expect(config).toBeDefined();
  });


  it('should add user-flow dependency if missing', async () => {
    await generator(appTree, baseOptions);
    const packageJson = readJson(appTree, join(normalizedOptions.projectRoot, 'package.json'));
    expect(packageJson.devDependencies[NPM_NAME]).toBe('^0.19.0');
  });

  it('should update user-flow dependency if existing', async () => {
    updateJson(appTree, join(normalizedOptions.projectRoot, 'package.json'), (json) => {
      json.devDependencies[NPM_NAME] = '^1.0.0';
      json.devDependencies[PLUGIN_NAME] = '^0.0.0-alpha';
      return json;
    });
    await generator(appTree, baseOptions);
    const packageJson = readJson(appTree, join(normalizedOptions.projectRoot, 'package.json'),);
    expect(packageJson.devDependencies[NPM_NAME]).toBe('^0.19.0');
    expect(packageJson.devDependencies[PLUGIN_NAME]).toBe('^0.0.0');
  });

  it('should not change dep version if skip option is turned on', async () => {
    updateJson(appTree, join(normalizedOptions.projectRoot, 'package.json'), (json) => {
      json.devDependencies[NPM_NAME] = '^1.0.0';
      json.devDependencies[PLUGIN_NAME] = '^0.0.0';
      return json;
    });
    const oldPackageJson = readJson(appTree, join(normalizedOptions.projectRoot, 'package.json'),);
    expect(oldPackageJson.devDependencies[NPM_NAME]).toBe('^1.0.0');
    expect(oldPackageJson.devDependencies[PLUGIN_NAME]).toBe('^0.0.0');
    await generator(appTree, {...baseOptions, skipPackageJson: true});
    const packageJson = readJson(appTree, join(normalizedOptions.projectRoot, 'package.json'),);
    expect(packageJson.devDependencies[NPM_NAME]).toBe('^1.0.0');
    expect(packageJson.devDependencies[PLUGIN_NAME]).toBe('^0.0.0');
  });

  it('should update nx.json cacheableOperations if tasksRunnerOptions exists', async () => {
    const nxJsonPath = join(appTree.root, 'nx.json');
    let nxJson = readJson(appTree, nxJsonPath);
    expect(nxJson.tasksRunnerOptions).toBeDefined();
    expect(nxJson.tasksRunnerOptions.default.options.cacheableOperations.includes('user-flow')).toBeFalsy();
    await generator(appTree, baseOptions);
    nxJson = readJson(appTree, nxJsonPath);
    expect(nxJson.tasksRunnerOptions.default.options.cacheableOperations.includes('user-flow')).toBeTruthy();
  });

  it('should not update nx.json cacheableOperations if tasksRunnerOptions not exists', async () => {
    const nxJsonPath = join(appTree.root, 'nx.json');
    updateJson(appTree, nxJsonPath, (json) => {
      delete json.tasksRunnerOptions;
      return json;
    });
    let nxJson = readJson(appTree, nxJsonPath);
    expect(nxJson.tasksRunnerOptions).toBeUndefined();
    await generator(appTree, baseOptions);
    nxJson = readJson(appTree, nxJsonPath);
    expect(nxJson.tasksRunnerOptions).toBeUndefined();
  });

});
