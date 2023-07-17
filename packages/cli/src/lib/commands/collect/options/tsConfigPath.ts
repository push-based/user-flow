import { argv } from 'yargs';
import { Param } from './tsConfigPath.model';
import { ArgvOption } from '../../../core/yargs/types';

export const param: Param = {
  tsConfigPath: {
    type: 'string',
    description: 'Path to typescript configuration e.g tsconfig.json'
  }
};

export function get(): string {
  const { tsConfigPath } = argv as any as ArgvOption<Param>;
  return tsConfigPath;
}
