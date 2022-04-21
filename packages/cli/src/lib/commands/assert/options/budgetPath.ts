import { argv } from 'yargs';
import { Param } from './budgetPath.model';
import { ArgvT } from '../../../internal/utils/yargs/types';

export const param: Param = {
  budgetPath: {
    alias: 'b',
    type: 'string',
    description: 'Path to budgets.json'
  }
};

export function get(): string {
  const { budgetPath } = argv as any as ArgvT<Param>;
  return budgetPath;
}
