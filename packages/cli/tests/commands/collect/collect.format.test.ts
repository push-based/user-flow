import { SETUP_SANDBOX_REMOTE_RC_NAME } from '../../fixtures/setup-sandbox';
import { expectCollectLogsReportByDefault } from '../../utils/cli-expectations';
import {
  UserFlowCliProject,
  UserFlowCliProjectFactory
} from '../../utils/cli-testing/user-flow-cli-project/user-flow-cli';
import { INITIATED_PRJ_CFG } from '../../fixtures/sandbox/initiated';

let initializedPrj: UserFlowCliProject;

const uf1Name = 'Sandbox Setup UF1';

describe('collect command in setup sandbox', () => {
  beforeEach(async () => {
    if (!initializedPrj) {
      initializedPrj = await UserFlowCliProjectFactory.create(INITIATED_PRJ_CFG);
    }
    await initializedPrj.setup()
  });
  afterEach(async () => await initializedPrj.teardown());

  it('should load ufPath, execute the user-flow on a remote URL and log if no format is given', async () => {
    const { exitCode, stdout, stderr } = await initializedPrj.$collect({
      rcPath: SETUP_SANDBOX_REMOTE_RC_NAME,
      dryRun: false, format: ['stdout']
    });

    expect(stderr).toBe('');
    expect(exitCode).toBe(0);

    // Check report file and content of report
    expectCollectLogsReportByDefault(stdout, uf1Name);
  }, 180_000);

});
