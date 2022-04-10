import { readFile, writeFile } from '../file';
import { logVerbose } from '../../../core/loggin';
import { readRcConfig } from '../../config/config';
import { DEFAULT_ASSERT_BUDGET_PATH } from '../../config/constants';
import Budget from 'lighthouse/types/lhr/budget';


export function readBudgets(budgetPath: string = DEFAULT_ASSERT_BUDGET_PATH): Budget[] {
  const budgetsJson = JSON.parse(readFile(budgetPath) || '{}');
  logVerbose('Read budgets:', budgetsJson);
  return budgetsJson;
}

export function writeBudgets(config: Budget[], budgetPath: string = DEFAULT_ASSERT_BUDGET_PATH): void {
  logVerbose(`Update config under ${budgetPath}`);

  if (JSON.stringify(readRcConfig()) !== JSON.stringify(config)) {
    writeFile(budgetPath, JSON.stringify(config));
    logVerbose(`New budgets ${JSON.stringify(config)}`);
  } else {
    logVerbose(`No updates for ${budgetPath} to save.`);
  }
}

