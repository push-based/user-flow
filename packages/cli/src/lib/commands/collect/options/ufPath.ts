import { argv, Options } from 'yargs';
import { Param } from './ufPath.model';
import { ArgvT } from '../../../internal/yargs/model';

export const param: Param = {
  ufPath: {
    alias: 'u',
    type: 'string',
    description: 'folder containing user-flow files to run. (`*.uf.ts` or `*.uf.js`)'
  }
};

export function get(): string {
  const { ufPath } = argv as any as ArgvT<Param>;
  return ufPath;
}
