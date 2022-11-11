import { UserFlowProvider } from '../utils/user-flow/types';
import { concat } from '../../../core/processing/behaviors';
import { logVerbose } from '../../../core/loggin';
import { AssertOptions, RcJson } from '../../../global/rc-json/types';
import { collectFlow, loadFlow, openFlowReport, persistFlow } from '../utils/user-flow';
import { getEnvPreset } from '../../../global/rc-json/pre-set';
import { get as interactive } from '../../../global/options/interactive';

export async function collectReports(cfg: RcJson): Promise<RcJson> {

  let { collect, persist, assert } = cfg;

  // handle env specific presets for collect
  const { dryRun, openReport, format } = getEnvPreset();
  collect = { dryRun, openReport, ...collect };
  // handle env specific presets for persist
  if (format) {
    // maintain original formats
    persist.format = Array.from(new Set(persist.format.concat(format)));
  }

  let userFlows = [] as ({ exports: UserFlowProvider, path: string })[];
  // Load and run user-flows in sequential
  userFlows = loadFlow(collect);

  await concat(userFlows.map(({ exports: provider, path }) =>
    (_: any) => {

      provider = normalizeProviderObject(provider);
      provider = addBudgetsIfGiven(provider, assert);

      return collectFlow(collect, { ...provider, path })
        .then((flow) => persistFlow(flow, provider.flowOptions.name, persist))
        // open files only if it is:
        // - no dryRun - as the result is just a mock
        // - interactive - without interaction we assume no user present
        .then((fileNames) => (interactive() && !collect.dryRun) ? openFlowReport(fileNames) : Promise.resolve())
        .then(_ => cfg);
    })
  )(cfg);
  return Promise.resolve(cfg);
}

function normalizeProviderObject(provider: UserFlowProvider): UserFlowProvider {
  provider = provider || {};
  if (provider.flowOptions?.config === undefined) {
    provider.flowOptions.config = {} as any;
    if (provider.flowOptions.config?.settings === undefined) {
      // @ts-ignore
      provider.flowOptions.config.settings = {} as any;
    }
  }
  return provider;
}

function addBudgetsIfGiven(provider: UserFlowProvider, assertOptions: AssertOptions = {} as AssertOptions): UserFlowProvider {
  const { budgetPath, budgets } = assertOptions;

  if (budgetPath) {
    logVerbose(`CLI options --budgetPath or .user-flowrc.json configuration ${budgetPath} is used instead of a potential configuration in the user flow`);
    // @ts-ignore
    provider.flowOptions.config.settings.budgets = budgetPath;
  } else if (budgets) {
    logVerbose('.user-flowrc.json configuration is used instead of a potential configuration in the user flow');
    // @ts-ignore
    provider.flowOptions.config.settings.budgets = budgets;
  }
  return provider;
}
