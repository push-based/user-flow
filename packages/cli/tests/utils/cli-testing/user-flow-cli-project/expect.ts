import { UserFlowCliProject } from './user-flow-cli';
import { PROMPT_COLLECT_URL } from '../../../../src/lib/commands/collect/options/url.constant';
import { PROMPT_COLLECT_UF_PATH } from '../../../../src/lib/commands/collect/options/ufPath.constant';
import { PROMPT_PERSIST_OUT_PATH } from '../../../../src/lib/commands/collect/options/outPath.constant';
import { PROMPT_PERSIST_FORMAT } from '../../../../src/lib/commands/collect/options/format.constant';
import Budget from 'lighthouse/types/lhr/budget';
import * as fs from "fs";
import FlowResult from 'lighthouse/types/lhr/flow';
import { LH_NAVIGATION_BUDGETS_NAME } from '../../../fixtures/budget/lh-navigation-budget';
import { DEFAULT_RC_NAME } from '../../../../src/lib/constants';

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

export function expectResultsToIncludeBudgets(prj: UserFlowCliProject, reportName: string, budgetsName: string = LH_NAVIGATION_BUDGETS_NAME) {

  const report = prj.readOutput(reportName) as any;
  const resolvedBudgets = prj.readBudget(budgetsName);

  expect(report.steps[0].lhr.configSettings.budgets).toEqual(resolvedBudgets);
  expect(report.steps[0].lhr.audits['performance-budget']).toBeDefined();
  expect(report.steps[0].lhr.audits['timing-budget']).toBeDefined();
}

