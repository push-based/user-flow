import { argv } from 'yargs';
import { Param } from './openReport.model';
import { ArgvOption } from '../../../core/yargs/types';
import { getEnvPreset } from '../../../global/rc-json/pre-set';

function getDefaultByCliMode(): boolean {
  return getEnvPreset().openReport;
}

export const param: Param = {
  openReport: {
    alias: 'e',
    type: 'boolean',
    description: 'Opens browser automatically after the user-flow is collected. (true by default)',
    default: getDefaultByCliMode(),
    requiresArg: true
  }
};

export function get(): boolean {
  const {  openReport } = argv as any as ArgvOption<Param>;
  return openReport !== undefined ? Boolean(openReport) : param.openReport.default;
}
