import { UserFlowProjectConfig } from '../../utils/cli-testing/user-flow-cli-project/types';
import { DEFAULT_RC_NAME } from '../../../src/lib/constants';
import { STATIC_RC_JSON } from '../rc-files/static';
import { join } from 'path';
import { STATIC_USERFLOW_CONTENT, STATIC_USERFLOW_NAME } from '../user-flows/static-sandbox-setup.uf';
import { INITIATED_PRJ_CFG } from './initiated';

// @TODO add static-app files to serve
export const STATIC_PRJ_CFG: UserFlowProjectConfig = {
  ...INITIATED_PRJ_CFG,
  rcFile: {
    [DEFAULT_RC_NAME]: STATIC_RC_JSON
  },
  create: {
    [join(STATIC_RC_JSON.collect.ufPath, STATIC_USERFLOW_NAME)]: STATIC_USERFLOW_CONTENT
  }
};
