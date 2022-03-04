import { YargsCommandObject } from './internal/yargs/model';
import { captureUserFlowsCommand } from './commands/capture-user-flows';

export const commands: YargsCommandObject[] = [
  {
    ...captureUserFlowsCommand,
    command: '*'
  },
  captureUserFlowsCommand,
];
