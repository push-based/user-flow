import { YargsCommandObject } from '../core/yargs/types.js';
import { assertCommand } from './assert/index.js';

export const commands: YargsCommandObject[] = [
  assertCommand
];
