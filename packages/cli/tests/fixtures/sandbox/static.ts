import { UserFlowProjectConfig } from '../../utils/cli-testing/user-flow-cli-project/types';
import { DEFAULT_RC_NAME } from '../../../src/lib/constants';
import { STATIC_RC_JSON } from '../rc-files/static';
import { join } from 'path';
import { STATIC_USERFLOW_CONTENT, STATIC_USERFLOW_NAME } from '../user-flows/static-sandbox-setup.uf';
import { SANDBOX_BASE_RC_JSON } from '../../utils/cli-testing/user-flow-cli-project/data/user-flowrc.base';
import { INITIATED_PRJ_BIN, INITIATED_PRJ_ROOT } from './initiated';

// @TODO add static-app files to serve
export const STATIC_PRJ_CFG: UserFlowProjectConfig = {
  root: INITIATED_PRJ_ROOT,
  bin: INITIATED_PRJ_BIN,
  rcFile: {
    [DEFAULT_RC_NAME]: STATIC_RC_JSON
  },
  create: {
    [SANDBOX_BASE_RC_JSON.collect.ufPath]: undefined,
    [SANDBOX_BASE_RC_JSON.persist.outPath]: undefined,
    [join(STATIC_RC_JSON.collect.ufPath, STATIC_USERFLOW_NAME)]: STATIC_USERFLOW_CONTENT
  }
};
