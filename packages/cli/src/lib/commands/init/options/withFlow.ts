import { argv } from 'yargs';
import { Param } from './withFlow.model';
import { ArgvOption } from '../../../core/yargs/types';

export const param: Param = {
  withFlow: {
    alias: 'g',
    type: 'boolean',
    description: 'Create as user flow under "ufPath"',
    default: true
  }
};

export function get(): boolean {
  const { withFlow } = argv as any as ArgvOption<Param>;
  return withFlow;
}
