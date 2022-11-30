import {
  INITIALIZED_CLI_TEST_CFG,
  SETUP_SANDBOX_BUDGETS_PERSIST_OUT_PATH,
  SETUP_SANDBOX_STATIC_RC_BUDGET_PATH_JSON,
  SETUP_SANDBOX_STATIC_RC_BUDGET_PATH_NAME
} from '../../fixtures/setup-sandbox';
import {
  expectBudgetsFileExistLog, expectBudgetsPathUsageLog,
  expectNoBudgetsFileExistLog,
  old_expectResultsToIncludeBudgets
} from '../../utils/cli-expectations';
import * as path from 'path';
import {
  UserFlowCliProject,
  UserFlowCliProjectFactory
} from '../../utils/cli-testing/user-flow-cli-project/user-flow-cli';
import { STATIC_PRJ_CFG } from '../../fixtures/sandbox/static';
import { UserFlowProjectConfig } from '../../utils/cli-testing/user-flow-cli-project/types';
import { STATIC_JSON_REPORT_NAME, STATIC_RC_JSON } from '../../fixtures/rc-files/static';
import { LH_NAVIGATION_BUDGETS, LH_NAVIGATION_BUDGETS_NAME } from '../../fixtures/budget/lh-navigation-budget';
import { DEFAULT_RC_NAME } from '../../../src/lib/constants';
import { STATIC_USERFLOW_NAME } from '../../fixtures/user-flows/static.uf';
import { expectResultsToIncludeBudgets } from '../../utils/cli-testing/user-flow-cli-project/expect';

let staticPrj: UserFlowCliProject;

describe('budgets and collect command in setup sandbox', () => {
  beforeEach(async () => {
    if (!staticPrj) {
      staticPrj = await UserFlowCliProjectFactory.create(STATIC_PRJ_CFG);
    }
    await staticPrj.setup();
  });
  afterEach(async () => await staticPrj.teardown());

  it('should NOT log budgets info if no --budgetsPath CLI option is passed', async () => {
    const { exitCode, stdout, stderr } = await staticPrj.$collect({});

    expect(stderr).toBe('');
    expectNoBudgetsFileExistLog(stdout);
    expect(exitCode).toBe(0);

  });

});

let staticWBudgetPrj: UserFlowCliProject;
let staticWBudgetPrjCfg: UserFlowProjectConfig = {
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

describe('budget and collect command in setup sandbox', () => {
  beforeEach(async () => {
    if (!staticWBudgetPrj) {
      staticWBudgetPrj = await UserFlowCliProjectFactory.create(staticWBudgetPrjCfg);
    }
    await staticWBudgetPrj.setup();
  });
  afterEach(async () => await staticWBudgetPrj.teardown());


  it('should load budgets from file if budgets RC option is passed', async () => {
    const { exitCode, stdout, stderr } = await staticWBudgetPrj.$collect({ dryRun: false });

    expect(stderr).toBe('');
    expectBudgetsFileExistLog(stdout, LH_NAVIGATION_BUDGETS);
    expectResultsToIncludeBudgets(staticWBudgetPrj, STATIC_JSON_REPORT_NAME);
    expect(exitCode).toBe(0);
  }, 90_000);
});

let staticWBudgetPathPrj: UserFlowCliProject;
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
    [LH_NAVIGATION_BUDGETS_NAME]: JSON.stringify(LH_NAVIGATION_BUDGETS)
  }
};

describe('budgetPath and collect command in setup sandbox', () => {
  beforeEach(async () => {
    if (!staticWBudgetPathPrj) {
      staticWBudgetPathPrj = await UserFlowCliProjectFactory.create(staticWBudgetPathPrjCfg);
    }
    await staticWBudgetPathPrj.setup();
  });
  afterEach(async () => await staticWBudgetPathPrj.teardown());

  it('should load budgets from file if --budgetsPath CLI option is passed', async () => {
    const { exitCode, stdout, stderr } = await staticWBudgetPathPrj.$collect({
      budgetPath: LH_NAVIGATION_BUDGETS_NAME
    });

    expect(stderr).toBe('');
    expectBudgetsPathUsageLog(stdout, LH_NAVIGATION_BUDGETS_NAME);
    expect(exitCode).toBe(0);

  }, 60_000);

});
