import { CLI_PATH } from '../../fixtures/cli-bin-path';
import { EMPTY_SANDBOX_CLI_TEST_CFG } from '../../fixtures/empty-sandbox';

import { SETUP_SANDBOX_CLI_TEST_CFG, SETUP_SANDBOX_DEFAULT_RC_NAME } from '../../fixtures/setup-sandbox';

import { oldExpectEnsureConfigToCreateRc, expectInitCfgToContain } from '../../utils/cli-expectations';
import { GlobalOptionsArgv } from '../../../src/lib/global/options/types';
import { CollectArgvOptions } from '../../../src/lib/commands/collect/options/types';
import { SANDBOX_PRESET } from '../../../src/lib/pre-set';
import { readFileSync } from 'fs';
import * as path from 'path';
import {
  UserFlowCliProject,
  UserFlowCliProjectFactory
} from '../../utils/cli-testing/user-flow-cli-project/user-flow-cli';
import { UserFlowProjectConfig } from '../../utils/cli-testing/user-flow-cli-project/types';
import { BASE_RC_JSON } from '../../utils/cli-testing/user-flow-cli-project/data/user-flowrc.base';
import { DEFAULT_FULL_RC_PATH } from '../../../src/lib/constants';

const emptyPrjCfg: UserFlowProjectConfig = {
  // @TODO implement custom options type and make cwd required
  root: EMPTY_SANDBOX_CLI_TEST_CFG.cwd as string,
  bin: CLI_PATH,
  rcFile: {}
};

let emptyPrj: UserFlowCliProject;


describe('init command configuration in empty sandbox', () => {

  beforeEach(async () => {
    if (!emptyPrj) {
      emptyPrj = await UserFlowCliProjectFactory.create(emptyPrjCfg);
    }
    await emptyPrj.setup();
  });

  afterEach(async () => {
    await emptyPrj.teardown();
  });

  it('should have default`s from preset', async () => {
    const { exitCode, stdout, stderr } = await emptyPrj.$init();

    const { rcPath, interactive, verbose, ...rest }: Partial<GlobalOptionsArgv> = SANDBOX_PRESET;
    const { dryRun, openReport, ...initOptions } = rest as any;
    expectInitCfgToContain(stdout, initOptions);
    expect(stderr).toBe('');
    expect(exitCode).toBe(0);
  });

});

const setupPrjCfg: UserFlowProjectConfig = {
  root: SETUP_SANDBOX_CLI_TEST_CFG.cwd as string,
  bin: CLI_PATH
};
let setupPrj: UserFlowCliProject;

describe('init command configuration in setup sandbox', () => {

  beforeEach(async () => {
    if (!setupPrj) {
      setupPrj = await UserFlowCliProjectFactory.create(setupPrjCfg);
    }
    await setupPrj.setup();
  });
  afterEach(async () => {
    await setupPrj.teardown();
  });

  it('should read the rc file', async () => {
    const { exitCode, stdout, stderr } = await setupPrj.$init();
    const { collect, persist, assert } = BASE_RC_JSON;
    const cfg = { ...collect, ...persist, ...assert } as CollectArgvOptions;
    // dryRun is not part of the init options
    delete (cfg as any).dryRun;
    // openReport is not part of the init options
    delete (cfg as any).openReport;
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
    oldExpectEnsureConfigToCreateRc(path.join(SETUP_SANDBOX_CLI_TEST_CFG?.cwd+'', DEFAULT_FULL_RC_PATH), cfg);
    expect(stderr).toBe('');
    expect(exitCode).toBe(0);
  }, 90_000);

});
