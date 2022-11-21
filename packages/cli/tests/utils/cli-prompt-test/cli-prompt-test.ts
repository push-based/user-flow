import { cliPromptTest as _cliPromptTest, PromptTestOptions } from './raw';
import { ExecaChildProcess, Options } from 'execa';
import { CI_PROPERTY } from '../../../src/lib/global/cli-mode/cli-mode';
import { CLI_MODES } from '../../../src/lib/global/cli-mode/types';


export type ProcessParams = {
  // command placeholder
  _ : string,
  [key as string ]: string | string[]
}

function processParamsToParamsArray(params: ProcessParams): string[] {
  Object.entries(params).map(([key, value]) => {
    if(key === '_') {
      return value;
    } else if(Array.isArray(value)) {
      return value.map(v => `--${k}=${v}`);
    } else {
      return `--${k}=${v}`;
    }
  });
}

export type CliProcess = {
  exec: (processParams: string[], userInput: string[]) => Promise<ExecaChildProcess>
}
type ExecFn = (processParams: ProcessParams, userInput: string[], promptOptions: PromptTestOptions) => Promise<ExecaChildProcess>;
/**
 *
 * @param options: passed directly to execa as options
 */
export function getCliProcess(options: Options): CliProcess {
  return {
    exec: (processParams: string[], userInput: string[], promptOptions: PromptTestOptions = {}): Promise<ExecaChildProcess>  => {
      return _cliPromptTest(processParams, userInput, options, promptOptions);
    }
  };
}

function handleCliModeEnvVars(cliMode: CLI_MODES): string {
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
  return ciValue;
}


export type Project = {
  root: string,
  readFile: () => string,
  exec: ExecFn
}

type ProjectConfig = {
  root: string,
  cliMode: CLI_MODES,
  execName: string
  // the process env of the created process
  env: Record<string, string>,
}

export function setupProject(cfg: ProjectConfig): Project {
  const process = getCliProcess({
    cwd: cfg.root
  });

  return {
    root: cfg.root,
    exec: (processParams, userInput, promptOptions) => {
      process.exec()
    }
  } as Project;
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
  processParamsToParamsArray()
  return cli.exec(processParams, userInput);
}

export function promptTest(processParams: ProcessParams, userInput: string[], options: Options, cliMode: CLI_MODES = 'SANDBOX'): Promise<ExecaChildProcess<string>> {
  let opt = {...options};

  let ciValue: string = handleCliModeEnvVars(cliMode);
  if (ciValue) {
    opt['env'] = {
      [CI_PROPERTY]: ciValue
    };
  }
  const cli = getCliProcess(opt);
  return cli.exec(processParamsToParamsArray(processParams), userInput);
}
