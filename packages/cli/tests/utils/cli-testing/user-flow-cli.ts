import { ExecFn, ProcessParams, Project, ProjectConfig, UserFlowProject } from './types';
import { ExecaChildProcess } from 'execa';
import { getCliProcess, setupProject } from './cli';
import { InitArgvOptions } from '../../../src/lib/commands/init/options/types';
import { getEnvPreset } from '../../../src/lib/pre-set';
import { GlobalOptionsArgv } from '../../../src/lib/global/options/types';
import * as path from 'path';
import { getFolderContent } from './utils';


export type UserFlowProject = Project & {
  $init: ExecFn<any>,
  readRcJson: (name: string) => string
}

export function setupUserFlowProject(cfg: ProjectConfig): UserFlowProject {
  cfg.delete = (cfg?.delete || []);

  const { root, env, bin } = cfg;
  const { ufPath, outPath, rcPath } = getEnvPreset();

  // .rc.json
  (rcPath && cfg.delete.push(rcPath));
  // all files of user flow related folders
  cfg.delete = cfg.delete.concat(getFolderContent([ufPath + '', outPath + '']
    .filter(v => !!v).map((d) => path.join(root, d))));

  const process = getCliProcess({
    cwd: root,
    env
  }, bin);

  return {
    ...setupProject(cfg),
    $init: (processParams: InitArgvOptions & GlobalOptionsArgv, userInput?: string[]): Promise<ExecaChildProcess> => {
      const prcParams: ProcessParams = { _: 'init', ...processParams } as unknown as ProcessParams;
      return process.exec(prcParams, userInput);
    },
    readRcJson: (name: string = ''): string => {
      //name = name || getEnvPreset().rcPath;
      throw new Error('readFile is not implemented');
    }
  };
}
