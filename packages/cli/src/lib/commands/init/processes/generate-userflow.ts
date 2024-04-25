import { join } from 'node:path';
import { mkdirSync, readdirSync } from 'node:fs';
import { RcJson } from '../../../types.js';
import { readFile, writeFile } from '../../../core/file/index.js';
import { log, logVerbose } from '../../../core/loggin/index.js';
import { FlowExampleMap, PROMPT_INIT_GENERATE_FLOW } from '../constants.js';
import { ifThenElse } from '../../../core/processing/behaviors.js';
import { CLIProcess } from '../../../core/processing/types.js';
import { confirmToProcess } from '../../../core/prompt/confirm-to-process.js';

const exampleName = 'basic-navigation';

export function getExamplePathDest(folder: string): string {
  const fileName = FlowExampleMap[exampleName];
  return join(folder, fileName);
}

export const userflowIsNotCreated = (cfg: RcJson) => {
  return readFile(getExamplePathDest(cfg.collect.ufPath)) === '';
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

