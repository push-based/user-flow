import _yargs, { Options } from 'yargs';
import { hideBin } from 'yargs/helpers';
import { Param } from './dryRun.model.js';
import { ArgvOption } from '../../../core/yargs/types.js';

const yargs = _yargs(hideBin(process.argv));

export const dryRun = {
  alias: 'd',
  type: 'boolean',
  description: 'Execute commands without effects',
  default: false
} as const satisfies Options;

export const param: Param = {
  dryRun: {
    alias: 'd',
    type: 'boolean',
    description: 'Execute commands without effects',
    default: false
  }
};

export function get(): boolean {
  const { dryRun } = yargs.argv as any as ArgvOption<Param>;
  return dryRun;
}
