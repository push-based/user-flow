import { YargsCommandObject } from '../../core/yargs/types';
import { logVerbose } from '../../core/loggin';
import { readFile } from '../../core/file';
import { generateMdReport } from './utils/md-report';

export const assertCommand: YargsCommandObject = {
  command: 'assert',
  description: 'Setup .user-flowrc.json',
  module: {
    handler: async () => {
      logVerbose(`run "assert" as a yargs command`);
      const json = JSON.parse(readFile('./packages/cli/docs/raw/order-coffee.uf.json').toString());
      const mdReport = generateMdReport(json);
      console.log('md report', mdReport);
    }
  }
};

