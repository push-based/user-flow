import {
  UserFlowCliProject,
  UserFlowCliProjectFactory
} from '../../../../../libs/user-flow-testing-lib/src/lib/user-flow-cli';
import { STATIC_PRJ_CFG } from '../../fixtures/sandbox/static';
import { STATIC_USERFLOW_NAME } from '../../fixtures/user-flows/static.uf';
import { expectCollectLogsFromMockInStdout } from '../../../../../libs/user-flow-testing-lib/src/lib/expect';

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
