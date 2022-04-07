import { argv, Options } from 'yargs';
import { Param } from './format.model';
import { ArgvT } from '../../../internal/yargs/model';

export const param: Param = {
  format: {
    alias: 'f',
    type: 'array',
    string: true,
    description: 'Report output formats e.g. JSON'
  }
};

export function get(): string[] {
  const { format } = argv as any as ArgvT<Param>;
  return format as string[];
}
