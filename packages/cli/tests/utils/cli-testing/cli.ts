import { CliProcess, ProcessParams, Project, ProjectConfig, PromptTestOptions } from './types';
import { ExecaChildProcess, Options } from 'execa';
import { CI_PROPERTY } from '../../../src/lib/global/cli-mode/cli-mode';
import { CLI_MODES } from '../../../src/lib/global/cli-mode/types';
import { testProcessE2e } from './test-process-e2e';
import * as path from 'path';
import * as fs from 'fs';

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
      return testProcessE2e([bin, ...processParamsToParamsArray(processParams)], userInput, options, promptOptions);
    }
  };
}

export function handleCliModeEnvVars(cliMode: CLI_MODES): Record<string, string | undefined> {
  let ciValue: string | undefined = undefined;
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
  return { [CI_PROPERTY]: ciValue };
}

export function setupProject(cfg: ProjectConfig): Project {
  const { root, env, bin } = cfg;
  const process = getCliProcess({
    cwd: root,
    env
  }, bin);

  return {
    root,
    exec: (processParams: ProcessParams, userInput?: string[]): Promise<ExecaChildProcess> => {
      return process.exec(processParams, userInput);
    },
    deleteGeneratedFiles: (): void => {
      cfg?.delete && cfg.delete.forEach((file) => {
        const filePath = path.join(cfg.root, file);
        if(fs.existsSync(filePath)) {
          fs.rmSync(filePath);
        }
      });
    },
    createInitialFiles: (): void => {
      Object.entries(cfg?.create || {})
        .forEach(([file, content]) => {
        fs.writeFileSync(file, content, 'utf8');
      });
    }
  };
}
