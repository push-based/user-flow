import _yargs, { Options } from 'yargs';
import { hideBin } from 'yargs/helpers';
import { ArgvOption } from '../../core/yargs/types.js';
import { getEnvPreset } from '../../pre-set.js';
const yargs = _yargs(hideBin(process.argv));

function getDefaultByCliMode(): boolean {
  return getEnvPreset().interactive as boolean;
}

export const interactive = {
  alias: 'i',
  type: 'boolean',
  description: 'When false questions are skipped with the values from the suggestions. This is useful for CI integrations.',
  default: getDefaultByCliMode()
} as const satisfies Options;

// We don't rely on yargs option normalization features as this can happen before cli bootstrap
export function get(): boolean {
  const { interactive, i } = yargs.argv as any as ArgvOption<any>;
  return interactive !== undefined ? Boolean(interactive) : i !== undefined ? Boolean(i) : getDefaultByCliMode();
}
