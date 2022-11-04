import { commands } from './commands';
import { runCli } from './core/yargs';
import { readRcConfig } from './global/rc-json';
import { GLOBAL_OPTIONS } from './global/options';
import { get as getRcParam } from './global/rc-json/options/rc';
import { getEnvPreset } from './global/rc-json/pre-sets';

const {collect, persist, assert} = readRcConfig(getRcParam());
const { format, ...preSet } = getEnvPreset();

if(format) {
  // maintain original formats
  // persist.format = Array.from(new Set(persist.format.concat(format)));
}

(async () => runCli({ commands: commands, options: {
    ...GLOBAL_OPTIONS
  }, config: { ...collect, ...persist, ...assert} }))();
