import { param as verbose, get as getVerbose } from './verbose';
import { param as rc, get as getRcPath } from '../rc-json/options/rc';
import { param as interactive, get as getInteractive } from './interactive';
import { CoreOptions } from './types';

export const GLOBAL_OPTIONS_YARGS_CFG: CoreOptions = {
  ...verbose,
  ...rc,
  ...interactive,
};

export const globalOptions = {
  getVerbose,
  getRcPath,
  getInteractive,
};
