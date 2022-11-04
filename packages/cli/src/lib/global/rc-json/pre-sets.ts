import { CollectOptions, RcArgvOptions } from './types';
import { CoreOptionsArgv } from '../options/types';

const DEFAULT_PRESET = {

};
const CI_PRESET: Partial<CoreOptionsArgv & RcArgvOptions> = {
  format: ['md', 'json'],
  interactive: false,
  openReport: false
};

const SANDBOX_PRESET: Partial<CoreOptionsArgv & RcArgvOptions & CollectOptions> = {
  dryRun: true,
  interactive: false,
  openReport: false
};
