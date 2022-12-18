import * as fs from 'fs';
import { RcJson } from '@push-based/user-flow';
import FlowResult from 'lighthouse/types/lhr/flow';
import Budget from 'lighthouse/types/lhr/budget';

/**
 * @deprecated
 *
 * @param resultPath
 * @param budgets
 */
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
 *
 * @param reportPath
 */
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
