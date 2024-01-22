import { ArgumentsCamelCase, Argv, CommandModule } from 'yargs';

import { INIT_OPTIONS, InitOptions } from './options/index.js';
import { logVerbose } from '../../core/loggin/index.js';
import { GlobalCliOptions } from '../../global/options/index.js';
import { getInitCommandOptionsFromArgv } from './utils.js';
import { collectRcJson } from './processes/collect-rc-json.js';
import {run} from "../../core/processing/behaviors.js";
import { updateRcJson } from './processes/update-rc-json.js';
import { handleFlowGeneration } from './processes/generate-userflow.js';
import { handleGhWorkflowGeneration } from './processes/generate-workflow.js';
import { handleBudgetsGeneration } from './processes/generate-lh-budgets.js';

type InitCommandOptions = GlobalCliOptions & InitOptions;

// @TODO move collectedRcJson and updatedRcJson into run array

async function runInit(argv: ArgumentsCamelCase<InitCommandOptions>): Promise<void> {
  // @TODO fix type verbose
  logVerbose(`run "init" as a yargs command`);
  const { generateFlow, generateGhWorkflow, generateBudgets, lhr, ...cfg } = getInitCommandOptionsFromArgv(argv);
  //@TODO fix type verbose
  logVerbose('Init options: ', { generateFlow, generateGhWorkflow, generateBudgets,lhr, ...cfg });

  const collectedRcJson = await collectRcJson(cfg);
  //@TODO fix type rcPath
  const updatedRcJson = await updateRcJson(collectedRcJson, argv.rcPath!);
  await run([
    //@TODO fix type interactive
    handleFlowGeneration({ interactive: argv.interactive!, generateFlow }),
    handleGhWorkflowGeneration({ generateGhWorkflow }),
    handleBudgetsGeneration({ generateBudgets, lhr }),
  ])(updatedRcJson);
}

export const initCommand: CommandModule<GlobalCliOptions, InitCommandOptions> = {
  command: 'init',
  describe: 'Setup .user-flowrc.json',
  builder: (argv: Argv<GlobalCliOptions>) => argv.options(INIT_OPTIONS),
  handler: runInit
};

