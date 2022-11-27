import { CLI_PATH } from '../fixtures/cli-bin-path';
import { EMPTY_SANDBOX_CLI_TEST_CFG } from '../fixtures/empty-sandbox';
import { SANDBOX_PRESET } from '../../src/lib/pre-set';
import { expectGlobalOptionsToContain, expectInitCfgToContain } from '../utils/cli-expectations';
import { getGlobalOptionsFromArgv } from '../../src/lib/global/utils';
import { getInitCommandOptionsFromArgv } from '../../src/lib/commands/init/utils';
import {
  UserFlowCliProject,
  UserFlowCliProjectFactory
} from '../utils/cli-testing/user-flow-cli-project/user-flow-cli';
import { UserFlowProjectConfig } from '../utils/cli-testing/user-flow-cli-project/types';
import { SETUP_SANDBOX_CLI_TEST_CFG } from '../fixtures/setup-sandbox';

const emptyPrjSandboxCfg: UserFlowProjectConfig = {
  root: EMPTY_SANDBOX_CLI_TEST_CFG.cwd as string,
  bin: CLI_PATH,
  rcFile: {}
};
let emptyPrjSandbox: UserFlowCliProject;

const emptyPrjDefaultCfg: UserFlowProjectConfig = {
  root: EMPTY_SANDBOX_CLI_TEST_CFG.cwd as string,
  bin: CLI_PATH,
  rcFile: {},
  cliMode: 'DEFAULT'
};
let emptyPrjDefault: UserFlowCliProject;


describe('the CLI configuration in default mode', () => {
  beforeEach(async () => {
    if (!emptyPrjSandbox) {
      emptyPrjSandbox = await UserFlowCliProjectFactory.create(emptyPrjSandboxCfg);
    }
    await emptyPrjSandbox.setup();
  });
  afterEach(async () => {
    await emptyPrjSandbox.teardown();
  });

  it('should have sandbox preset of global options in a fresh environment', async () => {
    const { exitCode, stdout, stderr } = await emptyPrjSandbox.$init();
    const { collect, persist, assert } = getInitCommandOptionsFromArgv(SANDBOX_PRESET);


    expectGlobalOptionsToContain(stdout, getGlobalOptionsFromArgv(SANDBOX_PRESET));
    expectInitCfgToContain(stdout, { ...collect, ...persist, ...assert });
    expect(stderr).toBe('');
    expect(exitCode).toBe(0);
  });

});

describe('the CLI configuration in default mode', () => {

  beforeEach(async () => {
    if (!emptyPrjDefault) {
      emptyPrjDefault = await UserFlowCliProjectFactory.create(emptyPrjDefaultCfg);
    }
    await emptyPrjDefault.setup();
  });
  afterEach(async () => {
    await emptyPrjDefault.teardown();
  });


  it('should have default preset in a fresh environment', async () => {
    const { exitCode, stdout, stderr } = await emptyPrjDefault.$init({ verbose: true });
    const { collect, persist, assert } = getInitCommandOptionsFromArgv(SANDBOX_PRESET);

    expectGlobalOptionsToContain(stdout, getGlobalOptionsFromArgv(SANDBOX_PRESET));
    expectInitCfgToContain(stdout, { ...collect, ...persist, ...assert });
    expect(stderr).toBe('');
    expect(exitCode).toBe(0);
  });


  it('should have verbose false as default in a fresh environment', async () => {

    const { exitCode, stdout, stderr } = await emptyPrjDefault.$init();
    // verbose => no log as it is false by default
    expect(stdout).not.toContain('CLI Mode:  DEFAULT');
    expect(stderr).toBe('');
    expect(exitCode).toBe(0);
  });


});
