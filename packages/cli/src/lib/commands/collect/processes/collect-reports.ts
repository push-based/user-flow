import { UserFlowProvider } from '../utils/user-flow/types.js';
import { concat } from '../../../core/processing/behaviors.js';
import { get as dryRun } from '../../../commands/collect/options/dryRun.js';
import { collectFlow, loadFlow } from '../utils/user-flow/index.js';
import { persistFlow } from '../utils/persist/persist-flow.js';
import { openFlowReport } from '../utils/persist/open-report.js';
import { RcJson } from '../../../types.js';

export async function collectReports(cfg: RcJson): Promise<RcJson> {

  const { collect, persist, assert } = cfg;

  let userFlows = [] as ({ exports: UserFlowProvider, path: string })[];
  // Load and run user-flows in sequential
  userFlows = loadFlow(collect);
  await concat(userFlows.map(({ exports: provider, path }) =>
    (_: any) => {
      return collectFlow({
        ...collect, ...persist, ...assert, dryRun: dryRun()
      }, { ...provider, path })
        .then((flow: any) => persistFlow(flow, { ...persist, ...collect }))
        .then(openFlowReport)
        .then((_: any) => cfg);
    })
  )(cfg);
  return Promise.resolve(cfg);
}
