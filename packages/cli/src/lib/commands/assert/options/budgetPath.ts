import { argv } from 'yargs';
import { Param } from './budgetPath.model';
import { ArgvOption } from '../../../core/yargs/types';

export const param: Param = {
  budgetPath: {
    alias: 'j',
    type: 'string',
    description: 'Path to budgets.json'
  }
};

export function get(): string {
  const { budgetPath } = argv as any as ArgvOption<Param>;
  return budgetPath;
}
