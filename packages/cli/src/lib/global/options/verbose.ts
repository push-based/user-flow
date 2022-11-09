import { argv } from 'yargs';
import { Param } from './verbose.model';
import { ArgvOption } from '../../core/yargs/types';

export const param: Param = {
  verbose: {
    alias: 'v',
    type: 'boolean',
    description: 'Run with verbose logging'
  }
};

export function get(): boolean {
  const {verbose, v} = argv as any;
  return verbose !== undefined ? !!verbose : v !== undefined ? !!v : false;
}
