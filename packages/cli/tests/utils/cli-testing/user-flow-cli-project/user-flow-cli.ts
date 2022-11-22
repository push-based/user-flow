import { ProcessParams, Project, ProjectConfig } from '../cli-project/types';
import { CliProject, getProject } from '../cli-project/cli';
import { getEnvPreset } from '../../../../src/lib/pre-set';
import * as path from 'path';
import { getFolderContent, handleCliModeEnvVars } from '../cli-project/utils';
import { UserFlowProject, UserFlowProjectConfig } from './types';
import { BASE_RC_JSON } from './data/user-flowrc.base';
import { RcJson } from '../../../../src/lib';


export function setupUserFlowProject(cfg: UserFlowProjectConfig): UserFlowProject {
  const { rcPath } = getEnvPreset();
  let { cliMode, ..._ } = cfg;
  const pCfg: ProjectConfig = _;

  // handle cfg defaults
  pCfg.delete = (pCfg?.delete || []);
  pCfg.create = (pCfg?.create || {});
  pCfg.rcFile = pCfg.rcFile || { [rcPath]: BASE_RC_JSON };


  // detect env vars by CLI mode
  cliMode = (cliMode || 'SANDBOX');
  cliMode && (pCfg.env = {
    ...pCfg.env,
    ...handleCliModeEnvVars(cliMode)
  } as any);


  // handle rcFiles and related
  if (typeof pCfg.rcFile === 'object' && Object.entries(pCfg.rcFile).length > 0) {
    let [_, rcJson] = Object.entries(pCfg.rcFile)[0] as [string, RcJson];
    const ufPath = path.join(pCfg.root, rcJson.collect.ufPath);
    const outPath = path.join(pCfg.root, rcJson.persist.outPath);
    pCfg.delete = pCfg?.delete.concat(getFolderContent([ufPath, outPath]));
  }

  const project = new CliProject(pCfg);
  return {
    exec: project.exec,
    deleteGeneratedFiles: project.deleteGeneratedFiles,
    createInitialFiles: project.createInitialFiles,
    setup: project.setup,
    teardown: project.teardown,
    $init: (processParams, userInput) => {
      const prcParams: ProcessParams = { _: 'init', ...processParams } as unknown as ProcessParams;
      return project.exec(prcParams, userInput);
    },
    $collect: (processParams, userInput) => {
      const prcParams: ProcessParams = { _: 'collect', ...processParams } as unknown as ProcessParams;
      return project.exec(prcParams, userInput);
    },
    readRcJson: (name = '') => {
      throw new Error('readFile is not implemented');
    }
  };
}
