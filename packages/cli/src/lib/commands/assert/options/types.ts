import { SharedFlagsSettings } from 'lighthouse/types/lhr/settings.js';

// @TODO this type has overlap with the one in rc-json.ts we should fix that and only have one
export type AssertRcOptions = {
  budgetPath?: string,
  budgets?: SharedFlagsSettings['budgets']
}
export type AssertArgvOptions = AssertRcOptions;

