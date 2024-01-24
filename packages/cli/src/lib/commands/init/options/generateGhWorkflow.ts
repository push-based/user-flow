import { Options } from 'yargs';

export const generateGhWorkflow = {
  alias: 'g',
  type: 'boolean',
  description: 'Create a workflow using user-flow under .github/workflows'
} as const satisfies Options;
