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
import { ifThenElse } from '../../../../../../dist/packages/cli/src/lib/core/processing/behaviors';
import { getGlobalOptionsFromArgv } from '../../../../../../dist/packages/cli/src/lib';

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
          () => interactive == true && withFlow === undefined,
          askToSkip('Setup user flow', generateUserFlow, { precondition: userflowIsNotCreated }),
          ifThenElse(() => withFlow, generateUserFlow, async (_) => _)
        )
      ])(cfg);
      log(SETUP_CONFIRM_MESSAGE);
      // @TODO move to constants
      log('To execute a user flow run `npx user-flow` or `npx user-flow collect`');
    }
  }
};

