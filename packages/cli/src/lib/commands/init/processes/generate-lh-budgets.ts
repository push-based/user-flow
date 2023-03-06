import { RcJson } from '../../../types';
import { join } from 'path';
import { readFile, writeFile } from '../../../core/file';
import { log, logVerbose } from '../../../core/loggin';
import { existsSync, mkdirSync } from 'fs';
import { BudgetsExampleMap } from '../constants';
import { ifThenElse } from '../../../core/processing/behaviors';
import { CLIProcess } from '../../../core/processing/types';

export async function generateLgBudgets(cliCfg: RcJson): Promise<RcJson> {
  const destPath = process.cwd();
  const tplFileName = BudgetsExampleMap['budgets'];
  const targetFileName = 'budgets.json';
  const exampleSourceLocation = join(__dirname, '..', 'static', tplFileName);
  const exampleDestination = join(destPath, targetFileName);

  if (readFile(targetFileName) !== '') {
    logVerbose(`Budgets ${targetFileName} already generated.`);
    return Promise.resolve(cliCfg);
  }

  const fileContent = readFile(exampleSourceLocation, { fail: true }).toString();
  if (!existsSync(destPath)) {
    mkdirSync(destPath, { recursive: true });
    logVerbose(`setup budgets folder ${destPath}`);
  }

  writeFile(exampleDestination, fileContent);

  log(`setup budgets ${exampleDestination} successfully`);
  return Promise.resolve(cliCfg);
}

export function handleBudgetsGeneration({ generateBudgets }: { generateBudgets?: boolean }): CLIProcess {
  return ifThenElse(
    // if `generateBudgets` is used
    () => generateBudgets === true,
    // generate the file => else do nothing
    generateLgBudgets
  );
}

