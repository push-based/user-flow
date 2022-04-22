import { argv } from 'yargs';
import { Param } from './budgets.model';
import { ArgvOption } from '../../../core/utils/yargs/types';

export const param: Param = {
  budgets: {
    alias: 'f',
    type: 'array',
    string: true,
    description: 'Performance budgets (RC file only)'
  }
};

export function get(): string[] {
  const { budgets } = argv as any as ArgvOption<Param>;
  return budgets as string[];
}
