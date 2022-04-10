import * as cliPromptTest from 'cli-prompts-test';
import * as path from 'path';
import {
  CLI_PATH
} from '../../fixtures/cli-bin-path';
import {
  resetSetupSandbox,
  SETUP_SANDBOX_CLI_TEST_CFG,
  SETUP_SANDBOX_DEFAULT_PERSIST_OUT_PATH,
  SETUP_SANDBOX_STATIC_RC_JSON,
  SETUP_SANDBOX_STATIC_RC_NAME
} from '../../fixtures/setup-sandbox';
import {
  expectCollectLogsFromMockInStdout, expectCollectNoLogsFromMockInStdout,
  expectCollectNotToCreateAReport
} from '../../utils/cli-expectations';
import { ERROR_UF_PATH_REQUIRED } from '../../fixtures/cli-errors';
import { readdirSync } from "fs";

const collectCommand = [CLI_PATH, 'collect', '-v', '--dryRun'];
const collectCommandStaticRc = [...collectCommand, `-p=./${SETUP_SANDBOX_STATIC_RC_NAME}`];

const ufStaticName = 'Sandbox Setup StaticDist';

describe('collect command in dryRun in setup sandbox', () => {
  beforeEach(() => {
    resetSetupSandbox();
  });
  afterEach(() => {
    resetSetupSandbox();
  });

  it('should load ufPath and execute the user-flow', async () => {
    const { exitCode, stdout, stderr } = await cliPromptTest(
      [...collectCommandStaticRc, `--ufPath=${SETUP_SANDBOX_STATIC_RC_JSON.collect.ufPath}`],
      [],
      SETUP_SANDBOX_CLI_TEST_CFG
    );

    expect(stderr).toBe('');
    expectCollectLogsFromMockInStdout(stdout, ufStaticName, SETUP_SANDBOX_STATIC_RC_JSON);
    expect(exitCode).toBe(0);

  }, 90_000);

});
