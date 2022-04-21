import * as cliPromptTest from 'cli-prompts-test';
import {
  CLI_PATH
} from '../../fixtures/cli-bin-path';
import {
  resetSetupSandboxAndKillPorts, SETUP_SANDBOX_BUDGETS_PERSIST_OUT_PATH, SETUP_SANDBOX_BUDGETS_RC_PATH,
  SETUP_SANDBOX_CLI_TEST_CFG, SETUP_SANDBOX_DEFAULT_PERSIST_OUT_PATH, SETUP_SANDBOX_STATIC_RC_BUDGET_PATH_JSON,
  SETUP_SANDBOX_STATIC_RC_BUDGET_PATH_NAME,
  SETUP_SANDBOX_STATIC_RC_BUDGETS_JSON,
  SETUP_SANDBOX_STATIC_RC_BUDGETS_NAME,
  SETUP_SANDBOX_STATIC_RC_JSON,
  SETUP_SANDBOX_STATIC_RC_NAME
} from '../../fixtures/setup-sandbox';
import {
  expectBudgetsFileExistLog,
  expectNoBudgetsFileExistLog,
  expectResultsToIncludeBudgets
} from '../../utils/cli-expectations';
import * as path from 'path';


const _collectCommand = [CLI_PATH, 'collect', '-v'];
const collectCommand = [..._collectCommand, `-p=./${SETUP_SANDBOX_STATIC_RC_NAME}`];
const collectCommandBudgetsRc = [..._collectCommand, `-p=./${SETUP_SANDBOX_STATIC_RC_BUDGETS_NAME}`];
const collectCommandBudgetPathRc = [..._collectCommand, `-p=./${SETUP_SANDBOX_STATIC_RC_BUDGET_PATH_NAME}`];

const ufStaticName = 'Sandbox Setup StaticDist';
const ufStaticResultPath = path.join(SETUP_SANDBOX_BUDGETS_PERSIST_OUT_PATH, 'sandbox-setup-static-dist.uf.json');

describe('budgets and collect command in setup sandbox', () => {
  beforeEach(async () => resetSetupSandboxAndKillPorts());
  afterEach(async () => resetSetupSandboxAndKillPorts());

  it('should not log budgets info if no --budgetsPath CLI option is passed', async () => {
    const { exitCode, stdout, stderr } = await cliPromptTest(
      [...collectCommand, `--dryRun`],
      [],
      SETUP_SANDBOX_CLI_TEST_CFG
    );

    expect(stderr).toBe('');
    expectNoBudgetsFileExistLog(stdout);
    expect(exitCode).toBe(0);

  });

  it('should load budgets from file if --budgetsPath CLI option is passed', async () => {
    const budgetJson = 'budget.json';
    const { exitCode, stdout, stderr } = await cliPromptTest(
      [...collectCommand, `--dryRun`, `--budgetPath=${budgetJson}`],
      [],
      SETUP_SANDBOX_CLI_TEST_CFG
    );

    expect(stderr).toBe('');
    expectBudgetsFileExistLog(stdout, budgetJson);
    expect(exitCode).toBe(0);

  });

  it('should load budgets from file if budgetsPath RC option is passed', async () => {
    const budgetJson = 'budget.json';
    const { exitCode, stdout, stderr } = await cliPromptTest(
      [...collectCommandBudgetPathRc, `--dryRun`, `--budgetPath=${budgetJson}`],
      [],
      SETUP_SANDBOX_CLI_TEST_CFG
    );

    expect(stderr).toBe('');
    expectBudgetsFileExistLog(stdout, budgetJson);
    expect(exitCode).toBe(0);

  });

  it('should load budgets from file if budgets RC option is passed', async () => {
    const { exitCode, stdout, stderr } = await cliPromptTest(
      [...collectCommandBudgetsRc, `--dryRun`],
      [],
      SETUP_SANDBOX_CLI_TEST_CFG
    );

    expect(stderr).toBe('');
    expectBudgetsFileExistLog(stdout);
    expectResultsToIncludeBudgets(ufStaticResultPath, SETUP_SANDBOX_STATIC_RC_BUDGETS_JSON.assert?.budgets as any);
    expect(exitCode).toBe(0);

  });

 it('should load budgets from file if budgetPath RC option is passed', async () => {
   const budgetPath = SETUP_SANDBOX_STATIC_RC_BUDGET_PATH_JSON.assert?.budgetPath+'';
    const { exitCode, stdout, stderr } = await cliPromptTest(
      [...collectCommandBudgetPathRc, `--dryRun`],
      [],
      SETUP_SANDBOX_CLI_TEST_CFG
    );

    expect(stderr).toBe('');
    expectBudgetsFileExistLog(stdout, budgetPath);
    expectResultsToIncludeBudgets(ufStaticResultPath, path.join(SETUP_SANDBOX_CLI_TEST_CFG.testPath, budgetPath));
    expect(exitCode).toBe(0);

  });

});
