import { YargsCommandObject } from '../../core/utils/yargs/types';
import { logVerbose } from '../../core/utils/loggin/index';
import { COLLECT_OPTIONS } from './options';
import { startServerIfNeededAndExecute } from './utils/serve-command';
import { setupRcJson } from './../init/processes/setup-rc-json';
import { RcArgvOptions, RcJson } from '../../types';
import { getCLIConfigFromArgv } from '../../core/utils/yargs';
import { run } from '../../core/utils/processing/behaviors';
import { collectReports } from './processes/collect-reports';

// @TODO refactor to use run, concat, askToSkip etc helpers
export const collectUserFlowsCommand: YargsCommandObject = {
  command: 'collect',
  description: 'Run a set of user flows and save the result',
  builder: (y) => y.options(COLLECT_OPTIONS),
  module: {
    handler: async (argv: any) => {
      logVerbose(`run "collect" as a yargs command with args:`);

      const potentialExistingCfg: RcJson = getCLIConfigFromArgv(argv as RcArgvOptions);
      logVerbose(`potentialExistingCfg: `, potentialExistingCfg);
      await run([
        setupRcJson,
        (cfg: RcJson) =>
          startServerIfNeededAndExecute(() => collectReports(cfg), cfg.collect)
      ])(potentialExistingCfg);

    }
  }
};
