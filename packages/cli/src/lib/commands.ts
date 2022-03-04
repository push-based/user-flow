import { YargsCommandObject } from './internal/yargs/model';
import { captureUserFlowsCommand } from './commands/capture';
import { initCommand } from './commands/init';

export const commands: YargsCommandObject[] = [
  initCommand,
  captureUserFlowsCommand,
  {
    ...captureUserFlowsCommand,
    command: '*'
  }
];
