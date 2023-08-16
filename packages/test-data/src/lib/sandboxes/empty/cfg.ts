import { join } from 'path';
import { CLI_PATH } from '../cli-bin-path';
import { SANDBOX_BASE_RC_JSON } from '../user-flowrc.base';

export const EMPTY_SANDBOX_BIN = CLI_PATH;
export const EMPTY_PRJ_NAME = 'sandbox';
export const EMPTY_SANDBOX_PATH = join(__dirname, '..','..', '..', '..', '..', EMPTY_PRJ_NAME);
export const EMPTY_PRJ_CFG = {
  root: EMPTY_SANDBOX_PATH,
  bin: EMPTY_SANDBOX_BIN,
  rcFile: {},
  create: {
    [SANDBOX_BASE_RC_JSON.collect.ufPath]: undefined,
    [SANDBOX_BASE_RC_JSON.persist.outPath]: undefined,
  },
  delete: [
    SANDBOX_BASE_RC_JSON.collect.ufPath,
    SANDBOX_BASE_RC_JSON.persist.outPath
  ]
};

