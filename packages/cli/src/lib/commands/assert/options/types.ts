import { YargsArgvOptionFromParamsOptions } from '../../../internal/utils/types';
import { Param as BudgetPath } from '../../assert/options/budgetPath.model';
import { Param as Budgets } from '../../assert/options/budgets.model';

export type AssertOptions = BudgetPath & Budgets;
export type AssertOptionsArgv = YargsArgvOptionFromParamsOptions<AssertOptions>;


