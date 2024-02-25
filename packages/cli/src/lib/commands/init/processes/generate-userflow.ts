import { join } from 'node:path';
import { mkdirSync, readdirSync } from 'node:fs';
import { RcJson } from '../../../types';
import { readFile, writeFile } from '../../../core/file';
import { log, logVerbose } from '../../../core/loggin';
import { FlowExampleMap, PROMPT_INIT_GENERATE_FLOW } from '../constants';
import { ifThenElse } from '../../../core/processing/behaviors';
import { askToSkip } from '../../../core/prompt';
import { CLIProcess } from '../../../core/processing/types';

const exampleName = 'basic-navigation';

export function getExamplePathDest(folder: string): string {
  const fileName = FlowExampleMap[exampleName];
  return join(folder, fileName);
}

export const userflowIsNotCreated = (cfg?: RcJson) => Promise.resolve(cfg ? readFile(getExamplePathDest(cfg.collect.ufPath)) === '' : false);

export async function generateUserFlow(cliCfg: RcJson): Promise<RcJson> {
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

export function handleFlowGeneration({ generateFlow, interactive }: {interactive: boolean, generateFlow?: boolean}): CLIProcess {
  return ifThenElse(
    // if `withFlow` is not used in the CLI is in interactive mode
    () => interactive == true && generateFlow === undefined,
    // Prompt for flow generation
    askToSkip(PROMPT_INIT_GENERATE_FLOW, generateUserFlow,
      // if the flow is not created already, otherwise skip creation
      { precondition: userflowIsNotCreated }),
    // else `withFlow` is used and true
    ifThenElse(() => !!generateFlow,
      // generate the file => else do nothing
      generateUserFlow)
  )
}

