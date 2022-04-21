import  { YargsCommandObject } from '../../internal/utils/yargs/types';
import { logVerbose } from '../../core/loggin/index';
import { RcJson } from '../../types/model';
import { readBudgets } from '../../internal/utils/budgets';

export const assertCommand: YargsCommandObject = {
  command: 'assert',
  description: 'Setup .user-flowrc.json',
  module: {
    handler: async (argv: any) => {
      logVerbose(`run "assert" as a yargs command`);
      const cfg = await run(argv);
    }
  }
};

export async function run(argv: Partial<RcJson>): Promise<void> {
  logVerbose(readBudgets())
  return Promise.resolve();
}
