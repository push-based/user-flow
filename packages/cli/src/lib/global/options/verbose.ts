import _yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { Param } from './verbose.model.js';
import { GlobalOptionsArgv } from './types.js';
import { getEnvPreset } from '../../pre-set.js';
const yargs = _yargs(hideBin(process.argv));

export const param: Param = {
  verbose: {
    alias: 'v',
    type: 'boolean',
    description: 'Run with verbose logging',
    default: getEnvPreset()['verbose']
  }
};

// We don't rely on yargs option normalization features as this can happen before cli bootstrap
export function get(): boolean  {
  const {verbose} = yargs.argv as unknown as GlobalOptionsArgv;
  return verbose;
}
