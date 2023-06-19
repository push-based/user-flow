import {
  DEFAULT_RC_NAME,
  UserFlowProjectConfig,
} from '@push-based/user-flow-cli-testing';
import { STATIC_RC_JSON, STATIC_USERFLOW_PATH } from './rc';
import { STATIC_USERFLOW_CONTENT } from './flow1.uf';
import { INITIATED_PRJ_BIN, INITIATED_PRJ_ROOT } from '../initialized/cfg';
import {
  STATIC_APP_FAVICON_CONTENT,
  STATIC_APP_FAVICON_NAME,
} from './static-app/favico';
import {
  STATIC_APP_IMG_CONTENT,
  STATIC_APP_IMG_NAME,
} from './static-app/user-flow-square';
import { join } from 'path';
import {
  STATIC_APP_INDEX_CONTENT,
  STATIC_APP_INDEX_NAME,
} from './static-app/index.html';

const addDistToPath = (p: string) => join('dist', p);

export const STATIC_PRJ_CFG: UserFlowProjectConfig = {
  root: INITIATED_PRJ_ROOT,
  bin: INITIATED_PRJ_BIN,
  rcFile: {
    [DEFAULT_RC_NAME]: STATIC_RC_JSON,
  },
  delete: [
    addDistToPath(STATIC_APP_INDEX_NAME),
    addDistToPath(STATIC_APP_FAVICON_NAME),
    addDistToPath(STATIC_APP_IMG_NAME),
  ],
  create: {
    [STATIC_RC_JSON.collect.ufPath]: undefined,
    [STATIC_RC_JSON.persist.outPath]: undefined,
    [STATIC_USERFLOW_PATH]: STATIC_USERFLOW_CONTENT,
    [addDistToPath(STATIC_APP_INDEX_NAME)]: STATIC_APP_INDEX_CONTENT,
    [addDistToPath(STATIC_APP_FAVICON_NAME)]: STATIC_APP_FAVICON_CONTENT,
    [addDistToPath(STATIC_APP_IMG_NAME)]: STATIC_APP_IMG_CONTENT,
  },
};
