import { ExecFn, ProcessParams, Project, ProjectConfig } from './types';
import { ExecaChildProcess } from 'execa';
import { getCliProcess, setupProject } from './cli';
import { InitCommandArgv } from '../../../src/lib/commands/init/options/types';
import { getEnvPreset } from '../../../src/lib/pre-set';
import { GlobalOptionsArgv } from '../../../src/lib/global/options/types';
import * as path from 'path';
import { getFolderContent } from './utils';
import { CollectCommandArgv } from '../../../src/lib/commands/collect/options/types';


export type UserFlowProject = Project & {
  $init: ExecFn<Partial<InitCommandArgv & GlobalOptionsArgv>>,
  $collect: ExecFn<Partial<CollectCommandArgv & GlobalOptionsArgv>>,
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
  }, { bin });

  return {
    ...setupProject(cfg),
    $init: (processParams, userInput) => {
      const prcParams: ProcessParams = { _: 'init', ...processParams } as unknown as ProcessParams;
      return process.exec(prcParams, userInput);
    },
    $collect: (processParams, userInput) => {
      const prcParams: ProcessParams = { _: 'collect', ...processParams } as unknown as ProcessParams;
      return process.exec(prcParams, userInput);
    },
    readRcJson: (name = '') => {
      //name = name || getEnvPreset().rcPath;
      throw new Error('readFile is not implemented');
    }
  };
}
