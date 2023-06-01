import {
  formatFiles,
  Tree,
} from '@nrwl/devkit';

import { InstallGeneratorSchema } from './schema';
import {updateDependencies, normalizeOptions} from "./utils";
export default async function (tree: Tree, options: InstallGeneratorSchema) {
  const normalizedOptions = normalizeOptions(tree, options);
  if(options.skipPackageJson === false) {
    updateDependencies(tree, normalizedOptions);
  }
  await formatFiles(tree);
}
