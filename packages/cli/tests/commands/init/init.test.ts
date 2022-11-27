import { CLI_PATH } from '../../fixtures/cli-bin-path';
import { ENTER } from '../../utils/cli-testing/process/keyboard';

import { EMPTY_SANDBOX_CLI_TEST_CFG } from '../../fixtures/empty-sandbox';

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
import {
  UserFlowCliProject,
  UserFlowCliProjectFactory
} from '../../utils/cli-testing/user-flow-cli-project/user-flow-cli';
import { UserFlowProjectConfig } from '../../utils/cli-testing/user-flow-cli-project/types';

const emptyPrjCfg: UserFlowProjectConfig = {
  root: EMPTY_SANDBOX_CLI_TEST_CFG.cwd as string,
  bin: CLI_PATH,
  rcFile: {}
};
let emptyPrj: UserFlowCliProject;

const setupPrjCfg: UserFlowProjectConfig = {
  root: SETUP_SANDBOX_CLI_TEST_CFG.cwd as string,
  bin: CLI_PATH
};
let setupPrj: UserFlowCliProject;


describe('init command in empty sandbox', () => {

  beforeEach(async () => {
    if (!emptyPrj) {
      emptyPrj = await UserFlowCliProjectFactory.create(emptyPrjCfg);
    }
    await emptyPrj.setup();
  });
  afterEach(async () => {
    await emptyPrj.teardown();
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

  it('should throw missing url error', async () => {

    const { exitCode, stdout, stderr } = await emptyPrj.$init({
      interactive: false,
      url: ''
    });

    expect(stderr).toContain('URL is required');
    expect(exitCode).toBe(1);

  }, 40_000);


});


describe('init command in setup sandbox', () => {

  beforeEach(async () => {
    if (!setupPrj) {
      setupPrj = await UserFlowCliProjectFactory.create(setupPrjCfg);
    }
    await setupPrj.setup();
  });
  afterEach(async () => {
    await setupPrj.teardown();
  });

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

});

