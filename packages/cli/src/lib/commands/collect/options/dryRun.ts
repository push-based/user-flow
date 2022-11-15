import { argv } from 'yargs';
import { Param } from './dryRun.model';
import { getEnvPreset } from '../../../global/rc-json/pre-set';
import { CollectOptions } from '../../../global/rc-json/types';

export const param: Param = {
  dryRun: {
    type: 'boolean',
    description: 'Execute commands without effects',
    default: getEnvPreset().dryRun
  }
};

export function get(): boolean {
  const { dryRun } = argv as unknown as CollectOptions;
  return dryRun as boolean;
}
