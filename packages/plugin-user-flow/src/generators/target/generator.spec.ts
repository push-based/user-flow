import {createTreeWithEmptyWorkspace} from '@nrwl/devkit/testing';
import {
  Tree,
  readProjectConfiguration,
  addProjectConfiguration,
  readJson, updateJson, writeJson
} from '@nrwl/devkit';

import generator from './generator';
import {normalizeOptions} from "./utils";
import {addUpdatedAndDeletedFiles} from "nx/src/daemon/server/project-graph-incremental-recomputation";
import {join} from "path";
import {options} from "yargs";

const NPM_NAME = '@push-based/user-flow';
const PROJECT_NAME = 'generated-test';
const baseOptions = {projectName: PROJECT_NAME, skipPackageJson: false};

describe('target generator', () => {
  let appTree: Tree;

  beforeEach(() => {
    appTree = createTreeWithEmptyWorkspace({layout: 'apps-libs'});
    const normalizedOptions = normalizeOptions(appTree, baseOptions);
    addProjectConfiguration(
      appTree,
      'generator-test',
      {
        root: normalizedOptions.projectRoot,
        projectType: 'library',
        sourceRoot: `${normalizedOptions.projectRoot}/src`,
        targets: {
          build: {
            executor: "@user-flow/plugin-user-flow:build",
          },
        },
      }
    );
    writeJson(appTree, join(normalizedOptions.projectRoot, 'package.json'), {
      dependencies: {},
      devDependencies: {}
    })

  });

  it('should run successfully', async () => {
    const config = readProjectConfiguration(appTree, 'generator-test');
    await generator(appTree, baseOptions);
    expect(config).toBeDefined();
  });

  it('should add user-flow dependency if missing', async () => {
    const opt = normalizeOptions(appTree, baseOptions);
    const packageJson = readJson(appTree, join(opt.projectRoot, 'package.json'));
    await generator(appTree, baseOptions);
    expect(packageJson.devDependencies[NPM_NAME]).toBe('^0.19.0');
  });

  it('should update user-flow dependency if existing', async () => {
    const opt = normalizeOptions(appTree, baseOptions);
    updateJson(appTree, join(opt.projectRoot, 'package.json'), (json) => {
      json.devDependencies[NPM_NAME] = '^1.0.0';
      return json;
    });
    await generator(appTree, baseOptions);
    const packageJson = readJson(appTree, join(opt.projectRoot, 'package.json'),);
    expect(packageJson.devDependencies[NPM_NAME]).toBe('^0.19.0');
  });

  it('should not change dep version if skip option is turned on', async () => {
    const opt = normalizeOptions(appTree, baseOptions);
    updateJson(appTree, join(opt.projectRoot, 'package.json'), (json) => {
      json.devDependencies[NPM_NAME] = '^1.0.0';
      return json;
    });
    const oldPackageJson = readJson(appTree, join(opt.projectRoot, 'package.json'),);
    expect(oldPackageJson.devDependencies[NPM_NAME]).toBe('^1.0.0');
    await generator(appTree, {...baseOptions, skipPackageJson: true});
    const packageJson = readJson(appTree, join(opt.projectRoot, 'package.json'),);
    expect(packageJson.devDependencies[NPM_NAME]).toBe('^1.0.0');
  });

  it('should add user-flow target to project.json', async () => {
    const options = {...baseOptions, targetName: 'e2e-test'};
    const opt = normalizeOptions(appTree, options);
    await generator(appTree, options);
    const packageJson = readJson(appTree, join(opt.projectRoot, 'project.json'),);
    expect(packageJson.targets[options.targetName].executor).toBe('@user-flow/plugin-user-flow:user-flow');
  });

  it('should throw if user-flow target already exists in project.json', async () => {
    const options = {...baseOptions, targetName: 'e2e-test'};
    const opt = normalizeOptions(appTree, options);
    updateJson(appTree, join(opt.projectRoot, 'project.json'), (json) => {
      json.targets[opt.targetName] = '@user-flow/plugin-user-flow:user-flow';
      return json;
    });
    await expect(() => generator(appTree, options))
      .rejects.toThrowError(`Target ${opt.targetName} already exists`);
  });

});

