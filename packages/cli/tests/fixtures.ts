import * as path from "path";
import { USER_FLOWS_DIR, USER_FLOW_RESULT_DIR } from '../src/lib/internal/config/constants';

export const DEFAULT_USER_FLOW_RC_JSON_NAME = ".user-flowrc.json";
export const DEFAULT_USER_FLOW_RC_JSON = { "collect": { "url": "default-url", "ufPath": USER_FLOWS_DIR }, "persist": { "outPath": USER_FLOW_RESULT_DIR, "format": ['html', 'json'] } };
export const STATIC_USER_FLOW_RC_JSON_NAME = ".user-flowrc.static-dist.json";
export const STATIC_USER_FLOW_RC_JSON = {
  "collect": {
    "url": "http://127.0.0.1:4100",
    "ufPath": "./src/lib/user-flows-static-dist",
    "serveCommand": "npm run start",
    "awaitServeStdout": "Available on:"
  },
  "persist": {
    "outPath": "./measures",
    "format": ["json"]
  }
};

export const CLI_PATH = path.join(__dirname, '..', '..', '..', 'dist', 'packages', 'cli', 'src', 'cli.js');

export const EMPTY_SANDBOX_PATH = path.join(__dirname, '..', '..', 'sandbox-empty');
export const EMPTY_SANDBOX_RC = path.join(EMPTY_SANDBOX_PATH, DEFAULT_USER_FLOW_RC_JSON_NAME);

export const SETUP_SANDBOX_PATH = path.join(__dirname, '..', '..', 'sandbox-setup');
export const SETUP_SANDBOX_RC = path.join(SETUP_SANDBOX_PATH, DEFAULT_USER_FLOW_RC_JSON_NAME);
export const SETUP_SANDBOX_STATIC_RC = path.join(SETUP_SANDBOX_PATH, STATIC_USER_FLOW_RC_JSON_NAME);


export const ASK_URL = "What is the URL to run the user flows for?";
export const ASK_UF_PATH ="What is the directory provides the user-flows?";
export const ASK_OUT_PATH ="What is the directory to store results in?";
export const SETUP_CONFIRM ="user-flow CLI is set up now! 🎉";
