import { RcJson } from '../../types.js';
import { getCollectCommandOptionsFromArgv } from './utils/params.js';
import { logVerbose } from '../../core/loggin/index.js';
import { run } from '../../core/processing/behaviors.js';
import { collectRcJson } from '../init/processes/collect-rc-json.js';
import { startServerIfNeededAndExecute } from './utils/serve-command.js';
import { collectReports } from './processes/collect-reports.js';
import { CollectCommandOptions } from './options/index.js';

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
