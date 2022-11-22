import { ExecaChildProcess, Options } from 'execa';
import { CLI_MODES } from '../../../src/lib/global/cli-mode/types';
import { getCliProcess } from '../cli-testing/cli-project/cli';
import { getEnvVarsByCliModeAndDeleteOld } from '../cli-testing/cli-project/utils';

/**
 * @param {string[]} processParams CLI args to pass in
 * @param {string[]} userInput answers to be passed to stdout
 * @param {Object} [options] specify the testPath and timeout
 *
 * returns {Promise<Object>}
 */
export function cliPromptTest(processParams: string[], userInput: string[], options: Options, cliMode: CLI_MODES = 'SANDBOX'): Promise<ExecaChildProcess<string>> {
  let opt = {...options};
  opt['env'] = getEnvVarsByCliModeAndDeleteOld(cliMode)
  const cli = getCliProcess(opt);
  return cli.exec(processParams, userInput);
}
