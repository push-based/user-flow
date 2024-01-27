import {formatFiles, logger, Tree} from '@nrwl/devkit';

import {InitGeneratorSchema} from './schema';
import {normalizeOptions, updateDependencies, updateNxJson} from "./utils";

export default async function userFlowInitGenerator(tree: Tree, options: InitGeneratorSchema) {
  const normalizedOptions = normalizeOptions(tree, options);

  if (options.skipPackageJson === false) {
    logger.log('Adding packages:');
    updateDependencies(tree, normalizedOptions);
    logger.log('Adding nx config:');
    updateNxJson(tree, normalizedOptions);
  } else {
    logger.log('Skip adding packages');
  }

  await formatFiles(tree);
}
