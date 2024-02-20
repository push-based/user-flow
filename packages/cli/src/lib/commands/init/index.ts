import { YargsCommandObject } from '../../core/yargs/types';
import { log, logVerbose } from '../../core/loggin';
import { INIT_OPTIONS } from './options';
import { getInitCommandOptionsFromArgv } from './utils';
import { collectRcJson } from './processes/collect-rc-json';
import { run } from '../../core/processing/behaviors';
import { SETUP_CONFIRM_MESSAGE } from './constants';
import { updateRcJson } from './processes/update-rc-json';
import { handleFlowGeneration } from './processes/generate-userflow';
import { getGlobalOptionsFromArgv } from '../../global/utils';
import { handleGhWorkflowGeneration } from './processes/generate-workflow';
import { handleBudgetsGeneration } from './processes/generate-lh-budgets';
import {runInitCommand} from "./command-impl";

export const initCommand: YargsCommandObject = {
  command: 'init',
  description: 'Setup .user-flowrc.json',
  builder: (y) => y.options(INIT_OPTIONS),
  module: {
    handler: async (argv: any) => {
      logVerbose(`run "init" as a yargs command`);
      await runInitCommand(argv);
    }
  }
};

