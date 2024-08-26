import { concat } from '../../../core/processing/behaviors.js';
import { collectFlow, loadFlow } from '../utils/user-flow/index.js';
import { persistFlow } from '../utils/persist/persist-flow.js';
import { handleOpenFlowReports } from '../utils/persist/open-report.js';
import { RcJson } from '../../../types.js';
import { CollectCommandOptions } from '../options/index.js';

export async function collectReports(cfg: RcJson, argv: CollectCommandOptions): Promise<RcJson> {

  const { collect, persist } = cfg;

  const userFlows = await loadFlow(collect);
  await concat(userFlows.map(({ exports: provider, path }) =>
    (_: any) => {
      return collectFlow({ ...collect, ...persist, }, { ...provider, path }, argv)
        .then((flow) => persistFlow(flow, { ...persist, ...collect }))
        .then(handleOpenFlowReports(argv))
        .then(_ => cfg);
    })
  )(cfg);
  return Promise.resolve(cfg);
}
