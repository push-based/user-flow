import { argv } from 'yargs';
import { Param } from './generateGhWorkflow.model';
import { ArgvOption } from '../../../core/yargs/types';

export const param: Param = {
  generateGhWorkflow: {
    alias: 'g',
    type: 'boolean',
    description: 'Create a workflow using user-flow under .github/workflows',
  },
};

export function get(): boolean {
  const { generateGhWorkflow } = argv as any as ArgvOption<Param>;
  return generateGhWorkflow;
}
