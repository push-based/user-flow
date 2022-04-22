import { YargsCommandObject } from '../../core/utils/yargs/types';
import { log, logVerbose } from '../../core/utils/loggin';
import { updateRcConfig } from '../../core/rc-json';
import { RcJson } from '../../types';
import { ensureOutPath, ensureUrl, ensureUfPath, ensureFormat } from '../setup/index';
import { get as getRcPath } from '../../core/options/rc';
import { CollectOptions, PersistOptions } from '../../core/rc-json/types';
import { INIT_OPTIONS } from './options';

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
  //console.log('run init', cliCfg)
  const config = {
    ...cliCfg,
    ...(await ensureUrl(cliCfg)
        .then(ensureUfPath)
        .then(ensureFormat)
        .then(ensureOutPath)
      // defaults should be last as it takes user settings
    )
  };

  const rcPath = getRcPath();
  updateRcConfig(config, rcPath);

  return config;
}
