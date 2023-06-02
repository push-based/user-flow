import {formatFiles, Tree,} from '@nrwl/devkit';

import {TargetGeneratorSchema} from './schema';
import {NormalizedSchema} from "./types";
import {addTarget, normalizeOptions, setupUserFlow} from "./utils";

export default async function (tree: Tree, options: TargetGeneratorSchema) {
  const normalizedOpts: NormalizedSchema = normalizeOptions(tree, options);
  setupUserFlow(tree, normalizedOpts);

  addTarget(tree, normalizedOpts);
  await formatFiles(tree);
}


