import { join } from 'path';
import { RcJson, SANDBOX_BASE_RC_JSON, SERVE_COMMAND_PORT } from '@push-based/user-flow-cli-testing';
import { STATIC_USERFLOW_NAME, STATIC_USERFLOW_TITLE } from './flow1.uf';

export const STATIC_RC_NAME = '.user-flow.static.json';
export const STATIC_RC_JSON: RcJson = {
  ...SANDBOX_BASE_RC_JSON,
  'collect': {
    'url': 'http://127.0.0.1:' + SERVE_COMMAND_PORT,
    'ufPath': './src/lib/user-flows',
    'serveCommand': 'npm run start',
    'awaitServeStdout': 'Available on:'
  },
  persist: {
    ...SANDBOX_BASE_RC_JSON.persist,
    'format': ['json']
  }
};

export const STATIC_HTML_REPORT_NAME = STATIC_USERFLOW_TITLE + '.html';
export const STATIC_JSON_REPORT_NAME = STATIC_USERFLOW_TITLE + '.json';
export const STATIC_MD_REPORT_NAME = STATIC_USERFLOW_TITLE + '.md';
export const STATIC_USERFLOW_PATH = join(STATIC_RC_JSON.collect.ufPath, STATIC_USERFLOW_NAME);

