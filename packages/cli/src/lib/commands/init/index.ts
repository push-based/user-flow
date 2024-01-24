import { ArgumentsCamelCase, Argv, CommandModule } from 'yargs';

import { INIT_OPTIONS, InitOptions } from './options/index.js';
import { logVerbose } from '../../core/loggin/index.js';
import { GlobalCliOptions } from '../../global/options/index.js';
import { getCfgFromInitArgv } from './utils.js';
import { run, tap } from '../../core/processing/behaviors.js';
import { handleFlowGeneration } from './processes/generate-userflow.js';
import { handleGhWorkflowGeneration } from './processes/generate-workflow.js';
import { handleRcGeneration } from './processes/generate-rc-config.js';

export const initCommand: CommandModule<GlobalCliOptions, GlobalCliOptions & InitOptions> = {
  command: 'init',
  describe: 'Setup user-flows',
  builder: (argv: Argv<GlobalCliOptions>) => argv.options(INIT_OPTIONS),
  handler: async (argv: ArgumentsCamelCase<GlobalCliOptions & InitOptions>) => {
    await run([
      tap(() => logVerbose(`run "init" as a yargs command`)),
      handleRcGeneration(argv.rcPath),
      handleFlowGeneration({ interactive: argv.interactive, generateFlow: argv.generateFlow }),
      handleGhWorkflowGeneration({ generateGhWorkflow: argv.generateGhWorkflow }),
    ])(getCfgFromInitArgv(argv));
  }
};

