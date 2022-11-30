import { UserFlowProjectConfig } from '../../utils/cli-testing/user-flow-cli-project/types';
import { CLI_PATH } from '../cli-bin-path';
import { join } from 'path';

export const EMPTY_SANDBOX_BIN = CLI_PATH;
export const EMPTY_PRJ_NAME = 'sandbox-empty';
export const EMPTY_SANDBOX_PATH = join(__dirname, '..', '..', '..', '..', EMPTY_PRJ_NAME);
export const EMPTY_PRJ_CFG: UserFlowProjectConfig = {
  root: EMPTY_SANDBOX_PATH,
  bin: EMPTY_SANDBOX_BIN,
  rcFile: {}
};
