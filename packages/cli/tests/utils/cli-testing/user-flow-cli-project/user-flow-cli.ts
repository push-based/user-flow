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
import { kill } from '../../kill';
import { SERVE_COMMAND_PORT } from './constants';

export class UserFlowCliProjectFactory {
  static async create(cfg: UserFlowProjectConfig): Promise<UserFlowCliProject> {
    const prj = new UserFlowCliProject();
    await prj._setup(cfg);
    await new Promise(r => setTimeout(r,30000));
    return prj;
  }
}

export class UserFlowCliProject extends CliProject {
  envPreset = getEnvPreset();
  serveCommandPort = SERVE_COMMAND_PORT;

  constructor() {
    super();
  }

  override async _setup(cfg: UserFlowProjectConfig): Promise<void> {
    // console.log('cfg1: ', cfg);
    cfg.delete = (cfg?.delete || []);
    cfg.create = (cfg?.create || {});
    cfg.rcFile = cfg.rcFile || { [this.envPreset?.rcPath]: BASE_RC_JSON };

    cfg.cliMode = (cfg.cliMode || 'SANDBOX');
    cfg.cliMode && (cfg.env = {
      ...cfg.env,
      ...getEnvVarsByCliModeAndDeleteOld(cfg.cliMode)
    } as any);

    // console.log('cfg: ', cfg);
    // handle rcFiles and related deletions
    if (typeof cfg.rcFile === 'object' && Object.entries(cfg.rcFile).length > 0) {
      Object.entries(cfg.rcFile).forEach(([_, rcJson]: [string, RcJson]) => {
        const ufPath = path.join(cfg.root, rcJson.collect.ufPath);
        const outPath = path.join(cfg.root, rcJson.persist.outPath);
        cfg.delete = cfg?.delete?.concat(getFolderContent([ufPath, outPath])) || [];
      });
    }
    return super._setup(cfg);
  }

  override async teardown(): Promise<void> {
    await super.teardown();
    await kill({ port: this.serveCommandPort });
  }

  $init(processParams?: Partial<InitCommandArgv & GlobalOptionsArgv>, userInput?: string[]): Promise<ExecaChildProcess> {
    const prcParams: ProcessParams = { _: 'init', ...processParams } as unknown as ProcessParams;
    // If a rcFile is created delete it on teardown
    this.deleteFiles.push(path.join(this.root, (processParams?.rcPath || this.envPreset?.rcPath)));
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
