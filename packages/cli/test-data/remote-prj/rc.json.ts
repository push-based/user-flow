import { RcJson } from '../../src/lib';
import { PRJ_BASE_RC_JSON } from '../../user-flow-testing/data/user-flowrc.base';
import { REMOTE_USERFLOW_NAME, REMOTE_USERFLOW_TITLE } from './user-flow.uf';
import * as path from 'path';

export const REMOTE_RC_NAME = '.user-flow.remote.json';
export const REMOTE_RC_JSON: RcJson = {
  ...PRJ_BASE_RC_JSON,
  'collect': {
    ...PRJ_BASE_RC_JSON.collect,
    'url': 'https://google.com'
  }
};

export const REMOTE_HTML_REPORT_NAME = REMOTE_USERFLOW_TITLE + '.html';
export const REMOTE_JSON_REPORT_NAME = REMOTE_USERFLOW_TITLE + '.json';
export const REMOTE_MD_REPORT_NAME = REMOTE_USERFLOW_TITLE + '.md';
export const REMOTE_USERFLOW_PATH = path.join(REMOTE_RC_JSON.collect.ufPath,REMOTE_USERFLOW_NAME);
