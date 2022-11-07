import { YargsCommandObject } from '../../core/yargs/types';
import { logVerbose } from '../../core/loggin/index';
import { COLLECT_OPTIONS } from './options';
import { startServerIfNeededAndExecute } from './utils/serve-command';
import { setupRcJson } from './../init/processes/setup-rc-json';
import { run } from '../../core/processing/behaviors';
import { collectReports } from './processes/collect-reports';
import { getCLIConfigFromArgv } from '../../global/rc-json';
import { RcArgvOptions, RcJson } from '../../global/rc-json/types';
import { getEnvPreset } from '../../global/rc-json/pre-sets';

// @TODO refactor to use run, concat, askToSkip etc helpers
export const collectUserFlowsCommand: YargsCommandObject = {
  command: 'collect',
  description: 'Run a set of user flows and save the result',
  builder: (y) => y.options(COLLECT_OPTIONS),
  module: {
    handler: async (argv: any) => {
      logVerbose(`run "collect" as a yargs command with args:`);
      const potentialExistingCfg: RcJson = getCLIConfigFromArgv(argv as RcArgvOptions);

      await run([
        setupRcJson,
        (cfg: RcJson) =>
          startServerIfNeededAndExecute(() => collectReports(cfg), cfg.collect)
      ])(potentialExistingCfg);

    }
  }
};
