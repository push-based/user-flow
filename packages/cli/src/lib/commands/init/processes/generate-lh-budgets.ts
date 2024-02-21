import { join } from 'node:path';
import { existsSync, mkdirSync } from 'node:fs';
import { cwd } from 'node:process';

import { RcJson } from '../../../types';
import { readFile, writeFile } from '../../../core/file';
import { logVerbose } from '../../../core/loggin';
import { BudgetsExampleMap } from '../constants';
import { ifThenElse } from '../../../core/processing/behaviors';
import { CLIProcess } from '../../../core/processing/types';
import { deriveBudgetsFromLhr } from '../derive-budgets-from-lhr';

export const budgetsFileExist = (path: string) => {
  return readFile(path) !== '';
};

export const defaultBudgets = () => {
  logVerbose('New budgets used');
  const tplFileName = BudgetsExampleMap['budgets'];
  const exampleSourceLocation = join(__dirname, '..', 'static', tplFileName);
  return  readFile(exampleSourceLocation, { fail: true }).toString();
}

export const derivedBudgets = (lhr: string) => {
  const lhrJson = readFile(lhr);
  if (lhrJson === '') {
    throw new Error(`Lighthouse report ${lhr} to derive budgets from is not given.`);
  }
  logVerbose('Budgets derived from lhr');
  return JSON.stringify(deriveBudgetsFromLhr(JSON.parse(lhrJson)));
};

const budgets = (lhr?: string): string => {
  return lhr ? derivedBudgets(lhr) : defaultBudgets();
};

export function writeBudgetsFile(path: string, name: string, budgets: string): void {
  if (!existsSync(path)) {
    mkdirSync(path, { recursive: true });
    logVerbose(`setup budgets folder ${path}`);
  }

  writeFile(join(path, name), budgets);
}

export async function generateLgBudgets(cfg: RcJson & { lhr?: string }): Promise<RcJson> {
  const BUDGETS_FILE_NAME = 'budget.json';

  if (!budgetsFileExist(BUDGETS_FILE_NAME)) {
    writeBudgetsFile(cwd(), BUDGETS_FILE_NAME, budgets(cfg.lhr));
  } else {
    logVerbose(`Budgets ${BUDGETS_FILE_NAME} already generated.`);
  }

  return Promise.resolve(cfg);
}

function shouldSkipCondition(generateBudgets?: boolean) {
  return () => !!generateBudgets;
}

export function generateLightHouseBudgetProcess(lhr?: string): CLIProcess {
  return (cfg: RcJson) => generateLgBudgets({ ...cfg, lhr });
}

export function handleBudgetsGeneration({ generateBudgets, lhr }: { generateBudgets?: boolean, lhr?: string }): CLIProcess {
  return ifThenElse(
    shouldSkipCondition(generateBudgets),
    generateLightHouseBudgetProcess(lhr),
  );
}
