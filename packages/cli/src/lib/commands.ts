import { YargsCommandObject } from './internal/utils/yargs/types';
import { collectUserFlowsCommand } from './commands/collect/collect';
import { initCommand } from './commands/init';

export const commands: YargsCommandObject[] = [
  initCommand,
  collectUserFlowsCommand,
  {
    ...collectUserFlowsCommand,
    command: '*'
  }
];
