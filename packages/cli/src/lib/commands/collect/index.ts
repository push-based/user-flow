import {YargsCommandObject} from '../../core/yargs/types';
import {logVerbose} from '../../core/loggin/index';
import {collectOptions} from './options';
import {runCollectCommand} from "./command-impl";

export const collectUserFlowsCommand: YargsCommandObject = {
  command: 'collect',
  description: 'Run a set of user flows and save the result',
  builder: (y) => y.options(collectOptions),
  module: {
    handler: async (argv: any) => {
      logVerbose(`run "collect" as a yargs command with args:`);
      await runCollectCommand(argv);
    }
  }
};
