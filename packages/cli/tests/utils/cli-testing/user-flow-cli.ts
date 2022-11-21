import { ProcessParams, Project, ProjectConfig } from './types';
import { ExecaChildProcess } from 'execa';
import { getCliProcess, setupProject } from './cli';
import { InitArgvOptions } from '../../../src/lib/commands/init/options/types';

export function setupUserFlowProject(cfg: ProjectConfig): Project {
  const { root, env, bin } = cfg;
  const process = getCliProcess({
    cwd: root,
    env
  }, bin);

  return {
    ...setupProject(cfg),
    init: (processParams: InitArgvOptions, userInput?: string[]): Promise<ExecaChildProcess> => {
      return process.exec({ _: 'init',...processParams }, userInput);
    },
    collect: (processParams: InitArgvOptions, userInput?: string[]): Promise<ExecaChildProcess> => {
      return process.exec({ _: 'collect',...processParams }, userInput);
    },
    readRcJson: (name: string = ''): string =>  {
      name = name || getEnvPreset().rcPath;
      throw new Error('readFile is not implemented');
    }
  };
}
