import {createTreeWithEmptyWorkspace} from '@nrwl/devkit/testing';
import {addProjectConfiguration, readJson, readProjectConfiguration, Tree, updateJson, writeJson} from '@nrwl/devkit';

import generator from './generator';
import {normalizeOptions} from "../target/utils";
import {join} from "path";
import {NormalizedSchema} from "./types";

const NPM_NAME = '@push-based/user-flow';
const PROJECT_NAME = 'generated-test';
const baseOptions = {projectName: PROJECT_NAME, skipPackageJson: false, url: "https://test-url.com"};
describe('init generator', () => {
  let appTree: Tree;
  let normalizedOptions: NormalizedSchema = {} as any;
  beforeEach(() => {
    appTree = createTreeWithEmptyWorkspace({layout: 'apps-libs'});
    normalizedOptions = normalizeOptions(appTree, baseOptions);
    addProjectConfiguration(
      appTree,
      PROJECT_NAME,
      {
        root: normalizedOptions.projectRoot,
        projectType: 'library',
        sourceRoot: `${normalizedOptions.projectRoot}/src`,
        targets: {
          build: {
            executor: "@push-based/user-flow-nx-plugin:build",
          },
        },
      }
    );
    writeJson(appTree, join(normalizedOptions.projectRoot, '.user-flowrc.json'), {});
    writeJson(appTree, join(normalizedOptions.projectRoot, 'package.json'), {
      dependencies: {},
      devDependencies: {}
    })
    writeJson(appTree, join(normalizedOptions.projectRoot, 'nx.json'), {
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
      return json;
    });
    await generator(appTree, baseOptions);
    const packageJson = readJson(appTree, join(normalizedOptions.projectRoot, 'package.json'),);
    expect(packageJson.devDependencies[NPM_NAME]).toBe('^0.19.0');
  });

  it('should not change dep version if skip option is turned on', async () => {
    updateJson(appTree, join(normalizedOptions.projectRoot, 'package.json'), (json) => {
      json.devDependencies[NPM_NAME] = '^1.0.0';
      return json;
    });
    const oldPackageJson = readJson(appTree, join(normalizedOptions.projectRoot, 'package.json'),);
    expect(oldPackageJson.devDependencies[NPM_NAME]).toBe('^1.0.0');
    await generator(appTree, {...baseOptions, skipPackageJson: true});
    const packageJson = readJson(appTree, join(normalizedOptions.projectRoot, 'package.json'),);
    expect(packageJson.devDependencies[NPM_NAME]).toBe('^1.0.0');
  });

  it('should update nx.json cacheableOperations if tasksRunnerOptions exists', async () => {
    let nxJson = readJson(appTree, 'nx.json');
    expect(nxJson.tasksRunnerOptions).toBeDefined();
    expect(nxJson.tasksRunnerOptions.default.options.cacheableOperations.includes('user-flow')).toBeFalsy();
    await generator(appTree, baseOptions);
    nxJson = readJson(appTree, 'nx.json');
    expect(nxJson.tasksRunnerOptions.default.options.cacheableOperations.includes('user-flow')).toBeTruthy();
  });

  it('should not update nx.json cacheableOperations if tasksRunnerOptions not exists', async () => {
    updateJson(appTree, 'nx.json', (json) => {
      delete json.tasksRunnerOptions;
      return json;
    });
    let nxJson = readJson(appTree, 'nx.json');
    expect(nxJson.tasksRunnerOptions).toBeUndefined();
    await generator(appTree, baseOptions);
    nxJson = readJson(appTree, 'nx.json');
    expect(nxJson.tasksRunnerOptions).toBeUndefined();
  });

});
