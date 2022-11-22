import { CliCommand, CliProcess, ExecFn, ProcessParams, ProcessTestOptions, Project, ProjectConfig } from './types';
import { ExecaChildProcess, Options } from 'execa';
import { testProcessE2e } from '../process/test-process-e2e';
import { getFolderContent, processParamsToParamsArray } from './utils';
import * as path from 'path';
import * as fs from 'fs';
import { PromptTestOptions } from '../process/types';
import { getEnvPreset } from '../../../../src/lib/pre-set';
import { type } from 'os';
import { RcJson } from '../../../../src/lib';

/**
 * A closure for the testProcessE2e function to seperate process configuration and testing config from test data.
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

export function getProject(cfg: ProjectConfig): Project {
  // normalize config
  cfg.delete = cfg?.delete || [];
  cfg.create = cfg?.create || {};

  let { root, env, bin, rcFile } = cfg;

  // handle default rcPath
  if (typeof rcFile === 'object' && Object.entries(rcFile).length > 0) {
    let [rcName, rcContent] = Object.entries(rcFile)[0] as [string, RcJson];
    cfg.delete.push(path.join(root, rcName));
    cfg.create = { ...cfg.create, [rcName]: JSON.stringify(rcContent) };
  }

  const process = getCliProcess({
    cwd: cfg.root,
    env
  }, { bin });

  return {
    exec: (processParams?: ProcessParams, userInput?: string[]): Promise<ExecaChildProcess> => {
      return process.exec(processParams, userInput);
    },
    deleteGeneratedFiles: (): void => {
      // normalize delete
      cfg?.delete && cfg.delete
        .forEach((file) => {
          if (fs.existsSync(file)) {
            fs.rmSync(file);
          } else {
            // console.log(`File ${file} does not exist`)
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
          if (!fs.existsSync(file)) {
            fs.writeFileSync(file, content, 'utf8');
          } else {
            // console.log(`File ${file} already exist`)
          }
        });
    },
    setup: () => {
      throw new Error('not implemented');
    },
    teardown: () => {
      throw new Error('not implemented');
    }
  };
}
