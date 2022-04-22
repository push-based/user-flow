import { argv } from 'yargs';
import { Param } from './dryRun.model';
import { ArgvOption } from '../utils/yargs/types';

export const param: Param = {
  dryRun: {
    type: 'boolean',
    description: 'Execute commands without effects',
    default: false
  }
};

export function get(): boolean {
  const { dryRun } = argv as any as ArgvOption<Param>;
  return dryRun;
}
