import { YargsCommandObject } from '../../core/utils/yargs/types';
import { collectFlow, persistFlow, loadFlow } from './utils/user-flow';
import { logVerbose } from '../../core/utils/loggin/index';
import { get as interactive } from '../../core/options/interactive';
import { get as dryRun } from '../../core/options/dryRun';
import { get as openOpt } from './options/open';
import * as openFileInBrowser from 'open';
import { COLLECT_OPTIONS } from './options';
import { startServerIfNeeded } from './utils/serve-command';
import { run as ensureConfig } from '../init';
import { RcArgvOptions } from '@push-based/user-flow/cli';

export const collectUserFlowsCommand: YargsCommandObject = {
  command: 'collect',
  description: 'Run a set of user flows and save the result',
  builder: (y) => y.options(COLLECT_OPTIONS),
  module: {
    handler: async (argv: any) => {
      logVerbose(`run "collect" as a yargs command with args:`);
      logVerbose(argv);

      // get validation and errors for RC & options configurations
      await ensureConfig(argv);

      const { url, ufPath, outPath, format, budgetPath, budgets, openReport, serveCommand, awaitServeStdout } = argv as RcArgvOptions;

      const r = await startServerIfNeeded(() => {
        return run({ url, ufPath, outPath, format, budgetPath, budgets, openReport, serveCommand, awaitServeStdout });
      }, { serveCommand, awaitServeStdout });

    }
  }
};

export async function run(cfg: RcArgvOptions): Promise<void> {

  let { url, ufPath, outPath, format, budgetPath, budgets } = cfg;

  // Load and run user-flows in parallel
  const userFlows = loadFlow(ufPath);

  await sequeltial(userFlows.map(({ exports: provider, path }) =>
    (_: any) => {

      provider = provider || {};
      if (provider.flowOptions?.config === undefined) {
        provider.flowOptions.config = {} as any;
        if (provider.flowOptions.config?.settings  === undefined) {
          // @ts-ignore
          provider.flowOptions.config.settings = {} as any;
        }
      }

      if (budgetPath) {
        logVerbose(`CLI options --budgetPath or .user-flowrc.json configuration ${budgetPath} is used instead of a potential configuration in the user flow`);
        // @ts-ignore
        provider.flowOptions.config.settings.budgets = budgetPath;
      } else if (budgets) {
        logVerbose('.user-flowrc.json configuration is used instead of a potential configuration in the user flow');
        // @ts-ignore
        provider.flowOptions.config.settings.budgets = budgets;
      }

      return collectFlow({ url, dryRun: dryRun() }, { ...provider, path })
        .then((flow) => persistFlow(flow, provider.flowOptions.name, {
          outPath,
          format
        }))
        .then((fileNames) => {
          // open report if requested and not in executed in CI
          if (!dryRun() && openOpt() && interactive()) {

            const htmlReport = fileNames.find(i => i.includes('.html'));
            if (htmlReport) {
              logVerbose('open HTML report in browser');
              openFileInBrowser(htmlReport, { wait: false });
              return Promise.resolve();
            }

            const jsonReport = fileNames.find(i => i.includes('.json'));
            if (jsonReport) {
              logVerbose('open JSON report in browser');
              // @TODO if JSON is given open the file in https://googlechrome.github.io/lighthouse/viewer/
              openFileInBrowser(jsonReport, { wait: false });
            }
          }
          return Promise.resolve();
        });
    }
  ));

}

async function sequeltial(set: Array<(res: any) => Promise<any>>) {
  let res = undefined;
  for (let i = 0; i < set.length; i++) {
    res = await set[i](res);
  }
}