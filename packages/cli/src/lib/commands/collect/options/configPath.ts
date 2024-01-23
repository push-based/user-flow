import { Options } from 'yargs';

export const configPath = {
  alias: 'c',
  type: 'string',
  description: 'Path to Lighthouse configuration e.g config.json'
} as const satisfies Options;
