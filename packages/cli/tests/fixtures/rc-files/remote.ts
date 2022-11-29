import { RcJson } from '../../../src/lib';
import { SANDBOX_BASE_RC_JSON } from '../../utils/cli-testing/user-flow-cli-project/data/user-flowrc.base';
import { REMOTE_USERFLOW_NAME } from '../user-flows/remote-sandbox-setup.uf';
import * as path from 'path';

export const REMOTE_RC_NAME = '.user-flow.remote.json';
export const REMOTE_RC_JSON: RcJson = {
  ...SANDBOX_BASE_RC_JSON,
  'collect': {
    ...SANDBOX_BASE_RC_JSON.collect,
    'url': 'https://google.com'
  }
};

const reportName = REMOTE_USERFLOW_NAME.slice(0, -2);
export const REMOTE_HTML_REPORT_NAME = reportName + 'html';
export const REMOTE_JSON_REPORT_NAME = reportName + 'json';
export const REMOTE_MD_REPORT_NAME = reportName + 'md';
export const REMOTE_USERFLOW_PATH = path.join(REMOTE_RC_JSON.collect.ufPath,REMOTE_USERFLOW_NAME);
