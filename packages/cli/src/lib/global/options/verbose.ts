import _yargs, { Options } from 'yargs';
import { hideBin } from 'yargs/helpers';
import { getEnvPreset } from '../../pre-set.js';
const yargs = _yargs(hideBin(process.argv));

export const verbose = {
  alias: 'v',
  type: 'boolean',
  description: 'Run with verbose logging',
  default: getEnvPreset()['verbose']
} as const satisfies Options;

// We don't rely on yargs option normalization features as this can happen before cli bootstrap
export function get(): boolean  {
  const {verbose} = yargs.argv as any as { verbose: boolean }; // @TODO this is incorrect and does not work! Remove!
  return verbose;
}
