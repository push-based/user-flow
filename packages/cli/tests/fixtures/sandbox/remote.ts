import { UserFlowProjectConfig } from '../../utils/cli-testing/user-flow-cli-project/types';
import { DEFAULT_RC_NAME } from '../../../src/lib/constants';
import { REMOTE_RC_JSON, REMOTE_USERFLOW_PATH } from '../rc-files/remote';
import { REMOTE_USERFLOW_CONTENT } from '../user-flows/remote-sandbox-setup.uf';
import { INITIATED_PRJ_CFG } from './initiated';

export const REMOTE_PRJ_CFG: UserFlowProjectConfig = {
  ...INITIATED_PRJ_CFG,
  rcFile: {
    [DEFAULT_RC_NAME]: REMOTE_RC_JSON
  },
  create: {
    [REMOTE_USERFLOW_PATH]: REMOTE_USERFLOW_CONTENT
  }
};
