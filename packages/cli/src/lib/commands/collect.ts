import { YargsCommandObject } from '../internal/yargs/model';
import { logVerbose } from '../internal/yargs/utils';
import { collectFlow, persistFlow, loadFlow } from '../internal/utils/user-flow';
import { readRepoConfig } from '../internal/config/config';
import { UserFlowCliConfig } from '@user-flow/cli';
import { getOpen } from '../options';
import { getInteractive } from '../internal/yargs/options';
import * as open from 'open';

export const collectUserFlowsCommand: YargsCommandObject = {
  command: 'collect',
  description: 'Run a set of user flows and save the result',
  module: {
    handler: async (argv: any) => {
      logVerbose(`run "collect" as a yargs command with args:`);
      logVerbose(argv);
      const cfg: UserFlowCliConfig = readRepoConfig();
      const openReport: boolean = argv.open !== undefined ? argv.open : false;
      argv.url && (cfg.collect.url = argv.url);
      argv.ufPath && (cfg.collect.ufPath = argv.ufPath);
      argv.outPath && (cfg.persist.outPath = argv.outPath);
      await run(cfg, openReport);
    }
  }
};

export async function run(cfg: UserFlowCliConfig, openReport: boolean): Promise<void> {

  const { collect, persist } = cfg;
  const { url, ufPath } = collect;
  let { outPath } = persist;
  outPath = outPath || './';

  // Check if url is given
  if (!url) {
    throw new Error('URL is required. Either through the console as `--url` or in the `user-flow.config.json`');
  }

  // Check if path to user-flows is given
  if (!ufPath) {
    throw new Error('Path to user flows is required. Either through the console as `--ufPath` or in the `user-flow.config.json`');
  }

  // Load and run user-flows in parallel
  const userFlows = loadFlow(ufPath);
  await Promise.all(userFlows.map((provider) =>
    collectFlow(collect, provider)
      .then((flow) => persistFlow(flow, provider.flowOptions.name, persist))
      .then((fileName) => {
        // open report if requested and not in executed in CI
        if (openReport && getInteractive()) {
          open(fileName, { wait: false });
        }
      })
  ));
}
