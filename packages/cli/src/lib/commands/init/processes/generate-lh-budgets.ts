import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { existsSync, mkdirSync } from 'node:fs';

import { RcJson } from '../../../types.js';
import { readFile, writeFile } from '../../../core/file/index.js';
import { log, logVerbose } from '../../../core/loggin/index.js';
import { BudgetsExampleMap } from '../constants.js';
import { ifThenElse } from '../../../core/processing/behaviors.js';
import { CLIProcess } from '../../../core/processing/types.js';
import { deriveBudgetsFromLhr } from '../derive-budgets-from-lhr.js';

export async function generateLgBudgets(cliCfg: RcJson & { lhr?: string }): Promise<RcJson> {
  const destPath = process.cwd();
  const targetFileName = 'budget.json';
  let fileContent = '';

  if (readFile(targetFileName) !== '') {
    logVerbose(`Budgets ${targetFileName} already generated.`);
    return Promise.resolve(cliCfg);
  }

  if (!cliCfg.lhr) {
    const tplFileName = BudgetsExampleMap['budgets'];
    const exampleSourceLocation = join(dirname(fileURLToPath(import.meta.url)), '..', 'static', tplFileName);
    fileContent = readFile(exampleSourceLocation, { fail: true }).toString();
    logVerbose('New budgets used');
  } else {
    const lhrJson = readFile(cliCfg.lhr);
    if (lhrJson === '') {
      throw new Error(`Lighthouse report ${cliCfg.lhr} to derive budgets from is not given.`);
    }
    fileContent = JSON.stringify(deriveBudgetsFromLhr(JSON.parse(lhrJson)));
    logVerbose('Budgets derived from lhr');
  }
  const exampleDestination = join(destPath, targetFileName);

  if (!existsSync(destPath)) {
    mkdirSync(destPath, { recursive: true });
    logVerbose(`setup budgets folder ${destPath}`);
  }

  writeFile(exampleDestination, fileContent);

  log(`Setup budgets ${exampleDestination} successfully`);
  return Promise.resolve(cliCfg);
}

export function handleBudgetsGeneration({ generateBudgets, lhr }: { generateBudgets?: boolean, lhr?: string }): CLIProcess {
  return ifThenElse(
    // if `generateBudgets` is used
    () => !!generateBudgets,
    // generate the file => else do nothing
    (cfg) => generateLgBudgets({ ...cfg, lhr })
  );
}
