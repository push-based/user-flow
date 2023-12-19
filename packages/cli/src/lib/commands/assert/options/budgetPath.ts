import _yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { Param } from './budgetPath.model.js';
import { ArgvOption } from '../../../core/yargs/types.js';

const yargs = _yargs(hideBin(process.argv));

export const param: Param = {
  budgetPath: {
    alias: 'k',
    type: 'string',
    description: 'Path to budgets.json'
  }
};

export function get(): string {
  const { budgetPath } = yargs.argv as any as ArgvOption<Param>;
  return budgetPath;
}
