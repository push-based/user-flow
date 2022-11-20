import { cliPromptTest } from '../../utils/cli-prompt-test/cli-prompt-test';
import {
  CLI_PATH
} from '../../fixtures/cli-bin-path';
import {
  resetEmptySandbox, EMPTY_SANDBOX_CLI_TEST_CFG
} from '../../fixtures/empty-sandbox';

import {
  resetSetupSandboxAndKillPorts,
  SETUP_SANDBOX_CLI_TEST_CFG,
  SETUP_SANDBOX_DEFAULT_RC_JSON,
  SETUP_SANDBOX_DEFAULT_RC_NAME,
  SETUP_SANDBOX_DEFAULT_RC_PATH, SETUP_SANDBOX_STATIC_RC_JSON,
  SETUP_SANDBOX_STATIC_RC_NAME
} from '../../fixtures/setup-sandbox';

import {expectEnsureConfigToCreateRc, expectOutputRcInStdout} from '../../utils/cli-expectations';
import { ERROR_PERSIST_FORMAT_WRONG } from '../../../src/lib/commands/collect/options/format.constant';
import { PROMPT_COLLECT_URL } from '../../../src/lib/commands/collect/options/url.constant';

const initCommand = [CLI_PATH, 'init'];

describe('.rc.json in empty sandbox', () => {
  beforeEach(async () => resetEmptySandbox());
  afterEach(async () => resetEmptySandbox());

  it('should validate params from cli', async () => {

    const { exitCode, stdout, stderr } = await cliPromptTest(
      [
        ...initCommand,
        `--interactive=false`,
        `--url=`
      ],
      [],
      EMPTY_SANDBOX_CLI_TEST_CFG
    );

    // Assertions
    expect(stderr).toContain(`URL is required`);

    expect(exitCode).toBe(1);
  });

});
describe('.rc.json in setup sandbox', () => {
  beforeEach(async () => resetSetupSandboxAndKillPorts());
  afterEach(() => resetSetupSandboxAndKillPorts());

  it('should take params from cli', async () => {
    const { collect, persist } = SETUP_SANDBOX_STATIC_RC_JSON;
    const { url, ufPath, serveCommand, awaitServeStdout } = collect;
    let { outPath, format } = persist;
    let htmlFormat = format[0];

    const { exitCode, stdout, stderr } = await cliPromptTest(
      [
        ...initCommand,
        // collect
        `--url=${url}`,
        `--ufPath=${ufPath}`,
        `--serveCommand=${serveCommand}`,
        `--awaitServeStdout=${awaitServeStdout}`,
        // persist
        `--outPath=${outPath}`,
        `--format=${htmlFormat}`
      ],
      ['n'],
      SETUP_SANDBOX_CLI_TEST_CFG
    );

    // Assertions
    expect(stderr).toBe('');
    expectOutputRcInStdout(stdout, SETUP_SANDBOX_STATIC_RC_JSON);
    expect(exitCode).toBe(0);
  });

  it('should load default RC config name in a setup project', async () => {

    const { exitCode, stdout, stderr } = await cliPromptTest(
      initCommand,
      [],
      SETUP_SANDBOX_CLI_TEST_CFG
    );

    // Assertions
    expect(exitCode).toBe(0);
    expect(stderr).toBe('');
    expect(stdout).toContain(`Update config under ${SETUP_SANDBOX_DEFAULT_RC_NAME}`);
    expectOutputRcInStdout(stdout, SETUP_SANDBOX_DEFAULT_RC_JSON);
    expectEnsureConfigToCreateRc(SETUP_SANDBOX_DEFAULT_RC_PATH, SETUP_SANDBOX_DEFAULT_RC_JSON);
  });

  it('should load configuration if specified rc file param -p is given', async () => {
    const { exitCode, stdout, stderr } = await cliPromptTest(
      [...initCommand, `-p=${SETUP_SANDBOX_STATIC_RC_NAME}`],
      ['n'],
      SETUP_SANDBOX_CLI_TEST_CFG
    );

    const config = SETUP_SANDBOX_STATIC_RC_JSON;

    // Assertions
    expect(stderr).toBe('');
    expectOutputRcInStdout(stdout, config);
    expect(exitCode).toBe(0);
  });

  it('should validate params from rc', async () => {
    const wrongFormat = 'wrong';
    const { exitCode, stdout, stderr } = await cliPromptTest(
      [
        ...initCommand,
        `--interactive=false`,
        `--format=${wrongFormat}`
      ],
      [],
      SETUP_SANDBOX_CLI_TEST_CFG
    );

    // Assertions

    expect(stderr).toContain(ERROR_PERSIST_FORMAT_WRONG(wrongFormat));
    // expect(stdout).toBe('');
    expect(exitCode).toBe(1);
  });

  it('should log and ask if specified rc file param -p does not exist', async () => {
    const { exitCode, stdout, stderr } = await cliPromptTest(
      [...initCommand, `-p=wrong/path/to/file.json`],
      [],
      SETUP_SANDBOX_CLI_TEST_CFG
    );

    // Assertions
    expect(exitCode).toBe(0);
    expect(stderr).toBe('');
    expect(stdout).toContain(PROMPT_COLLECT_URL);
  });

});
