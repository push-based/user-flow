import { join } from 'path';
import { REMOTE_USERFLOW_NAME, REMOTE_USERFLOW_TITLE } from './flow1.uf';

const SANDBOX_BASE_RC_JSON = {
  'collect': {
    'url': "https://coffee-cart.netlify.app/",
    'ufPath': './src/lib/user-flows', // DEFAULT_COLLECT_UF_PATH
  },
  'persist': {
    'outPath': './src/lib/measures', //DEFAULT_PERSIST_OUT_PATH,
    'format': ['stdout']
  },
  'assert': {}
};

export const REMOTE_RC_NAME = '.user-flow.remote.json';
export const REMOTE_RC_JSON = {
  ...SANDBOX_BASE_RC_JSON,
  'collect': {
    ...SANDBOX_BASE_RC_JSON.collect,
    'url': 'https://google.com'
  }
};

export const REMOTE_HTML_REPORT_NAME = REMOTE_USERFLOW_TITLE + '.html';
export const REMOTE_JSON_REPORT_NAME = REMOTE_USERFLOW_TITLE + '.json';
export const REMOTE_MD_REPORT_NAME = REMOTE_USERFLOW_TITLE + '.md';
export const REMOTE_USERFLOW_PATH = join(REMOTE_RC_JSON.collect.ufPath,REMOTE_USERFLOW_NAME);
