import { commands } from './commands';
import { runCli } from './core/yargs';
import { readRcConfig } from './global/rc-json';
import { GLOBAL_OPTIONS } from './global/options';

function configParser(rcPath: string): {} {
  const {collect, persist, assert} = readRcConfig(rcPath);
  return {...collect, ...persist, ...assert};
}

(async () => runCli({ commands: commands, options: {...GLOBAL_OPTIONS}, config: configParser }))();
