import { commands } from './commands';
import { runCli } from './core/yargs';
import { readRcConfig } from './global/rc-json';
import { GLOBAL_OPTIONS } from './global/options';
import { get as getRcParam } from './global/rc-json/options/rc';
import { getEnvPreset } from './global/rc-json/pre-sets';

const {collect, persist, assert} = readRcConfig(getRcParam());
// handle global env specific presets
const { interactive, verbose } = getEnvPreset();
const config = { interactive, verbose, ...collect, ...persist, ...assert};

(async () => runCli({ commands: commands, options: {
    ...GLOBAL_OPTIONS
  }, config }))();
