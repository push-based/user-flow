import { YargsCommandObject } from '../../../core/yargs/types';
import { logVerbose } from '../../../core/loggin/index';
import { run } from '../../../core/processing/behaviors';
import { getAssertCommandOptionsFromArgv } from '../utils/params';
import { ASSERT_OPTIONS } from '../options';

export const assertUserFlowsCommand: YargsCommandObject = {
  command: 'assert',
  description: 'Run a set of assertion rules against an existing user flows result',
  builder: (y) => y.options(ASSERT_OPTIONS),
  module: {
    handler: async (argv: any) => {
      logVerbose(`run "assert" as a yargs command with args:`);
      const cfg = getAssertCommandOptionsFromArgv(argv);
      logVerbose('Assert options: ', cfg);
      await run([

      ])(cfg);
    }
  }
};
