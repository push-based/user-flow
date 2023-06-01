import {getWorkspaceLayout, Tree, updateJson} from "@nrwl/devkit";
import {join} from "path";
import {NormalizedSchema} from "./types";
import {InstallGeneratorSchema} from "./schema";

export function normalizeOptions(tree: Tree, options?: InstallGeneratorSchema): NormalizedSchema {

  const projectName = options.projectName;
  const projectRoot = `${getWorkspaceLayout(tree).libsDir}/${projectName}`;

  return {
    ...options,
    projectName,
    projectRoot
  };
}
export function updateDependencies(tree: Tree, options?: NormalizedSchema) {
  const {projectRoot} = options
  updateJson(tree, join(projectRoot,'package.json'), (json) => {
    if (!json.devDependencies) {
      json.devDependencies = {};
    }
    json.devDependencies['@push-based/user-flow'] = '^0.19.0';
    return json;
  });
}
