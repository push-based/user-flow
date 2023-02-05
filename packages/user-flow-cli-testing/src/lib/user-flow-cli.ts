import { readdirSync, readFileSync } from 'fs';
import { join } from 'path';
import Budget from 'lighthouse/types/lhr/budget';
import { CliProject, getFolderContent, ProcessParams, TestResult, withProject, ProjectConfig } from '@push-based/node-cli-testing';
import {
  CollectCommandArgv,
  DEFAULT_PERSIST_OUT_PATH,
  getEnvPreset,
  GlobalOptionsArgv,
  InitCommandArgv,
  LhConfigJson,
  RcJson,
  ReportFormat
} from '@push-based/user-flow';
import { SANDBOX_BASE_RC_JSON } from './data/user-flowrc.base';
import { SERVE_COMMAND_PORT } from './data/constants';
import { kill } from './utils/kill';
import { UserFlowProjectConfig } from './types';
import { getEnvVarsByCliModeAndDeleteOld } from './utils/cli-mode';
import { DEFAULT_RC_NAME, LH_CONFIG_NAME_DEFAULT, LH_NAVIGATION_BUDGETS_NAME_DEFAULT } from './constants';

export class UserFlowCliProjectFactory {
  static async create(cfg: UserFlowProjectConfig): Promise<UserFlowCliProject> {
    const prj = new UserFlowCliProject();
    await prj._setup(cfg);
    return prj;
  }
}

type FileResult<T = string> = {
  content: string | {} | unknown[] | T,
  reportPath: string
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
    return JSON.parse(readFileSync(this.rcJsonPath(rcFileName)) as any);
  }

  rcJsonPath(rcFileName: string = DEFAULT_RC_NAME): string {
    return join(this.root, rcFileName);
  }

  readBudget(budgetName: string = LH_NAVIGATION_BUDGETS_NAME_DEFAULT): Budget[] {
    return JSON.parse(readFileSync(this.budgetPath(budgetName)) as any);
  }

  budgetPath(budgetName: string = LH_NAVIGATION_BUDGETS_NAME_DEFAULT): string {
    return join(this.root, budgetName);
  }

  readConfig(configName: string = LH_CONFIG_NAME_DEFAULT): LhConfigJson {
    return JSON.parse(readFileSync(this.configPath(configName)) as any);
  }

  configPath(configName: string = LH_CONFIG_NAME_DEFAULT): string {
    return join(this.root, configName);
  }

  readOutput(userFlowName: string, format: ReportFormat | undefined = undefined, rcFileName: string = DEFAULT_RC_NAME, ): FileResult[] {
    const outputFiles = readdirSync(this.outputPath());
    const reportPaths = outputFiles.filter((name) => {
      if (format) {
        return name.endsWith(format) && name.includes(name);
      }
      return name.includes(name);
    }) || userFlowName;
    return reportPaths.reduce((res, reportPath: string) => {
      let content = readFileSync(this.outputPath(reportPath, rcFileName)).toString('utf8');
      content = reportPath.includes('.json') ? JSON.parse(content) : content;
      res.push({ reportPath, content });
      return res;
    }, [] as FileResult[]);
  }

  outputPath(reportName: string = '', rcFileName: string = DEFAULT_RC_NAME): string {
    if(!this.rcFile[rcFileName]) {
      throw new Error(`Rc file "${rcFileName}" does not exist in: ${Object.keys(this.rcFile).join(', ')}`);
    }
    return join(this.root, this.rcFile[rcFileName].persist.outPath, reportName);
  }

  readUserFlow(userFlowName: string = DEFAULT_PERSIST_OUT_PATH, rcFileName: string = DEFAULT_RC_NAME): string[][] {
    const flowPath = this.userFlowPath(userFlowName, rcFileName);
    const files = getFolderContent([flowPath]);
    return files.map(f => ([f, readFileSync(flowPath).toString('utf8')]));
  }

  userFlowPath(userFlowName: string = '', rcFileName: string = DEFAULT_RC_NAME): string {
    return join(this.root, this.rcFile[rcFileName].collect.ufPath, userFlowName);
  }

}

export function withUserFlowProject<T extends {}>(
  cfg: ProjectConfig<T>,
  fn: (prj: UserFlowCliProject) => Promise<void>
): () => Promise<void> {
  return withProject<T>(cfg, fn as any, UserFlowCliProjectFactory.create as any);
}
