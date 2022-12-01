import { UserFlowCliProject } from './user-flow-cli';
import { PROMPT_COLLECT_URL } from '../../../../packages/cli/src/lib/commands/collect/options/url.constant';
import { PROMPT_COLLECT_UF_PATH } from '../../../../packages/cli/src/lib/commands/collect/options/ufPath.constant';
import { PROMPT_PERSIST_OUT_PATH } from '../../../../packages/cli/src/lib/commands/collect/options/outPath.constant';
import { PROMPT_PERSIST_FORMAT } from '../../../../packages/cli/src/lib/commands/collect/options/format.constant';
import Budget from 'lighthouse/types/lhr/budget';
import { LH_NAVIGATION_BUDGETS_NAME } from '../../../../packages/cli/tests/fixtures/budget/lh-navigation-budget';
import { DEFAULT_RC_NAME } from '../../../../packages/cli/src/lib/constants';
import { RcJson } from '../../../../packages/cli/src/lib';
import { GlobalOptionsArgv } from '../../../../packages/cli/src/lib/global/options/types';

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

export function expectCollectCommandCreatesHtmlReport(
  prj: UserFlowCliProject,
  reportName: string,
  flowTitle: string,
  rcName?: string
) {
  const reportHTML = prj.readOutput(reportName, rcName);
  expect(reportHTML).toContain(flowTitle);
}

export function expectCollectCommandCreatesJsonReport(
  prj: UserFlowCliProject,
  reportName: string,
  flowTitle: string,
  rcName?: string
) {
  const reportJson = prj.readOutput(reportName, rcName) as any;
  expect(reportJson.name).toContain(flowTitle);
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

export function expectPromptsOfInitInStdout(stdout: string) {
  expect(stdout).toContain(PROMPT_COLLECT_URL);
  expect(stdout).toContain(PROMPT_COLLECT_UF_PATH);
  expect(stdout).toContain(PROMPT_PERSIST_OUT_PATH);
  expect(stdout).toContain(PROMPT_PERSIST_FORMAT);
}

export function expectNoPromptsInStdout(stdout: string) {
  expect(stdout).not.toContain(PROMPT_COLLECT_URL);
  expect(stdout).not.toContain(PROMPT_COLLECT_UF_PATH);
  expect(stdout).not.toContain(PROMPT_PERSIST_OUT_PATH);
  expect(stdout).not.toContain(PROMPT_PERSIST_FORMAT);
}

export function expectCollectLogsFromMockInStdout(stdout: string, prj: UserFlowCliProject, reportName: string, rcName?: string) {
  const rcJson = prj.readRcJson(rcName);
  const reportTitle = reportName.slice(0, -3);
  expect(stdout).toContain(`Collect: ${reportTitle} from URL ${rcJson.collect.url}`);
  expect(stdout).toContain(`flow#navigate: ${rcJson.collect.url}`);
  expect(stdout).toContain(`Duration: ${reportTitle}`);
}

export function expectResultsToIncludeBudgets(prj: UserFlowCliProject, reportName: string, budgets: string | Budget[] = LH_NAVIGATION_BUDGETS_NAME) {
  const report = prj.readOutput(reportName) as any;
  const resolvedBudgets = Array.isArray(budgets) ? budgets : prj.readBudget(budgets);

  expect(report.steps[0].lhr.configSettings.budgets).toEqual(resolvedBudgets);
  expect(report.steps[0].lhr.audits['performance-budget']).toBeDefined();
  expect(report.steps[0].lhr.audits['timing-budget']).toBeDefined();
}

export function expectCliToCreateRc(
  prj: UserFlowCliProject,
  json: RcJson,
  rcName: string = DEFAULT_RC_NAME
) {
  const rcFromFile = prj.readRcJson(rcName);
  // handle inconsistency of rc vs params
  const { collect, persist, assert } = json;
  expect(rcFromFile).toEqual({ collect, persist, assert });
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

export function unquoted(k: string, v: string): string {
  return `${k}: ${v}`;
}

export function quoted(k: string, v: string): string {
  return `${k}: '${v}'`;
}

export function array(k: string, v: string[]): string {
  let values = (v).map(i => '\'' + i + '\'').join(', ');
  values = values !== '' ? ' ' + values + ' ' : values;
  return `${k}: [${values}]`;
}
