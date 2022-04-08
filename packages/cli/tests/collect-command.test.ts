import * as cliPromptTest from 'cli-prompts-test';
import * as fs from 'fs';
import * as path from 'path';
import {
  CLI_PATH
} from './fixtures/cli-bin-path';
import {
  resetSetupSandbox,
  SETUP_SANDBOX_CLI_TEST_CFG,
  SETUP_SANDBOX_DEFAULT_PERSIST_OUT_PATH,
  SETUP_SANDBOX_DEFAULT_RC_JSON, SETUP_SANDBOX_DEFAULT_RC_PATH, SETUP_SANDBOX_STATIC_COLLECT_UF_PATH,
  SETUP_SANDBOX_STATIC_PERSIST_OUT_PATH,
  SETUP_SANDBOX_STATIC_RC_JSON,
  SETUP_SANDBOX_STATIC_RC_NAME
} from './fixtures/setup-sandbox';
import { resetEmptySandbox } from './fixtures/empty-sandbox';
import {
  expectCollectCreatesHtmlReport,
  expectCollectLogsInStdout,
  expectCollectNotToCreateAReport
} from './utils/cli-expectations';
import { ERROR_UF_PATH_NO_DIR, ERROR_UF_PATH_REQUIRED, ERROR_URL_REQUIRED } from './fixtures/cli-errors';
import { INIT_COMMAND__ASK_URL } from './fixtures/cli-prompts';

const defaultCommand = [CLI_PATH];
const collectCommand = [...defaultCommand, 'collect', '-v'];
const collectCommandStaticRc = [...collectCommand, `-p=./${SETUP_SANDBOX_STATIC_RC_NAME}`];

const uf1Name = 'Sandbox Setup UF1';
const ufStaticName = 'Sandbox Setup StaticDist';
const uf1OutPath = path.join(SETUP_SANDBOX_DEFAULT_PERSIST_OUT_PATH, 'sandbox-setup-uf1.uf.html');
const ufStaticOutPath = path.join(SETUP_SANDBOX_STATIC_PERSIST_OUT_PATH, 'sandbox-setup-static-dist.uf.html');

describe('collect command in empty sandbox', () => {
  beforeEach(() => resetEmptySandbox());
  afterEach(() => {
    resetEmptySandbox();
  });


});

describe('collect command in setup sandbox', () => {
  beforeEach(() => {
    resetSetupSandbox();
  });
  afterEach(() => {
    resetSetupSandbox();
  });

  it('should throw missing url error', async () => {
    const { exitCode, stdout, stderr } = await cliPromptTest(
      [...collectCommand, '--interactive=false', '--url='],
      [cliPromptTest.ENTER],
      SETUP_SANDBOX_CLI_TEST_CFG
    );
    expect(stdout).toBe('');
    expect(stderr).toContain(ERROR_URL_REQUIRED);
    expect(exitCode).toBe(1);
    expect(stdout).toBe('');

  }, 40_000);

  it('should ask in any case for url if interactive', async () => {
    const { exitCode, stdout, stderr } = await cliPromptTest(
      [...collectCommand, '--interactive=true', '--url= '],
      [cliPromptTest.ENTER],
      SETUP_SANDBOX_CLI_TEST_CFG
    );
    expect(stdout).toBe('');
    expect(stderr).toContain(INIT_COMMAND__ASK_URL);
    expect(exitCode).toBe(1);
    expect(stdout).toBe('');

  }, 40_000);

  it('should exit if wrong ufPath is given', async () => {
    const { exitCode, stdout, stderr } = await cliPromptTest(
      [
        ...collectCommandStaticRc,
        `--ufPath=WRONG`
      ],
      [cliPromptTest.ENTER],
      SETUP_SANDBOX_CLI_TEST_CFG
    );
    expect(stdout).toBe('');
    expect(stderr).toContain(ERROR_UF_PATH_REQUIRED);
    expect(exitCode).toBe(1);
  });

  it('should load ufPath and execute the user-flow in dryRun', async () => {
    const { exitCode, stdout, stderr } = await cliPromptTest(
      [...collectCommandStaticRc, `--ufPath=${SETUP_SANDBOX_STATIC_COLLECT_UF_PATH}`, '--dryRun'],
      [cliPromptTest.ENTER],
      SETUP_SANDBOX_CLI_TEST_CFG
    );

    expect(stderr).toBe('');
    expectCollectLogsInStdout(stdout, ufStaticName, SETUP_SANDBOX_STATIC_RC_JSON);
    expect(exitCode).toBe(0);

  }, 40_000);

  it('should load ufPath and execute the user-flow with verbose information', async () => {
    const { exitCode, stdout, stderr } = await cliPromptTest(
      // dryRun is here to get faster tests
      [...collectCommandStaticRc, `--ufPath=${SETUP_SANDBOX_STATIC_COLLECT_UF_PATH}`, '--dryRun'],
      [cliPromptTest.ENTER],
      SETUP_SANDBOX_CLI_TEST_CFG
    );

    expect(stderr).toBe('');
    expectCollectLogsInStdout(stdout, ufStaticName, SETUP_SANDBOX_STATIC_RC_JSON);
    expect(exitCode).toBe(0);

    expectCollectNotToCreateAReport(uf1OutPath);

  }, 40_000);

  // @TODO use remote location config
  it('should load ufPath, execute the user-flow and save the file', async () => {

    const { exitCode, stdout, stderr } = await cliPromptTest(
      [...collectCommand, `--url=https://google.com`, `--ufPath=${SETUP_SANDBOX_STATIC_COLLECT_UF_PATH}`],
      [],
      SETUP_SANDBOX_CLI_TEST_CFG
    );

    expect(stderr).toBe('');
    expectCollectLogsInStdout(stdout, uf1Name, SETUP_SANDBOX_DEFAULT_RC_JSON);
    expect(exitCode).toBe(0);

    // Check report file and content of report
    expectCollectCreatesHtmlReport(uf1OutPath, uf1Name);

  }, 90_000);


  it('should use serve command and pass the test including output', async () => {

    const { exitCode, stdout, stderr } = await cliPromptTest(
      [...collectCommandStaticRc],
      [],
      SETUP_SANDBOX_CLI_TEST_CFG
    );

    expect(stderr).toBe('');
    expectCollectLogsInStdout(stdout, uf1Name, SETUP_SANDBOX_STATIC_RC_JSON);
    expect(exitCode).toBe(0);

    // Check report file and content of report
    const reportHTML = fs.readFileSync(ufStaticOutPath).toString('utf8');
    expect(reportHTML).toBeTruthy();
    expect(reportHTML).toContain(`${ufStaticName}`);

  }, 90_000);

});
