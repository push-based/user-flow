import { commands } from './commands';
import { runCli } from './core/yargs';
import { getCliOptionsFromRcConfig, readRcConfig } from './global/rc-json';
import { GLOBAL_OPTIONS } from './global/options';
import { get as getRcParam } from './global/rc-json/options/rc';
import { getEnvPreset } from './global/rc-json/pre-sets';
import { GlobalOptionsArgv } from './global/options/types';

let config: any = getCliOptionsFromRcConfig(readRcConfig(getRcParam()));
// handle global env specific presets
const { interactive, verbose } = getEnvPreset() as GlobalOptionsArgv;
config = { interactive, verbose, ...config};

(async () => runCli({ commands: commands, options: {
    ...GLOBAL_OPTIONS
  }, config }))();
