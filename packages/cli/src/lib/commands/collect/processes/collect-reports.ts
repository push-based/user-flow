import { UserFlowProvider } from '../utils/user-flow/types';
import { concat } from '../../../core/processing/behaviors';
import { logVerbose } from '../../../core/loggin';
import { get as dryRun } from '../../../core/options/dryRun';
import { AssertOptions } from '../../../core/rc-json/types';
import { collectFlow, openFlowReport, persistFlow, loadFlow } from '../utils/user-flow';

export async function collectReports(cfg: RcJson): Promise<RcJson> {

  const { collect, persist, assert } = cfg;

  let userFlows = [] as ({ exports: UserFlowProvider, path: string })[];
  // Load and run user-flows in sequential
  userFlows = loadFlow(collect);

  await concat(userFlows.map(({ exports: provider, path }) =>
    (_: any) => {

      provider = normalizeProviderObject(provider);
      provider = addBudgetsIfGiven(provider, assert);

      return collectFlow({ ...collect, dryRun: dryRun() }, { ...provider, path })
        .then((flow) => persistFlow(flow, provider.flowOptions.name, persist))
        .then(openFlowReport)
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
