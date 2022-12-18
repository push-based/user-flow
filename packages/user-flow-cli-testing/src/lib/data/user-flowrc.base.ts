import { RcJson } from '@push-based/user-flow';
import { DEFAULT_COLLECT_URL } from '@push-based/user-flow';
import { DEFAULT_COLLECT_UF_PATH } from '@push-based/user-flow';
import { DEFAULT_PERSIST_OUT_PATH } from '@push-based/user-flow';
import { getEnvPreset } from '@push-based/user-flow';
import { ReportFormat } from '@push-based/user-flow';

export const CLI_DEFAULT_RC_JSON: RcJson = {
  'collect': {
    'url': DEFAULT_COLLECT_URL,
    'ufPath': DEFAULT_COLLECT_UF_PATH
  },
  'persist': {
    'outPath': DEFAULT_PERSIST_OUT_PATH,
    'format': getEnvPreset().format as ReportFormat[]
  },
  'assert': {}
};

export const SANDBOX_BASE_RC_JSON: RcJson = {
  'collect': {
    'url': DEFAULT_COLLECT_URL,
    'ufPath': './src/lib/user-flows', // DEFAULT_COLLECT_UF_PATH
  },
  'persist': {
    'outPath': './src/lib/measures', //DEFAULT_PERSIST_OUT_PATH,
    'format': getEnvPreset().format as ReportFormat[]
  },
  'assert': {}
};
