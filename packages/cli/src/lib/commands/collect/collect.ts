import { YargsCommandObject } from '../../internal/yargs/model';
import { collectFlow, persistFlow, loadFlow } from '../../internal/utils/user-flow';
import { readRcConfig } from '../../internal/config/config';
import { UserFlowRcConfig } from '@user-flow/cli';
import { USER_FLOW_RESULT_DIR } from '../../internal/config/constants';
import { logVerbose } from '../../core/loggin/index';
import { get as interactive } from '../../core/options/interactive';
import { get as dryRun } from '../../core/options/dryRun';
import { get as open } from './options/open';
import * as openFileInBrowser from 'open';
import { COLLECT_OPTIONS } from './options';

type CollectOptions = UserFlowRcConfig['collect'] & UserFlowRcConfig['persist'] & { openReport: boolean };
export const collectUserFlowsCommand: YargsCommandObject = {
  command: 'collect',
  description: 'Run a set of user flows and save the result',
  builder: (y) => y.options(COLLECT_OPTIONS).help(),
  module: {
    handler: async (argv: any) => {
      logVerbose(`run "collect" as a yargs command with args:`);
      logVerbose(argv);
      const { url, ufPath, outPath, open: openReport } = argv;
      await run({ url, ufPath, outPath, openReport });
    }
  }
};


export async function run(cfg: CollectOptions): Promise<void> {

  let { url, ufPath, outPath } = cfg;
  outPath = outPath || USER_FLOW_RESULT_DIR;

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
  await sequeltial(userFlows.map((provider) =>
    (_: any) => collectFlow({ url, ufPath }, provider)
      .then((flow) => !dryRun() ? persistFlow(flow, provider.flowOptions.name, { outPath }) : '')
      .then((fileName) => {
        // open report if requested and not in executed in CI
        if (!dryRun() && open() && interactive()) {
          openFileInBrowser(fileName, { wait: false });
        }
      })
  ));
}

async function sequeltial(set: Array<(res: any) => Promise<any>>) {
  let res = undefined;
  for (let i = 0; i < set.length; i++) {
    res = await set[i](res);
  }
}
