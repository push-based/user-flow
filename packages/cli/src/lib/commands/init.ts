import { YargsCommandObject } from '../internal/yargs/model';
import { log, logVerbose } from '../core/loggin/index';
import { updateRepoConfig } from '../internal/config/config';
import { UserFlowRcConfig } from '../types/model';
import { ensureOutPath, ensureUrl, ensureUfPath, ensureFormat } from '../internal/config/setup';
import { param } from './collect/options/open';
import { get as getRcPath } from '../core/options/rc';
import { CollectOptions, PersistOptions } from '../internal/config/model';

export const initCommand: YargsCommandObject = {
  command: 'init',
  description: 'Setup .user-flowrc.json',
  builder: (y) => y.option(param),
  module: {
    handler: async (argv: any) => {
      logVerbose(`run "init" as a yargs command`);
      const cfg = await run(argv);
      log('user-flow CLI is set up now! 🎉');
      logVerbose(cfg);
    }
  }
};

function getCLIConfigFromArgv(argv: Partial<UserFlowRcConfig>): UserFlowRcConfig {
  const { url, ufPath, serveCommand, awaitServeStdout, outPath, format} = (argv || {}) as any as (keyof CollectOptions & keyof PersistOptions);

  const cfg: UserFlowRcConfig = {
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

  return cfg;
}

export async function run(argv: Partial<UserFlowRcConfig>): Promise<UserFlowRcConfig> {
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
  console.log('ensured ', config);

  const rcPath = getRcPath();
  updateRepoConfig(config, rcPath);

  return config;
}
