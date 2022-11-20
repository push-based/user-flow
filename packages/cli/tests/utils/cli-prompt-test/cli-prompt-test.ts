import { cliPromptTest as _cliPromptTest } from './raw';
import { Options } from 'execa';
import { CI_PROPERTY } from '../../../src/lib/global/cli-mode/cli-mode';
import { CLI_MODES } from '../../../src/lib/global/cli-mode/types';


/**
 *
 * @param options: passed directly to execa as options
 */
export function getCliProcess(options: Options) {
  return {
    exec: (processParams: string[], userInput: string[]) => {
      return _cliPromptTest(processParams, userInput, options);
    }
  };
}

/**
 * @param {string[]} processParams CLI args to pass in
 * @param {string[]} userInput answers to be passed to stdout
 * @param {Object} [options] specify the testPath and timeout
 *
 * returns {Promise<Object>}
 */
export function cliPromptTest(processParams: string[], userInput: string[], options: Options, cliMode: CLI_MODES = 'SANDBOX'): Promise<{
  stdout: string,
  stderr: string,
  exitCode: number
}> {
  let ciValue: string = '';

  if (cliMode === 'DEFAULT') {
    delete process.env[CI_PROPERTY];
  } else if (cliMode === 'SANDBOX') {
    // emulate sandbox env by setting CI to SANDBOX
    ciValue = 'SANDBOX';
  }
  // CI mode
  else {
    ciValue = 'true';
  }

  if (ciValue) {
    options['env'] = {
      [CI_PROPERTY]: ciValue
    };
  }
  const cli = getCliProcess(options);
  return cli.exec(processParams, userInput);
}
