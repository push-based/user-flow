import { Options } from 'yargs';
import { collectOptions } from '../collect/options';
import { assertOptions } from '../assert/options';

export const initOptions = {
  ...collectOptions,
  ...assertOptions
} satisfies Record<string, Options>;
