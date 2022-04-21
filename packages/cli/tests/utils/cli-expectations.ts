import { RcJson } from '@push-based/user-flow/cli';
import {
  INIT_COMMAND__ASK_FROMAT,
  INIT_COMMAND__ASK_OUT_PATH,
  INIT_COMMAND__ASK_UF_PATH,
  INIT_COMMAND__ASK_URL,
  INIT_COMMAND__SETUP_CONFIRM
} from '../fixtures/cli-prompts';
import * as fs from 'fs';
import { report } from '@nrwl/workspace/src/command-line/report';
import { logVerbose } from '../../src/lib/core/loggin';
import FlowResult from 'lighthouse/types/lhr/flow';
import { Budgets } from 'lighthouse/types/lhr/budget';

export function expectOutputRcInStdout(stdout: string, cfg: RcJson) {
  expect(stdout).toContain(INIT_COMMAND__SETUP_CONFIRM);
  expect(stdout).toContain(`url: '${cfg.collect.url}'`);
  expect(stdout).toContain(`ufPath: '${cfg.collect.ufPath}'`);
  expect(stdout).toContain(`outPath: '${cfg.persist.outPath}'`);
  expect(stdout).toContain(`format: [ '${cfg.persist.format[0]}', '${cfg.persist.format[1]}' ]`);
}

export function expectNoPromptsInStdout(stdout: string) {
  expect(stdout).not.toContain(INIT_COMMAND__ASK_URL);
  expect(stdout).not.toContain(INIT_COMMAND__ASK_UF_PATH);
  expect(stdout).not.toContain(INIT_COMMAND__ASK_OUT_PATH);
  expect(stdout).not.toContain(INIT_COMMAND__ASK_FROMAT);
}

export function expectBudgetsFileExistLog(stdout: string, budgetPath: string = '') {
  if (budgetPath) {
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

export function expectResultsToIncludeBudgets(resultPath: string, budgets: Budgets[] | string) {
  let resolvedBudgets: Budgets[];
  if(Array.isArray(budgets)) {
    resolvedBudgets = budgets;
  } else {
    expect(() => fs.readFileSync(budgets+'')).not.toThrow();
    resolvedBudgets = JSON.parse(fs.readFileSync(budgets) as any) as Budgets[];
  }

  expect(() => fs.readFileSync(resultPath)).not.toThrow();
  const result = JSON.parse(fs.readFileSync(resultPath) as any) as FlowResult;
  expect(result.steps[0].lhr.configSettings.budgets).toEqual(resolvedBudgets);
  expect(result.steps[0].lhr.audits['performance-budget']).toBeDefined();
  expect(result.steps[0].lhr.audits['timing-budget']).toBeDefined();
}

export function expectPromptsInStdout(stdout: string) {
  expect(stdout).toContain(INIT_COMMAND__ASK_URL);
  expect(stdout).toContain(INIT_COMMAND__ASK_UF_PATH);
  expect(stdout).toContain(INIT_COMMAND__ASK_OUT_PATH);
  expect(stdout).toContain(INIT_COMMAND__ASK_FROMAT);
}

export function expectCollectLogsFromMockInStdout(stdout: string, ufName: string, cfg: RcJson) {
  expect(stdout).toContain(`Collect: ${ufName} from URL ${cfg.collect.url}`);
  expect(stdout).toContain(`flow#navigate: ${cfg.collect.url}`);
  expect(stdout).toContain(`Duration: ${ufName}`);
}

export function expectCollectNoLogsFromMockInStdout(stdout: string, ufName: string, cfg: RcJson) {
  expect(stdout).not.toContain(`Collect: ${ufName} from URL ${cfg.collect.url}`);
  expect(stdout).not.toContain(`flow#navigate: ${cfg.collect.url}`);
  expect(stdout).not.toContain(`Duration: ${ufName}`);
}

export function expectCollectLogsFromUserFlowInStdout(stdout: string, ufName: string, cfg: RcJson) {
  expect(stdout).toContain(`Collect: ${ufName} from URL ${cfg.collect.url}`);
  expect(stdout).toContain(`flow#navigate: ${cfg.collect.url}`);
  expect(stdout).toContain(`Duration: ${ufName}`);
}

export function expectCollectCreatesHtmlReport(reportPath: string, ufName: string) {
  let reportHTML;
  expect(() => fs.readFileSync(reportPath)).not.toThrow();
  reportHTML = fs.readFileSync(reportPath).toString('utf8');
  expect(reportHTML).toContain(`${ufName}`);
  expect(reportHTML).toBeTruthy();
}

export function expectCollectCreatesJsonReport(reportPath: string, ufName: string) {
  let reportJson;
  expect(() => fs.readFileSync(reportPath)).not.toThrow();
  reportJson = JSON.parse(fs.readFileSync(reportPath).toString('utf8'));
  expect(reportJson.name).toBe(`${ufName}`);
  expect(reportJson).toBeTruthy();
}

export function expectCollectNotToCreateAReport(reportPath: string) {
  // Check report file is not created
  try {
    fs.readFileSync(reportPath).toString('utf8');
  } catch (e: any) {
    expect(e.message).toContain('no such file or directory');
  }
}

export function expectEnsureConfigToCreateRc(rcPath: string, cfg: RcJson) {
  expect(() => fs.readFileSync(rcPath)).not.toThrow();
  const config = JSON.parse(fs.readFileSync(rcPath) as any);
  expect(config).toEqual(cfg);
}
