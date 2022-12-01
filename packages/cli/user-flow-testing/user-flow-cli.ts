import * as fs from 'fs';
import * as path from 'path';
import { kill } from './utils/kill';
import Budget from 'lighthouse/types/lhr/budget';
import { SANDBOX_BASE_RC_JSON } from './data/user-flowrc.base';
import { CliProject, ProcessParams, TestResult } from 'cli-testing-lib';
import { LH_NAVIGATION_BUDGETS_NAME, SERVE_COMMAND_PORT, DEFAULT_RC_NAME, CI_PROPERTY } from './constants';
import { UserFlowProjectConfig } from './types';
import { RcJson } from '../src/lib/types';
import { InitCommandArgv } from '../src/lib/commands/init/options/types';
import { GlobalOptionsArgv } from '../src/lib/global/options/types';
import { CollectCommandArgv } from '../src/lib/commands/collect/options/types';
import { CLI_MODES } from '../src/lib/global/cli-mode/types';
import { getEnvPreset } from '../src/lib/pre-set';

export class UserFlowCliProjectFactory {
  static async create(cfg: UserFlowProjectConfig): Promise<UserFlowCliProject> {
    const prj = new UserFlowCliProject();
    await prj._setup(cfg);
    // await new Promise(r => setTimeout(r, 30000));
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
        cfg.create = cfg?.create || {};
        cfg.create['./' + rcJson.collect.ufPath] = undefined;
        cfg.create['./' + rcJson.persist.outPath] = undefined;
        cfg.delete = cfg?.delete?.concat([rcJson.collect.ufPath, rcJson.persist.outPath]) || [];
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
    this.deleteFiles.push(processParams?.rcPath || this.envPreset?.rcPath);

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

  readBudget(budgetName: string = LH_NAVIGATION_BUDGETS_NAME): Budget[] {
    return JSON.parse(fs.readFileSync(path.join(this.root, budgetName)) as any);
  }

  budgetPath(budgetName: string = LH_NAVIGATION_BUDGETS_NAME): string {
    return path.join(this.root, budgetName);
  }

  readOutput(reportName: string, rcFileName: string = DEFAULT_RC_NAME): string | {} {
    const content = fs.readFileSync(this.outputPath(reportName, rcFileName)).toString('utf8');
    return reportName.includes('.json') ? JSON.parse(content) : content;
  }

  outputPath(reportName: string = '', rcFileName: string = DEFAULT_RC_NAME): string {
    return path.join(this.root, this.rcFile[rcFileName].persist.outPath, reportName);
  }

  readUserFlow(userFlowName: string, rcFileName: string = DEFAULT_RC_NAME): string {
    return fs.readFileSync(this.userFlowPath(userFlowName, rcFileName)).toString('utf8');
  }

  userFlowPath(userFlowName: string = '', rcFileName: string = DEFAULT_RC_NAME): string {
    return path.join(this.root, this.rcFile[rcFileName].collect.ufPath, userFlowName);
  }

}

function getEnvVarsByCliModeAndDeleteOld(cliMode: CLI_MODES): Record<string, string | undefined> {

  if (cliMode === 'DEFAULT') {
    delete process.env[CI_PROPERTY];
    return {};
  }

  // CI mode value
  let ciValue = 'true';
  if (cliMode === 'SANDBOX') {
    // emulate sandbox env by setting CI to SANDBOX
    ciValue = 'SANDBOX';
  }
  return { [CI_PROPERTY]: ciValue };
}
