import { param as budgetPath } from '../../assert/options/budgetPath.js';
import { param as budgets } from '../../assert/options/budgets.js';
import { AssertYargsOptions } from './types.js';
import { InferredOptionTypes } from 'yargs';

export const ASSERT_OPTIONS: AssertYargsOptions = {
  ...budgetPath,
  ...budgets
};
export type AssertOptions = InferredOptionTypes<AssertYargsOptions>;
