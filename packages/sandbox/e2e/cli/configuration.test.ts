import {
  UserFlowCliProject,
  UserFlowCliProjectFactory,
  UserFlowProjectConfig
} from '@push-based/user-flow-cli-testing';
import { expectGlobalOptionsToBeContainedInStdout, expectInitOptionsToBeContainedInStdout } from '../jest';
import { getGlobalOptionsFromArgv, getInitCommandOptionsFromArgv, SANDBOX_PRESET } from '@push-based/user-flow';
import { EMPTY_PRJ_CFG } from 'test-data';

let emptyPrjSandbox: UserFlowCliProject;

const emptyPrjDefaultCfg: UserFlowProjectConfig = {
  ...EMPTY_PRJ_CFG,
  cliMode: 'DEFAULT'
};
let emptyPrjDefault: UserFlowCliProject;

describe('the CLI configuration in default mode', () => {
  beforeEach(async () => {
    if (!emptyPrjSandbox) {
      emptyPrjSandbox = await UserFlowCliProjectFactory.create(EMPTY_PRJ_CFG);
    }
    await emptyPrjSandbox.setup();
  });
  afterEach(async () => {
    await emptyPrjSandbox.teardown();
  });

  it('should have sandbox preset of global options in a fresh environment', async () => {
    const { exitCode, stdout, stderr } = await emptyPrjSandbox.$init();
    const { collect, persist, assert } = getInitCommandOptionsFromArgv(SANDBOX_PRESET as any);
    // @NOTICE: format is not part of yargs params default values
    delete (persist as any).format;
    expectGlobalOptionsToBeContainedInStdout(stdout, getGlobalOptionsFromArgv(SANDBOX_PRESET));
    expectInitOptionsToBeContainedInStdout(stdout, { ...collect, ...persist, ...assert });
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
    const { collect, persist, assert } = getInitCommandOptionsFromArgv(SANDBOX_PRESET as any);

    expectGlobalOptionsToBeContainedInStdout(stdout, getGlobalOptionsFromArgv(SANDBOX_PRESET));
    // @NOTICE: format is not part of yargs params default values
    delete (persist as any).format;
    expectInitOptionsToBeContainedInStdout(stdout, { ...collect, ...persist, ...assert });
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
