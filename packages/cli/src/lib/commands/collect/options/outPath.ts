import _yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
const yargs = _yargs(hideBin(process.argv));
import { Param } from './outPath.model.js';
import { ArgvOption } from '../../../core/yargs/types.js';

export const param: Param = {
  outPath: {
    alias: 'o',
    type: 'string',
    description: 'output folder for the user-flow reports'
  }
};

export function get(): string {
  const { outPath } = yargs.argv as any as ArgvOption<Param>;
  return outPath as string;
}
