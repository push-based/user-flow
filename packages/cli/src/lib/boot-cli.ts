import { commands } from './commands';
import { runCli } from './core/yargs';
import { getCLIGlobalConfigFromArgv, getCliOptionsFromRcConfig, readRcConfig } from './global/rc-json';
import { GLOBAL_OPTIONS_YARGS_CFG } from './global/options';
import { get as getRcParam } from './global/rc-json/options/rc';
import { getEnvPreset } from './global/rc-json/pre-sets';
import { GlobalOptionsArgv } from './global/options/types';

let rcConfig: any = getCliOptionsFromRcConfig(readRcConfig(getRcParam()));
let globalConfig: any = getCLIGlobalConfigFromArgv(process.argv as any);

// handle global env specific presets
const { interactive, verbose } = getEnvPreset() as GlobalOptionsArgv;
const config = { interactive, verbose, ...globalConfig, ...rcConfig};

(async () => runCli({ commands: commands, options: {
    ...GLOBAL_OPTIONS_YARGS_CFG
  }, config }))();
