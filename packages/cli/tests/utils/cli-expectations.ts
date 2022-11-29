import * as fs from 'fs';
import { RcJson } from '@push-based/user-flow';
import FlowResult from 'lighthouse/types/lhr/flow';
import Budget from 'lighthouse/types/lhr/budget';
import { PROMPT_PERSIST_FORMAT } from '../../src/lib/commands/collect/options/format.constant';
import { PROMPT_COLLECT_UF_PATH } from '../../src/lib/commands/collect/options/ufPath.constant';
import { PROMPT_COLLECT_URL } from '../../src/lib/commands/collect/options/url.constant';
import { PROMPT_PERSIST_OUT_PATH } from '../../src/lib/commands/collect/options/outPath.constant';
import { SETUP_CONFIRM_MESSAGE } from '../../src/lib/commands/init/constants';
import { GlobalOptionsArgv } from '../../src/lib/global/options/types';
import { STATIC_HTML_REPORT_NAME } from '../fixtures/rc-files/static-app';
import { REMOTE_RC_NAME } from '../fixtures/rc-files/remote-url';
import { REMOTE_USERFLOW_TITLE } from '../fixtures/user-flows/remote-sandbox-setup.uf';
import { UserFlowCliProject } from './cli-testing/user-flow-cli-project/user-flow-cli';

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


export function expectInitCfgToContain(stdout: string, cliParams: {}) {
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

export function expectGlobalOptionsToContain(stdout: string, globalParams: Partial<GlobalOptionsArgv>) {
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

export function expectNoPromptsInStdout(stdout: string) {
  expect(stdout).not.toContain(PROMPT_COLLECT_URL);
  expect(stdout).not.toContain(PROMPT_COLLECT_UF_PATH);
  expect(stdout).not.toContain(PROMPT_PERSIST_OUT_PATH);
  expect(stdout).not.toContain(PROMPT_PERSIST_FORMAT);
}

export function expectBudgetsFileExistLog(stdout: string, budgetPath: Budget[] | string = '') {
  if (!Array.isArray(budgetPath)) {
    expect(stdout).toContain(`CLI options --budgetPath or .user-flowrc.json configuration ${budgetPath} is used instead of a potential configuration in the user flow`);
  } else {
    expect(stdout).toContain('.user-flowrc.json configuration is used instead of a potential configuration in the user flow');
  }
  expect(stdout).toContain('format given budgets');
}

export function expectNoBudgetsFileExistLog(stdout: string) {
  expect(stdout).not.toContain(`CLI options --budgetPath or .user-flowrc.json configuration`);
  expect(stdout).not.toContain('.user-flowrc.json configuration is used instead of a potential configuration in the user flow');
  expect(stdout).not.toContain('format given budgets');
}

export function expectResultsToIncludeBudgets(resultPath: string, budgets: Budget[] | string) {
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

export function expectPromptsOfInitInStdout(stdout: string) {
  expect(stdout).toContain(PROMPT_COLLECT_URL);
  expect(stdout).toContain(PROMPT_COLLECT_UF_PATH);
  expect(stdout).toContain(PROMPT_PERSIST_OUT_PATH);
  expect(stdout).toContain(PROMPT_PERSIST_FORMAT);
}

export function expectCollectLogsFromMockInStdout(stdout: string, ufName: string, cfg: RcJson) {
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

export function expectCollectCommandNotToCreateLogsFromMockInStdout(
  prj: UserFlowCliProject,
  userFlowName: string,
  stdout: string,
  rcName?: string) {
  const rcJson = prj.readRcJson(rcName);
  expect(stdout).not.toContain(`Collect: ${userFlowName} from URL ${rcJson.collect.url}`);
  expect(stdout).not.toContain(`flow#navigate: ${rcJson.collect.url}`);
  expect(stdout).not.toContain(`Duration: ${userFlowName}`);
}


export function expectCollectLogsFromUserFlowInStdout(stdout: string, ufName: string, cfg: RcJson) {
  expect(stdout).toContain(`Collect: ${ufName} from URL ${cfg.collect.url}`);
  expect(stdout).toContain(`flow#navigate: ${cfg.collect.url}`);
  expect(stdout).toContain(`Duration: ${ufName}`);
}


export function expectCollectCommandCreatesHtmlReport(
  prj: UserFlowCliProject,
  reportName: string,
  flowTitle: string,
  rcName?: string
) {
  const reportHTML = prj.readOutput(reportName, rcName);
  expect(reportHTML).toContain(flowTitle);
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

export function expectCollectCommandCreatesJsonReport(
  prj: UserFlowCliProject,
  reportName: string,
  flowTitle: string,
  rcName?: string
) {
  const reportJson = JSON.parse(prj.readOutput(reportName, rcName));
  expect(reportJson.name).toContain(flowTitle);
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

export function expectCollectCommandCreatesMdReport(
  prj: UserFlowCliProject,
  reportName: string,
  flowTitle: string,
  rcName?: string
) {
  const reportMd = prj.readOutput(reportName, rcName);
  expect(reportMd).toContain(flowTitle);
  expect(reportMd).toContain(`| Gather Mode | Performance | Accessibility | Best Practices | Seo | Pwa |`);
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

export function expectCollectLogsReportByDefault(stdout: string, ufName: string) {
  expect(stdout).toContain(`| Gather Mode | Performance | Accessibility | Best Practices | Seo | Pwa |`);
  expect(stdout).toContain(`| Navigate to coffee cart | navigation  |`);
}

export function old_expectCollectCommandNotToCreateReport(reportPath: string) {
  // Check report file is not created
  try {
    fs.readFileSync(reportPath);
  } catch (e: any) {
    expect(e.message).toContain('no such file or directory');
  }
}

export function expectCollectCommandNotToCreateReport(
  prj: UserFlowCliProject,
  reportName: string,
  rcName?: string
) {
  // Check report file is not created
  try {
    prj.readOutput(reportName, rcName);
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
