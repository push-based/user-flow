import { cliPromptTest } from '../utils/cli-prompt-test/cli-prompt-test';
import { CLI_PATH } from '../fixtures/cli-bin-path';
import { EMPTY_SANDBOX_CLI_TEST_CFG, resetEmptySandbox } from '../fixtures/empty-sandbox';
import { DEFAULT_PRESET, SANDBOX_PRESET } from '../../src/lib/global/rc-json/pre-set';
import { expectGlobalOptionsToContain, expectInitCfgToContain } from '../utils/cli-expectations';
import { GlobalOptionsArgv } from '../../src/lib/global/options/types';
import { InitOptionsArgv } from '../../src/lib/commands/init/options/types';
import { CollectOptions } from '../../src/lib/global/rc-json/types';
import { CollectArgvOptions } from '../../src/lib/commands/collect/options/types';
import { PROMPT_COLLECT_URL } from '../../src/lib/commands/collect/options/url.constant';

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
    const { rcPath, interactive, verbose, ...rest }: Partial<GlobalOptionsArgv> =  SANDBOX_PRESET;
    //@TODO add dryRun to test
    const { dryRun, ...initOptions } =  rest as any;
    const globalOptions = { rcPath, interactive, verbose };

    expectGlobalOptionsToContain(stdout, globalOptions);
    expectInitCfgToContain(stdout, initOptions);
    expect(stderr).toBe('');
    expect(exitCode).toBe(0);
  });

  it('should have verbose false as default in a fresh environment', async () => {
    const { exitCode, stdout, stderr } = await cliPromptTest(
      [
        ...initCommand
      ],
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

    const { rcPath, interactive, verbose, ...rest }: Partial<GlobalOptionsArgv> =  DEFAULT_PRESET;
    const { dryRun, ...initOptions } =  rest as any;
    const globalOptions = { rcPath, interactive };

    expectGlobalOptionsToContain(stdout, globalOptions);
    expectInitCfgToContain(stdout, initOptions);
    expect(stderr).toBe('');
    expect(exitCode).toBe(0);
  });

});
