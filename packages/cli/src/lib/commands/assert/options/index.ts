import { param as budgetPath } from '../../assert/options/budgetPath';
import { param as budgets } from '../../assert/options/budgets';
import { param as assertions } from '../../assert/options/assertions';
import { AssertYargsOptions } from './types';

export const ASSERT_OPTIONS: AssertYargsOptions = {
  ...assertions,
  ...budgetPath,
  ...budgets
};
