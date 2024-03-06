import { concat } from '../../../core/processing/behaviors';
import { get as dryRun } from '../../../commands/collect/options/dryRun';
import { collectFlow, loadFlow } from '../utils/user-flow';
import { persistFlow } from '../utils/persist/persist-flow';
import { handleOpenFlowReports } from '../utils/persist/open-report';
import { RcJson } from '../../../types';
import { CollectCommandOptions } from '../options';

export async function collectReports(cfg: RcJson, argv: CollectCommandOptions): Promise<RcJson> {

  const { collect, persist, assert } = cfg;

  const userFlows = loadFlow(collect);
  await concat(userFlows.map(({ exports: provider, path }) =>
    (_: any) => {
      return collectFlow({
        ...collect, ...persist, ...assert, dryRun: dryRun()
      }, { ...provider, path })
        .then((flow) => persistFlow(flow, { ...persist, ...collect }))
        .then(handleOpenFlowReports(argv))
        .then(_ => cfg);
    })
  )(cfg);
  return Promise.resolve(cfg);
}
