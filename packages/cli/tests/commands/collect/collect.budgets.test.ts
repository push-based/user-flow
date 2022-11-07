import * as cliPromptTest from 'cli-prompts-test';
import { CLI_PATH } from '../../fixtures/cli-bin-path';
import {
  BUDGETS_NAME,
  resetSetupSandboxAndKillPorts,
  SETUP_SANDBOX_BUDGETS_PERSIST_OUT_PATH,
  SETUP_SANDBOX_CLI_TEST_CFG,
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


const _collectCommand = [CLI_PATH, 'collect', '-v'];
const collectCommand = [..._collectCommand, `-p=./${SETUP_SANDBOX_STATIC_RC_NAME}`];
const collectCommandBudgetsRc = [..._collectCommand, `-p=./${SETUP_SANDBOX_STATIC_RC_BUDGETS_NAME}`];
const collectCommandBudgetPathRc = [..._collectCommand, `-p=./${SETUP_SANDBOX_STATIC_RC_BUDGET_PATH_NAME}`];

const ufStaticResultPath = path.join(SETUP_SANDBOX_BUDGETS_PERSIST_OUT_PATH, 'sandbox-setup-static-dist.uf.json');

describe('budgets and collect command in setup sandbox', () => {
  beforeEach(async () => resetSetupSandboxAndKillPorts());
  afterEach(async () => resetSetupSandboxAndKillPorts());

  it('should NOT log budgets info if no --budgetsPath CLI option is passed', async () => {
    const { exitCode, stdout, stderr } = await cliPromptTest(
      [...collectCommand],
      [],
      SETUP_SANDBOX_CLI_TEST_CFG
    );

    expect(stderr).toBe('');
    expectNoBudgetsFileExistLog(stdout);
    expect(exitCode).toBe(0);

  });

  it('should load budgets from file if --budgetsPath CLI option is passed', async () => {
    const { exitCode, stdout, stderr } = await cliPromptTest(
      [...collectCommand, `--budgetPath=${BUDGETS_NAME}`],
      [],
      SETUP_SANDBOX_CLI_TEST_CFG
    );

    expect(stderr).toBe('');
    expectBudgetsFileExistLog(stdout, BUDGETS_NAME);
    expect(exitCode).toBe(0);

  }, 60_000);

  it('should load budgets from file if budgetsPath RC option is passed', async () => {
    const { exitCode, stdout, stderr } = await cliPromptTest(
      [...collectCommand, `--budgetPath=${BUDGETS_NAME}`],
      [],
      SETUP_SANDBOX_CLI_TEST_CFG
    );

    expect(stderr).toBe('');
    expectBudgetsFileExistLog(stdout, BUDGETS_NAME);
    expect(exitCode).toBe(0);

  }, 90_000);

  it('should load budgets from file if budgets RC option is passed', async () => {
    const { exitCode, stdout, stderr } = await cliPromptTest(
      [...collectCommandBudgetsRc],
      [],
      SETUP_SANDBOX_CLI_TEST_CFG
    );
    const budgets = SETUP_SANDBOX_STATIC_RC_BUDGETS_JSON.assert?.budgets as [];

    expect(stderr).toBe('');
    expectBudgetsFileExistLog(stdout, budgets);
    expectResultsToIncludeBudgets(ufStaticResultPath, budgets);
    expect(exitCode).toBe(0);

  }, 90_000);

  it('should load budgets from file if budgetPath RC option is passed', async () => {
    const budgetPath = SETUP_SANDBOX_STATIC_RC_BUDGET_PATH_JSON.assert?.budgetPath + '';
    const { exitCode, stdout, stderr } = await cliPromptTest(
      [...collectCommandBudgetPathRc],
      [],
      SETUP_SANDBOX_CLI_TEST_CFG
    );

    expect(stderr).toBe('');
    expectBudgetsFileExistLog(stdout, budgetPath);
    expectResultsToIncludeBudgets(ufStaticResultPath, path.join(SETUP_SANDBOX_CLI_TEST_CFG.testPath, budgetPath));
    expect(exitCode).toBe(0);

  }, 90_000);

});
