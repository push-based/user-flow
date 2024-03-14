import { argv, Options } from 'yargs';
import { getEnvPreset } from '../../pre-set';

export const interactive = {
  alias: 'i',
  type: 'boolean',
  description: 'When false questions are skipped with the values from the suggestions. This is useful for CI integrations.',
  default: getEnvPreset().interactive,
} satisfies Options;

export function get(): boolean {
  const { interactive } = argv as any as { interactive: boolean };
  return interactive;
}
