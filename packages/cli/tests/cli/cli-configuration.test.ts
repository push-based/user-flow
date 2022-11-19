import { cliPromptTest } from '../utils/cli-prompt-test/cli-prompt-test';
import { CLI_PATH } from '../fixtures/cli-bin-path';
import {
  resetSetupSandboxAndKillPorts,
  SETUP_SANDBOX_CLI_TEST_CFG,
  SETUP_SANDBOX_DEFAULT_RC_JSON, SETUP_SANDBOX_DEFAULT_RC_NAME,
  SETUP_SANDBOX_PATH
} from '../fixtures/setup-sandbox';
import { EMPTY_SANDBOX_CLI_TEST_CFG, resetEmptySandbox } from '../fixtures/empty-sandbox';
import { expectGlobalOptionsToContain, expectInitCfgToContain } from '../utils/cli-expectations';
import * as path from 'path';
import { RcArgvOptions } from '@push-based/user-flow';
import { GlobalOptionsArgv } from '../../src/lib/global/options/types';
import { getEnvPreset } from '../../src/lib/global/rc-json/pre-set';
import { AssertOptions, CollectOptions, PersistOptions } from '../../src/lib/global/rc-json/types';
import { CollectArgvOptions } from '../../src/lib/commands/collect/options/types';

const initCommand = [CLI_PATH, 'init'];
const collectCommand = [CLI_PATH, 'collect'];

describe('the CLI configurations', () => {
  beforeEach(async () => {
    await resetEmptySandbox();
    await resetSetupSandboxAndKillPorts();
  });
  afterEach(async () => {
    await resetEmptySandbox();
    await resetSetupSandboxAndKillPorts();
  });

  it('should have default`s configured in a fresh environment', async () => {
    const { exitCode, stdout, stderr } = await cliPromptTest(
      [
        ...initCommand
      ],
      [],
      EMPTY_SANDBOX_CLI_TEST_CFG
    );
    //expect(stdout).toBe('');
    const cfg: Partial<GlobalOptionsArgv & RcArgvOptions> = getEnvPreset();
    expectGlobalOptionsToContain(stdout, cfg);
    expect(stderr).toBe('');
    expect(exitCode).toBe(0);
  });

  it('should read the existing .rc configuration', async () => {
    const { exitCode, stdout, stderr } = await cliPromptTest(
      [
        ...collectCommand
      ],
      [],
      SETUP_SANDBOX_CLI_TEST_CFG
    );
    const { collect, persist, assert } = SETUP_SANDBOX_DEFAULT_RC_JSON;
    const cfg = { ...collect, ...persist, ...assert } as CollectArgvOptions;
    expectInitCfgToContain(stdout, cfg);
    expect(stderr).toBe('');
    expect(exitCode).toBe(0);
  });

  it('should accept CLI params as configuration', async () => {
    const globalOptions: GlobalOptionsArgv = {
      verbose: true,
      interactive: true,
      rcPath: path.join(SETUP_SANDBOX_PATH, SETUP_SANDBOX_DEFAULT_RC_NAME)
    };

    const collect: CollectOptions = {
      url: 'xxx',
      ufPath: 'xxx',
      serveCommand: 'xxx',
      awaitServeStdout: 'xxx',
      dryRun: false
    };

    const persist: PersistOptions = {
      outPath: 'xxx',
      format: ['json', 'md'],
      openReport: true
    } as PersistOptions;

    const assert: AssertOptions = {};

    const { verbose, interactive, rcPath } = globalOptions;
    const { url, ufPath, serveCommand, awaitServeStdout, dryRun, openReport } = collect;
    let { outPath, format } = persist;

    const { exitCode, stdout, stderr } = await cliPromptTest(
      [
        ...initCommand,
        // global
        `--rcPath=${rcPath}`,
        `--interactive=${interactive}`,
        `--verbose=${verbose}`,
        // collect
        `--url=${url}`,
        `--ufPath=${ufPath}`,
        `--dryRun=${dryRun}`,
        `--serveCommand=${serveCommand}`,
        `--awaitServeStdout=${awaitServeStdout}`,
        // persist
        `--outPath=${outPath}`,
        `--format=${format[0]}`,
        `--format=${format[1]}`,
        `--openReport=${openReport}`
        // assert
      ],
      ['n'],
      SETUP_SANDBOX_CLI_TEST_CFG
    );

    const cfg = { ...collect, ...persist, ...assert } as CollectArgvOptions;
    expectInitCfgToContain(stdout, cfg);
    expect(stderr).toBe('');
    expect(exitCode).toBe(0);
  });

});
