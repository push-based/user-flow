import { commands } from './commands/commands';
import { runCli } from './core/yargs';
import { getCLIGlobalConfigFromArgv, getCliOptionsFromRcConfig } from './global/rc-json';
import { GLOBAL_OPTIONS_YARGS_CFG } from './global/options';

function configParser(rcPath?: string): {} {
  let rcConfig: any = getCliOptionsFromRcConfig(rcPath);
 // let globalConfig: any = getCLIGlobalConfigFromArgv();
  return { ...rcConfig };
}

(async () => runCli({
  commands: commands,
  options: {...GLOBAL_OPTIONS_YARGS_CFG},
  configParser: configParser }))();
