import { cliPromptTest } from '../utils/cli-prompt-test/cli-prompt-test';
import { CLI_PATH } from '../fixtures/cli-bin-path';
import { SETUP_SANDBOX_CLI_TEST_CFG } from '../fixtures/setup-sandbox';
import { EMPTY_SANDBOX_CLI_TEST_CFG, resetEmptySandbox } from '../fixtures/empty-sandbox';
import { GlobalOptionsArgv } from '../../src/lib/global/options/types';
import { RcArgvOptions } from '@push-based/user-flow';
import { DEFAULT_PRESET, getEnvPreset, SANDBOX_PRESET } from '../../src/lib/global/rc-json/pre-set';
import { expectCfgToContain } from '../utils/cli-expectations';
import { CI_PROPERTY } from '../../src/lib/global/cli-mode/cli-mode';
import { setupEnvVars, teardownEnvVars } from '../utils/cli-mode';

const initCommand = [CLI_PATH, 'init'];

describe('the CLI should accept configurations comming from preset', () => {
  beforeEach(async () => resetEmptySandbox());
  afterEach(async () => resetEmptySandbox());

  it('should have sandbox preset in a fresh environment', async () => {
    const { exitCode, stdout, stderr } = await cliPromptTest(
      [
        ...initCommand
      ],
      [],
      EMPTY_SANDBOX_CLI_TEST_CFG
    );

    expectCfgToContain(stdout, SANDBOX_PRESET);
    expect(stderr).toBe('');
    expect(exitCode).toBe(0);
  });

  it('should have interactive as default in a fresh environment', async () => {
    const { exitCode, stdout, stderr } = await cliPromptTest(
      [
        ...initCommand
      ],
      [],
      EMPTY_SANDBOX_CLI_TEST_CFG
    );

    setupEnvVars('DEFAULT');
    expectCfgToContain(stdout, DEFAULT_PRESET);
    expect(stderr).toBe('');
    expect(exitCode).toBe(0);
  });

});
