import { YargsCommandObject } from '../../internal/yargs/model';
import { collectFlow, persistFlow, loadFlow } from '../../internal/utils/user-flow';
import { USER_FLOW_RESULT_DIR } from '../../internal/config/constants';
import { logVerbose } from '../../core/loggin/index';
import { get as interactive } from '../../core/options/interactive';
import { get as dryRun } from '../../core/options/dryRun';
import { get as openOpt } from './options/open';
import * as openFileInBrowser from 'open';
import { COLLECT_OPTIONS } from './options';
import { CollectOptions } from './model';
import { exec, ExecOptions } from 'child_process';
import { startServerIfNeeded } from './serve-build';


export const collectUserFlowsCommand: YargsCommandObject = {
  command: 'collect',
  description: 'Run a set of user flows and save the result',
  builder: (y) => y.options(COLLECT_OPTIONS).help(),
  module: {
    handler: async (argv: any) => {
      logVerbose(`run "collect" as a yargs command with args:`);
      logVerbose(argv);
      const { url, ufPath, outPath, openReport, isSinglePageApplication, startServerCommand, staticDistDir } = argv as CollectOptions;
      await run({ url, ufPath, outPath, openReport, isSinglePageApplication, startServerCommand, staticDistDir });
    }
  }
};


export async function run(cfg: CollectOptions): Promise<void> {

  let { url, ufPath, outPath, startServerCommand } = cfg;
  outPath = outPath || USER_FLOW_RESULT_DIR;

  // Check if url is given
  if (!url) {
    throw new Error('URL is required. Either through the console as `--url` or in the `.user-flow.json`');
  }

  // Check if path to user-flows is given
  if (!ufPath) {
    throw new Error('Path to user flows is required. Either through the console as `--ufPath` or in the `.user-flowrc.json`');
  }

  // Serve build folder
  const closeServer = startServerIfNeeded(cfg);
  // Load and run user-flows in parallel
  const userFlows = loadFlow(ufPath);
  await sequeltial(userFlows.map(({ exports: provider, path }) =>
    (_: any) => collectFlow({ url }, { ...provider, path})
      .then((flow) => !dryRun() ? persistFlow(flow, provider.flowOptions.name, { outPath }) : '')
      .then((fileName) => {
        // open report if requested and not in executed in CI
        if (!dryRun() && openOpt() && interactive()) {
          openFileInBrowser(fileName, { wait: false });
        }
      })
  ));

  await closeServer();
}

async function sequeltial(set: Array<(res: any) => Promise<any>>) {
  let res = undefined;
  for (let i = 0; i < set.length; i++) {
    res = await set[i](res);
  }
}
