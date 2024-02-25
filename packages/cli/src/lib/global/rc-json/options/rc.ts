import { argv, Options } from 'yargs';
import { getEnvPreset } from '../../../pre-set';

export const rcPath = {
  alias: 'p',
  type: 'string',
  description: 'Path to user-flow.config.json. e.g. `./user-flowrc.json`',
  default: getEnvPreset().rcPath
} satisfies Options;

// We don't rely on yargs option normalization features as this can happen before cli bootstrap
export function get(): string {
  const { rcPath } = argv as unknown as { rcPath: string };
  return rcPath as string
}
