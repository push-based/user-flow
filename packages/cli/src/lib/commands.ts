import { YargsCommandObject } from './internal/yargs/model';
import { collectUserFlowsCommand } from './commands/collect';
import { initCommand } from './commands/init';

export const commands: YargsCommandObject[] = [
  initCommand,
  collectUserFlowsCommand,
  {
    ...collectUserFlowsCommand,
    command: '*'
  }
];
