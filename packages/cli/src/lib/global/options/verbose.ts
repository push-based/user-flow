import yargs from '../../core/yargs/instance.js';
import { Options } from 'yargs';
import { getEnvPreset } from '../../pre-set.js';

export const verbose = {
  alias: 'v',
  type: 'boolean',
  description: 'Run with verbose logging',
  default: getEnvPreset()['verbose']
} satisfies Options;

// We are in the process of removing this getter
export function get(): boolean  {
  const {verbose} = yargs.argv as any as { verbose?: boolean };
  if (verbose === undefined) {
    throw new Error('Error extracting verbose cli argument');
  }
  return verbose as boolean;
}
