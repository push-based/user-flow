import * as fs from 'fs';
import * as path from 'path';
import Budget from 'lighthouse/types/lhr/budget';
import { CliProject, getFolderContent, ProcessParams, TestResult } from '@push-based/cli-testing';
import {
  CollectCommandArgv,
  DEFAULT_PERSIST_OUT_PATH,
  DEFAULT_RC_NAME,
  getEnvPreset,
  GlobalOptionsArgv,
  InitCommandArgv,
  LhConfigJson,
  RcJson
} from '@push-based/user-flow';
import { SANDBOX_BASE_RC_JSON } from './data/user-flowrc.base';
import { SERVE_COMMAND_PORT } from './data/constants';
import { kill } from './utils/kill';
import { UserFlowProjectConfig } from './types';
import { getEnvVarsByCliModeAndDeleteOld } from './utils/cli-mode';
import { LH_CONFIG_NAME_DEFAULT, LH_NAVIGATION_BUDGETS_NAME_DEFAULT } from './constants';

export class UserFlowCliProjectFactory {
  static async create(cfg: UserFlowProjectConfig): Promise<UserFlowCliProject> {
    const prj = new UserFlowCliProject();
    await prj._setup(cfg);
    return prj;
  }
}

export class UserFlowCliProject extends CliProject<RcJson> {
  envPreset = getEnvPreset();
  serveCommandPort = SERVE_COMMAND_PORT;

  constructor() {
    super();
  }

  override async _setup(cfg: UserFlowProjectConfig): Promise<void> {
    cfg.delete = (cfg?.delete || []);
    cfg.create = (cfg?.create || {});
    // if no value is provided we add the default rc file to the map
    cfg.rcFile = cfg.rcFile || { [this.envPreset?.rcPath]: SANDBOX_BASE_RC_JSON };

    cfg.cliMode = (cfg.cliMode || 'SANDBOX');
    cfg.cliMode && (cfg.env = {
      ...cfg.env,
      ...getEnvVarsByCliModeAndDeleteOld(cfg.cliMode)
    } as any);

    // console.log('cfg: ', cfg);
    // handle user-flow related output folders defined in rcFiles and related configurations
    // the rc file creation is done in the CliProject class
    if (typeof cfg.rcFile === 'object' && Object.entries(cfg.rcFile).length > 0) {
      Object.entries(cfg.rcFile).forEach(([_, rcJson]) => {
        const ufPath: string = (rcJson as RcJson).collect.ufPath;
        const outPath: string = (rcJson as RcJson).persist.outPath;
        cfg.create = cfg?.create || {};
        cfg.create['./' + ufPath] = undefined;
        cfg.create['./' + outPath] = undefined;
        cfg.delete = cfg?.delete?.concat([ufPath, outPath]) || [];
      });
    }
    this.logVerbose('Cfg after user-flow operations: ', cfg);
    return super._setup(cfg);
  }

  override async teardown(): Promise<void> {
    await super.teardown();
    await kill({ port: this.serveCommandPort });
  }

  $init(processParams?: Partial<InitCommandArgv & GlobalOptionsArgv>, userInput?: string[]): Promise<TestResult> {
    const prcParams: ProcessParams = { _: 'init', ...processParams } as unknown as ProcessParams;
    // If a rcFile is created delete it on teardown
    this.deleteFiles.push(prcParams['rcPath'] || this.envPreset?.rcPath);

    return this.exec(prcParams, userInput);
  }

  $collect(processParams?: Partial<CollectCommandArgv & GlobalOptionsArgv>, userInput?: string[]): Promise<TestResult> {
    const prcParams: ProcessParams = { _: 'collect', ...processParams } as unknown as ProcessParams;
    return this.exec(prcParams, userInput);
  }

  readRcJson(rcFileName: string = DEFAULT_RC_NAME): RcJson {
    return JSON.parse(fs.readFileSync(this.rcJsonPath(rcFileName)) as any);
  }

  rcJsonPath(rcFileName: string = DEFAULT_RC_NAME): string {
    return path.join(this.root, rcFileName);
  }

  readBudget(budgetName: string = LH_NAVIGATION_BUDGETS_NAME_DEFAULT): Budget[] {
    return JSON.parse(fs.readFileSync(this.budgetPath(budgetName)) as any);
  }

  budgetPath(budgetName: string = LH_NAVIGATION_BUDGETS_NAME_DEFAULT): string {
    return path.join(this.root, budgetName);
  }

  readConfig(configName: string = LH_CONFIG_NAME_DEFAULT): LhConfigJson {
    return JSON.parse(fs.readFileSync(this.configPath(configName)) as any);
  }

  configPath(configName: string = LH_CONFIG_NAME_DEFAULT): string {
    return path.join(this.root, configName);
  }

  readOutput(userFlowName: string, rcFileName: string = DEFAULT_RC_NAME): string | {} {
    const outputFiles = fs.readdirSync(this.outputPath());
    const reportName = outputFiles.find((name) => name.includes(name)) || userFlowName;
    const content = fs.readFileSync(this.outputPath(reportName, rcFileName)).toString('utf8');
    return reportName.includes('.json') ? JSON.parse(content) : content;
  }

  outputPath(reportName: string = '', rcFileName: string = DEFAULT_RC_NAME): string {
    return path.join(this.root, this.rcFile[rcFileName].persist.outPath, reportName);
  }

  readUserFlow(userFlowName: string = DEFAULT_PERSIST_OUT_PATH, rcFileName: string = DEFAULT_RC_NAME): string[][] {
    const flowPath = this.userFlowPath(userFlowName, rcFileName);
    const files = getFolderContent([flowPath]);
    return files.map(f => ([f, fs.readFileSync(flowPath).toString('utf8')]));
  }

  userFlowPath(userFlowName: string = '', rcFileName: string = DEFAULT_RC_NAME): string {
    return path.join(this.root, this.rcFile[rcFileName].collect.ufPath, userFlowName);
  }

}
