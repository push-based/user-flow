import  { YargsCommandObject } from '../../core/utils/yargs/types';
import { logVerbose } from '../../core/utils/loggin/index';
import { RcJson } from '../../types';
import { readBudgets } from './utils/budgets';
import { userFlowReportToMdTable } from './processes/md-table';
import { readFile } from '../../core/utils/file/file';
import { getCLIConfigFromArgv } from '../../core/rc-json';

export const assertCommand: YargsCommandObject = {
  command: 'assert',
  description: 'Setup .user-flowrc.json',
  module: {
    handler: async (argv: any) => {
      logVerbose(`run "assert" as a yargs command`);
      const cfg = getCLIConfigFromArgv(argv);
      const json = JSON.parse(readFile('./packages/cli/docs/raw/order-coffee.uf.json').toString());
      const table = userFlowReportToMdTable(json);
      console.log('table', table);
     //  await run(cfg);
    }
  }
};

export async function run(argv: Partial<RcJson>): Promise<void> {
  logVerbose(readBudgets())
  return Promise.resolve();
}
