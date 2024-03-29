import {
  DEFAULT_RC_NAME,
  LH_NAVIGATION_BUDGETS_NAME_DEFAULT,
  UserFlowCliProject,
  UserFlowCliProjectFactory,
  UserFlowProjectConfig
} from '@push-based/user-flow-cli-testing';
import {
  LH_NAVIGATION_BUDGETS,
  LH_NAVIGATION_BUDGETS_NAME,
  STATIC_JSON_REPORT_NAME,
  STATIC_PRJ_CFG,
  STATIC_RC_JSON
} from 'test-data';
import Budget from 'lighthouse/types/lhr/budget';

export function expectGlobalBudgetsPathUsageLog(stdout: string, budgetPath: string) {
  expect(stdout).toContain(`LH Performance Budget ${budgetPath} is used from CLI param or .user-flowrc.json`);
}
export function expectGlobalBudgetsUsageLog(stdout: string) {
  expect(stdout).toContain(`LH Performance Budget is used from config property .user-flowrc.json`);
}

export function expectLocalBudgetsUsageLog(stdout: string) {
  expect(stdout).toContain(`LH Performance Budget is used in a flows UserFlowProvider#flowOptions.settings.budgets`);
}
export function expectResultsToIncludeBudgets(prj: UserFlowCliProject, reportName: string, budgets: string | Budget[] = LH_NAVIGATION_BUDGETS_NAME_DEFAULT) {
  const report = prj.readOutput(reportName, 'json')[0].content as any;
  const resolvedBudgets = Array.isArray(budgets) ? budgets : prj.readBudget(budgets);

  expect(report.steps[0].lhr.configSettings.budgets).toEqual(resolvedBudgets);
  expect(report.steps[0].lhr.audits['performance-budget']).toBeDefined();
  expect(report.steps[0].lhr.audits['timing-budget']).toBeDefined();
}

export function expectNoBudgetsFileExistLog(stdout: string) {
  expect(stdout).not.toContain(`LH Performance Budget`);
}

let staticPrj: UserFlowCliProject;

describe('$collect() sandbox+NO-assets with RC()', () => {
  beforeEach(async () => {
    if (!staticPrj) {
      staticPrj = await UserFlowCliProjectFactory.create(STATIC_PRJ_CFG);
    }
    await staticPrj.setup();
  });
  afterEach(async () => await staticPrj.teardown());

  it('should NOT log budgets info', async () => {
    const { exitCode, stdout, stderr } = await staticPrj.$collect();

    expect(stderr).toBe('');
    expectNoBudgetsFileExistLog(stdout);
    expect(exitCode).toBe(0);

  });

});

let staticWRcBudgetPrj: UserFlowCliProject;
let staticWRcBudgetPrjCfg: UserFlowProjectConfig = {
  ...STATIC_PRJ_CFG,
  rcFile: {
    [DEFAULT_RC_NAME]: {
      ...STATIC_RC_JSON,
      assert: {
        ...STATIC_RC_JSON.assert,
        budgets: LH_NAVIGATION_BUDGETS
      }
    }
  },
  delete: (STATIC_PRJ_CFG?.delete || []).concat([LH_NAVIGATION_BUDGETS_NAME])
};

describe('$collect() sandbox+NO-assets with RC({budgets}))', () => {
  beforeEach(async () => {
    if (!staticWRcBudgetPrj) {
      staticWRcBudgetPrj = await UserFlowCliProjectFactory.create(staticWRcBudgetPrjCfg);
    }
    await staticWRcBudgetPrj.setup();
  });
  afterEach(async () => await staticWRcBudgetPrj.teardown());


  it('should load budgets from RC file', async () => {
    const { exitCode, stdout, stderr } = await staticWRcBudgetPrj.$collect({ dryRun: false });

    expect(stderr).toBe('');
    expectGlobalBudgetsUsageLog(stdout);
    expectResultsToIncludeBudgets(staticWRcBudgetPrj, STATIC_JSON_REPORT_NAME, LH_NAVIGATION_BUDGETS);
    expect(exitCode).toBe(0);
  }, 90_000);
});

let staticWBudgetAssetsPrj: UserFlowCliProject;
let staticWBudgetPathPrjCfg: UserFlowProjectConfig = {
  ...STATIC_PRJ_CFG,
  rcFile: {
    [DEFAULT_RC_NAME]: {
      ...STATIC_RC_JSON,
      assert: {
        ...STATIC_RC_JSON.assert,
        budgetPath: LH_NAVIGATION_BUDGETS_NAME
      }
    }
  },
  create: {
    ...STATIC_PRJ_CFG.create,
    [LH_NAVIGATION_BUDGETS_NAME]: LH_NAVIGATION_BUDGETS
  },
  delete: (STATIC_PRJ_CFG?.delete || []).concat([LH_NAVIGATION_BUDGETS_NAME])
};

describe('$collect() sandbox+assets with RC({budgetPath}))', () => {
  beforeEach(async () => {
    if (!staticWBudgetAssetsPrj) {
      staticWBudgetAssetsPrj = await UserFlowCliProjectFactory.create(staticWBudgetPathPrjCfg);
    }
    await staticWBudgetAssetsPrj.setup();
  });
  afterEach(async () => await staticWBudgetAssetsPrj.teardown());

  it('should load budgetPath from RC file', async () => {
    const { exitCode, stdout, stderr } = await staticWBudgetAssetsPrj.$collect({
      budgetPath: LH_NAVIGATION_BUDGETS_NAME
    });

    expect(stderr).toBe('');
    expectGlobalBudgetsPathUsageLog(stdout, LH_NAVIGATION_BUDGETS_NAME);
    expectResultsToIncludeBudgets(staticWBudgetAssetsPrj, STATIC_JSON_REPORT_NAME);
    expect(exitCode).toBe(0);

  }, 60_000);

});
