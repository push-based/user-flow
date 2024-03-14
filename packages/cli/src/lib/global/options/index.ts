import { InferredOptionTypes, Options } from 'yargs';

import { verbose, get as getVerbose } from './verbose';
import { rcPath, get as getRcPath } from '../rc-json/options/rc';
import { interactive, get as getInteractive } from './interactive';

export const GLOBAL_OPTIONS_YARGS_CFG = {
  verbose,
  rcPath,
  interactive
} satisfies Record<string, Options>;
export type GlobalCliOptions = InferredOptionTypes<typeof GLOBAL_OPTIONS_YARGS_CFG>;

export const globalOptions = {
  getVerbose,
  getRcPath,
  getInteractive
};

