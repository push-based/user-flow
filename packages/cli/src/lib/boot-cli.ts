import {commands} from './commands/commands';
import {runCli} from './core/yargs';
import {getCliOptionsFromRcConfig} from './global/rc-json';
import {GLOBAL_OPTIONS_YARGS_CFG} from './global/options';
import {getGlobalOptionsFromArgv} from './global/utils';

/**
 * Merges CLI params into rc config
 * @param rcPath
 */
function configParser(rcPath?: string): {} {
  let rcConfig: any = getCliOptionsFromRcConfig(rcPath);
  let globalConfig: any = getGlobalOptionsFromArgv(rcConfig);
  return { ...globalConfig, ...rcConfig };
}

(async () =>
  runCli({
    commands: commands,
    options: { ...GLOBAL_OPTIONS_YARGS_CFG },
    configParser,
  }))();
