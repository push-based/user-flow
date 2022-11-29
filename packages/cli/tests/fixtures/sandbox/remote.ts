import { UserFlowProjectConfig } from '../../utils/cli-testing/user-flow-cli-project/types';
import { SETUP_SANDBOX_CLI_TEST_CFG } from '../setup-sandbox';
import { CLI_PATH } from '../cli-bin-path';
import { DEFAULT_RC_NAME } from '../../../src/lib/constants';
import { REMOTE_RC_JSON, REMOTE_USERFLOW_PATH } from '../rc-files/remote-url';
import { REMOTE_USERFLOW_CONTENT } from '../user-flows/remote-sandbox-setup.uf';

export const REMOTE_PRJ_CFG: UserFlowProjectConfig = {
  root: SETUP_SANDBOX_CLI_TEST_CFG.cwd as string,
  bin: CLI_PATH,
  rcFile: {
    // @TODO as we bootstrap sequential we could use the default rc name and reduce the params in the tests
    [DEFAULT_RC_NAME]: REMOTE_RC_JSON
  },
  create: {
    [REMOTE_USERFLOW_PATH]: REMOTE_USERFLOW_CONTENT
  }
};
