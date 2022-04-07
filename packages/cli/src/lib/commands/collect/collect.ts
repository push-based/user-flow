import { YargsCommandObject } from '../../internal/yargs/model';
import { collectFlow, persistFlow, loadFlow } from '../../internal/utils/user-flow';
import { USER_FLOW_RESULT_DIR } from '../../internal/config/constants';
import { logVerbose } from '../../core/loggin/index';
import { get as interactive } from '../../core/options/interactive';
import { get as dryRun } from '../../core/options/dryRun';
import { get as openOpt } from './options/open';
import * as openFileInBrowser from 'open';
import { COLLECT_OPTIONS } from './options';
import { CollectCommandOptions } from './model';
import { startServerIfNeeded } from './serve-command';
import { run as ensureConfig } from '../init';
import yargs from 'yargs';


export const collectUserFlowsCommand: YargsCommandObject = {
  command: 'collect',
  description: 'Run a set of user flows and save the result',
  builder: (y) => y.options(COLLECT_OPTIONS).help(),
  module: {
    handler: async (argv: any) => {
      logVerbose(`run "collect" as a yargs command with args:`);
      logVerbose(argv);

      // get validation and errors for RC & options configurations
      ensureConfig(yargs.argv as any);

      const { url, ufPath, outPath, openReport, serveCommand, awaitServeStdout } = argv as CollectCommandOptions;

      await startServerIfNeeded(() => run({ url, ufPath, outPath, openReport }), { serveCommand, awaitServeStdout })
    }
  }
};


export async function run(cfg: CollectCommandOptions): Promise<void> {

  let { url, ufPath, outPath } = cfg;


  // Load and run user-flows in parallel
  const userFlows = loadFlow(ufPath);

  await sequeltial(userFlows.map(({ exports: provider, path }) =>
    (_: any) => collectFlow({ url, dryRun: dryRun() }, { ...provider, path })
      .then((flow) => !dryRun() ? persistFlow(flow, provider.flowOptions.name, { outPath }) : Promise.resolve(''))
      .then((fileName) => {
        // open report if requested and not in executed in CI
        if (!dryRun() && openOpt() && interactive()) {
          openFileInBrowser(fileName, { wait: false });
        }
        return Promise.resolve();
      })
  ));

}

async function sequeltial(set: Array<(res: any) => Promise<any>>) {
  let res = undefined;
  for (let i = 0; i < set.length; i++) {
    res = await set[i](res);
  }
}
