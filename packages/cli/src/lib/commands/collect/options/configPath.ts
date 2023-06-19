import { argv } from 'yargs';
import { Param } from './configPath.model';
import { ArgvOption } from '../../../core/yargs/types';

export const param: Param = {
  configPath: {
    alias: 'c',
    type: 'string',
    description: 'Path to Lighthouse configuration e.g config.json',
  },
};

export function get(): string {
  const { configPath } = argv as any as ArgvOption<Param>;
  return configPath;
}
