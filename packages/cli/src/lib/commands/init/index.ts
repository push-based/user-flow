import { YargsCommandObject } from '../../core/yargs/types';
import { log, logVerbose } from '../../core/loggin';
import { INIT_OPTIONS } from './options';
import { getExamplePathDest, getInitCommandOptionsFromArgv } from './utils';
import { collectRcJson } from './processes/collect-rc-json';
import { askToSkip } from '../../core/prompt';
import { run } from '../../core/processing/behaviors';
import { readFile } from '../../core/file';
import { SETUP_CONFIRM_MESSAGE } from './constants';
import { RcJson } from '../../types';
import { updateRcJson } from './processes/update-rc-json';
import { generateUserFlow, userflowIsNotCreated } from './processes/generate-userflow';

export const initCommand: YargsCommandObject = {
  command: 'init',
  description: 'Setup .user-flowrc.json',
  builder: (y) => y.options(INIT_OPTIONS),
  module: {
    handler: async (argv: any) => {
      logVerbose(`run "init" as a yargs command`);
      const cfg = getInitCommandOptionsFromArgv(argv);
      logVerbose('Init options: ', cfg);

      await run([
        collectRcJson,
        updateRcJson,
        askToSkip(
          'Setup user flow',
          generateUserFlow,
          {
            precondition: userflowIsNotCreated
          })
      ])(cfg);
      log(SETUP_CONFIRM_MESSAGE);
      // @TODO move to constants
      log('To execute a user flow run `npx user-flow` or `npx user-flow collect`');
    }
  }
};

