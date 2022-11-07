import { commands } from './commands';
import { runCli } from './core/yargs';
import { readRcConfig } from './global/rc-json';
import { GLOBAL_OPTIONS } from './global/options';
import { get as getRcParam } from './global/options/rc';

const config = { key: 'rcPath', parseFn: () => readRcConfig(getRcParam()) };

(async () => runCli({ commands: commands, options: {...GLOBAL_OPTIONS}, config }))();
