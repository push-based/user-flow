import { YargsCommandObject } from '../../core/yargs/types';
import { logVerbose } from '../../core/loggin/index';
import { readBudgets } from './utils/budgets';
import { readFile } from '../../core/file';
import { getCollectCommandOptionsFromArgv } from '../collect/utils/params';
import { RcJson } from '../../types';
import { generateMdReport } from './utils/md-report';

export const assertCommand: YargsCommandObject = {
  command: 'assert',
  description: 'Setup .user-flowrc.json',
  module: {
    handler: async (argv: any) => {
      logVerbose(`run "assert" as a yargs command`);
      const cfg = getCollectCommandOptionsFromArgv(argv);
      const json = JSON.parse(
        readFile('./packages/cli/docs/raw/order-coffee.uf.json').toString()
      );
      const mdReport = generateMdReport(json);
      console.log('md report', mdReport);
      //  await run(cfg);
    },
  },
};

export async function run(argv: Partial<RcJson>): Promise<void> {
  logVerbose(readBudgets());
  return Promise.resolve();
}
