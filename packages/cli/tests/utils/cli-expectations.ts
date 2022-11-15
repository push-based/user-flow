import * as fs from 'fs';
import { join } from 'path';
import { RcJson } from '@push-based/user-flow';
import FlowResult from 'lighthouse/types/lhr/flow';
import Budget from 'lighthouse/types/lhr/budget';
import { PROMPT_PERSIST_FORMAT } from '../../src/lib/commands/collect/options/format.constant';
import { PROMPT_COLLECT_UF_PATH } from '../../src/lib/commands/collect/options/ufPath.constant';
import { PROMPT_COLLECT_URL } from '../../src/lib/commands/collect/options/url.constant';
import { PROMPT_PERSIST_OUT_PATH } from '../../src/lib/commands/collect/options/outPath.constant';
import { SETUP_CONFIRM_MESSAGE } from '../../src/lib/commands/init/constants';
import { ArgvOption } from '../../src/lib/core/yargs/types';
import { GlobalOptionsArgv } from '../../src/lib/global/options/types';
import { RcArgvOptions } from '../../src/lib';
import { getCliOptionsFromRcConfig } from '../../src/lib/global/rc-json';

export function expectOutputRcInStdout(stdout: string, cfg: RcJson) {
  expect(stdout).toContain(SETUP_CONFIRM_MESSAGE);
  expect(stdout).toContain(`url: '${cfg.collect.url}'`);
  expect(stdout).toContain(`ufPath: '${cfg.collect.ufPath}'`);
  expect(stdout).toContain(`outPath: '${cfg.persist.outPath}'`);
  expect(stdout).toContain(`format: [ '${cfg.persist.format[0]}' ]`);
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

export function expectCfgToContain(stdout: string, cliParams: {}) {

  Object.entries(cliParams).forEach(([k, v]) => {
    switch (k) {
      // global
      case 'verbose':
      case 'interactive':
        expect(stdout).toContain(`${k}: ${v}`);
        break;
      // global
      case 'rcPath':
      // collect
      case 'url':
      case 'ufPath':
      case 'outPath':
      case 'dryRun':
        expect(stdout).toContain(`${k}: '${v}'`);
        break;
      case 'format':
        expect(stdout).toContain(`${k}: [ ${(v as any[]).map(i => "'"+i+"'").join(', ')} ]`);
        break;
      case 'openReport':
        expect(stdout).toContain(`${k}: ${v}`);
        break;
      default:
        throw new Error(`${k} handling not implemented`)
        break;
    }
  });
}

export function expectCollectCreatesJsonReport(reportPath: string, ufName: string) {
  let reportJson;
  expect(() => fs.readFileSync(reportPath)).not.toThrow();
  reportJson = JSON.parse(fs.readFileSync(reportPath).toString('utf8'));
  expect(reportJson.name).toBe(`${ufName}`);
  expect(reportJson).toBeTruthy();
}

export function expectCollectCreatesMdReport(reportPath: string, ufName: string) {
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

export function expectCollectNotToCreateAReport(reportPath: string) {
  // Check report file is not created
  try {
    fs.readFileSync(reportPath).toString('utf8');
  } catch (e: any) {
    expect(e.message).toContain('no such file or directory');
  }
}

export function expectEnsureConfigToCreateRc(rcPath: string, cfg: Partial<RcJson>) {
  expect(() => fs.readFileSync(rcPath)).not.toThrow();
  const config = JSON.parse(fs.readFileSync(rcPath) as any);
  // handle inconsistency of rc vs params
  const {collect, persist, assert} = config;
  delete collect.openReport;

  expect(config).toEqual({ collect, persist, assert });
}
