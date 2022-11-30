import { UserFlowProjectConfig } from '../../utils/cli-testing/user-flow-cli-project/types';
import { DEFAULT_RC_NAME } from '../../../src/lib/constants';
import { REMOTE_RC_JSON, REMOTE_USERFLOW_PATH } from '../rc-files/remote';
import { REMOTE_USERFLOW_CONTENT } from '../user-flows/remote.uf';
import { INITIATED_PRJ_BIN, INITIATED_PRJ_ROOT } from './initiated';

export const REMOTE_PRJ_CFG: UserFlowProjectConfig = {
  root: INITIATED_PRJ_ROOT,
  bin: INITIATED_PRJ_BIN,
  rcFile: {
    [DEFAULT_RC_NAME]: REMOTE_RC_JSON
  },
  create: {
    [REMOTE_RC_JSON.collect.ufPath]: undefined,
    [REMOTE_RC_JSON.persist.outPath]: undefined,
    [REMOTE_USERFLOW_PATH]: REMOTE_USERFLOW_CONTENT
  }
};

