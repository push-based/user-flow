import { RcJson } from '../../../types';
import { join } from 'node:path';
import { readFile, writeFile } from '../../../core/file';
import { log, logVerbose } from '../../../core/loggin';
import { mkdirSync, readdirSync } from 'node:fs';
import { FlowExampleMap } from '../constants';
import { FlowExamples } from '../types';
import { ifThenElse } from '../../../core/processing/behaviors';
import { CLIProcess } from '../../../core/processing/types';
import { PROMPT_INIT_GENERATE_FLOW } from '../options/generateFlow.constants';
import { confirmToProcess } from '../../../core/prompt/confirm-to-process';

const exampleName = 'basic-navigation';

export function getExamplePathDest(flowExample: FlowExamples, folder: string): string {
  const fileName = FlowExampleMap[flowExample];
  return join(folder, fileName);
}

export const userflowIsNotCreated = (cfg: RcJson) => {
  return readFile(getExamplePathDest(exampleName, cfg.collect.ufPath)) === '';
};

async function generateUserFlow(cliCfg: RcJson): Promise<RcJson> {
  const ufPath = cliCfg.collect.ufPath;
  // DX create directory if it does ot exist
  try {
    readdirSync(ufPath);
  } catch (e) {
    mkdirSync(ufPath, { recursive: true });
  }
  const tplFileName = FlowExampleMap[exampleName];
  const exampleSourceLocation = join(__dirname,'..', 'static', tplFileName);
  const exampleDestination = join(ufPath, tplFileName);

  if (readFile(exampleDestination) !== '') {
    logVerbose(`User flow ${exampleName} already generated under ${exampleDestination}.`);
    return Promise.resolve(cliCfg);
  }

  const fileContent = readFile(exampleSourceLocation, { fail: true }).toString();
  writeFile(exampleDestination, fileContent);

  log(`setup user-flow for basic navigation in ${ufPath} successfully`);
  return Promise.resolve(cliCfg);
}

const interactiveAndGenerateFlowNotPassed = (interactive: boolean, generateFlow?: boolean) => {
  return () => interactive && generateFlow === undefined;
}

export function handleFlowGeneration({ generateFlow, interactive }: {interactive: boolean, generateFlow?: boolean}): CLIProcess {
  return ifThenElse(
    interactiveAndGenerateFlowNotPassed(interactive, generateFlow),
    confirmToProcess({
      prompt: PROMPT_INIT_GENERATE_FLOW,
      process: generateUserFlow,
      precondition: userflowIsNotCreated
    }),
    // else `withFlow` is used and true
    ifThenElse(() => !!generateFlow,
      // generate the file => else do nothing
      generateUserFlow)
  )
}

