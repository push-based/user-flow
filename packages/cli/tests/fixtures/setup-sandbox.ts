import * as path from 'path';
import * as fs from 'fs';
import * as rimraf from 'rimraf';

import { CI_PROPERTY } from '../../src/lib/global/cli-mode/cli-mode';
import { writeFile } from '../../src/lib/core/file';
import { kill } from '../utils/cli-testing/user-flow-cli-project/utils/kill';
import { RcJson } from '../../src/lib/types';
import { DEFAULT_PERSIST_OUT_PATH } from '../../src/lib/commands/collect/options/outPath.constant';
import { DEFAULT_PERSIST_FORMAT } from '../../src/lib/commands/collect/options/format.constant';
import { Options } from 'execa';
import { SERVE_COMMAND_PORT } from '../utils/cli-testing/user-flow-cli-project/constants';
import { LH_NAVIGATION_BUDGETS, LH_NAVIGATION_BUDGETS_NAME } from './budget/lh-navigation-budget';

export const SETUP_SANDBOX_NAME = 'sandbox-setup';
export const SETUP_SANDBOX_PATH = path.join(__dirname, '..', '..', '..', SETUP_SANDBOX_NAME);
export const SETUP_SANDBOX_PACKAGE_JSON_PATH = path.join(SETUP_SANDBOX_PATH, 'package.json');

export const STATIC_USER_FLOW_SERVE_COMMAND = `cd dist && npx http-server --port ${SERVE_COMMAND_PORT}`;

export const SETUP_SANDBOX_DEFAULT_RC_NAME = '.user-flowrc.json';
export const SETUP_SANDBOX_DEFAULT_RC_JSON: RcJson = {
  'collect': { 'url': 'https://google.com', 'ufPath': './src/lib/user-flows' },
  'persist': { 'outPath': DEFAULT_PERSIST_OUT_PATH, 'format': DEFAULT_PERSIST_FORMAT }
};

export const SETUP_SANDBOX_STATIC_RC_NAME = '.user-flowrc.static-dist.json';
export const SETUP_SANDBOX_STATIC_RC_JSON: RcJson = {
  'collect': {
    'url': 'http://127.0.0.1:' + SERVE_COMMAND_PORT,
    'ufPath': './src/lib/user-flows-static-dist',
    'serveCommand': 'npm run start',
    'awaitServeStdout': 'Available on:'
  },
  'persist': {
    'outPath': './measures',
    'format': ['json']
  }
};

export const SETUP_SANDBOX_REMOTE_RC_NAME = '.user-flowrc.remote.json';
export const SETUP_SANDBOX_REMOTE_RC_JSON: RcJson = {
  'collect': {
    'url': 'https://google.com',
    'ufPath': './src/lib/user-flows',
    'serveCommand': 'npm run start',
    'awaitServeStdout': 'Available on:'
  },
  'persist': {
    'outPath': './measures',
    'format': ['json']
  }
};


export const SETUP_SANDBOX_STATIC_RC_BUDGET_PATH_NAME = '.user-flowrc.static-dist.budget-path.json';
export const SETUP_SANDBOX_STATIC_RC_BUDGET_PATH_JSON: RcJson = {
  ...SETUP_SANDBOX_STATIC_RC_JSON,
  "assert": {
    budgetPath: LH_NAVIGATION_BUDGETS_NAME
  }
};


export const SETUP_SANDBOX_STATIC_RC_BUDGETS_NAME = '.user-flowrc.static-dist.budgets.json';
export const SETUP_SANDBOX_STATIC_RC_BUDGETS_JSON: RcJson = {
  ...SETUP_SANDBOX_STATIC_RC_JSON,
  "assert": {
    "budgets": LH_NAVIGATION_BUDGETS
  }
};

export const SETUP_SANDBOX_DEFAULT_RC_PATH = path.join(SETUP_SANDBOX_PATH, SETUP_SANDBOX_DEFAULT_RC_NAME);
export const SETUP_SANDBOX_DEFAULT_PERSIST_OUT_PATH = path.join(SETUP_SANDBOX_PATH, SETUP_SANDBOX_DEFAULT_RC_JSON.persist.outPath);

