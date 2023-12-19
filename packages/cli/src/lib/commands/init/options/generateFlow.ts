import _yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { Param } from './generateFlow.model.js';
import { ArgvOption } from '../../../core/yargs/types.js';

const yargs = _yargs(hideBin(process.argv));

export const param: Param = {
  generateFlow: {
    alias: 'h',
    type: 'boolean',
    description: 'Create as user flow under "ufPath"'
  }
};

export function get(): boolean {
  const { generateFlow } = yargs.argv as any as ArgvOption<Param>;
  return generateFlow;
}
