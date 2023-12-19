import _yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { Param } from './format.model.js';
import { PersistRcOptions } from './types.js';
import { REPORT_FORMAT_VALUES } from '../constants.js';

const yargs = _yargs(hideBin(process.argv));

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
  const { format } = yargs.argv as unknown as PersistRcOptions;
  return format as string[];
}
