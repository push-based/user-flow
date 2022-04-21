import { YargsCommandObject } from './internal/utils/yargs/types';
import { collectUserFlowsCommand } from './commands/collect/collect';
import { initCommand } from './commands/init/init';
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
