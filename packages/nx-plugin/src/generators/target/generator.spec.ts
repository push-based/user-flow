import {createTreeWithEmptyWorkspace} from '@nrwl/devkit/testing';
import {addProjectConfiguration, readJson, readProjectConfiguration, Tree, updateJson, writeJson} from '@nrwl/devkit';

import generator from './generator';
import {normalizeOptions} from "./utils";
import {join} from "path";


const NPM_NAME = '@push-based/user-flow';
const PROJECT_NAME = 'generated-test';
const baseOptions = {
  projectName: PROJECT_NAME,
  skipPackageJson: false,
  url: "https://test-url.com",
  ufPath: "PROJECT_NAME/flows"
};

describe('target generator', () => {
  let appTree: Tree;
  let normalizedOptions;
  beforeEach(() => {
    appTree = createTreeWithEmptyWorkspace({layout: 'apps-libs'});
    normalizedOptions = normalizeOptions(appTree, baseOptions);
    addProjectConfiguration(
      appTree,
      'generator-test',
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
  });

  it('should run successfully', async () => {
    const config = readProjectConfiguration(appTree, 'generator-test');

    let projectJson = readJson(appTree, join(normalizedOptions.projectRoot, 'project.json'));
    expect(projectJson?.targets['user-flow']).toBeUndefined();
    await generator(appTree, baseOptions);
    projectJson = readJson(appTree, join(normalizedOptions.projectRoot, 'project.json'));
    expect(config).toBeDefined();
    expect(projectJson?.targets['user-flow']).toBeDefined();
  });

  it('should add user-flow target to project.json', async () => {
    const options = {...baseOptions, targetName: 'e2e-test'};
    await generator(appTree, options);
    const packageJson = readJson(appTree, join(normalizedOptions.projectRoot, 'project.json'));
    expect(packageJson.targets[options.targetName].executor).toBe('@push-based/user-flow-nx-plugin:user-flow');
  });

  it('should throw if user-flow target already exists in project.json', async () => {
    const options = {...baseOptions, targetName: 'e2e-test'};
    const opt = normalizeOptions(appTree, options);
    writeJson(appTree, join(opt.projectRoot, '.user-flowrc.json'), {});
    updateJson(appTree, join(opt.projectRoot, 'project.json'), (json) => {
      json.targets[opt.targetName] = '@push-based/user-flow-nx-plugin:user-flow';
      return json;
    });
    await expect(() => generator(appTree, options))
      .rejects.toThrowError(`Target ${opt.targetName} already exists`);
  });

  it('should throw if user-flowrc.json already exists in project root', async () => {
    const options = {...baseOptions, targetName: 'e2e-test'};
    const opt = normalizeOptions(appTree, options);
    writeJson(appTree, join(opt.projectRoot, '.user-flowrc.json'), {});
    await expect(() => generator(appTree, options))
      .rejects.toThrowError(`.user-flowrc.json already exists in ${opt.projectRoot}`);
  });

});

