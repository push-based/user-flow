import { YargsCommandObject } from '../internal/yargs/model';
import { log, logVerbose } from '../internal/yargs/utils';
import { readRepoConfig, updateRepoConfig } from '../internal/config/config';
import { UserFlowCliConfig } from '@user-flow/cli';
import { ensureCfgPath, ensureOutPath, ensureUrl, ensureUfPath } from '../internal/config/setup';

export const initCommand: YargsCommandObject = {
  command: 'init',
  description: 'Setup .user-flowrc.json',
  module: {
    handler: async (argv: any) => {
      logVerbose(`run "init" as a yargs command`);
      const cfg = await run();
      log('user-flow CLI is set up now! 🎉')
      logVerbose(cfg);
    }
  }
};

export async function run(): Promise<UserFlowCliConfig> {
  const cfgPath = await ensureCfgPath();
  const repoConfig = readRepoConfig(cfgPath);
  // const isFirstRun = Object.keys(repoConfig).length <= 0;

  const config = {
    ...repoConfig,
    ...(await ensureUrl(repoConfig)
        .then(ensureUfPath)
        .then(ensureOutPath)
      // defaults should be last as it takes user settings
    )
  };

  updateRepoConfig(config, cfgPath);

  return config;
}
