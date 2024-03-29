import Budget from 'lighthouse/types/lhr/budget';
import { readFile } from '../../../../core/file';

const DEFAULT_ASSERT_BUDGET_PATH = './budget.json';

export function readBudgets(budgetPath: string = DEFAULT_ASSERT_BUDGET_PATH): Budget[] {
  return JSON.parse(readFile(budgetPath, { fail: true }) || '{}');
}



