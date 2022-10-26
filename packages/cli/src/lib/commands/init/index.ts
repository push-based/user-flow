import { YargsCommandObject } from '../../core/utils/yargs/types';
import { log, logVerbose } from '../../core/utils/loggin';
import { RcArgvOptions, RcJson } from '../../types';
import { INIT_OPTIONS } from './options';
import { getCLIConfigFromArgv } from '../../core/utils/yargs';
import { addUserFlow, getExamplePathDest } from './utils';
import { setupRcJson } from './processes/setup-rc-json';
import { askToSkip } from '../../core/utils/prompt';
import { run } from '../../core/utils/processing/behaviors';
import { readFile } from '../../core/utils/file/file';
import { SETUP_CONFIRM_MESSAGE } from './constants';

export const initCommand: YargsCommandObject = {
  command: 'init',
  description: 'Setup .user-flowrc.json',
  builder: (y) => y.options(INIT_OPTIONS),
  module: {
    handler: async (argv: any) => {
      logVerbose(`run "init" as a yargs command`);

      const potentialExistingCfg = getCLIConfigFromArgv(argv as RcArgvOptions);

      const exampleName = 'basic-navigation';
      const userflowIsNotCreated = (cfg?: RcJson) => Promise.resolve(cfg ? readFile(getExamplePathDest(exampleName, cfg.collect.ufPath)) === '' : false);

      await run([
        setupRcJson,
        askToSkip(
          'Setup user flow',
          async (cfg: RcJson): Promise<RcJson> => {
            addUserFlow(exampleName, cfg.collect.ufPath);
            return Promise.resolve(cfg);
          },
          {
            precondition: userflowIsNotCreated
          })
      ])(potentialExistingCfg);
      log(SETUP_CONFIRM_MESSAGE);
      // @TODO move to constants
      log('To execute a user flow run `npx user-flow` or `npx user-flow collect`');
    }
  }
};

