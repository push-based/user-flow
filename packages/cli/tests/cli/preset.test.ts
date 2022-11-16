import { cliPromptTest } from '../utils/cli-prompt-test/cli-prompt-test';
import { CLI_PATH } from '../fixtures/cli-bin-path';
import { EMPTY_SANDBOX_CLI_TEST_CFG, resetEmptySandbox } from '../fixtures/empty-sandbox';
import { DEFAULT_PRESET, SANDBOX_PRESET } from '../../src/lib/global/rc-json/pre-set';
import { expectCfgToContain } from '../utils/cli-expectations';

const initCommand = [CLI_PATH, 'init'];
const collectCommand = [CLI_PATH, 'collect'];

describe('the CLI should accept configurations comming from preset', () => {
  beforeEach(async () => resetEmptySandbox());
  afterEach(async () => resetEmptySandbox());

  it('should have sandbox preset in a fresh environment', async () => {
    const { exitCode, stdout, stderr } = await cliPromptTest(
      [
        ...collectCommand
      ],
      [],
      EMPTY_SANDBOX_CLI_TEST_CFG
    );
    //@TODO add dryRun to test
    const { dryRun, ...cfg } =  SANDBOX_PRESET;

    expectCfgToContain(stdout, cfg);
    expect(stderr).toBe('');
    expect(exitCode).toBe(0);
  });

  it('should have interactive as default in a fresh environment', async () => {
    const { exitCode, stdout, stderr } = await cliPromptTest(
      [
        ...initCommand
      ],
      [],
      EMPTY_SANDBOX_CLI_TEST_CFG,
      'DEFAULT'
    );


    expect(stdout).toBe('');
    expectCfgToContain(stdout, DEFAULT_PRESET);
    expect(stderr).toBe('');
    expect(exitCode).toBe(0);
  });

});
