import { ProcessParams, ProjectConfig } from '../cli-project/types';
import { getCliProcess, setupProject } from '../cli-project/cli';
import { getEnvPreset } from '../../../../src/lib/pre-set';
import * as path from 'path';
import { getFolderContent } from '../cli-project/utils';
import { UserFlowProject } from './types';


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
