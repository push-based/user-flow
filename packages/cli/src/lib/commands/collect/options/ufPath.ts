import { Options } from 'yargs';

export const ufPath = {
  alias: 'u',
  type: 'string',
  description: 'folder containing user-flow files to run. (`*.uf.ts` or `*.uf.js`)'
} as const satisfies Options;

