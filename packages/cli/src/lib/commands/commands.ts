import { YargsCommandObject } from '../core/yargs/types.js';
import { collectUserFlowsCommand } from './collect/index.js';
import { assertCommand } from './assert/index.js';

export const commands: YargsCommandObject[] = [
  collectUserFlowsCommand,
  {
    ...collectUserFlowsCommand,
    command: '*'
  },
  assertCommand
];
