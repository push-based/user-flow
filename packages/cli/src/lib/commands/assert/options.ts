import { SharedFlagsSettings } from 'lighthouse';
import { Options } from 'yargs';

const budgets = {
  alias: 'j',
  type: 'array',
  string: true,
  description: 'Performance budgets (RC file only)'
} satisfies Options;

const budgetPath = {
  alias: 'k',
  type: 'string',
  description: 'Path to budgets.json'
} satisfies Options;

export const assertOptions = {
  budgetPath,
  budgets
} satisfies Record<string, Options>;

// @TODO this type has overlap with the one in rc-json.ts we should fix that and only have one
export type AssertRcOptions = {
  budgetPath?: string,
  budgets?: SharedFlagsSettings['budgets']
}
export type AssertArgvOptions = AssertRcOptions;
