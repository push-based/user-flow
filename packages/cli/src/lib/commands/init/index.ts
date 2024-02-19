import { YargsCommandObject } from '../../core/yargs/types';
import { logVerbose } from '../../core/loggin';
import { INIT_OPTIONS } from './options';
import { runInitCommand } from './command-impl';

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

