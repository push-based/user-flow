import { YargsCommandObject } from '../../core/yargs/types';
import { logVerbose } from '../../core/loggin/index';
import { readBudgets } from './utils/budgets';
import { readFile } from '../../core/file';
import { RcJson } from '../../types';
import { generateMdReport } from './utils/md-report';
import { getAssertCommandOptionsFromArgv } from './utils/params';
import { run } from '../../core/processing/behaviors';

export const assertCommand: YargsCommandObject = {
  command: 'assert',
  description: 'Setup .user-flowrc.json',
  module: {
    handler: async (argv: any) => {
      logVerbose(`run "assert" as a yargs command`);
      const cfg = getAssertCommandOptionsFromArgv(argv);
      const json = JSON.parse(readFile('./packages/cli/docs/raw/order-coffee.uf.json').toString());
      logVerbose('Assert options: ', cfg);
      await run([
        () => {

        }
      ])(cfg);
    }
  }
};
