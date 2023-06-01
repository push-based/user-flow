import {
  formatFiles,
  Tree,
} from '@nrwl/devkit';

import {TargetGeneratorSchema} from './schema';
import {NormalizedSchema} from "./types";
import {addTarget, normalizeOptions} from "./utils";

export default async function (tree: Tree, options: TargetGeneratorSchema) {
  const normalizedOpts: NormalizedSchema = normalizeOptions(tree, options);
  addTarget(tree, normalizedOpts);
  await formatFiles(tree);
}


