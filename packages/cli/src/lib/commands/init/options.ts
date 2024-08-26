import { InferredOptionTypes, Options } from 'yargs';
import { collectOptions } from '../collect/options/index.js';

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


const lhr = {
  type: 'string',
  description: 'Should derive budget from path',
} satisfies Options;

export const initOptions = {
  generateFlow,
  generateGhWorkflow,
  lhr,
  ...collectOptions,
} satisfies Record<string, Options>;
export type InitOptions = InferredOptionTypes<typeof initOptions>;
