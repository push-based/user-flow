import { cliPromptTest } from '../../utils/cli-prompt-test/cli-prompt-test';
import { CLI_PATH } from '../../fixtures/cli-bin-path';
import {
  EMPTY_SANDBOX_CLI_TEST_CFG,
  EMPTY_SANDBOX_RC_JSON__AFTER_ENTER_DEFAULTS, EMPTY_SANDBOX_RC_NAME__AFTER_ENTER_DEFAULTS,
  resetEmptySandbox
} from '../../fixtures/empty-sandbox';

import {
  resetSetupSandboxAndKillPorts,
  SETUP_SANDBOX_CLI_TEST_CFG,
  SETUP_SANDBOX_DEFAULT_RC_JSON,
  SETUP_SANDBOX_DEFAULT_RC_NAME,
  SETUP_SANDBOX_DEFAULT_RC_PATH,
  SETUP_SANDBOX_STATIC_RC_JSON,
  SETUP_SANDBOX_STATIC_RC_NAME
} from '../../fixtures/setup-sandbox';

import {
  expectEnsureConfigToCreateRc,
  expectOutputRcInStdout,
  expectPromptsOfInitInStdout
} from '../../utils/cli-expectations';
import { ERROR_PERSIST_FORMAT_WRONG } from '../../../src/lib/commands/collect/options/format.constant';
import { PROMPT_COLLECT_URL } from '../../../src/lib/commands/collect/options/url.constant';
import { ENTER } from '../../utils/cli-prompt-test/keyboard';
import * as path from 'path';

const initCommand = [CLI_PATH, 'init'];

describe('.rc.json in empty sandbox', () => {
  beforeEach(async () => {
    await resetEmptySandbox();
    await resetSetupSandboxAndKillPorts();
  });
  afterEach(async () => {
    await resetEmptySandbox();
    await resetSetupSandboxAndKillPorts();
  });

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
  beforeEach(async () => {
    await resetEmptySandbox();
    await resetSetupSandboxAndKillPorts();
  });
  afterEach(async () => {
    await resetEmptySandbox();
    await resetSetupSandboxAndKillPorts();
  });

  it('should take default params from prompt', async () => {

    const { exitCode, stdout, stderr } = await cliPromptTest(
      initCommand,
      [
        //url
        EMPTY_SANDBOX_RC_JSON__AFTER_ENTER_DEFAULTS.collect.url, ENTER,
        // ufPath
        ENTER,
        // HTML format
        ENTER,
        // outPath
        ENTER, ENTER,
        // create NO flow example
        'n'
      ],
      EMPTY_SANDBOX_CLI_TEST_CFG
    );

    // Assertions

    // STDOUT
    expect(stdout).toContain('.user-flowrc.json does not exist.');
    // prompts
    expectPromptsOfInitInStdout(stdout);
    // setup log
    expectOutputRcInStdout(stdout, EMPTY_SANDBOX_RC_JSON__AFTER_ENTER_DEFAULTS);
    expect(exitCode).toBe(0);
    expect(stderr).toBe('');

    expectEnsureConfigToCreateRc(path.join(EMPTY_SANDBOX_CLI_TEST_CFG?.cwd+'', EMPTY_SANDBOX_RC_NAME__AFTER_ENTER_DEFAULTS), EMPTY_SANDBOX_RC_JSON__AFTER_ENTER_DEFAULTS);
  });

  it('should take custom params from prompt', async () => {
    const { collect, persist } = SETUP_SANDBOX_STATIC_RC_JSON;
    const { url, ufPath } = collect;
    const { outPath } = persist;
    const { exitCode, stdout, stderr } = await cliPromptTest(
      initCommand,
      [
        // url
        url, ENTER,
        // ufPath
        ufPath, ENTER,
        // html default format
        ENTER,
        // measures default folder
        outPath, ENTER
      ],
      EMPTY_SANDBOX_CLI_TEST_CFG
    );

    expect(stderr).toBe('');
    expectPromptsOfInitInStdout(stdout);
    expect(exitCode).toBe(0);

    //
    expectEnsureConfigToCreateRc(path.join(EMPTY_SANDBOX_CLI_TEST_CFG?.cwd+'', EMPTY_SANDBOX_RC_NAME__AFTER_ENTER_DEFAULTS), {
      collect: {
        url,
        ufPath
      }, persist: { outPath, format: ['html'] }
    });

  }, 40_000);

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
