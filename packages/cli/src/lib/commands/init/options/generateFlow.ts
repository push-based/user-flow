import { Options } from 'yargs';

export const generateFlow = {
  alias: 'h',
  type: 'boolean',
  description: 'Create example user-flow'
} as const satisfies Options;
