import { existsSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { RcJson } from '../../../types.js';
import { readFile, writeFile } from '../../../core/file/index.js';
import { log, logVerbose } from '../../../core/loggin/index.js';
import { GhWorkflowExampleMap } from '../constants.js';
import { exampleWorkflow } from '../static/user-flow-ci.js';
import { ifThenElse } from '../../../core/processing/behaviors.js';
import { CLIProcess } from '../../../core/processing/types.js';

const exampleName = 'basic-workflow';

const destPath =   join('.github', 'workflows');
export function getExamplePathDest(): string {
  const fileName = GhWorkflowExampleMap[exampleName];
  if(!fileName) {
    throw new Error(`workflowExample ${exampleName} is not registered`);
  }
  return join(destPath, fileName);
}

export async function generateGhWorkflowFile(cliCfg: RcJson): Promise<RcJson> {
  const exampleDestination = getExamplePathDest();

  if (readFile(exampleDestination) !== '') {
    logVerbose(`User flow ${exampleName} already generated under ${exampleDestination}.`);
    return Promise.resolve(cliCfg);
  }

  if(!existsSync(destPath)) {
    mkdirSync(destPath, {recursive: true});
    logVerbose(`setup workflow folder ${destPath}`);
  }

  await writeFile(exampleDestination, exampleWorkflow);

  log(`setup workflow for user-flow integration in the CI in ${exampleDestination} successfully`);
  return Promise.resolve(cliCfg);
}

export function handleGhWorkflowGeneration({ generateGhWorkflow }: { generateGhWorkflow?: boolean }): CLIProcess {
  return ifThenElse(
    // if `withFlow` is not used in the CLI is in interactive mode
    () => generateGhWorkflow === true,
    // generate the file => else do nothing
    generateGhWorkflowFile
  );
}

