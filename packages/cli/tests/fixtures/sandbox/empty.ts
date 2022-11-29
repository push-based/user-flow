import { UserFlowProjectConfig } from '../../utils/cli-testing/user-flow-cli-project/types';
import { EMPTY_SANDBOX_CLI_TEST_CFG } from '../empty-sandbox';
import { CLI_PATH } from '../cli-bin-path';

export const EMPTY_PRJ_CFG: UserFlowProjectConfig = {
  root: EMPTY_SANDBOX_CLI_TEST_CFG.cwd as string,
  bin: CLI_PATH,
  rcFile: {}
};
