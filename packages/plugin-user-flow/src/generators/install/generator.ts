import {formatFiles, logger, Tree} from '@nrwl/devkit';

import {InstallGeneratorSchema} from './schema';
import {normalizeOptions, updateDependencies} from "./utils";

export default async function (tree: Tree, options: InstallGeneratorSchema) {
  const normalizedOptions = normalizeOptions(tree, options);

  if (options.skipPackageJson === false) {
    logger.log('Adding packages:');
    updateDependencies(tree, normalizedOptions);
  } else {
    logger.log('Skip adding packages');
  }
  await formatFiles(tree);
}
