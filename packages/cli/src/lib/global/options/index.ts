import { InferredOptionTypes, Options } from 'yargs';

import { verbose, get as getVerbose } from './verbose.js';
import { rcPath, get as getRcPath } from '../rc-json/options/rc.js';
import { interactive, get as getInteractive } from './interactive.js';

export const GLOBAL_OPTIONS_YARGS_CFG = {
  verbose,
  rcPath,
  interactive
} as const satisfies Record<string, Options>;
export type GlobalCliOptions = InferredOptionTypes<typeof GLOBAL_OPTIONS_YARGS_CFG>;

export const globalOptions = {
  getVerbose,
  getRcPath,
  getInteractive
};

