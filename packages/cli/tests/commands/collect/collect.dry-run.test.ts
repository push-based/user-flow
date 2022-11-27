import { CLI_PATH } from '../../fixtures/cli-bin-path';
import {
  SETUP_SANDBOX_CLI_TEST_CFG,
  SETUP_SANDBOX_STATIC_RC_JSON,
  SETUP_SANDBOX_STATIC_RC_NAME
} from '../../fixtures/setup-sandbox';
import { expectCollectLogsFromMockInStdout } from '../../utils/cli-expectations';
import {
  UserFlowCliProject,
  UserFlowCliProjectFactory
} from '../../utils/cli-testing/user-flow-cli-project/user-flow-cli';
import { UserFlowProjectConfig } from '../../utils/cli-testing/user-flow-cli-project/types';

const setupPrjCfg: UserFlowProjectConfig = {
  root: SETUP_SANDBOX_CLI_TEST_CFG.cwd as string,
  bin: CLI_PATH
};
let setupPrj: UserFlowCliProject;


const ufStaticName = 'Sandbox Setup StaticDist';

describe('dryRun and collect command in setup sandbox', () => {
  beforeEach(async () => {
    if (!setupPrj) {
      setupPrj = await UserFlowCliProjectFactory.create(setupPrjCfg);
    }
    await setupPrj.setup()
  });
  afterEach(async () => await setupPrj.teardown());

  it('should load ufPath and execute throw if no user-flow is given', async () => {
    const existingEmptyFolder = './measures';
    const { exitCode, stdout, stderr } = await setupPrj.$collect({
      rcPath: SETUP_SANDBOX_STATIC_RC_NAME,
      ufPath: existingEmptyFolder
    });

    expect(stderr).toContain(`No user flows found in ${existingEmptyFolder}`);
    expect(exitCode).toBe(1);
  }, 90_000);

  it('should load ufPath and execute the user-flow', async () => {
    const { exitCode, stdout, stderr } = await setupPrj.$collect({
      rcPath: SETUP_SANDBOX_STATIC_RC_NAME,
      ufPath: SETUP_SANDBOX_STATIC_RC_JSON.collect.ufPath
    });

    expect(stderr).toBe('');
    expectCollectLogsFromMockInStdout(
      stdout,
      ufStaticName,
      SETUP_SANDBOX_STATIC_RC_JSON
    );
    expect(exitCode).toBe(0);
  }, 90_000);
});
