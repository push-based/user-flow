import { CLI_PATH } from '../../fixtures/cli-bin-path';
import { ENTER } from '../../utils/cli-testing/process/keyboard';

import { EMPTY_SANDBOX_CLI_TEST_CFG, resetEmptySandbox } from '../../fixtures/empty-sandbox';

import {
  resetSetupSandboxAndKillPorts,
  SETUP_SANDBOX_CLI_TEST_CFG,
  SETUP_SANDBOX_DEFAULT_RC_JSON,
  SETUP_SANDBOX_DEFAULT_RC_PATH
} from '../../fixtures/setup-sandbox';

import {
  expectEnsureConfigToCreateRc,
  expectNoPromptsInStdout,
  expectOutputRcInStdout,
  expectPromptsOfInitInStdout
} from '../../utils/cli-expectations';
import { UserFlowCliProject } from '../../utils/cli-testing/user-flow-cli-project/user-flow-cli';

const emptyPrj = new UserFlowCliProject({
  root: EMPTY_SANDBOX_CLI_TEST_CFG.cwd as string,
  bin: CLI_PATH
});
const setupPrj = new UserFlowCliProject({
  root: SETUP_SANDBOX_CLI_TEST_CFG.cwd as string,
  bin: CLI_PATH
});


describe('init command in empty sandbox', () => {

  beforeEach(async () => {
    await emptyPrj.setup();
    await resetSetupSandboxAndKillPorts();
  });
  afterEach(async () => {
    await emptyPrj.teardown();
    await resetSetupSandboxAndKillPorts();
  });

  it('should generate a user-flow for basic navigation after the CLI is setup', async () => {

    const { exitCode, stdout, stderr } = await emptyPrj.$init({}, [
      // url
      ENTER,
      // ufPath
      ENTER,
      // html default format
      ENTER,
      ENTER
    ]);

    expect(stderr).toBe('');
    expectPromptsOfInitInStdout(stdout);

    expect(exitCode).toBe(0);

    //
    // expectEnsureConfigToCreateRc(path.join(EMPTY_SANDBOX_CLI_TEST_CFG.testPath, EMPTY_SANDBOX_RC_NAME__AFTER_ENTER_DEFAULTS), EMPTY_SANDBOX_RC_JSON__AFTER_ENTER_DEFAULTS);

  }, 40_000);

});


describe('init command in setup sandbox', () => {

  beforeEach(async () => await resetSetupSandboxAndKillPorts());
  afterEach(async () => await resetSetupSandboxAndKillPorts());

  it('should inform about the already existing cli-setup', async () => {

    const { exitCode, stdout, stderr } = await setupPrj.$init({});

    // Assertions

    // STDOUT
    // prompts
    expectNoPromptsInStdout(stdout);
    // setup log
    expectOutputRcInStdout(stdout, SETUP_SANDBOX_DEFAULT_RC_JSON);

    expect(stderr).toBe('');
    expect(exitCode).toBe(0);

    // file output
    expectEnsureConfigToCreateRc(SETUP_SANDBOX_DEFAULT_RC_PATH, SETUP_SANDBOX_DEFAULT_RC_JSON);
  });

  it('should throw missing url error', async () => {

    const { exitCode, stdout, stderr } = await emptyPrj.$init({
      interactive: false,
      url: ''
    });

    expect(stderr).toContain('URL is required');
    expect(exitCode).toBe(1);

  }, 40_000);

});

