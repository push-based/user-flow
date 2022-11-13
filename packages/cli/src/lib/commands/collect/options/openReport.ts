import { argv } from 'yargs';
import { Param } from './openReport.model';
import { ArgvOption } from '../../../core/yargs/types';

export const param: Param = {
  openReport: {
    alias: 'e',
    type: 'boolean',
    description: 'Opens browser automatically after the user-flow is collected. (true by default)',
    default: true,
    requiresArg: true
  }
};

export function get(): boolean {
  const { openReport } = argv as any as ArgvOption<Param>;
  return openReport;
}
