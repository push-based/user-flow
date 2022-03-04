import { YargsCommandObject } from '../internal/yargs/model';
import { logVerbose } from '../internal/yargs/utils';
import { readRepoConfig, updateRepoConfig } from '../internal/config/config';
import { UserFlowCliConfig } from '@user-flow/cli';
import { ensureCfgPath, ensureOutPath, ensureTargetUrl, ensureUfPath } from '../internal/config/setup';

export const initCommand: YargsCommandObject = {
  command: 'init',
  description: 'Setup .user-flowrc.json',
  module: {
    handler: async (argv: any) => {
      logVerbose(`run "init" as a yargs command`);
      await run();
    }
  }
};

export async function run(): Promise<UserFlowCliConfig> {
  const cfgPath = await ensureCfgPath();
  const repoConfig = readRepoConfig(cfgPath);
  // const isFirstRun = Object.keys(repoConfig).length <= 0;

  const config = {
    ...repoConfig,
    ...(await ensureOutPath(repoConfig)
       // .then(ensureUfPath)
      //  .then(ensureTargetUrl)
      // defaults should be last as it takes user settings
    )
  };

  updateRepoConfig(config, cfgPath);

  return config;
}
