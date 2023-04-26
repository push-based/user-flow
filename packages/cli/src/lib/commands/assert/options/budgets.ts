import _yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
const yargs = _yargs(hideBin(process.argv));
import { Param } from './budgets.model.js';
import { ArgvOption } from '../../../core/yargs/types.js';

export const param: Param = {
  budgets: {
    alias: 'j',
    type: 'array',
    string: true,
    description: 'Performance budgets (RC file only)'
  }
};

export function get(): string[] {
  const { budgets } = yargs.argv as any as ArgvOption<Param>;
  return budgets as string[];
}
