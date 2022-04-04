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


export const collectUserFlowsCommand: YargsCommandObject = {
  command: 'collect',
  description: 'Run a set of user flows and save the result',
  builder: (y) => y.options(COLLECT_OPTIONS).help(),
  module: {
    handler: async (argv: any) => {
      logVerbose(`run "collect" as a yargs command with args:`);
      logVerbose(argv);
      const { url, ufPath, outPath, openReport, serveCommand, awaitServeStdout } = argv as CollectCommandOptions;

      let err = undefined;
      // @TODO as it is quite har to maintain and test the serve command we have to think about a better way to wrap it
      // I suggest a single function returning a promise.
      // This fn takes the serve options as well ans the run block and makes shure execution is done correctly and errors are forwarded too.
      // In there we compose easier to test fn's
      const killServer = await startServerIfNeeded({ serveCommand, awaitServeStdout }, logVerbose).catch(
        e => {
          err = e;
          logVerbose(e);
        }
      )


      if(!err) {
        // if server started correctly run the user-flows
        await run({ url, ufPath, outPath, openReport });
      }

      killServer();
    }
  }
};


export async function run(cfg: CollectCommandOptions): Promise<void> {

  let { url, ufPath, outPath } = cfg;
  outPath = outPath || USER_FLOW_RESULT_DIR;

  // Check if url is given
  if (!url) {
    throw new Error('URL is required. Either through the console as `--url` or in the `.user-flow.json`');
  }

  // Check if path to user-flows is given
  if (!ufPath) {
    throw new Error('Path to user flows is required. Either through the console as `--ufPath` or in the `.user-flowrc.json`');
  }

  // Load and run user-flows in parallel
  const userFlows = loadFlow(ufPath);

  await sequeltial(userFlows.map(({ exports: provider, path }) =>
    (_: any) => collectFlow({ url, dryRun: dryRun() }, { ...provider, path })
      .then((flow) => !dryRun() ? persistFlow(flow, provider.flowOptions.name, { outPath }) : '')
      .then((fileName) => {
        // open report if requested and not in executed in CI
        if (!dryRun() && openOpt() && interactive()) {
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
