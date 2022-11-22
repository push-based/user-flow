import { CLI_PATH } from '../../fixtures/cli-bin-path';
import { EMPTY_SANDBOX_CLI_TEST_CFG, resetEmptySandbox } from '../../fixtures/empty-sandbox';

import {
  resetSetupSandboxAndKillPorts,
  SETUP_SANDBOX_CLI_TEST_CFG,
  SETUP_SANDBOX_DEFAULT_RC_JSON,
  SETUP_SANDBOX_DEFAULT_RC_NAME
} from '../../fixtures/setup-sandbox';

import { expectInitCfgToContain } from '../../utils/cli-expectations';
import { GlobalOptionsArgv } from '../../../src/lib/global/options/types';
import { CollectArgvOptions } from '../../../src/lib/commands/collect/options/types';
import { SANDBOX_PRESET } from '../../../src/lib/pre-set';
import { readFileSync } from 'fs';
import * as path from 'path';
import { UserFlowCliProject } from '../../utils/cli-testing/user-flow-cli-project/user-flow-cli';

const emptyPrj = new UserFlowCliProject({
  root: EMPTY_SANDBOX_CLI_TEST_CFG.cwd as string,
  bin: CLI_PATH,
  rcFile: {}
});
const setupPrj = new UserFlowCliProject({
  root: SETUP_SANDBOX_CLI_TEST_CFG.cwd as string,
  bin: CLI_PATH
});


describe('init command configuration in empty sandbox', () => {

  beforeEach(async () => {
    await emptyPrj.setup();
    await resetSetupSandboxAndKillPorts();
  });
  afterEach(async () => {
    await emptyPrj.teardown();
    await resetSetupSandboxAndKillPorts();
  });

  it('should have default`s from preset', async () => {
    const { exitCode, stdout, stderr } = await emptyPrj.$init();

    const { rcPath, interactive, verbose, ...rest }: Partial<GlobalOptionsArgv> = SANDBOX_PRESET;
    const { dryRun, openReport, ...initOptions } = rest as any;
    expectInitCfgToContain(stdout, initOptions);
    expect(stderr).toBe('');
    expect(exitCode).toBe(0);
  });

  it('should read the rc file', async () => {
    const { exitCode, stdout, stderr } = await setupPrj.$init();
    const { collect, persist, assert } = SETUP_SANDBOX_DEFAULT_RC_JSON;
    const cfg = { ...collect, ...persist, ...assert } as CollectArgvOptions;
    // dryRun is not part of the init options
    delete (cfg as any).dryRun;
    expectInitCfgToContain(stdout, cfg);
    expect(stderr).toBe('');
    expect(exitCode).toBe(0);

  }, 90_000);

  it('should take cli parameters and save it to json file', async () => {
    const collect = {
      url: 'http://www.xxx.xx',
      ufPath: 'xxxufPath'
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

    const { exitCode, stdout, stderr } = await setupPrj.$init({
      // -- collect
      url,
      ufPath,
      // serveCommand,
      // awaitServeStdout,
      // -- persist
      outPath,
      format,
      // -- assert
      budgetPath
    },
      ['n']
    );

    const cfg = {
      ...collect,
      ...persist,
      ...assert
    };

    expectInitCfgToContain(stdout, cfg);
    const existingRcJSon = JSON.parse(readFileSync(path.join(SETUP_SANDBOX_CLI_TEST_CFG?.cwd+'', SETUP_SANDBOX_DEFAULT_RC_NAME), 'utf8'));
    expect(existingRcJSon).toEqual(existingRcJSon);
    expect(stderr).toBe('');
    expect(exitCode).toBe(0);
  }, 90_000);

});

