import * as path from 'path';
import * as fs from "fs";
import { CLI_MODE_PROPERTY } from '../../src/lib/cli-modes';
import { DEFAULT_COLLECT_UF_PATH } from '../../src/lib/commands/collect/options/ufPath.constant';
import { DEFAULT_PERSIST_FORMAT } from '../../src/lib/commands/collect/options/format.constant';
import { DEFAULT_PERSIST_OUT_PATH } from '../../src/lib/commands/collect/options/outPath.constant';
import { DEFAULT_COLLECT_URL } from '../../src/lib/commands/collect/options/url.constant';

/**
 * This file maintains the static data used in tests as well as htlpers to reset the status of a sandbox to it's initial state.
 *
 * In general the ingredients you need for e2e testing the sandbox is:
 * - The path to the sandbox
 * - Names of existing or generated config files e.g. `./.user-flowrc.json`
 * - JSON data config files before and after e.g. before init command and after
 * - A script that resets all involved files to the initial state
 *
 * Here it pays off to name the versions so you can relate to what action caused the config name
 */

export const EMPTY_SANDBOX_RC_NAME__AFTER_ENTER_DEFAULTS = '.user-flowrc.json';
export const EMPTY_SANDBOX_RC_JSON__AFTER_ENTER_DEFAULTS = {
  'collect': { 'url': DEFAULT_COLLECT_URL, 'ufPath': DEFAULT_COLLECT_UF_PATH },
  'persist': { 'outPath': DEFAULT_PERSIST_OUT_PATH, 'format': DEFAULT_PERSIST_FORMAT }
};
export const EMPTY_SANDBOX_RC_JSON__AFTER_ENTER_CUSTOM_VALUES = {
  'collect': { 'url': 'custom-url', 'ufPath': 'DEFAULT_COLLECT_UF_PATH' },
  'persist': { 'outPath': 'DEFAULT_PERSIST_OUT_PATH', 'format': ['json'] }
};

export const EMPTY_SANDBOX_PATH = path.join(__dirname, '..', '..', '..', 'sandbox-empty');

export const EMPTY_SANDBOX_CLI_TEST_CFG = {
  testPath: EMPTY_SANDBOX_PATH,
  [CLI_MODE_PROPERTY]: 'SANDBOX'
};

export async function resetEmptySandbox(): Promise<void> {
  const f = path.join(EMPTY_SANDBOX_PATH, EMPTY_SANDBOX_RC_NAME__AFTER_ENTER_DEFAULTS);

  if (fs.existsSync(f)) {
    fs.rmSync(f);
  }
  return Promise.resolve();
}
