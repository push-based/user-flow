import { RcJson } from '../../../types';
import { join } from 'path';
import { FileSystemManager } from '../../../core/file';
import { log, logVerbose } from '../../../core/loggin';
import { FlowExampleMap } from '../constants';
import { FlowExamples } from '../types';
import { ifThenElse } from '../../../core/processing/behaviors';
import { askToSkip } from '../../../core/prompt';
import { CLIProcess } from '../../../core/processing/types';
import { PROMPT_INIT_GENERATE_FLOW } from '../options/generateFlow.constants';

const exampleName = 'basic-navigation';

export function getExamplePathDest(flowExample: FlowExamples, folder: string): string {
  const fileName = FlowExampleMap[flowExample];
  return join(folder, fileName);
}

export const userflowIsNotCreated = (fSM: FileSystemManager) => {
  return (cfg: RcJson): Promise<boolean> => {
    const path = getExamplePathDest(exampleName, cfg.collect.ufPath);
    return Promise.resolve(!fSM.existSync(path));
  }
};

export const generateUserFlow = (fSM: FileSystemManager): CLIProcess => {
  return (cfg: RcJson): Promise<RcJson> => {
    const ufPath = cfg.collect.ufPath;
    // DX create directory if it does ot exist
    try {
      fSM.readdirSync(ufPath);
    } catch (e) {
      fSM.mkdirSync(ufPath, { recursive: true });
    }
    const tplFileName = FlowExampleMap[exampleName];
    const exampleSourceLocation = join(__dirname, '..', 'static', tplFileName);
    const exampleDestination = join(ufPath, tplFileName);

    if (fSM.readFile(exampleDestination) !== '') {
      logVerbose(`User flow ${exampleName} already generated under ${exampleDestination}.`);
      return Promise.resolve(cfg);
    }
    const fileContent = fSM.readFile(exampleSourceLocation, { fail: true }).toString();
    fSM.writeFile(exampleDestination, fileContent);

    log(`setup user-flow for basic navigation in ${ufPath} successfully`);
    return Promise.resolve(cfg);
  }
};

export function handleFlowGeneration(
  { generateFlow, interactive }: {interactive: boolean, generateFlow?: boolean},
  fSM: FileSystemManager
): CLIProcess {
  return ifThenElse(
    // if `withFlow` is not used in the CLI is in interactive mode
    () => interactive && generateFlow === undefined,
    // Prompt for flow generation
    askToSkip(PROMPT_INIT_GENERATE_FLOW, generateUserFlow(fSM),
      // if the flow is not created already, otherwise skip creation
      { precondition: userflowIsNotCreated(fSM) }),
    // else `withFlow` is used and true
    ifThenElse(() => !!generateFlow,
      // generate the file => else do nothing
      generateUserFlow(fSM))
  )
}

