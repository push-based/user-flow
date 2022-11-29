import {
  INITIALIZED_CLI_TEST_CFG,
  SETUP_SANDBOX_BUDGETS_PERSIST_OUT_PATH,
  SETUP_SANDBOX_STATIC_RC_BUDGET_PATH_JSON,
  SETUP_SANDBOX_STATIC_RC_BUDGET_PATH_NAME,
  SETUP_SANDBOX_STATIC_RC_BUDGETS_JSON,
  SETUP_SANDBOX_STATIC_RC_BUDGETS_NAME,
  SETUP_SANDBOX_STATIC_RC_NAME
} from '../../fixtures/setup-sandbox';
import {
  expectBudgetsFileExistLog,
  expectNoBudgetsFileExistLog,
  expectResultsToIncludeBudgets
} from '../../utils/cli-expectations';
import * as path from 'path';
import {
  UserFlowCliProject,
  UserFlowCliProjectFactory
} from '../../utils/cli-testing/user-flow-cli-project/user-flow-cli';
import { STATIC_PRJ_CFG } from '../../fixtures/sandbox/static';
import { UserFlowProjectConfig } from '../../utils/cli-testing/user-flow-cli-project/types';
import { STATIC_RC_JSON, STATIC_RC_NAME } from '../../fixtures/rc-files/static';
import { LH_NAVIGATION_BUDGETS, LH_NAVIGATION_BUDGETS_NAME } from '../../fixtures/budget/lh-navigation-budget';
import { DEFAULT_RC_NAME } from '../../../src/lib/constants';

let staticPrj: UserFlowCliProject;

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
  delete: [LH_NAVIGATION_BUDGETS_NAME],
  create: {
    [LH_NAVIGATION_BUDGETS_NAME]: JSON.stringify(LH_NAVIGATION_BUDGETS)
  }
};

const ufStaticResultPath = path.join(SETUP_SANDBOX_BUDGETS_PERSIST_OUT_PATH, 'sandbox-setup-static-dist.uf.json');

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

  it('should load budgets from file if --budgetsPath CLI option is passed', async () => {
    const { exitCode, stdout, stderr } = await staticPrj.$collect({
      budgetPath: LH_NAVIGATION_BUDGETS_NAME
    });

    expect(stderr).toBe('');
    expectBudgetsFileExistLog(stdout, LH_NAVIGATION_BUDGETS_NAME);
    expect(exitCode).toBe(0);

  }, 60_000);

  it('should load budgets from file if budgetsPath RC option is passed', async () => {
    const { exitCode, stdout, stderr } = await staticPrj.$collect({
      budgetPath: LH_NAVIGATION_BUDGETS_NAME
    });

    expect(stderr).toBe('');
    expectBudgetsFileExistLog(stdout, LH_NAVIGATION_BUDGETS_NAME);
    expect(exitCode).toBe(0);

  });
});

describe('budgetPath and collect command in setup sandbox', () => {
  beforeEach(async () => {
    if (!staticWBudgetPrj) {
      staticWBudgetPrj = await UserFlowCliProjectFactory.create(staticWBudgetPrjCfg);
    }
    await staticWBudgetPrj.setup();
  });
  afterEach(async () => await staticWBudgetPrj.teardown());


  it('should load budgets from file if budgets RC option is passed', async () => {
    const { exitCode, stdout, stderr } = await staticWBudgetPrj.$collect({});

    expect(stderr).toBe('');
    expectBudgetsFileExistLog(stdout, LH_NAVIGATION_BUDGETS);
    expectResultsToIncludeBudgets(ufStaticResultPath, LH_NAVIGATION_BUDGETS);
    expect(exitCode).toBe(0);

  });

  it('should load budgets from file if budgetPath RC option is passed', async () => {
    const budgetPath = SETUP_SANDBOX_STATIC_RC_BUDGET_PATH_JSON.assert?.budgetPath + '';
    const { exitCode, stdout, stderr } = await staticPrj.$collect({
      rcPath: SETUP_SANDBOX_STATIC_RC_BUDGET_PATH_NAME
    });

    expect(stderr).toBe('');
    expectBudgetsFileExistLog(stdout, budgetPath);
    expectResultsToIncludeBudgets(ufStaticResultPath, path.join(INITIALIZED_CLI_TEST_CFG?.cwd + '', budgetPath));
    expect(exitCode).toBe(0);

  });

});
