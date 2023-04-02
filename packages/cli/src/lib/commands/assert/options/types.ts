import { Param as BudgetPath } from '../../assert/options/budgetPath.model';
import { Param as Budgets } from '../../assert/options/budgets.model';
import { Param as Assertions } from '../../assert/options/assertions.model';
import { SharedFlagsSettings } from 'lighthouse/types/lhr/settings';

export type AssertYargsOptions = BudgetPath & Budgets & Assertions;

// @TODO this type has overlap with the one in rc-json.ts we should fix that and only have one
export type AssertRcOptions = {
  assertMatrix?: string,
  preset?: string,
  assertions?: any[],
  budgetPath?: string,
  budgets?: SharedFlagsSettings['budgets']
}
export type AssertArgvOptions = AssertRcOptions;

