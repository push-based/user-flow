import { runCli } from './core/utils/yargs';
import { commands } from './commands';
import { readRcConfig } from './core/rc-json';
import { CORE_OPTIONS } from './core/options';
import { get as getRcParam } from './core/options/rc';
import { get as getInteractiveParam } from './core/options/interactive';
import { logVerbose } from './core/utils/loggin';

const {collect, persist, assert} = readRcConfig(getRcParam());
(async () => runCli({ commands: commands, options: {
    ...CORE_OPTIONS
  }, config: {...collect, ...persist, ...assert} }))();
