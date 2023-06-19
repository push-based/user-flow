import { YargsCommandObject } from '../core/yargs/types';
import { collectUserFlowsCommand } from './collect';
import { initCommand } from './init';
import { assertCommand } from './assert';

export const commands: YargsCommandObject[] = [
  initCommand,
  collectUserFlowsCommand,
  {
    ...collectUserFlowsCommand,
    command: '*',
  },
  assertCommand,
];
