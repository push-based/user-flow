import { Options } from 'yargs';

export const url = {
  alias: 't',
  type: 'string',
  description: 'URL to analyze',
} satisfies Options;
