import { param as budgetPath } from '../../assert/options/budgetPath';
import { param as budgets } from '../../assert/options/budgets';
import { AssertYargsOptions } from './types';

export const ASSERT_OPTIONS: AssertYargsOptions = {
  ...budgetPath,
  ...budgets
};
