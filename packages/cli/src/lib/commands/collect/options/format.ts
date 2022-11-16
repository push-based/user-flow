import { argv } from 'yargs';
import { Param } from './format.model';
import { getEnvPreset } from '../../../global/rc-json/pre-set';
import { PersistOptions } from '../../../global/rc-json/types';

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
  const { format } = argv as unknown as PersistOptions;
  return format as string[];
}
