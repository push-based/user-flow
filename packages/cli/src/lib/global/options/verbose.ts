import { argv, Options } from 'yargs';
import { getEnvPreset } from '../../pre-set';

export const verbose = {
  alias: 'v',
  type: 'boolean',
  description: 'Run with verbose logging',
  default: getEnvPreset().verbose
} satisfies Options;

// We don't rely on yargs option normalization features as this can happen before cli bootstrap
export function get(): boolean  {
  const {verbose} = argv as unknown as {verbose?: boolean};
  return !!verbose;
}
