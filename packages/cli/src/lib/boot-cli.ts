import { commands } from './commands';
import { runCli } from './core/yargs';
import { getCLIGlobalConfigFromArgv, getCliOptionsFromRcConfig } from './global/rc-json';
import { GLOBAL_OPTIONS_YARGS_CFG } from './global/options';
import { getEnvPreset } from './global/rc-json/pre-sets';
import { GlobalOptionsArgv } from './global/options/types';

let rcConfig: any = getCliOptionsFromRcConfig();
let globalConfig: any = getCLIGlobalConfigFromArgv();
// handle the global options of env specific presets
const { interactive, verbose } = getEnvPreset() as GlobalOptionsArgv;
const config = { interactive, verbose, ...globalConfig, ...rcConfig };

(async () => runCli({
  commands: commands, options: {
    ...GLOBAL_OPTIONS_YARGS_CFG
  }, config
}))();
