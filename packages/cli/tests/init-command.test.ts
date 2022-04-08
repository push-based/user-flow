import * as cliPromptTest from 'cli-prompts-test';

import { CLI_PATH } from './fixtures/cli-bin-path';
import { ENTER, UP, DOWN, SPACE } from './fixtures/keyboard';

import {
  EMPTY_SANDBOX_CLI_TEST_CFG,
  EMPTY_SANDBOX_RC_JSON__AFTER_ENTER_DEFAULTS, EMPTY_SANDBOX_RC_NAME__AFTER_ENTER_DEFAULTS,
  resetEmptySandbox
} from './fixtures/empty-sandbox';

import {
  resetSetupSandbox,
  SETUP_SANDBOX_CLI_TEST_CFG,
  SETUP_SANDBOX_DEFAULT_RC_JSON,
  SETUP_SANDBOX_DEFAULT_RC_PATH, SETUP_SANDBOX_STATIC_RC_JSON, SETUP_SANDBOX_STATIC_RC_PATH
} from './fixtures/setup-sandbox';

import {
  expectCollectToCreateRc,
  expectNoPromptsInStdout,
  expectOutputRcInStdout,
  expectPromptsInStdout
} from './utils/cli-expectations';

const initCommand = [CLI_PATH, 'init', '-v'];

describe('init command in setup sandbox', () => {

  beforeEach(() => {
    resetSetupSandbox();
  });
  afterEach(() => {
    resetSetupSandbox();
  });

  it('should inform about the already existing setup', async () => {

    const { exitCode, stdout, stderr } = await cliPromptTest(
      initCommand,
      [],
      SETUP_SANDBOX_CLI_TEST_CFG
    );

    // Assertions

    // STDOUT
    // prompts
    expectNoPromptsInStdout(stdout);
    // setup log
    expectOutputRcInStdout(stdout, SETUP_SANDBOX_DEFAULT_RC_JSON);

    expect(exitCode).toBe(0);
    expect(stderr).toBe('');

    // file output
    expectCollectToCreateRc(SETUP_SANDBOX_DEFAULT_RC_PATH, SETUP_SANDBOX_DEFAULT_RC_JSON);
  });

});

describe('init command in empty sandbox', () => {

  beforeEach(() => {
    resetEmptySandbox();
  });
  afterEach(() => {
    resetEmptySandbox();
  });

  it('should generate a valid rc.json if we accept suggested values', async () => {

    const { exitCode, stdout, stderr } = await cliPromptTest(
      initCommand,
      [
        //url
        EMPTY_SANDBOX_RC_JSON__AFTER_ENTER_DEFAULTS.collect.url, ENTER,
        // ufPath
        ENTER,
        // format
        SPACE, DOWN, SPACE, ENTER,
        // outPath
        ENTER,
      ],
      EMPTY_SANDBOX_CLI_TEST_CFG
    );

    // Assertions

    // STDOUT
    expect(stdout).toContain('.user-flowrc.json does not exist.');
    // prompts
    expectPromptsInStdout(stdout);
    // setup log
    expectOutputRcInStdout(stdout, EMPTY_SANDBOX_RC_JSON__AFTER_ENTER_DEFAULTS);
    expect(exitCode).toBe(0);
    expect(stderr).toBe('');

    expectCollectToCreateRc(EMPTY_SANDBOX_RC_NAME__AFTER_ENTER_DEFAULTS, EMPTY_SANDBOX_RC_JSON__AFTER_ENTER_DEFAULTS);
  });

  it('should generate a valid rc.json if we answer with custom values', async () => {
    const { collect, persist } = SETUP_SANDBOX_STATIC_RC_JSON;
    const { url, ufPath, awaitServeStdout, serveCommand } = collect;
    const { outPath } = persist;
    const { exitCode, stdout, stderr } = await cliPromptTest(
      initCommand,
      [
        // url
        url, ENTER,
        // ufPath
        ufPath, ENTER,
        // json format
        DOWN, DOWN, SPACE, ENTER,
        outPath, ENTER
      ],
      EMPTY_SANDBOX_CLI_TEST_CFG
    );

    expect(stderr).toBe('');
    expectPromptsInStdout(stdout);
    expect(exitCode).toBe(0);

    //
    expectCollectToCreateRc(SETUP_SANDBOX_DEFAULT_RC_PATH, SETUP_SANDBOX_STATIC_RC_JSON);

  }, 40_000);

});
