import { argv } from 'yargs';
import { Param } from './open.model';
import { ArgvOption } from '../../../core/yargs/types';

export const param: Param = {
  open: {
    alias: 'e',
    type: 'boolean',
    description: 'Opens browser automatically after the user-flow is collected. (true by default)',
    default: true,
    requiresArg: true
  }
};

export function get(): boolean {
  const { open } = argv as any as ArgvOption<Param>;
  return open;
}
