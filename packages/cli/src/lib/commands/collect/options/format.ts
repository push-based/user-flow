import { argv } from 'yargs';
import { Param } from './format.model';
import { getEnvPreset } from '../../../pre-set';
import { PersistRcOptions } from './types';
import { REPORT_FORMAT_VALUES } from '../constants';

// @ts-ignore
// @ts-ignore
export const param: Param = {
  format: {
    alias: 'f',
    type: 'array',
    string: true,
    description: 'Report output formats e.g. JSON',
    choices: REPORT_FORMAT_VALUES,
    //default: (getEnvPreset() as any).format
  }
};

export function get(): string[] {
  const { format } = argv as unknown as PersistRcOptions;
  return format as string[];
}
