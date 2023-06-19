import { argv } from 'yargs';
import { Param } from './dryRun.model';
import { ArgvOption } from '../../../core/yargs/types';
import { getEnvPreset } from '../../../pre-set';

export const param: Param = {
  dryRun: {
    alias: 'd',
    type: 'boolean',
    description: 'Execute commands without effects',
    default: getEnvPreset().dryRun as boolean,
  },
};

export function get(): boolean {
  const { dryRun } = argv as any as ArgvOption<Param>;
  return dryRun;
}
