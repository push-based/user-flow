import * as path from 'path';
import { RcJson, SANDBOX_BASE_RC_JSON } from '@push-based/user-flow-cli-testing';
import { REMOTE_USERFLOW_NAME, REMOTE_USERFLOW_TITLE } from './flow1.uf';

export const REMOTE_RC_NAME = '.user-flow.remote.json';
export const REMOTE_RC_JSON: RcJson = {
  ...SANDBOX_BASE_RC_JSON,
  'collect': {
    ...SANDBOX_BASE_RC_JSON.collect,
    'url': 'https://google.com'
  }
};

export const REMOTE_HTML_REPORT_NAME = REMOTE_USERFLOW_TITLE + '.html';
export const REMOTE_JSON_REPORT_NAME = REMOTE_USERFLOW_TITLE + '.json';
export const REMOTE_MD_REPORT_NAME = REMOTE_USERFLOW_TITLE + '.md';
export const REMOTE_USERFLOW_PATH = path.join(REMOTE_RC_JSON.collect.ufPath,REMOTE_USERFLOW_NAME);
