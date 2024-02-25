import Budget from 'lighthouse/types/lhr/budget';
import { readFile } from '../../../../core/file';
import { DEFAULT_ASSERT_BUDGET_PATH } from '../../constants';

export function readBudgets(budgetPath: string = DEFAULT_ASSERT_BUDGET_PATH): Budget[] {
  const budgetsJson = JSON.parse(readFile(budgetPath, {fail: true}) || '{}');
  return budgetsJson;
}



