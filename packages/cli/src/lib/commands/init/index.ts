import { YargsCommandObject } from '../../core/yargs/types.js';
import { logVerbose } from '../../core/loggin/index.js';
import { INIT_OPTIONS } from './options/index.js';
import { runInitCommand } from './command-impl.js';

export const initCommand: YargsCommandObject = {
  command: 'init',
  description: 'Setup .user-flowrc.json',
  builder: (y) => y.options(INIT_OPTIONS),
  module: {
    handler: async (argv: any) => {
      logVerbose(`run "init" as a yargs command`);
      await runInitCommand(argv);
    }
  }
};

