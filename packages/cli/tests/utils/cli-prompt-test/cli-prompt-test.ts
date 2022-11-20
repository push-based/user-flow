import * as _cliPromptTest from 'cli-prompts-test';
import { CI_PROPERTY } from '../../../src/lib/global/cli-mode/cli-mode';
import { CLI_MODES } from '../../../src/lib/global/cli-mode/types';

/**
 * @param {string[]} args CLI args to pass in
 * @param {string[]} answers answers to be passed to stdout
 * @param {Object} [options] specify the testPath and timeout
 *
 * returns {Promise<Object>}
 */
export function cliPromptTest(args, answers, options, cliMode?: CLI_MODES) {
  const _cliMode: CLI_MODES = cliMode || 'SANDBOX';
  let ciValue: string = '';

  if(_cliMode === 'DEFAULT') {
    delete process.env[CI_PROPERTY];
  }
  else if(_cliMode === 'SANDBOX') {
    // emulate sandbox env by setting CI to SANDBOX
    ciValue = 'SANDBOX';
  }
  // CI mode
  else {
    ciValue = 'true';
  }

  if(ciValue) {
    options.extendEnv = {
      ...options.extendEnv,
      [CI_PROPERTY]: ciValue
    }
  }

  return _cliPromptTest(args, answers, options);
}
