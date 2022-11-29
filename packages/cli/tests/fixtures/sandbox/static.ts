import { UserFlowProjectConfig } from '../../utils/cli-testing/user-flow-cli-project/types';
import { SETUP_SANDBOX_CLI_TEST_CFG } from '../setup-sandbox';
import { CLI_PATH } from '../cli-bin-path';
import { DEFAULT_RC_NAME } from '../../../src/lib/constants';
import { STATIC_RC_JSON } from '../rc-files/static-app';
import { join } from 'path';
import { STATIC_USERFLOW_CONTENT, STATIC_USERFLOW_NAME } from '../user-flows/static-sandbox-setup.uf';

export const STATIC_PRJ_CFG: UserFlowProjectConfig = {
  root: SETUP_SANDBOX_CLI_TEST_CFG.cwd as string,
  bin: CLI_PATH,
  rcFile: {
    [DEFAULT_RC_NAME]: STATIC_RC_JSON
  },
  create: {
    [join(STATIC_RC_JSON.collect.ufPath, STATIC_USERFLOW_NAME)]: STATIC_USERFLOW_CONTENT
  }
};
