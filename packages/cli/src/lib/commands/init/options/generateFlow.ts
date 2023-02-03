import { argv } from 'yargs';
import { Param } from './generateFlow.model';
import { ArgvOption } from '../../../core/yargs/types';

export const param: Param = {
  generateFlow: {
    alias: 'h',
    type: 'boolean',
    description: 'Create as user flow under "ufPath"'
  }
};

export function get(): boolean {
  const { generateFlow } = argv as any as ArgvOption<Param>;
  return generateFlow;
}
