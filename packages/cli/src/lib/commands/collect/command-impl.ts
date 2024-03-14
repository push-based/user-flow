import { RcJson } from '../../types';
import { getCollectCommandOptionsFromArgv } from './utils/params';
import { logVerbose } from '../../core/loggin';
import { run } from '../../core/processing/behaviors';
import { collectRcJson } from '../init/processes/collect-rc-json';
import { startServerIfNeededAndExecute } from './utils/serve-command';
import { collectReports } from './processes/collect-reports';
import { CollectCommandOptions } from './options';

export async function runCollectCommand(argv: CollectCommandOptions): Promise<void> {
  const cfg = getCollectCommandOptionsFromArgv(argv);
  logVerbose('Collect options: ', cfg);
  await run([
    collectRcJson,
    (cfg: RcJson) =>
      startServerIfNeededAndExecute(
        () => collectReports(cfg, argv),
        cfg.collect
      )
  ])(cfg);
}
