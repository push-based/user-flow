import { YargsCommandObject } from '../../core/yargs/types';
import { logVerbose } from '../../core/loggin/index';
import { COLLECT_OPTIONS } from './options';
import { startServerIfNeededAndExecute } from './utils/serve-command';
import { setupOrUpdateRcJson } from '../init/processes/setup-or-update-rc-json';
import { run } from '../../core/processing/behaviors';
import { collectReports } from './processes/collect-reports';
import { getCLIConfigFromArgv } from '../../global/rc-json';
import { RcArgvOptions} from '../../global/rc-json/types';
import { RcJson } from '../../types';

export const collectUserFlowsCommand: YargsCommandObject = {
  command: 'collect',
  description: 'Run a set of user flows and save the result',
  builder: (y) => y.options(COLLECT_OPTIONS),
  module: {
    handler: async (argv: any) => {
      logVerbose(`run "collect" as a yargs command with args:`);
      const cfg = getCLIConfigFromArgv(argv as RcArgvOptions);
      logVerbose('Collect options: ', cfg, argv);
      await run([
        setupOrUpdateRcJson,
        (cfg: RcJson) =>
          startServerIfNeededAndExecute(() => collectReports(cfg), cfg.collect)
      ])(cfg);
    }
  }
};
