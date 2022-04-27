import { YargsCommandObject } from '../../core/utils/yargs/types';
import { log, logVerbose } from '../../core/utils/loggin';
import { updateRcConfig } from '../../core/rc-json';
import { RcJson } from '../../types';
import { get as getRcPath } from '../../core/options/rc';
import { CollectOptions, PersistOptions } from '../../core/rc-json/types';
import { INIT_OPTIONS } from './options';
import { setupUrl } from '../collect/options/url.setup';
import { setupUfPath } from '../collect/options/ufPath.setup';
import { setupOutPath } from '../collect/options/outPath.setup';
import { setupFormat } from '../collect/options/format.setup';

export const initCommand: YargsCommandObject = {
  command: 'init',
  description: 'Setup .user-flowrc.json',
  builder: (y) => y.options(INIT_OPTIONS),
  module: {
    handler: async (argv: any) => {
      logVerbose(`run "init" as a yargs command`);
      const cfg = await run(argv);
      log('user-flow CLI is set up now! 🎉');
      logVerbose(cfg);
    }
  }
};

function getCLIConfigFromArgv(argv: Partial<RcJson>): RcJson {
  const { url, ufPath, serveCommand, awaitServeStdout, outPath, format, budgetPath, budgets } = (argv || {}) as any as (keyof CollectOptions & keyof PersistOptions);

  const cfg: RcJson = {
    collect: {
      url,
      ufPath,
      serveCommand,
      awaitServeStdout
    },
    persist: {
      outPath,
      format
    }
  };

  if (budgetPath || budgets) {
    cfg.assert = {
      budgetPath,
      budgets
    };
  }

  return cfg;
}

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

  return config;
}
