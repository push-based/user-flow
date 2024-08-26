import { Budget } from 'lighthouse';
import { readFile } from '../../../../core/file/index.js';

const DEFAULT_ASSERT_BUDGET_PATH = './budget.json';

export function readBudgets(budgetPath: string = DEFAULT_ASSERT_BUDGET_PATH): Budget[] {
  return JSON.parse(readFile(budgetPath, { fail: true }) || '{}');
}



