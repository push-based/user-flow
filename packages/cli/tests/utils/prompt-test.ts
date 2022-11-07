import * as _cliPromptTest from 'cli-prompts-test';
import { CI_PROPERTY, getCliMode } from '../../src/lib/global/cli-mode/cli-modes';


/**
 * @param {string[]} args CLI args to pass in
 * @param {string[]} answers answers to be passed to stdout
 * @param {Object} [options] specify the testPath and timeout
 *
 * returns {Promise<Object>}
 */
export function cliPromptTest(args, answers, options) {
  process.env[CI_PROPERTY] = 'SANDBOX';
  console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!', getCliMode());
  return _cliPromptTest(args, answers, options);
}
