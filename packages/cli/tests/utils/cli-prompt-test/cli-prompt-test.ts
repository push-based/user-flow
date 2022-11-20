import { cliPromptTest as _cliPromptTest } from './raw';
import { ExecaChildProcess, Options } from 'execa';
import { CI_PROPERTY } from '../../../src/lib/global/cli-mode/cli-mode';
import { CLI_MODES } from '../../../src/lib/global/cli-mode/types';

export type CliProcess = {
  exec: (processParams: string[], userInput: string[]) => Promise<ExecaChildProcess>
}
/**
 *
 * @param options: passed directly to execa as options
 */
export function getCliProcess(options: Options, promptOptions?: {timeout: number}): CliProcess {
  return {
    exec: (processParams: string[], userInput: string[]): Promise<ExecaChildProcess>  => {
      return _cliPromptTest(processParams, userInput, options, promptOptions);
    }
  };
}

function handleCliModeEnvVars(cliMode: CLI_MODES): string {
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
}

/**
 * @param {string[]} processParams CLI args to pass in
 * @param {string[]} userInput answers to be passed to stdout
 * @param {Object} [options] specify the testPath and timeout
 *
 * returns {Promise<Object>}
 */
export function cliPromptTest(processParams: string[], userInput: string[], options: Options, cliMode: CLI_MODES = 'SANDBOX'): Promise<ExecaChildProcess<string>> {
  let opt = {...options};

  let ciValue: string = handleCliModeEnvVars(cliMode);
  if (ciValue) {
    opt['env'] = {
      [CI_PROPERTY]: ciValue
    };
  }
  const cli = getCliProcess(opt);
  return cli.exec(processParams, userInput);
}
