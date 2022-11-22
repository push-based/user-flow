import { ProcessParams, ProjectConfig } from '../cli-project/types';
import { getCliProcess, setupProject } from '../cli-project/cli';
import { getEnvPreset } from '../../../../src/lib/pre-set';
import * as path from 'path';
import { getFolderContent } from '../cli-project/utils';
import { UserFlowProject } from './types';
import { BASE_RC_JSON } from './data/user-flowrc.base';


export function setupUserFlowProject(cfg: ProjectConfig): UserFlowProject {
  const { rcPath } = getEnvPreset();

  // handle cfg defaults
  cfg.delete = (cfg?.delete || []);
  cfg.rcFile = cfg.rcFile || {[rcPath+'']: BASE_RC_JSON};

  let { root, rcFile } = cfg;
  const [rcName, rcContent] = Object.entries(rcFile)[0];

  // create files
  cfg.create = {...cfg.create, [rcName]: rcContent};
  // delete files
  cfg.delete = cfg.delete.concat(getFolderContent([path.join(root, rcContent.collect.ufPath), path.join(root, rcContent.persist.outPath)]));

  const process = setupProject(cfg);
  return {
    ...process,
    $init: (processParams, userInput) => {
      const prcParams: ProcessParams = { _: 'init', ...processParams } as unknown as ProcessParams;
      return process.exec(prcParams, userInput);
    },
    $collect: (processParams, userInput) => {
      const prcParams: ProcessParams = { _: 'collect', ...processParams } as unknown as ProcessParams;
      return process.exec(prcParams, userInput);
    },
    readRcJson: (name = '') => {
      console.log();
      throw new Error('readFile is not implemented');
    }
  };
}
