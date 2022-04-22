import { YargsCommandObject } from './core/utils/yargs/types';
import { collectUserFlowsCommand } from './commands/collect';
import { initCommand } from './commands/init';
import { assertCommand } from './commands/assert';

export const commands: YargsCommandObject[] = [
  initCommand,
  collectUserFlowsCommand,
  {
    ...collectUserFlowsCommand,
    command: '*'
  },
  assertCommand
];
