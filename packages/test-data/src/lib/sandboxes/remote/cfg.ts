import { INITIATED_PRJ_BIN, INITIATED_PRJ_ROOT } from '../initialized/cfg';
import { REMOTE_RC_JSON, REMOTE_USERFLOW_PATH } from './rc';
import { REMOTE_USERFLOW_CONTENT } from './flow1.uf';

export const REMOTE_PRJ_CFG = {
  root: INITIATED_PRJ_ROOT,
  bin: INITIATED_PRJ_BIN,
  rcFile: {
    [".user-flowrc.json"]: REMOTE_RC_JSON
  },
  create: {
    [REMOTE_RC_JSON.collect.ufPath]: undefined,
    [REMOTE_RC_JSON.persist.outPath]: undefined,
    [REMOTE_USERFLOW_PATH]: REMOTE_USERFLOW_CONTENT
  }
};

