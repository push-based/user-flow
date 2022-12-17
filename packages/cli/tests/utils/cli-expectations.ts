import * as fs from 'fs';
import { RcJson } from '@push-based/user-flow';
import FlowResult from 'lighthouse/types/lhr/flow';
import Budget from 'lighthouse/types/lhr/budget';
import { SETUP_CONFIRM_MESSAGE } from '../../src/lib/commands/init/constants';
import { GlobalOptionsArgv } from '../../src/lib/global/options/types';

function unquoted(k: string, v: string): string {
  return `${k}: ${v}`;
}

function quoted(k: string, v: string): string {
  return `${k}: '${v}'`;
}

function array(k: string, v: string[]): string {
  let values = (v).map(i => '\'' + i + '\'').join(', ');
  values = values !== '' ? ' ' + values + ' ' : values;
  return `${k}: [${values}]`;
}


export function expectInitOptionsToBeContainedInStdout(stdout: string, cliParams: {}) {
  expect(stdout).toContain(`Init options:`);
  Object.entries(cliParams).forEach(([k, v]) => {
    switch (k) {
      // collect
      case 'url':
      case 'ufPath':
      case 'outPath':
      case 'serveCommand':
      case 'awaitServeStdout':
      case 'budgetPath':
        expect(stdout).toContain(`${k}: '${v}'`);
        break;
      case 'format':
        let values = (v as any[]).map(i => '\'' + i + '\'').join(', ');
        values = values !== '' ? ' ' + values + ' ' : values;
        expect(stdout).toContain(`${k}: [${values}]`);
        break;
      case 'openReport':
      case 'dryRun':
        expect(stdout).toContain(`${k}: ${v}`);
        break;
      default:
        throw new Error(`${k} handling not implemented for init configuration check`);
        break;
    }
  });
}

export function expectCollectCfgToContain(stdout: string, cliParams: {}) {
  expect(stdout).toContain(`Collect options:`);
  Object.entries(cliParams).forEach(([k, v]) => {
    switch (k) {
      // collect
      case 'url':
      case 'ufPath':
      case 'outPath':
      case 'serveCommand':
      case 'awaitServeStdout':
      case 'budgetPath':
      case 'configPath':
        expect(stdout).toContain(`${k}: '${v}'`);
        break;
      case 'format':
        let values = (v as any[]).map(i => '\'' + i + '\'').join(', ');
        values = values !== '' ? ' ' + values + ' ' : values;
        expect(stdout).toContain(`${k}: [${values}]`);
        break;
      case 'openReport':
      case 'dryRun':
        expect(stdout).toContain(`${k}: ${v}`);
        break;
      default:
        throw new Error(`${k} handling not implemented for collect configuration check`);
        break;
    }
  });
}

export function expectGlobalOptionsToBeContainedInStdout(stdout: string, globalParams: Partial<GlobalOptionsArgv>) {
  Object.entries(globalParams).forEach(([k, v]) => {
    v = '' + v;
    switch (k as keyof GlobalOptionsArgv) {
      case 'rcPath':
        expect(stdout).toContain(quoted(k, v));
        break;
      case 'interactive':
      case 'verbose':
        expect(stdout).toContain(unquoted(k, v));
        break;
      default:
        throw new Error(`${k} handling not implemented for global options check`);
        break;
    }
  });
}

export function expectOutputRcInStdout(stdout: string, cfg: RcJson) {
  expect(stdout).toContain(`url: '${cfg.collect.url}'`);
  expect(stdout).toContain(`ufPath: '${cfg.collect.ufPath}'`);
  expect(stdout).toContain(`outPath: '${cfg.persist.outPath}'`);
  expect(stdout).toContain(`format: [ '${cfg.persist.format[0]}' ]`);
  expect(stdout).toContain(SETUP_CONFIRM_MESSAGE);
}

export function expectBudgetsPathUsageLog(stdout: string, budgetPath: string = '') {
  expect(stdout).toContain(`Collect options budgetPath is used over CLI param or .user-flowrc.json. Configuration ${budgetPath} is used instead of a potential configuration in the user-flow.uf.ts`);
  expect(stdout).toContain('format given budgets');
}

export function expectBudgetsUsageLog(stdout: string, budgets: Budget[] = []) {
  expect(stdout).toContain('Collect options budgets is used over CLI param or .user-flowrc.json. Configuration ${budgets} is used instead of a potential configuration in the user-flow.uf.ts');
  expect(stdout).toContain('format given budgets');
}

export function expectNoBudgetsFileExistLog(stdout: string) {
  expect(stdout).not.toContain(`CLI options --budgetPath or .user-flowrc.json configuration`);
  expect(stdout).not.toContain('.user-flowrc.json configuration is used instead of a potential configuration in the user flow');
  expect(stdout).not.toContain('format given budgets');
}

