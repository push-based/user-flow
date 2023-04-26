import { YargsCommandObject } from '../../core/yargs/types.js';
import { logVerbose } from '../../core/loggin/index.js';
import { COLLECT_OPTIONS } from './options/index.js';
import { startServerIfNeededAndExecute } from './utils/serve-command.js';
import { collectRcJson } from '../init/processes/collect-rc-json.js';
import { run } from '../../core/processing/behaviors.js';
import { collectReports } from './processes/collect-reports.js';
import { RcJson } from '../../types.js';
import { getCollectCommandOptionsFromArgv } from './utils/params.js';

export const collectUserFlowsCommand: YargsCommandObject = {
  command: 'collect',
  description: 'Run a set of user flows and save the result',
  builder: (y) => y.options(COLLECT_OPTIONS),
  module: {
    handler: async (argv: any) => {
      logVerbose(`run "collect" as a yargs command with args:`);
      const cfg = getCollectCommandOptionsFromArgv(argv);
      logVerbose('Collect options: ', cfg);
      await run([
        collectRcJson,
        (cfg: RcJson) =>
          startServerIfNeededAndExecute(() => collectReports(cfg)
              .then()
            , cfg.collect)
      ])(cfg);
    }
  }
};
