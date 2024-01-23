import _yargs, { Options } from 'yargs';
import { hideBin } from 'yargs/helpers';
import { Param } from './openReport.model.js';
import { ArgvOption } from '../../../core/yargs/types.js';
import { getEnvPreset } from '../../../pre-set.js';

const yargs = _yargs(hideBin(process.argv));

export const openReport = {
  alias: 'e',
  type: 'boolean',
  description: 'Opens browser automatically after the user-flow is collected. (true by default)',
  default: getEnvPreset().openReport as boolean,
  requiresArg: true
} as const satisfies Options;

// TODO this should be removed, currently does not work!
export function get(): boolean {
  const { openReport } = yargs.argv as any as ArgvOption<Param>;
  return openReport;
}
