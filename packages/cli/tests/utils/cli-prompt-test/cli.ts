import { cliPromptTest as _cliPromptTest, PromptTestOptions } from './raw';
import { CliProcess, ProcessParams, Project, ProjectConfig } from './types';
import { ExecaChildProcess, Options } from 'execa';
import { CI_PROPERTY } from '../../../src/lib/global/cli-mode/cli-mode';
import { CLI_MODES } from '../../../src/lib/global/cli-mode/types';
import * as path from 'path';

export function processParamsToParamsArray(params: ProcessParams): string[] {
  return Object.entries(params).map(([key, value]) => {
    if (key === '_') {
      return value.toString();
    } else if (Array.isArray(value)) {
      return value.map(v => `--${key}=${v.toString()}`);
    } else {
      if (typeof value === 'string') {
        return `--${key}=${value + ''}`;
      } else if (typeof value === 'boolean') {
        return `--${value ? '' : 'no-'}${key}`;
      }
      return `--${key}=${value + ''}`;
    }
  }) as string[];
}

/**
 *
 * @param options: passed directly to execa as options
 */
export function getCliProcess(options: Options, bin: string): CliProcess {
  return {
    exec: (processParams: ProcessParams, userInput?: string[], promptOptions: PromptTestOptions = {}): Promise<ExecaChildProcess> => {
      return _cliPromptTest([bin, ...processParamsToParamsArray(processParams)], userInput, options, promptOptions);
    }
  };
}

export function handleCliModeEnvVars(cliMode: CLI_MODES): string {
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

export function setupProject({ root, env, bin }: ProjectConfig): Project {
  const process = getCliProcess({
    cwd: root,
    env
  }, bin);

  return {
    root,
    exec: (processParams: ProcessParams, userInput?: string[]): Promise<ExecaChildProcess> => {
      return process.exec(processParams, userInput);
    },
    readFile: (): string =>  {
      throw new Error('readFile is not implemented');
    }
  };
}
