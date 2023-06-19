import { UserFlowProvider } from '../utils/user-flow/types';
import { concat } from '../../../core/processing/behaviors';
import { get as dryRun } from '../../../commands/collect/options/dryRun';
import { collectFlow, loadFlow } from '../utils/user-flow';
import { persistFlow } from '../utils/persist/persist-flow';
import { openFlowReport } from '../utils/persist/open-report';
import { RcJson } from '../../../types';

export async function collectReports(cfg: RcJson): Promise<RcJson> {
  const { collect, persist, assert } = cfg;

  let userFlows = [] as { exports: UserFlowProvider; path: string }[];
  // Load and run user-flows in sequential
  userFlows = loadFlow(collect);
  await concat(
    userFlows.map(({ exports: provider, path }) => (_: any) => {
      return collectFlow(
        {
          ...collect,
          ...persist,
          ...assert,
          dryRun: dryRun(),
        },
        { ...provider, path }
      )
        .then((flow) => persistFlow(flow, { ...persist, ...collect }))
        .then(openFlowReport)
        .then((_) => cfg);
    })
  )(cfg);
  return Promise.resolve(cfg);
}
