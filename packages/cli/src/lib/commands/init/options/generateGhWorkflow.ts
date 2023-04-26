import _yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
const argv = _yargs(hideBin(process.argv)).argv;
import { Param } from './generateGhWorkflow.model.js';
import { ArgvOption } from '../../../core/yargs/types.js';

export const param: Param = {
  generateGhWorkflow: {
    alias: 'g',
    type: 'boolean',
    description: 'Create a workflow using user-flow under .github/workflows'
  }
};

export function get(): boolean {
  const { generateGhWorkflow } = argv as any as ArgvOption<Param>;
  return generateGhWorkflow as boolean;
}
