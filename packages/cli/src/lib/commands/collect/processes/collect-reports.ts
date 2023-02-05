import { UserFlowProvider } from '../utils/user-flow/types';
import { concat } from '../../../core/processing/behaviors';
import { logVerbose } from '../../../core/loggin';
import { get as dryRun } from '../../../commands/collect/options/dryRun';
import { collectFlow, loadFlow, openFlowReport, persistFlow } from '../utils/user-flow';
import { AssertRcOptions } from '../../assert/options/types';
import { RcJson } from '../../../types';
import { CollectArgvOptions } from '../options/types';
import { getLhConfigFromArgv, mergeLhConfig, readConfig } from '../utils/config';

export async function collectReports(cfg: RcJson): Promise<RcJson> {

  const { collect, persist, assert } = cfg;

  let userFlows = [] as ({ exports: UserFlowProvider, path: string })[];
  // Load and run user-flows in sequential
  userFlows = loadFlow(collect);
  let globalLhCfg = getLhConfigFromArgv({ ...collect, ...persist, ...assert });
  await concat(userFlows.map(({ exports: provider, path }) =>
    (_: any) => {
      const lhConfig = mergeLhConfig(globalLhCfg, provider?.flowOptions?.config);

      provider.flowOptions.config = lhConfig;

      return collectFlow({ ...collect, dryRun: dryRun() }, { ...provider, path })
        .then((flow) => persistFlow(flow, { ...persist, ...collect }))
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
  }
  return provider;
}

function addConfigIfGiven(provider: UserFlowProvider, collectOptions: CollectArgvOptions = {} as CollectArgvOptions): UserFlowProvider {
  const { configPath } = collectOptions;

  if (configPath) {
    logVerbose(`Configuration ${configPath} is used instead of a potential configuration in the user-flow.uf.ts`);

    // @ts-ignore
    provider.flowOptions.config = readConfig(configPath);
  }

  return provider;
}

function addBudgetsIfGiven(provider: UserFlowProvider, assertOptions: AssertRcOptions = {} as AssertRcOptions): UserFlowProvider {
  const { budgetPath, budgets } = assertOptions;

  if (budgetPath) {
    logVerbose(`Collect options budgetPath is used over CLI param or .user-flowrc.json. Configuration ${budgetPath} is used instead of a potential configuration in the user-flow.uf.ts`);
    // @ts-ignore
    provider.flowOptions.config.settings.budgets = budgetPath;
  } else if (budgets) {
    logVerbose('Collect options budgets is used over CLI param or .user-flowrc.json. Configuration ${budgets} is used instead of a potential configuration in the user-flow.uf.ts');
    // @ts-ignore
    provider.flowOptions.config.settings.budgets = budgets;
  }
  return provider;
}
