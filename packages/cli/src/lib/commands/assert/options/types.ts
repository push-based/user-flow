import { Param as BudgetPath } from '../../assert/options/budgetPath.model.js';
import { Param as Budgets } from '../../assert/options/budgets.model.js';
import { SharedFlagsSettings } from 'lighthouse/types/lhr/settings.js';

export type AssertYargsOptions = BudgetPath & Budgets;

// @TODO this type has overlap with the one in rc-json.ts we should fix that and only have one
export type AssertRcOptions = {
  budgetPath?: string,
  budgets?: SharedFlagsSettings['budgets']
}
export type AssertArgvOptions = AssertRcOptions;

