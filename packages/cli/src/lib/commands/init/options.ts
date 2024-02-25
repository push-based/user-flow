import { InferredOptionTypes, Options } from 'yargs';
import { collectOptions } from '../collect/options';
import { assertOptions } from '../assert/options';

const generateFlow = {
  alias: 'h',
  type: 'boolean',
  description: 'Create as user flow under "ufPath"'
} satisfies Options;

const generateGhWorkflow = {
  alias: 'g',
  type: 'boolean',
  description: 'Create a workflow using user-flow under .github/workflows'
} satisfies Options;

const generateBudgets = {
  type: 'boolean',
  description: 'Create a budgets file'
} satisfies Options;

const lhr = {
  type: 'string',
  description: 'Should derive budget from path',
} satisfies Options;

export const initOptions = {
  generateFlow,
  generateGhWorkflow,
  generateBudgets,
  lhr,
  ...collectOptions,
  ...assertOptions
} satisfies Record<string, Options>;
export type InitOptions = InferredOptionTypes<typeof initOptions>;
