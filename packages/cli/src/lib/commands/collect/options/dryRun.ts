import { Options } from 'yargs';
import { getEnvPreset } from '../../../pre-set.js';

export const dryRun = {
  alias: 'd',
  type: 'boolean',
  description: 'Execute commands without effects',
  default: getEnvPreset().dryRun as boolean
} satisfies Options;

