import { YargsCommandObject } from '../../core/utils/yargs/types';
import { log, logVerbose } from '../../core/utils/loggin';
import { updateRcConfig } from '../../core/rc-json';
import { RcJson } from '../../types';
import { get as getRcPath } from '../../core/options/rc';
import { INIT_OPTIONS } from './options';
import { setupUrl } from '../collect/options/url.setup';
import { setupUfPath } from '../collect/options/ufPath.setup';
import { setupOutPath } from '../collect/options/outPath.setup';
import { setupFormat } from '../collect/options/format.setup';
import { getCLIConfigFromArgv } from '../../core/utils/yargs';
import { addUserFlow } from './utils';

export const initCommand: YargsCommandObject = {
  command: 'init',
  description: 'Setup .user-flowrc.json',
  builder: (y) => y.options(INIT_OPTIONS),
  module: {
    handler: async (argv: any) => {
      logVerbose(`run "init" as a yargs command`);
      const cfg = await run(argv);

      addUserFlow('basic-navigation', cfg.collect.ufPath);
    }
  }
};

export async function run(argv: Partial<RcJson>): Promise<RcJson> {
  const cliCfg = getCLIConfigFromArgv(argv);

  const config = {
    ...cliCfg,
    ...(await setupUrl(cliCfg)
        .then(setupUfPath)
        .then(setupFormat)
        .then(setupOutPath)
      // static defaults should be last as it takes user settings
    )
  };

  const rcPath = getRcPath();
  updateRcConfig(config, rcPath);

  log('user-flow CLI is set up now! 🎉');
  logVerbose(config);

  return config;
}
