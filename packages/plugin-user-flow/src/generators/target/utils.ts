import {getWorkspaceLayout, Tree, updateJson} from "@nrwl/devkit";
import {TargetGeneratorSchema} from "./schema";
import {join} from "path";
import {NormalizedSchema} from "./types";

export function normalizeOptions(tree: Tree, options?: TargetGeneratorSchema): NormalizedSchema {

  const projectName = options.projectName;
  const projectRoot = `${getWorkspaceLayout(tree).libsDir}/${projectName}`;

  return {
    ...options,
    projectName,
    projectRoot
  };
}


export function addTarget(tree: Tree, cfg: NormalizedSchema) {
  const {projectName, targetName, projectRoot} = cfg
  updateJson(tree, join(projectRoot, 'project.json'), (json) => {
    if (json.targets[targetName] !== undefined) {
      throw new Error(`Target ${targetName} already exists`)
    }
    json.targets[targetName] = {
      "executor": "@user-flow/plugin-user-flow:user-flow",
      "outputs": ["{options.outputPath}"],
      "options": {
        "rcPath": `${projectRoot}/.user-flowrc.json`,
        "dryRun": true,
        "outputPath": `dist/user-flow/${projectName}`
      }
    };
    return json;
  });
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
