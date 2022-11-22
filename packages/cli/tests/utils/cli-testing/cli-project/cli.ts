import { CliProcess, ProcessParams, ProcessTestOptions, Project, ProjectConfig} from './types';
import { ExecaChildProcess, Options } from 'execa';
import { testProcessE2e } from '../process/test-process-e2e';
import { getFolderContent, processParamsToParamsArray } from './utils';
import * as path from 'path';
import * as fs from 'fs';
import { PromptTestOptions } from '../process/types';
import { getEnvPreset } from '../../../../src/lib/pre-set';

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
  // normalize config
  cfg.delete = cfg?.delete || [];
  cfg.create = cfg?.create || {};

  let { root, env, bin, rcFile } = cfg;
  let [rcName] = Object.entries(rcFile || {})[0];
  const process = getCliProcess({
    cwd: root,
    env
  }, { bin });

  // handle default rcPath
  rcName = rcName || getEnvPreset().rcPath;
  if(rcName !== undefined) {
    cfg.delete.push(path.join(root, rcName));
  }

  return {
    root,
    exec: (processParams?: ProcessParams, userInput?: string[]): Promise<ExecaChildProcess> => {
      return process.exec(processParams, userInput);
    },
    deleteGeneratedFiles: (): void => {
      // normalize delete
      cfg?.delete && cfg.delete
        .forEach((file) => {
          if(fs.existsSync(file)) {
            fs.rmSync(file);
          } else {
            console.log(`File ${file} does not exist`)
          }
      });
    },
    createInitialFiles: async () => {
      Object.entries(cfg?.create || {})
        .map(entry => {
          entry[0] = path.join(cfg.root, entry[0]);
          return entry;
        })
        .forEach(([file, content]) => {
        fs.writeFileSync(file, JSON.stringify(content), 'utf8');
      });
    }
  };
}
