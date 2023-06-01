import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing';
import {Tree, readProjectConfiguration, readJson, updateJson} from '@nrwl/devkit';

import generator from './generator';
import { InstallGeneratorSchema } from './schema';
import {normalizeOptions} from "../target/utils";
import {join} from "path";

const NPM_NAME = '@push-based/user-flow';
const PROJECT_NAME = 'generated-test';
const baseOptions = {projectName: PROJECT_NAME, skipPackageJson: false};


describe('install generator', () => {
  let appTree: Tree;

  beforeEach(() => {
    appTree = createTreeWithEmptyWorkspace({layout: 'apps-libs'});
  });

  it('should run successfully', async () => {
    await generator(appTree, baseOptions);
    const config = readProjectConfiguration(appTree, 'test');
    expect(config).toBeDefined();
  });


  it('should add user-flow dependency if missing', async () => {
    const opt = normalizeOptions(appTree, baseOptions);
    await generator(appTree, baseOptions);
    const packageJson = readJson(appTree, join(opt.projectRoot, 'package.json'));
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

});
