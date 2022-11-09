import { argv } from 'yargs';
import { Param } from './verbose.model';
import { ArgvOption } from '../../core/yargs/types';

export const param: Param = {
  verbose: {
    alias: 'v',
    type: 'boolean',
    description: 'Run with verbose logging',
    default: false
  }
};

// We don't rely on yargs option normalization features as this can happen before cli bootstrap
export function get(): boolean {
  const {verbose, v } = argv as any as ArgvOption<any>;
  return verbose !== undefined ?  Boolean(verbose) : v !== undefined ? Boolean(v) : param.verbose.default;
}
