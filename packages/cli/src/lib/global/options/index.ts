import { verbose, get as getVerbose } from './verbose';
import { rcPath, get as getRcPath } from '../rc-json/options/rc';
import { interactive, get as getInteractive } from './interactive';
import { Options } from 'yargs';

export const GLOBAL_OPTIONS_YARGS_CFG = {
  verbose,
  rcPath,
  interactive
} satisfies Record<string, Options>;

export const globalOptions = {
  getVerbose,
  getRcPath,
  getInteractive
};

