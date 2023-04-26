import _yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
const yargs = _yargs(hideBin(process.argv));
import { Param } from './budgetPath.model.js';
import { ArgvOption } from '../../../core/yargs/types.js';

export const param: Param = {
  budgetPath: {
    alias: 'k',
    type: 'string',
    description: 'Path to budgets.json'
  }
};

export function get(): string {
  const { budgetPath } = yargs.argv as unknown as ArgvOption<Param>;
  return budgetPath;
}
