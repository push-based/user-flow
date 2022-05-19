import { RcJson } from '@push-based/user-flow';
import { collectFlow, loadFlow, persistFlow } from '../utils/user-flow';
import { concat } from '../../../core/utils/processing/behaviors';
import { logVerbose } from '../../../core/utils/loggin';
import { get as dryRun } from '../../../core/options/dryRun';
import { get as openOpt } from '../options/open';
import { get as interactive } from '../../../core/options/interactive';
import * as openFileInBrowser from 'open';

export async function collectReports(cfg: RcJson): Promise<RcJson> {

  const { collect, persist, assert } = cfg;
  const { url, ufPath, serveCommand, awaitServeStdout  } = collect;
  const { outPath, format } = persist;
  const { budgetPath, budgets } = assert || {};

  // Load and run user-flows in sequential
  const userFlows = loadFlow(ufPath);

  await concat(userFlows.map(({ exports: provider, path }) =>
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

      // @TODO
      // refactor to run and processes
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
              return Promise.resolve(cfg);
            }

            const jsonReport = fileNames.find(i => i.includes('.json'));
            if (jsonReport) {
              logVerbose('open JSON report in browser');
              // @TODO if JSON is given open the file in https://googlechrome.github.io/lighthouse/viewer/
              openFileInBrowser(jsonReport, { wait: false });
            }
          }
          return Promise.resolve(cfg);
        });
    }
  ));
  return Promise.resolve(cfg);
}
