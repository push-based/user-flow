import { getCliProcess, handleCliModeEnvVars } from './cli';
import { ExecaChildProcess, Options } from 'execa';
import { CI_PROPERTY } from '../../../src/lib/global/cli-mode/cli-mode';
import { CLI_MODES } from '../../../src/lib/global/cli-mode/types';
import { CLI_PATH } from '../../fixtures/cli-bin-path';


/**
 * @param {string[]} processParams CLI args to pass in
 * @param {string[]} userInput answers to be passed to stdout
 * @param {Object} [options] specify the testPath and timeout
 *
 * returns {Promise<Object>}
 */
export function cliPromptTest(processParams: string[], userInput: string[], options: Options, cliMode: CLI_MODES = 'SANDBOX'): Promise<ExecaChildProcess> {
  let opt = { ...options };

  let ciValue: string = handleCliModeEnvVars(cliMode);
  if (ciValue) {
    opt['env'] = {
      [CI_PROPERTY]: ciValue
    };
  }
  const p = processParams.filter(i => i === CLI_PATH);
  const cli = getCliProcess(opt, CLI_PATH);
  return cli.exec({_: p.join(' ')}, userInput);
}
