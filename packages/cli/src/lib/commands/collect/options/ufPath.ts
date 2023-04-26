import _yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
const yargs = _yargs(hideBin(process.argv));
import { Param } from './ufPath.model.js';
import { ArgvOption } from '../../../core/yargs/types.js';

export const param: Param = {
  ufPath: {
    alias: 'u',
    type: 'string',
    description: 'folder containing user-flow files to run. (`*.uf.ts` or `*.uf.js`)'
  }
};

export function get(): string {
  const { ufPath } = yargs.argv as any as ArgvOption<Param>;
  return ufPath as string;
}
