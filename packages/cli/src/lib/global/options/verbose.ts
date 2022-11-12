import { argv } from 'yargs';
import { Param } from './verbose.model';
import { ArgvOption } from '../../core/yargs/types';
import { getEnvPreset } from '../rc-json/pre-set';

function getDefaultByCliMode(): boolean {
  return getEnvPreset().verbose;
}

export const param: Param = {
  verbose: {
    alias: 'v',
    type: 'boolean',
    description: 'Run with verbose logging',
    default: getDefaultByCliMode()
  }
};

// We don't rely on yargs option normalization features as this can happen before cli bootstrap
export function get(): boolean | undefined {
  const { verbose } = argv as any as ArgvOption<any>;
  return verbose !== undefined ? Boolean(verbose) : param.verbose.default;
}
