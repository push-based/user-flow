import { join } from 'path';
import { UserFlowProjectConfig } from '@push-based/user-flow-cli-testing';
import { CLI_PATH } from '../cli-bin-path';

export const EMPTY_SANDBOX_BIN = CLI_PATH;
export const EMPTY_PRJ_NAME = 'sandbox';
export const EMPTY_SANDBOX_PATH = join(__dirname, '..','..', '..', '..', '..', EMPTY_PRJ_NAME);
export const EMPTY_PRJ_CFG: UserFlowProjectConfig = {
  root: EMPTY_SANDBOX_PATH,
  bin: EMPTY_SANDBOX_BIN,
  rcFile: {}
};
