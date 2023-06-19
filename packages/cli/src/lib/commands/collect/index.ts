import {YargsCommandObject} from '../../core/yargs/types';
import {logVerbose} from '../../core/loggin/index';
import {COLLECT_OPTIONS} from './options';
import {runCollectCommand} from "./command-impl";

export const collectUserFlowsCommand: YargsCommandObject = {
  command: 'collect',
  description: 'Run a set of user flows and save the result',
  builder: (y) => y.options(COLLECT_OPTIONS),
  module: {
    handler: async (argv: any) => {
      logVerbose(`run "collect" as a yargs command with args:`);
      await runCollectCommand(argv);
    }
  }
};
