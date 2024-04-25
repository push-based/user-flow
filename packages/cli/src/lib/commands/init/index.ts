import { YargsCommandObject } from '../../core/yargs/types.js';
import { logVerbose } from '../../core/loggin/index.js';
import { initOptions } from './options.js';
import { runInitCommand } from './command-impl.js';

export const initCommand: YargsCommandObject = {
  command: 'init',
  description: 'Setup .user-flowrc.json',
  builder: (y) => y.options(initOptions),
  module: {
    handler: async (argv: any) => {
      logVerbose(`run "init" as a yargs command`);
      await runInitCommand(argv);
    }
  }
};

