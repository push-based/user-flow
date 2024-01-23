import { Options } from 'yargs';

export const outPath = {
  alias: 'o',
  type: 'string',
  description: 'output folder for the user-flow reports'
} as const satisfies Options;
