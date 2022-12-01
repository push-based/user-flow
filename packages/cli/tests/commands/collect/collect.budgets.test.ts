import {
  expectBudgetsPathUsageLog,
  expectBudgetsUsageLog,
  expectNoBudgetsFileExistLog
} from '../../utils/cli-expectations';
import {
  LH_NAVIGATION_BUDGETS_NAME,
  DEFAULT_RC_NAME,
  UserFlowCliProject,
  UserFlowCliProjectFactory,
  UserFlowCliProjectConfig
} from '../../../user-flow-testing';
import { STATIC_JSON_REPORT_NAME, STATIC_PRJ_CFG, STATIC_RC_JSON } from '../../../test-data/static-prj';
import { LH_NAVIGATION_BUDGETS } from '../../../test-data/budget/lh-navigation-budget';
import { expectResultsToIncludeBudgets } from '../../../user-flow-testing/expect';

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
    const { exitCode, stdout, stderr } = await staticPrj.$collect({});

    expect(stderr).toBe('');
    expectNoBudgetsFileExistLog(stdout);
    expect(exitCode).toBe(0);

  });

});

let staticWRcBudgetPrj: UserFlowCliProject;
let staticWRcBudgetPrjCfg: UserFlowCliProjectConfig = {
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
    expectBudgetsUsageLog(stdout, LH_NAVIGATION_BUDGETS);
    expectResultsToIncludeBudgets(staticWRcBudgetPrj, STATIC_JSON_REPORT_NAME, LH_NAVIGATION_BUDGETS);
    expect(exitCode).toBe(0);
  }, 90_000);
});

let staticWBudgetAssetsPrj: UserFlowCliProject;
let staticWBudgetPathPrjCfg: UserFlowCliProjectConfig = {
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
  }
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
    expectBudgetsPathUsageLog(stdout, LH_NAVIGATION_BUDGETS_NAME);
    expectResultsToIncludeBudgets(staticWBudgetAssetsPrj, STATIC_JSON_REPORT_NAME);
    expect(exitCode).toBe(0);

  }, 60_000);

});
