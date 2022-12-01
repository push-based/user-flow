import { RcJson } from '@push-based/user-flow';
import { getEnvPreset } from '../../src/lib/pre-set';
import { ReportFormat } from '../../src/lib/commands/collect/options/types';
import { DEFAULT_COLLECT_UF_PATH, DEFAULT_COLLECT_URL, DEFAULT_PERSIST_OUT_PATH } from '../constants';


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
export const PRJ_BASE_RC_JSON: RcJson = {
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