export const SETUP_SANDBOX_STATIC_RC_PATH = path.join(SETUP_SANDBOX_PATH, SETUP_SANDBOX_STATIC_RC_NAME);
export const SETUP_SANDBOX_STATIC_PERSIST_OUT_PATH = path.join(SETUP_SANDBOX_PATH, SETUP_SANDBOX_DEFAULT_RC_JSON.persist.outPath);

export const SETUP_SANDBOX_BUDGETS_PATH = path.join(SETUP_SANDBOX_PATH, LH_NAVIGATION_BUDGETS_NAME);
export const SETUP_SANDBOX_BUDGETS_RC_PATH = path.join(SETUP_SANDBOX_PATH, SETUP_SANDBOX_STATIC_RC_BUDGETS_NAME);
export const SETUP_SANDBOX_BUDGETS_PERSIST_OUT_PATH = path.join(SETUP_SANDBOX_PATH, SETUP_SANDBOX_STATIC_RC_BUDGETS_JSON.persist.outPath);

export const SETUP_SANDBOX_BUDGET_PATH_RC_PATH = path.join(SETUP_SANDBOX_PATH, SETUP_SANDBOX_STATIC_RC_BUDGET_PATH_NAME);
export const SETUP_SANDBOX_BUDGET_PATH_PERSIST_OUT_PATH = path.join(SETUP_SANDBOX_PATH, SETUP_SANDBOX_STATIC_RC_BUDGET_PATH_JSON.persist.outPath);

export const SETUP_SANDBOX_REMOTE_RC_PATH = path.join(SETUP_SANDBOX_PATH, SETUP_SANDBOX_REMOTE_RC_NAME);
export const SETUP_SANDBOX_REMOTE_PERSIST_OUT_PATH = path.join(SETUP_SANDBOX_PATH, SETUP_SANDBOX_REMOTE_RC_JSON.persist.outPath);


export const INITIALIZED_CLI_TEST_CFG: Options = {
  cwd: SETUP_SANDBOX_PATH
};

export async function resetSetupSandboxAndKillPorts(): Promise<void> {

  await kill({port: SERVE_COMMAND_PORT});
  process.env[CI_PROPERTY] = 'SANDBOX';

  const packageJson = JSON.parse(fs.readFileSync(SETUP_SANDBOX_PACKAGE_JSON_PATH).toString());

  writeFile(SETUP_SANDBOX_DEFAULT_RC_PATH, JSON.stringify(SETUP_SANDBOX_DEFAULT_RC_JSON));
  rimraf(SETUP_SANDBOX_DEFAULT_PERSIST_OUT_PATH, (err) => {
    if (err) {
      Promise.resolve(err);
    }
  });
  /**/
  writeFile(SETUP_SANDBOX_STATIC_RC_PATH, JSON.stringify(SETUP_SANDBOX_STATIC_RC_JSON));
  rimraf(SETUP_SANDBOX_STATIC_PERSIST_OUT_PATH, (err) => {
    if (err) {
      Promise.resolve(err);
    }
  });

  writeFile(SETUP_SANDBOX_BUDGETS_PATH, JSON.stringify(LH_NAVIGATION_BUDGETS));
  writeFile(SETUP_SANDBOX_BUDGETS_RC_PATH, JSON.stringify(SETUP_SANDBOX_STATIC_RC_BUDGETS_JSON));
  rimraf(SETUP_SANDBOX_BUDGETS_PERSIST_OUT_PATH, (err) => {
    if (err) {
      Promise.resolve(err);
    }
  });

  writeFile(SETUP_SANDBOX_BUDGET_PATH_RC_PATH, JSON.stringify(SETUP_SANDBOX_STATIC_RC_BUDGET_PATH_JSON));
  rimraf(SETUP_SANDBOX_BUDGET_PATH_PERSIST_OUT_PATH, (err) => {
    if (err) {
      Promise.resolve(err);
    }
  });

  writeFile(SETUP_SANDBOX_REMOTE_RC_PATH, JSON.stringify(SETUP_SANDBOX_REMOTE_RC_JSON));
  rimraf(SETUP_SANDBOX_REMOTE_PERSIST_OUT_PATH, (err) => {
    if (err) {
      Promise.resolve(err);
    }
  });/**/

  packageJson.scripts.start = STATIC_USER_FLOW_SERVE_COMMAND;
  writeFile(SETUP_SANDBOX_PACKAGE_JSON_PATH, JSON.stringify(packageJson));

  return Promise.resolve();
}
