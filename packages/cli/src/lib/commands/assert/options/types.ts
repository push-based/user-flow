import { Param as BudgetPath } from '../../assert/options/budgetPath.model';
import { Param as Budgets } from '../../assert/options/budgets.model';
import { YargsArgvOptionFromParamsOptions } from '../../../core/utils/yargs/types';

export type AssertOptions = BudgetPath & Budgets;
export type AssertOptionsArgv = YargsArgvOptionFromParamsOptions<AssertOptions>;


