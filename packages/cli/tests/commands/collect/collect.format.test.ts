import { CLI_PATH } from '../../fixtures/cli-bin-path';
import {
  SETUP_SANDBOX_CLI_TEST_CFG,
  SETUP_SANDBOX_REMOTE_RC_NAME
} from '../../fixtures/setup-sandbox';
import { expectCollectLogsReportByDefault } from '../../utils/cli-expectations';
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

const uf1Name = 'Sandbox Setup UF1';

describe('collect command in setup sandbox', () => {
  beforeEach(async () => {
    if (!setupPrj) {
      setupPrj = await UserFlowCliProjectFactory.create(setupPrjCfg);
    }
    await setupPrj.setup()
  });
  afterEach(async () => await setupPrj.teardown());

  it('should load ufPath, execute the user-flow on a remote URL and log if no format is given', async () => {
    const { exitCode, stdout, stderr } = await setupPrj.$collect({
      rcPath: SETUP_SANDBOX_REMOTE_RC_NAME,
      dryRun: false, format: ['stdout']
    });

    expect(stderr).toBe('');
    expect(exitCode).toBe(0);

    // Check report file and content of report
    expectCollectLogsReportByDefault(stdout, uf1Name);
  }, 180_000);

});
