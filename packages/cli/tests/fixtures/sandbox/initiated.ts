import { UserFlowProjectConfig } from '../../utils/cli-testing/user-flow-cli-project/types';
import { CLI_PATH } from '../cli-bin-path';
import { INITIALIZED_CLI_TEST_CFG } from '../setup-sandbox';
import { DEFAULT_RC_NAME } from '../../../src/lib/constants';
import { SANDBOX_BASE_RC_JSON } from '../../utils/cli-testing/user-flow-cli-project/data/user-flowrc.base';
import { join } from 'path';
import { ORDER_COFFEE_USERFLOW_CONTENT, ORDER_COFFEE_USERFLOW_NAME } from '../user-flows/order-coffee.uf';

export const INITIATED_PRJ_CFG: UserFlowProjectConfig = {
  root: INITIALIZED_CLI_TEST_CFG.cwd as string,
  bin: CLI_PATH,
  rcFile: {
    [DEFAULT_RC_NAME]: SANDBOX_BASE_RC_JSON
  },
  create: {
    [join(SANDBOX_BASE_RC_JSON.collect.ufPath, ORDER_COFFEE_USERFLOW_NAME)]: ORDER_COFFEE_USERFLOW_CONTENT
  }
};
