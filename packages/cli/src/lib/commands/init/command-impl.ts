import { RcJsonAsArgv } from '../../types';

import { log, logVerbose } from '../../core/loggin';
import { run } from '../../core/processing/behaviors';
import { collectRcJson } from './processes/collect-rc-json';
import { getGlobalOptionsFromArgv } from '../../global/utils';
import { getInitCommandOptionsFromArgv } from './utils';
import { updateRcJson } from './processes/update-rc-json';
import { handleFlowGeneration } from './processes/generate-userflow';
import { handleGhWorkflowGeneration } from './processes/generate-workflow';
import { handleBudgetsGeneration } from './processes/generate-lh-budgets';
import { SETUP_CONFIRM_MESSAGE } from './constants';
import { InitOptions } from './options';

export async function runInitCommand(argv: InitOptions): Promise<void> {
  const { interactive } = getGlobalOptionsFromArgv(argv);
  const { generateFlow, generateGhWorkflow, generateBudgets, lhr, ...cfg } = getInitCommandOptionsFromArgv(argv);
  logVerbose('Init options: ', { interactive, generateFlow, generateGhWorkflow, generateBudgets,lhr, ...cfg });

  await run([
    collectRcJson,
    updateRcJson,
    handleFlowGeneration({ interactive: !!interactive, generateFlow }),
    handleGhWorkflowGeneration({ generateGhWorkflow }),
    handleBudgetsGeneration({ generateBudgets, lhr }),
  ])(cfg);
  log(SETUP_CONFIRM_MESSAGE);
  // @TODO move to constants
  log('To execute a user flow run `npx user-flow` or `npx user-flow collect`');
}
