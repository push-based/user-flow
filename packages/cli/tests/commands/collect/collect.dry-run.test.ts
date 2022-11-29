import {
  UserFlowCliProject,
  UserFlowCliProjectFactory
} from '../../utils/cli-testing/user-flow-cli-project/user-flow-cli';
import { STATIC_PRJ_CFG } from '../../fixtures/sandbox/static';
import { STATIC_USERFLOW_NAME } from '../../fixtures/user-flows/static-sandbox-setup.uf';
import { expectCollectLogsFromMockInStdout } from '../../utils/cli-testing/user-flow-cli-project/expect';

let staticPrj: UserFlowCliProject;

describe('dryRun and collect command in static sandbox', () => {
  beforeEach(async () => {
    if (!staticPrj) {
      staticPrj = await UserFlowCliProjectFactory.create(STATIC_PRJ_CFG);
    }
    await staticPrj.setup();
  });
  afterEach(async () => {
    await staticPrj.teardown();
  });
  it('should execute the user-flow', async () => {
    const { exitCode, stdout, stderr } = await staticPrj.$collect({});

    expect(stderr).toBe('');
    expectCollectLogsFromMockInStdout(stdout, staticPrj, STATIC_USERFLOW_NAME)
    expect(exitCode).toBe(0);
  }, 90_000);

});
