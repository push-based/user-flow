import { cliPromptTest } from '../../utils/cli-prompt-test';
import { CLI_PATH } from '../../fixtures/cli-bin-path';
import {
  resetSetupSandboxAndKillPorts,
  SETUP_SANDBOX_CLI_TEST_CFG,
  SETUP_SANDBOX_STATIC_RC_JSON,
  SETUP_SANDBOX_STATIC_RC_NAME,
} from '../../fixtures/setup-sandbox';
import { expectCollectLogsFromMockInStdout } from '../../utils/cli-expectations';

const collectCommand = [CLI_PATH, 'collect', '-v', '--dryRun'];
const collectCommandStaticRc = [
  ...collectCommand,
  `-p=./${SETUP_SANDBOX_STATIC_RC_NAME}`,
];

const ufStaticName = 'Sandbox Setup StaticDist';

describe('dryRun and collect command in setup sandbox', () => {
  beforeEach(async () => resetSetupSandboxAndKillPorts());
  afterEach(async () => resetSetupSandboxAndKillPorts());

  it('should load ufPath and execute throw if no user-flow is given', async () => {
    const existingEmptyFolder = './measures';
    const { exitCode, stdout, stderr } = await cliPromptTest(
      [
        ...collectCommandStaticRc,
        `--ufPath=${existingEmptyFolder}`,
      ],
      [],
      SETUP_SANDBOX_CLI_TEST_CFG
    );

    expect(stderr).toContain(`No user flows found in ${existingEmptyFolder}`);
    expect(exitCode).toBe(1);
  }, 90_000);

  it('should load ufPath and execute the user-flow', async () => {
    const { exitCode, stdout, stderr } = await cliPromptTest(
      [
        ...collectCommandStaticRc,
        `--ufPath=${SETUP_SANDBOX_STATIC_RC_JSON.collect.ufPath}`,
      ],
      [],
      SETUP_SANDBOX_CLI_TEST_CFG
    );

    expect(stderr).toBe('');
    expectCollectLogsFromMockInStdout(
      stdout,
      ufStaticName,
      SETUP_SANDBOX_STATIC_RC_JSON
    );
    expect(exitCode).toBe(0);
  }, 90_000);
});
