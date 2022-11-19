import { cliPromptTest } from '../../utils/cli-prompt-test/cli-prompt-test';
import { CLI_PATH } from '../../fixtures/cli-bin-path';
import { ENTER } from '../../utils/cli-prompt-test/keyboard';

import {
  EMPTY_SANDBOX_CLI_TEST_CFG,
  EMPTY_SANDBOX_RC_JSON__AFTER_ENTER_DEFAULTS, EMPTY_SANDBOX_RC_NAME__AFTER_ENTER_DEFAULTS,
  resetEmptySandbox
} from '../../fixtures/empty-sandbox';

import {
  resetSetupSandboxAndKillPorts,
  SETUP_SANDBOX_CLI_TEST_CFG,
  SETUP_SANDBOX_DEFAULT_RC_JSON,
  SETUP_SANDBOX_DEFAULT_RC_PATH, SETUP_SANDBOX_STATIC_RC_JSON
} from '../../fixtures/setup-sandbox';

import {
  expectEnsureConfigToCreateRc, expectGlobalOptionsToContain, expectInitCfgToContain,
  expectNoPromptsInStdout,
  expectOutputRcInStdout,
  expectPromptsOfInitInStdout
} from '../../utils/cli-expectations';

import * as path from 'path';
import { GlobalOptionsArgv } from '../../../src/lib/global/options/types';
import { RcArgvOptions } from '@push-based/user-flow';
import { getEnvPreset, SANDBOX_PRESET } from '../../../src/lib/pre-set';
import { getCLIGlobalConfigFromArgv } from '../../../src/lib/global/utils';

const initCommand = [CLI_PATH, 'init', '-v'];

describe('init command in empty sandbox', () => {

  beforeEach(async () => {
    resetEmptySandbox();
    resetSetupSandboxAndKillPorts();
  });
  afterEach(async () => {
    resetEmptySandbox();
    resetSetupSandboxAndKillPorts();
  });

  it('should have default`s configured over preset', async () => {
    const { exitCode, stdout, stderr } = await cliPromptTest(
      [
        ...initCommand
      ],
      [],
      EMPTY_SANDBOX_CLI_TEST_CFG
    );

    const { rcPath, interactive, verbose, ...rest } =  getCLIGlobalConfigFromArgv(SANDBOX_PRESET);
    //@TODO add dryRun to test
    const { dryRun, ...initOptions } =  rest as any;
    expectInitCfgToContain(stdout, initOptions);
    expect(stderr).toBe('');
    expect(exitCode).toBe(0);
  });

  it('should generate a valid rc.json if we accept suggested values', async () => {

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

    expectEnsureConfigToCreateRc(path.join(EMPTY_SANDBOX_CLI_TEST_CFG.testPath, EMPTY_SANDBOX_RC_NAME__AFTER_ENTER_DEFAULTS), EMPTY_SANDBOX_RC_JSON__AFTER_ENTER_DEFAULTS);
  });

  it('should generate a valid rc.json if we answer with custom values', async () => {
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
    expectEnsureConfigToCreateRc(path.join(EMPTY_SANDBOX_CLI_TEST_CFG.testPath, EMPTY_SANDBOX_RC_NAME__AFTER_ENTER_DEFAULTS), {
      collect: {
        url,
        ufPath
      }, persist: { outPath, format: ['html'] }
    });

  }, 40_000);

  it('should generate a user-flow for basic navigation after the CLI is setup', async () => {
    const { exitCode, stdout, stderr } = await cliPromptTest(
      initCommand,
      [
        // url
        ENTER,
        // ufPath
        ENTER,
        // html default format
        ENTER,
        ENTER
      ],
      EMPTY_SANDBOX_CLI_TEST_CFG
    );

    expect(stderr).toBe('');
    expectPromptsOfInitInStdout(stdout);

    expect(exitCode).toBe(0);

    //
    expectEnsureConfigToCreateRc(path.join(EMPTY_SANDBOX_CLI_TEST_CFG.testPath, EMPTY_SANDBOX_RC_NAME__AFTER_ENTER_DEFAULTS), EMPTY_SANDBOX_RC_JSON__AFTER_ENTER_DEFAULTS);

  }, 40_000);

});


describe('init command in setup sandbox', () => {

  beforeEach(async () => resetSetupSandboxAndKillPorts());
  afterEach(async () => resetSetupSandboxAndKillPorts());

  it('should inform about the already existing cli-setup', async () => {

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

    expect(stderr).toBe('');
    expect(exitCode).toBe(0);

    // file output
    expectEnsureConfigToCreateRc(SETUP_SANDBOX_DEFAULT_RC_PATH, SETUP_SANDBOX_DEFAULT_RC_JSON);
  });
  it('should throw missing url error', async () => {
    const { exitCode, stdout, stderr } = await cliPromptTest(
      [...initCommand, '--interactive=false', '--url='],
      [],
      SETUP_SANDBOX_CLI_TEST_CFG
    );
    expect(stderr).toContain('URL is required');
    expect(exitCode).toBe(1);

  }, 40_000);
});

