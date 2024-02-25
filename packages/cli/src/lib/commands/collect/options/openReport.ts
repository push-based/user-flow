import { argv, Options } from 'yargs';
import { getEnvPreset } from '../../../pre-set';

export const openReport = {
  alias: 'e',
  type: 'boolean',
  description: 'Opens browser automatically after the user-flow is collected. (true by default)',
  default: getEnvPreset().openReport as boolean,
  requiresArg: true
} satisfies Options;

export function get(): boolean {
  const { openReport } = argv as any as { openReport: boolean };
  return openReport;
}
