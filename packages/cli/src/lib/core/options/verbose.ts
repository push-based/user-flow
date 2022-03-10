import { argv } from 'yargs';
import { Param } from './verbose.model';
import { ArgvT } from '../../internal/yargs/model';

export const param: Param = {
  verbose: {
    alias: 'v',
    type: 'boolean',
    description: 'Run with verbose logging'
  }
};

export function get(): boolean {
  const {verbose} = argv as any as ArgvT<Param>;
  return verbose;
}
