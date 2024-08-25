import { join } from 'path';
import { RcJson, SANDBOX_BASE_RC_JSON } from '@push-based/user-flow-cli-testing';
import { REMOTE_USERFLOW_NAME } from './flow1.uf';

export const REMOTE_RC_JSON: RcJson = {
  ...SANDBOX_BASE_RC_JSON,
  'collect': {
    ...SANDBOX_BASE_RC_JSON.collect,
    'url': 'https://google.com'
  }
};

export const REMOTE_USERFLOW_PATH = join(REMOTE_RC_JSON.collect.ufPath,REMOTE_USERFLOW_NAME);
