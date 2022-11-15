import { YargsCommandObject } from '../../core/yargs/types';
import { log, logVerbose } from '../../core/loggin';
import { INIT_OPTIONS } from './options';
import { addUserFlow, getExamplePathDest } from './utils';
import { setupOrUpdateRcJson } from './processes/setup-or-update-rc-json';
import { askToSkip } from '../../core/prompt';
import { run } from '../../core/processing/behaviors';
import { readFile } from '../../core/file';
import { SETUP_CONFIRM_MESSAGE } from './constants';
import { getCLIConfigFromArgv } from '../../global/rc-json';
import { RcArgvOptions, RcJson } from '../../global/rc-json/types';

export const initCommand: YargsCommandObject = {
  command: 'init',
  description: 'Setup .user-flowrc.json',
  builder: (y) => y.options(INIT_OPTIONS),
  module: {
    handler: async (argv: any) => {
      logVerbose(`run "init" as a yargs command`);
      const rcCfg = getCLIConfigFromArgv(argv as RcArgvOptions);
      logVerbose('Init options: ', rcCfg);
      const exampleName = 'basic-navigation';
      const userflowIsNotCreated = (cfg?: RcJson) => Promise.resolve(cfg ? readFile(getExamplePathDest(exampleName, cfg.collect.ufPath)) === '' : false);

      await run([
        setupOrUpdateRcJson,
        askToSkip(
          'Setup user flow',
          async (cfg: RcJson): Promise<RcJson> => {
            addUserFlow(exampleName, cfg.collect.ufPath);
            return Promise.resolve(cfg);
          },
          {
            precondition: userflowIsNotCreated
          })
      ])(rcCfg);
      log(SETUP_CONFIRM_MESSAGE);
      // @TODO move to constants
      log('To execute a user flow run `npx user-flow` or `npx user-flow collect`');
    }
  }
};

