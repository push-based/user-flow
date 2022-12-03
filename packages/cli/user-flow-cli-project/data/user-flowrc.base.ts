import { RcJson } from '../../src/lib';
import { DEFAULT_COLLECT_URL } from '../../src/lib/commands/collect/options/url.constant';
import { DEFAULT_COLLECT_UF_PATH } from '../../src/lib/commands/collect/options/ufPath.constant';
import { DEFAULT_PERSIST_OUT_PATH } from '../../src/lib/commands/collect/options/outPath.constant';
import { getEnvPreset } from '../../src/lib/pre-set';
import { ReportFormat } from '../../src/lib/commands/collect/options/types';

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
