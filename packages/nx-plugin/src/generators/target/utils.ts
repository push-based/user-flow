import {
  joinPathFragments,
  logger,
  readJson,
  readProjectConfiguration,
  Tree,
  updateJson,
  writeJson
} from '@nx/devkit';
import {TargetGeneratorSchema} from "./schema";
import {NormalizedSchema} from "./types";
import {DEFAULT_TARGET_NAME} from "../target/constants";

export function normalizeOptions(tree: Tree, options?: TargetGeneratorSchema): NormalizedSchema {

  const projectName = options.projectName;
  const projectRoot = readProjectConfiguration(tree, options.projectName).root;

  return {
    ...options,
    projectName,
    projectRoot
  };
}

export function setupUserFlow(tree: Tree, cfg: NormalizedSchema): void {
  const {projectName, targetName, projectRoot, verbose} = cfg;
  logger.log(`Adding .user-flowrc.json to project`);
  let existing;
  try {
    readJson(tree, joinPathFragments(projectRoot, '.user-flowrc.json'));
    existing = true;
  }
  catch (e) {
    existing = false;
  }
  if (!existing) {
    writeJson(tree, joinPathFragments(projectRoot, '.user-flowrc.json'), {});
  }
  else {
    throw new Error(`.user-flowrc.json already exists in ${projectRoot}`);
  }
}

export function addTarget(tree: Tree, cfg: NormalizedSchema) {
  const {projectName, targetName, projectRoot, url} = cfg;
  const parsedTargetName = targetName || DEFAULT_TARGET_NAME;
  logger.log(`Adding target ${parsedTargetName} to project ${projectName}`);
  updateJson(tree, joinPathFragments(projectRoot, 'project.json'), (json) => {
    if (json.targets[parsedTargetName] !== undefined) {
      throw new Error(`Target ${parsedTargetName} already exists`)
    }
    json.targets[parsedTargetName] = {
      "executor": "@push-based/user-flow-nx-plugin:user-flow",
      "outputs": ["{options.outputPath}"],
      "options": {
        "url": url,
        "rcPath": joinPathFragments(projectRoot, './.user-flowrc.json'),
        "ufPath": joinPathFragments(projectRoot, '/user-flows'),
        "outputPath": joinPathFragments('dist', '/user-flow', projectRoot),
        "format": ["md"]
      }
    };
    return json;
  });
}
