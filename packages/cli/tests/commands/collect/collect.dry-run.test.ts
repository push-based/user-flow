import { SETUP_SANDBOX_STATIC_RC_JSON, SETUP_SANDBOX_STATIC_RC_NAME } from '../../fixtures/setup-sandbox';
import { expectCollectLogsFromMockInStdout } from '../../utils/cli-expectations';
import {
  UserFlowCliProject,
  UserFlowCliProjectFactory
} from '../../utils/cli-testing/user-flow-cli-project/user-flow-cli';
import { INITIATED_PRJ_CFG } from '../../fixtures/sandbox/initiated';
import { STATIC_PRJ_CFG } from '../../fixtures/sandbox/static';

let initializedPrj: UserFlowCliProject;
let staticPrj: UserFlowCliProject;
const ufStaticName = 'Sandbox Setup StaticDist';

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
    expectCollectLogsFromMockInStdout(
      stdout,
      ufStaticName,
      SETUP_SANDBOX_STATIC_RC_JSON
    );
    expect(exitCode).toBe(0);
  }, 90_000);
  it('should throw if no user-flow is given', async () => {
    const existingEmptyFolder = './measures';
    const { exitCode, stderr } = await staticPrj.$collect({
      ufPath: existingEmptyFolder
    });

    expect(stderr).toContain(`No user flows found in ${existingEmptyFolder}`);
    expect(exitCode).toBe(1);
  }, 90_000);
});
