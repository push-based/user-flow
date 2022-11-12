import { commands } from './commands/commands';
import { runCli } from './core/yargs';
import { GLOBAL_OPTIONS_YARGS_CFG } from './global/options';
import { getCliConfig } from './get-cli-config';

(async () => runCli({
  commands: commands,
  options: GLOBAL_OPTIONS_YARGS_CFG,
  config: getCliConfig
}))();
