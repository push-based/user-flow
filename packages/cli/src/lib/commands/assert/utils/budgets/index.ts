import {readFile, writeFile} from '../../../../core/file';
import {logVerbose} from '../../../../core/loggin';
import Budget from 'lighthouse/types/lhr/budget';
import {DEFAULT_ASSERT_BUDGET_PATH} from '../../options/budgetPath.constant';

export function readBudgets(
  budgetPath: string = DEFAULT_ASSERT_BUDGET_PATH
): Budget[] {
  const budgetsJson = JSON.parse(readFile(budgetPath, { fail: true }) || '{}');
  return budgetsJson;
}

export function writeBudgets(
  config: Budget[],
  budgetPath: string = DEFAULT_ASSERT_BUDGET_PATH
): void {
  logVerbose(`Update budgets under ${budgetPath}`);

  if (JSON.stringify(readBudgets()) !== JSON.stringify(config)) {
    writeFile(budgetPath, JSON.stringify(config));
    logVerbose(`New budgets ${JSON.stringify(config)}`);
  } else {
    logVerbose(`No updates for ${budgetPath} to save.`);
  }
}
