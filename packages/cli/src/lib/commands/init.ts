import { YargsCommandObject } from '../internal/yargs/model';
import { log, logVerbose } from '../core/loggin/index';
import { readRcConfig, updateRepoConfig } from '../internal/config/config';
import { UserFlowRcConfig } from '../types/model';
import { ensureCfgPath, ensureOutPath, ensureUrl, ensureUfPath } from '../internal/config/setup';
import yargs from 'yargs';
import { param } from './collect/options/open';
import { get as getRcPath } from '../core/options/rc';

export const initCommand: YargsCommandObject = {
  command: 'init',
  description: 'Setup .user-flowrc.json',
  builder: (y) => y.option(param),
  module: {
    handler: async (argv: any) => {
      logVerbose(`run "init" as a yargs command`);
      const cfg = await run();
      log('user-flow CLI is set up now! 🎉')
      logVerbose(cfg);
    }
  }
};

export async function run(): Promise<UserFlowRcConfig> {
  const rcPath = getRcPath();
  const repoConfig = readRcConfig(rcPath);
  // const isFirstRun = Object.keys(repoConfig).length <= 0;

  const config = {
    ...repoConfig,
    ...(await ensureUrl(repoConfig)
        .then(ensureUfPath)
        .then(ensureOutPath)
      // defaults should be last as it takes user settings
    )
  };

  updateRepoConfig(config, rcPath);

  return config;
}
