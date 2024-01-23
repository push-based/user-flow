import { Budget } from 'lighthouse';

import { readFile, writeFile } from '../../../../core/file/index.js';
import { logVerbose } from '../../../../core/loggin/index.js';
import { DEFAULT_ASSERT_BUDGET_PATH } from '../../options/budgetPath.constant.js';

export function readBudgets(budgetPath: string = DEFAULT_ASSERT_BUDGET_PATH): Budget[] {
  return JSON.parse(readFile(budgetPath, { fail: true }) || '{}');
}

export function writeBudgets(config: Budget[], budgetPath: string = DEFAULT_ASSERT_BUDGET_PATH): void {
  logVerbose(`Update budgets under ${budgetPath}`);

  if (JSON.stringify(readBudgets()) !== JSON.stringify(config)) {
    writeFile(budgetPath, JSON.stringify(config));
    logVerbose(`New budgets ${JSON.stringify(config)}`);
  } else {
    logVerbose(`No updates for ${budgetPath} to save.`);
  }
}

