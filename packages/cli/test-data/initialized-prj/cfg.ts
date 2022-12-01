import { UserFlowCliProjectConfig } from '../../user-flow-testing';
import { DEFAULT_RC_NAME } from '../../src/lib/constants';
import { PRJ_BASE_RC_JSON } from '../../user-flow-testing';
import { join } from 'path';
import { ORDER_COFFEE_USERFLOW_CONTENT, ORDER_COFFEE_USERFLOW_NAME } from './user-flow.uf';
import { EMPTY_SANDBOX_BIN } from '../empty-prj';

export const INITIATED_PRJ_NAME = 'sandbox-setup';
export const INITIATED_PRJ_ROOT = join(__dirname, '..','..', '..', '..', INITIATED_PRJ_NAME);
export const INITIATED_PRJ_BIN = EMPTY_SANDBOX_BIN;

export const INITIATED_PRJ_CFG: UserFlowCliProjectConfig = {
  root: INITIATED_PRJ_ROOT,
  bin: INITIATED_PRJ_BIN,
  rcFile: {
    [DEFAULT_RC_NAME]: PRJ_BASE_RC_JSON
  },
  create: {
    [PRJ_BASE_RC_JSON.collect.ufPath]: undefined,
    [PRJ_BASE_RC_JSON.persist.outPath]: undefined,
    [join(PRJ_BASE_RC_JSON.collect.ufPath, ORDER_COFFEE_USERFLOW_NAME)]: ORDER_COFFEE_USERFLOW_CONTENT
  }
};
