import { YargsCommandObject } from '../../core/yargs/types.js';
import { logVerbose } from '../../core/loggin/index.js';
import { readBudgets } from './utils/budgets/index.js';
import { readFile } from '../../core/file/index.js';
import { getCollectCommandOptionsFromArgv } from '../collect/utils/params.js';
import { RcJson } from '../../types.js';
import { generateMdReport } from './utils/md-report.js';

export const assertCommand: YargsCommandObject = {
  command: 'assert',
  description: 'Setup .user-flowrc.json',
  module: {
    handler: async (argv: any) => {
      logVerbose(`run "assert" as a yargs command`);
      const cfg = getCollectCommandOptionsFromArgv(argv);
      const json = JSON.parse(readFile('./packages/cli/docs/raw/order-coffee.uf.json').toString());
      const mdReport = generateMdReport(json);
      console.log('md report', mdReport);
      //  await run(cfg);
    }
  }
};

export async function run(argv: Partial<RcJson>): Promise<void> {
  logVerbose(readBudgets());
  return Promise.resolve();
}
