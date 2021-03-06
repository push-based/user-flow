import { argv } from 'yargs';
import { Param } from './interactive.model';
import { ArgvOption } from '../utils/yargs/types';

export const param: Param = {
  interactive: {
    type: 'boolean',
    description: 'When false questions are skipped with the values from the suggestions. This is useful for CI integrations.',
    default: true
  }
};

export function get(): boolean {
  const { interactive } = argv as any as ArgvOption<Param>;
  return interactive;
}
