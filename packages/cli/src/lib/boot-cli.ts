import { commands } from './commands/commands.js';
import { runCli } from './core/yargs/index.js';
import { getCliOptionsFromRcConfig } from './global/rc-json/index.js';
import { GLOBAL_OPTIONS_YARGS_CFG } from './global/options/index.js';
import { getGlobalOptionsFromArgv } from './global/utils.js';

/**
 * Merges CLI params into rc config
 * @param rcPath
 */
function configParser(rcPath?: string): {} {
  const rcConfig: any = getCliOptionsFromRcConfig(rcPath);
  const globalConfig: any = getGlobalOptionsFromArgv(rcConfig);
  return { ...globalConfig, ...rcConfig };
}

(async () => runCli({
  commands: commands,
  options: {...GLOBAL_OPTIONS_YARGS_CFG},
  configParser }))();
