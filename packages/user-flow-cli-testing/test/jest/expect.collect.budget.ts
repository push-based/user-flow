import Budget from 'lighthouse/types/lhr/budget';
import { UserFlowCliProject, LH_NAVIGATION_BUDGETS_NAME_DEFAULT } from '../../src/index';

export function expectBudgetsPathUsageLog(stdout: string, budgetPath: string = '') {
  expect(stdout).toContain(`Collect options budgetPath is used over CLI param or .user-flowrc.json. Configuration ${budgetPath} is used instead of a potential configuration in the user-flow.uf.ts`);
  expect(stdout).toContain('Use budgets from UserFlowProvider objects under the flowOptions.settings.budgets property');
}

export function expectResultsToIncludeBudgets(prj: UserFlowCliProject, reportName: string, budgets: string | Budget[] = LH_NAVIGATION_BUDGETS_NAME_DEFAULT) {
  const report = prj.readOutput(reportName) as any;
  const resolvedBudgets = Array.isArray(budgets) ? budgets : prj.readBudget(budgets);

  expect(report.steps[0].lhr.configSettings.budgets).toEqual(resolvedBudgets);
  expect(report.steps[0].lhr.audits['performance-budget']).toBeDefined();
  expect(report.steps[0].lhr.audits['timing-budget']).toBeDefined();
}

export function expectBudgetsUsageLog(stdout: string, budgets: Budget[] = []) {
  expect(stdout).toContain('Collect options budgets is used over CLI param or .user-flowrc.json. Configuration ${budgets} is used instead of a potential configuration in the user-flow.uf.ts');
  expect(stdout).toContain('Use budgets from UserFlowProvider objects under the flowOptions.settings.budgets property');
}

export function expectNoBudgetsFileExistLog(stdout: string) {
  expect(stdout).not.toContain(`CLI options --budgetPath or .user-flowrc.json configuration`);
  expect(stdout).not.toContain('.user-flowrc.json configuration is used instead of a potential configuration in the user flow');
  expect(stdout).not.toContain('Use budgets from UserFlowProvider objects under the flowOptions.settings.budgets property');
}
