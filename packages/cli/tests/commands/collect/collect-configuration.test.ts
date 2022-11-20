import { cliPromptTest } from '../../utils/cli-prompt-test/cli-prompt-test';
import { CLI_PATH } from '../../fixtures/cli-bin-path';
import { resetEmptySandbox } from '../../fixtures/empty-sandbox';

import {
  resetSetupSandboxAndKillPorts,
  SETUP_SANDBOX_CLI_TEST_CFG,
  SETUP_SANDBOX_DEFAULT_RC_JSON
} from '../../fixtures/setup-sandbox';

import { expectCollectCfgToContain } from '../../utils/cli-expectations';
import { GlobalOptionsArgv } from '../../../src/lib/global/options/types';
import { CollectArgvOptions } from '../../../src/lib/commands/collect/options/types';
import { SANDBOX_PRESET } from '../../../src/lib/pre-set';

const collectCommand = [CLI_PATH, 'collect'];

describe('collect command configuration in setup sandbox', () => {

  beforeEach(async () => {
    await resetEmptySandbox();
    await resetSetupSandboxAndKillPorts();
  });
  afterEach(async () => {
    await resetEmptySandbox();
    await resetSetupSandboxAndKillPorts();
  });

  it('should have default`s from preset', async () => {
    const { exitCode, stdout, stderr } = await cliPromptTest(
      collectCommand,
      [],
      SETUP_SANDBOX_CLI_TEST_CFG
    );

    const { rcPath, interactive, verbose, ...collectOptions }: Partial<GlobalOptionsArgv> = SANDBOX_PRESET;
    // @TODO implement format
    delete collectOptions['format'];
    expectCollectCfgToContain(stdout, collectOptions);
    expect(stderr).toBe('');
    expect(exitCode).toBe(0);
  });

  it('should read the rc file', async () => {
    const { exitCode, stdout, stderr } = await cliPromptTest(
      collectCommand,
      [],
      SETUP_SANDBOX_CLI_TEST_CFG
    );
    const { collect, persist, assert } = SETUP_SANDBOX_DEFAULT_RC_JSON;
    const cfg = { ...collect, ...persist, ...assert } as CollectArgvOptions;
    // dryRun is not part of the init options
    delete (cfg as any).dryRun;
    delete (cfg as any).format;
    expectCollectCfgToContain(stdout, cfg);
    expect(stderr).toBe('');
    expect(exitCode).toBe(0);

  }, 90_000);

  it('should take cli parameters', async () => {
    const collect = {
      url: 'http://www.xxx.xx',
      ufPath: 'xxxufPath',
      // note: complicated to implement
      // serveCommand: 'xxxstart',
      awaitServeStdout: 'xxxawaitServeStdout'
    };

    const persist: any = {
      outPath: 'xxxoutPath',
      format: ['json', 'md']
    };

    const assert: any = {
      budgetPath: 'XXXXXX.json'
    };

    const { url, ufPath, awaitServeStdout } = collect;
    // @TODO fix format
    let { outPath/*, format*/ } = persist;
    let { budgetPath } = assert;

    const { exitCode, stdout, stderr } = await cliPromptTest(
      [
        ...collectCommand,
        // collect
        `--url=${url}`,
        `--ufPath=${ufPath}`,
        // `--serveCommand=${serveCommand}`,
        `--awaitServeStdout=${awaitServeStdout}`,
        // persist
        `--outPath=${outPath}`,
        // `--format=${format[0]}`,
        // `--format=${format[1]}`,
        // assert
        `--budgetPath=${budgetPath}`
      ],
      ['n'],
      SETUP_SANDBOX_CLI_TEST_CFG
    );
    // @TODO format handling
    delete persist.format;

    const cfg = {
      ...collect,
      ...persist,
      ...assert
    };
    expectCollectCfgToContain(stdout, cfg);
    expect(stderr).toBe('');
    expect(exitCode).toBe(0);
  }, 90_000);

});

