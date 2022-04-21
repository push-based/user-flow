import { param as budgetPath } from '../../assert/options/budgetPath';
import { param as budgets } from '../../assert/options/budgets';
import { AssertOptions } from './types';

export const ASSERT_OPTIONS: AssertOptions = {
  ...budgetPath,
  ...budgets
};
