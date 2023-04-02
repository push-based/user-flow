import { argv } from 'yargs';
import { Param } from './assertions.model';
import { ArgvOption } from '../../../core/yargs/types';

export const param: Param = {
  assertions: {
    alias: 'j',
    type: 'array',
    string: true,
    description: 'Performance assertion rules (RC file only)'
  }
};

export function get(): string[] {
  const { assertions } = argv as any as ArgvOption<Param>;
  return assertions as string[];
}
