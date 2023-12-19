import { join } from 'path';
import { mkdirSync, existsSync } from 'fs';
import { RcJson } from '../../../types.js';
import { readFile, writeFile } from '../../../core/file/index.js';
import { log, logVerbose } from '../../../core/loggin/index.js';
import { GhWorkflowExampleMap } from '../constants.js';
import { GhWorkflowExamples } from '../types.js';
import { ifThenElse } from '../../../core/processing/behaviors.js';
import { CLIProcess } from '../../../core/processing/types.js';

const exampleName = 'basic-workflow';

const destPath =   join('.github', 'workflows');
export function getExamplePathDest(workflowExample: GhWorkflowExamples): string {
  const fileName = GhWorkflowExampleMap[workflowExample];
  if(!fileName) {
    throw new Error(`workflowExample ${workflowExample} is not registered`);
  }
  return join(destPath, fileName);
}

export const workflowIsNotCreated = (cfg?: RcJson) => Promise.resolve(cfg ? readFile(getExamplePathDest(exampleName)) === '' : false);

export async function generateGhWorkflowFile(cliCfg: RcJson): Promise<RcJson> {
  const tplFileName = GhWorkflowExampleMap[exampleName];
  const exampleSourceLocation = join(__dirname, '..', 'static', tplFileName);
  const exampleDestination = getExamplePathDest(exampleName as any);

  if (readFile(exampleDestination) !== '') {
    logVerbose(`User flow ${exampleName} already generated under ${exampleDestination}.`);
    return Promise.resolve(cliCfg);
  }

  const fileContent = readFile(exampleSourceLocation, { fail: true }).toString();
  if(!existsSync(destPath)) {
    mkdirSync(destPath, {recursive: true});
    logVerbose(`setup workflow folder ${destPath}`);
  }

  writeFile(exampleDestination, fileContent);

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

