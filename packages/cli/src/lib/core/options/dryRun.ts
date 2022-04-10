import { argv } from 'yargs';
import { Param } from './dryRun.model';
import { ArgvT } from '../../internal/utils/yargs/types';

export const param: Param = {
  dryRun: {
    type: 'boolean',
    description: 'Execute commands without effects',
    default: false
  }
};

export function get(): boolean {
  const { dryRun } = argv as any as ArgvT<Param>;
  return dryRun;
}
