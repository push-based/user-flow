import { YargsCommandObject } from '../../core/yargs/types.js';
import { log, logVerbose } from '../../core/loggin/index.js';
import { INIT_OPTIONS } from './options/index.js';
import { getInitCommandOptionsFromArgv } from './utils.js';
import { collectRcJson } from './processes/collect-rc-json.js';
import { run } from '../../core/processing/behaviors.js';
import { SETUP_CONFIRM_MESSAGE } from './constants.js';
import { updateRcJson } from './processes/update-rc-json.js';
import { handleFlowGeneration } from './processes/generate-userflow.js';
import { getGlobalOptionsFromArgv } from '../../global/utils.js';
import { handleGhWorkflowGeneration } from './processes/generate-workflow.js';
import { handleBudgetsGeneration } from './processes/generate-lh-budgets.js';

export const initCommand: YargsCommandObject = {
  command: 'init',
  description: 'Setup .user-flowrc.json',
  builder: (y) => y.options(INIT_OPTIONS),
  module: {
    handler: async (argv: any) => {
      logVerbose(`run "init" as a yargs command`);
      const { interactive } = getGlobalOptionsFromArgv(argv);
      const { generateFlow, generateGhWorkflow, generateBudgets, lhr, ...cfg } = getInitCommandOptionsFromArgv(argv);
      logVerbose('Init options: ', { interactive, generateFlow, generateGhWorkflow, generateBudgets,lhr, ...cfg });

      await run([
        collectRcJson,
        updateRcJson,
        handleFlowGeneration({ interactive: !!interactive, generateFlow }),
        handleGhWorkflowGeneration({ generateGhWorkflow }),
        handleBudgetsGeneration({ generateBudgets, lhr }),
      ])(cfg );
      log(SETUP_CONFIRM_MESSAGE);
      // @TODO move to constants
      log('To execute a user flow run `npx user-flow` or `npx user-flow collect`');
    }
  }
};

