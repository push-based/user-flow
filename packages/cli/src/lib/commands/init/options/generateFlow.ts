import _yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
const argv = _yargs(hideBin(process.argv)).argv;
import { Param } from './generateFlow.model.js';
import { ArgvOption } from '../../../core/yargs/types.js';

export const param: Param = {
  generateFlow: {
    alias: 'h',
    type: 'boolean',
    description: 'Create as user flow under "ufPath"'
  }
};

export function get(): boolean {
  const { generateFlow } = argv as any as ArgvOption<Param>;
  return generateFlow as boolean;
}
