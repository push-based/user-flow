import { DEFAULT_PERSIST_OUT_PATH } from '../../src/lib/internal/config/constants';
import * as path from 'path';
import * as fs from 'fs';
import * as rimraf from 'rimraf';

import { CLI_MODE_PROPERTY } from '../../src/lib/cli-modes';
import { writeFile } from '../../src/lib/internal/utils/file';
import { kill } from '../utils/kill';

export const SETUP_SANDBOX_NAME = 'sandbox-setup';
export const SETUP_SANDBOX_PATH = path.join(__dirname, '..', '..', '..', SETUP_SANDBOX_NAME);
export const SETUP_SANDBOX_PACKAGE_JSON_PATH = path.join(SETUP_SANDBOX_PATH, 'package.json');

export const STATIC_USER_FLOW_SERVE_PORT = '5032';
export const STATIC_USER_FLOW_SERVE_COMMAND = `cd dist && npx http-server --port ${STATIC_USER_FLOW_SERVE_PORT}`;

export const SETUP_SANDBOX_DEFAULT_RC_NAME = '.user-flowrc.json';
export const SETUP_SANDBOX_DEFAULT_RC_JSON = {
  'collect': { 'url': 'https://google.com', 'ufPath': './src/lib/user-flows' },
  'persist': { 'outPath': DEFAULT_PERSIST_OUT_PATH, 'format': ['html', 'json'] }
};

export const SETUP_SANDBOX_STATIC_RC_NAME = '.user-flowrc.static-dist.json';
export const SETUP_SANDBOX_STATIC_RC_JSON = {
  'collect': {
    'url': 'http://127.0.0.1:' + STATIC_USER_FLOW_SERVE_PORT,
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
export const SETUP_SANDBOX_REMOTE_RC_JSON = {
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

export const SETUP_SANDBOX_DEFAULT_RC_PATH = path.join(SETUP_SANDBOX_PATH, SETUP_SANDBOX_DEFAULT_RC_NAME);
export const SETUP_SANDBOX_DEFAULT_PERSIST_OUT_PATH = path.join(SETUP_SANDBOX_PATH, SETUP_SANDBOX_DEFAULT_RC_JSON.persist.outPath);

export const SETUP_SANDBOX_STATIC_RC_PATH = path.join(SETUP_SANDBOX_PATH, SETUP_SANDBOX_STATIC_RC_NAME);
export const SETUP_SANDBOX_STATIC_PERSIST_OUT_PATH = path.join(SETUP_SANDBOX_PATH, SETUP_SANDBOX_DEFAULT_RC_JSON.persist.outPath);

export const SETUP_SANDBOX_REMOTE_RC_PATH = path.join(SETUP_SANDBOX_PATH, SETUP_SANDBOX_REMOTE_RC_NAME);
export const SETUP_SANDBOX_REMOTE_PERSIST_OUT_PATH = path.join(SETUP_SANDBOX_PATH, SETUP_SANDBOX_REMOTE_RC_JSON.persist.outPath);


export const SETUP_SANDBOX_CLI_TEST_CFG = {
  testPath: SETUP_SANDBOX_PATH,
  [CLI_MODE_PROPERTY]: 'SANDBOX'
};

export async function resetSetupSandboxAndKillPorts(): Promise<void> {

  await kill({port: STATIC_USER_FLOW_SERVE_PORT});

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
