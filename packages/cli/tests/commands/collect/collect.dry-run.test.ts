import { SETUP_SANDBOX_STATIC_RC_JSON, SETUP_SANDBOX_STATIC_RC_NAME } from '../../fixtures/setup-sandbox';
import { expectCollectLogsFromMockInStdout } from '../../utils/cli-expectations';
import {
  UserFlowCliProject,
  UserFlowCliProjectFactory
} from '../../utils/cli-testing/user-flow-cli-project/user-flow-cli';
import { INITIATED_PRJ_CFG } from '../../fixtures/sandbox/initiated';

let initializedPrj: UserFlowCliProject;
const ufStaticName = 'Sandbox Setup StaticDist';

describe('dryRun and collect command in setup sandbox', () => {
  beforeEach(async () => {
    if (!initializedPrj) {
      initializedPrj = await UserFlowCliProjectFactory.create(INITIATED_PRJ_CFG);
    }
    await initializedPrj.setup()
  });
  afterEach(async () => await initializedPrj.teardown());

  it('should load ufPath and execute throw if no user-flow is given', async () => {
    const existingEmptyFolder = './measures';
    const { exitCode, stdout, stderr } = await initializedPrj.$collect({
      rcPath: SETUP_SANDBOX_STATIC_RC_NAME,
      ufPath: existingEmptyFolder
    });

    expect(stderr).toContain(`No user flows found in ${existingEmptyFolder}`);
    expect(exitCode).toBe(1);
  }, 90_000);

  it('should load ufPath and execute the user-flow', async () => {
    const { exitCode, stdout, stderr } = await initializedPrj.$collect({
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
