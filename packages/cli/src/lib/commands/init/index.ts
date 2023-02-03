import { YargsCommandObject } from '../../core/yargs/types';
import { log, logVerbose } from '../../core/loggin';
import { INIT_OPTIONS } from './options';
import { getInitCommandOptionsFromArgv } from './utils';
import { collectRcJson } from './processes/collect-rc-json';
import { askToSkip } from '../../core/prompt';
import { run } from '../../core/processing/behaviors';
import { SETUP_CONFIRM_MESSAGE } from './constants';
import { updateRcJson } from './processes/update-rc-json';
import { generateUserFlow, userflowIsNotCreated } from './processes/generate-userflow';
import { ifThenElse } from '../../core/processing/behaviors';
import { getGlobalOptionsFromArgv } from '../../global/utils';

export const initCommand: YargsCommandObject = {
  command: 'init',
  description: 'Setup .user-flowrc.json',
  builder: (y) => y.options(INIT_OPTIONS),
  module: {
    handler: async (argv: any) => {
      logVerbose(`run "init" as a yargs command`);
      const { interactive } = getGlobalOptionsFromArgv(argv);
      const { withFlow, ...cfg } = getInitCommandOptionsFromArgv(argv);
      logVerbose('Init options: ', { withFlow, ...cfg });

      await run([
        collectRcJson,
        updateRcJson,
        ifThenElse(
          // if `withFlow` is not used ind the CLI is in interactive mode
          () => interactive == true && withFlow === undefined,
          // Prompt for flow generation
          askToSkip('Setup user flow', generateUserFlow,
            // if the flow is not created already
            { precondition: userflowIsNotCreated }),
          // else `withFlow` is used and true
          ifThenElse(() => withFlow,
            // generate the file else do nothing
            generateUserFlow)
        )
      ])(cfg);
      log(SETUP_CONFIRM_MESSAGE);
      // @TODO move to constants
      log('To execute a user flow run `npx user-flow` or `npx user-flow collect`');
    }
  }
};

