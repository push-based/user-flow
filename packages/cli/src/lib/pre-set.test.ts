import { CI_PRESET, DEFAULT_PRESET, getEnvPreset, SANDBOX_PRESET } from './pre-set';
import { UserFlowCliProject, UserFlowCliProjectFactory, UserFlowProjectConfig } from '../../user-flow-testing';
import { EMPTY_PRJ_CFG } from '../../test-data/empty-prj';
let emptyPrjSandbox: UserFlowCliProject;

import { CI_PROPERTY, CLI_MODE_PROPERTY } from '../../src/lib/global/cli-mode/cli-mode';
import { CLI_MODES } from '../../src/lib/global/cli-mode/types';

function setupEnvVars(env: CLI_MODES): void {
  if (env === 'DEFAULT') {
    delete process.env[CI_PROPERTY];
  } else {
    process.env[CI_PROPERTY] = (env === 'CI' ? true : 'SANDBOX') as string;
  }
}

function teardownEnvVars() {
  delete process.env[CI_PROPERTY];
  delete process.env[CLI_MODE_PROPERTY];
}

const emptyPrjDefaultCfg: UserFlowProjectConfig = {
  ...EMPTY_PRJ_CFG,
  cliMode: 'DEFAULT'
};
let emptyPrjDefault: UserFlowCliProject;

describe('getEnvPreset', () => {

  afterEach(async () => {
    if (!emptyPrjSandbox) {
      emptyPrjSandbox = await UserFlowCliProjectFactory.create(EMPTY_PRJ_CFG);
    }
    await emptyPrjSandbox.setup();
    process.chdir(emptyPrjSandbox.root);
    setupEnvVars('SANDBOX')
  });
  afterEach(teardownEnvVars);

  it('should return default preset', () => {
    teardownEnvVars();
    expect(getEnvPreset()).toEqual(DEFAULT_PRESET);
  });

  // This will only pass run in CI
  it('should return CI preset in CI', () => {
    setupEnvVars('CI');
    expect(getEnvPreset()).toEqual(CI_PRESET);
  });

  it('should return sandbox preset if mode is configured', () => {
    setupEnvVars('SANDBOX');
    expect(getEnvPreset()).toEqual(SANDBOX_PRESET);
  });

});
