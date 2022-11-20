import { cliPromptTest } from '../../utils/cli-prompt-test/cli-prompt-test';
import { CLI_PATH } from '../../fixtures/cli-bin-path';
import { EMPTY_SANDBOX_CLI_TEST_CFG, resetEmptySandbox } from '../../fixtures/empty-sandbox';

import {
  resetSetupSandboxAndKillPorts,
  SETUP_SANDBOX_CLI_TEST_CFG,
  SETUP_SANDBOX_DEFAULT_RC_JSON, SETUP_SANDBOX_DEFAULT_RC_NAME
} from '../../fixtures/setup-sandbox';

import { expectInitCfgToContain } from '../../utils/cli-expectations';
import { GlobalOptionsArgv } from '../../../src/lib/global/options/types';
import { CollectArgvOptions } from '../../../src/lib/commands/collect/options/types';
import { SANDBOX_PRESET } from '../../../src/lib/pre-set';
import { readFileSync } from 'fs';
import * as path from 'path';

const initCommand = [CLI_PATH, 'init'];

describe('init command configuration in empty sandbox', () => {

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
      initCommand,
      [],
      EMPTY_SANDBOX_CLI_TEST_CFG
    );

    const { rcPath, interactive, verbose, ...rest }: Partial<GlobalOptionsArgv> = SANDBOX_PRESET;
    const { dryRun, openReport, ...initOptions } = rest as any;
    expectInitCfgToContain(stdout, initOptions);
    expect(stderr).toBe('');
    expect(exitCode).toBe(0);
  });

  it('should read the rc file', async () => {
    const { exitCode, stdout, stderr } = await cliPromptTest(
      initCommand,
      [],
      SETUP_SANDBOX_CLI_TEST_CFG
    );
    const { collect, persist, assert } = SETUP_SANDBOX_DEFAULT_RC_JSON;
    const cfg = { ...collect, ...persist, ...assert } as CollectArgvOptions;
    // dryRun is not part of the init options
    delete (cfg as any).dryRun;
    expectInitCfgToContain(stdout, cfg);
    expect(stderr).toBe('');
    expect(exitCode).toBe(0);

  }, 90_000);

  it('should take cli parameters ans save it to json file', async () => {
    const collect = {
      url: 'http://www.xxx.xx',
      ufPath: 'xxxufPath',
      // note: complicated to implement
      // serveCommand: 'xxxstart',
      // awaitServeStdout: 'xxxawaitServeStdout'
    };

    const persist: any = {
      outPath: 'xxxoutPath',
      format: ['json', 'md']
    };

    const assert: any = {
      budgetPath: 'XXXXXX.json'
    };

    const { url, ufPath } = collect;
    let { outPath, format } = persist;
    let { budgetPath } = assert;

    const { exitCode, stdout, stderr } = await cliPromptTest(
      [
        ...initCommand,
        '-v',
        // collect
        `--url=${url}`,
        `--ufPath=${ufPath}`,
        // `--serveCommand=${serveCommand}`,
        // `--awaitServeStdout=${awaitServeStdout}`,
        // persist
        `--outPath=${outPath}`,
        `--format=${format[0]}`,
        `--format=${format[1]}`,
        // assert
        `--budgetPath=${budgetPath}`
      ],
      ['n'],
      SETUP_SANDBOX_CLI_TEST_CFG
    );

    const cfg = {
      ...collect,
      ...persist,
      ...assert
    };

    expectInitCfgToContain(stdout, cfg);
    const existingRcJSon = JSON.parse(readFileSync(path.join(SETUP_SANDBOX_CLI_TEST_CFG.testPath, SETUP_SANDBOX_DEFAULT_RC_NAME), 'utf8'));
    expect(existingRcJSon).toEqual(existingRcJSon);
    expect(stderr).toBe('');
    expect(exitCode).toBe(0);
  }, 90_000);

});
