import { CliProcess, ProcessParams, ProcessTestOptions, Project, ProjectConfig} from './types';
import { ExecaChildProcess, Options } from 'execa';
import { testProcessE2e } from '../process/test-process-e2e';
import { processParamsToParamsArray } from './utils';
import * as path from 'path';
import * as fs from 'fs';
import { PromptTestOptions } from '../process/types';

/**
 *
 * @param processOptions: passed directly to execa as options
 */
export function getCliProcess(processOptions: Options, promptTestOptions: PromptTestOptions & ProcessTestOptions): CliProcess {
  return {
    exec: (processParams: ProcessParams = {}, userInput: string[] = []): Promise<ExecaChildProcess> => {
      return testProcessE2e([promptTestOptions.bin, ...processParamsToParamsArray(processParams)], userInput, processOptions, promptTestOptions);
    }
  };
}

export function setupProject(cfg: ProjectConfig): Project {
  const { root, env, bin } = cfg;
  const process = getCliProcess({
    cwd: root,
    env
  }, { bin });

  return {
    root,
    exec: (processParams?: ProcessParams, userInput?: string[]): Promise<ExecaChildProcess> => {
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
