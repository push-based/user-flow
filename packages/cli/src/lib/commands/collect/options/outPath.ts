import { argv, Options } from 'yargs';
import { Param } from './outPath.model';
import { ArgvT } from '../../../internal/yargs/model';

export const param: Param = {
  outPath: {
    alias: 'o',
    type: 'string',
    description: 'output folder for the user-flow reports'
  }
};

export function get(): string {
  const { outPath } = argv as any as ArgvT<Param>;
  return outPath;
}
