import * as cliPromptTest from 'cli-prompts-test';
import * as path from 'path';
import {
  CLI_PATH
} from '../../fixtures/cli-bin-path';
import {
  resetSetupSandbox,
  SETUP_SANDBOX_CLI_TEST_CFG,
  SETUP_SANDBOX_DEFAULT_PERSIST_OUT_PATH,
  SETUP_SANDBOX_REMOTE_RC_NAME
} from '../../fixtures/setup-sandbox';
import {
  expectCollectCreatesJsonReport
} from '../../utils/cli-expectations';

const defaultCommand = [CLI_PATH];
const collectCommand = [...defaultCommand, 'collect', '-v'];
const collectCommandRemoteRc = [...collectCommand, `-p=./${SETUP_SANDBOX_REMOTE_RC_NAME}`];

const uf1Name = 'Sandbox Setup UF1';
const uf1OutPathJons = path.join(SETUP_SANDBOX_DEFAULT_PERSIST_OUT_PATH, 'sandbox-setup-uf1.uf.json');

describe('collect command in setup sandbox', () => {
  beforeEach(async () => resetSetupSandbox());
  afterEach(async () => resetSetupSandbox());


  it('should load ufPath, execute the user-flow on a remote URL and save the file', async () => {

    const { exitCode, stdout, stderr } = await cliPromptTest(
      [...collectCommandRemoteRc],
      [],
      SETUP_SANDBOX_CLI_TEST_CFG
    );

    expect(stderr).toBe('');
    // expectCollectLogsFromMockInStdout(stdout, uf1Name, SETUP_SANDBOX_DEFAULT_RC_JSON);
    expect(exitCode).toBe(0);

    // Check report file and content of report
    expectCollectCreatesJsonReport(uf1OutPathJons, uf1Name);

  }, 90_000);

});
