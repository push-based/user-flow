import {getWorkspaceLayout, logger, readJson, Tree, updateJson, writeJson} from "@nrwl/devkit";
import {TargetGeneratorSchema} from "./schema";
import {join} from "path";
import {NormalizedSchema} from "./types";
import {DEFAULT_TARGET_NAME} from "../constants";

export function normalizeOptions(tree: Tree, options?: TargetGeneratorSchema): NormalizedSchema {

  const projectName = options.projectName;
  const projectRoot = `${getWorkspaceLayout(tree).libsDir}/${projectName}`;

  return {
    ...options,
    projectName,
    projectRoot
  };
}

export function setupUserFlow(tree: Tree, cfg: NormalizedSchema): void {
  const {projectName, targetName, projectRoot, verbose} = cfg;
  logger.log(`Adding .user-flowrc.json to project`);
  const existing = readJson(tree, join(projectRoot, '.user-flowrc.json'));
  if (!existing) {
    writeJson(tree, join(projectRoot, '.user-flowrc.json'), {});
  } else {
    throw new Error(`.user-flowrc.json already exists in ${projectRoot}`);
  }
}

export function addTarget(tree: Tree, cfg: NormalizedSchema) {
  const {projectName, targetName, projectRoot, url} = cfg;
  const parsedTargetName = targetName || DEFAULT_TARGET_NAME;
  logger.log(`Adding target ${parsedTargetName} to project ${projectName}`);
  updateJson(tree, join(projectRoot, 'project.json'), (json) => {
    if (json.targets[parsedTargetName] !== undefined) {
      throw new Error(`Target ${parsedTargetName} already exists`)
    }
    json.targets[parsedTargetName] = {
      "executor": "@push-based/user-flow-nx-plugin:user-flow",
      "outputs": ["{options.outputPath}"],
      "options": {
        "url": url,
        "rcPath": `${projectRoot}/.user-flowrc.json`,
        "ufPath": `${projectRoot}/user-flows`,
        "outputPath": `dist/user-flow/${projectName}`,
        "format": ["md"]
      }
    };
    return json;
  });
}
