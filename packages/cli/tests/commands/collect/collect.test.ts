import * as cliPromptTest from 'cli-prompts-test';
import * as path from 'path';
import {
  CLI_PATH
} from '../../fixtures/cli-bin-path';
import {
  resetSetupSandboxAndKillPorts,
  SETUP_SANDBOX_CLI_TEST_CFG,
  SETUP_SANDBOX_DEFAULT_PERSIST_OUT_PATH,
  SETUP_SANDBOX_REMOTE_RC_NAME, SETUP_SANDBOX_STATIC_RC_JSON, SETUP_SANDBOX_STATIC_RC_NAME
} from '../../fixtures/setup-sandbox';
import {
  expectCollectCreatesJsonReport, expectCollectNoLogsFromMockInStdout, expectCollectNotToCreateAReport
} from '../../utils/cli-expectations';

const defaultCommand = [CLI_PATH];
const collectCommand = [...defaultCommand, 'collect', '-v'];
const collectCommandRemoteRc = [...collectCommand, `-p=./${SETUP_SANDBOX_REMOTE_RC_NAME}`];
const collectCommandStaticRc = [...collectCommand, `-p=./${SETUP_SANDBOX_STATIC_RC_NAME}`];

const uf1Name = 'Sandbox Setup UF1';
const uf1OutPathJons = path.join(SETUP_SANDBOX_DEFAULT_PERSIST_OUT_PATH, 'sandbox-setup-uf1.uf.json');

const ufStaticName = 'Sandbox Setup StaticDist';
const uf1OutPath = path.join(SETUP_SANDBOX_DEFAULT_PERSIST_OUT_PATH, 'sandbox-setup-uf1.uf.html');

describe('collect command in setup sandbox', () => {
  beforeEach(async () => resetSetupSandboxAndKillPorts());
  //afterEach(async () => resetSetupSandboxAndKillPorts());


  it('should load ufPath and execute the user-flow with verbose=false and save the report', async () => {
    const { exitCode, stdout, stderr } = await cliPromptTest(
      [...collectCommandStaticRc, `--ufPath=${SETUP_SANDBOX_STATIC_RC_JSON.collect.ufPath}`, '-v=false'],
      [],
      SETUP_SANDBOX_CLI_TEST_CFG
    );

    expect(stderr).toBe('');
    expectCollectNoLogsFromMockInStdout(stdout, ufStaticName, SETUP_SANDBOX_STATIC_RC_JSON);
    expect(exitCode).toBe(0);

    expectCollectNotToCreateAReport(uf1OutPath);

  }, 40_000);


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
