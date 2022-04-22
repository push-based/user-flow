import { runCli } from './core/utils/yargs';
import { commands } from './commands';
import { readRcConfig } from './core/rc-json';
import { CORE_OPTIONS } from './core/options';
import { get as getRcParam } from './core/options/rc';

const {collect, persist, assert} = readRcConfig(getRcParam());

(async () => runCli({ commands: commands, options: {
    ...CORE_OPTIONS
  }, config: {...collect, ...persist, ...assert} }))();
