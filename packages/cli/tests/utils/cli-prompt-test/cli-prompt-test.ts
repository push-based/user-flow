import { ExecaChildProcess, Options } from 'execa';
import { CI_PROPERTY } from '../../../src/lib/global/cli-mode/cli-mode';
import { CLI_MODES } from '../../../src/lib/global/cli-mode/types';
import { getCliProcess, handleCliModeEnvVars } from '../cli-testing/cli';

/**
 * @param {string[]} processParams CLI args to pass in
 * @param {string[]} userInput answers to be passed to stdout
 * @param {Object} [options] specify the testPath and timeout
 *
 * returns {Promise<Object>}
 */
export function cliPromptTest(processParams: string[], userInput: string[], options: Options, cliMode: CLI_MODES = 'SANDBOX'): Promise<ExecaChildProcess<string>> {
  let opt = {...options};
  opt['env'] = handleCliModeEnvVars(cliMode)
  const cli = getCliProcess(opt);
  return cli.exec(processParams, userInput);
}
