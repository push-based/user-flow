import { cliPromptTest } from '../../utils/cli-prompt-test';
import * as path from 'path';
import { CLI_PATH } from '../../fixtures/cli-bin-path';
import {
  resetSetupSandboxAndKillPorts,
  SETUP_SANDBOX_CLI_TEST_CFG,
  SETUP_SANDBOX_DEFAULT_PERSIST_OUT_PATH,
  SETUP_SANDBOX_REMOTE_RC_NAME,
  SETUP_SANDBOX_STATIC_RC_NAME
} from '../../fixtures/setup-sandbox';
import { expectCollectLogsReportByDefault } from '../../utils/cli-expectations';

const defaultCommand = [CLI_PATH];
const collectCommand = [...defaultCommand, 'collect'];
const collectCommandRemoteRc = [
  ...collectCommand,
  `-p=./${SETUP_SANDBOX_REMOTE_RC_NAME}`,
];
const collectCommandStaticRc = [
  ...collectCommand,
  `-p=./${SETUP_SANDBOX_STATIC_RC_NAME}`,
];

const uf1Name = 'Sandbox Setup UF1';

describe('collect command in setup sandbox', () => {
  beforeEach(async () => resetSetupSandboxAndKillPorts());
  afterEach(async () => resetSetupSandboxAndKillPorts());

  it('should load ufPath, execute the user-flow on a remote URL and log if no format is given', async () => {
    const { exitCode, stdout, stderr } = await cliPromptTest(
      [...collectCommandRemoteRc, '--format=stdout'],
      [],
      SETUP_SANDBOX_CLI_TEST_CFG
    );

    expect(stderr).toBe('');
    expect(exitCode).toBe(0);

    // Check report file and content of report
    expectCollectLogsReportByDefault(stdout, uf1Name);
  }, 180_000);
});
