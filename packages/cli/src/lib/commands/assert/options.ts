import { Options } from 'yargs';

export const budgets = {
  alias: 'j',
  type: 'array',
  string: true,
  description: 'Performance budgets (RC file only)'
} satisfies Options;

export const budgetPath = {
  alias: 'k',
  type: 'string',
  description: 'Path to budgets.json'
} satisfies Options;

export const assertOptions = {
  budgetPath,
  budgets
} satisfies Record<string, Options>;
