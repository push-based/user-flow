import { cliPromptTest } from '../utils/cli-prompt-test/cli-prompt-test';
import { CLI_PATH } from '../fixtures/cli-bin-path';
import { EMPTY_SANDBOX_CLI_TEST_CFG, resetEmptySandbox } from '../fixtures/empty-sandbox';
import { SANDBOX_PRESET } from '../../src/lib/pre-set';
import { expectGlobalOptionsToContain, expectInitCfgToContain } from '../utils/cli-expectations';
import { getGlobalOptionsFromArgv } from '../../src/lib/global/utils';
import { getInitCommandOptionsFromArgv } from '../../src/lib/commands/init/utils';

const initCommand = [CLI_PATH, 'init'];

describe('the CLI configuration', () => {
  beforeEach(async () => await resetEmptySandbox());
  afterEach(async () => await resetEmptySandbox());

  it('should have sandbox preset of global options in a fresh environment', async () => {
    const { exitCode, stdout, stderr } = await cliPromptTest(
      [
        ...initCommand,
      ],
      [],
      EMPTY_SANDBOX_CLI_TEST_CFG
    );
    const { collect, persist, assert } = getInitCommandOptionsFromArgv(SANDBOX_PRESET);


    expectGlobalOptionsToContain(stdout, getGlobalOptionsFromArgv(SANDBOX_PRESET));
    expectInitCfgToContain(stdout, { ...collect, ...persist, ...assert });
    expect(stderr).toBe('');
    expect(exitCode).toBe(0);
  });

  it('should have verbose false as default in a fresh environment', async () => {
    const { exitCode, stdout, stderr } = await cliPromptTest(
      initCommand,
      [],
      EMPTY_SANDBOX_CLI_TEST_CFG,
      'DEFAULT'
    );
    // verbose => no log as it is false by default
    expect(stdout).not.toContain('CLI Mode:  DEFAULT');
    expect(stderr).toBe('');
    expect(exitCode).toBe(0);
  });

  it('should have default preset in a fresh environment', async () => {
    const { exitCode, stdout, stderr } = await cliPromptTest(
      [
        //              overwrite verbose to get logs
        ...initCommand, '-v'
      ],
      [],
      EMPTY_SANDBOX_CLI_TEST_CFG,
      'DEFAULT'
    );

    const { collect, persist, assert } = getInitCommandOptionsFromArgv(SANDBOX_PRESET);

    expectGlobalOptionsToContain(stdout, getGlobalOptionsFromArgv(SANDBOX_PRESET));
    expectInitCfgToContain(stdout, { ...collect, ...persist, ...assert });
    expect(stderr).toBe('');
    expect(exitCode).toBe(0);
  });

});
