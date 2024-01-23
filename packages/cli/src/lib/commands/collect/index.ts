import { ArgumentsCamelCase, Argv, CommandModule } from 'yargs';

import {logVerbose} from '../../core/loggin/index.js';
import { collectOptions, CollectOptions } from './options/index.js';
import { GlobalCliOptions } from '../../global/options/index.js';
import { getCollectCommandOptionsFromArgv } from './utils/params.js';
import { run } from '../../core/processing/behaviors.js';
import { collectRcJson } from '../init/processes/collect-rc-json.js';
import { RcJson } from '../../types.js';
import { startServerIfNeededAndExecute } from './utils/serve-command.js';
import { collectReports } from './processes/collect-reports.js';

type CollectCommandOptions = GlobalCliOptions & CollectOptions;

async function runCollect(argv: ArgumentsCamelCase<CollectCommandOptions>): Promise<void> {
  // @ts-ignore
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

export const collectCommand: CommandModule<GlobalCliOptions, CollectCommandOptions> = {
  command: 'collect',
  describe: 'Run a set of user flows and save the result',
  builder: (argv: Argv<GlobalCliOptions>) => argv.options(collectOptions),
  handler: runCollect
}
