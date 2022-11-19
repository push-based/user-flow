import { argv } from 'yargs';
import { Param } from './format.model';
import { getEnvPreset } from '../../../pre-set';
import { PersistRcOptions } from './types';

export const param: Param = {
  format: {
    alias: 'f',
    type: 'array',
    string: true,
    description: 'Report output formats e.g. JSON',
    default: getEnvPreset().format as string[]
  }
};

export function get(): string[] {
  const { format } = argv as unknown as PersistRcOptions;
  return format as string[];
}
