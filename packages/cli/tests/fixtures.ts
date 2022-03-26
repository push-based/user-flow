import * as path from "path";

export const USER_FLOW_RC_JSON_NAME = ".user-flowrc.json";
export const USER_FLOW_RC_WRONG_JSON_NAME = ".user-flowrc.wrong.json";
export const DEFAULT_USER_FLOW_RC_JSON = { "collect": { "url": "", "ufPath": "./" }, "persist": { "outPath": "./" } };
export const CUSTOM_USER_FLOW_RC_JSON = {"collect": { "url": "https://google.com", "ufPath": "./src/lib/user-flows" }, "persist": { "outPath": "./measures" } };

export const CLI_PATH = path.join(__dirname, '..', '..', '..', 'dist', 'packages', 'cli', 'src', 'cli.js');
export const EMPTY_SANDBOX_PATH = path.join(__dirname, '..', '..', 'sandbox-empty');
export const EMPTY_SANDBOX_RC = path.join(EMPTY_SANDBOX_PATH, USER_FLOW_RC_JSON_NAME);

export const SETUP_SANDBOX_PATH = path.join(__dirname, '..', '..', 'sandbox-setup');
export const SETUP_SANDBOX_RC = path.join(SETUP_SANDBOX_PATH, USER_FLOW_RC_JSON_NAME);
export const SETUP_SANDBOX_WRONG_RC = path.join(SETUP_SANDBOX_PATH, USER_FLOW_RC_WRONG_JSON_NAME);

export const ASK_URL = "What is the URL to run the user flows for?";
export const ASK_UF_PATH ="What is the directory provides the user-flows?";
export const ASK_OUT_PATH ="What is the directory to store results in?";
export const SETUP_CONFIRM ="user-flow CLI is set up now! 🎉";
