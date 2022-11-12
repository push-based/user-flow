import { argv } from 'yargs';
import { Param } from './dryRun.model';
import { ArgvOption } from '../../../core/yargs/types';
import { getEnvPreset } from '../../../global/rc-json/pre-set';

function getDefaultByCliMode(): boolean {
  return getEnvPreset().dryRun as boolean;
}

export const param: Param = {
  dryRun: {
    type: 'boolean',
    description: 'Execute commands without effects',
    default: getDefaultByCliMode()
  }
};

export function get(): boolean {
  const { dryRun } = argv as any as ArgvOption<Param>;
  return dryRun !== undefined ? Boolean(dryRun) : param.dryRun.default;
}
