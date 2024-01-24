import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { mkdirSync, readdirSync } from 'node:fs';

import { RcJson } from '../../../types.js';
import { readFile, writeFile } from '../../../core/file/index.js';
import { log } from '../../../core/loggin/index.js';
import { FlowExampleMap } from '../constants.js';
import { FlowExamples } from '../types.js';
import { ifThenElse } from '../../../core/processing/behaviors.js';
import { promptTo } from '../../../core/prompt.js';
import { CLIProcess } from '../../../core/processing/types.js';
import { logVerbose } from '../../../core/loggin/index.js';
import { PROMPT_INIT_GENERATE_FLOW } from '../constants/generateFlow.constants.js';

const exampleName = 'basic-navigation';

export function getExamplePathDest(flowExample: FlowExamples, folder: string): string {
  const fileName = FlowExampleMap[flowExample];
  return join(folder, fileName);
}

export const userflowIsNotCreated = (cfg?: RcJson) => Promise.resolve(cfg ? readFile(getExamplePathDest(exampleName, cfg.collect.ufPath)) === '' : false);

export async function generateUserFlow(cliCfg: RcJson): Promise<RcJson> {
  const ufPath = cliCfg.collect.ufPath;
  try {
    readdirSync(ufPath);
  } catch (e) {
    mkdirSync(ufPath, { recursive: true });
  }
  const tplFileName = FlowExampleMap[exampleName];
  const exampleSourceLocation = join(dirname(fileURLToPath(import.meta.url)),'..', 'static', tplFileName);
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

export function handleFlowGeneration({ generateFlow, interactive }: {interactive: boolean, generateFlow?: boolean}): CLIProcess {
  return ifThenElse(
    () => interactive && generateFlow === undefined,
    promptTo(PROMPT_INIT_GENERATE_FLOW, generateUserFlow, { precondition: userflowIsNotCreated }),
    ifThenElse(() => Boolean(generateFlow), generateUserFlow)
  )
}

