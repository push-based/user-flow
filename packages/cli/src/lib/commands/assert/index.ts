import  { YargsCommandObject } from '../../core/yargs/types';
import { logVerbose } from '../../core/loggin/index';
import { readBudgets } from './utils/budgets';
import {generateMdReport} from "../collect/processes/generate-reports";
import { readFile } from '../../core/file';
import { getCLIConfigFromArgv } from '../../global/rc-json';
import { RcJson } from '../../global/rc-json/types';

export const assertCommand: YargsCommandObject = {
  command: 'assert',
  description: 'Setup .user-flowrc.json',
  module: {
    handler: async (argv: any) => {
      logVerbose(`run "assert" as a yargs command`);
      const cfg = getCLIConfigFromArgv(argv);
      const json = JSON.parse(readFile('./packages/cli/docs/raw/order-coffee.uf.json').toString());
      const mdReport = generateMdReport(json);
      console.log('md report', mdReport);
     //  await run(cfg);
    }
  }
};

export async function run(argv: Partial<RcJson>): Promise<void> {
  logVerbose(readBudgets())
  return Promise.resolve();
}
