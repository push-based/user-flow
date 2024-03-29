import {
  addDependenciesToPackageJson,
  joinPathFragments,
  readProjectConfiguration,
  Tree,
  updateJson
} from '@nx/devkit';
import {NormalizedSchema} from "./types";
import {InitGeneratorSchema} from "./schema";
import {PLUGIN_NAME} from "../constants";
import {DEFAULT_TARGET_NAME} from "../target/constants";

export function normalizeOptions(tree: Tree, options?: InitGeneratorSchema): NormalizedSchema {

  const projectName = options.projectName;
  const projectRoot = readProjectConfiguration(tree, options.projectName).root;

  return {
    ...options,
    projectName,
    projectRoot
  };
}

export function updateDependencies(tree: Tree, options?: NormalizedSchema) {
  const devDeps = {
    '@push-based/user-flow': '^0.19.0',
    PLUGIN_NAME: '^0.0.0',
    '@nx/devkit': '^16.0.0'
  };
  addDependenciesToPackageJson(tree, {}, devDeps);
}

export function updateNxJson(tree: Tree, options?: NormalizedSchema) {
  updateJson(tree, joinPathFragments('nx.json'), (json) => {
    if (json.tasksRunnerOptions) {
      if (!json.tasksRunnerOptions.default.options.cacheableOperations) {
        json.tasksRunnerOptions.default.options.cacheableOperations = []
      }
      json.tasksRunnerOptions.default.options.cacheableOperations.push(DEFAULT_TARGET_NAME);
    }

    if (json.generators === undefined) {
      json.generators = {};
    }
    json.generators[PLUGIN_NAME + ":target"] = {
      "targetName": DEFAULT_TARGET_NAME
    }

    return json;
  });
}
