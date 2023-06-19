import { argv, Options } from 'yargs';
import { Param } from './outPath.model';
import { ArgvOption } from '../../../core/yargs/types';

export const param: Param = {
  outPath: {
    alias: 'o',
    type: 'string',
    description: 'output folder for the user-flow reports',
  },
};

export function get(): string {
  const { outPath } = argv as any as ArgvOption<Param>;
  return outPath;
}
