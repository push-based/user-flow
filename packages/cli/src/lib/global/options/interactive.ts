import yargs from '../../core/yargs/instance.js';
import { Options } from 'yargs';
import { getEnvPreset } from '../../pre-set.js';

export const interactive = {
  alias: 'i',
  type: 'boolean',
  description: 'When false questions are skipped with the values from the suggestions. This is useful for CI integrations.',
  default: getEnvPreset().interactive,
} satisfies Options;

export function get(): boolean {
  const { interactive } = yargs.argv as any as { interactive: boolean };
  return interactive;
}
