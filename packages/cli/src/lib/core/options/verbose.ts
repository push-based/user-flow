import { argv } from 'yargs';
import { Param } from './verbose.model';
import { ArgvOption } from '../utils/yargs/types';

export const param: Param = {
  verbose: {
    alias: 'v',
    type: 'boolean',
    description: 'Run with verbose logging'
  }
};

export function get(): boolean {
  const {verbose} = argv as any as ArgvOption<Param>;
  return verbose;
}
