import { YargsCommandObject } from '../core/yargs/types.js';
import { collectUserFlowsCommand } from './collect/index.js';
import { initCommand } from './init/index.js';

export const commands: YargsCommandObject[] = [
  initCommand,
  collectUserFlowsCommand,
  {
    ...collectUserFlowsCommand,
    command: '*'
  },
];
