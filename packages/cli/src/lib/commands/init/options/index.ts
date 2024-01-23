import { InferredOptionTypes, Options } from 'yargs';

import { collectOptions } from '../../collect/options/index.js';
import { assertOptions } from '../../assert/options.js';

export const INIT_OPTIONS = {
  ...collectOptions,
  ...assertOptions
} satisfies Record<string, Options>;
export type InitOptions = InferredOptionTypes<typeof INIT_OPTIONS>;
