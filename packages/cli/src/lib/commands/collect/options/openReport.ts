import { argv } from 'yargs';
import { Param } from './openReport.model';
import { ArgvOption } from '../../../core/yargs/types';
import { getEnvPreset } from '../../../pre-set';

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
  const { openReport } = argv as any as ArgvOption<Param>;
  return openReport;
}
