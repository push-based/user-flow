import { argv } from 'yargs';
import { Param } from './format.model';
import { ArgvOption } from '../../../core/utils/yargs/types';

export const param: Param = {
  format: {
    alias: 'f',
    type: 'array',
    string: true,
    description: 'Report output formats e.g. JSON'
  }
};

export function get(): string[] {
  const { format } = argv as any as ArgvOption<Param>;
  return format as string[];
}
