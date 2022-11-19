import { Param as BudgetPath } from '../../assert/options/budgetPath.model';
import { Param as Budgets } from '../../assert/options/budgets.model';
import { SharedFlagsSettings } from 'lighthouse/types/lhr/settings';

export type AssertYargsOptions = BudgetPath & Budgets;

// @TODO this type has overlap with the one in rc-json.ts we should fix that and only have one
export type AssertRcOptions = { budgetPath: string } | {
  budgets: SharedFlagsSettings['budgets'] | string
}
export type AssertArgvOptions = AssertRcOptions;

