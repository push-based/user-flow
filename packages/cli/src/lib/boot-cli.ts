import { runCli } from './internal/yargs/utils';
import { commands } from './commands';
import { readRcConfig } from './internal/config/config';
import { CORE_OPTIONS } from './core/options';

const {collect, persist} = readRcConfig();

(async () => runCli({ commands: commands, options: {
    ...CORE_OPTIONS
  }, config: {...collect, ...persist} }))();
