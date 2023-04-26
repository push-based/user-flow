import { param as verbose, get as getVerbose } from './verbose.js';
import { param as rc, get as getRcPath } from '../rc-json/options/rc.js';
import { param as interactive, get as getInteractive } from './interactive.js';
import { CoreOptions } from './types.js';

export const GLOBAL_OPTIONS_YARGS_CFG: CoreOptions = {
  ...verbose,
  ...rc,
  ...interactive
};

export const globalOptions = {
  getVerbose,
  getRcPath,
  getInteractive
};

