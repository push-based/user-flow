import { UserFlowProjectConfig } from '../../utils/cli-testing/user-flow-cli-project/types';
import { CLI_PATH } from '../cli-bin-path';
import path from 'path';

export const EMPTY_SANDBOX_PATH = path.join(__dirname, '..', '..', '..', 'sandbox-empty');
export const EMPTY_PRJ_CFG: UserFlowProjectConfig = {
  root: EMPTY_SANDBOX_PATH,
  bin: CLI_PATH,
  rcFile: {}
};
