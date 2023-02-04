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

export const initCommand: YargsCommandObject = {
  command: 'init',
  description: 'Setup .user-flowrc.json',
  builder: (y) => y.options(INIT_OPTIONS),
  module: {
    handler: async (argv: any) => {
      logVerbose(`run "init" as a yargs command`);
      const { interactive } = getGlobalOptionsFromArgv(argv);
      const { generateFlow, ...cfg } = getInitCommandOptionsFromArgv(argv);
      logVerbose('Init options: ', { interactive, generateFlow, ...cfg });

      await run([
        collectRcJson,
        updateRcJson,
        handleFlowGeneration({ interactive: !!interactive, generateFlow })
      ])(cfg );
      log(SETUP_CONFIRM_MESSAGE);
      // @TODO move to constants
      log('To execute a user flow run `npx user-flow` or `npx user-flow collect`');
    }
  }
};

