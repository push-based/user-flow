import {getWorkspaceLayout, Tree, updateJson} from "@nx/devkit";
import {join} from "path";
import {NormalizedSchema} from "./types";
import {InstallGeneratorSchema} from "./schema";
import {DEFAULT_TARGET_NAME} from "../constants";

export function normalizeOptions(tree: Tree, options?: InstallGeneratorSchema): NormalizedSchema {

  const projectName = options.projectName;
  const projectRoot = `${getWorkspaceLayout(tree).libsDir}/${projectName}`;

  return {
    ...options,
    projectName,
    projectRoot
  };
}

export function updateDependencies(tree: Tree, options: NormalizedSchema) {
  updateJson(tree, join(options.projectRoot, 'package.json'), (json) => {
    if (!json.devDependencies) {
      json.devDependencies = {};
    }
    json.devDependencies['@push-based/user-flow'] = '^0.19.0';
    return json;
  });
}

export function updateNxJson(tree: Tree, options: NormalizedSchema) {
  updateJson(tree, 'nx.json', (json) => {
    if (json.tasksRunnerOptions) {
      json.tasksRunnerOptions.default.options.cacheableOperations.push(DEFAULT_TARGET_NAME);
    }
    return json;
  });
}
