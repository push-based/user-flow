import { YargsCommandObject } from '../internal/yargs/model';
import { getCliParam } from '../internal/yargs/utils';
import { captureUserFlow, loadUserFlows } from '../internal/utils/user-flow';
import { readRepoConfig } from '../internal/config/config';
import { UserFlowCliConfig } from '@user-flow/cli';

export const captureUserFlowsCommand: YargsCommandObject = {
  command: 'capture',
  description: 'Run a set of user flows and save the result',
  module: {
    handler: async (argv: any) => {
      if (argv.verbose) {
        console.info(`run "capture" as a yargs command`);
      }
      const cfg: UserFlowCliConfig = readRepoConfig();
      await run(cfg);
    }
  }
};

export async function run(cfg: UserFlowCliConfig): Promise<void> {
  const {ufPath, targetUrl} = cfg;

  // Check if targetUrl is given
  const _targetUrl: string | false = targetUrl || getCliParam(['targetUrl', 't']);
  if (_targetUrl == false) {
    throw new Error('Target URL is required. Either through the console as `--targetUrl` or in the `user-flow.config.json`');
  }

  // Check if path to user-flows is given
  const _ufPath: string | false = ufPath || getCliParam(['ufPath', 'f']);
  if (_ufPath == false) {
    throw new Error('Path to user flows is required. Either through the console as `--ufPath` or in the `user-flow.config.json`');
  }

  // Load and run user-flows in parallel
  const userFlows = loadUserFlows(ufPath);
  await Promise.all(userFlows.map(({ interactions, flowOptions, launchOptions }) => {
    captureUserFlow(targetUrl, flowOptions, interactions, launchOptions).catch(console.error);
  }));
}
