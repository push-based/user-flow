import { argv } from 'yargs';
import { Param } from './format.model';
import { ArgvOption } from '../../../core/yargs/types';
import { getEnvPreset } from '../../../global/rc-json/pre-set';
import { PersistOptions } from '../../../global/rc-json/types';

function getDefaultByCliMode(): PersistOptions['format'] {
  return getEnvPreset().format;
}

export const param: Param = {
  format: {
    alias: 'f',
    type: 'array',
    string: true,
    description: 'Report output formats e.g. JSON',
    default: getEnvPreset().format
  }
};

export function get(): string[] {
  const { format } = argv as any as ArgvOption<Param>;
  return format !== undefined && Array.isArray(format) && format.length > 0 ? format : param.format.default;
}
