import { argv } from 'yargs';
import { Param } from './verbose.model';
import { GlobalOptionsArgv } from './types';
import { getEnvPreset } from '../../pre-set';

export const param: Param = {
  verbose: {
    alias: 'v',
    type: 'boolean',
    description: 'Run with verbose logging',
    default: getEnvPreset().verbose,
  },
};

// We don't rely on yargs option normalization features as this can happen before cli bootstrap
export function get(): boolean {
  const { verbose } = argv as unknown as GlobalOptionsArgv;
  return verbose;
}
