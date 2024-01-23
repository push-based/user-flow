import _yargs, { Options } from 'yargs';
import { hideBin } from 'yargs/helpers';
import { getEnvPreset } from '../../../pre-set.js';

const yargs = _yargs(hideBin(process.argv));

export const rcPath = {
  alias: 'p',
  type: 'string',
  description: 'Path to user-flow.config.json. e.g. `./user-flowrc.json`',
  default: getEnvPreset().rcPath
} as const satisfies Options;

// We don't rely on yargs option normalization features as this can happen before cli bootstrap
export function get(): string {
  const { rcPath } = yargs.argv as any as { rcPath: string }; // @TODO this is incorrect and does not work! Remove!
  return rcPath;
}
