import {UserFlowCliProject, UserFlowCliProjectFactory,} from '@push-based/user-flow-cli-testing';
import {STATIC_PRJ_CFG, STATIC_USERFLOW_NAME} from 'test-data';
import {expectCollectLogsFromMockInStdout} from '../../jest';

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
    expectCollectLogsFromMockInStdout(stdout, staticPrj, STATIC_USERFLOW_NAME);
    expect(exitCode).toBe(0);
  }, 90_000);
});
