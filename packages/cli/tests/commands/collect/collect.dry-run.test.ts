import {
  UserFlowCliProject,
  UserFlowCliProjectFactory
} from '../../../lib/user-flow-cli';
import { STATIC_PRJ_CFG } from '../../../test-data/static-prj/cfg';
import { STATIC_USERFLOW_NAME } from '../../../test-data/static-prj/user-flow.uf';
import { expectCollectLogsFromMockInStdout } from '../../../user-flow-testing/expect';

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
