import { commands } from './commands';
import { runCli } from './core/yargs';
import { readRcConfig } from './global/rc-json';
import { GLOBAL_OPTIONS } from './global/options';
import { getCLIGlobalConfigFromArgv, getCliOptionsFromRcConfig } from './global/rc-json';
import { GLOBAL_OPTIONS_YARGS_CFG } from './global/options';
import { getEnvPreset } from './global/rc-json/pre-sets';
import { GlobalOptionsArgv } from './global/options/types';

function configParser(rcPath: string): {} {
  const {collect, persist, assert} = readRcConfig(rcPath);
  return {...collect, ...persist, ...assert};
}
let rcConfig: any = getCliOptionsFromRcConfig();
let globalConfig: any = getCLIGlobalConfigFromArgv();
// handle the global options of env specific presets
const { interactive, verbose } = getEnvPreset() as GlobalOptionsArgv;
const config = { interactive, verbose, ...globalConfig, ...rcConfig };

(async () => runCli({ commands: commands, options: {...GLOBAL_OPTIONS}, config: configParser }))();
(async () => runCli({
  commands: commands, options: {
    ...GLOBAL_OPTIONS_YARGS_CFG
  }, config
}))();