export function old_expectResultsToIncludeBudgets(resultPath: string, budgets: Budget[] | string) {
  let resolvedBudgets: Budget[];
  if (Array.isArray(budgets)) {
    resolvedBudgets = budgets;
  } else {
    expect(() => fs.readFileSync(budgets + '')).not.toThrow();
    resolvedBudgets = JSON.parse(fs.readFileSync(budgets) as any) as Budget[];
  }

  expect(() => fs.readFileSync(resultPath)).not.toThrow();
  const result = JSON.parse(fs.readFileSync(resultPath) as any) as FlowResult;
  expect(result.steps[0].lhr.configSettings.budgets).toEqual(resolvedBudgets);
  expect(result.steps[0].lhr.audits['performance-budget']).toBeDefined();
  expect(result.steps[0].lhr.audits['timing-budget']).toBeDefined();
}


/**
 * @deprecated
 * use expectCollectLogsFromMockInStdout instead
 */
export function old_expectCollectLogsFromMockInStdout(stdout: string, ufName: string, cfg: RcJson) {
  expect(stdout).toContain(`Collect: ${ufName} from URL ${cfg.collect.url}`);
  expect(stdout).toContain(`flow#navigate: ${cfg.collect.url}`);
  expect(stdout).toContain(`Duration: ${ufName}`);
}

/**
 * @deprecated
 * use expectCollectCommandNotToCreateLogsFromMockInStdout instead
 * @param stdout
 * @param ufName
 * @param cfg
 */
export function old_expectCollectCommandNotToCreateLogsFromMockInStdout(stdout: string, ufName: string, cfg: RcJson) {
  expect(stdout).not.toContain(`Collect: ${ufName} from URL ${cfg.collect.url}`);
  expect(stdout).not.toContain(`flow#navigate: ${cfg.collect.url}`);
  expect(stdout).not.toContain(`Duration: ${ufName}`);
}


/**
 * @deprecated
 * refactor to take prj
 */
export function expectCollectLogsFromUserFlowInStdout(stdout: string, ufName: string, cfg: RcJson) {
  expect(stdout).toContain(`Collect: ${ufName} from URL ${cfg.collect.url}`);
  expect(stdout).toContain(`flow#navigate: ${cfg.collect.url}`);
  expect(stdout).toContain(`Duration: ${ufName}`);
}


/**
 * @deprecated
 * use expectCollectCreatesHtmlReport instead
 * @param reportPath
 * @param ufName
 */
export function old_expectCollectCreatesHtmlReport(reportPath: string, ufName: string) {
  let reportHTML;
  expect(() => fs.readFileSync(reportPath)).not.toThrow();
  reportHTML = fs.readFileSync(reportPath).toString('utf8');
  expect(reportHTML).toContain(`${ufName}`);
  expect(reportHTML).toBeTruthy();
}


/**
 * @deprecated
 * use expectCollectCreatesJsonReport instead
 *
 * @param reportPath
 * @param ufName
 */
export function old_expectCollectCreatesJsonReport(reportPath: string, ufName: string) {
  let reportJson;
  expect(() => fs.readFileSync(reportPath)).not.toThrow();
  reportJson = JSON.parse(fs.readFileSync(reportPath).toString('utf8'));
  expect(reportJson.name).toBe(`${ufName}`);
  expect(reportJson).toBeTruthy();
}


/**
 * @deprecated
 * use
 * @param reportPath
 * @param ufName
 */
export function old_expectCollectCreatesMdReport(reportPath: string, ufName: string) {
  let reportMd;
  expect(() => fs.readFileSync(reportPath)).not.toThrow();
  reportMd = fs.readFileSync(reportPath, 'utf-8');
  expect(reportMd).toBeTruthy();
  expect(reportMd).toContain(`| Gather Mode | Performance | Accessibility | Best Practices | Seo | Pwa |`);
}

/**
 * @deprecated
 * refactor to take prj
 */
export function expectCollectLogsReportByDefault(stdout: string, ufName: string) {
  expect(stdout).toContain(`| Gather Mode | Performance | Accessibility | Best Practices | Seo | Pwa |`);
  expect(stdout).toContain(ufName);
}

export function old_expectCollectCommandNotToCreateReport(reportPath: string) {
  // Check report file is not created
  try {
    fs.readFileSync(reportPath);
  } catch (e: any) {
    expect(e.message).toContain('no such file or directory');
  }
}

/**
 * @deprecated
 * replace with prj.loadRcJson
 *
 * @param rcPath
 * @param cfg
 */
export function oldExpectEnsureConfigToCreateRc(rcPath: string, cfg: RcJson) {
  expect(() => fs.readFileSync(rcPath)).not.toThrow();
  const config = JSON.parse(fs.readFileSync(rcPath) as any);
  // handle inconsistency of rc vs params
  const { collect, persist, assert } = config;
  delete collect.openReport;

  expect(config).toEqual({ collect, persist, assert });
}
