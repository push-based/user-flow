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

/**
 * The plugin pins itself at the version that did the generating, so the
 * workspace ends up with a plugin and a config that agree.
 */
// eslint-disable-next-line @typescript-eslint/no-var-requires
const {version: PLUGIN_VERSION} = require('../../../package.json');

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
    // computed key - a bare `PLUGIN_NAME` here wrote a literal "PLUGIN_NAME"
    // dependency into the consumer's package.json, which no registry resolves
    [PLUGIN_NAME]: `^${PLUGIN_VERSION}`,
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
