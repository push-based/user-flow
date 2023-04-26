import { param as budgetPath } from '../../assert/options/budgetPath.js';
import { param as budgets } from '../../assert/options/budgets.js';
import { AssertYargsOptions } from './types.js';

export const ASSERT_OPTIONS: AssertYargsOptions = {
  ...budgetPath,
  ...budgets
};
