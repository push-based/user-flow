import { InitOptions } from './options.js';
import { log, logVerbose } from '../../core/loggin/index.js';
import { run } from '../../core/processing/behaviors.js';
import { collectRcJson } from './processes/collect-rc-json.js';
import { getGlobalOptionsFromArgv } from '../../global/utils.js';
import { getInitCommandOptionsFromArgv } from './utils.js';
import { updateRcJson } from './processes/update-rc-json.js';
import { handleFlowGeneration } from './processes/generate-userflow.js';
import { handleGhWorkflowGeneration } from './processes/generate-workflow.js';
import { SETUP_CONFIRM_MESSAGE } from './constants.js';

export async function runInitCommand(argv: InitOptions): Promise<void> {
  const { interactive } = getGlobalOptionsFromArgv(argv);
  const { generateFlow, generateGhWorkflow, lhr, ...cfg } = getInitCommandOptionsFromArgv(argv);
  logVerbose('Init options: ', { interactive, generateFlow, generateGhWorkflow, lhr, ...cfg });

  await run([
    collectRcJson,
    updateRcJson,
    handleFlowGeneration({ interactive: !!interactive, generateFlow }),
    handleGhWorkflowGeneration({ generateGhWorkflow }),
  ])(cfg);
  log(SETUP_CONFIRM_MESSAGE);
  // @TODO move to constants
  log('To execute a user flow run `npx user-flow` or `npx user-flow collect`');
}
