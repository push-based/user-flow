import { argv, Options } from 'yargs';
import { getEnvPreset } from '../../pre-set';

function getDefaultByCliMode(): boolean {
  return getEnvPreset().interactive as boolean;
}
export const interactive = {
  alias: 'i',
  type: 'boolean',
  description: 'When false questions are skipped with the values from the suggestions. This is useful for CI integrations.',
  default: getDefaultByCliMode()
} satisfies Options;

// We don't rely on yargs option normalization features as this can happen before cli bootstrap
export function get(): boolean {
  const { interactive, i } = argv as any as {interactive?: boolean, i?: boolean};
  return interactive !== undefined ? Boolean(interactive) : i !== undefined ? Boolean(i) : getDefaultByCliMode();
}
