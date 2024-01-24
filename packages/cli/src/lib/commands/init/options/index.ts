import { InferredOptionTypes, Options } from 'yargs';

import { collectOptions } from '../../collect/options/index.js';
import { assertOptions } from '../../assert/options.js';
import { generateFlow } from './generateFlow.js';
import { generateGhWorkflow } from './generateGhWorkflow.js';

export const INIT_OPTIONS = {
  generateFlow,
  generateGhWorkflow,
  ...collectOptions,
  ...assertOptions
} satisfies Record<string, Options>;

export type InitOptions = InferredOptionTypes<typeof INIT_OPTIONS>;
