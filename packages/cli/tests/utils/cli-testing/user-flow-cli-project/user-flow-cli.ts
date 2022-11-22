import { ProcessParams } from '../cli-project/types';
import { CliProject } from '../cli-project/cli';
import { getEnvPreset } from '../../../../src/lib/pre-set';
import * as path from 'path';
import { getEnvVarsByCliModeAndDeleteOld, getFolderContent } from '../cli-project/utils';
import { UserFlowProjectConfig } from './types';
import { BASE_RC_JSON } from './data/user-flowrc.base';
import { RcJson } from '../../../../src/lib';
import { InitCommandArgv } from '../../../../src/lib/commands/init/options/types';
import { GlobalOptionsArgv } from '../../../../src/lib/global/options/types';
import { ExecaChildProcess } from 'execa';
import { CollectCommandArgv } from '../../../../src/lib/commands/collect/options/types';

export class UserFlowCliProject extends CliProject {

  constructor(cfg: UserFlowProjectConfig) {

    cfg.delete = (cfg?.delete || []);
    cfg.create = (cfg?.create || {});
    const { rcPath } = getEnvPreset();
    cfg.rcFile = cfg.rcFile || { [rcPath]: BASE_RC_JSON };

    let { cliMode } = cfg;
    cliMode = (cliMode || 'SANDBOX');
    cliMode && (cfg.env = {
      ...cfg.env,
      ...getEnvVarsByCliModeAndDeleteOld(cliMode)
    } as any);

    // handle rcFiles and related deletions
    if (typeof cfg.rcFile === 'object' && Object.entries(cfg.rcFile).length > 0) {
      let [_, rcJson] = Object.entries(cfg.rcFile)[0] as [string, RcJson];
      const ufPath = path.join(cfg.root, rcJson.collect.ufPath);
      const outPath = path.join(cfg.root, rcJson.persist.outPath);
      cfg.delete = cfg?.delete?.concat(getFolderContent([ufPath, outPath])) || [];
    }

    super(cfg);

  }

  $init(processParams?: Partial<InitCommandArgv & GlobalOptionsArgv>, userInput?: string[]): Promise<ExecaChildProcess> {
    const prcParams: ProcessParams = { _: 'init', ...processParams } as unknown as ProcessParams;
    return this.exec(prcParams, userInput);
  }

  $collect(processParams?: Partial<CollectCommandArgv & GlobalOptionsArgv>, userInput?: string[]): Promise<ExecaChildProcess> {
    const prcParams: ProcessParams = { _: 'collect', ...processParams } as unknown as ProcessParams;
    return this.exec(prcParams, userInput);
  }

  readRcJson(name = ''): RcJson {
    throw new Error('readFile is not implemented');
  }


}
