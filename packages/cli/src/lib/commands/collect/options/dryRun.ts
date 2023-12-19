import _yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { Param } from './dryRun.model.js';
import { ArgvOption } from '../../../core/yargs/types.js';
import { getEnvPreset } from '../../../pre-set.js';

const yargs = _yargs(hideBin(process.argv));

export const param: Param = {
  dryRun: {
    alias: 'd',
    type: 'boolean',
    description: 'Execute commands without effects',
    default: getEnvPreset().dryRun as boolean
  }
};

export function get(): boolean {
  const { dryRun } = yargs.argv as any as ArgvOption<Param>;
  return dryRun;
}
