import _yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { Param } from './openReport.model.js';
import { ArgvOption } from '../../../core/yargs/types.js';
import { getEnvPreset } from '../../../pre-set.js';

const yargs = _yargs(hideBin(process.argv));

export const param: Param = {
  openReport: {
    alias: 'e',
    type: 'boolean',
    description: 'Opens browser automatically after the user-flow is collected. (true by default)',
    default: getEnvPreset().openReport as boolean,
    requiresArg: true
  }
};

export function get(): boolean {
  const { openReport } = yargs.argv as any as ArgvOption<Param>;
  return openReport;
}
